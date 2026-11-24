'use server';

import { LINKS } from '@/content/links';
import { isReadOnlyStoreError, mutate, saveUpload } from '@/lib/store';
import type { Submission } from '@/lib/types';
import { isHttpUrl, newId } from '@/lib/utils';

export type SubmitState = {
  ok: boolean;
  errors: { field: 'title' | 'email' | 'figure' | 'links' | 'figureAlt' | 'form'; message: string }[];
  values?: Record<string, string>;
};

const CANT_SAVE = `We can’t take submissions through the site right now. Please email the details to ${LINKS.email} instead.`;

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);

export async function submitResearch(_prev: SubmitState, fd: FormData): Promise<SubmitState> {
  // Honeypot field. People never see it, bots tend to fill it in.
  if (str(fd, 'website')) return { ok: true, errors: [] };

  const type = str(fd, 'type') === 'Product' ? 'Product' : 'Paper';
  const title = str(fd, 'title', 300);
  const email = str(fd, 'email', 200);
  const links = {
    paper: str(fd, 'link_paper', 500),
    code: str(fd, 'link_code', 500),
    slides: str(fd, 'link_slides', 500),
    recording: str(fd, 'link_recording', 500),
  };
  const figureAlt = str(fd, 'figure_alt', 300);
  const file = fd.get('figure');
  const hasFile = file instanceof File && file.size > 0;

  const errors: SubmitState['errors'] = [];
  if (!title) errors.push({ field: 'title', message: 'Add a title' });
  if (!email) errors.push({ field: 'email', message: 'Add your email so we can reach you' });
  else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push({ field: 'email', message: 'Check your email address' });
  const badLink = Object.values(links).some((l) => l && !isHttpUrl(l));
  if (badLink) errors.push({ field: 'links', message: 'Links need to start with https://' });
  if (hasFile && !figureAlt) errors.push({ field: 'figureAlt', message: 'Describe the figure in one line' });

  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') values[k] = v;

  if (errors.length) return { ok: false, errors, values };

  let figure: Submission['figure'];
  if (hasFile) {
    try {
      const src = await saveUpload(file, 5 * 1024 * 1024);
      figure = { src, alt: figureAlt, filename: file.name };
    } catch (e) {
      if (isReadOnlyStoreError(e)) return { ok: false, errors: [{ field: 'form', message: CANT_SAVE }], values };
      return { ok: false, errors: [{ field: 'figure', message: (e as Error).message }], values };
    }
  }

  const sub: Submission = {
    id: newId(),
    type,
    title,
    authors: str(fd, 'authors', 1000),
    venue: str(fd, 'venue', 300),
    date: str(fd, 'date', 7),
    topic: str(fd, 'topic', 100),
    topicOther: str(fd, 'topic_other', 100) || undefined,
    summary: str(fd, 'summary', 3000),
    links: Object.fromEntries(Object.entries(links).filter(([, v]) => v)),
    figure,
    email,
    coAuthorsAgreed: fd.get('agreed') === 'on',
    createdAt: new Date().toISOString(),
    status: 'waiting',
  };
  try {
    await mutate('submissions', (list) => ({ next: [sub, ...list] }));
  } catch (e) {
    if (isReadOnlyStoreError(e)) return { ok: false, errors: [{ field: 'form', message: CANT_SAVE }], values };
    throw e;
  }
  return { ok: true, errors: [] };
}
