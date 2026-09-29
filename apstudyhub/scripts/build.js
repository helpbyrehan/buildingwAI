const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname, '..');
const out = path.join(root, 'public');
fs.rmSync(out, { recursive: true, force: true });
fs.mkdirSync(out, { recursive: true });
for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
  if (entry.name === 'public') continue;
  if (entry.name.endsWith('.html') || entry.name === 'assets' ||
      (entry.isDirectory() && fs.existsSync(path.join(root, entry.name, 'index.html')))) {
    fs.cpSync(path.join(root, entry.name), path.join(out, entry.name), {
      recursive: true, filter: file => !path.basename(file).startsWith('.')
    });
  }
}
console.log('Built static site in public/; server code and environment files excluded.');
