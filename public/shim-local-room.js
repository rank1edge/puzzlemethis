// Local stand-in for the claude.ai "room" capability, talking to server.js.
// Only used when the page is opened outside Claude (window.claude is missing).
(function () {
  if (window.claude) return;
  const ABC = 'abcdefghijklmnopqrstuvwxyz0123456789';
  const rnd = n => Array.from(crypto.getRandomValues(new Uint8Array(n)), b => ABC[b % 36]).join('');
  const PEER = rnd(12);                       // new for every page load, like the real service
  let BY;                                     // stays the same for this tab across reloads
  try { BY = sessionStorage.getItem('mj.by'); if (!BY) { BY = rnd(16); sessionStorage.setItem('mj.by', BY); } } catch (e) { BY = rnd(16); }

  function join(name) {
    return new Promise((resolve, reject) => {
      const topics = new Map(), peerFns = new Set(), connFns = new Set();
      let peers = Object.freeze([]), serverPeers = [], myPres = {}, connected = false, left = false, resolved = false, presTimer = 0;
      const es = new EventSource('/events?room=' + encodeURIComponent(name) + '&peer=' + PEER + '&by=' + BY);
      const post = b => fetch('/send', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(Object.assign({ room: name, peer: PEER }, b))
      });
      const stamp = (peer, by) => ({ peer, by: by || null, isMe: peer === PEER, sameTab: peer === PEER, kind: 'viewer', guest: false });

      function applyPeers() {
        const prev = new Map(peers.map(p => [p.peer, p]));
        const next = serverPeers.map(sp => {
          const pres = sp.peer === PEER ? myPres : (sp.presence || {});
          const old = prev.get(sp.peer);
          if (old && JSON.stringify(old.presence) === JSON.stringify(pres)) return old;
          return Object.freeze(Object.assign(stamp(sp.peer, sp.by), { presence: Object.freeze(JSON.parse(JSON.stringify(pres))), updatedAt: Date.now() }));
        });
        if (!next.some(p => p.peer === PEER)) next.push(Object.freeze(Object.assign(stamp(PEER, BY), { presence: Object.freeze(Object.assign({}, myPres)), updatedAt: Date.now() })));
        const nextIds = new Set(next.map(p => p.peer));
        const joined = next.filter(p => !prev.has(p.peer));
        const gone = [...prev.values()].filter(p => !nextIds.has(p.peer));
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

      const api = Object.freeze({
        name,
        emit(topic, data) {
          if (left) return Promise.reject({ code: 'invalid_argument', message: 'You left this room.' });
          if (!connected) return Promise.resolve();
          return post({ type: 'emit', topic, data }).then(() => {}, () => {});
        },
        on(topic, fn) {
          if (!topics.has(topic)) topics.set(topic, new Set());
          topics.get(topic).add(fn);
          return () => { const s = topics.get(topic); if (s) s.delete(fn); };
        },
        presence(patch) {
          for (const k in patch) { if (patch[k] === null) delete myPres[k]; else myPres[k] = patch[k]; }
          applyPeers();
          if (!presTimer) presTimer = setTimeout(() => {
            presTimer = 0;
            if (!left && connected) post({ type: 'presence', presence: myPres }).catch(() => {});
          }, 33);
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
        leave() { left = true; es.close(); topics.clear(); peerFns.clear(); connFns.clear(); return Promise.resolve(); }
      });

      es.onmessage = ev => {
        let m; try { m = JSON.parse(ev.data); } catch (e) { return; }
        if (m.kind === 'hello') {
          setConnected(true);
          if (Object.keys(myPres).length) post({ type: 'presence', presence: myPres }).catch(() => {});
          if (!resolved) { resolved = true; resolve(api); }
        } else if (m.kind === 'peers') {
          serverPeers = Array.isArray(m.peers) ? m.peers : [];
          applyPeers();
        } else if (m.kind === 'msg') {
          const fns = topics.get(m.topic);
          if (!fns) return;
          const msg = Object.freeze(Object.assign(stamp(m.peer, m.by), { topic: m.topic, data: m.data }));
          fns.forEach(fn => { try { fn(msg); } catch (e) { console.error(e); } });
        }
      };
      // No relay server here (for example a static host like Vercel): give up at
      // once so the game falls back to solo play instead of waiting.
      es.onerror = () => {
        if (!resolved) { resolved = true; es.close(); reject({ code: 'upstream_error', message: 'No multiplayer server here.' }); }
        else setConnected(false);
      };
      setTimeout(() => { if (!resolved) { resolved = true; es.close(); reject({ code: 'upstream_error', message: 'Local server did not answer.' }); } }, 5000);
    });
  }

  window.claude = Object.freeze({ use: n => Promise.resolve(n === 'room' ? Object.freeze({ join }) : null) });
})();
