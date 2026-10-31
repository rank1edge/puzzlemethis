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
| `npm run test:e2e` | Browser tests with two players at one table (see below) |
| `npm run setup:vscode` | Copy the VS Code launch, task and settings files into `.vscode/` (run once) |
| `npm run build` | Build `dist/masterpiece-jigsaw.html`, the single-file page published on claude.ai |

### Browser tests

```bash
npm install
npx playwright install chromium   # first time only
npm run test:e2e
```

They start their own server on port 4399 and cover joining by link, the leader removing a player who then can't rejoin, and only the leader choosing the painting. Set `MJ_CHROME` to an installed Chrome's path to use it instead of Playwright's browser.

## Project layout

```
server.js                 static files + local room relay (Server-Sent Events in, POST out)
public/
  index.html              markup: header, table, main menu and cards
  styles.css              design tokens (light and dark) and layout
  game.js                 puzzle, drawing, input, menu and table sync
  paintings.js            the collection and the stories
  shim-local-room.js      local stand-in for claude.ai's room service
  images/<id>.jpg         one image per painting
scripts/build-artifact.js bundles public/ into one file for claude.ai
scripts/setup-vscode.js   copies vscode/ into .vscode/
vscode/                   VS Code launch, task and settings files
tests/server.test.js      relay tests (node:test)
tests/e2e/                Playwright two-player tests
```

## How multiplayer works

On claude.ai the page uses the artifact **room** capability (`window.claude.use('room')`). Locally, `shim-local-room.js` provides the same API, backed by `server.js`. The game code is identical in both places.

Each table is a named room, `t-<code>`. Every tab sets its **presence** (`name`, colour `c`, `since`, `role`, round `rd`, pointer `cur`, the piece being dragged `drag: [id, x, y]`, and for the leader the removal lists `ban` and `bp`) and sends these events:

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

The leader is whoever started the table. If they leave, the earliest remaining player takes over. Removal is enforced by each player's browser, which stops normal use but not deliberate tampering.

## Adding a painting

1. Put a JPEG at `public/images/<id>.jpg`, around 680px on the long side.
2. Add an entry with the same `id` to `public/paintings.js`.
3. Use public-domain works only.

## Publishing changes to claude.ai

Run `npm run build`, then ask Claude to publish `dist/masterpiece-jigsaw.html` to the existing artifact. It needs the `room` and `user` capabilities, with the seven topics above opened to the `interact` level.

## Deploying to Vercel

`vercel.json` serves `public/` as a static site with no build step. Import the repo in Vercel, or run `npx vercel`, and accept the defaults.

Solo play works fully there. Multiplayer does not yet: Vercel serves static files and short-lived functions, so it can't run `server.js`, which keeps every table's open connections in memory. On a static host the page notices there's no relay and falls back to solo play, and **Invite friends** says tables can't connect. Making tables work on Vercel needs a hosted realtime service, such as Supabase Realtime, behind the same room API that `shim-local-room.js` provides.
