import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminHead } from '@/components/admin/ui';
import { moveToTorchbearers } from '@/lib/actions/admin';
import { readCollection } from '@/lib/store';
import type { PersonGroup } from '@/lib/types';

export const metadata: Metadata = { title: 'People' };

const TABS: { group: PersonGroup; label: string }[] = [
  { group: 'organiser', label: 'Organisers' },
  { group: 'advisor', label: 'Advisors' },
  { group: 'torchbearer', label: 'Torchbearers' },
];

export default async function AdminPeoplePage({ searchParams }: { searchParams: Promise<{ group?: string }> }) {
  const { group } = await searchParams;
  const tab = TABS.find((t) => t.group === group) ?? TABS[0];
  const people = await readCollection('people');
  const list = people.filter((p) => p.group === tab.group).sort((a, b) => a.order - b.order);

  return (
    <>
      <AdminHead
        title="People"
        sub="Organisers, advisors and Torchbearers shown on the About pages."
        action={
          <Link href={`/admin/people/new?group=${tab.group}`} className="a-btn">
            Add someone
          </Link>
        }
      />
      <nav aria-label="Groups" className="tabs a-tabs">
        {TABS.map((t) => (
          <Link key={t.group} href={`/admin/people?group=${t.group}`} className="tab" aria-current={t.group === tab.group ? 'page' : undefined}>
            {t.label} <span className="tab__count">({people.filter((p) => p.group === t.group).length})</span>
          </Link>
        ))}
      </nav>
      <div className="a-table-wrap">
        <table className="a-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Role</th>
              <th scope="col">{tab.group === 'torchbearer' ? 'Years' : 'Organiser since'}</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {list.map((p) => (
              <tr key={p.id}>
                <td>
                  <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <span className="a-avatar" aria-hidden="true">
                      {p.photo ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={p.photo} alt="" />
                      ) : (
                        p.name
                          .split(' ')
                          .map((n) => n[0])
                          .slice(0, 2)
                          .join('')
                      )}
                    </span>
                    <span style={{ fontWeight: 600 }}>{p.name}</span>
                  </span>
                </td>
                <td>{p.role}</td>
                <td>{tab.group === 'torchbearer' ? p.years ?? '—' : p.since ?? '—'}</td>
                <td>
                  <span style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                    <Link href={`/admin/people/${p.id}`} className="text-link" aria-label={`Edit ${p.name}`}>
                      Edit
                    </Link>
                    {tab.group === 'organiser' && (
                      <form action={moveToTorchbearers}>
                        <input type="hidden" name="id" value={p.id} />
                        <button type="submit" className="a-btn a-btn--ghost a-btn--sm">
                          Move to Torchbearers
                        </button>
                      </form>
                    )}
                  </span>
                </td>
              </tr>
            ))}
            {list.length === 0 && (
              <tr>
                <td colSpan={4} style={{ color: 'var(--text-2)' }}>
                  No one here yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <p className="a-help">Moving someone to Torchbearers keeps their profile on the site with the years they were active.</p>
    </>
  );
}
