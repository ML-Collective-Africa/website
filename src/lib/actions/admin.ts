'use server';

import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { requireAdmin, requireSuper, type CurrentAdmin } from '@/lib/auth';
import { checkPassword, hashPassword, tempPassword } from '@/lib/auth/password';
import { SESSION_COOKIE, signSession } from '@/lib/auth/session';
import { WIN_KINDS } from '@/lib/content';
import { logActivity, mutate, readCollection, saveUpload } from '@/lib/store';
import type {
  ActivityArea,
  Admin,
  AdminRole,
  CollectionName,
  Collections,
  GalleryItem,
  Paper,
  Person,
  PersonGroup,
  ReadingMonth,
  WinKind,
  WinsMonth,
} from '@/lib/types';
import { isHttpUrl, monthLabel, newId, uniqueSlug, yearFrom } from '@/lib/utils';

export type FormState = { error?: string; message?: string; secret?: string; email?: string };

const s = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);

/** Change a collection and record it in the activity log with what it looked like before. */
async function track<K extends CollectionName, R = void>(
  admin: CurrentAdmin,
  area: ActivityArea,
  what: string,
  name: K,
  fn: (current: Collections[K]) => { next: Collections[K]; result?: R },
) {
  const { before, result } = await mutate(name, fn);
  await logActivity({ who: admin.name, what, area, collection: name, before });
  revalidatePath('/', 'layout');
  return result;
}

/* ---------- Sign in and out ---------- */

const attempts = new Map<string, { n: number; until: number }>();

export async function signIn(_prev: FormState, fd: FormData): Promise<FormState> {
  const email = s(fd, 'email', 200).toLowerCase();
  const password = String(fd.get('password') ?? '');
  if (!email || !password) return { error: 'Enter your email and password.', email };

  const a = attempts.get(email);
  if (a && a.n >= 5 && a.until > Date.now()) {
    return { error: 'Too many tries. Wait 15 minutes, or ask a super admin to reset your password.', email };
  }

  let admins = await readCollection('admins');

  // First sign-in on a new install: create the super admin from the environment.
  if (admins.length === 0) {
    const envEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase();
    const envPassword = process.env.ADMIN_PASSWORD;
    if (!envEmail || !envPassword) {
      return { error: 'No admins exist yet. Set ADMIN_EMAIL and ADMIN_PASSWORD on the server, then sign in with them.', email };
    }
    if (email === envEmail && password === envPassword) {
      const first: Admin = {
        id: newId(),
        name: process.env.ADMIN_NAME?.trim() || 'Site admin',
        email: envEmail,
        role: 'Super admin',
        passwordHash: await hashPassword(envPassword),
        addedAt: new Date().toISOString(),
      };
      await mutate('admins', (list) => ({ next: list.length ? list : [first] }));
      admins = await readCollection('admins');
    }
  }

  const admin = admins.find((x) => x.email.toLowerCase() === email);
  const ok = admin ? await checkPassword(password, admin.passwordHash) : false;
  if (!admin || !ok) {
    const cur = attempts.get(email);
    attempts.set(email, { n: (cur && cur.until > Date.now() ? cur.n : 0) + 1, until: Date.now() + 15 * 60000 });
    return { error: 'That email and password don’t match. Check them and try again.', email };
  }
  attempts.delete(email);

  const session = await signSession(admin.id);
  (await cookies()).set(SESSION_COOKIE, session.value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: session.expires,
  });
  redirect('/admin');
}

export async function signOut() {
  (await cookies()).delete(SESSION_COOKIE);
  redirect('/admin/login');
}

/* ---------- Inbox ---------- */

export async function approveSubmission(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const featured = fd.get('featured') === 'on';
  const sub = (await readCollection('submissions')).find((x) => x.id === id);
  if (!sub || sub.status !== 'waiting') redirect('/admin/inbox');

  let publishedId: string | undefined;
  if (sub.type === 'Paper') {
    publishedId = await track(admin, 'Inbox', `published a paper: ${sub.title}`, 'papers', (papers) => {
      const slug = uniqueSlug(sub.title, new Set(papers.map((p) => p.slug)));
      const topic = sub.topic === 'Other' ? sub.topicOther || 'Other' : sub.topic || 'Other';
      const paper: Paper = {
        id: newId(),
        slug,
        title: sub.title,
        authors: sub.authors,
        venue: sub.venue,
        year: sub.date.slice(0, 4) || yearFrom(sub.venue),
        date: sub.date ? monthLabel(sub.date) : undefined,
        topic,
        summary: sub.summary || undefined,
        links: sub.links,
        figure: sub.figure ? { src: sub.figure.src, alt: sub.figure.alt } : undefined,
        visible: true,
        featured,
        order: Math.max(0, ...papers.map((p) => p.order)) + 1,
        updatedAt: new Date().toISOString(),
        updatedBy: admin.name,
      };
      return { next: [paper, ...papers], result: paper.id };
    });
  } else if (sub.type === 'Product') {
    publishedId = await track(admin, 'Inbox', `published a product: ${sub.title}`, 'products', (products) => {
      const id2 = newId();
      return {
        next: [
          {
            id: id2,
            name: sub.title,
            description: sub.summary,
            team: sub.authors,
            href: sub.links.paper || sub.links.code || sub.links.slides || sub.links.recording,
            image: sub.figure ? { src: sub.figure.src, alt: sub.figure.alt } : undefined,
            visible: true,
            order: Math.max(0, ...products.map((p) => p.order)) + 1,
          },
          ...products,
        ],
        result: id2,
      };
    });
  }

  await mutate('submissions', (list) => ({
    next: list.map((x) =>
      x.id === id ? { ...x, status: 'approved', decidedBy: admin.name, decidedAt: new Date().toISOString(), publishedId } : x,
    ),
  }));
  redirect(`/admin/inbox/${id}?done=approved`);
}

export async function declineSubmission(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const reason = s(fd, 'reason', 2000);
  const sub = (await readCollection('submissions')).find((x) => x.id === id);
  if (!sub || sub.status !== 'waiting') redirect('/admin/inbox');
  await track(admin, 'Inbox', `declined a ${sub.type.toLowerCase()} submission`, 'submissions', (list) => ({
    next: list.map((x) =>
      x.id === id
        ? { ...x, status: 'declined', declineReason: reason, decidedBy: admin.name, decidedAt: new Date().toISOString() }
        : x,
    ),
  }));
  redirect(`/admin/inbox/${id}?done=declined`);
}

/* ---------- Papers ---------- */

export async function savePaper(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const title = s(fd, 'title', 300);
  if (!title) return { error: 'Add a title.' };
  const links = {
    paper: s(fd, 'link_paper', 500),
    code: s(fd, 'link_code', 500),
    slides: s(fd, 'link_slides', 500),
    recording: s(fd, 'link_recording', 500),
  };
  if (Object.values(links).some((l) => l && !isHttpUrl(l))) return { error: 'Links need to start with https://' };

  const file = fd.get('figure');
  const figureAlt = s(fd, 'figure_alt', 300);
  let figureSrc = s(fd, 'figure_src', 300);
  if (file instanceof File && file.size > 0) {
    try {
      figureSrc = await saveUpload(file);
    } catch (e) {
      return { error: (e as Error).message };
    }
  }
  if (fd.get('figure_remove') === 'on') figureSrc = '';
  if (figureSrc && !figureAlt) return { error: 'Describe the figure for people using screen readers.' };

  const fields = {
    title,
    authors: s(fd, 'authors', 1000),
    venue: s(fd, 'venue', 300),
    year: s(fd, 'year', 4),
    topic: s(fd, 'topic', 100) || 'Other',
    summary: s(fd, 'summary', 3000) || undefined,
    abstract: s(fd, 'abstract', 6000) || undefined,
    links: Object.fromEntries(Object.entries(links).filter(([, v]) => v)),
    figure: figureSrc ? { src: figureSrc, alt: figureAlt } : undefined,
    visible: s(fd, 'visibility') !== 'hidden',
    featured: fd.get('featured') === 'on',
    updatedAt: new Date().toISOString(),
    updatedBy: admin.name,
  };

  await track(admin, 'Published papers', `${id ? 'edited' : 'added'} a paper: ${title}`, 'papers', (papers) => {
    if (id) return { next: papers.map((p) => (p.id === id ? { ...p, ...fields } : p)) };
    const paper: Paper = {
      id: newId(),
      slug: uniqueSlug(title, new Set(papers.map((p) => p.slug))),
      order: Math.max(0, ...papers.map((p) => p.order)) + 1,
      ...fields,
    };
    return { next: [paper, ...papers] };
  });
  redirect('/admin/papers?saved=1');
}

export async function deletePaper(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const paper = (await readCollection('papers')).find((p) => p.id === id);
  if (paper) {
    await track(admin, 'Published papers', `deleted a paper: ${paper.title}`, 'papers', (papers) => ({
      next: papers.filter((p) => p.id !== id),
    }));
  }
  redirect('/admin/papers?deleted=1');
}

/* ---------- Reading groups ---------- */

export async function saveReading(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const key = s(fd, 'month', 7);
  if (!/^\d{4}-\d{2}$/.test(key)) return { error: 'Choose a month.' };
  const theme = s(fd, 'theme', 200);
  if (!theme) return { error: 'Add a theme for the month.' };
  const status = s(fd, 'intent') === 'draft' ? 'draft' : 'published';
  let rows: ReadingMonth['papers'];
  try {
    rows = (JSON.parse(String(fd.get('papers') ?? '[]')) as ReadingMonth['papers'])
      .map((r) => ({
        id: String(r.id || newId()).slice(0, 40),
        date: String(r.date ?? '').trim().slice(0, 40),
        title: String(r.title ?? '').trim().slice(0, 300),
        note: String(r.note ?? '').trim().slice(0, 500) || undefined,
        ledBy: String(r.ledBy ?? '').trim().slice(0, 120) || undefined,
        slides: String(r.slides ?? '').trim().slice(0, 500) || undefined,
      }))
      .filter((r) => r.title);
  } catch {
    return { error: 'Something went wrong reading the list. Reload the page and try again.' };
  }
  if (rows.some((r) => r.slides && !isHttpUrl(r.slides))) return { error: 'Slide links need to start with https://' };

  await track(
    admin,
    'Reading groups',
    `${status === 'published' ? 'published' : 'saved a draft of'} the ${monthLabel(key)} reading list`,
    'reading',
    (months) => {
      const month: ReadingMonth = { key, label: monthLabel(key), theme, status, papers: rows };
      const exists = months.some((m) => m.key === key);
      return { next: exists ? months.map((m) => (m.key === key ? month : m)) : [month, ...months] };
    },
  );
  return { message: status === 'published' ? 'Published. The Reading Groups page is up to date.' : 'Draft saved. It isn’t on the site yet.' };
}

/* ---------- Monthly wins ---------- */

export async function saveWins(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const key = s(fd, 'month', 7);
  if (!/^\d{4}-\d{2}$/.test(key)) return { error: 'Choose a month.' };
  const status = s(fd, 'intent') === 'publish' ? 'published' : s(fd, 'intent') === 'unpublish' ? 'draft' : undefined;
  let wins: WinsMonth['wins'];
  try {
    wins = (JSON.parse(String(fd.get('wins') ?? '[]')) as WinsMonth['wins'])
      .map((w) => ({
        id: String(w.id || newId()).slice(0, 40),
        name: String(w.name ?? '').trim().slice(0, 120),
        kind: (WIN_KINDS.includes(w.kind as WinKind) ? w.kind : 'Community') as WinKind,
        text: String(w.text ?? '').trim().slice(0, 1000),
        highlight: Boolean(w.highlight),
      }))
      .filter((w) => w.text);
  } catch {
    return { error: 'Something went wrong reading the wins. Reload the page and try again.' };
  }

  await track(
    admin,
    'Monthly wins',
    status === 'published' ? `published ${monthLabel(key)}’s wins` : `updated ${monthLabel(key)}’s wins`,
    'wins',
    (months) => {
      const cur = months.find((m) => m.key === key);
      const month: WinsMonth = {
        key,
        label: monthLabel(key),
        note: s(fd, 'note', 600),
        status: status ?? cur?.status ?? 'draft',
        wins,
      };
      return { next: cur ? months.map((m) => (m.key === key ? month : m)) : [month, ...months] };
    },
  );
  if (status === 'published') return { message: `${monthLabel(key)} is live on the Monthly wins page.` };
  if (status === 'draft') return { message: `${monthLabel(key)} is back to a draft and hidden from the site.` };
  return { message: 'Saved.' };
}

/* ---------- Gallery ---------- */

export async function uploadGallery(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const event = s(fd, 'event', 120) || 'Community';
  const video = s(fd, 'video', 300);
  const files = fd.getAll('photos').filter((f): f is File => f instanceof File && f.size > 0);
  if (!files.length && !video) return { error: 'Choose at least one photo, or paste a YouTube link.' };
  if (video && !/^https:\/\/(www\.)?(youtube\.com|youtu\.be)\//.test(video)) return { error: 'Video links need to be YouTube links.' };

  const items: Omit<GalleryItem, 'order'>[] = [];
  const missing: string[] = [];
  files.forEach((f, i) => {
    if (!s(fd, `alt_${i}`)) missing.push(f.name);
  });
  if (video && !s(fd, 'video_alt')) missing.push('the video');
  if (missing.length) {
    return { error: `Add a description for ${missing.length === 1 ? missing[0] : `${missing.length} items`} before publishing.` };
  }

  for (const [i, f] of files.entries()) {
    try {
      const src = await saveUpload(f);
      items.push({ id: newId(), event, src, alt: s(fd, `alt_${i}`, 300), caption: s(fd, `caption_${i}`, 300) });
    } catch (e) {
      return { error: `${f.name}: ${(e as Error).message}` };
    }
  }
  if (video) items.push({ id: newId(), event, video, alt: s(fd, 'video_alt', 300), caption: s(fd, 'video_caption', 300) });

  await track(
    admin,
    'Gallery',
    `uploaded ${items.length === 1 ? '1 item' : `${items.length} items`} to ${event}`,
    'gallery',
    (gallery) => {
      let top = Math.max(0, ...gallery.map((g) => g.order));
      return { next: [...items.map((it) => ({ ...it, order: ++top })), ...gallery] };
    },
  );
  return { message: `Published ${items.length === 1 ? '1 item' : `${items.length} items`} to the gallery.` };
}

export async function deleteGalleryItem(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  await track(admin, 'Gallery', 'removed a gallery item', 'gallery', (g) => ({ next: g.filter((x) => x.id !== id) }));
  redirect('/admin/gallery');
}

/* ---------- People ---------- */

const GROUPS: PersonGroup[] = ['organiser', 'advisor', 'torchbearer'];

export async function savePerson(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const name = s(fd, 'name', 120);
  if (!name) return { error: 'Add their name.' };
  const group = (GROUPS.includes(s(fd, 'group') as PersonGroup) ? s(fd, 'group') : 'organiser') as PersonGroup;
  const link = s(fd, 'link', 500);
  if (link && !isHttpUrl(link)) return { error: 'The link needs to start with https://' };

  let photo = s(fd, 'photo_src', 300) || undefined;
  const file = fd.get('photo');
  if (file instanceof File && file.size > 0) {
    try {
      photo = await saveUpload(file, 5 * 1024 * 1024);
    } catch (e) {
      return { error: (e as Error).message };
    }
  }

  const fields: Omit<Person, 'id' | 'order'> = {
    name,
    role: s(fd, 'role', 200),
    group,
    since: s(fd, 'since', 4) || undefined,
    years: s(fd, 'years', 40) || undefined,
    link: link || undefined,
    linkLabel: s(fd, 'link_label', 40) || 'LinkedIn',
    photo,
  };
  await track(admin, 'People', `${id ? 'edited' : 'added'} ${name}`, 'people', (people) => {
    if (id) return { next: people.map((p) => (p.id === id ? { ...p, ...fields } : p)) };
    return { next: [...people, { id: newId(), order: Math.max(0, ...people.map((p) => p.order)) + 1, ...fields }] };
  });
  redirect(`/admin/people?group=${group}`);
}

export async function moveToTorchbearers(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const person = (await readCollection('people')).find((p) => p.id === id);
  if (!person) redirect('/admin/people');
  const thisYear = String(new Date().getFullYear());
  const years = person.since ? (person.since === thisYear ? thisYear : `${person.since} to ${thisYear}`) : undefined;
  await track(admin, 'People', `moved ${person.name} to Torchbearers`, 'people', (people) => ({
    next: people.map((p) => (p.id === id ? { ...p, group: 'torchbearer', years: p.years ?? years } : p)),
  }));
  redirect('/admin/people?group=torchbearer');
}

export async function deletePerson(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const person = (await readCollection('people')).find((p) => p.id === id);
  if (person) {
    await track(admin, 'People', `removed ${person.name} from the site`, 'people', (people) => ({
      next: people.filter((p) => p.id !== id),
    }));
  }
  redirect(`/admin/people?group=${person?.group ?? 'organiser'}`);
}

/* ---------- Activity ---------- */

export async function undoActivity(fd: FormData) {
  const admin = await requireAdmin();
  const id = s(fd, 'id');
  const back = s(fd, 'back') || '/admin/activity';
  const log = await readCollection('activity');
  const entry = log.find((e) => e.id === id);
  if (!entry || entry.undone || !entry.collection || entry.before === undefined) redirect(back);
  // Only the latest change to a collection can be undone, so later edits are never lost.
  const latest = log.find((e) => e.collection === entry.collection && !e.undone && e.before !== undefined);
  if (latest?.id !== entry.id) redirect(back);
  if (entry.collection === 'admins' && admin.role !== 'Super admin') redirect(back);

  const collection = entry.collection;
  const before = entry.before as Collections[typeof collection];
  await mutate(collection, () => ({ next: before }));
  await mutate('activity', (list) => ({ next: list.map((e) => (e.id === id ? { ...e, undone: true } : e)) }));
  await logActivity({ who: admin.name, what: `undid a change: ${entry.who} ${entry.what}`, area: entry.area });
  revalidatePath('/', 'layout');
  redirect(back);
}

/* ---------- Admins (super admins only) ---------- */

export async function addAdmin(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireSuper();
  const name = s(fd, 'name', 120);
  const email = s(fd, 'email', 200).toLowerCase();
  const role: AdminRole = s(fd, 'role') === 'Super admin' ? 'Super admin' : 'Admin';
  if (!name) return { error: 'Add their full name.' };
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return { error: 'Add a valid email address.' };
  const admins = await readCollection('admins');
  if (admins.some((a) => a.email.toLowerCase() === email)) return { error: 'Someone with that email is already an admin.' };

  const password = tempPassword();
  const passwordHash = await hashPassword(password);
  await track(admin, 'Admins', `added ${name} as ${role}`, 'admins', (list) => ({
    next: [...list, { id: newId(), name, email, role, passwordHash, addedAt: new Date().toISOString() }],
  }));
  return { message: `${name} has been added as ${role}.`, secret: password };
}

export async function updateAdmin(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireSuper();
  const id = s(fd, 'id');
  const role: AdminRole = s(fd, 'role') === 'Super admin' ? 'Super admin' : 'Admin';
  const reset = fd.get('reset') === 'on';
  const admins = await readCollection('admins');
  const target = admins.find((a) => a.id === id);
  if (!target) return { error: 'That admin no longer exists.' };
  if (target.role === 'Super admin' && role === 'Admin' && admins.filter((a) => a.role === 'Super admin').length <= 1) {
    return { error: 'There must always be at least one super admin.' };
  }
  const password = reset ? tempPassword() : undefined;
  const passwordHash = password ? await hashPassword(password) : undefined;
  await track(
    admin,
    'Admins',
    [target.role !== role ? `changed ${target.name}’s role to ${role}` : '', reset ? `reset ${target.name}’s password` : '']
      .filter(Boolean)
      .join(' and ') || `saved ${target.name}`,
    'admins',
    (list) => ({ next: list.map((a) => (a.id === id ? { ...a, role, ...(passwordHash ? { passwordHash } : {}) } : a)) }),
  );
  return { message: `Saved. ${target.name} is ${role === 'Admin' ? 'an' : 'a'} ${role}.`, secret: password };
}

export async function removeAdmin(fd: FormData) {
  const admin = await requireSuper();
  const id = s(fd, 'id');
  const admins = await readCollection('admins');
  const target = admins.find((a) => a.id === id);
  if (!target || target.id === admin.id) redirect('/admin/admins');
  if (target.role === 'Super admin' && admins.filter((a) => a.role === 'Super admin').length <= 1) redirect('/admin/admins');
  await track(admin, 'Admins', `removed ${target.name} from admin`, 'admins', (list) => ({ next: list.filter((a) => a.id !== id) }));
  const log = await readCollection('activity');
  redirect(`/admin/admins?removed=${log[0]?.id ?? ''}`);
}
