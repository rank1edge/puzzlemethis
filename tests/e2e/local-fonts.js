// Serves the game's Google Fonts from the @fontsource packages (dev dependencies),
// so tests measure text in the real typefaces even without internet access.
// Long German words or Japanese text only wrap or overflow the way they do for
// players when the real fonts are used.
const fs = require('fs');
const path = require('path');

const FONTS = path.join(__dirname, '..', '..', 'node_modules', '@fontsource');
const slug = family => family.trim().toLowerCase().replace(/\s+/g, '-');

function cssFor(url) {
  const out = [];
  for (const fam of new URL(url).searchParams.getAll('family')) {
    const [name, spec] = fam.split(':');
    const s = slug(name);
    const weights = spec && spec.startsWith('wght@') ? spec.slice(5).split(';') : ['400'];
    for (const w of weights) {
      const file = path.join(FONTS, s, w + '.css');
      if (!fs.existsSync(file)) continue;
      out.push(fs.readFileSync(file, 'utf8').replace(/url\(\.\/files\//g, 'url(https://fonts.gstatic.com/fontsource/' + s + '/files/'));
    }
  }
  return out.join('\n');
}

async function useLocalFonts(context) {
  if (!fs.existsSync(FONTS)) return false;                 // not installed: tests use fallback fonts
  await context.route('https://fonts.googleapis.com/css2**', route =>
    route.fulfill({ status: 200, contentType: 'text/css', body: cssFor(route.request().url()) }));
  await context.route('https://fonts.gstatic.com/fontsource/**', route => {
    const [, s, rest] = new URL(route.request().url()).pathname.match(/^\/fontsource\/([^/]+)\/(.+)$/) || [];
    const file = s && path.join(FONTS, s, rest);
    if (!file || !file.startsWith(FONTS) || !fs.existsSync(file)) return route.fulfill({ status: 404, body: '' });
    route.fulfill({ status: 200, contentType: 'font/woff2', body: fs.readFileSync(file) });
  });
  return true;
}

module.exports = { useLocalFonts };
