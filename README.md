# TradeFinder

Marketing site and workspace shell for **TradeFinder** — a live market scanner for Indian
equity F&O and index options.

Next.js 15 App Router · React 19 · TypeScript · Framer Motion · Firebase Phone Auth.

---

## Getting started

```bash
npm install
npm run dev          # http://localhost:3000
```

No environment file is needed to run it. The Firebase config in
`lib/auth/firebase-config.ts` ships real values — they are public client identifiers,
not secrets, and access is gated by Firebase's Authorized Domains list.

```bash
npm run build        # production build
npm run check        # tsc --noEmit && eslint && check:links  — run this before pushing
npm run lint         # eslint, flat config in eslint.config.mjs
npm run check:links  # every internal href resolves to a real route
npm run images       # regenerate public/*.avif from assets-originals/
npx tsc --noEmit     # type check
```

### Working on the login screen

Real sign-in sends an SMS and costs quota. For UI work, use the local mock:

```bash
NEXT_PUBLIC_AUTH_DEMO=1 npm run dev
```

The one-time code is then generated client-side and printed in the dialog. Everything
else about the flow is identical.

---

## Routes

| Route | What it is |
|---|---|
| `/` | The marketing homepage |
| `/login` | Phone-OTP sign-in. Also available as a modal from any "Log in" button |
| `/app` | Redirects to the default workspace tab |
| `/app/[tab]` | Workspace: `apex`, `clock`, `boost`, `movers`, `breakouts`, `heatmap`, `watchlist` |
| `/legal/[page]` | `disclaimer`, `terms`, `privacy`, `refund`, `investor-charter`. **Public** — the login form links the terms from its consent line, before anyone has an account |

### Links to routes that do not exist yet

The nav, footer and feature grids were written against the full route matrix in
`product-spec.md` (`/option-apex`, `/market-pulse`, `/status`, …). Those pages do not
exist, and every one of them used to render as a link straight into a 404.

**The rule now: no href means not built.** An entry with no `href` renders as plain
text with a "Soon" pill instead of a link. There is no separate `ready` flag to keep in
sync — absence of the href *is* the signal, in `nav.schema.ts`, `content.ts`'s `FOOTER`
and `WHY`, and `SCANNERS`. Add the href back the day the route ships.

`npm run check:links` walks the App Router tree and fails if any emitted internal href
has no page, so this cannot silently regress. It runs as part of `npm run check`.

Purchase CTAs point at `PURCHASE_HREF` in `lib/routes.ts` — currently `/#pricing`,
because `/payments` does not exist. Change that one constant when it does and all five
CTAs follow.

---

## Layout of the code

```
app/
  page.tsx            the whole marketing homepage
  pock.css            the design system (see below)
  globals.css         document reset + Tailwind's Preflight, nothing else
  icon.svg            favicon — hand-drawn copy of Logo.tsx's geometry
  error.tsx           root error boundary
  login/, app/, legal/  routes

components/
  Pock/               marketing site components
    Nav.tsx           nav bar + mobile drawer
    nav.schema.ts     every nav route, label and description — data only
    Hero/             hero section, split into its own pieces
    Scanners.tsx      the pinned scroll sequence
    Shorts.tsx        the video carousel
    Why.tsx, Pricing.tsx, Faq.tsx, WorldTicker.tsx
    content.ts        all marketing copy
    Motion.tsx        shared Framer primitives (Reveal, MaskLines, Rail)
  App/                workspace shell
    AppShell.tsx      chrome shared by every tab
    views/            one component per scanner tab

hooks/
  useAuthUser.ts      the three-state auth subscription, in one place

lib/
  auth/               the only place Firebase is imported
  routes.ts           every internal href that is not a literal — start here
  theme.ts            Theme type, storage key, DARK_CANVAS, applyTheme
  format.ts           inr / pct / num / signed / dirClass — all number rendering
  sample-data.ts      the deterministic hash + CONSTITUENTS the fake data is built on
  app-tabs.ts         the workspace tab set — one array drives nav, routes and titles
  apex.ts, scanners.ts, watchlist.ts, world.ts, legal.ts    data providers

scripts/
  check-links.mjs     asserts every internal href resolves
  optimise-images.mjs regenerates public/*.avif from assets-originals/

docs/button-lab/      a rejected button system, kept for reference, not a route
assets-originals/     high-res image sources (gitignored)
```

**Reference documents** are kept locally and deliberately not committed —
`product-spec.md` (the authoritative brief for features, pricing and compliance; it
outranks anything in `content.ts`), `LOGIN_SPEC.md` (auth), `design.md` (**stale**, a
pre-Pock system that no longer exists) and `tradefinder-site-audit.md` (an extract of the
*old* live site). Ask for them if you need them; the rules that matter are summarised
below.

---

## Compliance — read before writing any copy

TradeFinder operates as a SEBI-registered Research Analyst. These are regulatory
constraints, not style preferences:

- **No stock tips, buy/sell recommendations, or portfolio advice.** Anywhere.
- **No guaranteed or implied returns, profits, accuracy or win rates** — including in
  testimonials and CTAs. Describe what a tool *shows*, never what it earns.
- **No superlatives** ("best", "top", "No. 1") — the SEBI Advertisement Code names them.
- All sample UI data must read as illustrative.
- `DISCLAIMER` in `content.ts` is compliance-critical. Do not soften it.

Safe verbs: *shows, surfaces, tracks, ranks, measures, isolates.*
Unsafe: *predict, anticipate, time your entry, spot where money is going.*

---

## The design system ("Pock")

One file: `app/pock.css`, scoped to `.pk`. Every page wraps its content in
`<div className="pk">`.

- **Palette:** Grass `#144419` · Pear `#a8e664` · Lime `#cdf546` · Mint `#d7f3b8` ·
  Cloud `#f3f4f1`. **There is no second hue** — green does all the ranking.
- **Components use role tokens only** — `--bg`, `--surface`, `--elevated`, `--text`,
  `--text-mute`, `--line`. Never a raw palette name, never a hex.
- **Dark mode** is a neutral charcoal ramp (canvas `#171a1c`). Green does not leave; it
  moves into the accents.
- Surfaces are rounded blocks and the grid gaps are the layout. Every control is a pill.
- **Chivo** for all copy. **Jersey 15** is the wordmark and one headline figure per block
  — it is a logo, not a display font.

### Four things that will bite you

**1. The element reset outranks a single class.**
`pock.css` contains `.pk h1, .pk p, .pk ul, … { margin: 0; padding: 0 }`, which is
specificity `(0,1,1)`. A bare `.my-thing { margin-top: 20px }` is `(0,1,0)` and **loses
silently** — the declaration simply never applies. Anything needing a non-zero margin or
padding on a `p`, `ul`, `ol`, `figure` or heading must be one class deeper:

```css
.pk .my-thing { margin-top: var(--s-20); }   /* not .my-thing */
```

The same applies to colour on links: `.pk a { color: inherit }` beats `.btn-pear`, which
is why the button fills are written `.pk .btn-pear`.

**2. Dark plates do not follow the page.**
`.foot`, `.offer` and `.auth-aside` are dark in *both* themes. Inside them, `--text`,
`--text-mute` and `--text-faint` are wrong — they flip with the page and those surfaces
don't. Use plate-keyed values instead.

**3. The canvas colour lives in three places.**
`--bg` in `pock.css`, the pre-paint script in `app/layout.tsx`, and `ThemeToggle.tsx`.
They must move together or the page flashes on load and on toggle.

**4. `app/icon.svg` duplicates `Logo.tsx`'s geometry by hand.**
There is no shared source. Change one, change the other.

---

## Auth

`lib/auth/auth.ts` is the only module that imports Firebase. The UI calls
`sendOtp` / `verifyOtp` / `signOutUser` / `onAuth` and knows nothing else — which is what
makes the provider swappable.

Auth state has **three** values, not two:

```ts
undefined   // still resolving — show nothing conclusive
null        // signed out
AuthUser    // signed in
```

Treating `undefined` as signed-out is what makes a login screen flash on every refresh.
Use the `useAuthUser()` hook (`hooks/useAuthUser.ts`) — it preserves all three states.
Do not re-inline the `useState`/`useEffect(onAuth)` pair; four components had their own
copy of it.

Anything that **persists** per-user data must additionally wait for `authResolved()`.
`currentUser()` flattens `undefined` to `null`, which is right for rendering and wrong
for keying storage: a signed-in visitor would read and write the anonymous bucket until
the SDK landed, then silently swap. `lib/watchlist.ts` shows the handling.

The SDK loads dynamically and off the critical path, so it stays out of the shared chunk
that every page pays for.

> **Scope:** this gates the UI only. It does not protect any API. If a backend is added,
> it must verify the Firebase ID token itself (`getIdToken()` exists for this) and derive
> the user id **from the token**, never from the request body.

---

## Conventions

- **Server Components by default.** Add `'use client'` only for state, effects or
  browser APIs. `Pricing`, `Why` and the page shell are deliberately server-rendered.
- **Data lives in `lib/` or `content.ts`, never in a component.** Components render.
- **One array drives a feature.** `nav.schema.ts` and `app-tabs.ts` each feed the nav,
  the routes and the titles from a single source; adding an item is a data edit.
- **Respect `prefers-reduced-motion`** on anything that loops or animates on entry.
- **Illustrative data must say so.** Every mocked number carries a "sample data" note.
- **Never hand-format a number.** `lib/format.ts` owns `inr`, `pct`, `num`, `signed` and
  `dirClass`. These were once copy-pasted across five views and had drifted to two
  different precisions for the same "1D %" column.
- **Never write an internal href as a bare literal** if it is anything but `/`. It goes
  in `lib/routes.ts`, or it is omitted because the page does not exist.

---

## Known gaps

- **The workspace is a front end with no backend.** Everything under `/app` renders
  deterministic fake data from `lib/sample-data.ts`. The auth gate in `AppShell` is
  client-side over statically generated pages, which is adequate only because there is
  nothing real to protect. **The first real data feed is an architectural milestone, not
  a swap:** it needs a server-side gate (middleware or a Server Component check), and
  the `lib/` providers have to become async — they are synchronous pure functions today.
- `lib/watchlist.ts` keys `localStorage` by uid and returns defaults until auth resolves
  (`authResolved()`), so a signed-in user can never read or write the anonymous bucket.
  Anything else that persists per-user data must gate the same way.
- The homepage's closer form has no endpoint; its input is deliberately unnamed so
  nothing is submitted. Give it a `name` when a handler exists.
- `lib/world.ts` reads an optional `public/world_ticker.json` that is not committed, so
  the ticker renders illustrative reference levels — and does a request that 404s on
  every mount to find that out. Gate it on an env flag when the feed is real.
- `WorldTicker` mounts on both the homepage and in `AppShell`; each instance fetches
  independently. Harmless while the fetch fails, a duplicate poller once it doesn't.
- On mobile the desktop image set is `display: none`, so it is not fetched — except the
  first, which carries `priority`. That is one ~126 KB AVIF downloaded and not shown.
  Not worth restructuring the pinned-scroll markup for; noted so it isn't rediscovered.
- No tests. The highest-value first ones are the pure functions in `lib/scanners.ts`
  (the `bo10/bo50/bo90` comparisons) and `lib/format.ts`.
- Marketing copy in `content.ts` and `nav.schema.ts` says "real time", "second by
  second" and "candle-by-candle OI". The data layer cannot currently support those
  claims — a compliance question, not a code one, but it is open.
- `.vscode/settings.json` (which silences the editor's complaints about Tailwind v4
  at-rules) is gitignored, so it does not reach other machines.
- Tailwind is installed but no utility class is used anywhere; `@import "tailwindcss"`
  in `globals.css` is kept for Preflight alone. `tailwind.config.ts` was deleted —
  Tailwind v4 is CSS-first and nothing declared `@config`, so it never did anything.
