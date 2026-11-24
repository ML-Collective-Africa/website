/* Kinds of monthly win, and how the Monthly wins page groups them. */

export const WIN_GROUPS = [
  { title: 'Publications and research', kinds: ['Research', 'Paper', 'Award', 'Talk', 'Travel grant'] },
  { title: 'Internships', kinds: ['Internship'] },
  { title: 'Graduate admissions and fellowships', kinds: ['Grad school', 'Fellowship'] },
  { title: 'Career and industry roles', kinds: ['Career'] },
  { title: 'Community building and leadership', kinds: ['Open source', 'Mentorship', 'Community'] },
] as const;

export type WinKind = (typeof WIN_GROUPS)[number]['kinds'][number];

export const WIN_KINDS: WinKind[] = WIN_GROUPS.flatMap((g) => [...g.kinds]);
