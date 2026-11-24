import Link from 'next/link';
import { AdminHead, Panel } from '@/components/admin/ui';
import { requireAdmin } from '@/lib/auth';
import { readCollection } from '@/lib/store';
import { monthLabel, plural, relativeTime } from '@/lib/utils';

export default async function DashboardPage() {
  const admin = await requireAdmin();
  const [subs, wins, reading, activity] = await Promise.all([
    readCollection('submissions'),
    readCollection('wins'),
    readCollection('reading'),
    readCollection('activity'),
  ]);

  const waiting = subs.filter((s) => s.status === 'waiting');
  const byType = Object.entries(
    waiting.reduce<Record<string, number>>((acc, s) => ((acc[s.type] = (acc[s.type] ?? 0) + 1), acc), {}),
  ).map(([t, n]) => plural(n, t.toLowerCase()));

  const draftWins = wins.filter((w) => w.status === 'draft');
  const now = new Date();
  const thisMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const hasReading = reading.some((m) => m.key === thisMonth && m.status === 'published');

  const tasks: { title: string; sub: string; href: string; cta: string; primary?: boolean }[] = [];
  if (waiting.length) {
    tasks.push({
      title: `${plural(waiting.length, 'submission')} waiting for review`,
      sub: byType.join(', '),
      href: '/admin/inbox',
      cta: 'Open inbox',
      primary: true,
    });
  }
  for (const m of draftWins) {
    tasks.push({
      title: `${m.label.split(' ')[0]}’s monthly wins are still a draft`,
      sub: `${plural(m.wins.length, 'win')} added. Publish them on the first Sunday of the month.`,
      href: `/admin/wins?month=${m.key}`,
      cta: 'Finish wins',
    });
  }
  if (!hasReading) {
    tasks.push({
      title: `${monthLabel(thisMonth)}’s reading list isn’t published`,
      sub: 'The Reading Groups page is still showing an earlier month.',
      href: `/admin/reading?month=${thisMonth}`,
      cta: 'Add the reading list',
    });
  }

  const hour = now.getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <>
      <AdminHead title={`${greeting}, ${admin.name.split(' ')[0]}`} sub="Here’s what needs doing on the website." />

      <Panel title="Needs your attention">
        {tasks.length ? (
          <ul className="a-tasks">
            {tasks.map((t) => (
              <li key={t.title}>
                <div className="stack-8" style={{ gap: 4 }}>
                  <span style={{ fontSize: 16, fontWeight: 600 }}>{t.title}</span>
                  <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{t.sub}</span>
                </div>
                <Link href={t.href} className={`a-btn${t.primary ? '' : ' a-btn--ghost'}`}>
                  {t.cta}
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-2)' }}>Nothing waiting. You’re all caught up.</p>
        )}
      </Panel>

      <Panel title="Quick updates">
        <div className="a-quick">
          <Link href="/admin/reading">
            <strong>Add a reading group paper</strong>
            <span>This month’s list and slides</span>
          </Link>
          <Link href="/admin/wins">
            <strong>Add a monthly win</strong>
            <span>Placements, papers, awards</span>
          </Link>
          <Link href="/admin/gallery">
            <strong>Upload photos</strong>
            <span>Add to the gallery</span>
          </Link>
          <Link href="/admin/papers/new">
            <strong>Add a paper</strong>
            <span>Straight to Published research</span>
          </Link>
        </div>
      </Panel>

      <Panel title="Recent changes">
        {activity.length ? (
          <ul className="a-log">
            {activity.slice(0, 5).map((e) => (
              <li key={e.id}>
                <span>
                  <strong>{e.who}</strong> {e.what}
                </span>
                <span className="a-log__when">{relativeTime(e.at)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-2)' }}>No changes yet.</p>
        )}
        <Link href="/admin/activity" className="text-link">
          See all changes
        </Link>
      </Panel>
    </>
  );
}
