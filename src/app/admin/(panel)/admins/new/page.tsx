import type { Metadata } from 'next';
import { AdminForm } from '@/components/admin/AdminForm';
import { AdminHead } from '@/components/admin/ui';
import { requireSuper } from '@/lib/auth';

export const metadata: Metadata = { title: 'Add an admin' };

export default async function AddAdminPage() {
  await requireSuper();
  return (
    <>
      <AdminHead
        crumbs={[{ label: 'Admins', href: '/admin/admins' }, { label: 'Add an admin' }]}
        title="Add an admin"
        sub="They’ll be able to sign in once you add them."
      />
      <AdminForm />
    </>
  );
}
