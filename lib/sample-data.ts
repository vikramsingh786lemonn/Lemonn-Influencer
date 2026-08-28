/* Shared primitives for the illustrative market data.

   None of this is real. Every figure in the workspace is derived from the symbol
   name by a hash, so the same symbol always shows the same number — that
   stability is deliberate: a screen that reshuffles on every render reads as a
   live feed, and there is no live feed. Every view that shows these numbers
   carries a "sample data" pill saying so.

   `apex.ts` and `scanners.ts` each grew their own copy of this hash plus the
   same two rounding helpers; this is the one definition. */

/** Deterministic 0..1 from a string. `mult` varies the series per field. */
export function hash(seed: string, mult: number): number {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * mult + seed.charCodeAt(i)) % 10007;
  return h / 10007;
}

/** Round to one decimal. */
export const r1 = (v: number) => Math.round(v * 10) / 10;

/** Round to two decimals. */
export const r2 = (v: number) => Math.round(v * 100) / 100;

/** The Nifty 50 constituent list the sample data is generated over. */
export const CONSTITUENTS = [
  'ADANIENT', 'ADANIPORTS', 'APOLLOHOSP', 'ASIANPAINT', 'AXISBANK', 'BAJAJ-AUTO',
  'BAJAJFINSV', 'BAJFINANCE', 'BEL', 'BHARTIARTL', 'BPCL', 'BRITANNIA', 'CANBK',
  'CIPLA', 'COALINDIA', 'DABUR', 'DIVISLAB', 'DLF', 'DRREDDY', 'EICHERMOT',
  'GAIL', 'GODREJCP', 'GRASIM', 'HAL', 'HAVELLS', 'HCLTECH', 'HDFCBANK',
  'HDFCLIFE', 'HEROMOTOCO', 'HINDALCO', 'HINDUNILVR', 'ICICIBANK', 'INDUSINDBK',
  'INFY', 'ITC', 'JSWSTEEL', 'KOTAKBANK', 'LT', 'M&M', 'MARUTI', 'NESTLEIND',
  'NTPC', 'ONGC', 'PIDILITIND', 'PNB', 'POWERGRID', 'RELIANCE', 'SAIL',
  'SBILIFE', 'SBIN', 'SHRIRAMFIN', 'SIEMENS', 'SUNPHARMA', 'TATACONSUM',
  'TATAPOWER', 'TATASTEEL', 'TCS', 'TECHM', 'TITAN', 'ULTRACEMCO', 'VEDL',
  'WIPRO',
];
