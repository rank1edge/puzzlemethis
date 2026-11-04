// Layout on every screen size, in every language.
//
// For each viewport below, this walks every screen: the main menu, the invite
// popup, the table on Hard, each card, and the bar under a finished painting.
// It does that in all six languages and collects anything that would look
// broken to a player:
//   - the page scrolling sideways
//   - a control or heading poking off the left or right edge
//   - button text cut off
//   - buttons overlapping each other
//   - a card or popup that doesn't fit on screen
//   - the main button of a screen that can't be reached by scrolling
//   - a too-small table, pieces outside it, or the board under the players strip
// The real fonts are served locally (local-fonts.js), so text is measured as players see it.
const { test, expect } = require('@playwright/test');
const { useLocalFonts } = require('./local-fonts');

const LANGS = ['en', 'fr', 'de', 'it', 'ru', 'ja'];
const VIEWPORTS = [
  { name: 'small phone', width: 320, height: 568, touch: true },
  { name: 'android phone', width: 360, height: 740, touch: true },
  // with animations on: a card fading out must not block taps underneath
  { name: 'iphone', width: 390, height: 844, touch: true, motion: true },
  { name: 'large phone', width: 430, height: 932, touch: true },
  { name: 'phone landscape', width: 740, height: 360, touch: true },
  { name: 'tablet portrait', width: 768, height: 1024, touch: true },
  { name: 'tablet landscape', width: 1024, height: 768, touch: true },
  { name: 'laptop', width: 1280, height: 720 },
  { name: 'desktop', width: 1920, height: 1080 }
];

// Runs in the page: returns a list of problems on the current screen.
function audit({ scope, mainButton, touch }) {
  const vw = innerWidth, vh = innerHeight, out = [];
  const label = el => '#' + (el.id || '') + '.' + String(el.className || '').split(' ')[0] + ' "' + (el.textContent || el.placeholder || '').trim().slice(0, 30) + '"';
  const shown = el => {
    if (el.closest('[hidden]')) return false;
    const r = el.getBoundingClientRect(), cs = getComputedStyle(el);
    return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none' && +cs.opacity !== 0;
  };
  const root = scope ? document.querySelector(scope) : document;
  // inside a row that scrolls sideways (the header buttons on small screens),
  // a control may sit beyond the edge until you swipe: check the row instead
  const scroller = el => { for (let p = el.parentElement; p; p = p.parentElement) {
    if (/(auto|scroll)/.test(getComputedStyle(p).overflowX) && p.scrollWidth > p.clientWidth + 1) return p; } return null; };
  for (const sc of document.querySelectorAll('header .controls')) {
    const r = sc.getBoundingClientRect();
    if (shown(sc) && (r.left < -1 || r.right > vw + 1)) out.push('header buttons row runs off the side');
  }
  if (document.documentElement.scrollWidth > vw + 1) out.push('page scrolls sideways (' + document.documentElement.scrollWidth + ' > ' + vw + ')');
  if (document.body.scrollWidth > vw + 1) out.push('body wider than screen (' + document.body.scrollWidth + ')');

  const scopes = [document.querySelector('header'), root].filter(Boolean);
  const seen = new Set();
  for (const sc of scopes) for (const el of sc.querySelectorAll('button, select, input, h1, h2, .eyebrow, .lab, .chip, .lvl, .note, .code, .msg, .art b, .art small, .lvl b, .lvl small')) {
    if (seen.has(el) || !shown(el)) continue;
    seen.add(el);
    const r = el.getBoundingClientRect();
    if (!scroller(el) && (r.left < -1 || r.right > vw + 1)) out.push(label(el) + ' runs off the side (' + Math.round(r.left) + '..' + Math.round(r.right) + ')');
    if (el.matches('button, select, .chip, .art b, .art small, .lvl b, .lvl small') && el.scrollWidth > el.clientWidth + 2) out.push(label(el) + ' text cut off (' + el.scrollWidth + ' > ' + el.clientWidth + ')');
    // (a heading shortened on purpose with "…" is fine)
    if (el.matches('h1, h2') && getComputedStyle(el).textOverflow !== 'ellipsis' && el.scrollWidth > el.clientWidth + 2) out.push(label(el) + ' heading wider than its box');
    // on touch screens every control must be big enough for a finger
    if (touch && el.matches('button, select') && !el.disabled) {
      const min = el.matches('.sw') ? 32 : 40;
      if (Math.min(r.width, r.height) < min - 0.5) out.push(label(el) + ' too small to tap (' + Math.round(r.width) + '×' + Math.round(r.height) + ')');
    }
  }
  // siblings that should sit side by side or wrap, never overlap
  for (const sel of ['header .controls', 'header .stats', '.levels', '.joinrow', '.players', '.row', '.after', '.namerow']) {
    for (const g of document.querySelectorAll(sel)) {
      if (!shown(g)) continue;
      const kids = [...g.children].filter(shown).map(el => [el, el.getBoundingClientRect()]);
      for (let i = 0; i < kids.length; i++) for (let j = i + 1; j < kids.length; j++) {
        const [a, ra] = kids[i], [b, rb] = kids[j];
        const ox = Math.min(ra.right, rb.right) - Math.max(ra.left, rb.left), oy = Math.min(ra.bottom, rb.bottom) - Math.max(ra.top, rb.top);
        if (ox > 2 && oy > 2) out.push(sel + ': ' + label(a) + ' overlaps ' + label(b));
      }
    }
  }
  // a card or popup must fit on screen (it may scroll inside)
  if (scope) {
    const box = (document.querySelector(scope + ' .pop-card') || document.querySelector(scope)).getBoundingClientRect();
    if (box.left < -1 || box.right > vw + 1) out.push(scope + ' wider than the screen');
    const host = document.querySelector(scope);
    const scrolls = el => el && /(auto|scroll)/.test(getComputedStyle(el).overflowY);
    if ((box.top < -1 || box.bottom > vh + 1) && !scrolls(host) && !scrolls(host.querySelector('.pop-card'))) out.push(scope + ' taller than the screen and does not scroll');
  }
  // the screen's main button can be reached
  if (mainButton) {
    const b = document.querySelector(mainButton);
    if (!b || !shown(b)) out.push(mainButton + ' not shown');
    else {
      b.scrollIntoView({ block: 'nearest' });
      const r = b.getBoundingClientRect();
      if (r.top < 0 || r.bottom > vh + 1 || r.left < 0 || r.right > vw + 1) out.push(mainButton + ' cannot be scrolled into view');
      const hit = document.elementFromPoint(Math.min(vw - 1, r.left + r.width / 2), Math.min(vh - 1, r.top + r.height / 2));
      if (hit && !b.contains(hit)) out.push(mainButton + ' is covered by ' + label(hit));
    }
  }
  return out;
}

// Runs in the page: problems with the table itself.
function auditTable() {
  const out = [], L = mjDebug.layout(), vh = innerHeight;
  const table = document.getElementById('table').getBoundingClientRect();
  const strip = document.getElementById('players').getBoundingClientRect();
  if (table.height < Math.min(260, vh * 0.45)) out.push('table area only ' + Math.round(table.height) + 'px tall');
  const b = L.board;
  if (b.x < -1 || b.y < -1 || b.x + b.w > L.W + 1 || b.y + b.h > L.H + 1) out.push('board extends outside the table');
  if (b.y + table.top < strip.bottom - 1) out.push('board starts under the players strip');
  // even on Hard (about 100 pieces) a piece must stay big enough to see and drag
  if (L.s < 16) out.push('pieces only ' + L.s.toFixed(1) + 'px: too small to handle');
  // the header must leave most of the screen to the table
  const head = document.querySelector('header').getBoundingClientRect().height;
  if (head > Math.max(96, vh * 0.26)) out.push('header takes ' + Math.round(head) + 'px of ' + vh + 'px');
  const bad = L.loose.filter(([x, y, w, h]) => x + w * 0.5 < 0 || y + h * 0.5 < 0 || x + w * 0.5 > L.W || y + h * 0.5 > L.H).length;
  if (bad) out.push(bad + ' loose pieces outside the table');
  return out;
}

for (const vp of VIEWPORTS) {
  test(`${vp.name} ${vp.width}×${vp.height}: every screen in every language`, async ({ browser }) => {
    test.setTimeout(vp.motion ? 240000 : 120000);
    // other sizes run with reduced motion (no card fades), which keeps the suite quick
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height }, hasTouch: !!vp.touch, isMobile: !!vp.touch && vp.width < 500,
      reducedMotion: vp.motion ? 'no-preference' : 'reduce'
    });
    await useLocalFonts(context);
    const page = await context.newPage();
    const problems = [];
    const check = async (where, opts = {}) => {
      await page.evaluate(() => document.fonts.ready);
      if (vp.motion) await page.waitForTimeout(650);  // let cards finish fading in or out
      for (const p of await page.evaluate(audit, Object.assign({ touch: !!vp.touch }, opts))) problems.push(where + ': ' + p);
    };
    const setLang = async lang => { await page.selectOption('#langSelect', lang); await page.waitForTimeout(60); };

    // 1. main menu
    await page.goto('/');
    for (const lang of LANGS) {
      await setLang(lang);
      const head = await page.evaluate(() => document.querySelector('header').getBoundingClientRect().height);
      if (head > Math.max(90, vp.height * 0.2)) problems.push(lang + ' menu: header takes ' + Math.round(head) + 'px');
      await check(lang + ' menu', { scope: '#menu', mainButton: '#startBtn' });
      await check(lang + ' menu (join)', { scope: '#menu', mainButton: '#joinBtn' });
    }

    // 2. invite popup
    await page.goto('/abcde');
    await expect(page.locator('#invitePop')).toBeVisible();
    for (const lang of LANGS) {
      await setLang(lang);
      await check(lang + ' invite popup', { scope: '#invitePop', mainButton: '#popJoin' });
    }

    // 3. the table, on Hard, and every card
    await page.goto('/');
    await setLang('en');
    await page.fill('#nameInput', 'Alexandra');
    await page.click('#lvlHard');
    await page.click('#startBtn');
    await expect(page.locator('#menu')).toHaveClass(/gone/);
    await page.evaluate(() => mjDebug.placeOne());
    const cards = [
      ['story', '#storyBtn', '#infoCard', '#infoClose'],
      ['gallery', '#galleryBtn', '#galleryCard', '#galClose'],
      ['invite', '#inviteBtn', '#inviteCard', '#invClose'],
      ['exit', '#menuBtn', '#exitCard', '#exitStay']
    ];
    for (const lang of LANGS) {
      await setLang(lang);
      await check(lang + ' table', { scope: '#table' });
      for (const p of await page.evaluate(auditTable)) problems.push(lang + ' table: ' + p);
      for (const [name, open, card, close] of cards) {
        await page.click(open);
        await expect(page.locator(card)).toHaveClass(/show/);
        await check(lang + ' ' + name + ' card', { scope: card, mainButton: close });
        await page.click(close);
      }
      // switching painting mid-puzzle
      await page.click('#galleryBtn');
      await page.click('#g-great-wave');
      await expect(page.locator('#switchCard')).toHaveClass(/show/);
      await check(lang + ' switch card', { scope: '#switchCard', mainButton: '#switchKeep' });
      await page.click('#switchKeep');
    }

    // 4. finished painting: the finish card and the bar under the board
    await page.evaluate(() => { while (mjDebug.placeOne()) {} });
    await expect(page.locator('#infoCard')).toHaveClass(/show/, { timeout: 5000 });
    for (const lang of LANGS) {
      await setLang(lang);
      await check(lang + ' finish card', { scope: '#infoCard', mainButton: '#nextBtn' });
      await page.click('#admireBtn');
      await expect(page.locator('#afterBar')).toBeVisible();
      await check(lang + ' after bar', { scope: '#table', mainButton: '#afterNext' });
      await page.click('#afterStory');
    }

    // 5. a landscape (wide) painting on the same screen
    await page.click('#nextBtn');
    await page.click('#galleryBtn');
    await page.click('#g-wheatfield-crows');
    await expect(page.locator('#artTitle')).not.toHaveText(/Mona|Joconde|Gioconda|Мона|モナ/);
    for (const p of await page.evaluate(auditTable)) problems.push('wide painting: ' + p);

    await context.close();
    expect(problems, problems.join('\n')).toEqual([]);
  });
}

test('touch: the board never scrolls the page while dragging', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.fill('#nameInput', 'Ajay'); await page.click('#startBtn');
  expect(await page.evaluate(() => getComputedStyle(document.getElementById('cv')).touchAction)).toBe('none');
  // the first painting loads asynchronously; wait until its pieces are dealt
  await expect.poll(() => page.evaluate(() => mjDebug.layout().loose.length)).toBeGreaterThan(0);
  // a touch drag moves a piece like a mouse drag does
  const L = await page.evaluate(() => mjDebug.layout());
  const [x, y, w, h] = L.loose[L.loose.length - 1];
  const tb = await page.locator('#table').boundingBox();
  const sx = tb.x + x + w / 2, sy = tb.y + y + h / 2;
  const before = await page.evaluate(() => JSON.stringify(mjDebug.pieces().map(p => [p.x, p.y])));
  await page.evaluate(([sx, sy]) => {
    const cv = document.getElementById('cv'), o = { pointerId: 7, pointerType: 'touch', isPrimary: true, bubbles: true };
    cv.dispatchEvent(new PointerEvent('pointerdown', { ...o, clientX: sx, clientY: sy }));
    for (let i = 1; i <= 10; i++) cv.dispatchEvent(new PointerEvent('pointermove', { ...o, clientX: sx + i * 6, clientY: sy - i * 4 }));
    cv.dispatchEvent(new PointerEvent('pointerup', { ...o, clientX: sx + 60, clientY: sy - 40 }));
  }, [sx, sy]);
  expect(await page.evaluate(() => JSON.stringify(mjDebug.pieces().map(p => [p.x, p.y])))).not.toBe(before);
  await context.close();
});

test('touch: a long press on the table never selects text or opens Copy / Search menus', async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true });
  const page = await context.newPage();
  await page.goto('/');
  await page.fill('#nameInput', 'Ajay'); await page.click('#startBtn');
  await expect(page.locator('#menu')).toHaveClass(/gone/);
  const r = await page.evaluate(() => {
    const css = sel => { const s = getComputedStyle(document.querySelector(sel)); return s.userSelect || s.webkitUserSelect; };

    const cv = document.getElementById('cv'), o = { pointerId: 3, pointerType: 'touch', isPrimary: true, bubbles: true, cancelable: true, clientX: 200, clientY: 400 };
    const down = new PointerEvent('pointerdown', o); cv.dispatchEvent(down);
    cv.dispatchEvent(new PointerEvent('pointerup', o));
    const menu = new MouseEvent('contextmenu', { bubbles: true, cancelable: true }); cv.dispatchEvent(menu);
    const sel = new Event('selectstart', { bubbles: true, cancelable: true }); cv.dispatchEvent(sel);
    let touch = null;
    try { const t = new Touch({ identifier: 1, target: cv, clientX: 200, clientY: 400 });
      const ev = new TouchEvent('touchstart', { touches: [t], targetTouches: [t], changedTouches: [t], bubbles: true, cancelable: true });
      cv.dispatchEvent(ev); touch = ev.defaultPrevented; } catch (e) {}
    return {
      header: css('header h1'), stats: css('.stats'), players: css('.players'), hint: css('#hint'),
      name: css('#nameInput'), story: css('.story'),
      downPrevented: down.defaultPrevented, menuPrevented: menu.defaultPrevented, selectPrevented: sel.defaultPrevented, touchPrevented: touch,
      tapHighlight: getComputedStyle(document.documentElement).webkitTapHighlightColor
    };
  });
  for (const k of ['header', 'stats', 'players', 'hint']) expect(r[k], k).toBe('none');
  // -webkit-touch-callout (the iOS long-press menu) exists only in Safari, and
  // Chromium drops it when parsing, so check the stylesheet's own text
  const css = await page.evaluate(async () => (await fetch('styles.css')).text());
  expect(css).toMatch(/(^|\n)body\{[^}]*-webkit-touch-callout:none/);
  expect(r.name).not.toBe('none');                    // typing fields stay selectable
  expect(r.story).not.toBe('none');                   // and so do the stories
  expect(r.downPrevented).toBe(true);
  expect(r.menuPrevented).toBe(true);
  expect(r.selectPrevented).toBe(true);
  if (r.touchPrevented !== null) expect(r.touchPrevented).toBe(true);
  expect(r.tapHighlight).toBe('rgba(0, 0, 0, 0)');
  await context.close();
});
