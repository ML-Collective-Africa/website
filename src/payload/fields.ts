import type { Field, TextField, TextFieldSingleValidation } from 'payload';

/* Small field builders shared by the collections. */

export const validateUrl: TextFieldSingleValidation = (value) => {
  if (!value) return true;
  try {
    const u = new URL(value);
    return u.protocol === 'http:' || u.protocol === 'https:' ? true : 'Links need to start with https://';
  } catch {
    return 'Links need to start with https://';
  }
};

export const urlField = (name: string, label: string, description?: string): TextField => ({
  name,
  label,
  type: 'text',
  validate: validateUrl,
  admin: { placeholder: 'https://', description },
});

/** Newest first ordering for lists. Defaults to when the entry was added. */
export const sortDateField: Field = {
  name: 'sortDate',
  label: 'Date for ordering',
  type: 'date',
  required: true,
  defaultValue: () => new Date().toISOString(),
  admin: {
    position: 'sidebar',
    description: 'Lists on the site show the newest date first.',
    date: { pickerAppearance: 'dayOnly' },
  },
};

export const visibleField = (label = 'Show on the site'): Field => ({
  name: 'visible',
  label,
  type: 'checkbox',
  defaultValue: true,
  admin: { position: 'sidebar' },
  custom: yesNoImport,
});

/** Spreadsheet tick boxes: accept yes/no, y/n, true/false, 1/0 and ticks. */
export const yesNoImport = {
  'plugin-import-export': {
    hooks: {
      beforeImport: ({ value }: { value: unknown }) => {
        if (value === '' || value === null || value === undefined) return undefined;
        if (typeof value === 'boolean') return value;
        return ['yes', 'y', 'true', '1', 'x', '✓'].includes(String(value).trim().toLowerCase());
      },
    },
  },
};
