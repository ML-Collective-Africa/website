export function slugify(s: string): string {
  return s
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[’'"“”]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '');
}

export function uniqueSlug(base: string, taken: Set<string>): string {
  let slug = slugify(base) || 'item';
  let n = 2;
  while (taken.has(slug)) slug = `${slugify(base)}-${n++}`;
  taken.add(slug);
  return slug;
}

export function newId(): string {
  return Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
}

export function yearFrom(venue: string): string {
  return venue.match(/\b(20\d\d)\b/)?.[1] ?? '';
}

export function paginate<T>(items: T[], page: number, per: number) {
  const pages = Math.max(1, Math.ceil(items.length / per));
  const current = Math.min(Math.max(1, Math.floor(page) || 1), pages);
  return { pages, current, items: items.slice((current - 1) * per, current * per) };
}

export function pageParam(v: string | string[] | undefined): number {
  const n = Number(Array.isArray(v) ? v[0] : v);
  return Number.isFinite(n) && n >= 1 ? Math.floor(n) : 1;
}

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

/** "2026-09" to "September 2026" */
export function monthLabel(key: string): string {
  const [y, m] = key.split('-').map(Number);
  if (!y || !m) return key;
  return `${MONTHS[m - 1]} ${y}`;
}

/** ISO date to "Sun 16 Nov" (and the year when asked). Dates are treated as calendar days in UTC. */
export function dayLabel(iso: string, withYear = false): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  const base = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]}`;
  return withYear ? `${base} ${d.getUTCFullYear()}` : base;
}

/** ISO date to "14 Sep 2026" */
export function shortDate(iso: string): string {
  const d = new Date(`${iso.slice(0, 10)}T12:00:00Z`);
  return `${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** Relative time for admin lists: "2 hours ago", "Yesterday", "26 Oct". */
export function relativeTime(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const mins = Math.round((now.getTime() - then.getTime()) / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return mins === 1 ? '1 minute ago' : `${mins} minutes ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24 && then.getDate() === now.getDate()) return hours === 1 ? '1 hour ago' : `${hours} hours ago`;
  const days = Math.floor((startOfDay(now) - startOfDay(then)) / 86400000);
  if (days <= 1) return days === 0 ? 'Today' : 'Yesterday';
  if (days < 7) return `${days} days ago`;
  if (days < 14) return '1 week ago';
  return `${then.getDate()} ${SHORT_MONTHS[then.getMonth()]}${then.getFullYear() !== now.getFullYear() ? ` ${then.getFullYear()}` : ''}`;
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
}

/** "Today, 9:14am" style for the inbox. */
export function whenLabel(iso: string, now = new Date()): string {
  const then = new Date(iso);
  const days = Math.floor((startOfDay(now) - startOfDay(then)) / 86400000);
  const h = then.getHours();
  const time = `${h % 12 === 0 ? 12 : h % 12}:${String(then.getMinutes()).padStart(2, '0')}${h < 12 ? 'am' : 'pm'}`;
  if (days === 0) return `Today, ${time}`;
  if (days === 1) return 'Yesterday';
  return `${then.getDate()} ${SHORT_MONTHS[then.getMonth()]}`;
}

export function monthYear(iso: string): string {
  const d = new Date(iso);
  return `${SHORT_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

export function plural(n: number, one: string, many = `${one}s`) {
  return `${n} ${n === 1 ? one : many}`;
}

export function isHttpUrl(s: string | undefined): s is string {
  if (!s) return false;
  try {
    const u = new URL(s);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** "Sun 16 Nov, 8pm WAT" from an ISO time. WAT is UTC+1 all year. */
export function watLabel(iso: string, withYear = false): string {
  const d = new Date(new Date(iso).getTime() + 3600e3);
  const h = d.getUTCHours();
  const m = d.getUTCMinutes();
  const time = `${h % 12 === 0 ? 12 : h % 12}${m ? `:${String(m).padStart(2, '0')}` : ''}${h < 12 ? 'am' : 'pm'}`;
  const day = `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]}${withYear ? ` ${d.getUTCFullYear()}` : ''}`;
  return `${day}, ${time} WAT`;
}
