// Checks shim-supabase-room.js (the multiplayer used on the public website)
// against a stand-in for supabase-js, with two tabs of one browser.
const path = require('path');
const { test, expect } = require('@playwright/test');
const MOCK = path.join(__dirname, 'mock-supabase.js');

async function tab(context) {
  const page = await context.newPage();
  await page.route('**/vendor/supabase-js-*.js', route => route.fulfill({ path: MOCK, contentType: 'text/javascript' }));
  return page;
}

test('tables work over Supabase Realtime: join, place, drag, remove', async ({ browser }) => {
  const context = await browser.newContext();
  const a = await tab(context), b = await tab(context);

  await a.goto('/?supabase');
  await a.fill('#nameInput', 'Ajay'); await a.click('#lvlMedium'); await a.click('#startBtn');
  await expect(a.locator('#players')).toContainText('Ajay');
  const code = (await a.evaluate(() => location.hash)).replace('#table-', '');
  expect(code).toMatch(/^[a-z0-9]{5}$/);

  await b.goto('/?supabase#table-' + code);
  await expect(b.locator('#invitePop')).toBeVisible();
  await b.fill('#popName', 'Priya'); await b.click('#popJoin');
  await expect(b.locator('#menu')).toHaveClass(/gone/);
  await expect(a.locator('#players')).toContainText('Priya');
  await expect(b.locator('#levelTag')).toHaveText('Medium');

  // a piece Ajay places shows as placed for Priya
  await a.evaluate(() => mjDebug.placeOne());
  await expect(b.locator('#placed')).toHaveText('1');

  // while Ajay drags, Priya sees that piece held and following
  const before = await a.evaluate(() => mjDebug.pieces());
  let id = null;
  for (let y = 160; y < 700 && id === null; y += 18) {
    await a.mouse.move(110, y); await a.mouse.down(); await a.mouse.move(114, y + 2);
    const now = await a.evaluate(() => mjDebug.pieces());
    const moved = now.find((p, i) => !p.locked && Math.abs(p.x - before[i].x) > 0.001);
    if (moved) id = moved.id; else await a.mouse.up();
  }
  expect(id).not.toBeNull();
  for (let i = 1; i <= 20; i++) { await a.mouse.move(114 + i * 12, 300); await a.waitForTimeout(20); }
  await expect.poll(() => b.evaluate(i => mjDebug.pieces()[i].heldBy, id)).not.toBeNull();
  await a.mouse.up();
  const finalA = (await a.evaluate(() => mjDebug.pieces()))[id];
  await expect.poll(async () => {
    const p = (await b.evaluate(() => mjDebug.pieces()))[id];
    return Math.abs(p.x - finalA.x) < 0.01 && Math.abs(p.y - finalA.y) < 0.01 && !p.heldBy;
  }).toBe(true);

  // the leader removes Priya
  await a.click('#players button.chip');
  await a.click('#kickYes');
  await expect(b.locator('#menuMsg')).toHaveText('Ajay removed you from the table.');
  await expect(a.locator('#players')).not.toContainText('Priya');
});
