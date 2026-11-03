// Language switching: English and Russian.
const { test, expect } = require('@playwright/test');

test('every language has every interface string and painting text', async ({ page }) => {
  await page.goto('/');
  expect(await page.evaluate(() => mjDebug.missingKeys())).toEqual({ en: [], ru: [] });
  expect(await page.evaluate(() => mjDebug.missingPaintingText())).toEqual({ ru: [] });
});

test('switching to Russian translates the menu, the game and the stories, and is remembered', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('#startBtn')).toHaveText('Start a table');
  await page.selectOption('#langSelect', 'ru');
  await expect(page.locator('#startBtn')).toHaveText('Открыть стол');
  await expect(page.locator('#lvlHard b')).toHaveText('Сложный');
  await expect(page.locator('#nameInput')).toHaveAttribute('placeholder', 'Введите имя');
  expect(await page.evaluate(() => document.documentElement.lang)).toBe('ru');
  // Cyrillic fonts are switched in
  expect(await page.evaluate(() => getComputedStyle(document.body).fontFamily)).toContain('Golos Text');

  // remembered on reload
  await page.reload();
  await expect(page.locator('#startBtn')).toHaveText('Открыть стол');
  await expect(page.locator('#langSelect')).toHaveValue('ru');

  // in a game: header, players strip, gallery and the story card
  await page.fill('#nameInput', 'Аня'); await page.click('#startBtn');
  await expect(page.locator('#artTitle')).toHaveText('Мона Лиза');
  await expect(page.locator('#levelTag')).toHaveText('Лёгкий');
  await expect(page.locator('#inviteBtn')).toHaveText('Пригласить друзей');
  await page.click('#galleryBtn');
  await expect(page.locator('#g-starry-night b')).toHaveText('Звёздная ночь');
  await page.click('#galClose');
  await page.click('#storyBtn');
  await expect(page.locator('#iArtist')).toHaveText('Леонардо да Винчи');
  await expect(page.locator('#iStory p').first()).toContainText('Лиза Герардини');

  // switching back mid-game relabels the open card in place
  await page.selectOption('#langSelect', 'en');
  await expect(page.locator('#infoCard')).toHaveClass(/show/);
  await expect(page.locator('#iArtist')).toHaveText('Leonardo da Vinci');
  await expect(page.locator('#artTitle')).toHaveText('Mona Lisa');
  await expect(page.locator('#storyBtn')).toHaveText('Story');
});

test('Russian plurals: 1 фрагмент, 2 фрагмента, 5 фрагментов', async ({ page }) => {
  await page.goto('/');
  await page.selectOption('#langSelect', 'ru');
  await page.fill('#nameInput', 'Аня'); await page.click('#startBtn');
  await expect(page.locator('#artTitle')).toHaveText('Мона Лиза');
  await page.evaluate(() => mjDebug.placeOne());
  await page.click('#menuBtn');
  // "Вы собрали 1 из 16 фрагментов": 16 takes the "many" form
  await expect(page.locator('#exitNote')).toContainText('Вы собрали 1 из 16 фрагментов картины «Мона Лиза».');
});

test('each player sees their own language at a shared table', async ({ browser }) => {
  const a = await (await browser.newContext()).newPage();
  const b = await (await browser.newContext({ locale: 'ru-RU' })).newPage();
  await a.goto('/'); await a.fill('#nameInput', 'Ajay'); await a.click('#startBtn');
  await expect(a.locator('#players')).toContainText('Ajay');
  const code = await a.evaluate(() => location.pathname.slice(1));
  // a Russian browser starts in Russian without choosing it
  await b.goto('/' + code);
  await expect(b.locator('#popJoin')).toHaveText('Сесть за стол');
  await b.fill('#popName', 'Аня'); await b.click('#popJoin');
  await expect(b.locator('#artTitle')).toHaveText('Мона Лиза');
  await expect(a.locator('#artTitle')).toHaveText('Mona Lisa');
  await expect(a.locator('#players')).toContainText('Аня');
  await expect(b.locator('#players')).toContainText('ведущий');
  await expect(a.locator('#players')).toContainText('leader');
});
