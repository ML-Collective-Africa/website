import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { importExportPlugin } from '@payloadcms/plugin-import-export';
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob';
import { buildConfig } from 'payload';
import sharp from 'sharp';
import { FocusGroups, Papers, Products, Submissions } from './payload/collections/Research';
import { Announcements, Gallery, ReadingMonths, Showcase, WinsMonths } from './payload/collections/Community';
import { Media } from './payload/collections/Media';
import { People, Placements, Places } from './payload/collections/People';
import { Users } from './payload/collections/Users';
import { Cs197, SiteSettings, ThisWeek } from './payload/globals';

const dirname = path.dirname(fileURLToPath(import.meta.url));

if (!process.env.PAYLOAD_SECRET && process.env.NODE_ENV === 'production') {
  throw new Error('PAYLOAD_SECRET must be set. It signs admin sign-ins.');
}

export default buildConfig({
  secret: process.env.PAYLOAD_SECRET || 'dev-only-payload-secret-change-me',
  serverURL: process.env.NEXT_PUBLIC_SITE_URL || undefined,
  sharp,

  admin: {
    user: Users.slug,
    theme: 'light',
    importMap: { baseDir: dirname },
    meta: {
      titleSuffix: ' · MLC Africa admin',
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/logo.svg' }],
    },
    components: {
      graphics: { Logo: '/payload/components/Logo', Icon: '/payload/components/Icon' },
      beforeDashboard: ['/payload/components/Welcome'],
      afterLogin: ['/payload/components/AfterLogin'],
      beforeNavLinks: ['/payload/components/NavOpener'],
      actions: ['/payload/components/InviteAdmin', '/payload/components/ViewSite'],
    },
  },

  // Sidebar order follows the website: homepage first, then each section.
  collections: [
    Announcements,
    Submissions,
    Papers,
    Products,
    FocusGroups,
    ReadingMonths,
    Placements,
    WinsMonths,
    Showcase,
    Gallery,
    People,
    Users,
    Media,
    Places,
  ],
  globals: [ThisWeek, Cs197, SiteSettings],

  db: postgresAdapter({
    pool: { connectionString: process.env.DATABASE_URL || '' },
    // On a laptop, the database structure follows the code automatically ("push").
    // On Vercel or any build server, only migrations change it: the build runs
    // `payload migrate` once, before pages are built (see package.json).
    push: !(process.env.VERCEL || process.env.CI || process.env.NODE_ENV === 'production'),
  }),

  plugins: [
    // Import and Export (CSV) on the lists where people add many entries at once.
    // Imports run straight away instead of through a background job queue, which
    // would need a separate worker on Vercel.
    importExportPlugin({
      collections: [
        { slug: 'placements', import: { disableJobsQueue: true }, export: { disableJobsQueue: true } },
        { slug: 'papers', import: { disableJobsQueue: true }, export: { disableJobsQueue: true } },
      ],
      // Plain wording, and "add as new" picked by default so the technical
      // "match field" setting stays out of the way.
      overrideImportCollection: ({ collection }) => ({
        ...collection,
        fields: collection.fields.map((f) =>
          'name' in f && f.name === 'importMode' && f.type === 'select'
            ? {
                ...f,
                label: 'What to do',
                defaultValue: 'create',
                options: [
                  { label: 'Add every row as a new entry', value: 'create' },
                  { label: 'Update existing entries (the file needs an id column, as in an export)', value: 'update' },
                  { label: 'Update existing entries and add the rest', value: 'upsert' },
                ],
              }
            : f,
        ),
      }),
    }),
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      // Images are public, so serve them straight from Blob instead of through the app.
      // Uploaded and exported spreadsheets stay private, so they go through the app.
      collections: { media: { disablePayloadAccessControl: true }, imports: true, exports: true },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],

  typescript: { outputFile: path.resolve(dirname, 'payload-types.ts') },
  graphQL: { disable: true },
  telemetry: false,
});
