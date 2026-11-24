import type { Metadata } from 'next';
import Link from 'next/link';
import { RemoveAdmin } from '@/components/admin/RemoveAdmin';
import { AdminHead, Pill } from '@/components/admin/ui';
import { undoActivity } from '@/lib/actions/admin';
import { requireSuper } from '@/lib/auth';
import { readCollection } from '@/lib/store';
import { monthYear } from '@/lib/utils';

export const metadata: Metadata = { title: 'Admins' };

export default async function AdminsPage({ searchParams }: { searchParams: Promise<{ removed?: string }> }) {
  const me = await requireSuper();
  const { removed } = await searchParams;
  const [admins, log] = await Promise.all([readCollection('admins'), readCollection('activity')]);
  const supers = admins.filter((a) => a.role === 'Super admin').length;
  const removal = removed ? log.find((e) => e.id === removed && !e.undone) : undefined;
  const canUndo = removal && log.find((e) => e.collection === 'admins' && !e.undone && e.before !== undefined)?.id === removal.id;

  return (
    <>
      <AdminHead
        title="Admins"
        sub="Everyone who can sign in to admin. Only super admins can see this page."
        action={
          <Link href="/admin/admins/new" className="a-btn">
            Add an admin
          </Link>
        }
      />
      {removal && (
        <div role="status" className="a-notice a-notice--ok">
          <span>{removal.what.replace(/^removed (.*) from admin$/, '$1 was removed and no longer has access.')}</span>
          {canUndo && (
            <form action={undoActivity}>
              <input type="hidden" name="id" value={removal.id} />
              <input type="hidden" name="back" value="/admin/admins" />
              <button type="submit" className="a-btn a-btn--ghost a-btn--sm">
                Undo
              </button>
            </form>
          )}
        </div>
      )}
      <div className="a-table-wrap">
        <table className="a-table">
          <caption className="sr-only">People with admin access</caption>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Role</th>
              <th scope="col">Can edit</th>
              <th scope="col">Added</th>
              <th scope="col">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {admins.map((a) => {
              const lastSuper = a.role === 'Super admin' && supers <= 1;
              return (
                <tr key={a.id}>
                  <td style={{ fontWeight: 600 }}>{a.name}</td>
                  <td>{a.email}</td>
                  <td>{a.role === 'Super admin' ? <Pill tone="purple">Super admin</Pill> : <Pill tone="muted">Admin</Pill>}</td>
                  <td>{a.role === 'Super admin' ? 'Everything, including admins' : 'All website content'}</td>
                  <td>{monthYear(a.addedAt)}</td>
                  <td>
                    {a.id === me.id ? (
                      <span style={{ fontSize: 14, color: 'var(--muted)' }}>That’s you</span>
                    ) : (
                      <span style={{ display: 'flex', gap: 14, alignItems: 'center', flexWrap: 'wrap' }}>
                        <Link href={`/admin/admins/${a.id}`} className="text-link">
                          Change role
                        </Link>
                        {!lastSuper && <RemoveAdmin id={a.id} name={a.name} />}
                      </span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <p className="a-help">There must always be at least one super admin, so the last one can’t be removed.</p>
    </>
  );
}
