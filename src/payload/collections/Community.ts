import type { CollectionBeforeChangeHook, CollectionConfig, DateField, Validate } from 'payload';
import { WIN_KINDS } from '@/lib/wins';
import { anyone, signedIn } from '../access';
import { sortDateField, urlField } from '../fields';
import { firstOfMonth, monthKey, refreshHooks, validateMonthNotTooFar } from '../rules';

const editors = { read: anyone, create: signedIn, update: signedIn, delete: signedIn };

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const label = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

/** A month picker that allows one entry per month, and nothing past next month. */
function monthField(collection: 'wins-months' | 'reading-months'): DateField {
  const validate: Validate<Date | string> = async (value, options) => {
    const tooFar = validateMonthNotTooFar(value);
    if (tooFar !== true) return tooFar;
    const { req, id } = options as unknown as { req: { payload: import('payload').Payload }; id?: string | number };
    const key = monthKey(value as string);
    const existing = await req.payload.find({
      collection: collection,
      where: { key: { equals: key } },
      draft: true,
      limit: 1,
      overrideAccess: true,
      depth: 0,
    });
    const other = existing.docs.find((d) => String(d.id) !== String(id));
    return other ? `${label(value as string)} already has an entry. Open that one instead.` : true;
  };
  return {
    name: 'month',
    type: 'date',
    required: true,
    admin: { date: { pickerAppearance: 'monthOnly', displayFormat: 'MMMM yyyy' } },
    validate: validate as DateField['validate'],
    hooks: { beforeValidate: [({ value }) => firstOfMonth(value) as string] },
  };
}

/** Keeps a readable title ("October 2026") and a yyyy-mm key for the month's web address. */
const monthTitle: CollectionBeforeChangeHook = ({ data }) => {
  if (data.month) {
    data.key = monthKey(data.month);
    data.title = label(data.month);
  }
  return data;
};

const hiddenMonthFields = [
  { name: 'title', type: 'text' as const, admin: { hidden: true } },
  { name: 'key', type: 'text' as const, index: true, admin: { hidden: true } },
];

export const WinsMonths: CollectionConfig = {
  slug: 'wins-months',
  labels: { singular: 'Monthly wins', plural: 'Monthly wins' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', '_status', 'updatedAt'],
    group: 'Life at MLC Africa',
    description: 'One entry per month. Add wins through the month, then Publish on the first Sunday.',
  },
  access: editors,
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-month',
  hooks: { ...refreshHooks, beforeChange: [monthTitle] },
  fields: [
    monthField('wins-months'),
    { name: 'intro', label: 'A line about the month', type: 'textarea' },
    {
      name: 'wins',
      type: 'array',
      labels: { singular: 'Win', plural: 'Wins' },
      admin: { initCollapsed: false },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
            { name: 'kind', label: 'Type of win', type: 'select', required: true, options: WIN_KINDS, admin: { width: '50%' } },
          ],
        },
        {
          name: 'text',
          label: 'What happened',
          type: 'textarea',
          required: true,
          admin: { description: 'The full sentence for the site. Put paper titles in “curly quotes” to set them in italics.' },
        },
        { name: 'highlight', label: 'Show on the homepage', type: 'checkbox' },
      ],
    },
    ...hiddenMonthFields,
  ],
};

export const ReadingMonths: CollectionConfig = {
  slug: 'reading-months',
  labels: { singular: 'Reading list', plural: 'Reading lists' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'theme', '_status'],
    group: 'Programmes',
    description: 'One entry per month. The newest published month is “This month” on the Reading Groups page; earlier ones become Past themes.',
  },
  access: editors,
  versions: { drafts: true, maxPerDoc: 20 },
  defaultSort: '-month',
  hooks: { ...refreshHooks, beforeChange: [monthTitle] },
  fields: [
    monthField('reading-months'),
    { name: 'theme', type: 'text', required: true, admin: { placeholder: 'For example, Speech and audio' } },
    {
      name: 'papers',
      type: 'array',
      labels: { singular: 'Paper', plural: 'Papers' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'date', label: 'Saturday', type: 'date', admin: { width: '30%', date: { pickerAppearance: 'dayOnly', displayFormat: 'EEE d MMM' } } },
            { name: 'title', label: 'Paper', type: 'text', required: true, admin: { width: '70%' } },
          ],
        },
        { name: 'note', type: 'text', admin: { description: 'One line on why it’s worth reading.' } },
        {
          type: 'row',
          fields: [
            { name: 'ledBy', label: 'Led by', type: 'text', admin: { width: '40%', description: 'For the team. Not shown on the site.' } },
            { ...urlField('slides', 'Slides link'), admin: { width: '60%', placeholder: 'https://' } },
          ],
        },
      ],
    },
    ...hiddenMonthFields,
  ],
};

const isSundayNotFuture: Validate<Date | string> = (value) => {
  if (!value) return 'Choose the Sunday.';
  const d = new Date(value as string);
  if (d.getUTCDay() !== 0 && new Date(d.getTime() + 12 * 3600e3).getUTCDay() !== 0) return 'Sunday Specials are on Sundays. Pick a Sunday.';
  if (d.getTime() > Date.now() + 24 * 3600e3) return 'Add sessions after they happen, not before.';
  return true;
};

export const Showcase: CollectionConfig = {
  slug: 'showcase',
  labels: { singular: 'Showcase session', plural: 'Research showcase' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'updatedAt'],
    group: 'Life at MLC Africa',
    description: 'One entry per Sunday Special, with the talks given that day.',
  },
  access: editors,
  defaultSort: '-date',
  hooks: {
    ...refreshHooks,
    beforeChange: [
      ({ data }) => {
        if (data.date) {
          const d = new Date(data.date);
          data.title = `Sunday ${d.getUTCDate()} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
        }
        return data;
      },
    ],
  },
  fields: [
    {
      name: 'date',
      label: 'Sunday',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayOnly', displayFormat: 'EEE d MMM yyyy' } },
      validate: isSundayNotFuture as DateField['validate'],
    },
    urlField('notes', 'Meeting notes link'),
    {
      name: 'talks',
      type: 'array',
      minRows: 1,
      labels: { singular: 'Talk', plural: 'Talks' },
      fields: [
        { name: 'speaker', label: 'Speaker or group', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'summary', type: 'textarea', required: true },
        urlField('slides', 'Slides link'),
      ],
    },
    { name: 'title', type: 'text', admin: { hidden: true } },
  ],
};

export const Gallery: CollectionConfig = {
  slug: 'gallery',
  labels: { singular: 'Gallery item', plural: 'Gallery' },
  admin: {
    useAsTitle: 'caption',
    defaultColumns: ['caption', 'event', 'sortDate'],
    group: 'Life at MLC Africa',
    description: 'Photos and videos on the Gallery page. Each photo’s description (for screen readers) is set when you upload it.',
  },
  access: editors,
  defaultSort: '-sortDate',
  hooks: refreshHooks,
  fields: [
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'A photo, or leave empty and add a YouTube link below.' } },
    {
      ...urlField('video', 'YouTube link', 'For videos. Make sure captions are turned on.'),
      validate: (v: string | null | undefined, { siblingData }: { siblingData: { photo?: unknown } }) => {
        if (!v && !siblingData.photo) return 'Add a photo or a YouTube link.';
        if (v && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(v)) return 'Use a YouTube link.';
        return true;
      },
    } as never,
    {
      name: 'videoDescription',
      label: 'Describe the video',
      type: 'text',
      admin: { condition: (_: unknown, s: { video?: string }) => Boolean(s?.video), description: 'For people using screen readers.' },
      validate: (v: string | null | undefined, { siblingData }: { siblingData: { video?: string } }) =>
        siblingData.video && !v ? 'Describe the video for screen reader users.' : true,
    } as never,
    { name: 'caption', type: 'text', required: true },
    { name: 'event', type: 'text', required: true, admin: { placeholder: 'For example, Deep Learning Indaba 2026' } },
    sortDateField,
  ],
};

export const Announcements: CollectionConfig = {
  slug: 'announcements',
  labels: { singular: 'Announcement', plural: 'Announcements' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'startsAt'],
    group: 'Homepage',
    description:
      'The banner under the homepage hero. It shows from “Show from” until the day of the event, then hides by itself. Special sessions are also listed on the Sunday Specials page.',
  },
  access: editors,
  defaultSort: '-startsAt',
  hooks: refreshHooks,
  fields: [
    {
      name: 'kind',
      type: 'select',
      required: true,
      defaultValue: 'special-session',
      options: [
        { label: 'Special session (a Sunday Special on one topic)', value: 'special-session' },
        { label: 'Event (anything else, with a link to register)', value: 'event' },
      ],
    },
    { name: 'title', type: 'text', required: true, admin: { placeholder: 'For example, Applying to grad school' } },
    {
      name: 'startsAt',
      label: 'When',
      type: 'date',
      required: true,
      admin: { date: { pickerAppearance: 'dayAndTime', displayFormat: 'EEE d MMM yyyy, h:mm a' }, description: 'Use your local time; the site shows it in WAT.' },
    },
    { name: 'details', type: 'textarea', admin: { description: 'One or two lines. Shown on the Sunday Specials page.' } },
    {
      type: 'row',
      fields: [
        { name: 'linkLabel', label: 'Link text', type: 'text', admin: { width: '40%', placeholder: 'Register' } },
        { ...urlField('linkUrl', 'Link'), admin: { width: '60%', placeholder: 'https://' } },
      ],
    },
    {
      name: 'showFrom',
      label: 'Show from',
      type: 'date',
      defaultValue: () => new Date().toISOString(),
      admin: { position: 'sidebar', date: { pickerAppearance: 'dayOnly' }, description: 'The banner appears from this day.' },
    },
    {
      name: 'onHomepage',
      label: 'Show as the homepage banner',
      type: 'checkbox',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
};
