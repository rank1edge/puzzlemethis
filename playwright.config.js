// Browser tests for multiplayer. Starts the local server on port 4399 for the run.
const { defineConfig } = require('@playwright/test');
module.exports = defineConfig({
  testDir: 'tests/e2e',
  timeout: 30000,
  use: {
    baseURL: 'http://localhost:4399',
    viewport: { width: 1280, height: 800 },
    // optional: point at an installed Chrome instead of Playwright's own browser
    launchOptions: process.env.MJ_CHROME ? { executablePath: process.env.MJ_CHROME } : {}
  },
  webServer: { command: 'node server.js 4399 --quiet', url: 'http://localhost:4399', reuseExistingServer: false }
});
