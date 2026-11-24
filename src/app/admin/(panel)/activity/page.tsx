import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminHead, Panel } from '@/components/admin/ui';
import { undoActivity } from '@/lib/actions/admin';
import { requireAdmin } from '@/lib/auth';
import { readCollection } from '@/lib/store';
import type { ActivityArea } from '@/lib/types';
import { relativeTime } from '@/lib/utils';

export const metadata: Metadata = { title: 'Activity' };

const AREAS: ActivityArea[] = ['Inbox', 'Published papers', 'Reading groups', 'Monthly wins', 'Gallery', 'People', 'Admins'];

export default async function ActivityPage({ searchParams }: { searchParams: Promise<{ who?: string; area?: string; more?: string }> }) {
  const admin = await requireAdmin();
  const { who, area, more } = await searchParams;
  const log = await readCollection('activity');
  const people = Array.from(new Set(log.map((e) => e.who))).sort();
  const filtered = log.filter((e) => (!who || e.who === who) && (!area || e.area === area));
  const limit = more ? 200 : 25;

  // Only the latest change to each collection can be undone.
  const undoable = new Set<string>();
  const seen = new Set<string>();
  for (const e of log) {
    if (!e.collection || e.undone || e.before === undefined) continue;
    if (seen.has(e.collection)) continue;
    seen.add(e.collection);
    if (e.collection !== 'admins' || admin.role === 'Super admin') undoable.add(e.id);
  }
  const back = `/admin/activity${who || area ? `?${new URLSearchParams(Object.entries({ who, area }).filter(([, v]) => v) as [string, string][])}` : ''}`;

  return (
    <>
      <AdminHead title="Activity" sub="Every change made in admin, newest first. The latest change in each area can be undone." />
      <Panel>
        <form method="get" className="a-filters" style={{ paddingTop: 0 }}>
          <div className="a-field">
            <label htmlFor="who" className="a-field__label">
              Person
            </label>
            <select id="who" name="who" defaultValue={who ?? ''} className="a-select">
              <option value="">Everyone</option>
              {people.map((p) => (
                <option key={p}>{p}</option>
              ))}
            </select>
          </div>
          <div className="a-field">
            <label htmlFor="area" className="a-field__label">
              Area
            </label>
            <select id="area" name="area" defaultValue={area ?? ''} className="a-select">
              <option value="">All areas</option>
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="a-btn a-btn--ghost">
            Filter
          </button>
        </form>
        {filtered.length ? (
          <ul className="a-log a-log--full">
            {filtered.slice(0, limit).map((e) => (
              <li key={e.id}>
                <span>
                  <strong>{e.who}</strong> {e.what}
                  {e.undone && <span className="a-log__undone"> (undone)</span>}
                </span>
                <span className="a-log__area">{e.area}</span>
                <span className="a-log__when">{relativeTime(e.at)}</span>
                {undoable.has(e.id) ? (
                  <form action={undoActivity}>
                    <input type="hidden" name="id" value={e.id} />
                    <input type="hidden" name="back" value={back} />
                    <button type="submit" className="a-btn a-btn--ghost a-btn--sm">
                      Undo
                    </button>
                  </form>
                ) : (
                  <span />
                )}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ margin: 0, fontSize: 15, color: 'var(--text-2)' }}>No changes yet.</p>
        )}
        {!more && filtered.length > limit && (
          <Link href={`${back}${back.includes('?') ? '&' : '?'}more=1`} className="text-link">
            Show older changes
          </Link>
        )}
      </Panel>
    </>
  );
}
