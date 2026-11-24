import real from './realdata.json';
import { LINKS } from './links';

/* Content that changes rarely and has no admin screen yet.
   Editable collections (papers, wins, gallery, people and so on) live in seed.ts
   and the content store. */

export const TOPICS: string[] = (real.TOPICS as string[]).filter((t) => t !== 'All topics');

/* ---------- This week (homepage) ---------- */

/** day: 0 = Sunday. hour is in WAT (UTC+1), 24 hour clock. */
export type Session = { day: number; hour: number; name: string; detail: string };

export const THIS_WEEK: Session[] = [
  { day: 4, hour: 21, name: 'ML Systems Study Group', detail: 'This week we’re on chapter 6, data engineering, with a TinyTorch lab.' },
  { day: 5, hour: 20, name: 'CS197 Foundations Study Group', detail: 'This week the cohort is working through assignment 3.' },
  { day: 6, hour: 20, name: 'Saturday Reading Group', detail: 'This month we’re reading papers on speech and audio.' },
  { day: 0, hour: 20, name: 'Sunday Special', detail: 'Our weekly call. One to three members present their work, then we catch up on community news.' },
];

/* ---------- Special sessions ---------- */

export type SpecialSession = { date: string; title: string; detail?: string };

/** Newest first. A session moves to "Earlier" once its date has passed. */
export const SPECIAL_SESSIONS: SpecialSession[] = [
  { date: '2026-11-16', title: 'Applying to grad school', detail: 'Members who applied last year share what worked, then open questions.' },
  { date: '2026-09-14', title: 'Internships' },
  { date: '2026-07-06', title: 'Careers outside academia' },
  { date: '2026-05-04', title: 'Community housekeeping' },
];

/* ---------- Where to start (homepage) ---------- */

export const PATHS = [
  {
    who: 'New to ML research',
    name: 'CS197 Foundations Study Group',
    body: 'If you’re new to research, you can start here. We go through Harvard’s AI research course together, one assignment at a time, with people learning right alongside you.',
    link: 'About the study group',
    href: '/programmes/cs197',
  },
  {
    who: 'Ready to do research',
    name: 'Focus groups',
    body: 'Bring a research idea, or join others to come up with one, and work toward a publication as a small, focused team. Share updates on Sunday calls and get help when you’re stuck.',
    link: 'About focus groups',
    href: '/programmes/focus-groups',
  },
  {
    who: 'Just curious',
    name: 'Saturday Reading Groups',
    body: 'A good way to get comfortable reading papers. Each month has a theme, and every Saturday we read one paper on it together, with everyone taking a part in the discussion.',
    link: 'This month’s reading list',
    href: '/programmes/reading-groups',
  },
];

/* ---------- Programmes overview ---------- */

export const PROGRAMMES = [
  { name: 'CS197 Study Group', href: '/programmes/cs197', when: 'Fridays, 8pm WAT', body: 'If you’re new to research, start here. We go through Harvard’s AI research course together, one assignment at a time.' },
  { name: 'Saturday Reading Groups', href: '/programmes/reading-groups', when: 'Saturdays, 8pm WAT', body: 'A good way to get comfortable reading papers. Every Saturday we read one paper on the month’s theme together.' },
  { name: 'ML Systems Study Group', href: '/programmes/ml-systems', when: 'Thursdays, 9pm WAT', body: 'Learn how machine learning systems are built and run, working through the Machine Learning Systems textbook week by week.' },
  { name: 'Focus Groups', href: '/programmes/focus-groups', when: 'Your group sets its schedule', body: 'Bring a research idea, or join others to come up with one, and work toward a publication as a small, focused team.' },
  { name: 'Sunday Specials', href: '/programmes/sunday-specials', when: 'Sundays, 8pm WAT', body: 'Our weekly community call. Members present their work, then we share community news.' },
  { name: 'Mentorship', href: '/programmes/mentorship', when: 'Twice a year', body: 'Once you have a workshop paper accepted, we can pair you with a researcher who can help you think through what comes next.' },
  { name: 'Internships', href: '/programmes/internships', when: 'Updated weekly', body: 'A running list of open research internships, kept up to date by members.' },
  { name: 'Fellowships', href: '/programmes/fellowships', when: 'Open calls in the opportunities doc', body: 'Research fellowships, summer schools and programmes our members have taken part in.' },
];

/* ---------- CS197 ---------- */

export const CS197_ASSIGNMENTS = [
  { name: 'The Language of Code', body: 'Set up the tools researchers use every day: the terminal, git, Python environments and a good editor.' },
  { name: 'First Dive in AI', body: 'Run and fine tune your first language and vision models with Hugging Face and Lightning.' },
  { name: 'Torched', body: 'Get solid with PyTorch fundamentals, from tensors to writing your own training loop.' },
  { name: 'Spark Joy', body: 'Organise training runs properly, with experiment tracking and clean configs.' },
  { name: 'Ideation and Organization', body: 'Read papers with purpose, come up with research ideas and plan how to test them.' },
  { name: 'Stable Diffusion and Research Operations', body: 'Fine tune a diffusion model and learn to run experiments on cloud GPUs.' },
];

export const CS197_NEXT_COHORT = {
  title: 'The next cohort starts in January 2027',
  sub: 'Applications are open until 15 December.',
  cta: 'Apply for the January cohort',
  href: LINKS.cs197Apply,
};

/* ---------- Internships, fellowships, grad school (real data) ---------- */

export type InternYear = { year: string; people: { name: string; where: string }[] };

export const INTERNS: InternYear[] = (real.INTERNS as [string, [string, string][]][]).map(([year, people]) => ({
  year,
  people: people.map(([name, where]) => ({ name, where })),
}));

export const INTERNSHIP_PANELS = [
  { title: 'Panel session on internships', date: '22 Mar 2026', href: LINKS.internshipPanelMar2026 },
  { title: 'Panel session on internships', date: '14 Sep 2026', href: LINKS.internshipPanelSep2026 },
];

export type NameLine = { name: string; lines: string[] };

export const FELLOWS: NameLine[] = (real.FELLOWS as string[][]).map(([name, ...lines]) => ({
  name,
  lines: lines.filter(Boolean),
}));

export const SUMMER_SCHOOLS: NameLine[] = (real.PROGRAMMES as string[][]).map(([name, ...lines]) => ({
  name,
  lines: lines.filter(Boolean),
}));

export type GradStudent = { name: string; school: string; degree: string; course: string; year: string };

export const GRADS: GradStudent[] = (real.GRADS as string[][]).map(([name, school, degree, course]) => ({
  name,
  school,
  degree,
  course,
  year: '2026',
}));

/* ---------- Members map (real data) ---------- */

export type PlaceMember = { name: string; what: string; type: string; year: string };
export type Place = { id: string; city: string; country: string; lon: number; lat: number; people: PlaceMember[] };

export const PLACES: Place[] = (real.PLACES as [string, string, string, number[], PlaceMember[]][]).map(
  ([id, city, country, [lon, lat], people]) => ({ id, city, country, lon, lat, people }),
);

/** Pin positions on the flat mobile map, as percentages of its width and height. */
export const FLAT_PINS: Record<string, [number, number]> = {
  alps: [47.09, 20.34],
  uk: [42.91, 16.48],
  dublin: [41.01, 13.69],
  espoo: [53.25, 9.44],
  accra: [43.81, 55.31],
  lagos: [46.64, 54.54],
  kigali: [55.05, 61.64],
  johannesburg: [54.35, 82.01],
  capetown: [51.05, 88.64],
  singapore: [80.48, 58.86],
  adelaide: [92.55, 89.35],
  seattle: [2.42, 19.97],
  berkeley: [2.44, 28.18],
  boston: [20.11, 24.41],
};

/* ---------- Indaba ---------- */

export type IndabaYear = {
  year: string;
  place?: string;
  photo: string;
  items: { label: string; text: string; link?: { text: string; href: string } }[];
};

export const INDABA_YEARS: IndabaYear[] = [
  {
    year: '2026',
    place: 'Lagos, Nigeria',
    photo: 'Photo from the 2026 community booth',
    items: [
      {
        label: 'Workshop',
        text: ', with a voice AI challenge run with Intron and Adaption Lab. Organised by Chisom, Honor-Jesus, Ifihan, Abraham and Steven.',
        link: { text: 'Whose Intelligence?', href: '/initiatives/workshop-2026' },
      },
      {
        label: 'Speakers',
        text: 'Steven Kolawole and Ifihan Olusheye, skills session on doing ML research from the margins\nJesse-Paul, skills session on building on-device AI applications',
      },
      { label: 'Posters', text: 'Daniel Akhabue won a poster award. Jesse-Paul and Delight Abioye also presented posters.' },
      { label: 'Booth', text: 'Our first community booth, with merch and live demos' },
      { label: 'Sponsors', text: 'Intron and Adaption Labs' },
    ],
  },
  {
    year: '2025',
    photo: 'Photo of members at the 2025 Indaba',
    items: [
      { label: 'Posters', text: 'Five members presented posters, and two won poster awards' },
      { label: 'Fundraiser', text: 'Supported 25 members to travel' },
      { label: 'Speakers', text: 'Two members spoke in the main programme' },
    ],
  },
  {
    year: '2024',
    photo: 'Photo from the 2024 hackathon',
    items: [
      { label: 'Posters', text: 'Members presented four posters' },
      { label: 'Hackathon', text: 'A team of members placed in the Indaba hackathon' },
      { label: 'Fundraiser', text: 'Supported 25 members to travel' },
    ],
  },
  {
    year: '2023',
    photo: 'Photo of members at the 2023 Indaba',
    items: [
      { label: 'Posters', text: 'Three posters, one poster award' },
      // TODO: the design had "Supported X members to travel". Add the number.
      { label: 'Fundraiser', text: 'Supported members to travel' },
    ],
  },
  {
    year: '2022',
    place: 'Tunis, Tunisia',
    photo: 'Photo of the 2022 group in Tunis',
    items: [
      { label: 'Fundraiser', text: 'Our first fundraiser sent eight members to the Indaba. 104 donations raised $17,610.' },
      { label: 'Firsts', text: 'For most of us, the first time at an international ML conference' },
    ],
  },
];

export const FUNDRAISERS = [
  {
    title: '2025 Indaba fundraiser',
    body: 'Covered flights, visas and accommodation for members presenting work.',
    meta: ['Supported 25 members to travel'],
    href: 'https://donorbox.org/mlc-nigeria-deep-learning-indaba-2025',
  },
  {
    title: '2024 Indaba fundraiser',
    body: 'Helped members with accepted posters and hackathon teams attend.',
    meta: ['Supported 25 members to travel'],
    href: 'https://donorbox.org/mlc-nigeria-deep-learning-indaba-2024',
  },
  {
    title: '2023 Indaba fundraiser',
    body: 'Travel support for first time attendees.',
    // TODO: the design had "Supported X members to travel". Add the number.
    meta: [] as string[],
    href: LINKS.fundraiser2023,
  },
  {
    title: '2022 Indaba fundraiser',
    body: 'Our first fundraiser. Sent eight members to the Indaba in Tunis for airfare, visas and housing.',
    meta: ['Supported 8 members', '$17,610 raised from 104 donations'],
    href: 'https://donorbox.org/mlc-support-deep-learning-indaba',
  },
];

export const SPONSORS = [
  { name: 'Intron', note: '2026 workshop, voice AI challenge partner' },
  { name: 'Adaption Labs', note: '2026 workshop, compute credits' },
];

/* ---------- Join ---------- */

export const JOIN_STEPS = [
  { title: 'Join the Discord', body: 'Introduce yourself in #introductions, ask questions, and find people working on what you care about.', cta: 'Open Discord', href: LINKS.discord, solid: true },
  { title: 'Request the mailing list', body: 'So you never miss updates from the community.', cta: 'Request access', href: LINKS.mailingList, solid: false },
  { title: 'Join our Sunday Special', body: 'Sundays, 8pm WAT. Add the calendar to get the call link, plus recordings and notes from past calls.', cta: 'Add the calendar', href: LINKS.calendar, solid: false },
];

export const FAQ = [
  { q: 'Who can join?', a: 'Anyone working on problems that matter to the continent, wherever you’re based. Everything is free and run by volunteers.' },
  { q: 'Is this only for people going into a PhD?', a: 'No. Members go on to internships, industry jobs, open source and more. Grad school is one path, and it isn’t for everyone.' },
  { q: 'Do I need published papers?', a: 'No. Most members joined without any.' },
  { q: 'Can I just look around first?', a: 'Yes. The Sunday Special and the Saturday reading group are easy ways in, with nothing to commit to.' },
  { q: 'How much time do I need?', a: 'The reading group is about an hour a week, plus time to read the paper. CS197 takes 3 to 8 hours a week, a focus group 4 to 12, and the Sunday call about an hour and a half. Most active members take part in at least one.' },
  { q: 'I have never done research. Where do I start?', a: 'The CS197 study group was made for exactly this. If you’d rather ease in, the Saturday reading group is a gentle place to start.' },
  { q: 'My field is not computer science. Can I join?', a: 'Yes. We have members working in computational biology, linguistics, medicine, the digital humanities and the social sciences.' },
  { q: 'There’s no focus group for my area. What now?', a: 'Find two or three people who care about the same problem and propose one. We’ll help you sharpen the idea and find mentors.' },
  { q: 'Does it cost anything?', a: 'No. Joining and every programme are free. We’ve also helped members with application fee waivers and conference costs.' },
  { q: 'How do I get a mentor?', a: 'Mentorship is for active members, usually once you have early results accepted at a workshop. Most people get there through a focus group.' },
];
