import type { GlobalConfig } from 'payload';
import { anyone, signedIn } from './access';
import { urlField } from './fields';
import { refreshGlobal } from './rules';

const access = { read: anyone, update: signedIn };
const hooks = { afterChange: [refreshGlobal] };

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((label, i) => ({
  label,
  value: String(i),
}));

export const ThisWeek: GlobalConfig = {
  slug: 'this-week',
  label: 'This week',
  admin: { group: 'Homepage', description: 'The “This week” box on the homepage. Times are in WAT; visitors can switch time zones.' },
  access,
  hooks,
  fields: [
    {
      name: 'sessions',
      type: 'array',
      labels: { singular: 'Session', plural: 'Sessions' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'day', type: 'select', required: true, options: DAYS, admin: { width: '35%' } },
            {
              name: 'time',
              label: 'Time (WAT, 24 hour)',
              type: 'text',
              required: true,
              admin: { width: '25%', placeholder: '20:00' },
              validate: (v: string | null | undefined) =>
                /^([01]?\d|2[0-3]):[0-5]\d$/.test(v ?? '') ? true : 'Use 24 hour time, like 20:00.',
            },
            { name: 'name', type: 'text', required: true, admin: { width: '40%' } },
          ],
        },
        { name: 'detail', type: 'text', required: true, admin: { description: 'What’s on this week, in one line.' } },
      ],
    },
  ],
};

export const Cs197: GlobalConfig = {
  slug: 'cs197',
  label: 'CS197 next cohort',
  admin: { group: 'Programmes', description: 'The box near the top of the CS197 page.' },
  access,
  hooks,
  fields: [
    { name: 'show', label: 'Show the box', type: 'checkbox', defaultValue: true },
    { name: 'title', type: 'text', required: true, admin: { placeholder: 'The next cohort starts in January 2027' } },
    { name: 'subtitle', type: 'text', admin: { placeholder: 'Applications are open until 15 December.' } },
    {
      type: 'row',
      fields: [
        { name: 'buttonLabel', label: 'Button text', type: 'text', defaultValue: 'Apply for the next cohort', admin: { width: '40%' } },
        { ...urlField('applyUrl', 'Application link'), admin: { width: '60%', placeholder: 'https://', description: 'The button is hidden until this is set.' } },
      ],
    },
  ],
};

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Site settings',
  admin: { group: 'Settings', description: 'Links and the contact email used across the site.' },
  access,
  hooks,
  fields: [
    { name: 'email', label: 'Contact email', type: 'email', required: true },
    {
      type: 'collapsible',
      label: 'Community links',
      fields: [urlField('discord', 'Discord invite'), urlField('mailingList', 'Mailing list'), urlField('calendar', 'MLC calendar')],
    },
    {
      type: 'collapsible',
      label: 'Forms',
      fields: [
        urlField('sundaySlotForm', 'Request a Sunday Special slot'),
        urlField('focusGroupUpdateForm', 'Update your focus group’s details'),
        urlField('menteeForm', 'Apply as a mentee', 'The button is hidden until this is set.'),
        urlField('mentorForm', 'Become a mentor', 'The button is hidden until this is set.'),
        urlField('opportunitiesDoc', 'Open internships and fellowships document'),
      ],
    },
    { name: 'seeded', type: 'checkbox', defaultValue: false, admin: { hidden: true } },
  ],
};
