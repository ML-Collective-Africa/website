import type { CollectionAfterChangeHook, CollectionAfterDeleteHook, GlobalAfterChangeHook } from 'payload';

/* Shared rules for dates and years, so mistakes like a "2028" placement or two
   entries for the same month are blocked when an editor saves. */

export const FIRST_YEAR = 2022;

/** Years allowed: from the community's first year up to next year, so an offer
    made in 2026 for a 2027 start can be added straight away. */
export function validateYear(value: unknown) {
  const y = Number(value);
  const max = new Date().getFullYear() + 1;
  if (!y) return 'Choose a year.';
  if (y < FIRST_YEAR || y > max) return `Choose a year between ${FIRST_YEAR} and ${max}.`;
  return true;
}

/** First day of a month, as yyyy-mm, in UTC. */
export function monthKey(value: string | Date) {
  const d = new Date(value);
  return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
}

/** A month can be at most next month, so lists can be planned a month ahead. */
export function validateMonthNotTooFar(value: unknown) {
  if (!value) return 'Choose a month.';
  const now = new Date();
  const next = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  if (monthKey(value as string) > monthKey(next)) return 'You can only add this month or next month, not further ahead.';
  return true;
}

/** Normalise a month picker value to midnight UTC on the 1st, so months compare cleanly. */
export function firstOfMonth(value: unknown) {
  if (!value) return value;
  const d = new Date(value as string);
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)).toISOString();
}

/* ---------- Keeping the public site fresh ---------- */

/* Pages are cached for speed. After any edit, ask Next.js to rebuild them on the
   next visit. Outside a request (for example during seeding) there's nothing to
   refresh, so errors are ignored. */
async function refreshSite() {
  try {
    const { revalidatePath } = await import('next/cache');
    revalidatePath('/', 'layout');
  } catch {
    /* not running inside Next.js */
  }
}

export const refreshAfterChange: CollectionAfterChangeHook = async ({ doc }) => {
  await refreshSite();
  return doc;
};

export const refreshAfterDelete: CollectionAfterDeleteHook = async ({ doc }) => {
  await refreshSite();
  return doc;
};

export const refreshGlobal: GlobalAfterChangeHook = async ({ doc }) => {
  await refreshSite();
  return doc;
};

export const refreshHooks = { afterChange: [refreshAfterChange], afterDelete: [refreshAfterDelete] };
