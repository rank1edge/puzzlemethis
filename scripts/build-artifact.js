// Builds the single-file page published on claude.ai from public/.
//   npm run build   ->  dist/masterpiece-jigsaw.html
//
// It inlines styles.css, paintings.js and game.js, embeds every image as a
// data URI, drops the local multiplayer shim (claude.ai provides the real
// room service), and writes only the page content, because claude.ai adds
// the <html>/<head>/<body> skeleton itself.
'use strict';
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB = path.join(ROOT, 'public');
const OUT = path.join(ROOT, 'dist', 'masterpiece-jigsaw.html');
const PAGE_URL = process.env.MJ_PAGE_URL || 'https://claude.ai/artifact/5KjkYTcjgLaWMHZVejMw9a';

const read = f => fs.readFileSync(path.join(PUB, f), 'utf8');
const html = read('index.html');
const css = read('styles.css');
const paintings = read('paintings.js').replace(/^export const PAINTINGS/m, 'const PAINTINGS');
const game = read('game.js').replace(/^import \{ PAINTINGS \} from '\.\/paintings\.js';\n/m, '');

const ids = [...paintings.matchAll(/\{ id: '([a-z0-9-]+)'/g)].map(m => m[1]);
const images = {};
for (const id of ids) {
  const buf = fs.readFileSync(path.join(PUB, 'images', id + '.jpg'));
  images[id] = { src: 'data:image/jpeg;base64,' + buf.toString('base64') };
}

const pick = (re, what) => { const m = html.match(re); if (!m) throw new Error('index.html: could not find ' + what); return m[0]; };
const head = [
  pick(/<title>.*?<\/title>/, '<title>'),
  pick(/<meta name="claude:viewport-fit-sides"[^>]*>/, 'viewport-fit meta'),
  ...html.match(/<link rel="(preconnect|stylesheet)" href="https:\/\/fonts[^>]*>/g)
].join('\n');
const body = html.slice(html.indexOf('<body>') + 6, html.indexOf('<!-- local multiplayer stand-in')).trim();

const out = [
  head,
  '<style>\n' + css + '</style>',
  '',
  body,
  '',
  '<script>',
  'window.MJ_PAGE_URL = ' + JSON.stringify(PAGE_URL) + ';',
  'window.MJ_IMAGES = ' + JSON.stringify(images) + ';',
  '</script>',
  '<script>',
  '(() => {',
  paintings,
  game,
  '})();',
  '</script>',
  ''
].join('\n');

fs.mkdirSync(path.dirname(OUT), { recursive: true });
fs.writeFileSync(OUT, out);
console.log('Built ' + path.relative(ROOT, OUT) + ' (' + (out.length / 1048576).toFixed(2) + ' MB, ' + ids.length + ' paintings)');
