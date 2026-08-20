import type { Metadata } from 'next';
import { AppShell } from '@/components/App/AppShell';
import '../pock.css';

export const metadata: Metadata = {
  title: 'Workspace · TradeFinder',
  robots: { index: false, follow: false },
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
