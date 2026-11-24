import type { Metadata } from 'next';
import Link from 'next/link';
import { AdminSide } from '@/components/admin/AdminSide';
import { Logo } from '@/components/Logo';
import { signOut } from '@/lib/actions/admin';
import { requireAdmin } from '@/lib/auth';
import { readCollection } from '@/lib/store';

export const metadata: Metadata = { title: { default: 'Admin', template: '%s · MLC Africa admin' }, robots: { index: false } };
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const admin = await requireAdmin();
  const waiting = (await readCollection('submissions')).filter((s) => s.status === 'waiting').length;
  return (
    <div className="admin">
      <header className="admin-top">
        <Link href="/admin" className="admin-top__brand">
          <span className="admin-top__logo">
            <Logo />
          </span>
          <span>MLC Africa admin</span>
        </Link>
        <div className="admin-top__right">
          <Link href="/" style={{ fontWeight: 600 }}>
            View website
          </Link>
          <span className="admin-top__who">
            {admin.name}, {admin.role}
          </span>
          <form action={signOut}>
            <button type="submit" className="admin-top__signout">
              Sign out
            </button>
          </form>
        </div>
      </header>
      <div className="admin-body">
        <AdminSide waiting={waiting} isSuper={admin.role === 'Super admin'} />
        <main id="content" className="admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}
