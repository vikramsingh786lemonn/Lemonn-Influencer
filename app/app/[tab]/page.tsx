import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import type { ComponentType } from 'react';
import { ApexView } from '@/components/App/views/ApexView';
import { BoostView } from '@/components/App/views/BoostView';
import { BreakoutsView } from '@/components/App/views/BreakoutsView';
import { ClockView } from '@/components/App/views/ClockView';
import { HeatmapView } from '@/components/App/views/HeatmapView';
import { MoversView } from '@/components/App/views/MoversView';
import { WatchlistView } from '@/components/App/views/WatchlistView';
import { APP_TABS, findTab } from '@/lib/app-tabs';

/* Exhaustive over APP_TABS: `findTab` rejects any id not in that array.
   Typed as components, not functions returning nodes — several are client
   components, which may only be rendered from the server, never called. */
const VIEWS: Record<string, ComponentType> = {
  apex: ApexView,
  clock: ClockView,
  boost: BoostView,
  movers: MoversView,
  breakouts: BreakoutsView,
  heatmap: HeatmapView,
  watchlist: WatchlistView,
};

export function generateStaticParams() {
  return APP_TABS.map((t) => ({ tab: t.id }));
}

type Params = { params: Promise<{ tab: string }> };

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const tab = findTab((await params).tab);
  return {
    title: tab ? `${tab.long} · TradeFinder` : 'Workspace · TradeFinder',
    robots: { index: false, follow: false },
  };
}

export default async function TabPage({ params }: Params) {
  const tab = findTab((await params).tab);
  if (!tab) notFound();
  const View = VIEWS[tab.id];
  return <View />;
}
