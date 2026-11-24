import { APIError, type CollectionConfig } from 'payload';
import { isSuperAdmin, signedIn, superAdmin, superAdminField, superAdminOrSelf } from '../access';

/* People who can sign in to /admin. A super admin adds someone with a temporary
   password and passes it on; the new admin is asked to set their own. */
export const Users: CollectionConfig = {
  slug: 'users',
  labels: { singular: 'Admin', plural: 'Admins' },
  auth: { tokenExpiration: 60 * 60 * 24 * 7, maxLoginAttempts: 8, lockTime: 15 * 60 * 1000 },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'email', 'role'],
    group: 'Team',
    description: 'Everyone who can sign in to admin. Only super admins can add or remove admins.',
  },
  access: {
    read: signedIn,
    create: superAdmin,
    update: superAdminOrSelf,
    delete: superAdmin,
  },
  fields: [
    { name: 'name', type: 'text', required: true },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Super admin: everything, including admins', value: 'super-admin' },
        { label: 'Editor: all website content', value: 'editor' },
      ],
      access: { create: superAdminField, update: superAdminField },
    },
    {
      name: 'mustChangePassword',
      type: 'checkbox',
      defaultValue: false,
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeChange: [
      async ({ data, req, operation, originalDoc }) => {
        if (operation === 'create') {
          const { totalDocs } = await req.payload.count({ collection: 'users', overrideAccess: true, req });
          if (totalDocs === 0) {
            // The very first account sets the site up, so it's a super admin.
            data.role = 'super-admin';
            data.mustChangePassword = false;
          } else {
            // Created by someone else with a temporary password.
            data.mustChangePassword = true;
          }
          return data;
        }

        const editingSelf = req.user && originalDoc && String(req.user.id) === String(originalDoc.id);
        if (data.password && editingSelf) data.mustChangePassword = false;
        if (data.password && !editingSelf) data.mustChangePassword = true;

        // Never leave the site without a super admin.
        if (originalDoc?.role === 'super-admin' && data.role && data.role !== 'super-admin') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'super-admin' } },
            overrideAccess: true,
            req,
          });
          if (totalDocs <= 1) throw new APIError('There must always be at least one super admin.', 400);
        }
        return data;
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        if (req.user && String(req.user.id) === String(id)) {
          throw new APIError('You can’t remove your own account. Ask another super admin.', 400);
        }
        const target = await req.payload.findByID({ collection: 'users', id, overrideAccess: true, req });
        if (target?.role === 'super-admin') {
          const { totalDocs } = await req.payload.count({
            collection: 'users',
            where: { role: { equals: 'super-admin' } },
            overrideAccess: true,
            req,
          });
          if (totalDocs <= 1) throw new APIError('There must always be at least one super admin.', 400);
        }
      },
    ],
  },
};

export { isSuperAdmin };
