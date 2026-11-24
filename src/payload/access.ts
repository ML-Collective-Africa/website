import type { Access, FieldAccess } from 'payload';

/* Two roles: super admins manage everything including other admins; editors
   manage all content. Visitors can read published content only. */

type WithRole = { role?: string | null } | null | undefined;

export const isSuperAdmin = (user: WithRole) => user?.role === 'super-admin';

export const anyone: Access = () => true;
export const signedIn: Access = ({ req }) => Boolean(req.user);
export const superAdmin: Access = ({ req }) => isSuperAdmin(req.user);

/** Super admins, or a user acting on their own account. */
export const superAdminOrSelf: Access = ({ req }) => {
  if (!req.user) return false;
  if (isSuperAdmin(req.user)) return true;
  return { id: { equals: req.user.id } };
};

export const superAdminField: FieldAccess = ({ req }) => isSuperAdmin(req.user);
