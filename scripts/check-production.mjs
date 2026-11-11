import { readFileSync, existsSync, readdirSync } from 'node:fs';
import assert from 'node:assert/strict';

const html = readFileSync('.next/server/app/index.html', 'utf8');
for (const marker of ['DEMO PROFILE', 'Demo cleaner', 'Development preview', 'not a real cleaner']) {
  assert(!html.includes(marker), `Development fixture leaked into production: ${marker}`);
}
for (const marker of ['Clean Spaces.', 'Clear Minds.', 'Our local cleaner network is growing.', 'Cleaning Services', 'Call Sweaply']) {
  assert(html.includes(marker), `Missing required production content: ${marker}`);
}
const page = readFileSync('src/app/page.tsx', 'utf8');
let images = 0;
for (const match of page.matchAll(/(?:src=|image: )"(\/images\/[^\"]+)"/g)) {
  assert(existsSync(`public${match[1]}`), `Missing local image: ${match[1]}`);
  images++;
}
assert.equal(images, 4, 'Expected all four homepage photographs');
const routeDirectories = readdirSync('src/app', { withFileTypes: true }).filter(entry => entry.isDirectory());
assert.equal(routeDirectories.length, 0, 'Phase one should implement only the homepage');
console.log('PASS: no demo content in production, required sections rendered, four image files present, homepage-only scope.');
