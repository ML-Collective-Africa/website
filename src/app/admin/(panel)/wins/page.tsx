import type { Metadata } from 'next';
import Link from 'next/link';
import { WinsEditor } from '@/components/admin/WinsEditor';
import { AdminHead, Pill } from '@/components/admin/ui';
import { WIN_KINDS } from '@/lib/content';
import { readCollection } from '@/lib/store';
import { monthLabel } from '@/lib/utils';

export const metadata: Metadata = { title: 'Monthly wins' };

export default async function AdminWinsPage({ searchParams }: { searchParams: Promise<{ month?: string }> }) {
  const { month } = await searchParams;
  const months = await readCollection('wins');
  const now = new Date();
  const keys = new Set(months.map((m) => m.key));
  for (let i = -2; i <= 1; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() + i, 1);
    keys.add(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  }
  const options = Array.from(keys).sort().reverse();
  const draft = months.filter((m) => m.status === 'draft').sort((a, b) => b.key.localeCompare(a.key))[0];
  const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const fallback = `${prev.getFullYear()}-${String(prev.getMonth() + 1).padStart(2, '0')}`;
  const key = month && /^\d{4}-\d{2}$/.test(month) ? month : draft?.key ?? fallback;
  const current = months.find((m) => m.key === key) ?? { key, label: monthLabel(key), note: '', status: 'draft' as const, wins: [] };

  return (
    <>
      <AdminHead
        title="Monthly wins"
        sub="Add wins through the month, then publish them on the first Sunday."
        action={
          <span style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
            <Pill tone={current.status === 'published' ? 'ok' : 'warn'}>
              {current.label}: {current.status === 'published' ? 'published' : 'draft'}
            </Pill>
            <Link href={`/life/monthly-wins?month=${key}`} className="text-link">
              View the page
            </Link>
          </span>
        }
      />
      <WinsEditor
        key={key}
        month={current}
        kinds={WIN_KINDS}
        options={options.map((k) => ({ key: k, label: monthLabel(k), status: months.find((m) => m.key === k)?.status }))}
      />
    </>
  );
}
