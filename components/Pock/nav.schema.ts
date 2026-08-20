import {
  Activity,
  BarChart3,
  Building2,
  CalendarDays,
  Calculator,
  Clock,
  Compass,
  GraduationCap,
  LineChart,
  ListChecks,
  Notebook,
  Radio,
  TrendingUp,
  Truck,
  type LucideIcon,
} from 'lucide-react';

export interface NavLeaf {
  label: string;
  href: string;
  desc: string;
  icon: LucideIcon;
  live?: boolean;
}

export interface NavGroup {
  label: string;
  blurb: string;
  items: NavLeaf[];
}

export type NavEntry = NavGroup | { label: string; href: string; live?: boolean };

export function isGroup(entry: NavEntry): entry is NavGroup {
  return 'items' in entry;
}

export const NAV_SCHEMA: NavEntry[] = [
  {
    label: 'Options suite',
    blurb: 'Where institutional money is positioning, second by second.',
    items: [
      {
        label: 'Option Apex',
        href: '/option-apex',
        desc: 'Candle-by-candle open interest, plus Money Flux — the stocks where operators are concentrating positions.',
        icon: BarChart3,
      },
      {
        label: 'Option Clock',
        href: '/option-clock',
        desc: 'Timestamped OI build-up by interval, with Index Mover and net bull/bear position.',
        icon: Clock,
      },
    ],
  },
  {
    label: 'Scanners',
    blurb: 'Price structure and volume, filtered into named setups.',
    items: [
      {
        label: 'Insider Strategy',
        href: '/insider-strategy',
        desc: '5/10-minute momentum spikes, Loss of Momentum, contraction breakouts, day high/low reversals.',
        icon: Activity,
      },
      {
        label: 'Sector Scope',
        href: '/sector-scope',
        desc: 'Sector heatmap, then a drill-down to the names carrying the concentration.',
        icon: Compass,
      },
      {
        label: 'Swing Spectrum',
        href: '/swing-spectrum',
        desc: 'Multi-day structure and end-of-day price action for positions held across sessions.',
        icon: TrendingUp,
      },
    ],
  },
  {
    label: 'Institutional',
    blurb: 'What the large participants actually did.',
    items: [
      {
        label: 'FII–DII Scanner',
        href: '/fii-dii-scanner',
        desc: 'Foreign and domestic institutional net activity across cash and derivatives.',
        icon: Building2,
      },
      {
        label: 'Delivery Scanner',
        href: '/delivery-scanner',
        desc: 'High-volume delivery accumulation in the cash market.',
        icon: Truck,
      },
    ],
  },
  {
    label: 'Workspace',
    blurb: 'The record-keeping that turns sessions into a process.',
    items: [
      {
        label: 'Trading Journal',
        href: '/trading-journal',
        desc: 'Log executions, tag mistakes, and see your own profit factor and equity curve.',
        icon: Notebook,
      },
      {
        label: 'Watchlist',
        href: '/watchlist',
        desc: 'Your symbols with live context, wired to broker charting.',
        icon: ListChecks,
      },
      {
        label: 'Calculators',
        href: '/calculator',
        desc: 'Position sizing, risk-to-reward, and options Greeks worked out before you commit.',
        icon: Calculator,
      },
      {
        label: 'Economic Calendar',
        href: '/calendar',
        desc: 'RBI policy, inflation prints and earnings dates that move open positions.',
        icon: CalendarDays,
      },
    ],
  },
  {
    label: 'Live',
    blurb: 'The session as it happens.',
    items: [
      {
        label: 'Market Pulse',
        href: '/market-pulse',
        desc: 'Sentiment, advance/decline and volatility across the whole market.',
        icon: LineChart,
        live: true,
      },
      {
        label: 'TradeStream',
        href: '/tradestream-live',
        desc: 'A running broadcast of algorithmic setups as the scanners fire.',
        icon: Radio,
        live: true,
      },
      {
        label: 'Trade Tutor',
        href: '/trade-tutor',
        desc: 'Video curriculum and manuals covering the logic behind every scanner.',
        icon: GraduationCap,
      },
    ],
  },
  { label: 'Pricing', href: '/payments' },
];
