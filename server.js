// Masterpiece Jigsaw: local server.
//   npm start            -> http://localhost:4317
//   npm start -- 5000    -> another port
//
// Serves public/ and stands in for the claude.ai "room" service the published
// page uses for multiplayer: each table is a named room, events are relayed to
// everyone in it, and each tab's presence (name, colour, pointer) is shared.
// Browsers receive over Server-Sent Events (GET /events) and send with
// POST /send. See public/shim-local-room.js for the browser side.

'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');

const PUBLIC = path.join(__dirname, 'public');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.jpg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml', '.json': 'application/json', '.ico': 'image/x-icon'
};

const okRoom = s => typeof s === 'string' && /^[a-z0-9][a-z0-9_.-]{0,47}$/.test(s);
const okPeer = s => typeof s === 'string' && /^[a-z0-9]{6,32}$/.test(s);
const okTopic = s => typeof s === 'string' && /^[a-z][a-z0-9_.-]{0,47}$/.test(s);
const MAX_BODY = 16 * 1024;

function createServer({ log = () => {} } = {}) {
  /** rooms: name -> Map(peer -> { res, presence, by, updatedAt }) */
  const rooms = new Map();

  const sse = (res, obj) => res.write('data: ' + JSON.stringify(obj) + '\n\n');
  function broadcastPeers(name) {
    const room = rooms.get(name);
    if (!room) return;
    const peers = [...room.entries()].map(([peer, c]) => ({ peer, by: c.by, presence: c.presence, updatedAt: c.updatedAt }));
    for (const c of room.values()) sse(c.res, { kind: 'peers', peers });
  }
  function readJson(req) {
    return new Promise((resolve, reject) => {
      let size = 0; const chunks = [];
      req.on('data', d => { size += d.length; if (size > MAX_BODY) { reject(new Error('too big')); req.destroy(); } else chunks.push(d); });
      req.on('end', () => { try { resolve(JSON.parse(Buffer.concat(chunks).toString('utf8') || '{}')); } catch (e) { reject(e); } });
      req.on('error', reject);
    });
  }
  function serveStatic(url, res) {
    let rel = decodeURIComponent(url.pathname);
    if (rel === '/') rel = '/index.html';
    const file = path.normalize(path.join(PUBLIC, rel));
    if (!file.startsWith(PUBLIC + path.sep)) { res.writeHead(403); res.end(); return; }
    fs.readFile(file, (err, buf) => {
      if (err) { res.writeHead(404, { 'Content-Type': 'text/plain' }); res.end('Not found'); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-store' });
      res.end(buf);
    });
  }

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, 'http://localhost');

    if (req.method === 'GET' && url.pathname === '/events') {
      const name = url.searchParams.get('room'), peer = url.searchParams.get('peer'), by = url.searchParams.get('by');
      if (!okRoom(name) || !okPeer(peer)) { res.writeHead(400); res.end(); return; }
      res.writeHead(200, { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-store', Connection: 'keep-alive' });
      res.write('retry: 1500\n\n');
      if (!rooms.has(name)) rooms.set(name, new Map());
      const room = rooms.get(name), prev = room.get(peer);
      room.set(peer, { res, presence: prev ? prev.presence : {}, by: okPeer(by) ? by : null, updatedAt: Date.now() });
      if (prev) { try { prev.res.end(); } catch (e) {} }
      sse(res, { kind: 'hello', peer });
      broadcastPeers(name);
      log(`+ ${peer} joined ${name} (${room.size} here)`);
      const ping = setInterval(() => res.write(': ping\n\n'), 15000);
      req.on('close', () => {
        clearInterval(ping);
        const cur = room.get(peer);
        if (cur && cur.res === res) {
          room.delete(peer);
          log(`- ${peer} left ${name} (${room.size} here)`);
          if (!room.size) rooms.delete(name); else broadcastPeers(name);
        }
      });
      return;
    }

    if (req.method === 'POST' && url.pathname === '/send') {
      let b;
      try { b = await readJson(req); } catch (e) { res.writeHead(400); res.end(); return; }
      const room = rooms.get(b.room), me = room && room.get(b.peer);
      if (!me) { res.writeHead(409); res.end(); return; }           // not in that room (left, or never joined)
      if (b.type === 'emit' && okTopic(b.topic)) {
        for (const c of room.values()) sse(c.res, { kind: 'msg', topic: b.topic, data: b.data, peer: b.peer, by: me.by });
        if (b.topic !== 'move') log(`  ${b.peer} -> ${b.topic}`);
      } else if (b.type === 'presence' && b.presence && typeof b.presence === 'object' && !Array.isArray(b.presence)) {
        me.presence = b.presence; me.updatedAt = Date.now();
        broadcastPeers(b.room);
      } else { res.writeHead(400); res.end(); return; }
      res.writeHead(204); res.end();
      return;
    }

    if (req.method === 'GET' && url.pathname === '/favicon.ico') { res.writeHead(204); res.end(); return; }
    if (req.method === 'GET') { serveStatic(url, res); return; }
    res.writeHead(405); res.end();
  });
  server.rooms = rooms;
  return server;
}

module.exports = { createServer };

if (require.main === module) {
  const port = Number(process.argv[2]) || Number(process.env.PORT) || 4317;
  const verbose = process.argv.includes('--quiet') ? () => {} : msg => console.log(msg);
  createServer({ log: verbose }).listen(port, '0.0.0.0', () => {
    console.log('\n  Masterpiece Jigsaw is running.\n');
    console.log('  On this computer:  http://localhost:' + port);
    for (const list of Object.values(os.networkInterfaces()))
      for (const a of list || []) if (a.family === 'IPv4' && !a.internal) console.log('  On your network:   http://' + a.address + ':' + port);
    console.log('\n  Open it in two windows, start a table in one and join from the other.');
    console.log('  Press Ctrl+C to stop.\n');
  });
}
