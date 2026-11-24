# MLC Africa website

Next.js 15 (App Router, TypeScript) build of the MLC Africa design handoff. The design files and the original handoff notes are in [`designs/`](designs/README.md).

## Run it

```bash
cp .env.example .env.local   # then edit the values
npm install
npm run dev                  # http://localhost:3000
```

Production: `npm run build && npm start`. `SESSION_SECRET` must be set in production.

Admin is at `/admin`. On a new install there are no admins. Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` from the environment and that account becomes the first super admin. Super admins add other admins from Admin, Admins. Each new admin gets a temporary password to pass on.

## How it is organised

| Where | What |
| --- | --- |
| `src/app/(site)/` | Public pages. Each section (`about`, `research`, `programmes`, `initiatives`, `life`) has a layout that sets the section accent and subnav. |
| `src/app/admin/` | Admin: sign in, dashboard, inbox and review, papers, reading groups, monthly wins, gallery, people, activity with undo, admins. |
| `src/app/globals.css`, `src/styles/` | Design tokens and patterns. Section accents are CSS variables set by `[data-section]`. |
| `src/content/` | Copy and data that rarely change (`site.ts`), navigation (`nav.ts`), external links (`links.ts`), and seed data for the editable collections (`seed.ts`, built from `realdata.json`). |
| `src/lib/store.ts` | A JSON file store, one file per collection, in `DATA_DIR` (default `.data/`). Seeded on first read. |
| `src/lib/actions/` | Server actions for the research submission form and admin. |

### Routes

Home `/` · About `/about`, `/about/organisers`, `/about/torchbearers` · Research `/research`, `/research/ongoing`, `/research/products`, `/research/submit`, `/research/papers/[slug]` · Programmes `/programmes`, `/programmes/cs197`, `/programmes/reading-groups`, `/programmes/reading-groups/past-themes`, `/programmes/ml-systems`, `/programmes/focus-groups`, `/programmes/sunday-specials`, `/programmes/mentorship`, `/programmes/internships`, `/programmes/fellowships` · Initiatives `/initiatives/indaba`, `/initiatives/workshop-2026`, `/initiatives/fundraisers`, `/initiatives/grad-school`, `/initiatives/sponsors` · Life `/life/showcase`, `/life/monthly-wins`, `/life/gallery` · `/join`

The `*Mobile.dc.html` designs are built into the same pages as responsive styles (breakpoints at 860px for the nav and 640px for content). On phones the homepage swaps the globe for the flat map.

## Before launch

- **Placeholder content from the prototype:** organiser and Torchbearer names, the Research showcase sessions and the gallery captions. Edit people and the gallery in admin. Showcase sessions live in `.data/showcase.json` (it has no admin screen yet).
- **Missing links:** the design had `#` for the CS197 application, mentee and mentor forms, internship panel recordings and the 2023 fundraiser. Add them in `src/content/links.ts`. Until then those buttons are hidden.
- **Missing number:** 2023 Indaba travel support said “X members”. Add it in `src/content/site.ts`.
- **Hosting:** the file store needs a persistent disk (a single VPS or container with a volume). For serverless hosting, replace `src/lib/store.ts` with a database or Payload CMS, as the handoff suggests. Pages only call `readCollection`, `mutate` and `logActivity`.
- **Email:** nothing sends email yet. The review screen shows the submitter’s address so an organiser can reply.

Admin sidebar items marked “Soon” (products, focus groups, This week, CS197 cohort and others) have no design yet. Their content is in `src/content/` or the store files.
