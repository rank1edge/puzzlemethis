// Multiplayer on a normal website (e.g. Vercel), using Supabase Realtime.
//
// Gives the game the same `window.claude.use('room')` API it gets on claude.ai,
// so game.js doesn't change. It turns itself on only when:
//   - the page isn't inside Claude (window.claude is missing),
//   - supabase-js and window.MJ_SUPABASE (config.js) are loaded, and
//   - the page isn't on localhost or your local network, where server.js and
//     shim-local-room.js are used instead. Add ?supabase to the address to use
//     Supabase locally too.
//
// How it maps onto Supabase (free plan: 100 messages/s, 20 presence updates/s):
//   - events (move, lock, round, ...)  -> Broadcast messages on the table's channel
//   - presence: name, colour, role ... -> Presence (changes rarely, so few updates)
//   - presence: cur, drag (pointer and the piece being dragged) -> a Broadcast
//     "motion" message, sent at most ~12 times a second and only when it changes.
//     The game eases between updates, so motion still looks smooth.
(function () {
  if (window.claude) return;
  const cfg = window.MJ_SUPABASE;
  const local = /^(localhost|127\.0\.0\.1|\[::1\]|10\.\d+\.\d+\.\d+|192\.168\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)$/.test(location.hostname);
  const forced = /[?&]supabase\b/.test(location.search);
  if (!cfg || !cfg.url || !cfg.key || !window.supabase || (local && !forced)) return;

  const client = window.supabase.createClient(cfg.url, cfg.key, { auth: { persistSession: false, autoRefreshToken: false } });
  const TOPICS = ['sync.req', 'sync.state', 'round', 'move', 'moves', 'lock', 'kick'];
  const MOTION_KEYS = ['cur', 'drag'];
  const MOTION_MS = 80;                       // ~12 motion messages a second at most
  // Supabase limits presence updates per client and closes the channel of a
  // client that goes over, so presence is only re-sent when a value really
  // changes (name, round, leader's removal list), and at most twice a second.
  const TRACK_MS = 500;

  const ABC = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rnd = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => ABC[b % 36]).join('');
  const PEER = rnd(12);                       // new for every page load
  let BY;                                     // the same for this tab across reloads
  try { BY = sessionStorage.getItem('mj.by'); if (!BY) { BY = rnd(16); sessionStorage.setItem('mj.by', BY); } } catch (e) { BY = rnd(16); }
  const okPeer = s => typeof s === 'string' && /^[a-z0-9]{6,32}$/.test(s);

  function join(name) {
    return new Promise((resolve, reject) => {
      const handlers = new Map(), peerFns = new Set(), connFns = new Set();
      const motion = new Map();                // peer -> { cur, drag } from motion messages
      let peers = Object.freeze([]), base = {}, myMotion = {}, connected = false, left = false, settled = false;
      let trackTimer = 0, motionTimer = 0, lastMotion = '';

      let ch = null, retryTimer = 0;
      const stamp = (peer, by) => ({ peer, by: by || null, isMe: peer === PEER, sameTab: peer === PEER, kind: 'viewer', guest: false });

      // Rebuild the peer list from Supabase presence + motion, reusing unchanged entries.
      function rebuild() {
        const state = ch.presenceState();
        const prev = new Map(peers.map(p => [p.peer, p]));
        const next = [];
        for (const key of Object.keys(state)) {
          if (!okPeer(key)) continue;
          const meta = state[key][state[key].length - 1] || {};
          let pres = {};
          if (key === PEER) pres = Object.assign({}, base, myMotion);
          else {
            try { pres = JSON.parse(meta.p || '{}'); } catch (e) { pres = {}; }
            if (!pres || typeof pres !== 'object' || Array.isArray(pres)) pres = {};
            const mo = motion.get(key);
            if (mo) for (const k of MOTION_KEYS) if (mo[k] !== undefined) pres[k] = mo[k];
          }
          const old = prev.get(key);
          if (old && JSON.stringify(old.presence) === JSON.stringify(pres)) { next.push(old); continue; }
          next.push(Object.freeze(Object.assign(stamp(key, okPeer(meta.by) ? meta.by : null), {
            presence: Object.freeze(pres), updatedAt: Date.now()
          })));
        }
        if (!next.some(p => p.peer === PEER)) {
          next.push(Object.freeze(Object.assign(stamp(PEER, BY), { presence: Object.freeze(Object.assign({}, base, myMotion)), updatedAt: Date.now() })));
        }
        const ids = new Set(next.map(p => p.peer));
        for (const k of [...motion.keys()]) if (!ids.has(k)) motion.delete(k);
        const joined = next.filter(p => !prev.has(p.peer));
        const gone = [...prev.values()].filter(p => !ids.has(p.peer));
        const updated = next.filter(p => prev.has(p.peer) && prev.get(p.peer) !== p);
        if (!joined.length && !gone.length && !updated.length) return;
        peers = Object.freeze(next);
        const change = { peers, joined, left: gone, updated };
        peerFns.forEach(fn => { try { fn(change); } catch (e) { console.error(e); } });
      }
      function setConnected(v) {
        if (connected === v) return;
        connected = v;
        connFns.forEach(fn => { try { fn(v); } catch (e) { console.error(e); } });
      }
      let lastTracked = '';
      function flushTrack() {
        trackTimer = 0;
        const p = JSON.stringify(base);
        if (left || !connected || p === lastTracked) return;
        lastTracked = p;
        ch.track({ by: BY, p }).catch(() => {});
      }
      function flushMotion() {
        motionTimer = 0;
        const s = JSON.stringify(myMotion);
        if (left || !connected || s === lastMotion) return;
        lastMotion = s;
        ch.send({ type: 'broadcast', event: 'mj.motion', payload: { p: PEER, m: myMotion } }).catch(() => {});
      }

      const api = Object.freeze({
        name,
        emit(topic, data) {
          if (left) return Promise.reject({ code: 'invalid_argument', message: 'You left this room.' });
          if (!connected) return Promise.resolve();
          return ch.send({ type: 'broadcast', event: topic, payload: { p: PEER, b: BY, d: data } }).then(() => {}, () => {});
        },
        on(topic, fn) {
          if (!handlers.has(topic)) handlers.set(topic, new Set());
          handlers.get(topic).add(fn);
          return () => { const s = handlers.get(topic); if (s) s.delete(fn); };
        },
        presence(patch) {
          let baseChanged = false, motionChanged = false;
          for (const k in patch) {
            const target = MOTION_KEYS.includes(k) ? myMotion : base;
            const before = JSON.stringify(target[k]);
            if (patch[k] === null) delete target[k]; else target[k] = patch[k];
            if (JSON.stringify(target[k]) === before) continue;   // unchanged: send nothing
            if (target === base) baseChanged = true; else motionChanged = true;
          }
          if (!baseChanged && !motionChanged) return Promise.resolve();
          rebuild();
          if (baseChanged && !trackTimer) trackTimer = setTimeout(flushTrack, TRACK_MS);
          if (motionChanged && !motionTimer) motionTimer = setTimeout(flushMotion, MOTION_MS);
          return Promise.resolve();
        },
        peers() { return peers; },
        onPeers(fn) {
          peerFns.add(fn);
          queueMicrotask(() => { if (peerFns.has(fn)) fn({ peers, joined: peers, left: [], updated: [] }); });
          return () => peerFns.delete(fn);
        },
        connected() { return connected; },
        onConnection(fn) {
          connFns.add(fn);
          queueMicrotask(() => { if (connFns.has(fn)) fn(connected); });
          return () => connFns.delete(fn);
        },
        leave() {
          left = true; clearTimeout(retryTimer); handlers.clear(); peerFns.clear(); connFns.clear();
          return ch.untrack().catch(() => {}).then(() => client.removeChannel(ch)).then(() => {}, () => {});
        }
      });

      // Open the table's channel. If Supabase drops it later (network change, a
      // server restart, a rate limit), open a fresh one so the table carries on.
      function openChannel() {
        ch = client.channel('mj-' + name, {
          config: { broadcast: { self: true, ack: false }, presence: { key: PEER } }
        });
        for (const topic of TOPICS) {
          ch.on('broadcast', { event: topic }, ({ payload }) => {
            if (!payload || !okPeer(payload.p)) return;
            const fns = handlers.get(topic);
            if (!fns) return;
            const msg = Object.freeze(Object.assign(stamp(payload.p, okPeer(payload.b) ? payload.b : null), { topic, data: payload.d }));
            fns.forEach(fn => { try { fn(msg); } catch (e) { console.error(e); } });
          });
        }
        ch.on('broadcast', { event: 'mj.motion' }, ({ payload }) => {
          if (!payload || !okPeer(payload.p) || payload.p === PEER || !payload.m || typeof payload.m !== 'object') return;
          motion.set(payload.p, { cur: payload.m.cur ?? null, drag: payload.m.drag ?? null });
          rebuild();
        });
        ch.on('presence', { event: 'sync' }, rebuild);
        ch.on('presence', { event: 'join' }, rebuild);
        ch.on('presence', { event: 'leave' }, rebuild);
        const mine = ch;
        mine.subscribe(status => {
          if (mine !== ch) return;                       // an old channel we already replaced
          if (status === 'SUBSCRIBED') {
            setConnected(true);
            lastTracked = JSON.stringify(base);
            mine.track({ by: BY, p: lastTracked }).catch(() => {});
            if (!settled) { settled = true; resolve(api); }
          } else if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT' || status === 'CLOSED') {
            setConnected(false);
            if (!settled) {
              settled = true; client.removeChannel(mine);
              reject({ code: 'upstream_error', message: 'Could not reach Supabase Realtime (' + status + ').' });
            } else if (!left && !retryTimer) {
              client.removeChannel(mine);
              retryTimer = setTimeout(() => { retryTimer = 0; if (!left) openChannel(); }, 1500);
            }
          }
        });
      }
      openChannel();
      setTimeout(() => { if (!settled) { settled = true; client.removeChannel(ch); reject({ code: 'upstream_error', message: 'Supabase Realtime did not answer.' }); } }, 8000);
    });
  }

  window.claude = Object.freeze({ use: n => Promise.resolve(n === 'room' ? Object.freeze({ join }) : null) });
})();
