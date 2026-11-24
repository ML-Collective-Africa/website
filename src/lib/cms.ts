import config from '@payload-config';
import { getPayload, type Where } from 'payload';
import { cache } from 'react';
import { LINKS } from '@/content/links';
import type { GradStudent, InternYear, NameLine, Place, Session } from '@/content/site';
import type { Media } from '@/payload-types';
import { placeKey } from '@/payload/places';
import type { GalleryItem, Paper, Person, PersonGroup, Product, ReadingMonth, ShowcaseSession, WinKind, WinsMonth } from './types';

/* Read helpers for the public site. Everything comes from Payload; only visible,
   published content comes out of here. Submissions never do. */

export const getCms = cache(() => getPayload({ config }));

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const SHORT_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function image(m: number | Media | null | undefined): { src: string; alt: string } | undefined {
  if (!m || typeof m !== 'object' || !m.url) return undefined;
  return { src: m.sizes?.card?.url || m.url, alt: m.alt };
}

async function all<T>(collection: Parameters<Awaited<ReturnType<typeof getCms>>['find']>[0]['collection'], where?: Where, sort?: string | string[]) {
  const payload = await getCms();
  const res = await payload.find({ collection, where, sort, limit: 0, pagination: false, depth: 1 });
  return res.docs as T[];
}

/* ---------- Site settings and links ---------- */

export const getLinks = cache(async () => {
  const payload = await getCms();
  const s = await payload.findGlobal({ slug: 'site-settings' });
  const pick = (v: string | null | undefined, fallback: string) => v || fallback;
  const opportunitiesDoc = pick(s.opportunitiesDoc, LINKS.opportunitiesDoc);
  return {
    ...LINKS,
    email: pick(s.email, LINKS.email),
    discord: pick(s.discord, LINKS.discord),
    mailingList: pick(s.mailingList, LINKS.mailingList),
    calendar: pick(s.calendar, LINKS.calendar),
    sundaySlotForm: pick(s.sundaySlotForm, LINKS.sundaySlotForm),
    focusGroupUpdateForm: pick(s.focusGroupUpdateForm, LINKS.focusGroupUpdateForm),
    menteeApply: s.menteeForm || '',
    mentorApply: s.mentorForm || '',
    opportunitiesDoc,
    // A Google Doc's /edit link shows in the page through its /preview address.
    opportunitiesEmbed: opportunitiesDoc.replace(/\/edit.*$/, '/preview'),
  };
});

export type Links = Awaited<ReturnType<typeof getLinks>>;

/* ---------- Research ---------- */

type PaperDoc = import('@/payload-types').Paper;

function toPaper(p: PaperDoc): Paper {
  return {
    id: String(p.id),
    slug: p.slug ?? String(p.id),
    title: p.title,
    authors: p.authors,
    venue: p.venue,
    year: String(p.year),
    topic: p.topic,
    summary: p.summary ?? undefined,
    abstract: p.abstract ?? undefined,
    links: {
      paper: p.links?.paper ?? undefined,
      code: p.links?.code ?? undefined,
      slides: p.links?.slides ?? undefined,
      recording: p.links?.recording ?? undefined,
    },
    figure: image(p.figure),
    visible: Boolean(p.visible),
    featured: Boolean(p.featured),
    order: 0,
  };
}

export const getPublishedPapers = cache(async () =>
  (await all<PaperDoc>('papers', { visible: { equals: true } }, '-sortDate')).map(toPaper),
);

export async function getFeaturedPapers(limit = 4) {
  return (await getPublishedPapers()).filter((p) => p.featured).slice(0, limit);
}

export async function getPaper(slug: string) {
  return (await getPublishedPapers()).find((p) => p.slug === slug) ?? null;
}

export async function getProducts(): Promise<Product[]> {
  const docs = await all<import('@/payload-types').Product>('products', { visible: { equals: true } }, '-sortDate');
  return docs.map((p) => ({
    id: String(p.id),
    name: p.name,
    description: p.description,
    team: p.team,
    href: p.link ?? undefined,
    image: image(p.image),
    visible: true,
    order: 0,
  }));
}

export async function getFocusGroups() {
  const docs = await all<import('@/payload-types').FocusGroup>('focus-groups', { visible: { equals: true } }, '-sortDate');
  return docs.map((g) => ({ id: String(g.id), name: g.name, topic: g.topic, status: g.status, members: g.members, slides: g.slides ?? undefined }));
}

/* ---------- Monthly wins and reading lists ---------- */

const monthLabel = (iso: string) => {
  const d = new Date(iso);
  return `${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
};

export const getPublishedWinMonths = cache(async (): Promise<WinsMonth[]> => {
  const docs = await all<import('@/payload-types').WinsMonth>('wins-months', { _status: { equals: 'published' } }, '-month');
  return docs.map((m) => ({
    key: m.key ?? '',
    label: m.title ?? monthLabel(m.month),
    note: m.intro ?? '',
    status: 'published',
    wins: (m.wins ?? []).map((w) => ({
      id: w.id ?? `${m.id}-${w.name}`,
      name: w.name,
      kind: w.kind as WinKind,
      text: w.text,
      highlight: Boolean(w.highlight),
    })),
  }));
});

export async function getReading(): Promise<{ current: ReadingMonth | null; past: ReadingMonth[] }> {
  const docs = await all<import('@/payload-types').ReadingMonth>('reading-months', { _status: { equals: 'published' } }, '-month');
  const months: ReadingMonth[] = docs.map((m) => ({
    key: m.key ?? '',
    label: m.title ?? monthLabel(m.month),
    theme: m.theme,
    status: 'published',
    papers: (m.papers ?? []).map((p) => {
      const d = p.date ? new Date(p.date) : null;
      return {
        id: p.id ?? p.title,
        date: d ? `${DAYS[d.getUTCDay()]} ${d.getUTCDate()} ${SHORT_MONTHS[d.getUTCMonth()]}` : '',
        title: p.title,
        note: p.note ?? undefined,
        slides: p.slides ?? undefined,
      };
    }),
  }));
  return { current: months[0] ?? null, past: months.slice(1) };
}

/* ---------- Life at MLC Africa ---------- */

export async function getShowcase(): Promise<ShowcaseSession[]> {
  const docs = await all<import('@/payload-types').Showcase>('showcase', undefined, '-date');
  return docs.map((s) => ({
    id: String(s.id),
    date: s.date.slice(0, 10),
    notes: s.notes ?? undefined,
    talks: (s.talks ?? []).map((t) => ({ speaker: t.speaker, title: t.title, summary: t.summary, slides: t.slides ?? undefined })),
  }));
}

export async function getGallery(): Promise<GalleryItem[]> {
  const docs = await all<import('@/payload-types').Gallery>('gallery', undefined, '-sortDate');
  return docs.map((g) => {
    const img = image(g.photo);
    return {
      id: String(g.id),
      event: g.event,
      caption: g.caption,
      alt: img?.alt || g.videoDescription || g.caption,
      src: img?.src,
      video: g.video ?? undefined,
      order: 0,
    };
  });
}

/* ---------- People ---------- */

export async function getPeople(group: PersonGroup): Promise<Person[]> {
  const docs = await all<import('@/payload-types').Person>('people', { group: { equals: group } }, 'order');
  return docs.map((p) => ({
    id: String(p.id),
    name: p.name,
    role: p.role,
    group: p.group,
    years: p.years ?? undefined,
    link: p.link ?? undefined,
    linkLabel: p.linkLabel ?? undefined,
    photo: image(p.photo)?.src,
    order: p.order ?? 0,
  }));
}

/* ---------- Placements: internships, grad school, fellowships, the map ---------- */

type PlacementDoc = import('@/payload-types').Placement;
type PlaceDoc = import('@/payload-types').Place;

// Newest year first; within a year, in the order they were added.
const getPlacements = cache(() => all<PlacementDoc>('placements', undefined, ['-year', 'createdAt']));

const TYPE_LABEL: Record<PlacementDoc['type'], string> = {
  internship: 'Internship',
  'grad-school': 'Grad school',
  fellowship: 'Fellowship',
  programme: 'Programme',
};

export async function getInterns(): Promise<InternYear[]> {
  const docs = (await getPlacements()).filter((p) => p.type === 'internship');
  const years = Array.from(new Set(docs.map((p) => String(p.year)))).sort().reverse();
  return years.map((year) => ({
    year,
    people: docs.filter((p) => String(p.year) === year).map((p) => ({ name: p.person, where: [p.title, p.organisation].filter(Boolean).join(', ') })),
  }));
}

/** Fellows and programmes for the latest year that has any, plus that year. */
export async function getFellowships(): Promise<{ year: string; fellows: NameLine[]; programmes: NameLine[] }> {
  const docs = await getPlacements();
  const relevant = docs.filter((p) => p.type === 'fellowship' || p.type === 'programme');
  const year = relevant.map((p) => String(p.year)).sort().reverse()[0] ?? String(new Date().getFullYear());
  const line = (p: PlacementDoc): NameLine => ({ name: p.person, lines: [p.title, p.organisation].filter((x): x is string => Boolean(x)).filter((x, i, a) => a.indexOf(x) === i) });
  return {
    year,
    fellows: relevant.filter((p) => p.type === 'fellowship' && String(p.year) === year).map(line),
    programmes: relevant.filter((p) => p.type === 'programme' && String(p.year) === year).map(line),
  };
}

export async function getGrads(): Promise<GradStudent[]> {
  return (await getPlacements())
    .filter((p) => p.type === 'grad-school')
    .map((p) => ({ name: p.person, school: p.organisation, degree: p.title ?? '', course: '', year: String(p.year) }));
}

export async function getMapPlaces(): Promise<Place[]> {
  // Placements name a city and country; pins are matched to them by those names.
  const [docs, places] = await Promise.all([getPlacements(), all<PlaceDoc>('places')]);
  const pins = new Map(places.map((pl) => [pl.key || placeKey(pl.city, pl.country), pl]));
  const byPlace = new Map<string, Place>();
  for (const p of docs) {
    if (!p.city || !p.country) continue;
    const place = pins.get(placeKey(p.city, p.country));
    if (!place) continue;
    const id = String(place.id);
    if (!byPlace.has(id)) {
      byPlace.set(id, { id, city: place.city, country: place.country, lat: place.latitude, lon: place.longitude, people: [] });
    }
    byPlace.get(id)!.people.push({
      name: p.person,
      what: [p.title, p.organisation].filter(Boolean).join(', '),
      type: TYPE_LABEL[p.type],
      year: String(p.year),
    });
  }
  return Array.from(byPlace.values());
}

/* ---------- Homepage and programmes settings ---------- */

export async function getThisWeek(): Promise<Session[]> {
  const payload = await getCms();
  const g = await payload.findGlobal({ slug: 'this-week' });
  return (g.sessions ?? []).map((s) => {
    const [h, m] = s.time.split(':').map(Number);
    return { day: Number(s.day), hour: h + (m || 0) / 60, name: s.name, detail: s.detail };
  });
}

export async function getCs197() {
  const payload = await getCms();
  const g = await payload.findGlobal({ slug: 'cs197' });
  return { show: g.show !== false, title: g.title ?? '', sub: g.subtitle ?? '', cta: g.buttonLabel || 'Apply', href: g.applyUrl ?? '' };
}

export type Announcement = {
  id: string;
  kind: 'special-session' | 'event';
  title: string;
  startsAt: string;
  details?: string;
  linkLabel?: string;
  linkUrl?: string;
};

export const getAnnouncements = cache(async (): Promise<Announcement[]> => {
  const docs = await all<import('@/payload-types').Announcement>('announcements', undefined, '-startsAt');
  return docs.map((a) => ({
    id: String(a.id),
    kind: a.kind,
    title: a.title,
    startsAt: a.startsAt,
    details: a.details ?? undefined,
    linkLabel: a.linkLabel ?? undefined,
    linkUrl: a.linkUrl ?? undefined,
  }));
});

/** The homepage banner: the soonest announcement that has started showing and hasn't happened yet. */
export async function getHomepageAnnouncement(now = new Date()): Promise<Announcement | null> {
  const payload = await getCms();
  const res = await payload.find({
    collection: 'announcements',
    where: {
      and: [
        { onHomepage: { equals: true } },
        { showFrom: { less_than_equal: now.toISOString() } },
        // Keep it up until the end of the event's day.
        { startsAt: { greater_than_equal: new Date(now.getTime() - 6 * 3600e3).toISOString() } },
      ],
    },
    sort: 'startsAt',
    limit: 1,
    depth: 0,
  });
  const a = res.docs[0];
  return a
    ? { id: String(a.id), kind: a.kind, title: a.title, startsAt: a.startsAt, details: a.details ?? undefined, linkLabel: a.linkLabel ?? undefined, linkUrl: a.linkUrl ?? undefined }
    : null;
}
