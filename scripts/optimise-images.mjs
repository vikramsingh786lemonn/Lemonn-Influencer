/* Regenerates the served AVIFs in `public/` from the high-resolution sources in
   `assets-originals/` (gitignored).

   The scanner screenshots arrived as ~2 MB PNGs each — 10.1 MB for five images,
   on a marketing homepage. AVIF at q72 brings that to ~718 KB with no visible
   difference at 1:1 on the text-dense regions, which is the thing worth
   protecting in a UI screenshot.

   Run: npm run images */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';
import sharp from 'sharp';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const SRC = join(ROOT, 'assets-originals');
const OUT = join(ROOT, 'public');

const QUALITY = 72;

let sources;
try {
  sources = readdirSync(SRC).filter((f) => /\.(png|jpe?g)$/i.test(f));
} catch {
  console.error(
    `No ${SRC}.\nThe high-res sources are gitignored — ask a teammate for them, ` +
      'or skip this: the generated AVIFs in public/ are committed.',
  );
  process.exit(1);
}

let before = 0;
let after = 0;

for (const file of sources) {
  const from = join(SRC, file);
  const to = join(OUT, file.replace(/\.[^.]+$/, '.avif'));
  await sharp(from).avif({ quality: QUALITY, effort: 6 }).toFile(to);
  const b = statSync(from).size;
  const a = statSync(to).size;
  before += b;
  after += a;
  console.log(`${file} → ${(a / 1024).toFixed(0)} KB`);
}

console.log(
  `\n${(before / 1048576).toFixed(2)} MB → ${(after / 1024).toFixed(0)} KB ` +
    `(${(before / after).toFixed(1)}× smaller)`,
);
