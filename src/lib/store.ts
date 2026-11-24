import { promises as fs } from 'node:fs';
import path from 'node:path';
import { seed } from '@/content/seed';
import type { Activity, ActivityArea, CollectionName, Collections } from './types';
import { newId } from './utils';

/* A small JSON file store, one file per collection, kept in DATA_DIR.
   It is enough for a volunteer-run site on a single server. To run on serverless
   hosting, swap these functions for a database or Payload CMS; pages only use
   readCollection, mutate and logActivity.

   On a read-only filesystem (for example Vercel) the store still reads: it serves
   the built-in seed content from memory. Saving throws ReadOnlyStoreError. */

const DATA_DIR = path.resolve(process.env.DATA_DIR || '.data');
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');

// Vercel's disk is read-only, and creating a folder there fails with ENOENT.
const READ_ONLY_CODES = new Set(['EROFS', 'EACCES', 'EPERM', 'ENOENT']);

/* Skip the disk entirely where it can't be written: on Vercel (unless DATA_DIR
   points somewhere writable), or when STORE_READ_ONLY=1. */
const READ_ONLY_MODE = process.env.STORE_READ_ONLY === '1' || (Boolean(process.env.VERCEL) && !process.env.DATA_DIR);

export class ReadOnlyStoreError extends Error {
  constructor() {
    super('Saving isn’t set up on this server yet. The site needs a database before changes can be saved.');
    this.name = 'ReadOnlyStoreError';
  }
}

function isReadOnly(err: unknown) {
  return READ_ONLY_CODES.has((err as NodeJS.ErrnoException)?.code ?? '');
}

export function isReadOnlyStoreError(err: unknown): err is ReadOnlyStoreError {
  return err instanceof ReadOnlyStoreError;
}

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
  if (READ_ONLY_MODE) return seed()[name];
  try {
    const raw = await fs.readFile(fileFor(name), 'utf8');
    return JSON.parse(raw) as Collections[K];
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code !== 'ENOENT') throw err;
    // First read of this collection: write the seed once, even if several requests arrive together.
    let pending = seeding.get(name) as Promise<Collections[K]> | undefined;
    if (!pending) {
      const initial = seed()[name];
      // If the disk is read-only, serve the seed from memory instead.
      pending = writeAtomic(fileFor(name), initial).then(
        () => initial,
        (e) => {
          if (isReadOnly(e)) return initial;
          throw e;
        },
      );
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
      if (READ_ONLY_MODE) throw new ReadOnlyStoreError();
      const before = await readCollection(name);
      const copy = structuredClone(before);
      const { next, result } = await fn(copy);
      try {
        await writeAtomic(fileFor(name), next);
      } catch (e) {
        if (isReadOnly(e)) throw new ReadOnlyStoreError();
        throw e;
      }
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
  if (READ_ONLY_MODE) throw new ReadOnlyStoreError();
  try {
    await fs.mkdir(UPLOAD_DIR, { recursive: true });
    await fs.writeFile(path.join(UPLOAD_DIR, name), Buffer.from(await file.arrayBuffer()));
  } catch (e) {
    if (isReadOnly(e)) throw new ReadOnlyStoreError();
    throw e;
  }
  return `/uploads/${name}`;
}

export async function readUpload(name: string): Promise<{ data: Buffer; type: string } | null> {
  if (READ_ONLY_MODE || !/^[a-z0-9]+\.(png|jpg)$/.test(name)) return null;
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, name));
    return { data, type: name.endsWith('.png') ? 'image/png' : 'image/jpeg' };
  } catch {
    return null;
  }
}
