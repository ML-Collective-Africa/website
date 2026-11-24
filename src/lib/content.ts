import { readCollection } from './store';
import type { PersonGroup, WinKind } from './types';

/* Read helpers for public pages. Only visible and published content comes out of
   here. Declined and waiting submissions never do. */

export async function getPublishedPapers() {
  const papers = await readCollection('papers');
  return papers.filter((p) => p.visible).sort((a, b) => b.order - a.order);
}

export async function getFeaturedPapers(limit = 4) {
  const papers = await getPublishedPapers();
  return papers.filter((p) => p.featured).slice(0, limit);
}

export async function getPaper(slug: string) {
  const papers = await getPublishedPapers();
  return papers.find((p) => p.slug === slug) ?? null;
}

export async function getProducts() {
  const products = await readCollection('products');
  return products.filter((p) => p.visible).sort((a, b) => b.order - a.order);
}

export async function getFocusGroups() {
  return readCollection('focusGroups');
}

export async function getPublishedWinMonths() {
  const months = await readCollection('wins');
  return months.filter((m) => m.status === 'published').sort((a, b) => b.key.localeCompare(a.key));
}

export async function getReading() {
  const months = (await readCollection('reading'))
    .filter((m) => m.status === 'published')
    .sort((a, b) => b.key.localeCompare(a.key));
  return { current: months[0] ?? null, past: months.slice(1) };
}

export async function getGallery() {
  const items = await readCollection('gallery');
  return items.filter((i) => i.alt.trim()).sort((a, b) => b.order - a.order);
}

export async function getPeople(group: PersonGroup) {
  const people = await readCollection('people');
  return people.filter((p) => p.group === group).sort((a, b) => a.order - b.order);
}

export async function getShowcase() {
  const sessions = await readCollection('showcase');
  return [...sessions].sort((a, b) => b.date.localeCompare(a.date));
}

export const WIN_GROUPS: { title: string; kinds: WinKind[] }[] = [
  { title: 'Publications and research', kinds: ['Research', 'Paper', 'Award', 'Talk', 'Travel grant'] },
  { title: 'Internships', kinds: ['Internship'] },
  { title: 'Graduate admissions and fellowships', kinds: ['Grad school', 'Fellowship'] },
  { title: 'Career and industry roles', kinds: ['Career'] },
  { title: 'Community building and leadership', kinds: ['Open source', 'Mentorship', 'Community'] },
];

export const WIN_KINDS: WinKind[] = WIN_GROUPS.flatMap((g) => g.kinds);
