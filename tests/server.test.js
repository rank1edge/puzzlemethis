// Tests for the local room server.  Run: npm test
'use strict';
const { test, before, after } = require('node:test');
const assert = require('node:assert/strict');
const { createServer } = require('../server.js');

let server, base;
before(() => new Promise(r => { server = createServer(); server.listen(0, '127.0.0.1', () => { base = 'http://127.0.0.1:' + server.address().port; r(); }); }));
after(() => new Promise(r => { server.closeAllConnections && server.closeAllConnections(); server.close(r); }));

// Opens an event stream for one tab and collects what it receives.
async function connect(room, peer, by) {
  const ctrl = new AbortController();
  const res = await fetch(`${base}/events?room=${room}&peer=${peer}${by ? '&by=' + by : ''}`, { signal: ctrl.signal });
  assert.equal(res.status, 200);
  const got = [], waiters = [];
  (async () => {
    const reader = res.body.getReader(), dec = new TextDecoder(); let buf = '';
    try {
      for (;;) {
        const { value, done } = await reader.read(); if (done) break;
        buf += dec.decode(value, { stream: true });
        let i;
        while ((i = buf.indexOf('\n\n')) >= 0) {
          const chunk = buf.slice(0, i); buf = buf.slice(i + 2);
          const line = chunk.split('\n').find(l => l.startsWith('data: '));
          if (!line) continue;
          got.push(JSON.parse(line.slice(6)));
          waiters.splice(0).forEach(w => w());
        }
      }
    } catch (e) { /* aborted */ }
  })();
  const waitFor = async (pred, ms = 2000) => {
    const t0 = Date.now();
    for (;;) {
      const hit = got.find(pred); if (hit) return hit;
      if (Date.now() - t0 > ms) throw new Error('timed out waiting for event');
      await new Promise(r => { waiters.push(r); setTimeout(r, 50); });
    }
  };
  return { got, waitFor, close: () => ctrl.abort() };
}
const send = body => fetch(base + '/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });

test('serves the game page and its files', async () => {
  const page = await fetch(base + '/');
  assert.equal(page.status, 200);
  assert.match(await page.text(), /Masterpiece Jigsaw/);
  for (const f of ['/game.js', '/paintings.js', '/styles.css', '/images/mona-lisa.jpg']) assert.equal((await fetch(base + f)).status, 200, f);
  assert.equal((await fetch(base + '/missing.js')).status, 404);
});

test('refuses paths outside public/', async () => {
  const res = await fetch(base + '/..%2Fserver.js');
  assert.notEqual(res.status, 200);
});

test('relays events to everyone in a room, sender included', async () => {
  const a = await connect('t-abcde', 'peeraaaa', 'byaaaaaa'), b = await connect('t-abcde', 'peerbbbb');
  await a.waitFor(e => e.kind === 'hello');
  await b.waitFor(e => e.kind === 'hello');
  assert.equal((await send({ room: 't-abcde', peer: 'peeraaaa', type: 'emit', topic: 'lock', data: { r: 1, i: 3 } })).status, 204);
  const ma = await a.waitFor(e => e.kind === 'msg'), mb = await b.waitFor(e => e.kind === 'msg');
  assert.deepEqual(mb.data, { r: 1, i: 3 });
  assert.equal(mb.peer, 'peeraaaa');
  assert.equal(mb.by, 'byaaaaaa');
  assert.equal(ma.topic, 'lock');
  a.close(); b.close();
});

test('keeps rooms apart', async () => {
  const a = await connect('t-room1', 'peercccc'), b = await connect('t-room2', 'peerdddd');
  await a.waitFor(e => e.kind === 'hello'); await b.waitFor(e => e.kind === 'hello');
  await send({ room: 't-room1', peer: 'peercccc', type: 'emit', topic: 'move', data: 1 });
  await a.waitFor(e => e.kind === 'msg');
  await new Promise(r => setTimeout(r, 150));
  assert.equal(b.got.filter(e => e.kind === 'msg').length, 0);
  a.close(); b.close();
});

test('shares presence and reports who left', async () => {
  const a = await connect('t-pres1', 'peereeee'), b = await connect('t-pres1', 'peerffff');
  await b.waitFor(e => e.kind === 'peers' && e.peers.length === 2);
  await send({ room: 't-pres1', peer: 'peereeee', type: 'presence', presence: { name: 'Ajay', c: 2 } });
  await b.waitFor(e => e.kind === 'peers' && e.peers.some(p => p.peer === 'peereeee' && p.presence.name === 'Ajay'));
  a.close();
  await b.waitFor(e => e.kind === 'peers' && e.peers.length === 1 && e.peers[0].peer === 'peerffff');
  b.close();
});

test('rejects bad input', async () => {
  assert.equal((await fetch(base + '/events?room=BAD!&peer=x')).status, 400);
  assert.equal((await send({ room: 't-nobody', peer: 'peergggg', type: 'emit', topic: 'move' })).status, 409);
  const a = await connect('t-bad01', 'peerhhhh'); await a.waitFor(e => e.kind === 'hello');
  assert.equal((await send({ room: 't-bad01', peer: 'peerhhhh', type: 'emit', topic: 'Bad Topic' })).status, 400);
  a.close();
});
