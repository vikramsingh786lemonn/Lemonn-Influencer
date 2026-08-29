/* Number formatting for Indian market readouts.

   These were copy-pasted across five view files, and had drifted: `inr` and
   `sign` were duplicated verbatim in three, BoostView carried a one-decimal
   variant, and ApexView inlined a third spelling. The same "1D %" column was
   therefore rendered to two different precisions depending on which screen you
   were on, which is a display bug rather than a matter of taste. One definition
   each, used everywhere. */

const IN = 'en-IN';

/** A price, grouped Indian-style: `₹1,23,456.70`. Fixed to two decimals —
    `maximumFractionDigits` drops trailing zeroes and leaves columns ragged. */
export function inr(n: number): string {
  return `₹${n.toLocaleString(IN, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/** A plain grouped number, no unit: `24,238.5` */
export function num(n: number): string {
  return n.toLocaleString(IN, { maximumFractionDigits: 2 });
}

/** A percentage change, always signed, always two decimals: `+1.24%` */
export function pct(n: number): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(2)}%`;
}

/** A signed bare number for unitless measures such as the Boost score. */
export function signed(n: number, dp = 1): string {
  return `${n >= 0 ? '+' : ''}${n.toFixed(dp)}`;
}

/** A signed grouped number, for absolute point moves on the ticker: `+138.9` */
export function signedNum(n: number): string {
  return `${n >= 0 ? '+' : ''}${num(n)}`;
}

/** The up/down class every readout pairs with its value. */
export function dirClass(n: number): 'is-up' | 'is-down' {
  return n >= 0 ? 'is-up' : 'is-down';
}
