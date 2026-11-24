import { promises as fs } from 'node:fs';
import path from 'node:path';
import { seed } from '@/content/seed';
import type { Activity, ActivityArea, CollectionName, Collections } from './types';
import { newId } from './utils';

/* A small JSON file store, one file per collection, kept in DATA_DIR.
   It is enough for a volunteer-run site on a single server. To run on serverless
   hosting, swap these functions for a database or Payload CMS; pages only use
   readCollection, mutate and logActivity. */

const DATA_DIR = path.resolve(process.env.DATA_DIR || '.data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

const queues = new Map<CollectionName, Promise<unknown>>();
const seeding = new Map<CollectionName, Promise<unknown>>();

function fileFor(name: CollectionName) {
  return path.join(DATA_DIR, `${name}.json`);
}

async function writeAtomic(file: string, data: unknown) {
  await fs.mkdir(path.dirname(file), { recursive: true });
  const tmp = `${file}.${process.pid}.${newId()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(data, null, 2), 'utf8');
  await fs.rename(tmp, file);
}

export async function readCollection<K extends CollectionName>(name: K): Promise<Collections[K]> {
  try {
    const raw = await fs.readFile(fileFor(name), 'utf8');
    return JSON.parse(raw) as Collections[K];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    // First read of this collection: write the seed once, even if several requests arrive together.
    let pending = seeding.get(name) as Promise<Collections[K]> | undefined;
    if (!pending) {
      const initial = seed()[name];
      pending = writeAtomic(fileFor(name), initial).then(() => initial);
      seeding.set(name, pending);
      pending.finally(() => seeding.delete(name)).catch(() => undefined);
    }
    return structuredClone(await pending);
  }
}

/** Read, change and save a collection. Writes to one collection run one at a time. */
export async function mutate<K extends CollectionName, R = void>(
  name: K,
  fn: (current: Collections[K]) => { next: Collections[K]; result?: R } | Promise<{ next: Collections[K]; result?: R }>,
): Promise<{ before: Collections[K]; result: R | undefined }> {
  const prev = queues.get(name) ?? Promise.resolve();
  const run = prev
    .catch(() => undefined)
    .then(async () => {
      const before = await readCollection(name);
      const copy = structuredClone(before);
      const { next, result } = await fn(copy);
      await writeAtomic(fileFor(name), next);
      return { before, result };
    });
  queues.set(name, run);
  return run;
}

export async function logActivity(entry: {
  who: string;
  what: string;
  area: ActivityArea;
  collection?: CollectionName;
  before?: unknown;
}) {
  const item: Activity = { id: newId(), at: new Date().toISOString(), ...entry };
  // Keep 500 entries, but only the latest 50 keep the snapshot needed to undo them.
  await mutate('activity', (list) => ({
    next: [item, ...list].slice(0, 500).map((e, i) => (i < 50 || e.before === undefined ? e : { ...e, before: undefined })),
  }));
}

/* ---------- Uploads ---------- */

const IMAGE_TYPES: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
};

export const MAX_UPLOAD_BYTES = 10 * 1024 * 1024;

export async function saveUpload(file: File, maxBytes = MAX_UPLOAD_BYTES): Promise<string> {
  const ext = IMAGE_TYPES[file.type];
  if (!ext) throw new Error('Only PNG or JPG images can be uploaded.');
  if (file.size > maxBytes) throw new Error(`Images must be ${Math.round(maxBytes / 1024 / 1024)} MB or smaller.`);
  const name = `${newId()}.${ext}`;
  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  return `/uploads/${name}`;
}

export async function readUpload(name: string): Promise<{ data: Buffer; type: string } | null> {
  if (!/^[a-z0-9]+\.(png|jpg)$/.test(name)) return null;
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return { data, type: name.endsWith('.png') ? 'image/png' : 'image/jpeg' };
  } catch {
    return null;
  }
}
