/* Every internal href the site emits, in one place.

   The nav and footer were written against the full route matrix in
   `product-spec.md`, most of which does not exist yet. Rather than scatter dead
   links across six components, routes live here with a `ready` flag: unready
   ones are rendered as non-links so a visitor never lands on a 404, and
   shipping the real page is a one-word edit. */

import { DEFAULT_TAB } from './app-tabs';

/** The workspace entry point. Bare `/app` is a server redirect, so linking
    straight to the default tab saves a round trip on every entry. */
export const WORKSPACE_HREF = `/app/${DEFAULT_TAB}`;

/* `/payments` is the intended checkout page and does not exist. Until it does,
   every purchase CTA scrolls to the pricing block on the homepage, which is a
   real destination that answers the same question. Point this at '/payments'
   the day that route ships and all five CTAs follow. */
export const PURCHASE_HREF = '/#pricing';

export const LEGAL_BASE = '/legal';

export function legalHref(slug: string): string {
  return `${LEGAL_BASE}/${slug}`;
}
