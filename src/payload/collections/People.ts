import type { CollectionAfterChangeHook, CollectionBeforeChangeHook, CollectionConfig } from 'payload';
import { anyone, signedIn } from '../access';
import { urlField } from '../fields';
import { findOrAddPlace, placeKey } from '../places';
import { FIRST_YEAR, refreshHooks, validateYear } from '../rules';

const editors = { read: anyone, create: signedIn, update: signedIn, delete: signedIn };

export const People: CollectionConfig = {
  slug: 'people',
  labels: { singular: 'Person', plural: 'Organisers and Torchbearers' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'role', 'group'],
    group: 'Team',
    description: 'The Organisers and Torchbearers pages. When someone steps down, change their group to Torchbearer and add the years they were active.',
  },
  access: editors,
  defaultSort: 'order',
  hooks: refreshHooks,
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'group',
          type: 'select',
          required: true,
          defaultValue: 'organiser',
          options: [
            { label: 'Organiser', value: 'organiser' },
            { label: 'Advisor', value: 'advisor' },
            { label: 'Torchbearer (past organiser)', value: 'torchbearer' },
          ],
          admin: { width: '50%' },
        },
      ],
    },
    { name: 'role', type: 'text', required: true, admin: { placeholder: 'For example, Saturday Reading Groups' } },
    {
      name: 'years',
      label: 'Years active',
      type: 'text',
      admin: { placeholder: '2023 to 2025', condition: (_, s) => s?.group === 'torchbearer' },
    },
    {
      type: 'row',
      fields: [
        { ...urlField('link', 'Profile link'), admin: { width: '60%', placeholder: 'https://' } },
        { name: 'linkLabel', label: 'Link text', type: 'text', defaultValue: 'LinkedIn', admin: { width: '40%' } },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media', admin: { description: 'A square photo works best.' } },
    {
      name: 'order',
      type: 'number',
      defaultValue: 100,
      admin: { position: 'sidebar', description: 'Lower numbers come first on the page.' },
    },
  ],
};

/* Labels people might type in a CSV, mapped to the stored values. */
const TYPE_ALIASES: Record<string, string> = {
  internship: 'internship',
  intern: 'internship',
  'research internship': 'internship',
  'grad school': 'grad-school',
  'grad-school': 'grad-school',
  'graduate school': 'grad-school',
  masters: 'grad-school',
  phd: 'grad-school',
  fellowship: 'fellowship',
  programme: 'programme',
  program: 'programme',
  'summer school': 'programme',
  'summer school or programme': 'programme',
};

const clearWaitingPlacements: CollectionAfterChangeHook = async ({ doc, req }) => {
  // A city added or fixed by hand here clears the "not on the map yet" note on
  // placements that were waiting for it. They match by city and country.
  const waiting = await req.payload.find({
    collection: 'placements',
    where: { mapStatus: { exists: true }, and: [{ mapStatus: { not_equals: '' } }] },
    limit: 500,
    depth: 0,
    overrideAccess: true,
    req,
  });
  for (const p of waiting.docs) {
    if (placeKey(p.city, p.country) !== doc.key) continue;
    await req.payload.update({
      collection: 'placements',
      id: p.id,
      data: { mapStatus: '' },
      overrideAccess: true,
      req,
      context: { mapChecked: true },
    });
  }
  return doc;
};

export const Places: CollectionConfig = {
  slug: 'places',
  labels: { singular: 'Map place', plural: 'Map places' },
  admin: {
    useAsTitle: 'city',
    defaultColumns: ['city', 'country', 'latitude', 'longitude'],
    group: 'Settings',
    description:
      'The cities on the homepage members map. These are added by themselves from each placement’s city and country, so you only need this page to move a pin that landed in the wrong spot. A city with no placements doesn’t show on the map.',
  },
  access: editors,
  hooks: {
    beforeChange: [({ data }) => ({ ...data, key: placeKey(data.city, data.country) })],
    afterChange: [clearWaitingPlacements, ...refreshHooks.afterChange],
    afterDelete: refreshHooks.afterDelete,
  },
  fields: [
    {
      name: 'city',
      label: 'Place name',
      type: 'text',
      required: true,
      admin: { description: 'As it should read on the map, for example “Lagos” or “Oxford, Cambridge and Bristol”.' },
    },
    { name: 'country', type: 'text', required: true },
    {
      type: 'row',
      fields: [
        { name: 'latitude', type: 'number', required: true, min: -90, max: 90, admin: { width: '50%', step: 0.0001 } },
        { name: 'longitude', type: 'number', required: true, min: -180, max: 180, admin: { width: '50%', step: 0.0001 } },
      ],
    },
    {
      type: 'ui',
      name: 'coordinatesHelp',
      admin: { components: { Field: '/payload/components/CoordinatesHelp' } },
    },
    // How placements find this place: city and country, lower case.
    { name: 'key', type: 'text', index: true, admin: { hidden: true } },
  ],
};

/* Make sure each placement's city is on the map, adding it if it's new. The map
   matches placements to places by city and country when the page is built, so
   there's no stored link to keep in step. */
const checkMapCity: CollectionBeforeChangeHook = async ({ data, originalDoc, req, context }) => {
  if (context.mapChecked) return data;
  const city = String(data.city ?? '').trim();
  const country = String(data.country ?? '').trim();
  if (!city || !country) {
    data.mapStatus = '';
    return data;
  }
  const unchanged =
    originalDoc && !originalDoc.mapStatus && placeKey(originalDoc.city, originalDoc.country) === placeKey(city, country);
  if (unchanged) return data;
  const found = await findOrAddPlace(req, city, country);
  data.mapStatus = found
    ? ''
    : `Couldn’t find “${city}, ${country}” on the map. Check the spelling, or add it under Settings → Map places.`;
  return data;
};

export const Placements: CollectionConfig = {
  slug: 'placements',
  labels: { singular: 'Placement', plural: 'Placements' },
  admin: {
    useAsTitle: 'person',
    defaultColumns: ['person', 'type', 'organisation', 'year'],
    listSearchableFields: ['person', 'organisation', 'title', 'city'],
    group: 'Members',
    description:
      'Internships, grad school, fellowships and programmes members have gone on to. Each one appears on its page, grouped by year. Add a city and country and they also appear on the homepage map.',
    components: { beforeListTable: ['/payload/components/ImportHelp#PlacementsImportHelp'] },
  },
  access: editors,
  defaultSort: '-year',
  hooks: { ...refreshHooks, beforeChange: [checkMapCity] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'person', type: 'text', required: true, admin: { width: '50%' } },
        {
          name: 'type',
          type: 'select',
          required: true,
          options: [
            { label: 'Internship', value: 'internship' },
            { label: 'Grad school', value: 'grad-school' },
            { label: 'Fellowship', value: 'fellowship' },
            { label: 'Summer school or programme', value: 'programme' },
          ],
          admin: { width: '50%' },
          custom: {
            'plugin-import-export': {
              hooks: {
                beforeImport: ({ value }: { value: unknown }) => {
                  const v = String(value ?? '').trim().toLowerCase();
                  return TYPE_ALIASES[v] ?? v;
                },
              },
            },
          },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'title',
          label: 'What',
          type: 'text',
          admin: { width: '50%', description: 'For example “MSc, Artificial Intelligence”, “Research internship” or the fellowship’s name.' },
        },
        {
          name: 'organisation',
          label: 'Where',
          type: 'text',
          required: true,
          admin: { width: '50%', description: 'The university, company or programme, for example “University of Oxford” or “EPFL”.' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'city',
          type: 'text',
          admin: { width: '35%', description: 'For the homepage map, for example “Lausanne”. Leave empty to keep them off the map.' },
        },
        {
          name: 'country',
          type: 'text',
          validate: (v: unknown, { siblingData }: { siblingData: Record<string, unknown> }) =>
            siblingData?.city && !String(v ?? '').trim() ? 'Add the country too, so the map finds the right city.' : true,
          admin: { width: '35%', description: 'For example “Switzerland”.' },
        },
        {
          // A plain number, not a dropdown, so each new year is allowed without changing the database.
          name: 'year',
          type: 'number',
          required: true,
          min: FIRST_YEAR,
          defaultValue: () => new Date().getFullYear(),
          validate: validateYear,
          admin: { width: '30%', step: 1, description: 'The year it starts, from 2022 up to next year.' },
        },
      ],
    },
    {
      name: 'mapStatus',
      type: 'text',
      admin: {
        position: 'sidebar',
        readOnly: true,
        condition: (data) => Boolean(data?.mapStatus),
        components: { Field: '/payload/components/MapStatus' },
      },
      custom: { 'plugin-import-export': { disabled: true } },
    },
  ],
};
