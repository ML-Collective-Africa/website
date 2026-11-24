import type { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { AdminForm } from '@/components/admin/AdminForm';
import { AdminHead } from '@/components/admin/ui';
import { requireSuper } from '@/lib/auth';
import { readCollection } from '@/lib/store';

export const metadata: Metadata = { title: 'Change an admin' };

export default async function EditAdminPage({ params }: { params: Promise<{ id: string }> }) {
  const me = await requireSuper();
  const { id } = await params;
  if (id === me.id) redirect('/admin/admins');
  const a = (await readCollection('admins')).find((x) => x.id === id);
  if (!a) notFound();
  return (
    <>
      <AdminHead crumbs={[{ label: 'Admins', href: '/admin/admins' }, { label: a.name }]} title={`Change ${a.name}’s access`} />
      <AdminForm existing={{ id: a.id, name: a.name, email: a.email, role: a.role }} />
    </>
  );
}
