import type { CollectionConfig } from 'payload';
import { anyone, signedIn } from '../access';

/* Every uploaded image. Files live in Vercel Blob in production, or a local
   folder in development. */
export const Media: CollectionConfig = {
  slug: 'media',
  labels: { singular: 'Image', plural: 'Images' },
  admin: { group: 'Files', description: 'All uploaded images. Each one needs a short description for screen reader users.' },
  access: { read: anyone, create: signedIn, update: signedIn, delete: signedIn },
  upload: {
    mimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    staticDir: 'media',
    // Payload makes a smaller copy for lists and cards; the original is kept too.
    imageSizes: [{ name: 'card', width: 900, withoutEnlargement: true }],
    adminThumbnail: 'card',
  },
  fields: [
    {
      name: 'alt',
      label: 'Describe the image',
      type: 'text',
      required: true,
      admin: { description: 'What’s in the image, for people using screen readers.' },
    },
  ],
};
