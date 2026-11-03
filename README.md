# Masterpiece Jigsaw

A relaxing jigsaw game of sixteen famous paintings, from the *Mona Lisa* to *The Great Wave*, each with a short story to read when you finish. Friends can share a table and solve the same puzzle together.

## Quick start

Needs Node.js 18 or newer. There are no runtime dependencies.

```bash
npm start          # http://localhost:4317
```

Open the address in two windows. Start a table in one, press **Invite friends → Copy link**, and open that link in the other window. Phones on the same Wi-Fi can join using the network address the server prints.

On Windows you can also double-click `start.bat`.

## In VS Code

Run `npm run setup:vscode` once. It copies the launch, task and settings files from `vscode/` into `.vscode/`.

- **Run and Debug → "Server + 2 players"** starts the server and opens two Chrome windows with separate profiles, so each counts as its own player. Breakpoints work in both `server.js` and `public/game.js`.
- **Terminal → Run Task** has *Start server*, *Start server (restart on change)*, *Run tests* and *Build published page*.
- Edits under `public/` show up on a browser refresh; the server sends no-cache headers. Edits to `server.js` need a restart, or use `npm run dev`.

## Scripts

| Command | What it does |
| --- | --- |
| `npm start` | Serve the game and the local multiplayer relay on port 4317 (`npm start -- 5000` for another port) |
| `npm run dev` | Same, restarting the server when `server.js` changes |
| `npm test` | Server tests with Node's built-in runner, no install needed |
| `npm run test:e2e` | All browser tests: multiplayer, languages, and every screen size (see below) |
| `npm run test:screens` | Just the screen-size tests |
| `npm run setup:vscode` | Copy the VS Code launch, task and settings files into `.vscode/` (run once) |
| `npm run build` | Build `dist/masterpiece-jigsaw.html`, the single-file page published on claude.ai |

### Browser tests

```bash
npm install
npx playwright install chromium   # first time only
npm run test:e2e
```

They start their own server on port 4399 and run in parallel. Set `MJ_CHROME` to an installed Chrome's path to use it instead of Playwright's browser.

- **`two-players.spec.js`**: joining by link, leading, removing a player, switching and finishing paintings.
- **`supabase-shim.spec.js`**: the website's multiplayer, against a stand-in for supabase-js.
- **`languages.spec.js`**: every language has every string and painting text, switching mid-game, plurals, a mixed-language table.
- **`screens.spec.js`**: nine screen sizes, from a 320 px phone and a landscape phone to a 1920 px desktop. Each walks the menu, the invite popup, the table on Hard, every card and the finished-painting bar, in all six languages. It fails on:
  - sideways scrolling, or controls off the edge;
  - cut-off or overlapping buttons;
  - cards that don't fit, or main buttons out of reach or covered;
  - controls under 40 px on touch screens;
  - a header taking too much of the screen, pieces under 16 px, or pieces outside the table.

  It also checks that touch-dragging works and never scrolls the page.

The screen tests measure text in the game's real typefaces. `tests/e2e/local-fonts.js` serves them from the `@fontsource` dev dependencies in place of Google Fonts, so the results don't depend on internet access. The Japanese families are large (about 90 MB), but they're only used by the tests and never reach the website.

## Project layout

```
server.js                 static files + local room relay (Server-Sent Events in, POST out)
public/
  index.html              markup: header, table, main menu and cards
  styles.css              design tokens (light and dark) and layout
  game.js                 puzzle, drawing, input, menu and table sync
  paintings.js            the collection and the stories (English)
  i18n.js                 English interface text, language switching, plurals, fonts
  locales/<lang>.js       one file per language: interface text, fonts, painting texts
  shim-local-room.js      local stand-in for claude.ai's room service (talks to server.js)
  shim-supabase-room.js   the same room API over Supabase Realtime, for the public website
  config.js               Supabase project URL and publishable key
  vendor/                 supabase-js, served with the site
  images/<id>.jpg         one image per painting
scripts/build-artifact.js bundles public/ into one file for claude.ai
scripts/setup-vscode.js   copies vscode/ into .vscode/
vscode/                   VS Code launch, task and settings files
tests/server.test.js      relay tests (node:test)
tests/e2e/                Playwright two-player tests
```

## How multiplayer works

On claude.ai the page uses the artifact **room** capability (`window.claude.use('room')`). Locally, `shim-local-room.js` provides the same API, backed by `server.js`. The game code is identical in both places.

Each table is a named room, `t-<code>`. Its link is the code as the page path, like `pezzi.vercel.app/ddr6y` (`vercel.json` and `server.js` serve the game for those paths). Inside Claude only a plain `#name` can travel with a link, so there it's `#ddr6y`. Old `#table-ddr6y` links still work. Every tab sets its **presence** (`name`, colour `c`, `since`, `role`, round `rd`, pointer `cur`, the piece being dragged `drag: [id, x, y]`, and for the leader the removal lists `ban` and `bp`) and sends these events:

| Topic | Sent by | Data |
| --- | --- | --- |
| `sync.req` | a joining player | `{}` asks the leader for the table |
| `sync.state` | the leader | the full table: painting, level, grid, edges, positions, placed pieces, stacking order |
| `round` | the leader | a new round, same shape as `sync.state` |
| `move` | anyone | a piece's final position when it's dropped (positions during a drag travel in presence) |
| `moves` | anyone | many positions at once, from **Tidy** |
| `lock` | anyone | a piece settled into place |
| `kick` | the leader | the removed player's peer and id |

Drags ride in presence because the room shares it about 30 times a second, coalesced, while events are meant for a few a second. Other players ease pieces and pointers toward each update, so motion stays smooth at the screen's frame rate.

The board, its guide and placed pieces are drawn once into a background layer and reused until a piece settles. Loose pieces have their shadow baked into their image, so a frame is mostly plain image copies. On localhost, `mjDebug.frameMs()` in the browser console times a redraw and `mjDebug.pieces()` lists every piece.

### Keeping it smooth

- **Two canvas layers.** The board, guide and placed pieces sit on their own canvas, redrawn only when a piece settles. The top canvas holds the loose pieces.
- **Only changed areas are redrawn.** Each frame repaints just the patches where a piece, pointer or glow was and now is, snapped to whole device pixels. If nothing moved, nothing is drawn.
- **One image for all pieces.** Pieces are cut into a single atlas canvas. Resting shadows are drawn once per distinct piece outline, not per piece or per frame.
- **Paintings preload.** Images load in the background once a table starts, and the next one as soon as a puzzle is solved.
- **Resizes are batched.** A burst of window resize events re-cuts the pieces once per frame.
- **Caching on Vercel.** `vercel.json` caches `images/` for a week and `vendor/` permanently. Pages and game code revalidate on every visit, so updates show up right away.

The leader is whoever started the table. If they leave, the earliest remaining player takes over. Removal is enforced by each player's browser, which stops normal use but not deliberate tampering.

## Adding a painting

1. Put a JPEG at `public/images/<id>.jpg`, around 680px on the long side.
2. Add an entry with the same `id` to `public/paintings.js`.
3. Add its title, artist, dates, medium, museum and story to `paintings` in each `public/locales/*.js`. `npm run test:e2e` fails until every language has it.
4. Use public-domain works only.

## Languages

English, French, German, Italian, Russian and Japanese. The dropdown in the header switches instantly, even mid-puzzle, and remembers the choice. A first visit follows the browser's language. Each player at a shared table sees their own language.

- Every visible string is looked up by key with `t('menu.start')`. In the markup, `data-i18n`, `data-i18n-placeholder`, `data-i18n-title` and `data-i18n-label` mark text, placeholders, tooltips and screen-reader labels.
- Values can hold `{placeholders}`. A value can also be plural forms, `{ one, few, many, other }`, chosen by `Intl.PluralRules` for that language.
- Russian and Japanese bring their own typefaces, because the default fonts don't cover their scripts.
- **Adding a language:** copy a file in `public/locales/`, translate it, then add it to `LOCALES` in `i18n.js` and to `MODULES` in `scripts/build-artifact.js`. Anything missing falls back to English.

## Publishing changes to claude.ai

Run `npm run build`, then ask Claude to publish `dist/masterpiece-jigsaw.html` to the existing artifact. It needs the `room` and `user` capabilities, with the seven topics above opened to the `interact` level.

## Deploying to Vercel

`vercel.json` serves `public/` as a static site with no build step. Import the repo in Vercel and deploy; no environment variables are needed.

### Multiplayer on the website: Supabase Realtime

Vercel can't run `server.js`, so on the public site tables go through Supabase Realtime instead, using `public/shim-supabase-room.js`. It gives `game.js` the same room API as the other two, so the game code is identical everywhere:

| Where the page runs | Multiplayer through |
| --- | --- |
| claude.ai | Claude's room service |
| a website such as Vercel | Supabase Realtime (`shim-supabase-room.js`) |
| localhost or your local network | `server.js` (`shim-local-room.js`); add `?supabase` to the address to use Supabase locally |

- `public/config.js` holds the Supabase project URL and publishable key. The key is meant to be public; the game uses only Realtime channels, with no database tables.
- `public/vendor/` holds supabase-js 2.117.3, so the site doesn't depend on a CDN.
- Each table is the channel `mj-t-<code>`. Events go out as Broadcast messages and names/roles as Presence. Pointer and drag positions go as a Broadcast `mj.motion` message at most about 12 times a second, because the free plan allows 20 presence updates and 100 messages a second per project.
- If Supabase can't be reached, the page falls back to solo play straight away.

`npm run test:e2e` includes a test of this shim against a stand-in for supabase-js (`tests/e2e/mock-supabase.js`), since the tests run offline.
