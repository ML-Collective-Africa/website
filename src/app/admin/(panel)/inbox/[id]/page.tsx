import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { DeclineBox } from '@/components/admin/DeclineBox';
import { AdminHead, Notice } from '@/components/admin/ui';
import { approveSubmission } from '@/lib/actions/admin';
import { readCollection } from '@/lib/store';
import { monthLabel, whenLabel } from '@/lib/utils';

export const metadata: Metadata = { title: 'Review a submission' };

export default async function ReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ done?: string }>;
}) {
  const [{ id }, { done }] = await Promise.all([params, searchParams]);
  const sub = (await readCollection('submissions')).find((s) => s.id === id);
  if (!sub) notFound();

  const first = sub.authors.split(',')[0]?.trim() || 'the submitter';
  const firstName = first.split(' ')[0];
  const links = Object.entries(sub.links).filter(([, v]) => v) as [string, string][];
  const rows: [string, React.ReactNode][] = [
    ['Type', sub.type],
    ['Title', sub.title],
    ['Authors', sub.authors || '—'],
    ['Where it appeared', sub.venue || '—'],
    ['Date', sub.date ? monthLabel(sub.date) : '—'],
    ['Topic', sub.topic === 'Other' ? `Other: ${sub.topicOther || 'not given'}` : sub.topic || '—'],
    ['Summary', sub.summary || '—'],
    [
      'Links',
      links.length ? (
        <span style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
          {links.map(([k, v]) => (
            <a key={k} href={v} rel="noopener noreferrer nofollow" target="_blank">
              {k[0].toUpperCase() + k.slice(1)}
            </a>
          ))}
        </span>
      ) : (
        '—'
      ),
    ],
    [
      'Figure',
      sub.figure ? (
        <span className="stack-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={sub.figure.src} alt={sub.figure.alt} style={{ maxWidth: 320, height: 'auto', border: '1px solid var(--border)' }} />
          <span>
            {sub.figure.filename}, with the description “{sub.figure.alt}”
          </span>
        </span>
      ) : (
        '—'
      ),
    ],
    ['Email', <a key="e" href={`mailto:${sub.email}`}>{sub.email}</a>],
    ['Co-authors agreed', sub.coAuthorsAgreed ? 'Yes' : 'No'],
  ];
  if (sub.status === 'declined' && sub.declineReason) rows.push(['Reason given', sub.declineReason]);

  const publishedHref = sub.type === 'Paper' ? '/research' : '/research/products';

  return (
    <>
      <AdminHead
        crumbs={[{ label: 'Inbox', href: '/admin/inbox' }, { label: `${sub.type} submission` }]}
        title={sub.title}
        sub={`Submitted by ${first} ${whenLabel(sub.createdAt).replace('Today, ', 'today at ').replace(/^Yesterday$/, 'yesterday').replace(/^(\d)/, 'on $1')}.`}
      />

      {(done === 'approved' || sub.status === 'approved') && (
        <Notice>
          <span style={{ fontWeight: 600, color: 'var(--ok-dark)' }}>
            Published.{' '}
            {sub.type === 'Paper' || sub.type === 'Product' ? (
              <>
                It’s now on the <Link href={publishedHref}>{sub.type === 'Paper' ? 'Published research' : 'Product-driven research'}</Link> page.
              </>
            ) : (
              'Marked as approved.'
            )}{' '}
            Let {firstName} know at {sub.email}.
          </span>
          <Link href="/admin/inbox" className="text-link">
            Back to inbox
          </Link>
        </Notice>
      )}
      {(done === 'declined' || sub.status === 'declined') && (
        <Notice tone="info">
          <span style={{ fontWeight: 600 }}>
            Declined{sub.decidedBy ? ` by ${sub.decidedBy}` : ''}. It won’t appear on the site. Let {firstName} know at {sub.email}.
          </span>
          <Link href="/admin/inbox" className="text-link">
            Back to inbox
          </Link>
        </Notice>
      )}

      <div className="a-review">
        <section aria-label="Submission" className="a-panel a-review__main" style={{ padding: '12px 24px 18px', gap: 0 }}>
          {rows.map(([k, v]) => (
            <div key={k} className="a-dl">
              <span className="a-dl__k">{k}</span>
              <span>{v}</span>
            </div>
          ))}
        </section>

        {sub.status === 'waiting' && (
          <aside aria-label="Decision" className="a-panel a-review__side" style={{ padding: 22, gap: 14 }}>
            <h2 className="a-panel__title" style={{ fontSize: 18 }}>
              Your decision
            </h2>
            <form action={approveSubmission} className="stack-8" style={{ gap: 14 }}>
              <input type="hidden" name="id" value={sub.id} />
              {sub.type === 'Paper' && (
                <label className="a-check">
                  <input type="checkbox" name="featured" defaultChecked /> Show it on the homepage under Latest from members
                </label>
              )}
              <button type="submit" className="a-btn">
                Approve and publish
              </button>
            </form>
            {sub.type === 'Paper' && (
              <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.45 }}>
                Need to change something first? Approve it, then edit it from{' '}
                <Link href="/admin/papers">Published papers</Link>, or untick the homepage box and set it to hidden there.
              </p>
            )}
            <DeclineBox id={sub.id} firstName={firstName} />
            <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)', lineHeight: 1.45 }}>
              Email {firstName} at <a href={`mailto:${sub.email}`}>{sub.email}</a> to let them know either way.
            </p>
          </aside>
        )}
      </div>
    </>
  );
}
