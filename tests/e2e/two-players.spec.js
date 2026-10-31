// Browser test: two players at one table.  Run: npm run test:e2e
// First time only: npm install && npx playwright install chromium
const { test, expect } = require('@playwright/test');

async function startTable(page, name) {
  await page.goto('/');
  await page.fill('#nameInput', name);
  await page.click('#lvlMedium');
  await page.click('#startBtn');
  await expect(page.locator('#players')).toContainText(name);
  return (await page.evaluate(() => location.hash)).replace('#table-', '');
}
async function joinByLink(page, code, name) {
  await page.goto('/#table-' + code);
  await expect(page.locator('#invitePop')).toBeVisible();
  await expect(page.locator('#popTitle')).toContainText(code.toUpperCase());
  await expect(page.locator('#popCode')).toHaveValue(code.toUpperCase());
  await page.fill('#popName', name);
  await page.click('#popJoin');
  await expect(page.locator('#invitePop')).toBeHidden();
  await expect(page.locator('#menu')).toHaveClass(/gone/);
}

test('a friend joins by link and plays at the leader\'s level', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const code = await startTable(a, 'Ajay');
  await joinByLink(b, code, 'Priya');
  await expect(a.locator('#players')).toContainText('Priya');
  await expect(b.locator('#players')).toContainText('Ajay');
  await expect(b.locator('#levelTag')).toHaveText('Medium');
  await expect(b.locator('#total')).toHaveText(await a.locator('#total').textContent());
});

test('the leader removes a friend, who cannot rejoin', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const code = await startTable(a, 'Ajay');
  await joinByLink(b, code, 'Priya');
  await a.click('#players button.chip');
  await a.click('#kickYes');
  await expect(b.locator('#menuMsg')).toHaveText('Ajay removed you from the table.');
  await expect(a.locator('#players')).not.toContainText('Priya');
  await b.fill('#codeInput', code);
  await b.click('#joinBtn');
  await expect(b.locator('#menuMsg')).toContainText("can't rejoin");
});

test('only the leader can pick the painting', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const code = await startTable(a, 'Ajay');
  await joinByLink(b, code, 'Priya');
  await b.click('#galleryBtn');
  await expect(b.locator('#galNote')).toContainText('Only Ajay');
  await expect(b.locator('#g-scream')).toBeDisabled();
  await a.click('#galleryBtn');
  await a.click('#g-scream');
  await expect(b.locator('#artTitle')).toHaveText('The Scream');
});

test('picking a painting mid-puzzle asks first, and keeping it changes nothing', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  await startTable(a, 'Ajay');
  // place one piece: drag each loose piece onto its own slot until one settles
  const placedOne = await a.evaluate(() => mjDebug.placeOne());
  expect(placedOne).toBe(true);
  await expect(a.locator('#placed')).toHaveText('1');
  await a.click('#galleryBtn');
  await a.click('#g-scream');
  await expect(a.locator('#switchCard')).toHaveClass(/show/);
  await expect(a.locator('#switchNote')).toContainText('1 of');
  await a.click('#switchKeep');
  await expect(a.locator('#artTitle')).toHaveText('Mona Lisa');
  await expect(a.locator('#placed')).toHaveText('1');
  await a.click('#galleryBtn');
  await a.click('#g-scream');
  await a.click('#switchGo');
  await expect(a.locator('#artTitle')).toHaveText('The Scream');
  await expect(a.locator('#placed')).toHaveText('0');
});

test('the leader exits to the main menu and the friend takes over', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const code = await startTable(a, 'Ajay');
  await joinByLink(b, code, 'Priya');
  await a.click('#menuBtn');
  await expect(a.locator('#exitCard')).toHaveClass(/show/);
  await expect(a.locator('#exitNote')).toContainText('takes over as leader');
  await a.click('#exitStay');
  await expect(a.locator('#menu')).toHaveClass(/gone/);
  await a.click('#menuBtn');
  await a.click('#exitGo');
  await expect(a.locator('#menu')).not.toHaveClass(/gone/);
  await expect(a.locator('#levelTag')).toHaveText('Main menu');
  await expect(b.locator('#players')).not.toContainText('Ajay');
  // Priya now leads: she can choose the painting
  await b.click('#galleryBtn');
  await expect(b.locator('#galNote')).not.toContainText('Only');
  await expect(b.locator('#g-scream')).toBeEnabled();
});

test('closing the invite popup leaves the code ready on the main menu', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext()).newPage();
  const code = await startTable(a, 'Ajay');
  await b.goto('/#table-' + code);
  await expect(b.locator('#invitePop')).toBeVisible();
  await b.click('#popClose');
  await expect(b.locator('#invitePop')).toBeHidden();
  await expect(b.locator('#menu')).not.toHaveClass(/gone/);
  await expect(b.locator('#codeInput')).toHaveValue(code.toUpperCase());
  await expect(a.locator('#players')).not.toContainText('Priya');
});
