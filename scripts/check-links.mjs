/* Asserts that every internal href the site emits resolves to a real route.

   The nav, footer and feature grids are driven by data files written against the
   full route matrix in `product-spec.md` — most of which does not exist. That is
   fine as a plan and fatal as a link, so this walks the App Router tree, builds
   the set of routes that actually exist, and fails if any emitted href is not
   one of them.

   Run: npm run check:links */

import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname.replace(/\/$/, '');
const APP = join(ROOT, 'app');

/* ---- 1. What routes exist? ---------------------------------------------- */

function collectRoutes(dir, segments = []) {
  const routes = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (!statSync(full).isDirectory()) {
      if (/^page\.tsx?$/.test(entry)) routes.push('/' + segments.join('/'));
      continue;
    }
    // Route groups `(name)` do not appear in the URL.
    if (entry.startsWith('(') && entry.endsWith(')')) {
      routes.push(...collectRoutes(full, segments));
      continue;
    }
    if (entry.startsWith('_') || entry === 'node_modules') continue;
    routes.push(...collectRoutes(full, [...segments, entry]));
  }
  return routes;
}

const existing = collectRoutes(APP).map((r) => (r === '/' ? '/' : r.replace(/\/$/, '')));

/* ---- 2. What hrefs does the site emit? ---------------------------------- */

const SOURCE_DIRS = ['app', 'components', 'lib'];
const HREF_RE = /href[=:]\s*['"`](\/[^'"`{}\s]*)['"`]/g;

function walk(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...walk(full));
    else if (/\.tsx?$/.test(entry)) out.push(full);
  }
  return out;
}

const emitted = [];
for (const d of SOURCE_DIRS) {
  for (const file of walk(join(ROOT, d))) {
    const src = readFileSync(file, 'utf8');
    for (const m of src.matchAll(HREF_RE)) {
      emitted.push({ href: m[1], file: relative(ROOT, file) });
    }
  }
}

/* ---- 3. Compare ---------------------------------------------------------- */

function matches(href) {
  // Strip query and fragment; a bare "/#pricing" targets the homepage.
  const path = href.replace(/[?#].*$/, '') || '/';
  if (existing.includes(path)) return true;
  // Dynamic segments: /legal/terms matches the /legal/[page] route.
  const parts = path.split('/').filter(Boolean);
  return existing.some((route) => {
    const rp = route.split('/').filter(Boolean);
    if (rp.length !== parts.length) return false;
    return rp.every((seg, i) => /^\[.+\]$/.test(seg) || seg === parts[i]);
  });
}

const broken = emitted.filter((e) => !matches(e.href));

console.log(`Routes found (${existing.length}):`);
for (const r of [...existing].sort()) console.log('  ' + r);
console.log(`\nInternal hrefs checked: ${emitted.length}`);

if (broken.length) {
  console.error(`\n✗ ${broken.length} href(s) point at a route that does not exist:\n`);
  const seen = new Set();
  for (const b of broken) {
    const k = `${b.href} ${b.file}`;
    if (seen.has(k)) continue;
    seen.add(k);
    console.error(`  ${b.href}\n      ${b.file}`);
  }
  console.error(
    '\nEither build the route, or remove the href so the label renders as plain text.',
  );
  process.exit(1);
}

console.log('\n✓ every internal href resolves');
