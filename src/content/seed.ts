import real from './realdata';
import type {
  Collections,
  FocusGroup,
  GalleryItem,
  Paper,
  Person,
  Product,
  ReadingMonth,
  ShowcaseSession,
  WinKind,
  WinsMonth,
} from '@/lib/types';
import { uniqueSlug, yearFrom } from '@/lib/utils';
import { LINKS } from './links';

/* Initial content for the store. On first run these are written to the data
   directory, and from then on admins edit them there. */

const FEATURED = new Set([
  'Evaluating the Generalization of Neuroimaging Foundation Models on African Brain MRI',
  'VAMAE: Vessel-Aware Masked Autoencoders for OCT-Angiography',
  'Afri-MCQA',
  'Towards Digital Preservation of Efik: TTS for a Low-Resource African Language',
]);

function seedPapers(): Paper[] {
  const taken = new Set<string>();
  const rows = real.PAPERS as [string, string, string, string][];
  return rows.map(([title, authors, venue, topic], i) => ({
    id: `p${i + 1}`,
    slug: uniqueSlug(title, taken),
    title,
    authors,
    venue,
    year: yearFrom(venue),
    topic,
    links: {},
    visible: true,
    featured: FEATURED.has(title),
    order: rows.length - i,
  }));
}

function seedProducts(): Product[] {
  const rows = real.PRODUCTS as [string, string, string][];
  return rows.map(([name, description, team], i) => ({
    id: `pr${i + 1}`,
    name,
    description,
    team,
    visible: true,
    order: rows.length - i,
  }));
}

function seedFocusGroups(): FocusGroup[] {
  return (real.GROUPS as [string, string, string, string][]).map(([name, topic, status, members], i) => ({
    id: `fg${i + 1}`,
    name,
    topic,
    status,
    members,
    slides: LINKS.activeGroupsSlides,
  }));
}

function win(id: string, name: string, kind: WinKind, text: string, highlight = false) {
  return { id, name, kind, text, highlight };
}

/* September 2026 is the real list from the Monthly wins design. The other months
   in the design used placeholder names, so they are not seeded. */
function seedWins(): WinsMonth[] {
  return [
    {
      key: '2026-09',
      label: 'September 2026',
      note: 'Here are our wins for September 2026. As always, this is a rolling list, a record of our collective progress.',
      status: 'published',
      wins: [
        win('w1', 'Divine-Peace Ehuchie', 'Research', 'Divine-Peace Ehuchie submitted her first ML task for the DSN AI Bootcamp hackathon (first time not letting imposter syndrome win!)'),
        win('w2', 'Oluwatobi Akinmuleya', 'Award', 'Oluwatobi Akinmuleya, Olamide Lawal, and others’ paper “Evaluating the Generalization of Neuroimaging Foundation Models on African Brain MRI” won Best Paper Award at AFRICAI @ MICCAI 2026 in Strasbourg, France', true),
        win('w3', 'Embodied AI focus group', 'Paper', 'Timi Owolabi, Iqma, Ayo, and Frances’ (Embodied AI focus group) paper “SmolWAM: A Latent World-Action Model for Robotic Manipulation on Edge Devices” was accepted to the Robotics World Modeling workshop at NeurIPS 2026', true),
        win('w4', 'Glory Bagai', 'Paper', 'Glory Bagai’s paper was accepted to the Optimisation for Machine Learning workshop at NeurIPS 2026'),
        win('w5', 'Shiloh Oni', 'Paper', 'Shiloh Oni and Testimony Adekoya’s paper “AfriVTON-Bench: Evaluating the Robustness of Virtual Try-On Models to African Textile Patterns and Garment Structures” was accepted to WiML and Global South AI workshops at NeurIPS 2026', true),
        win('w6', 'Kelechi Chibundu', 'Paper', 'Kelechi Chibundu’s abstract “Task-Critical Word Error Rate: Extending Entity-Focused Evaluation to Voice Commands in African Accented Speech” was accepted to WiML and Global South AI workshops at NeurIPS 2026'),
        win('w7', 'Emmanuel Idoko', 'Paper', 'Emmanuel Idoko and colleagues’ paper “Building MRI Capacity in Nigeria: Preliminary Report of the First Onsite Assembly of a Reusable, Low-Field MRI Scanner and Robotic Field-Mapping System in Nigeria” was accepted for poster presentation at ESMRMB Congress 2026 in Girona, Spain (from his CAMERA MRI IMAGINE Summer School work)'),
        win('w8', 'Nunsi Shiaki', 'Paper', 'Nunsi Shiaki, Oluwaferanmi Oladepo, and Adejire Adegite’s paper “Label-Free Detection of Incipient Electro-Mechanical Faults via Cross-Modal Attention and Latent Diffusion” was presented at the IRAI Conference in Melbourne, Australia (Oluwaferanmi presented on-site)'),
        win('w9', 'Usman Daudu', 'Paper', 'Usman Daudu and co-author’s dataset was accepted to the MRL Shared Task at EMNLP 2026'),
        win('w10', 'Offiong Bassey', 'Travel grant', 'Offiong Bassey was awarded an $800 AUD travel grant by Interspeech 2026 to present his accepted paper', true),
        win('w11', 'Grace Ayoola', 'Research', 'Grace Ayoola published previously shelved research on Figshare, including work on Yorùbá marriage prayers as indigenous knowledge'),
        win('w12', 'Shiloh Oni', 'Grad school', 'Shiloh Oni received a partial offer from SOAS University of London'),
        win('w13', 'Olamilekan Matthew Omotosho', 'Career', 'Olamilekan Matthew Omotosho passed his Google Cloud Professional Machine Learning Engineer Certification, ahead of his new Senior AI Engineer role'),
        win('w14', 'Tolulope Matthew Busoye', 'Community', 'Tolulope Matthew Busoye hosted two workshops at his company: “Behind the Hood with Zephyr: Bringing Up an STM32G4 Board” and “Beyond an RTOS: Embedded Linux from Scratch”'),
      ],
    },
  ];
}

function rp(id: string, date: string, title: string, note: string) {
  return { id, date, title, note };
}

function seedReading(): ReadingMonth[] {
  const past = (key: string, label: string, theme: string, titles: string[]): ReadingMonth => ({
    key,
    label,
    theme,
    status: 'published',
    papers: titles.map((title, i) => ({ id: `${key}-${i}`, date: '', title })),
  });
  return [
    {
      key: '2026-10',
      label: 'October 2026',
      theme: 'Speech and audio',
      status: 'published',
      papers: [
        rp('r1', 'Sat 3 Oct', 'Self-Supervised Speech Representation Learning: A Review', 'The first Saturday of each month is a survey paper, to set up the theme.'),
        rp('r2', 'Sat 10 Oct', 'wav2vec 2.0: A Framework for Self-Supervised Learning of Speech Representations', 'How to learn speech representations from raw audio with very little labelled data.'),
        rp('r3', 'Sat 17 Oct', 'HuBERT: Self-Supervised Speech Representation Learning by Masked Prediction of Hidden Units', 'Masked prediction for speech, and why the targets matter.'),
        rp('r4', 'Sat 24 Oct', 'Robust Speech Recognition via Large-Scale Weak Supervision', 'The Whisper paper, and what training on 680,000 hours of web audio buys you.'),
        rp('r5', 'Sat 31 Oct', 'Scaling Speech Technology to 1,000+ Languages', 'Speech models for low resource languages, close to home for many of us.'),
      ],
    },
    past('2026-09', 'September 2026', 'Making models smaller and faster', [
      'Distilling the Knowledge in a Neural Network',
      'The Lottery Ticket Hypothesis',
      'QLoRA: Efficient Finetuning of Quantized LLMs',
      'MobileLLM: Optimizing Sub-billion Parameter Language Models',
    ]),
    past('2026-08', 'August 2026', 'How we evaluate language models', [
      'Holistic Evaluation of Language Models',
      'AfroBench: How Good Are LLMs on African Languages?',
      'Lost in the Middle: How Language Models Use Long Contexts',
      'Judging LLM-as-a-Judge',
    ]),
    past('2026-07', 'July 2026', 'Medical imaging', [
      'U-Net: Convolutional Networks for Biomedical Image Segmentation',
      'CheXzero: Expert-level Detection from Unannotated Chest X-rays',
      'Segment Anything in Medical Images',
      'Domain Generalisation in Medical Imaging: A Survey',
    ]),
    past('2026-06', 'June 2026', 'Fairness and safety', [
      'Gender Shades',
      'Model Cards for Model Reporting',
      'Concrete Problems in AI Safety',
      'Red Teaming Language Models with Language Models',
    ]),
  ];
}

/* PLACEHOLDER: the gallery captions come from the design prototype. Replace them
   with real photos through Admin, Gallery. */
function seedGallery(): GalleryItem[] {
  const rows: [string, string][] = [
    ['First day at EPFL', 'Ade’s first day of his internship in Lausanne'],
    ['Poster session, NeurIPS 2025', 'Presenting our robustness work at a workshop poster'],
    ['Talk at ACL 2025', 'Giving our AfricaNLP talk in Vienna'],
    ['Starting grad school', 'Chioma’s first week of her MSc in Johannesburg'],
    ['Deep Learning Indaba 2025', 'Poster award winners on stage'],
    ['Internship, Google Research Africa', 'Kofi with his team in Accra'],
    ['MICCAI 2025', 'Poster session for our paediatric chest X-ray work'],
    ['Summer school', 'Lab day at a machine learning summer school'],
    ['Merch and branding', 'MLC Africa tote bags and stickers at the booth'],
  ];
  return rows.map(([event, caption], i) => ({ id: `g${i + 1}`, event, caption, alt: caption, order: rows.length - i }));
}

/* PLACEHOLDER: organiser and Torchbearer names come from the design prototype.
   Replace them through Admin, People. The two advisors are real. */
function seedPeople(): Person[] {
  const org = (name: string, role: string, since?: string): Omit<Person, 'id' | 'order'> => ({
    name,
    role,
    group: 'organiser',
    since,
    linkLabel: 'LinkedIn',
  });
  const past = (name: string, role: string, years: string): Omit<Person, 'id' | 'order'> => ({
    name,
    role,
    group: 'torchbearer',
    years,
    linkLabel: 'LinkedIn',
  });
  const list: Omit<Person, 'id' | 'order'>[] = [
    org('Adaeze Nwosu', 'Community lead', '2023'),
    org('Kofi Asante', 'Focus groups', '2024'),
    org('Halima Yusuf', 'CS197 Study Group', '2024'),
    org('Lerato Dlamini', 'Saturday Reading Groups', '2025'),
    org('Emeka Obi', 'ML Systems Study Group', '2026'),
    org('Zawadi Mwangi', 'Sunday Specials', '2025'),
    org('Bola Adebayo', 'Partnerships and sponsors'),
    org('Nadia Haddad', 'Social media'),
    { name: 'Rosanne Liu', role: 'Co-founder, ML Collective', group: 'advisor', linkLabel: 'Website' },
    { name: 'Jason Yosinski', role: 'Co-founder, ML Collective', group: 'advisor', linkLabel: 'Website' },
    past('Tunde Bakare', 'Saturday Reading Groups', '2023 to 2025'),
    past('Esi Owusu', 'Community lead', '2023 to 2024'),
    past('Moses Kiprono', 'Focus groups', '2024 to 2025'),
    past('Aisha Sule', 'Events', '2023 to 2025'),
    past('Chidi Nwankwo', 'CS197 Study Group', '2024'),
    past('Ruth Tesfaye', 'Mentorship', '2024 to 2025'),
  ];
  return list.map((p, i) => ({ ...p, id: `pe${i + 1}`, order: i }));
}

/* PLACEHOLDER: showcase sessions come from the design prototype. */
function seedShowcase(): ShowcaseSession[] {
  return [
    {
      id: 's1',
      date: '2026-10-25',
      talks: [
        { speaker: 'Speech focus group', title: 'Code switched speech recognition for Hausa and English', summary: 'We recorded 40 hours of people switching between Hausa and English mid sentence and tested five speech models on it. All of them struggled most at the switch points.' },
        { speaker: 'Kwame Mensah', title: 'Running small language models on a $60 phone', summary: 'How far you can prune and quantise a small language model before it stops being useful, measured on a cheap Android phone.' },
      ],
    },
    {
      id: 's2',
      date: '2026-10-18',
      talks: [
        { speaker: 'Wanjiru Kamau', title: 'Reading papers when you’re new to the field', summary: 'A practical walkthrough of how she reads a paper in three passes, and how to keep notes you’ll actually reuse.' },
        { speaker: 'Medical imaging focus group', title: 'Few labels, many scans', summary: 'Early results on few shot classification of chest X-rays using frozen encoders, and what went wrong with the first split.' },
        { speaker: 'Ngozi Eze', title: 'Why our skin classifier failed', summary: 'A look at how a skin lesion model trained mostly on lighter skin performed on darker skin tones, and the fixes the team tried.' },
      ],
    },
    {
      id: 's3',
      date: '2026-10-11',
      talks: [
        { speaker: 'Yorùbá translation focus group', title: 'Augmenting data for low resource translation', summary: 'Comparing back translation and simple word swaps for English to Yorùbá translation with under 10,000 sentence pairs.' },
      ],
    },
  ];
}

export function seed(): Collections {
  return {
    papers: seedPapers(),
    products: seedProducts(),
    focusGroups: seedFocusGroups(),
    wins: seedWins(),
    reading: seedReading(),
    gallery: seedGallery(),
    people: seedPeople(),
    showcase: seedShowcase(),
    submissions: [],
    admins: [],
    activity: [],
  };
}
