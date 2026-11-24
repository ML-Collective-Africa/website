import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminHead } from '@/components/admin/ui';
import { readCollection } from '@/lib/store';
import type { SubmissionType } from '@/lib/types';
import { whenLabel } from '@/lib/utils';

export const metadata: Metadata = { title: 'Inbox' };

const KINDS: [label: string, type: SubmissionType | null][] = [
  ['All', null],
  ['Papers', 'Paper'],
  ['Products', 'Product'],
  ['Focus group updates', 'Focus group update'],
  ['Sunday slot requests', 'Sunday slot request'],
  ['Corrections', 'Correction'],
];

export default async function InboxPage({ searchParams }: { searchParams: Promise<{ tab?: string; show?: string }> }) {
  const { tab, show } = await searchParams;
  const decided = show === 'decided';
  const all = (await readCollection('submissions')).filter((s) => (decided ? s.status !== 'waiting' : s.status === 'waiting'));
  const cur = KINDS.find((k) => k[0] === tab) ?? KINDS[0];
  const items = cur[1] ? all.filter((s) => s.type === cur[1]) : all;
  const qs = (t: string) => `/admin/inbox?tab=${encodeURIComponent(t)}${decided ? '&show=decided' : ''}`;

  return (
    <>
      <AdminHead
        title="Inbox"
        sub="Everything members send in through the website lands here. Nothing goes live until someone approves it."
        action={
          <Link href={decided ? '/admin/inbox' : '/admin/inbox?show=decided'} className="a-btn a-btn--ghost">
            {decided ? 'Show waiting' : 'Show decided'}
          </Link>
        }
      />
      <nav aria-label="Submission types" className="tabs a-tabs">
        {KINDS.map(([label, t]) => (
          <Link key={label} href={qs(label)} className="tab" aria-current={label === cur[0] ? 'page' : undefined}>
            {label} <span className="tab__count">{t ? all.filter((s) => s.type === t).length : all.length}</span>
          </Link>
        ))}
      </nav>
      {items.length ? (
        <ul className="a-inbox">
          {items.map((i) => (
            <li key={i.id}>
              <span className="a-inbox__type">{i.type}</span>
              <span className="stack-8" style={{ gap: 3, minWidth: 0 }}>
                <Link className="rowlink" href={`/admin/inbox/${i.id}`}>
                  {i.title}
                </Link>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>
                  From {i.authors.split(',')[0] || i.email}
                  {decided && ` · ${i.status === 'approved' ? 'Approved' : 'Declined'} by ${i.decidedBy}`}
                </span>
              </span>
              <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{whenLabel(i.createdAt)}</span>
              <Link href={`/admin/inbox/${i.id}`} className="text-link">
                {decided ? 'View' : 'Review'}
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="a-panel" style={{ padding: '40px 24px', gap: 6 }}>
          <span style={{ fontSize: 18, fontWeight: 600 }}>Nothing {decided ? 'decided' : 'waiting'} here</span>
          <span style={{ fontSize: 15, color: 'var(--text-2)' }}>{decided ? 'Decisions show up here once you make them.' : 'You’re all caught up.'}</span>
        </div>
      )}
    </>
  );
}
