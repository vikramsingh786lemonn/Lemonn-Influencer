import { currentUser } from './auth/auth';

export interface WatchItem {
  sym: string;
  above: number | null;
  below: number | null;
}

function key(): string {
  const u = currentUser();
  return `tf.watch.${u?.uid ?? 'anon'}`;
}

export interface AlertPrefs {
  telegram: boolean;
  chatId: string;
}

const DEFAULT_ALERTS: AlertPrefs = { telegram: false, chatId: '' };

export function getAlerts(): AlertPrefs {
  if (typeof window === 'undefined') return DEFAULT_ALERTS;
  try {
    const raw = window.localStorage.getItem(`${key()}.alerts`);
    return raw ? { ...DEFAULT_ALERTS, ...(JSON.parse(raw) as AlertPrefs) } : DEFAULT_ALERTS;
  } catch {
    return DEFAULT_ALERTS;
  }
}

export function setAlerts(patch: Partial<AlertPrefs>): AlertPrefs {
  const next = { ...getAlerts(), ...patch };
  try {
    window.localStorage.setItem(`${key()}.alerts`, JSON.stringify(next));
  } catch {
  }
  return next;
}

export function getWatch(): WatchItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(key());
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(
      (x): x is WatchItem => !!x && typeof (x as WatchItem).sym === 'string',
    );
  } catch {
    return [];
  }
}

function persist(list: WatchItem[]): WatchItem[] {
  try {
    window.localStorage.setItem(key(), JSON.stringify(list));
  } catch {
  }
  return list;
}

export function addSymbol(sym: string): WatchItem[] {
  const list = getWatch();
  if (list.some((s) => s.sym === sym)) return list;
  return persist([...list, { sym, above: null, below: null }]);
}

export function removeSymbol(sym: string): WatchItem[] {
  return persist(getWatch().filter((s) => s.sym !== sym));
}

export function updateSymbol(sym: string, patch: Partial<WatchItem>): WatchItem[] {
  return persist(getWatch().map((s) => (s.sym === sym ? { ...s, ...patch } : s)));
}

export function tvSymbol(sym: string): string {
  return `NSE:${sym.replace(/[^A-Za-z0-9]/g, '_')}`;
}

export function tvUrl(sym: string): string {
  return `https://www.tradingview.com/chart/?symbol=${encodeURIComponent(tvSymbol(sym))}`;
}
