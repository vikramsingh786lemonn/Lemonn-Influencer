import { DISCLAIMER } from '@/components/Pock/content';

export type Block = ['h', string] | ['p', string];

export interface LegalPage {
  title: string;
  pending?: boolean;
  blocks: Block[];
}

export const LEGAL_PAGES: Record<string, LegalPage> = {
  disclaimer: {
    title: 'Disclaimer',
    blocks: [
      ['p', DISCLAIMER],
      ['h', 'What the scanners are'],
      [
        'p',
        'Every scanner in this workspace reports what the market is doing — price, volume, open interest and derived measures. None of them tells you what to trade. Readings are illustrative, can be delayed or incomplete, and change without notice.',
      ],
      ['h', 'Derivatives risk'],
      [
        'p',
        'Options and intraday trading carry a high risk of loss and are not suitable for every investor. You are solely responsible for your own trades and any losses arising from them.',
      ],
      ['h', 'No custody of funds'],
      [
        'p',
        'TradeFinder never holds, receives or manages your money. All orders are placed through your own broker.',
      ],
    ],
  },
  terms: { title: 'Terms of Use', pending: true, blocks: [] },
  privacy: { title: 'Privacy Policy', pending: true, blocks: [] },
  refund: { title: 'Refund Policy', pending: true, blocks: [] },
};

export const LEGAL_SLUGS = Object.keys(LEGAL_PAGES);
