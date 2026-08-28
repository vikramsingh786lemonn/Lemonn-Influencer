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
import { PURCHASE_HREF } from '@/lib/routes';

/* An entry with no `href` is a product surface that is described but not built.
   It still renders — telling a visitor what the product covers is the nav's
   marketing job — but as plain text with a "Soon" pill instead of a link into a
   404, which is what all fourteen of these used to be.

   Absence of `href` is the only signal; there is no separate `ready` flag to
   keep in sync. The intended URLs live in `product-spec.md`, which is where a
   plan belongs. Add the href back the day the route ships — `npm run
   check:links` fails if it points at a page that still isn't there. */
export interface NavLeaf {
  label: string;
  href?: string;
  desc: string;
  icon: LucideIcon;
  live?: boolean;
}

export interface NavGroup {
  label: string;
  blurb: string;
  items: NavLeaf[];
}

export interface NavFlat {
  label: string;
  href?: string;
  live?: boolean;
}

export type NavEntry = NavGroup | NavFlat;

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
        desc: 'Candle-by-candle open interest, plus Money Flux — the stocks where operators are concentrating positions.',
        icon: BarChart3,
      },
      {
        label: 'Option Clock',
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
        desc: '5/10-minute momentum spikes, Loss of Momentum, contraction breakouts, day high/low reversals.',
        icon: Activity,
      },
      {
        label: 'Sector Scope',
        desc: 'Sector heatmap, then a drill-down to the names carrying the concentration.',
        icon: Compass,
      },
      {
        label: 'Swing Spectrum',
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
        desc: 'Foreign and domestic institutional net activity across cash and derivatives.',
        icon: Building2,
      },
      {
        label: 'Delivery Scanner',
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
        desc: 'Log executions, tag mistakes, and see your own profit factor and equity curve.',
        icon: Notebook,
      },
      {
        label: 'Watchlist',
        desc: 'Your symbols with live context, wired to broker charting.',
        icon: ListChecks,
      },
      {
        label: 'Calculators',
        desc: 'Position sizing, risk-to-reward, and options Greeks worked out before you commit.',
        icon: Calculator,
      },
      {
        label: 'Economic Calendar',
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
        desc: 'Sentiment, advance/decline and volatility across the whole market.',
        icon: LineChart,
        live: true,
      },
      {
        label: 'TradeStream',
        desc: 'A running broadcast of algorithmic setups as the scanners fire.',
        icon: Radio,
        live: true,
      },
      {
        label: 'Trade Tutor',
        desc: 'Video curriculum and manuals covering the logic behind every scanner.',
        icon: GraduationCap,
      },
    ],
  },
  /* The only top-level nav destination that resolves today. */
  { label: 'Pricing', href: PURCHASE_HREF },
];
