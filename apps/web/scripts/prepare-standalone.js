const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const standalone = path.join(root, '.next', 'standalone');

if (!fs.existsSync(standalone)) {
  throw new Error('Next.js standalone output not found. Run next build first.');
}

const staticSource = path.join(root, '.next', 'static');
const staticTarget = path.join(standalone, '.next', 'static');
fs.mkdirSync(path.dirname(staticTarget), { recursive: true });
fs.cpSync(staticSource, staticTarget, { recursive: true });

const publicSource = path.join(root, 'public');
const publicTarget = path.join(standalone, 'public');
if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicTarget, { recursive: true });
}

console.log('Standalone assets prepared.');
