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

export interface HeatTile {
  sym: string;
  chgPct: number;
}

export interface ApexData {
  sample: boolean;
  heatmap: HeatTile[];
  bars: never[];
}

const r1 = (v: number) => Math.round(v * 10) / 10;

function sampleChg(sym: string): number {
  let h = 0;
  for (let i = 0; i < sym.length; i++) h = (h * 31 + sym.charCodeAt(i)) % 1000;
  return r1((h / 1000 - 0.5) * 5);
}

export function getApex(): ApexData {
  const heatmap = CONSTITUENTS.map((sym) => ({ sym, chgPct: sampleChg(sym) }));
  heatmap.sort((a, b) => b.chgPct - a.chgPct);
  return { sample: true, heatmap, bars: [] };
}
