export interface AppTab {
  id: string;
  short: string;
  long: string;
  icon: string;
}

export const APP_TABS: AppTab[] = [
  {
    id: 'apex',
    short: 'Apex',
    long: 'Options Apex',
    icon: '<path d="M3 17l5-5 4 4 8-9"/><path d="M16 7h4v4"/>',
  },
  {
    id: 'clock',
    short: 'Clock',
    long: 'Option Clock',
    icon: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  },
  {
    id: 'boost',
    short: 'Boost',
    long: 'Intraday Boost',
    icon: '<path d="M13 2 4 14h7l-1 8 9-12h-7z"/>',
  },
  {
    id: 'movers',
    short: 'Movers',
    long: 'Top Gainers & Losers',
    icon: '<path d="M8 5v9M8 5 5 8M8 5l3 3"/><path d="M16 19v-9M16 19l-3-3M16 19l3-3"/>',
  },
  {
    id: 'breakouts',
    short: 'Breakouts',
    long: 'Breakouts',
    icon: '<path d="M3 12h5l3-7 3 14 2-7h5"/>',
  },
  {
    id: 'heatmap',
    short: 'Heatmap',
    long: 'Sector Heatmap',
    icon: '<rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/>',
  },
  {
    id: 'watchlist',
    short: 'Watchlist',
    long: 'Watchlist',
    icon: '<path d="M12 3.5l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 17l-5.2 2.6 1-5.8L3.5 9.7l5.9-.9z"/>',
  },
];

export const DEFAULT_TAB = 'apex';

export function findTab(id: string): AppTab | undefined {
  return APP_TABS.find((t) => t.id === id);
}
