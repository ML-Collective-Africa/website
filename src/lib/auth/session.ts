/* Signed session cookie. Uses Web Crypto only, so it also runs in middleware. */

export const SESSION_COOKIE = 'mlc_admin';
export const SESSION_DAYS = 7;

type Payload = { uid: string; exp: number };

function secret(): string {
  const s = process.env.SESSION_SECRET;
  if (s && s.length >= 16) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set to a random string of at least 16 characters.');
  }
  return 'dev-only-session-secret-change-me';
}

const enc = new TextEncoder();

function b64url(bytes: Uint8Array): string {
  let s = '';
  for (const b of bytes) s += String.fromCharCode(b);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

function fromB64url(s: string): Uint8Array<ArrayBuffer> {
  const pad = s.replace(/-/g, '+').replace(/_/g, '/') + '==='.slice((s.length + 3) % 4);
  const bin = atob(pad);
  return Uint8Array.from(bin, (c) => c.charCodeAt(0));
}

async function key() {
  return crypto.subtle.importKey('raw', enc.encode(secret()), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}

export async function signSession(uid: string): Promise<{ value: string; expires: Date }> {
  const exp = Date.now() + SESSION_DAYS * 86400000;
  const payload: Payload = { uid, exp };
  const body = b64url(enc.encode(JSON.stringify(payload)));
  const sig = new Uint8Array(await crypto.subtle.sign('HMAC', await key(), enc.encode(body)));
  return { value: `${body}.${b64url(sig)}`, expires: new Date(exp) };
}

export async function verifySession(value: string | undefined): Promise<Payload | null> {
  if (!value) return null;
  const [body, sig] = value.split('.');
  if (!body || !sig) return null;
  try {
    const ok = await crypto.subtle.verify('HMAC', await key(), fromB64url(sig), enc.encode(body));
    if (!ok) return null;
    const payload = JSON.parse(new TextDecoder().decode(fromB64url(body))) as Payload;
    if (typeof payload.uid !== 'string' || typeof payload.exp !== 'number' || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}
