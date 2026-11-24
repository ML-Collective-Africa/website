import type { CollectionConfig, CollectionBeforeValidateHook } from 'payload';
import { slugify } from '@/lib/utils';
import { anyone, signedIn } from '../access';
import { sortDateField, urlField, visibleField, yesNoImport } from '../fields';
import { refreshHooks } from '../rules';

const editors = { read: anyone, create: signedIn, update: signedIn, delete: signedIn };

const linkFields = [
  urlField('paper', 'Paper', 'arXiv, OpenReview, ACL Anthology or the publisher'),
  urlField('code', 'Code'),
  urlField('slides', 'Slides'),
  urlField('recording', 'Recording'),
];

/** Build a unique web address from the title the first time a paper is saved. */
const ensureSlug: CollectionBeforeValidateHook = async ({ data, req, originalDoc }) => {
  if (!data) return data;
  if (data.slug) {
    data.slug = slugify(String(data.slug));
    return data;
  }
  if (originalDoc?.slug) return data;
  const base = slugify(String(data.title ?? '')) || 'paper';
  let slug = base;
  for (let n = 2; ; n++) {
    const { totalDocs } = await req.payload.count({ collection: 'papers', where: { slug: { equals: slug } }, overrideAccess: true, req });
    if (!totalDocs) break;
    slug = `${base}-${n}`;
  }
  data.slug = slug;
  return data;
};

export const Papers: CollectionConfig = {
  slug: 'papers',
  labels: { singular: 'Paper', plural: 'Published papers' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'venue', 'year', 'visible', 'featured'],
    listSearchableFields: ['title', 'authors', 'venue'],
    group: 'Research',
    description: 'Everything on the Published research page. Untick “Show on the site” to hide a paper without deleting it.',
    components: { beforeListTable: ['/payload/components/ImportHelp#PapersImportHelp'] },
  },
  access: editors,
  defaultSort: '-sortDate',
  hooks: { ...refreshHooks, beforeValidate: [ensureSlug] },
  fields: [
    { name: 'title', type: 'text', required: true },
    { name: 'authors', type: 'text', required: true, admin: { description: 'In the order they appear on the paper.' } },
    {
      type: 'row',
      fields: [
        { name: 'venue', label: 'Where it appeared', type: 'text', required: true, admin: { width: '50%', placeholder: 'For example, AfricaNLP workshop, ACL 2026' } },
        {
          name: 'year',
          type: 'number',
          required: true,
          min: 2000,
          admin: { width: '20%' },
          validate: (v: number | null | undefined) =>
            !v ? 'Add the year.' : v > new Date().getFullYear() + 1 ? 'That year is too far ahead.' : true,
        },
        {
          name: 'topic',
          type: 'text',
          required: true,
          admin: { width: '30%', description: 'For example NLP, Speech, Medical imaging, Vision, Health, Safety.' },
        },
      ],
    },
    { name: 'summary', label: 'In short', type: 'textarea', admin: { description: 'Two to four sentences in plain language.' } },
    { name: 'abstract', type: 'textarea', admin: { description: 'Optional. Shown behind “Read the abstract”.' } },
    { name: 'links', type: 'group', fields: linkFields },
    {
      name: 'figure',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional. One image that shows the work at a glance.' },
      custom: { 'plugin-import-export': { disabled: true } },
    },
    visibleField(),
    {
      name: 'featured',
      label: 'Show on the homepage',
      type: 'checkbox',
      defaultValue: false,
      admin: { position: 'sidebar', description: 'The homepage shows the four newest papers ticked here.' },
      custom: yesNoImport,
    },
    sortDateField,
    {
      name: 'slug',
      label: 'Web address',
      type: 'text',
      unique: true,
      index: true,
      admin: { position: 'sidebar', description: 'Made from the title. The page lives at /research/papers/this-address.' },
    },
  ],
};

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Product', plural: 'Products' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'team', 'visible'],
    group: 'Research',
    description: 'The Product-driven research page: tools, systems and prototypes that came out of members’ research.',
  },
  access: editors,
  defaultSort: '-sortDate',
  hooks: refreshHooks,
  fields: [
    { name: 'name', type: 'text', required: true },
    { name: 'description', type: 'textarea', required: true },
    { name: 'team', type: 'text', required: true },
    urlField('link', 'Link', 'Optional. Where people can learn more.'),
    { name: 'image', type: 'upload', relationTo: 'media', admin: { description: 'Optional. A screenshot works well.' } },
    visibleField(),
    sortDateField,
  ],
};

export const FocusGroups: CollectionConfig = {
  slug: 'focus-groups',
  labels: { singular: 'Focus group', plural: 'Focus groups' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'topic', 'visible'],
    group: 'Research',
    description: 'The Ongoing research page. Untick “Show on Ongoing research” when a group wraps up.',
  },
  access: editors,
  defaultSort: '-sortDate',
  hooks: refreshHooks,
  fields: [
    { name: 'name', type: 'text', required: true, admin: { placeholder: 'For example, Speech focus group' } },
    { name: 'topic', type: 'text', required: true },
    { name: 'status', label: 'What they’re working on', type: 'textarea', required: true },
    { name: 'members', type: 'text', required: true, admin: { description: 'Names, separated by commas.' } },
    urlField('slides', 'Slides'),
    visibleField('Show on Ongoing research'),
    sortDateField,
  ],
};

export const Submissions: CollectionConfig = {
  slug: 'submissions',
  labels: { singular: 'Submission', plural: 'Submissions' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'type', 'status', 'createdAt'],
    group: 'Research',
    description:
      'Everything sent through Submit your research. Nothing goes live until someone sets it to Approved, which publishes it as a paper or product.',
  },
  access: { read: signedIn, create: () => false, update: signedIn, delete: signedIn },
  defaultSort: '-createdAt',
  fields: [
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'new',
      options: [
        { label: 'New', value: 'new' },
        { label: 'Approved: publish it', value: 'approved' },
        { label: 'Declined', value: 'declined' },
      ],
      admin: { position: 'sidebar', description: 'Approving publishes it straight away. Declined ones never appear on the site.' },
    },
    {
      name: 'featured',
      label: 'Show on the homepage once approved',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar', condition: (data) => data?.type === 'paper' },
    },
    { name: 'internalNote', label: 'Note for the team', type: 'textarea', admin: { position: 'sidebar', description: 'Only admins see this.' } },
    {
      name: 'publishedPaper',
      type: 'relationship',
      relationTo: 'papers',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.publishedPaper) },
    },
    {
      name: 'publishedProduct',
      type: 'relationship',
      relationTo: 'products',
      admin: { position: 'sidebar', readOnly: true, condition: (data) => Boolean(data?.publishedProduct) },
    },
    {
      name: 'type',
      type: 'select',
      required: true,
      options: [
        { label: 'Paper', value: 'paper' },
        { label: 'Product', value: 'product' },
      ],
    },
    { name: 'title', type: 'text', required: true },
    { name: 'authors', label: 'Authors or team', type: 'text' },
    {
      type: 'row',
      fields: [
        { name: 'venue', label: 'Where it appeared', type: 'text', admin: { width: '50%' } },
        { name: 'month', label: 'Date (year and month)', type: 'text', admin: { width: '25%', placeholder: '2026-08' } },
        { name: 'topic', type: 'text', admin: { width: '25%' } },
      ],
    },
    { name: 'summary', type: 'textarea' },
    { name: 'links', type: 'group', fields: linkFields },
    { name: 'figure', type: 'upload', relationTo: 'media' },
    { name: 'email', type: 'email', required: true, admin: { description: 'Use this to let them know. It never appears on the site.' } },
    { name: 'coAuthorsAgreed', label: 'Co-authors agreed to sharing', type: 'checkbox' },
  ],
  hooks: {
    afterChange: [
      async ({ doc, req, context }) => {
        if (context.fromApproval || doc.status !== 'approved') return doc;
        if (doc.publishedPaper || doc.publishedProduct) return doc;

        const figure = typeof doc.figure === 'object' ? doc.figure?.id : doc.figure;
        let update: Record<string, unknown> = {};
        if (doc.type === 'paper') {
          const year = Number(String(doc.month ?? '').slice(0, 4)) || Number(String(doc.venue ?? '').match(/20\d\d/)?.[0]) || new Date().getFullYear();
          const paper = await req.payload.create({
            collection: 'papers',
            data: {
              title: doc.title,
              authors: doc.authors || 'Not given',
              venue: doc.venue || 'Not given',
              year,
              topic: doc.topic || 'Other',
              summary: doc.summary || undefined,
              links: doc.links,
              figure: figure || undefined,
              visible: true,
              featured: Boolean(doc.featured),
              sortDate: new Date().toISOString(),
            },
            draft: false,
            overrideAccess: true,
            req,
          });
          update = { publishedPaper: paper.id };
        } else {
          const l = doc.links ?? {};
          const product = await req.payload.create({
            collection: 'products',
            data: {
              name: doc.title,
              description: doc.summary || doc.title,
              team: doc.authors || 'Not given',
              link: l.paper || l.code || l.slides || l.recording || undefined,
              image: figure || undefined,
              visible: true,
              sortDate: new Date().toISOString(),
            },
            draft: false,
            overrideAccess: true,
            req,
          });
          update = { publishedProduct: product.id };
        }
        return req.payload.update({
          collection: 'submissions',
          id: doc.id,
          data: update,
          overrideAccess: true,
          req,
          context: { fromApproval: true },
        });
      },
    ],
  },
};
