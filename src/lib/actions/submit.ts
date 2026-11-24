'use server';

import { getCms, getLinks } from '@/lib/cms';
import { isHttpUrl } from '@/lib/utils';

export type SubmitState = {
  ok: boolean;
  errors: { field: 'title' | 'email' | 'figure' | 'links' | 'figureAlt' | 'form'; message: string }[];
  values?: Record<string, string>;
};

const IMAGE_TYPES = ['image/png', 'image/jpeg'];
const MAX_FIGURE_BYTES = 5 * 1024 * 1024;

const str = (fd: FormData, k: string, max = 2000) => String(fd.get(k) ?? '').trim().slice(0, max);

/* The public "Submit your research" form. Submissions land in admin under
   Research → Submissions, and nothing goes live until an editor approves it. */
export async function submitResearch(_prev: SubmitState, fd: FormData): Promise<SubmitState> {
  // Honeypot field. People never see it, bots tend to fill it in.
  if (str(fd, 'website')) return { ok: true, errors: [] };

  const type = str(fd, 'type') === 'Product' ? 'product' : 'paper';
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
  if (Object.values(links).some((l) => l && !isHttpUrl(l))) errors.push({ field: 'links', message: 'Links need to start with https://' });
  if (hasFile && !figureAlt) errors.push({ field: 'figureAlt', message: 'Describe the figure in one line' });
  if (hasFile && !IMAGE_TYPES.includes(file.type)) errors.push({ field: 'figure', message: 'The figure needs to be a PNG or JPG' });
  if (hasFile && file.size > MAX_FIGURE_BYTES) errors.push({ field: 'figure', message: 'The figure needs to be 5 MB or smaller' });

  const values: Record<string, string> = {};
  for (const [k, v] of fd.entries()) if (typeof v === 'string') values[k] = v;
  if (errors.length) return { ok: false, errors, values };

  const topic = str(fd, 'topic', 100);
  const topicOther = str(fd, 'topic_other', 100);

  try {
    const payload = await getCms();
    let figure: number | undefined;
    if (hasFile) {
      const media = await payload.create({
        collection: 'media',
        data: { alt: figureAlt },
        file: { data: Buffer.from(await file.arrayBuffer()), mimetype: file.type, name: file.name, size: file.size },
        overrideAccess: true,
      });
      figure = media.id;
    }
    await payload.create({
      collection: 'submissions',
      data: {
        status: 'new',
        type,
        title,
        authors: str(fd, 'authors', 1000),
        venue: str(fd, 'venue', 300),
        month: str(fd, 'date', 7),
        topic: topic === 'Other' ? topicOther || 'Other' : topic,
        summary: str(fd, 'summary', 3000),
        links,
        figure,
        email,
        coAuthorsAgreed: fd.get('agreed') === 'on',
      },
      overrideAccess: true,
    });
  } catch (e) {
    console.error('Submission failed', e);
    const { email: contact } = await getLinks().catch(() => ({ email: 'info@mlcollective.org' }));
    return {
      ok: false,
      errors: [{ field: 'form', message: `We couldn’t save that just now. Please try again, or email the details to ${contact}.` }],
      values,
    };
  }
  return { ok: true, errors: [] };
}
