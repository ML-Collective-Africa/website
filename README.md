# MLC Africa website

The website for ML Collective Africa, built with Next.js and Payload CMS.

## Getting started

```bash
cp .env.example .env.local   # then fill in DATABASE_URL and PAYLOAD_SECRET
npm install
npm run dev
```

Then open http://localhost:3000. The first time it runs against an empty database, run `npm run build` once to set up the tables and load the starting content.

## Admin

Go to `/admin`. The first super admin is created from `ADMIN_EMAIL` and `ADMIN_PASSWORD`. Super admins add other admins from Team → Admins.

## Scripts

- `npm run dev` starts the development server
- `npm run build` sets up the database, loads the starting content once, and builds for production
- `npm start` runs the production build
- `npm run payload migrate:create` creates a database migration after changing a collection
