import type { PayloadRequest } from 'payload';

/* Map pins come from placements: each placement names a city and country, and
   this finds that city among the map places or adds it. New cities get their
   coordinates from OpenStreetMap's free lookup (Nominatim). Only the city and
   country are sent. */

/** How two places are compared: "Lagos|Nigeria" and " lagos | NIGERIA" match. */
export function placeKey(city: unknown, country: unknown) {
  const clean = (s: unknown) => String(s ?? '').trim().replace(/\s+/g, ' ').toLowerCase();
  return `${clean(city)}|${clean(country)}`;
}

type Coords = { lat: number; lon: number } | null;

// Remember lookups while the server runs, so a CSV with "Lagos" on 40 rows asks once.
const lookups = new Map<string, Promise<Coords>>();

// Nominatim allows one request a second; queue them.
let queue: Promise<unknown> = Promise.resolve();
function throttled<T>(fn: () => Promise<T>): Promise<T> {
  const run = queue.then(fn, fn);
  queue = run.then(
    () => new Promise((r) => setTimeout(r, 1100)),
    () => new Promise((r) => setTimeout(r, 1100)),
  );
  return run;
}

async function search(params: Record<string, string>): Promise<Coords> {
  const url = new URL('https://nominatim.openstreetmap.org/search');
  for (const [k, v] of Object.entries({ format: 'json', limit: '1', ...params })) url.searchParams.set(k, v);
  const res = await throttled(() =>
    fetch(url, {
      headers: { 'User-Agent': 'mlc-africa-website/1.0 (members map)', 'Accept-Language': 'en' },
      signal: AbortSignal.timeout(8000),
    }),
  );
  if (!res.ok) return null;
  const [hit] = (await res.json()) as { lat: string; lon: string }[];
  return hit ? { lat: Number(Number(hit.lat).toFixed(4)), lon: Number(Number(hit.lon).toFixed(4)) } : null;
}

export function lookUpCoordinates(city: string, country: string): Promise<Coords> {
  const key = placeKey(city, country);
  if (!lookups.has(key)) {
    const p = (async () => {
      try {
        // Ask for the city first; if that finds nothing (for example "Oxford and
        // Cambridge"), try it as free text.
        return (await search({ city, country })) ?? (await search({ q: `${city}, ${country}` }));
      } catch {
        return null;
      }
    })();
    lookups.set(key, p);
    // Don't remember failures for long, in case the lookup service was just down.
    p.then((c) => {
      if (!c) setTimeout(() => lookups.delete(key), 60_000);
    });
  }
  return lookups.get(key)!;
}

/** The id of the map place for this city, adding it if it's new. Null if it can't be found. */
export async function findOrAddPlace(req: PayloadRequest, city: string, country: string) {
  const key = placeKey(city, country);
  const found = await req.payload.find({
    collection: 'places',
    where: { key: { equals: key } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
    req,
  });
  if (found.docs[0]) return found.docs[0].id;

  const coords = await lookUpCoordinates(city, country);
  if (!coords) return null;
  const doc = await req.payload.create({
    collection: 'places',
    data: { city: city.trim(), country: country.trim(), latitude: coords.lat, longitude: coords.lon },
    overrideAccess: true,
    req,
  });
  return doc.id;
}
