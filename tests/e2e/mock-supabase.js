// Test stand-in for supabase-js: just enough of createClient().channel() for
// shim-supabase-room.js, carried between tabs of one browser by BroadcastChannel.
// Used only by supabase-shim.spec.js, which serves it in place of the real library.
(function () {
  class MockChannel {
    constructor(name, opts) {
      this.key = opts.config.presence.key; this.self = !!opts.config.broadcast.self;
      this.binds = []; this.state = {}; this.mine = null; this.closed = false;
      this.bc = new BroadcastChannel('mock-rt-' + name);
      this.bc.onmessage = e => this._in(e.data);
      addEventListener('pagehide', () => this._close());
    }
    on(type, filter, cb) { this.binds.push({ type, event: filter.event, cb }); return this; }
    subscribe(cb) { setTimeout(() => { cb('SUBSCRIBED'); this.bc.postMessage({ k: 'hello' }); }, 30); return this; }
    send({ event, payload }) {
      const m = { k: 'bc', event, payload };
      this.bc.postMessage(m); if (this.self) setTimeout(() => this._in(m), 0);
      return Promise.resolve('ok');
    }
    track(meta) { this.mine = meta; this.state[this.key] = [meta]; this._pres('sync'); this.bc.postMessage({ k: 'pres', key: this.key, meta }); return Promise.resolve('ok'); }
    untrack() { this.mine = null; delete this.state[this.key]; if (!this.closed) this.bc.postMessage({ k: 'pres', key: this.key, meta: null }); return Promise.resolve('ok'); }
    presenceState() { return JSON.parse(JSON.stringify(this.state)); }
    _close() { if (this.closed) return; if (this.mine) this.untrack(); this.closed = true; this.bc.close(); }
    _in(m) {
      if (this.closed) return;
      if (m.k === 'bc') { for (const b of this.binds) if (b.type === 'broadcast' && b.event === m.event) b.cb({ type: 'broadcast', event: m.event, payload: m.payload }); }
      else if (m.k === 'pres') { if (m.meta) this.state[m.key] = [m.meta]; else delete this.state[m.key]; this._pres(m.meta ? 'join' : 'leave'); }
      else if (m.k === 'hello') { if (this.mine) this.bc.postMessage({ k: 'pres', key: this.key, meta: this.mine }); }
    }
    _pres(ev) { for (const b of this.binds) if (b.type === 'presence' && (b.event === ev || b.event === 'sync')) b.cb({}); }
  }
  window.supabase = {
    createClient: () => ({
      channel: (name, opts) => new MockChannel(name, opts),
      removeChannel: ch => { ch._close(); return Promise.resolve('ok'); }
    })
  };
})();
