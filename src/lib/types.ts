export type Links = {
  paper?: string;
  code?: string;
  slides?: string;
  recording?: string;
};

export type Paper = {
  id: string;
  slug: string;
  title: string;
  authors: string;
  venue: string;
  year: string;
  /** Month and year it appeared, for example "July 2025". Optional. */
  date?: string;
  topic: string;
  /** Plain language summary, shown as "In short". */
  summary?: string;
  abstract?: string;
  links: Links;
  figure?: { src: string; alt: string };
  visible: boolean;
  featured: boolean;
  /** Sort key, newest first. Seed order is preserved through this. */
  order: number;
  updatedAt?: string;
  updatedBy?: string;
};

export type Product = {
  id: string;
  name: string;
  description: string;
  team: string;
  href?: string;
  image?: { src: string; alt: string };
  visible: boolean;
  order: number;
};

export type FocusGroup = {
  id: string;
  name: string;
  topic: string;
  status: string;
  members: string;
  slides?: string;
};

export type WinKind =
  | 'Research'
  | 'Paper'
  | 'Award'
  | 'Talk'
  | 'Travel grant'
  | 'Internship'
  | 'Grad school'
  | 'Fellowship'
  | 'Career'
  | 'Open source'
  | 'Mentorship'
  | 'Community';

export type Win = {
  id: string;
  name: string;
  kind: WinKind;
  /** The full sentence shown on the site. Titles in curly quotes are set in italics. */
  text: string;
  /** Show on the homepage under Monthly wins. */
  highlight?: boolean;
};

export type WinsMonth = {
  key: string; // "2026-09"
  label: string; // "September 2026"
  note: string;
  status: 'draft' | 'published';
  wins: Win[];
};

export type ReadingPaper = {
  id: string;
  date: string; // "Sat 3 Oct"
  title: string;
  note?: string;
  ledBy?: string;
  slides?: string;
};

export type ReadingMonth = {
  key: string; // "2026-10"
  label: string; // "October 2026"
  theme: string;
  status: 'draft' | 'published';
  papers: ReadingPaper[];
};

export type GalleryItem = {
  id: string;
  event: string;
  caption: string;
  /** Description for screen reader users. Required before publishing. */
  alt: string;
  src?: string;
  video?: string;
  order: number;
};

export type PersonGroup = 'organiser' | 'advisor' | 'torchbearer';

export type Person = {
  id: string;
  name: string;
  role: string;
  group: PersonGroup;
  since?: string;
  /** For Torchbearers, for example "2023 to 2025". */
  years?: string;
  link?: string;
  linkLabel?: string;
  photo?: string;
  order: number;
};

export type ShowcaseTalk = {
  speaker: string;
  title: string;
  summary: string;
  slides?: string;
};

export type ShowcaseSession = {
  id: string;
  date: string; // ISO date of the Sunday
  notes?: string;
  talks: ShowcaseTalk[];
};

export type SubmissionType = 'Paper' | 'Product' | 'Focus group update' | 'Sunday slot request' | 'Correction';

export type Submission = {
  id: string;
  type: SubmissionType;
  title: string;
  authors: string;
  venue: string;
  date: string; // yyyy-mm from the month input
  topic: string;
  topicOther?: string;
  summary: string;
  links: Links;
  figure?: { src: string; alt: string; filename: string };
  email: string;
  coAuthorsAgreed: boolean;
  createdAt: string;
  status: 'waiting' | 'approved' | 'declined';
  decidedBy?: string;
  decidedAt?: string;
  declineReason?: string;
  publishedId?: string;
};

export type AdminRole = 'Super admin' | 'Admin';

export type Admin = {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  passwordHash: string;
  addedAt: string;
};

export type ActivityArea =
  | 'Inbox'
  | 'Published papers'
  | 'Reading groups'
  | 'Monthly wins'
  | 'Gallery'
  | 'People'
  | 'Admins';

export type Activity = {
  id: string;
  at: string;
  who: string;
  /** Sentence after the name, for example "published a paper: SharpXR". */
  what: string;
  area: ActivityArea;
  /** Collection to restore on undo, and its state before this change. */
  collection?: CollectionName;
  before?: unknown;
  undone?: boolean;
};

export type Collections = {
  papers: Paper[];
  products: Product[];
  focusGroups: FocusGroup[];
  wins: WinsMonth[];
  reading: ReadingMonth[];
  gallery: GalleryItem[];
  people: Person[];
  showcase: ShowcaseSession[];
  submissions: Submission[];
  admins: Admin[];
  activity: Activity[];
};

export type CollectionName = keyof Collections;
