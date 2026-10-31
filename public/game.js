// Masterpiece Jigsaw: game, rendering, menu and table sync.
// Multiplayer uses window.claude.use('room'): the real service on claude.ai,
// or shim-local-room.js talking to server.js when run locally.

import { PAINTINGS } from './paintings.js';

(() => {
// Image sources: files in images/ when served, or data URIs baked in by `npm run build`.
const IMAGES = window.MJ_IMAGES || Object.fromEntries(PAINTINGS.map(p => [p.id, { src: 'images/' + p.id + '.jpg' }]));

const BY_ID = Object.fromEntries(PAINTINGS.map(p => [p.id, p]));

const LEVELS = {
  easy:   { key: 'easy',   name: 'Easy',   target: 16 },
  medium: { key: 'medium', name: 'Medium', target: 36 },
  hard:   { key: 'hard',   name: 'Hard',   target: 100, blur: true }
};
const AVATAR_COLORS = ['#b4503a', '#a8740f', '#4f8a3a', '#257a74', '#3b68ad', '#7656a8', '#ad4677', '#5c6470'];

const PAD = 0.34;          // room around each piece for tabs, in piece units
const SNAP = 0.28;         // how close (piece units) a piece must be to settle in
const M = 16;              // table margin, px

const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const tableEl = document.getElementById('table');
const hitCtx = document.createElement('canvas').getContext('2d');
const $ = id => document.getElementById(id);

const store = {
  get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
};
const cleanName = s => String(s == null ? '' : s)
  .replace(/[\u0000-\u001f\u007f-\u009f­​-‏‪-‮⁠-⁯﻿]/g, '')
  .replace(/\s+/g, ' ').trim().slice(0, 18);
const colorAt = i => AVATAR_COLORS[(Number.isInteger(i) && i >= 0 && i < AVATAR_COLORS.length) ? i : 7];

const loaded = {};
function loadImage(id) {
  if (loaded[id]) return Promise.resolve(loaded[id]);
  const im = new Image(); im.src = IMAGES[id].src;
  return (im.decode ? im.decode() : new Promise(r => { im.onload = r; }))
    .catch(() => new Promise(r => { if (im.complete) r(); else im.onload = r; }))
    .then(() => (loaded[id] = im));
}

/* ---------- game state ---------- */
let level = null, round = 0, dealer = '';
let art = PAINTINGS[0], pic = null;
let COLS = 4, ROWS = 4, pieces = [], byId = [], edgeStr = '';
let W = 0, H = 0, dpr = 1, topInset = 0;
let board = { x: 0, y: 0, w: 0, h: 0 }, s = 1;
let ghost = true, sound = true;
let drag = null, flashes = [];
let finishT0 = 0, done = false;
let started = false, t0 = 0, elapsed = 0;
let colors = {};
let queue = [], finished = new Set();
let me = { name: cleanName(store.get('mj.name')), color: +(store.get('mj.color') || 0) };
if (!Number.isInteger(me.color) || me.color < 0 || me.color >= AVATAR_COLORS.length) me.color = 0;

/* ---------- table (multiplayer) state ---------- */
let roomNS = null, table = null, tableCode = '', peersList = [], spectator = false, joining = null;
let mySince = 0, isCreator = false;
const roomReady = (window.claude && typeof window.claude.use === 'function')
  ? window.claude.use('room').then(r => (roomNS = r), () => null)
  : Promise.resolve(null);

/* ---------- piece geometry ---------- */
const TAB = [
  ['L', 0.34, 0],
  ['C', 0.40, 0, 0.42, -0.04, 0.39, -0.10],
  ['C', 0.34, -0.22, 0.42, -0.30, 0.50, -0.30],
  ['C', 0.58, -0.30, 0.66, -0.22, 0.61, -0.10],
  ['C', 0.58, -0.04, 0.60, 0, 0.66, 0],
  ['L', 1, 0]
];
function addEdge(path, P, Q, d) {
  if (!d) { path.lineTo(Q[0], Q[1]); return; }
  const vx = Q[0] - P[0], vy = Q[1] - P[1], ox = vy, oy = -vx;
  const pt = (t, n) => [P[0] + vx * t - ox * n * d, P[1] + vy * t - oy * n * d];
  for (const seg of TAB) {
    if (seg[0] === 'L') { const a = pt(seg[1], seg[2]); path.lineTo(a[0], a[1]); }
    else {
      const a = pt(seg[1], seg[2]), b = pt(seg[3], seg[4]), c = pt(seg[5], seg[6]);
      path.bezierCurveTo(a[0], a[1], b[0], b[1], c[0], c[1]);
    }
  }
}
function piecePath(e) {
  const p = new Path2D(), C = [[0,0],[1,0],[1,1],[0,1]];
  p.moveTo(0, 0);
  for (let i = 0; i < 4; i++) addEdge(p, C[i], C[(i + 1) % 4], e[i]);
  p.closePath();
  return p;
}

// Pick a grid close to the level's piece count with nearly square pieces,
// then crop the painting (centred) to exactly that grid's proportions.
function gridFor(im, target) {
  const a = im.naturalWidth / im.naturalHeight;
  const rows = Math.max(2, Math.round(Math.sqrt(target / a)));
  const cols = Math.max(2, Math.round(target / rows));
  return { cols, rows };
}
function cropTo(im, cols, rows) {
  const want = cols / rows, iw = im.naturalWidth, ih = im.naturalHeight;
  let sw = iw, sh = ih;
  if (iw / ih > want) sw = ih * want; else sh = iw / want;
  const c = document.createElement('canvas');
  c.width = Math.round(sw); c.height = Math.round(sh);
  c.getContext('2d').drawImage(im, (iw - sw) / 2, (ih - sh) / 2, sw, sh, 0, 0, c.width, c.height);
  return c;
}

// edges: string of '0'/'1', first ROWS*COLS for horizontal joins, then ROWS*COLS for vertical.
const randomEdges = n => Array.from({ length: 2 * n }, () => Math.random() < 0.5 ? '1' : '0').join('');
function build(es) {
  edgeStr = es;
  const n = ROWS * COLS;
  const h = (r, c) => es[r * COLS + c] === '1' ? 1 : -1;
  const v = (r, c) => es[n + r * COLS + c] === '1' ? 1 : -1;
  pieces = []; byId = [];
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    const e = [
      r === 0 ? 0 : -h(r - 1, c),
      c === COLS - 1 ? 0 : v(r, c),
      r === ROWS - 1 ? 0 : h(r, c),
      c === 0 ? 0 : -v(r, c - 1)
    ];
    const p = { id: r * COLS + c, r, c, e, path: piecePath(e), x: 0, y: 0, locked: false, canvas: null };
    pieces.push(p); byId.push(p);
  }
}

function renderPiece(p) {
  const px = s * dpr, size = Math.ceil((1 + 2 * PAD) * px);
  const cnv = p.canvas || (p.canvas = document.createElement('canvas'));
  cnv.width = cnv.height = size;
  const g = cnv.getContext('2d');
  g.setTransform(px, 0, 0, px, PAD * px, PAD * px);
  g.save();
  g.clip(p.path);
  const iw = pic.width / COLS, ih = pic.height / ROWS;
  g.drawImage(pic, (p.c - PAD) * iw, (p.r - PAD) * ih, (1 + 2 * PAD) * iw, (1 + 2 * PAD) * ih,
              -PAD, -PAD, 1 + 2 * PAD, 1 + 2 * PAD);
  g.lineWidth = 3 / px; g.strokeStyle = 'rgba(25,15,0,.38)'; g.stroke(p.path);
  g.translate(-0.9 / px, -0.9 / px);
  g.lineWidth = 1.4 / px; g.strokeStyle = 'rgba(255,244,215,.30)'; g.stroke(p.path);
  g.restore();
  // loose sprite: the same piece with its soft resting shadow baked in (canvas
  // shadows are slow, so they are drawn once here rather than every frame)
  const m = Math.ceil(8 * dpr), L = size + 2 * m;
  const lc = p.loose || (p.loose = document.createElement('canvas'));
  lc.width = lc.height = L;
  const lg = lc.getContext('2d');
  lg.shadowColor = 'rgba(0,0,0,.24)'; lg.shadowBlur = 5 * dpr; lg.shadowOffsetY = 2 * dpr;
  lg.drawImage(cnv, m, m);
  p.looseM = m;
}

/* ---------- blurred guide ---------- */
let blurCache = null;
function blurGuide() {
  if (blurCache) return blurCache;
  const step = (src, w, h) => { const c = document.createElement('canvas'); c.width = w; c.height = h;
    const g = c.getContext('2d'); g.imageSmoothingQuality = 'high'; g.drawImage(src, 0, 0, w, h); return c; };
  const a = pic.width / pic.height;
  const tiny = step(pic, Math.max(3, Math.round(5 * a)), 5);
  return (blurCache = step(step(tiny, Math.round(40 * a), 40), Math.round(160 * a), 160));
}

/* ---------- layout ---------- */
function readColors() {
  const cs = getComputedStyle(document.documentElement);
  colors = {
    slot: cs.getPropertyValue('--slot').trim(),
    edge: cs.getPropertyValue('--slot-edge').trim(),
    varnish: cs.getPropertyValue('--varnish').trim(),
    panel: cs.getPropertyValue('--panel').trim(),
    ink: cs.getPropertyValue('--ink').trim()
  };
}

function layout() {
  const r = tableEl.getBoundingClientRect();
  W = Math.max(1, r.width); H = Math.max(1, r.height);
  dpr = Math.min(2, window.devicePixelRatio || 1);
  cv.width = Math.round(W * dpr); cv.height = Math.round(H * dpr);
  cv.style.width = W + 'px'; cv.style.height = H + 'px';
  const pl = $('players');
  topInset = pl.hidden ? 0 : pl.offsetHeight + 10;
  const wide = W >= H * 1.05;
  const maxW = wide ? (W - 2 * M) * 0.56 : W - 2 * M;
  // keep a strip under the board free for the hint and, once finished, the next-painting bar
  const bottomInset = 56;
  const maxH = wide ? H - 2 * M - topInset - bottomInset : (H - 2 * M - topInset) * 0.56;
  s = Math.max(12, Math.min(maxW / COLS, maxH / ROWS));
  board.w = COLS * s; board.h = ROWS * s;
  board.x = (W - board.w) / 2;
  board.y = wide ? Math.max(M + topInset, (H - bottomInset + topInset - board.h) / 2) : M + 4 + topInset;
  if (pic) pieces.forEach(renderPiece);
  pieces.forEach(p => { if (!p.locked) clamp(p); });
  updateAfter();
}

function clampXY(p) { clamp(p); }
function clamp(p) {
  const minX = (M - board.x) / s, maxX = (W - M - board.x) / s - 1;
  const minY = (M - board.y) / s, maxY = (H - M - board.y) / s - 1;
  p.x = Math.min(Math.max(p.x, minX), Math.max(minX, maxX));
  p.y = Math.min(Math.max(p.y, minY), Math.max(minY, maxY));
}

function scatter(list) {
  const placed = [];
  const bx0 = board.x - s * 0.55, by0 = board.y - s * 0.55, bx1 = board.x + board.w + s * 0.55, by1 = board.y + board.h + s * 0.55;
  const yTop = M + topInset + s * PAD;
  for (const p of list) {
    let best = null, bestD = -1;
    for (let i = 0; i < 90; i++) {
      const x = M + s * PAD + Math.random() * Math.max(1, W - 2 * M - s * (1 + 2 * PAD));
      const y = yTop + Math.random() * Math.max(1, H - M - yTop - s * (1 + PAD));
      if (x + s > bx0 && x < bx1 && y + s > by0 && y < by1) continue;
      let d = Infinity;
      for (const q of placed) d = Math.min(d, Math.hypot(q[0] - x, q[1] - y));
      if (d > bestD) { bestD = d; best = [x, y]; }
      if (d > s * 1.25) break;
    }
    if (!best) best = [M + Math.random() * (W - 2 * M - s), M + Math.random() * (H - 2 * M - s)];
    placed.push(best);
    p.x = (best[0] - board.x) / s; p.y = (best[1] - board.y) / s;
  }
  for (let i = pieces.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
  }
  pieces.sort((a, b) => b.locked - a.locked);
}

/* ---------- drawing ---------- */
let rafId = 0;
function request() { if (!rafId) rafId = requestAnimationFrame(frame); }
let lastFrame = 0;
function frame(now) {
  rafId = 0;
  const dt = Math.min(0.1, lastFrame ? (now - lastFrame) / 1000 : 0.016);
  lastFrame = now;
  const moving = glide(dt);
  draw(now);
  if (moving || flashes.length || (done && now - finishT0 < 1000)) request(); else lastFrame = 0;
}
// Remote pieces and pointers ease toward the latest position they were sent,
// so updates arriving ~30 times a second still move at the screen's frame rate.
const EASE = 0.055;                      // seconds; smaller follows more tightly
const remoteCur = new Map();             // peer -> { x, y, tx, ty }
function glide(dt) {
  const k = 1 - Math.exp(-dt / EASE);
  let moving = false;
  for (const p of byId) {
    if (p.tx === undefined) continue;
    if (p.locked || (drag && drag.p === p)) { p.tx = p.ty = undefined; continue; }
    p.x += (p.tx - p.x) * k; p.y += (p.ty - p.y) * k;
    if (Math.abs(p.tx - p.x) < 0.002 && Math.abs(p.ty - p.y) < 0.002) { p.x = p.tx; p.y = p.ty; p.tx = p.ty = undefined; }
    else moving = true;
  }
  for (const c of remoteCur.values()) {
    if (c.x === c.tx && c.y === c.ty) continue;
    c.x += (c.tx - c.x) * k; c.y += (c.ty - c.y) * k;
    if (Math.abs(c.tx - c.x) < 0.002 && Math.abs(c.ty - c.y) < 0.002) { c.x = c.tx; c.y = c.ty; } else moving = true;
  }
  return moving;
}
function glideTo(p, x, y) { p.tx = x; p.ty = y; request(); }
function rr(x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawPiece(p, lifted, g = ctx) {
  const x = board.x + p.x * s - PAD * s, y = board.y + p.y * s - PAD * s, sz = (1 + 2 * PAD) * s;
  if (p.locked) { g.drawImage(p.canvas, x, y, sz, sz); return; }
  if (!lifted) {
    const f = sz / p.canvas.width, m = p.looseM * f;
    ctx.drawImage(p.loose, x - m, y - m, sz + 2 * m, sz + 2 * m);
    return;
  }
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,' + (lifted ? .34 : .24) + ')';
  ctx.shadowBlur = lifted ? 18 : 5;
  ctx.shadowOffsetY = lifted ? 9 : 2;
  if (lifted) {
    const cx = x + sz / 2, cy = y + sz / 2;
    ctx.translate(cx, cy); ctx.scale(1.04, 1.04); ctx.translate(-cx, -cy);
  }
  ctx.drawImage(p.canvas, x, y, sz, sz);
  ctx.restore();
}
// The board, its guide and every placed piece only change when a piece settles,
// so they are drawn once into a background layer and reused every frame.
const bg = document.createElement('canvas'), bgCtx = bg.getContext('2d');
let bgKey = '', picSeq = 0;
function drawBackground() {
  if (!pic._v) pic._v = ++picSeq;
  const placed = pieces.reduce((n, p) => n + (p.locked ? 1 : 0), 0);
  const key = [W, H, dpr, s, board.x, board.y, pic._v, COLS, ROWS, placed, ghost, done, level ? level.key : '', colors.slot, colors.varnish].join('|');
  if (key === bgKey) return;
  bgKey = key;
  bg.width = cv.width; bg.height = cv.height;
  const g = bgCtx, { x, y, w, h } = board;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.clearRect(0, 0, W, H);
  g.beginPath();
  const r = 6, bx = x - 8, by = y - 8, bw = w + 16, bh = h + 16;
  g.moveTo(bx + r, by); g.arcTo(bx + bw, by, bx + bw, by + bh, r); g.arcTo(bx + bw, by + bh, bx, by + bh, r);
  g.arcTo(bx, by + bh, bx, by, r); g.arcTo(bx, by, bx + bw, by, r); g.closePath();
  g.strokeStyle = colors.varnish; g.globalAlpha = .45; g.lineWidth = 1; g.stroke(); g.globalAlpha = 1;
  g.fillStyle = colors.slot; g.fillRect(x, y, w, h);
  g.strokeStyle = colors.edge; g.lineWidth = 2; g.strokeRect(x + 1, y + 1, w - 2, h - 2);
  if (level && !done) {
    // Guide on (Easy and Medium): a faint copy of the painting.
    // Guide off, and always on Hard: a heavy blur with broad colour areas only.
    const blurred = level.blur || !ghost;
    g.globalAlpha = blurred ? .5 : .2;
    g.drawImage(blurred ? blurGuide() : pic, x, y, w, h);
    g.globalAlpha = 1;
  }
  for (const p of pieces) if (p.locked) drawPiece(p, false, g);
}
function draw(now = performance.now()) {
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.clearRect(0, 0, cv.width, cv.height);
  // Nothing on the table while the main menu is up: it sits behind the menu's
  // slightly see-through veil and would show through as a stray box.
  if (!pic || !level) return;
  drawBackground();
  ctx.drawImage(bg, 0, 0);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  const { x, y, w, h } = board;
  if (done) {
    ctx.globalAlpha = Math.min(1, (now - finishT0) / 900);
    ctx.drawImage(pic, x, y, w, h); ctx.globalAlpha = 1;
  }
  for (const p of pieces) if (!p.locked && p !== (drag && drag.p)) drawPiece(p, !!p.heldBy);
  if (drag) drawPiece(drag.p, true);

  flashes = flashes.filter(f => now - f.t < 650);
  for (const f of flashes) {
    const k = 1 - (now - f.t) / 650;
    ctx.save();
    ctx.translate(board.x + f.p.x * s, board.y + f.p.y * s); ctx.scale(s, s);
    ctx.lineWidth = 3 / s; ctx.strokeStyle = f.color || colors.varnish; ctx.globalAlpha = k * .9;
    ctx.stroke(f.p.path);
    ctx.restore();
  }

  // friends' pointers, each in their avatar colour with their name
  if (table) {
    ctx.font = '600 11px Karla, system-ui, sans-serif';
    for (const pr of peersList) {
      if (pr.sameTab || pr.kind !== 'viewer') continue;
      const c = remoteCur.get(pr.peer);
      if (!c || pr.presence.rd !== round) continue;
      const cx = board.x + c.x * s, cy = board.y + c.y * s;
      if (cx < -20 || cy < -20 || cx > W + 20 || cy > H + 20) continue;
      const col = colorAt(pr.presence.c), nm = cleanName(pr.presence.name) || 'Friend';
      ctx.beginPath(); ctx.arc(cx, cy, 6, 0, Math.PI * 2);
      ctx.fillStyle = col; ctx.fill(); ctx.lineWidth = 2; ctx.strokeStyle = '#fff'; ctx.stroke();
      const tw = ctx.measureText(nm).width;
      rr(cx + 9, cy + 6, tw + 12, 18, 9); ctx.fillStyle = col; ctx.fill();
      ctx.fillStyle = '#fff'; ctx.fillText(nm, cx + 15, cy + 19);
    }
  }
}

/* ---------- sound ---------- */
let ac = null;
function audio() {
  if (!sound) return null;
  try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === 'suspended') ac.resume(); } catch (e) { ac = null; }
  return ac;
}
function tone(freq, start, dur, vol, type = 'sine') {
  const a = audio(); if (!a) return;
  const o = a.createOscillator(), g = a.createGain(), t = a.currentTime + start;
  o.type = type; o.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination); o.start(t); o.stop(t + dur + 0.05);
}
const clickSnd = () => { tone(420 + Math.random() * 60, 0, 0.16, 0.09, 'triangle'); tone(840, 0, 0.06, 0.03); };
const chime = () => { [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => tone(f, i * 0.16, 1.6, 0.06)); };

/* ---------- timer + stats ---------- */
const fmt = ms => { const t = Math.floor(ms / 1000); return Math.floor(t / 60) + ':' + String(t % 60).padStart(2, '0'); };
function tick() { $('clock').textContent = fmt(elapsed + (started && !done ? performance.now() - t0 : 0)); }
function stats() {
  const n = pieces.filter(p => p.locked).length;
  $('placed').textContent = n; $('total').textContent = pieces.length;
  return n;
}

/* ---------- input ---------- */
function toLocal(e) { const r = cv.getBoundingClientRect(); return [e.clientX - r.left, e.clientY - r.top]; }
function hit(px, py) {
  for (let i = pieces.length - 1; i >= 0; i--) {
    const p = pieces[i]; if (p.locked) continue;
    const u = (px - board.x) / s - p.x, v = (py - board.y) / s - p.y;
    if (u < -PAD || v < -PAD || u > 1 + PAD || v > 1 + PAD) continue;
    if (hitCtx.isPointInPath(p.path, u, v)) return i;
  }
  return -1;
}
function toTop(p) { const i = pieces.indexOf(p); if (i >= 0) { pieces.splice(i, 1); pieces.push(p); } }
function startClock() { if (!started && !done) { started = true; t0 = performance.now(); } }

// While you drag, the piece's position rides in your presence ("drag"), which the
// room shares about 30 times a second. The final spot is also sent as a "move"
// event on drop, so a friend who missed a presence update still ends up right.
function sendMove(p) {
  if (!table) return;
  emitT('move', { r: round, i: p.id, x: Math.round(p.x * 100), y: Math.round(p.y * 100) });
}
const pos = (px, py) => [Math.round((px - board.x) / s * 100) / 100, Math.round((py - board.y) / s * 100) / 100];
function sharePointer(px, py) {
  if (!table || !level) return;
  const patch = { cur: pos(px, py), rd: round };
  patch.drag = drag ? [drag.p.id, Math.round(drag.p.x * 100), Math.round(drag.p.y * 100)] : null;
  table.presence(patch).catch(() => {});
}

cv.addEventListener('pointerdown', e => {
  if (done || !level || !pic || spectator) return;
  const [px, py] = toLocal(e), i = hit(px, py);
  if (i < 0) return;
  const p = pieces[i]; toTop(p);
  p.tx = p.ty = undefined;
  drag = { p, dx: (px - board.x) / s - p.x, dy: (py - board.y) / s - p.y, id: e.pointerId };
  sharePointer(px, py);
  cv.setPointerCapture(e.pointerId);
  cv.style.cursor = 'grabbing';
  startClock();
  audio();
  request();
});
cv.addEventListener('pointermove', e => {
  const [px, py] = toLocal(e);
  if (!drag) { sharePointer(px, py); cv.style.cursor = !done && level && !spectator && hit(px, py) >= 0 ? 'grab' : 'default'; return; }
  if (e.pointerId !== drag.id) return;
  drag.p.x = (px - board.x) / s - drag.dx; drag.p.y = (py - board.y) / s - drag.dy;
  sharePointer(px, py);
  request();
});
cv.addEventListener('pointerleave', () => { if (table && !drag) table.presence({ cur: null }).catch(() => {}); });

function lockPiece(p, color) {
  p.x = p.c; p.y = p.r; p.locked = true; p.tx = p.ty = undefined; p.heldBy = null;
  const i = pieces.indexOf(p); if (i >= 0) { pieces.splice(i, 1); pieces.unshift(p); }
  flashes.push({ p, t: performance.now(), color });
  clickSnd();
  $('hint').classList.add('gone');
  if (stats() === pieces.length && !done) finish();
  request();
}
function release(e) {
  if (!drag || e.pointerId !== drag.id) return;
  const p = drag.p; drag = null; cv.style.cursor = 'grab';
  if (table) table.presence({ drag: null }).catch(() => {});
  if (Math.hypot(p.x - p.c, p.y - p.r) < SNAP) {
    lockPiece(p);
    emitT('lock', { r: round, i: p.id });
  } else { clamp(p); sendMove(p); }
  request();
}
cv.addEventListener('pointerup', release);
cv.addEventListener('pointercancel', release);

/* ---------- cards ---------- */
const CARDS = ['infoCard', 'galleryCard', 'inviteCard', 'kickCard', 'switchCard', 'exitCard'];

/* ---------- exit to main menu ---------- */
// Leaving drops you from the table and ends your puzzle, so it asks first when
// there's progress to lose or friends at the table. Friends keep playing; if you
// led the table, the next person takes over.
function askExit() {
  const placed = pieces.filter(p => p.locked).length;
  const others = table ? visible().filter(p => !p.sameTab).length : 0;
  if (!others && (placed === 0 || done)) { exitToMenu(); return; }
  closeCards();
  const parts = [];
  if (placed && !done) parts.push((others ? 'Your table has' : 'You\u2019ve') + ' placed ' + placed + ' of ' + pieces.length + ' pieces of ' + art.title + '.');
  if (others) parts.push((others === 1 ? 'Your friend keeps' : 'Your ' + others + ' friends keep') + ' playing' +
    (amHost() ? ', and the next person takes over as leader.' : ' without you.') +
    ' You can rejoin with the table code ' + tableCode.toUpperCase() + '.');
  else parts.push('Your puzzle won\u2019t be saved.');
  $('exitNote').textContent = parts.join(' ');
  $('exitCard').classList.add('show');
  $('exitStay').focus({ preventScroll: true });
}
async function exitToMenu() {
  closeCards();
  await leaveTable();
  resetToMenu('');
}

/* ---------- switching painting mid-puzzle ---------- */
// Picking a painting from the collection replaces the puzzle for everyone at the
// table, so ask first whenever the current one has pieces placed and isn't finished.
let switchTarget = null;
function pickPainting(pt) {
  const placed = pieces.filter(p => p.locked).length;
  if (done || placed === 0) { closeCards(); startRound(pt); return; }
  closeCards();
  switchTarget = pt;
  const same = pt === art;
  const others = visible().filter(p => !p.sameTab).length;
  $('switchTitle').textContent = same ? 'Start ' + art.title + ' again?' : 'Start ' + pt.title + '?';
  $('switchNote').textContent =
    (others ? 'Your table has' : 'You\u2019ve') + ' placed ' + placed + ' of ' + pieces.length + ' pieces of ' + art.title + '. ' +
    (same ? 'Starting again mixes them all up' : 'Starting a new painting clears them') +
    (others ? ' for everyone at the table.' : '.');
  $('switchFrom').style.backgroundImage = 'url(' + IMAGES[art.id].src + ')';
  $('switchTo').style.backgroundImage = 'url(' + IMAGES[pt.id].src + ')';
  $('switchKeep').textContent = 'Keep playing ' + art.title;
  $('switchGo').textContent = same ? 'Start again' : 'Start ' + pt.title;
  $('switchCard').classList.add('show');
  $('switchKeep').focus({ preventScroll: true });
}
function closeCards() { CARDS.forEach(id => $(id).classList.remove('show')); updateAfter(); }

/* ---------- after admiring a finished painting ---------- */
// Once the finish card is closed, a small bar sits just below the board with
// the way on: "Next painting" for the leader, a waiting note for everyone else.
function updateAfter() {
  const bar = $('afterBar');
  const cardOpen = CARDS.some(id => $(id).classList.contains('show'));
  const show = !!(done && level && pic && !cardOpen && $('menu').classList.contains('gone'));
  bar.hidden = !show;
  if (!show) return;
  const lead = amHost() && !spectator;
  $('afterTitle').textContent = art.title;
  $('afterNext').hidden = !lead;
  $('afterWait').hidden = lead;
  $('afterWait').textContent = 'Waiting for ' + leaderName() + ' to choose the next painting';
  // below the board when there's room, otherwise over its bottom edge
  const h = bar.offsetHeight || 46;
  bar.style.top = Math.max(M, Math.min(board.y + board.h + 14, H - h - 12)) + 'px';
}
function showInfo(complete) {
  closeCards();
  $('infoEyebrow').textContent = complete ? 'Round ' + round + ' complete' : 'The story';
  $('infoTitle').textContent = art.title;
  $('iArtist').textContent = art.artist;
  $('iYear').textContent = art.year;
  $('iMedium').textContent = art.medium;
  $('iHome').textContent = art.home;
  ['iTimeL', 'iTime', 'iLevelL', 'iLevel'].forEach(id => { $(id).hidden = !complete; });
  $('iTimeL').textContent = table && peersList.length > 1 ? 'Table time' : 'Your time';
  $('iTime').textContent = fmt(elapsed);
  $('iLevel').textContent = level ? level.name + ' · ' + pieces.length + ' pieces' : '';
  const st = $('iStory'); st.textContent = '';
  art.story.forEach(t => { const p = document.createElement('p'); p.textContent = t; st.appendChild(p); });
  $('doneRow').hidden = true; $('waitNote').hidden = true;
  if (complete) leaderButtons();
  $('infoCard').scrollTop = 0;
  $('infoCard').classList.add('show');
  updateAfter();
  (complete ? (!$('nextBtn').hidden ? $('nextBtn') : $('admireBtn')) : $('infoClose')).focus({ preventScroll: true });
}
function buildGallery() {
  const grid = $('galGrid'); grid.textContent = '';
  PAINTINGS.forEach(pt => {
    const b = document.createElement('button');
    b.className = 'art'; b.id = 'g-' + pt.id;
    b.setAttribute('aria-current', String(pt === art));
    b.disabled = spectator || !amHost();
    const ph = document.createElement('span'); ph.className = 'pic';
    ph.style.backgroundImage = 'url(' + IMAGES[pt.id].src + ')';
    if (finished.has(pt.id)) { const d = document.createElement('span'); d.className = 'done'; d.textContent = 'Solved'; ph.appendChild(d); }
    const t = document.createElement('b'); t.textContent = pt.title;
    const a = document.createElement('small'); a.textContent = pt.artist + ', ' + pt.year;
    b.append(ph, t, a);
    b.addEventListener('click', () => pickPainting(pt));
    grid.appendChild(b);
  });
}
function showGallery() {
  closeCards(); buildGallery();
  $('galNote').textContent = amHost()
    ? 'Your current puzzle is set aside and the one you pick starts as a new round at the same level, for everyone at the table.'
    : 'Only ' + leaderName() + ', the table leader, can choose the painting. You can browse the collection here.';
  $('galleryCard').scrollTop = 0; $('galleryCard').classList.add('show'); $('galClose').focus({ preventScroll: true }); }
function showInvite() {
  closeCards();
  $('invOn').hidden = !table; $('invOff').hidden = !!table;
  $('invCode').textContent = tableCode.toUpperCase();
  $('copyMsg').textContent = '';
  inviteCount();
  $('inviteCard').classList.add('show');
  $(table ? 'copyLink' : 'invClose').focus({ preventScroll: true });
}

function finish() {
  done = true;
  if (started) elapsed += performance.now() - t0;
  tick();
  finishT0 = performance.now();
  finished.add(art.id);
  setTimeout(chime, 250);
  setTimeout(() => showInfo(true), 1300);
}

/* ---------- players strip ---------- */
function avatarEl(name, color) {
  const a = document.createElement('span');
  a.className = 'avatar'; a.style.background = colorAt(color);
  a.textContent = (name || '?').slice(0, 1);
  return a;
}
// The leader is the person who started the table. Everyone locks onto the first
// "host" they see; if the leader leaves, the earliest remaining player takes over.
let leaderLock = '';
let myBans = { by: [], peer: [] };
const named = p => p.kind === 'viewer' && (p.sameTab || (p.presence && typeof p.presence.name === 'string' && p.presence.name));
function leader() {
  const ps = peersList.filter(named);
  if (!ps.length) return null;
  if (leaderLock) { const l = ps.find(p => p.peer === leaderLock); if (l) return l; }
  const hosts = ps.filter(p => p.presence && p.presence.role === 'host');
  const pool = hosts.length ? hosts : ps;
  const since = p => Number.isFinite(p.presence && p.presence.since) ? p.presence.since : Infinity;
  return pool.slice().sort((a, b) => (since(a) - since(b)) || (a.peer < b.peer ? -1 : 1))[0];
}
const amHost = () => { const h = leader(); return !table || !h || h.sameTab; };
const myEntry = () => peersList.find(p => p.sameTab) || null;
const myPeer = () => { const m = myEntry(); return m ? m.peer : ''; };
function leaderName() {
  const L = leader();
  if (!L || L.sameTab) return me.name;
  return cleanName(L.presence && L.presence.name) || 'The leader';
}
function bans() {
  const L = leader();
  const pr = L ? (L.sameTab ? { ban: myBans.by, bp: myBans.peer } : (L.presence || {})) : {};
  const list = v => Array.isArray(v) ? v.filter(x => typeof x === 'string') : [];
  return { by: list(pr.ban), peer: list(pr.bp) };
}
const isBanned = (p, b = bans()) => !!p && ((p.by && b.by.includes(p.by)) || b.peer.includes(p.peer));
const fromBanned = m => isBanned(m);
const visible = () => { const b = bans(); return peersList.filter(p => named(p) && (p.sameTab || !isBanned(p, b))); };

function renderPlayers() {
  const el = $('players');
  const before = el.offsetHeight;
  el.textContent = '';
  let list;
  const lead = leader(), iLead = amHost();
  if (table && peersList.length) {
    list = visible().map(p => ({
      peer: p.peer,
      name: p.sameTab ? me.name : (cleanName(p.presence && p.presence.name) || 'Friend'),
      color: p.sameTab ? me.color : (p.presence && p.presence.c),
      you: p.sameTab, lead: !!lead && p.peer === lead.peer, guest: p.guest
    }));
    list.sort((a, b) => (b.lead - a.lead) || (b.you - a.you));
  } else list = [{ name: me.name, color: me.color, you: true, lead: false }];
  const MAX = 7;
  list.slice(0, MAX).forEach(pl => {
    // the leader can tap a friend's chip to remove them
    const canKick = iLead && table && !pl.you;
    const chip = document.createElement(canKick ? 'button' : 'span'); chip.className = 'chip';
    if (canKick) { chip.title = 'Remove ' + pl.name + ' from the table'; chip.addEventListener('click', () => showKick(pl.peer)); }
    const nm = document.createElement('span'); nm.className = 'nm'; nm.textContent = pl.name;
    chip.append(avatarEl(pl.name, pl.color), nm);
    const tags = [pl.lead && list.length > 1 && 'leader', pl.you && 'you', pl.guest && 'guest'].filter(Boolean);
    if (tags.length) { const t = document.createElement('span'); t.className = 'tag'; t.textContent = tags.join(' · '); chip.appendChild(t); }
    if (canKick) { const x = document.createElement('span'); x.className = 'x'; x.setAttribute('aria-hidden', 'true'); x.textContent = '×'; chip.appendChild(x); }
    el.appendChild(chip);
  });
  if (list.length > MAX) { const more = document.createElement('span'); more.className = 'chip'; more.textContent = '+' + (list.length - MAX); el.appendChild(more); }
  const inv = document.createElement('button'); inv.className = 'btn primary'; inv.id = 'inviteBtn'; inv.textContent = 'Invite friends';
  inv.addEventListener('click', showInvite);
  el.appendChild(inv);
  if (spectator) { const w = document.createElement('span'); w.className = 'watch'; w.textContent = 'Watching only: you need edit access to move pieces'; el.appendChild(w); }
  if (el.offsetHeight !== before) { layout(); }
  request();
  if ($('inviteCard').classList.contains('show')) inviteCount();
  if ($('infoCard').classList.contains('show') && done) leaderButtons();
  updateAfter();
}
function inviteCount() {
  const n = visible().length;
  $('invCount').textContent = n > 1 ? n + ' people are at this table now.' : 'Nobody else is here yet.';
}
function leaderButtons() {
  // everyone can admire the finished painting; only the leader picks the next one
  const lead = amHost() && !spectator;
  $('doneRow').hidden = false;
  $('nextBtn').hidden = !lead;
  $('waitNote').hidden = lead;
  $('waitNote').textContent = 'Waiting for ' + leaderName() + ' to choose the next painting.';
}

/* ---------- removing a player (leader only) ---------- */
let kickTarget = '';
function showKick(peer) {
  const p = peersList.find(q => q.peer === peer);
  if (!p || !amHost()) return;
  closeCards();
  kickTarget = peer;
  const nm = cleanName(p.presence && p.presence.name) || 'this player';
  $('kickTitle').textContent = 'Remove ' + nm + '?';
  const a = $('kickAvatar'); a.style.background = colorAt(p.presence && p.presence.c); a.textContent = nm.slice(0, 1);
  $('kickCard').classList.add('show');
  $('kickNo').focus({ preventScroll: true });
}
function doKick() {
  const p = peersList.find(q => q.peer === kickTarget);
  closeCards();
  if (!p || !table || !amHost()) return;
  if (p.by && !myBans.by.includes(p.by)) myBans.by = myBans.by.concat(p.by).slice(-40);
  if (!myBans.peer.includes(p.peer)) myBans.peer = myBans.peer.concat(p.peer).slice(-40);
  table.presence({ ban: myBans.by, bp: myBans.peer }).catch(() => {});
  emitT('kick', { peer: p.peer, by: p.by || null });
  renderPlayers();
}
let kickedOut = false;
function beKicked() {
  if (kickedOut) return;
  kickedOut = true;
  const who = leaderName();
  leaveTable().then(() => {
    kickedOut = false;
    resetToMenu(who + ' removed you from the table.');
  });
}
function checkBanned() {
  const mine = myEntry();
  if (mine && !amHost() && isBanned(mine)) {
    if (joining) { const j = joining; joining = null; clearTimeout(j.timer); j.timers.forEach(clearTimeout); j.banned(); }
    else beKicked();
  }
}

/* ---------- table sync ---------- */
function emitT(topic, data) {
  if (!table) return;
  table.emit(topic, data).catch(e => {
    if (e && e.code === 'not_permitted' && !spectator) { spectator = true; drag = null; renderPlayers(); }
  });
}
function snapshot() {
  const x = [], k = [];
  for (const p of byId) { x.push(Math.round(p.x * 100), Math.round(p.y * 100)); k.push(p.locked ? '1' : '0'); }
  // o: stacking order, so the same piece is on top for everyone
  return { v: 1, r: round, d: dealer, p: art.id, l: level.key, c: COLS, w: ROWS, e: edgeStr, x, k: k.join(''), o: pieces.map(p => p.id) };
}
function validState(st) {
  if (!st || typeof st !== 'object') return false;
  const n = st.c * st.w;
  return st.v === 1 && Object.prototype.hasOwnProperty.call(BY_ID, st.p) && Object.prototype.hasOwnProperty.call(LEVELS, st.l)
    && Number.isInteger(st.c) && Number.isInteger(st.w) && st.c >= 2 && st.w >= 2 && n <= 160
    && Number.isInteger(st.r) && st.r >= 1 && st.r < 1e6 && typeof st.d === 'string' && st.d.length < 64
    && typeof st.e === 'string' && st.e.length === 2 * n && /^[01]+$/.test(st.e)
    && typeof st.k === 'string' && st.k.length === n && /^[01]+$/.test(st.k)
    && Array.isArray(st.x) && st.x.length === 2 * n && st.x.every(v => Number.isFinite(v) && Math.abs(v) < 1e5)
    && (st.o === undefined || (Array.isArray(st.o) && st.o.length === n && new Set(st.o).size === n && st.o.every(i => Number.isInteger(i) && i >= 0 && i < n)));
}
// A round from another player replaces ours if it is later, or the same round dealt by the
// lower peer label, so two people pressing "Next" at once still end up on one puzzle.
const isNewer = st => st.r > round || (st.r === round && st.d !== dealer && st.d < dealer);

let loadToken = 0;
function applyState(st, onDone) {
  const tk = ++loadToken;
  loadImage(st.p).then(im => {
    if (tk !== loadToken) return;
    if (!level) setLevel(LEVELS[st.l]);
    round = st.r; dealer = st.d;
    art = BY_ID[st.p]; COLS = st.c; ROWS = st.w;
    pic = cropTo(im, COLS, ROWS); blurCache = null;
    updatePlaque();
    build(st.e);
    byId.forEach((p, i) => {
      p.locked = st.k[i] === '1';
      p.x = p.locked ? p.c : st.x[2 * i] / 100; p.y = p.locked ? p.r : st.x[2 * i + 1] / 100;
    });
    if (st.o) pieces = st.o.map(i => byId[i]);
    pieces.sort((a, b) => b.locked - a.locked);
    started = false; elapsed = 0; flashes = []; drag = null;
    done = byId.every(p => p.locked);
    if (done) finishT0 = performance.now() - 2000;
    closeCards();
    $('round').textContent = round;
    layout(); stats(); tick(); request();
    table && table.presence({ rd: round }).catch(() => {});
    if (onDone) onDone();
  });
}

function wireTable(t) {
  t.on('sync.req', m => { if (!m.sameTab && !fromBanned(m) && amHost() && level && round > 0 && !joining) emitT('sync.state', snapshot()); });
  t.on('sync.state', m => {
    if (m.sameTab || fromBanned(m) || !validState(m.data)) return;
    if (joining) { const j = joining; joining = null; clearTimeout(j.timer); j.timers.forEach(clearTimeout); applyState(m.data, j.resolve); }
    else if (isNewer(m.data)) applyState(m.data);
  });
  t.on('round', m => {
    // only the table leader deals new paintings
    const L = leader();
    if (!m.sameTab && !joining && L && L.peer === m.peer && validState(m.data) && isNewer(m.data)) applyState(m.data);
  });
  t.on('kick', m => {
    const L = leader(), mine = myEntry(), d = m.data || {};
    if (m.sameTab || !L || L.peer !== m.peer || !mine) return;
    if (d.peer === mine.peer || (mine.by && d.by === mine.by)) beKicked();
    else renderPlayers();
  });
  t.on('move', m => {
    const d = m.data;
    if (m.sameTab || fromBanned(m) || !d || d.r !== round || !Number.isInteger(d.i) || !byId[d.i] || !Number.isFinite(d.x) || !Number.isFinite(d.y)) return;
    const p = byId[d.i];
    if (p.locked || (drag && drag.p === p)) return;
    const q = { x: d.x / 100, y: d.y / 100 }; clampXY(q);
    if (!p.heldBy) toTop(p);
    glideTo(p, q.x, q.y);
  });
  t.on('moves', m => {
    const d = m.data;
    if (m.sameTab || fromBanned(m) || !d || d.r !== round || !Array.isArray(d.a) || d.a.length % 3) return;
    for (let j = 0; j < d.a.length; j += 3) {
      const p = byId[d.a[j]];
      if (!p || p.locked || (drag && drag.p === p) || !Number.isFinite(d.a[j + 1]) || !Number.isFinite(d.a[j + 2])) continue;
      const q = { x: d.a[j + 1] / 100, y: d.a[j + 2] / 100 }; clampXY(q);
      glideTo(p, q.x, q.y);
    }
  });
  t.on('lock', m => {
    const d = m.data;
    if (m.sameTab || fromBanned(m) || !d || d.r !== round || !Number.isInteger(d.i) || !byId[d.i]) return;
    const p = byId[d.i];
    if (p.locked) return;
    if (drag && drag.p === p) drag = null;
    startClock();
    const pr = peersList.find(q => q.peer === m.peer);
    lockPiece(p, pr ? colorAt(pr.presence && pr.presence.c) : undefined);
  });
  t.onPeers(ch => {
    peersList = ch.peers.slice();
    if (!leaderLock) { const h = peersList.find(p => named(p) && p.presence && p.presence.role === 'host'); if (h) leaderLock = h.peer; }
    checkBanned();
    if (!table) return;
    applyRemoteMotion();
    const sig = playersSig();
    if (sig !== lastSig) { lastSig = sig; renderPlayers(); } else request();
    // a host re-sends the table to newcomers (covers friends who can watch but not send)
    if (ch.joined.some(p => !p.sameTab && !isBanned(p)) && amHost() && level && round > 0 && !joining) emitT('sync.state', snapshot());
  });
}

let lastSig = '';
// What the players strip shows; pointer and drag updates leave it unchanged.
function playersSig() {
  const L = leader(), b = bans();
  return [spectator, L ? L.peer : '', b.by.join(','), b.peer.join(','), me.name, me.color]
    .concat(peersList.map(p => [p.peer, p.kind, p.guest, p.presence && p.presence.name, p.presence && p.presence.c, p.presence && p.presence.role].join(':')))
    .join('|');
}
// Pieces friends are holding, and their pointers, from their presence.
const heldNow = new Map();                // piece id -> peer holding it
function applyRemoteMotion() {
  const b = bans(), seen = new Set(), holding = new Map();
  for (const pr of peersList) {
    if (pr.sameTab || pr.kind !== 'viewer' || isBanned(pr, b) || !pr.presence || pr.presence.rd !== round) continue;
    const c = pr.presence.cur;
    if (Array.isArray(c) && c.length === 2 && Number.isFinite(c[0]) && Number.isFinite(c[1])) {
      seen.add(pr.peer);
      const cur = remoteCur.get(pr.peer);
      if (cur) { cur.tx = c[0]; cur.ty = c[1]; } else remoteCur.set(pr.peer, { x: c[0], y: c[1], tx: c[0], ty: c[1] });
    }
    const d = pr.presence.drag;
    if (Array.isArray(d) && d.length === 3 && Number.isInteger(d[0]) && byId[d[0]] && Number.isFinite(d[1]) && Number.isFinite(d[2])) {
      const p = byId[d[0]];
      if (p.locked || (drag && drag.p === p)) continue;
      holding.set(p.id, pr.peer);
      if (heldNow.get(p.id) !== pr.peer) toTop(p);
      p.heldBy = pr.peer;
      const q = { x: d[1] / 100, y: d[2] / 100 }; clampXY(q);
      p.tx = q.x; p.ty = q.y;
    }
  }
  for (const k of [...remoteCur.keys()]) if (!seen.has(k)) remoteCur.delete(k);
  for (const [id] of heldNow) if (!holding.has(id) && byId[id]) byId[id].heldBy = null;
  heldNow.clear(); for (const [id, peer] of holding) heldNow.set(id, peer);
  request();
}

const CODE_CHARS = 'abcdefghjkmnpqrstuvwxyz23456789';
const newCode = () => Array.from({ length: 5 }, () => CODE_CHARS[Math.floor(Math.random() * CODE_CHARS.length)]).join('');
const withTimeout = (p, ms) => Promise.race([p, new Promise(r => setTimeout(() => r(null), ms))]);

async function openTable(code, creator) {
  const R = await withTimeout(roomReady, 4000);
  if (!R) return false;
  let t;
  try { t = await R.join('t-' + code); } catch (e) { return false; }
  table = t; tableCode = code; isCreator = creator; mySince = Date.now();
  wireTable(t);
  t.presence({ name: me.name, c: me.color, since: creator ? mySince - 1e9 : mySince, role: creator ? 'host' : 'player', rd: round, cur: null }).catch(() => {});
  showTableInAddress(code);
  return true;
}
// Table links: on a website the code is the path (pezzi.vercel.app/ddr6y). Inside
// Claude only a plain #name can travel with the link, so there it's #ddr6y.
// Older #table-ddr6y links still open.
const IN_CLAUDE = !!window.MJ_PAGE_URL;
const CODE_RE = '[a-hjkmnp-z2-9]{5}';            // the letters newCode() uses
function codeFromAddress() {
  const p = new RegExp('^/(' + CODE_RE + ')/?$').exec(location.pathname);
  if (p && !IN_CLAUDE) return p[1];
  const h = new RegExp('^#(?:table-)?(' + CODE_RE + ')$').exec(location.hash || '');
  return h ? h[1] : '';
}
function showTableInAddress(code) {
  try {
    if (IN_CLAUDE) history.replaceState(null, '', location.pathname + location.search + '#' + code);
    else history.replaceState(null, '', '/' + code + location.search);
  } catch (e) { try { location.hash = code; } catch (e2) {} }
}
function clearHash() {
  try {
    const path = !IN_CLAUDE && new RegExp('^/' + CODE_RE + '/?$').test(location.pathname) ? '/' : location.pathname;
    history.replaceState(null, '', path + location.search);
  } catch (e) {}
}
async function leaveTable() {
  const t = table; table = null; tableCode = ''; peersList = []; leaderLock = ''; myBans = { by: [], peer: [] }; spectator = false;
  if (t) { try { await t.leave(); } catch (e) {} }
}

/* ---------- rounds ---------- */
function nextPainting() {
  if (!queue.length) {
    queue = PAINTINGS.filter(p => p !== art);
    for (let i = queue.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [queue[i], queue[j]] = [queue[j], queue[i]]; }
  }
  return queue.shift();
}
function updatePlaque() {
  $('artTitle').textContent = art.title;
  $('artMeta').textContent = art.artist + ' · ' + art.year;
}
// Deal a new round here and send it to everyone at the table.
function startRound(pt) {
  if (spectator || !amHost()) return;
  const tk = ++loadToken;
  queue = queue.filter(q => q !== pt);
  loadImage(pt.id).then(im => {
    if (tk !== loadToken) return;
    round++; dealer = myPeer();
    art = pt;
    const g = gridFor(im, level.target);
    COLS = g.cols; ROWS = g.rows;
    pic = cropTo(im, COLS, ROWS); blurCache = null;
    updatePlaque();
    build(randomEdges(COLS * ROWS));
    done = false; started = false; elapsed = 0; flashes = []; drag = null;
    closeCards();
    $('round').textContent = round;
    layout(); scatter(pieces); stats(); tick(); request();
    if (table) { table.presence({ rd: round }).catch(() => {}); emitT('round', snapshot()); }
  });
}
function setLevel(lv) {
  level = lv;
  $('levelTag').textContent = level.name;
  const g = $('ghostBtn');
  if (level.blur) { g.disabled = true; g.setAttribute('aria-pressed', 'false'); g.title = 'Hard level always uses the blurred board'; }
}
function enterGame() {
  $('menu').classList.add('gone');
  $('players').hidden = false;
  $('storyBtn').disabled = false; $('galleryBtn').disabled = false; $('menuBtn').disabled = false;
  $('hint').classList.remove('gone');
  stopMenuArt();
  renderPlayers();
  layout(); request();
}

/* ---------- main menu ---------- */
let pickedLevel = 'easy';
const popOpen = () => !$('invitePop').hidden;
// Messages go to the invite popup while it's open, otherwise under the menu.
function setMenuMsg(t) { $(popOpen() ? 'popMsg' : 'menuMsg').textContent = t; }
function refreshMe() {
  const a = $('meAvatar');
  a.style.background = colorAt(me.color);
  a.textContent = (me.name || '?').slice(0, 1);
  const pa = $('popAvatar'); pa.style.background = a.style.background; pa.textContent = a.textContent;
  document.querySelectorAll('.sw').forEach(b => b.setAttribute('aria-checked', String(+b.dataset.c === me.color)));
}
function needName() {
  me.name = cleanName($('nameInput').value);
  if (!me.name) { setMenuMsg('Type your name first, so friends know who you are.'); $(popOpen() ? 'popName' : 'nameInput').focus(); return false; }
  store.set('mj.name', me.name); store.set('mj.color', String(me.color));
  return true;
}
function busy(on) { $('startBtn').disabled = on; $('joinBtn').disabled = on; $('popJoin').disabled = on; }

async function onStart() {
  if (!needName()) return;
  busy(true); setMenuMsg('Setting the table…');
  setLevel(LEVELS[pickedLevel]);
  const code = newCode();
  await openTable(code, true);
  setMenuMsg('');
  enterGame();
  startRound(PAINTINGS[0]);
}
async function onJoin() {
  if (!needName()) return;
  const code = $('codeInput').value.toLowerCase().replace(/[^a-z0-9]/g, '');
  if (code.length !== 5) { setMenuMsg('A table code has 5 letters and numbers.'); $(popOpen() ? 'popCode' : 'codeInput').focus(); return; }
  busy(true); setMenuMsg('Looking for table ' + code.toUpperCase() + '…');
  const ok = await openTable(code, false);
  if (!ok) { busy(false); setMenuMsg("Tables can't connect in this view. You can still start your own table and play alone."); return; }
  const got = await new Promise(resolve => {
    const j = { resolve: () => resolve(true), banned: () => resolve('banned'), timers: [] };
    joining = j;
    emitT('sync.req', {});
    j.timers.push(setTimeout(() => emitT('sync.req', {}), 1500), setTimeout(() => emitT('sync.req', {}), 3500));
    j.timer = setTimeout(() => { if (joining === j) { joining = null; j.timers.forEach(clearTimeout); resolve(false); } }, 8000);
  });
  if (got !== true) {
    const who = leaderName();
    await leaveTable();
    clearHash();
    busy(false);
    setMenuMsg(got === 'banned'
      ? who + ' removed you from table ' + code.toUpperCase() + ', so you can\'t rejoin it.'
      : 'Nobody is at table ' + code.toUpperCase() + ' right now. Check the code with your friend, or start your own table.');
    return;
  }
  setMenuMsg('');
  closeInvitePop(false);
  enterGame();
}

/* ---------- invite popup ---------- */
// Someone who opens an invite link sees this over the main menu, with the code
// filled in, so they join their friend instead of starting a new table by mistake.
function openInvitePop(code) {
  $('popTitle').textContent = 'Join table ' + code.toUpperCase();
  $('popCode').value = code.toUpperCase();
  $('popName').value = me.name;
  $('popMsg').textContent = '';
  $('invitePop').hidden = false;
  refreshMe();
  (me.name ? $('popJoin') : $('popName')).focus({ preventScroll: true });
}
function closeInvitePop(toMenu = true) {
  if (!popOpen()) return;
  $('invitePop').hidden = true;
  if (toMenu) {
    // keep the code in the menu's join box in case they change their mind
    $('codeInput').value = $('popCode').value;
    $('nameInput').value = me.name;
    clearHash();
    (me.name ? $('startBtn') : $('nameInput')).focus({ preventScroll: true });
  }
}
function joinFromPop() {
  $('nameInput').value = $('popName').value;
  $('codeInput').value = $('popCode').value;
  onJoin();
}

function setMenuMode(mode, code) {
  const inv = mode === 'invite';
  $('inviteBanner').hidden = !inv;
  $('hostArea').hidden = inv;
  $('ownTableBtn').hidden = !inv;
  $('joinNote').hidden = inv;
  $('joinBtn').classList.toggle('primary', inv);
  if (inv) $('bannerTitle').textContent = 'You’re invited to table ' + String(code || '').toUpperCase();
}
// Back to the main menu, e.g. after the leader removes you.
function resetToMenu(msg) {
  ++loadToken;
  closeCards();
  $('afterBar').hidden = true;
  level = null; round = 0; dealer = ''; pieces = []; byId = []; done = false; started = false; elapsed = 0;
  drag = null; flashes = []; joining = null; queue = [];
  $('players').hidden = true;
  $('menu').classList.remove('gone');
  $('storyBtn').disabled = true; $('galleryBtn').disabled = true; $('menuBtn').disabled = true;
  const g = $('ghostBtn'); g.disabled = false; g.setAttribute('aria-pressed', String(ghost));
  g.title = 'Show a faint copy of the painting on the board. When off, the board shows a soft blur.';
  $('levelTag').textContent = 'Main menu'; $('round').textContent = '0';
  $('artTitle').textContent = 'Masterpiece Jigsaw'; $('artMeta').textContent = 'Sixteen famous paintings to piece together';
  $('hint').classList.add('gone');
  clearHash(); $('codeInput').value = '';
  $('invitePop').hidden = true;
  setMenuMode('host'); busy(false); setMenuMsg(msg || '');
  startMenuArt();
  loadImage('mona-lisa').then(im => { art = PAINTINGS[0]; COLS = 4; ROWS = 4; pic = cropTo(im, 4, 4); blurCache = null; layout(); stats(); tick(); request(); });
}

// The menu's frame slowly cycles through the collection.
let artTimer = 0, artIdx = 0, artFront = 'artA';
function showMenuArt(i) {
  const pt = PAINTINGS[i], back = artFront === 'artA' ? 'artB' : 'artA';
  const img = $(back);
  img.src = IMAGES[pt.id].src;
  img.style.opacity = '1'; $(artFront).style.opacity = '0';
  artFront = back;
  const lab = $('artLabel'); lab.textContent = '';
  const b = document.createElement('b'); b.textContent = pt.title;
  lab.append(b, document.createTextNode(pt.artist + ', ' + pt.year));
}
function startMenuArt() {
  clearInterval(artTimer);
  $('artA').src = IMAGES['mona-lisa'].src; $('artA').style.opacity = '1';
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  artTimer = setInterval(() => { artIdx = (artIdx + 1) % PAINTINGS.length; showMenuArt(artIdx); }, 5200);
}
function stopMenuArt() { clearInterval(artTimer); }

function setupMenu() {
  const sw = $('swatches');
  AVATAR_COLORS.forEach((c, i) => {
    const b = document.createElement('button');
    b.className = 'sw'; b.id = 'sw' + i; b.dataset.c = i; b.style.background = c;
    b.setAttribute('role', 'radio'); b.setAttribute('aria-label', 'Colour ' + (i + 1));
    b.addEventListener('click', () => { me.color = i; refreshMe(); });
    sw.appendChild(b);
  });
  $('nameInput').value = me.name;
  $('nameInput').addEventListener('input', () => { me.name = cleanName($('nameInput').value); refreshMe(); setMenuMsg(''); });
  $('nameInput').addEventListener('keydown', e => { if (e.key === 'Enter') ($('codeInput').value ? onJoin : onStart)(); });
  $('codeInput').addEventListener('keydown', e => { if (e.key === 'Enter') onJoin(); });
  document.querySelectorAll('.lvl').forEach(b => b.addEventListener('click', () => {
    pickedLevel = b.dataset.level;
    document.querySelectorAll('.lvl').forEach(x => x.setAttribute('aria-pressed', String(x === b)));
  }));
  document.querySelectorAll('.thumb').forEach(t => {
    t.style.backgroundImage = 'url(' + IMAGES['mona-lisa'].src + ')';
    t.style.setProperty('--cell', (48 / +t.dataset.n) + 'px');
  });
  $('startBtn').addEventListener('click', onStart);
  $('joinBtn').addEventListener('click', onJoin);
  const invited = codeFromAddress();
  const m = invited ? [null, invited] : null;
  setMenuMode('host');
  refreshMe();
  startMenuArt();
  $('popName').addEventListener('input', () => { me.name = cleanName($('popName').value); $('nameInput').value = $('popName').value; refreshMe(); $('popMsg').textContent = ''; });
  $('popName').addEventListener('keydown', e => { if (e.key === 'Enter') joinFromPop(); });
  $('popCode').addEventListener('keydown', e => { if (e.key === 'Enter') joinFromPop(); });
  $('popJoin').addEventListener('click', joinFromPop);
  $('popClose').addEventListener('click', () => closeInvitePop(true));
  $('invitePop').addEventListener('click', e => { if (e.target === $('invitePop') && !$('popJoin').disabled) closeInvitePop(true); });
  if (m) openInvitePop(m[1]);
  else (me.name ? $('startBtn') : $('nameInput')).focus({ preventScroll: true });
}

/* ---------- controls ---------- */
$('ghostBtn').addEventListener('click', e => { ghost = !ghost; e.currentTarget.setAttribute('aria-pressed', String(ghost)); request(); });
$('soundBtn').addEventListener('click', e => { sound = !sound; e.currentTarget.setAttribute('aria-pressed', String(sound)); });
$('tidyBtn').addEventListener('click', () => {
  if (done || !level || spectator) return;
  const loose = pieces.filter(p => !p.locked);
  scatter(loose); request();
  if (table) { const a = []; loose.forEach(p => a.push(p.id, Math.round(p.x * 100), Math.round(p.y * 100))); emitT('moves', { r: round, a }); }
});
$('storyBtn').addEventListener('click', () => showInfo(done));
$('galleryBtn').addEventListener('click', showGallery);
$('infoClose').addEventListener('click', closeCards);
$('galClose').addEventListener('click', closeCards);
$('invClose').addEventListener('click', closeCards);
$('admireBtn').addEventListener('click', closeCards);
$('afterNext').addEventListener('click', () => startRound(nextPainting()));
$('afterStory').addEventListener('click', () => showInfo(true));
$('nextBtn').addEventListener('click', () => startRound(nextPainting()));
// The link that opens this table. The claude.ai build sets MJ_PAGE_URL.
const tableLink = () => IN_CLAUDE ? window.MJ_PAGE_URL + '#' + tableCode : location.origin + '/' + tableCode;
function copyText(text, okMsg) {
  const fallback = () => {
    $('invCode').textContent = text;
    const r = document.createRange(); r.selectNodeContents($('invCode'));
    const sel = getSelection(); sel.removeAllRanges(); sel.addRange(r);
    $('copyMsg').textContent = 'Selected. Copy it to send.';
    setTimeout(() => { $('invCode').textContent = tableCode.toUpperCase(); }, 6000);
  };
  try { navigator.clipboard.writeText(text).then(() => { $('copyMsg').textContent = okMsg; }, fallback); } catch (e) { fallback(); }
}
$('copyLink').addEventListener('click', () => copyText(tableLink(), 'Link copied'));
$('copyCode').addEventListener('click', () => copyText(tableCode.toUpperCase(), 'Code copied'));
$('kickYes').addEventListener('click', doKick);
$('kickNo').addEventListener('click', closeCards);
$('switchKeep').addEventListener('click', () => { switchTarget = null; closeCards(); });
$('menuBtn').addEventListener('click', askExit);
$('exitStay').addEventListener('click', closeCards);
$('exitGo').addEventListener('click', exitToMenu);
$('switchGo').addEventListener('click', () => { const pt = switchTarget; switchTarget = null; closeCards(); if (pt) startRound(pt); });
$('ownTableBtn').addEventListener('click', () => { clearHash(); $('codeInput').value = ''; setMenuMode('host'); setMenuMsg(''); });
document.addEventListener('keydown', e => {
  if (e.key !== 'Escape') return;
  if (popOpen()) { if (!$('popJoin').disabled) closeInvitePop(true); } else closeCards();
});

new ResizeObserver(() => { layout(); request(); }).observe(tableEl);
const mq = matchMedia('(prefers-color-scheme: dark)');
const recolor = () => { readColors(); request(); };
mq.addEventListener ? mq.addEventListener('change', recolor) : mq.addListener(recolor);
new MutationObserver(recolor).observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
setInterval(tick, 500);

// Local testing aid: in the browser console on localhost, mjDebug.pieces() lists
// every piece and mjDebug.frameMs() times one full redraw.
if (/^(localhost|127\.0\.0\.1)$/.test(location.hostname)) {
  window.mjDebug = {
    pieces: () => byId.map(p => ({ id: p.id, x: +p.x.toFixed(3), y: +p.y.toFixed(3), locked: p.locked, heldBy: p.heldBy || null })),
    peers: () => peersList.map(p => ({ peer: p.peer, you: p.sameTab, name: p.presence && p.presence.name, drag: p.presence && p.presence.drag })),
    // settle one loose piece as if it had been dragged home (for tests)
    placeOne: () => { const p = byId.find(q => !q.locked); if (!p) return false; lockPiece(p); emitT('lock', { r: round, i: p.id }); return true; },
    frameMs: (n = 60) => { const t0 = performance.now(); for (let i = 0; i < n; i++) draw(); return +((performance.now() - t0) / n).toFixed(2); }
  };
}

readColors();
setupMenu();
loadImage('mona-lisa').then(im => {
  if (pic) return;
  art = PAINTINGS[0]; COLS = 4; ROWS = 4; pic = cropTo(im, 4, 4);
  layout(); request();
});
})();
