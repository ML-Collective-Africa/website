'use client';

import { useAuth } from '@payloadcms/ui';
import { useEffect, useRef, useState } from 'react';

/* "Invite an admin" in the top bar, for super admins. It adds the account with a
   temporary password made here, then shows a message to copy into WhatsApp or
   email. The new admin is asked to set their own password when they sign in
   (see the Users collection). No email service needed. */

export const OPEN_INVITE = 'mlc:invite-admin';

// No look-alike characters (0/O, 1/l/I), in three groups so it's easy to type.
function temporaryPassword() {
  const chars = 'abcdefghjkmnpqrstuvwxyz23456789';
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  const s = Array.from(bytes, (b) => chars[b % chars.length]).join('');
  return `${s.slice(0, 4)}-${s.slice(4, 8)}-${s.slice(8)}`;
}

type Sent = { name: string; email: string; password: string; role: string };

export default function InviteAdmin() {
  const { user } = useAuth<{ role?: string }>();
  const dialog = useRef<HTMLDialogElement>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState<Sent | null>(null);
  const [copied, setCopied] = useState(false);

  const open = () => {
    setError('');
    setSent(null);
    setCopied(false);
    dialog.current?.showModal();
  };

  // The dashboard's "Add an admin" card opens this too.
  useEffect(() => {
    window.addEventListener(OPEN_INVITE, open);
    return () => window.removeEventListener(OPEN_INVITE, open);
  }, []);

  if (user?.role !== 'super-admin') return null;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const name = String(form.get('name') ?? '').trim();
    const email = String(form.get('email') ?? '').trim();
    const role = String(form.get('role') ?? 'editor');
    const password = temporaryPassword();
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/users', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, role, password }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg: string = body?.errors?.[0]?.data?.errors?.[0]?.message || body?.errors?.[0]?.message || '';
        setError(
          /email/i.test(msg) && /(unique|already|registered|taken)/i.test(msg)
            ? 'There’s already an admin with that email.'
            : msg || 'Couldn’t add them. Check the details and try again.',
        );
        return;
      }
      setSent({ name, email, password, role });
    } catch {
      setError('Couldn’t reach the site. Check your connection and try again.');
    } finally {
      setBusy(false);
    }
  }

  const message = sent
    ? [
        `Hi ${sent.name.split(' ')[0]}, I’ve added you as ${sent.role === 'super-admin' ? 'a super admin' : 'an editor'} on the MLC Africa website.`,
        ``,
        `Sign in here: ${window.location.origin}/admin`,
        `Email: ${sent.email}`,
        `Temporary password: ${sent.password}`,
        ``,
        `You’ll be asked to set your own password once you’re in.`,
      ].join('\n')
    : '';

  async function copy() {
    try {
      await navigator.clipboard.writeText(message);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  }

  return (
    <>
      <button type="button" className="mlc-invite-button" onClick={open}>
        <span aria-hidden="true">+</span> Invite an admin
      </button>

      <dialog ref={dialog} className="mlc-invite" aria-labelledby="mlc-invite-title" onClose={() => setSent(null)}>
        <button type="button" className="mlc-invite__close" aria-label="Close" onClick={() => dialog.current?.close()}>
          ×
        </button>

        {!sent ? (
          <form onSubmit={submit}>
            <h2 id="mlc-invite-title" className="mlc-invite__title">
              Invite an admin
            </h2>
            <p className="mlc-invite__text">
              You’ll get a message with a temporary password to send them. They choose their own password when they first
              sign in.
            </p>
            <label className="mlc-invite__field">
              <span>Name</span>
              <input name="name" required autoComplete="off" />
            </label>
            <label className="mlc-invite__field">
              <span>Email</span>
              <input name="email" type="email" required autoComplete="off" />
            </label>
            <fieldset className="mlc-invite__roles">
              <legend>What can they do?</legend>
              <label>
                <input type="radio" name="role" value="editor" defaultChecked />
                <span>
                  <strong>Editor</strong>
                  <small>Add and change everything on the website.</small>
                </span>
              </label>
              <label>
                <input type="radio" name="role" value="super-admin" />
                <span>
                  <strong>Super admin</strong>
                  <small>Everything an editor can do, plus invite and remove admins.</small>
                </span>
              </label>
            </fieldset>
            {error && (
              <p className="mlc-invite__error" role="alert">
                {error}
              </p>
            )}
            <button type="submit" className="mlc-invite__submit" disabled={busy}>
              {busy ? 'Adding…' : 'Add them'}
            </button>
          </form>
        ) : (
          <div>
            <h2 id="mlc-invite-title" className="mlc-invite__title">
              {sent.name} has been added
            </h2>
            <p className="mlc-invite__text">
              Send them this message, on WhatsApp or by email. The password isn’t shown again, so copy it now.
            </p>
            <pre className="mlc-invite__message">{message}</pre>
            <div className="mlc-invite__actions">
              <button type="button" className="mlc-invite__submit" onClick={copy}>
                {copied ? 'Copied' : 'Copy message'}
              </button>
              <button type="button" className="mlc-invite__secondary" onClick={() => dialog.current?.close()}>
                Done
              </button>
            </div>
          </div>
        )}
      </dialog>
    </>
  );
}
