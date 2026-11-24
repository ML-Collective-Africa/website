import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { readCollection } from '@/lib/store';
import type { Admin } from '@/lib/types';
import { SESSION_COOKIE, verifySession } from './session';

export type CurrentAdmin = Omit<Admin, 'passwordHash'>;

/** The signed-in admin, checked against the store so removed admins lose access at once. */
export async function getCurrentAdmin(): Promise<CurrentAdmin | null> {
  const jar = await cookies();
  const session = await verifySession(jar.get(SESSION_COOKIE)?.value);
  if (!session) return null;
  const admins = await readCollection('admins');
  const admin = admins.find((a) => a.id === session.uid);
  if (!admin) return null;
  return { id: admin.id, name: admin.name, email: admin.email, role: admin.role, addedAt: admin.addedAt };
}

export async function requireAdmin(): Promise<CurrentAdmin> {
  const admin = await getCurrentAdmin();
  if (!admin) redirect('/admin/login');
  return admin;
}

export async function requireSuper(): Promise<CurrentAdmin> {
  const admin = await requireAdmin();
  if (admin.role !== 'Super admin') redirect('/admin');
  return admin;
}
