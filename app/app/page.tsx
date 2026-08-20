import { redirect } from 'next/navigation';
import { DEFAULT_TAB } from '@/lib/app-tabs';

export default function AppIndex() {
  redirect(`/app/${DEFAULT_TAB}`);
}
