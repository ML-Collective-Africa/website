export type SectionKey = 'about' | 'research' | 'programmes' | 'initiatives' | 'life';

export type NavItem = { label: string; href: string };
export type NavSection = {
  key: SectionKey;
  label: string;
  href: string;
  /** Path prefix that marks this section as current in the main nav. */
  match: string;
  items: NavItem[];
};

export const NAV: NavSection[] = [
  {
    key: 'about',
    label: 'About',
    href: '/about',
    match: '/about',
    items: [
      { label: 'Who we are', href: '/about' },
      { label: 'Organisers', href: '/about/organisers' },
      { label: 'Torchbearers', href: '/about/torchbearers' },
    ],
  },
  {
    key: 'research',
    label: 'Research',
    href: '/research',
    match: '/research',
    items: [
      { label: 'Ongoing research', href: '/research/ongoing' },
      { label: 'Published research', href: '/research' },
      { label: 'Product-driven research', href: '/research/products' },
      { label: 'Submit your research', href: '/research/submit' },
    ],
  },
  {
    key: 'programmes',
    label: 'Programmes',
    href: '/programmes',
    match: '/programmes',
    items: [
      { label: 'CS197 Study Group', href: '/programmes/cs197' },
      { label: 'Reading Groups', href: '/programmes/reading-groups' },
      { label: 'ML Systems Study Group', href: '/programmes/ml-systems' },
      { label: 'Focus Groups', href: '/programmes/focus-groups' },
      { label: 'Sunday Specials', href: '/programmes/sunday-specials' },
      { label: 'Mentorship', href: '/programmes/mentorship' },
      { label: 'Internships', href: '/programmes/internships' },
      { label: 'Fellowships', href: '/programmes/fellowships' },
    ],
  },
  {
    key: 'initiatives',
    label: 'Initiatives',
    href: '/initiatives/indaba',
    match: '/initiatives',
    items: [
      { label: 'Indaba presence', href: '/initiatives/indaba' },
      { label: '2026 Workshop', href: '/initiatives/workshop-2026' },
      { label: 'Fundraisers', href: '/initiatives/fundraisers' },
      { label: 'Grad school support', href: '/initiatives/grad-school' },
      { label: 'Sponsors', href: '/initiatives/sponsors' },
    ],
  },
  {
    key: 'life',
    label: 'Life at MLC Africa',
    href: '/life/showcase',
    match: '/life',
    items: [
      { label: 'Research showcase', href: '/life/showcase' },
      { label: 'Monthly wins', href: '/life/monthly-wins' },
      { label: 'Gallery', href: '/life/gallery' },
    ],
  },
];

export function sectionByKey(key: SectionKey): NavSection {
  const s = NAV.find((n) => n.key === key);
  if (!s) throw new Error(`Unknown section ${key}`);
  return s;
}

/** Subnav items. Research lists Published first in its subnav, as in the designs. */
export const SUBNAV: Record<SectionKey, NavItem[]> = {
  about: sectionByKey('about').items,
  research: sectionByKey('research').items,
  programmes: [{ label: 'Overview', href: '/programmes' }, ...sectionByKey('programmes').items],
  initiatives: sectionByKey('initiatives').items,
  life: sectionByKey('life').items,
};
