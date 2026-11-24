/* Run by the build (see package.json) after migrations and before Next.js builds
   pages, so the one-time import happens once, in a single process. */
import { getPayload } from 'payload';
import config from '../payload.config';
import { ensureFirstAdmin, seedIfEmpty } from './seed';

const payload = await getPayload({ config });
await ensureFirstAdmin(payload);
await seedIfEmpty(payload);
await payload.destroy();
process.exit(0);
