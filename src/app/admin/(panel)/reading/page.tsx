import type { Metadata } from 'next';
import Link from 'next/link';
import { ReadingEditor } from '@/components/admin/ReadingEditor';
import { AdminHead } from '@/components/admin/ui';
import { readCollection } from '@/lib/store';
import { monthLabel } from '@/lib/utils';

export const metadata: Metadata = { title: 'Reading groups' };

function monthKeys() {
  const now = new Date();
  const keys: string[] = [];
  for (let i = -2; i <= 2; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    keys.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  return keys;
}

export default async function AdminReadingPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const months = await readCollection('reading');
  const keys = Array.from(new Set([...monthKeys(), ...months.map((m) => m.key)])).sort().reverse();
  const latest = [...months].sort((a, b) => b.key.localeCompare(a.key))[0]?.key;
  const key = month && /^\d{4}-\d{2}$/.test(month) ? month : latest ?? keys[0];
  const current = months.find((m) => m.key === key);

  return (
    <>
      <AdminHead
        title="Reading groups"
        sub="This shows on the Reading Groups page. Published months before the latest one appear under Past themes."
        action={
          <Link href="/programmes/reading-groups" className="a-btn a-btn--ghost">
            View the page
          </Link>
        }
      />
      <ReadingEditor
        key={key}
        monthKey={key}
        options={keys.map((k) => ({ key: k, label: monthLabel(k), status: months.find((m) => m.key === k)?.status }))}
        initial={current ?? { key, label: monthLabel(key), theme: '', status: 'draft', papers: [] }}
      />
    </>
  );
}
