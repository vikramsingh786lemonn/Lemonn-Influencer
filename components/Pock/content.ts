import { legalHref, PURCHASE_HREF } from '@/lib/routes';

export interface Scanner {
  id: string;
  name: string;
  title: string;
  body: string;
  chips: string[];
  /** Omitted while the scanner's own page does not exist. */
  href?: string;
  cta?: string;
  image: string;
}

export const SCANNERS: Scanner[] = [
  {
    id: 'option-apex',
    name: 'Option Apex',
    title: 'Candle-by-candle open interest',
    body: 'See how option positions are constructed through the session, interval by interval — not just where open interest ended up at the close.',
    chips: ['Money Flux', 'Per-candle OI', 'Index options'],
    image: '/prod-1.avif',
  },
  {
    id: 'option-clock',
    name: 'Option Clock',
    title: 'Position building, time-bucketed',
    body: 'A time-series open-interest engine that isolates where institutions are building positions, across whichever intraday intervals you choose.',
    chips: ['Index Mover', 'Net Position', 'Custom intervals'],
    image: '/prod-2.avif',
  },
  {
    id: 'sector-scope',
    name: 'Sector Scope',
    title: 'Sector strength, then the names',
    body: 'Ranks every sector as the session moves, then drills through to the equities where institutional accumulation is concentrated.',
    chips: ['Sector breadth', 'Index points', 'Stock drill-down'],
    image: '/prod-3.avif',
  },
  {
    id: 'insider-strategy',
    name: 'Insider Strategy',
    title: 'Market structure, five angles',
    body: 'Scans real-time price action and volume distribution across equity and F&O: momentum spikes, stalling trends, volatility squeezes and exhaustion at the day\u2019s extremes.',
    chips: [
      '5/10 Min Momentum Spike',
      'Loss of Momentum',
      'Contraction Breakout',
      'Day High/Low Reversal',
      '2-Day High/Low BO',
    ],
    image: '/prod-4.avif',
  },
  {
    id: 'productivity',
    name: 'Productivity & learning',
    title: 'Log the trade, learn the logic',
    body: 'Log executions and review where they went wrong, then read the quantitative logic behind each module \u2014 with position sizing, Greeks and the macro calendar alongside.',
    chips: ['Trading Journal', 'Trade Tutor', 'Calculators', 'Economic calendar'],
    image: '/prod-5.avif',
  },
];

export const FAQ = [
  {
    q: 'What exactly is TradeFinder?',
    a: 'A live market scanner for Indian F&O traders. It reads smart-money flow — price, volume and open-interest build-up — and hands you the trades that fit your style, during the session rather than after it.',
  },
  {
    q: 'Do I need to install anything?',
    a: 'No. It is a web platform and runs in any modern browser — phone, tablet, laptop or desktop. Log in and it is there.',
  },
  {
    q: 'Is this for beginners or experienced traders?',
    a: 'Both, though it pays off fastest if you already trade and want a better shortlist. Built-in tutorials cover every scanner if you are still finding your style.',
  },
  {
    q: 'How is it different from other scanners?',
    a: 'The scanners are designed by traders who use them daily, not by a product team guessing at filter criteria. Each one answers a specific question instead of handing you every parameter at once.',
  },
  {
    q: 'Which brokers do you work with?',
    a: 'Dhan, Angel One, Fyers and Lemonn. You can also sign in with a Google account or take a guest login to look around before connecting a broker.',
  },
  {
    q: 'Are there hidden charges?',
    a: 'None. What is on the pricing card is what you pay, and every plan includes every premium feature.',
  },
  {
    q: 'Do you give buy or sell tips?',
    a: 'No, and this matters: we do not give stock tips or recommendations, and we have not authorised anyone to do so on our behalf. If someone claims otherwise, report it to info@tradefinder.in.',
  },
];

export interface FooterLink {
  label: string;
  /** Omitted when the page does not exist yet — the label then renders as
      plain text rather than as a link into a 404. See `nav.schema.ts`. */
  href?: string;
}

export interface FooterColumn {
  heading: string;
  links: FooterLink[];
}

export const FOOTER: FooterColumn[] = [
  {
    heading: 'Scanners',
    links: [
      { label: 'Option Apex' },
      { label: 'Option Clock' },
      { label: 'Insider Strategy' },
      { label: 'Sector Scope' },
      { label: 'Swing Spectrum' },
      { label: 'FII–DII Scanner' },
      { label: 'Delivery Scanner' },
    ],
  },
  {
    heading: 'Live & tools',
    links: [
      { label: 'Market Pulse' },
      { label: 'TradeStream' },
      { label: 'Trading Journal' },
      { label: 'Trade Tutor' },
      { label: 'Watchlist' },
      { label: 'Calculators' },
      { label: 'Economic Calendar' },
    ],
  },
  {
    heading: 'Company & legal',
    links: [
      { label: 'About us' },
      { label: 'Contact us' },
      { label: 'Pricing', href: PURCHASE_HREF },
      { label: 'FAQ', href: '/#faq' },
      { label: 'System status' },
      { label: 'Investor charter & SCORES', href: legalHref('investor-charter') },
      { label: 'Terms & conditions', href: legalHref('terms') },
      { label: 'Privacy policy', href: legalHref('privacy') },
      { label: 'Disclaimer', href: legalHref('disclaimer') },
    ],
  },
];

export const STRATEGIES = [
  {
    name: 'Scalping Pulse by Neeraj',
    video: 'https://youtube.com/shorts/UYKgVj0fcsk?feature=share',
    thumb: 'scalping-pulse-thumbnail.avif',
  },
  {
    name: 'Prime Scalper EMA',
    video: 'https://youtube.com/shorts/cgxBLF81Z2k?feature=share',
    thumb: 'prime-scalper-ema-thumbnail.avif',
  },
  {
    name: 'Inside Candle',
    video: 'https://youtube.com/shorts/F_YGkwkUC5Q?feature=share',
    thumb: 'inside-candle-thumbnail.avif',
  },
  {
    name: 'Mean Reversion Bollinger',
    video: 'https://youtube.com/shorts/RzT8N3ED1aI?feature=share',
    thumb: 'mean-reversion-bollinger-thumbnail.avif',
  },
  {
    name: 'EMA Cross',
    video: 'https://youtube.com/shorts/D-aIiEQYpo8?feature=share',
    thumb: 'ema-cross-thumbnail.avif',
  },
  {
    name: 'SwingKing Sniper',
    video: 'https://youtube.com/shorts/6fSPJkY2jQc?feature=share',
    thumb: 'swingking-sniper-thumbnail.avif',
  },
  {
    name: 'Traffic Light',
    video: 'https://youtube.com/shorts/Vc98-tR2PhA?feature=share',
    thumb: 'traffic-light-thumbnail.avif',
  },
  {
    name: 'Booming Bulls Supertrend',
    video: 'https://youtube.com/shorts/fLofWy4cb2o?feature=share',
    thumb: 'booming-bulls-supertrend-thumbnail.avif',
  },
];

/* Icon keys are resolved against the ICONS map in `Why.tsx`. The union keeps a
   typo a compile error rather than a silently missing icon. */
export type WhyIcon =
  | 'Activity'
  | 'Calculator'
  | 'CalendarDays'
  | 'CandlestickChart'
  | 'GraduationCap'
  | 'Landmark'
  | 'NotebookPen'
  | 'PackageCheck'
  | 'ServerCog'
  | 'Star';

export interface WhyTool {
  icon: WhyIcon;
  name: string;
  body: string;
}

export const WHY: { lead: { title: string; body: string }; tools: WhyTool[] } = {
  lead: {
    title: 'One login, the whole desk',
    body: 'Every scanner, the journal, the tutor and the calculators come on the same subscription. No tiers, no add-ons bought separately, and nothing that renews without you.',
  },
  tools: [
    {
      icon: 'NotebookPen',
      name: 'Trading Journal',
      body: 'Log executions and review where they went wrong, by pattern rather than by memory.',
    },
    {
      icon: 'Activity',
      name: 'Market Pulse',
      body: 'Session sentiment, advance-decline and volatility gauges in one view.',
    },
    {
      icon: 'Landmark',
      name: 'FII–DII data',
      body: 'Foreign and domestic institutional net participation, cash and derivatives.',
    },
    {
      icon: 'PackageCheck',
      name: 'Delivery scanners',
      body: 'Cash-market accumulation metrics, for positioning that holds past the close.',
    },
    {
      icon: 'CandlestickChart',
      name: 'Swing Spectrum',
      body: 'Multi-day candle structure and end-of-day action, for swing candidates.',
    },
    {
      icon: 'Star',
      name: 'Watchlist',
      body: 'Your own symbol lists, wired to the charts you already read.',
    },
    {
      icon: 'CalendarDays',
      name: 'Economic calendar',
      body: 'RBI policy, inflation prints and earnings — the dates that move volatility.',
    },
    {
      icon: 'Calculator',
      name: 'Calculators',
      body: 'Position sizing, options Greeks and decay, risk-to-reward before you commit.',
    },
    {
      icon: 'GraduationCap',
      name: 'Trade Tutor',
      body: 'Manuals and video covering the quantitative logic behind each module.',
    },
    {
      icon: 'ServerCog',
      name: 'Public status page',
      body: 'Every service’s health, published. You see an outage when we do.',
    },
  ],
};

export const PRICING = {
  plan: {
    eyebrow: 'Diamond plan',
    price: '4,999',
    term: '6 months + 6 months free',
    note: 'Twelve months of access, paid once.',
    includes: [
      'Option Apex — candle-by-candle OI and Money Flux',
      'Option Clock — time-bucketed institutional build-up',
      'Sector Scope — sector strength, then the names',
      'Insider Strategy',
      'Trading Journal',
      'Trade Tutor',
      'Live streams',
    ],
    cta: 'Get the Diamond plan',
  },
  promo: {
    eyebrow: 'Current offer',
    ribbon: 'Limited time',
    eligibility: 'For Lemonn account holders',
    was: '4,999',
    price: 'Free',
    term: '3-month access',
    includes: [
      'Full premium scanners',
      'Educational manuals',
      'Time-boxed — ends at term, nothing to cancel',
    ],
    cta: 'Claim with Lemonn',
    ctaNote: 'Sign in with your Lemonn account to start the free term.',
  },
  policy: {
    title: 'No auto-renewal. Ever.',
    body: 'Access expires at the end of the term unless you renew it yourself. We do not keep a mandate on your card, so there is no recurring charge to spot and nothing to cancel.',
  },
  device: 'One active device session per account. Multiple browser tabs on that device are fine.',
};

export const SOCIALS = [
  { label: 'X', href: '#' },
  { label: 'IN', href: '#' },
  { label: 'IG', href: '#' },
  { label: 'YT', href: '#' },
  { label: 'TT', href: '#' },
];

export const DISCLAIMER =
  'TradeFinder is a market analytics platform. We do not provide stock tips, buy or sell recommendations, or portfolio management services, and we have not authorised any person to do so on our behalf. Investments in securities markets are subject to market risks; read all related documents carefully before investing. Past performance is not indicative of future results. Report impersonation to info@tradefinder.in.';
