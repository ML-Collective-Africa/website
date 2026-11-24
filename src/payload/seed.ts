import type { Payload, PayloadRequest } from 'payload';
import real from '@/content/realdata';
import { LINKS } from '@/content/links';
import { seed as legacy } from '@/content/seed';
import { CS197_NEXT_COHORT, SPECIAL_SESSIONS, THIS_WEEK } from '@/content/site';

/* Loads the site's existing content into an empty database, once. Runs on start
   up (see payload.config.ts) and sets Site settings → seeded so it never runs
   again, even if editors later empty a list. */

type PlaceRow = [string, string, string, [number, number], { name: string; what: string; type: string; year: string }[]];

const TYPE: Record<string, 'internship' | 'grad-school' | 'fellowship' | 'programme'> = {
  Internship: 'internship',
  'Grad school': 'grad-school',
  Fellowship: 'fellowship',
};

export async function seedIfEmpty(payload: Payload) {
  const settings = await payload.findGlobal({ slug: 'site-settings', overrideAccess: true });
  if (settings?.seeded) return;
  payload.logger.info('Seeding the database with the site’s existing content…');

  // One transaction: if anything fails, nothing is saved and the next start tries again.
  // If two servers start at once, the second hits the unique paper address and backs out.
  const transactionID = (await payload.db.beginTransaction?.()) ?? undefined;
  const req = (transactionID ? { transactionID } : {}) as Partial<PayloadRequest>;
  try {
    await load(payload, req);
    if (transactionID) await payload.db.commitTransaction(transactionID);
    payload.logger.info('Seeding finished.');
  } catch (err) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID);
    payload.logger.warn(`Seeding skipped: ${(err as Error).message}`);
  }
}

async function load(payload: Payload, req: Partial<PayloadRequest>) {
  const data = legacy();
  const base = Date.UTC(2026, 10, 1);
  const day = 86400e3;
  const create = <T extends Parameters<Payload['create']>[0]['collection']>(collection: T, doc: Record<string, unknown>) =>
    payload.create({ collection, data: doc as never, overrideAccess: true, draft: false, req });

  // Research
  for (const [i, p] of data.papers.entries()) {
    await create('papers', {
      title: p.title,
      authors: p.authors,
      venue: p.venue,
      year: Number(p.year) || 2026,
      topic: p.topic,
      visible: true,
      featured: p.featured,
      slug: p.slug,
      sortDate: new Date(base - i * day).toISOString(),
    });
  }
  for (const [i, p] of data.products.entries()) {
    await create('products', { name: p.name, description: p.description, team: p.team, visible: true, sortDate: new Date(base - i * day).toISOString() });
  }
  for (const [i, g] of data.focusGroups.entries()) {
    await create('focus-groups', {
      name: g.name,
      topic: g.topic,
      status: g.status,
      members: g.members,
      slides: g.slides,
      visible: true,
      sortDate: new Date(base - i * day).toISOString(),
    });
  }

  // Monthly wins and reading lists, published
  for (const m of data.wins) {
    await create('wins-months', {
      month: `${m.key}-01T00:00:00.000Z`,
      intro: m.note,
      wins: m.wins.map((w) => ({ name: w.name, kind: w.kind, text: w.text, highlight: Boolean(w.highlight) })),
      _status: 'published',
    });
  }
  for (const m of data.reading) {
    const year = Number(m.key.slice(0, 4));
    await create('reading-months', {
      month: `${m.key}-01T00:00:00.000Z`,
      theme: m.theme,
      papers: m.papers.map((p) => {
        // "Sat 3 Oct" to a date in that month's year
        const match = p.date.match(/(\d+) (\w{3})/);
        const date = match ? new Date(`${match[1]} ${match[2]} ${year} 12:00 UTC`).toISOString() : undefined;
        return { date, title: p.title, note: p.note, slides: p.slides };
      }),
      _status: 'published',
    });
  }

  // Showcase sessions and people (placeholders from the design; replace in admin)
  for (const s of data.showcase) {
    await create('showcase', { date: `${s.date}T12:00:00.000Z`, talks: s.talks.map((t) => ({ ...t })) });
  }
  for (const p of data.people) {
    await create('people', { name: p.name, role: p.role, group: p.group, years: p.years, linkLabel: p.linkLabel, order: p.order });
  }

  // Map places and placements
  const placePeople = new Map<string, string>(); // "name|type|year" -> place key
  for (const [key, city, country, [lon, lat], people] of real.PLACES as PlaceRow[]) {
    await create('places', { city, country, latitude: lat, longitude: lon });
    for (const m of people) placePeople.set(`${m.name}|${TYPE[m.type] ?? 'programme'}|${m.year}`, key);
  }
  // A placement names its city and country; saving it links it to the map place above.
  const cityOf = (key: string) => {
    const row = (real.PLACES as PlaceRow[]).find((p) => p[0] === key)!;
    return { city: row[1], country: row[2] };
  };
  const placeFor = (name: string, type: string, year: string) => {
    const key = placePeople.get(`${name}|${type}|${year}`);
    if (key) placePeople.delete(`${name}|${type}|${year}`);
    return key ? cityOf(key) : {};
  };

  for (const [year, people] of real.INTERNS as [string, [string, string][]][]) {
    const y = year.match(/\d{4}$/)?.[0] ?? '2026';
    for (const [person, where] of people) {
      await create('placements', { person, type: 'internship', organisation: where, year: Number(y), ...placeFor(person, 'internship', y) });
    }
  }
  for (const [person, school, degree, course] of real.GRADS as string[][]) {
    await create('placements', {
      person,
      type: 'grad-school',
      title: course ? `${degree}, ${course}` : degree,
      organisation: school,
      year: 2026,
      ...placeFor(person, 'grad-school', '2026'),
    });
  }
  for (const [person, what, where] of real.FELLOWS as string[][]) {
    await create('placements', {
      person,
      type: 'fellowship',
      title: what,
      organisation: where || what,
      year: 2026,
      ...placeFor(person, 'fellowship', '2026'),
    });
  }
  for (const [person, what, detail] of real.PROGRAMMES as string[][]) {
    await create('placements', { person, type: 'programme', title: detail || undefined, organisation: what, year: 2026 });
  }
  // Anyone on the old map who isn't in the lists above still gets a placement.
  for (const [k, key] of placePeople) {
    const [person, type, year] = k.split('|');
    const row = (real.PLACES as PlaceRow[]).find((p) => p[0] === key)!;
    const m = row[4].find((x) => x.name === person && x.year === year)!;
    await create('placements', { person, type, organisation: m.what, year: Number(year), ...cityOf(key) });
  }

  // Announcements (special sessions), This week, CS197, site settings
  for (const s of SPECIAL_SESSIONS) {
    await create('announcements', {
      kind: 'special-session',
      title: s.title,
      startsAt: `${s.date}T19:00:00.000Z`, // 8pm WAT
      details: s.detail,
      showFrom: new Date(Date.parse(`${s.date}T00:00:00Z`) - 14 * day).toISOString(),
      onHomepage: true,
    });
  }
  await payload.updateGlobal({
    slug: 'this-week',
    overrideAccess: true,
    req,
    data: {
      sessions: THIS_WEEK.map((s) => ({ day: String(s.day), time: `${String(s.hour).padStart(2, '0')}:00`, name: s.name, detail: s.detail })),
    } as never,
  });
  await payload.updateGlobal({
    slug: 'cs197',
    overrideAccess: true,
    req,
    data: { show: true, title: CS197_NEXT_COHORT.title, subtitle: CS197_NEXT_COHORT.sub, buttonLabel: CS197_NEXT_COHORT.cta, applyUrl: CS197_NEXT_COHORT.href || undefined } as never,
  });
  await payload.updateGlobal({
    slug: 'site-settings',
    overrideAccess: true,
    req,
    data: {
      email: LINKS.email,
      discord: LINKS.discord,
      mailingList: LINKS.mailingList,
      calendar: LINKS.calendar,
      sundaySlotForm: LINKS.sundaySlotForm,
      focusGroupUpdateForm: LINKS.focusGroupUpdateForm,
      opportunitiesDoc: LINKS.opportunitiesDoc,
      menteeForm: LINKS.menteeApply || undefined,
      mentorForm: LINKS.mentorApply || undefined,
      seeded: true,
    } as never,
  });
}

/* Creates the first super admin from ADMIN_EMAIL, ADMIN_PASSWORD and ADMIN_NAME
   when there are no admins yet. Without this, whoever opened /admin first on a new
   site could make themselves the super admin. They're asked to set their own
   password on first sign-in. */
export async function ensureFirstAdmin(payload: Payload) {
  const { totalDocs } = await payload.count({ collection: 'users', overrideAccess: true });
  if (totalDocs > 0) return;
  const email = process.env.ADMIN_EMAIL?.trim();
  const password = process.env.ADMIN_PASSWORD;
  if (!email || !password) {
    payload.logger.warn('No admins yet. Set ADMIN_EMAIL and ADMIN_PASSWORD so the build creates the first super admin.');
    return;
  }
  const user = await payload.create({
    collection: 'users',
    data: { email, password, name: process.env.ADMIN_NAME?.trim() || 'Site admin', role: 'super-admin' },
    overrideAccess: true,
  });
  await payload.update({ collection: 'users', id: user.id, data: { mustChangePassword: true }, overrideAccess: true });
  payload.logger.info(`Created the first super admin: ${email}`);
}
