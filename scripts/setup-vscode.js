// Copies the VS Code settings in vscode/ into .vscode/ (run once: npm run setup:vscode).
'use strict';
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..'), from = path.join(root, 'vscode'), to = path.join(root, '.vscode');
fs.mkdirSync(to, { recursive: true });
for (const f of fs.readdirSync(from)) {
  const dest = path.join(to, f);
  if (fs.existsSync(dest)) { console.log('kept your existing .vscode/' + f); continue; }
  fs.copyFileSync(path.join(from, f), dest);
  console.log('added .vscode/' + f);
}
console.log('Done. Reload VS Code if Run and Debug does not show "Server + 2 players".');
