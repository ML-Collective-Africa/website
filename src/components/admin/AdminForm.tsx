'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { addAdmin, updateAdmin, type FormState } from '@/lib/actions/admin';
import type { AdminRole } from '@/lib/types';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

const ROLES: { label: AdminRole; desc: string; edits: string }[] = [
  { label: 'Super admin', desc: 'Everything, including adding and removing admins.', edits: 'everything, including admins' },
  { label: 'Admin', desc: 'All website content, but not admins.', edits: 'all website content' },
];

type Existing = { id: string; name: string; email: string; role: AdminRole };

export function AdminForm({ existing }: { existing?: Existing }) {
  const [state, action, pending] = useActionState<FormState, FormData>(existing ? updateAdmin : addAdmin, {});
  const onSubmit = useKeepValues(action);
  const [role, setRole] = useState<AdminRole>(existing?.role ?? 'Admin');
  const r = ROLES.find((x) => x.label === role)!;

  if (state.message && !existing) {
    return (
      <div role="status" className="a-notice a-notice--ok" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
        <span style={{ fontWeight: 600, color: 'var(--ok-dark)' }}>{state.message}</span>
        {state.secret && <TempPassword value={state.secret} />}
        <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
          <Link href="/admin/admins" className="text-link">
            Back to admins
          </Link>
          <button
            type="button"
            className="a-btn a-btn--ghost a-btn--sm"
            // A fresh page load clears the form and the temporary password.
            onClick={() => window.location.reload()}
          >
            Add another
          </button>
        </div>
      </div>
    );
  }

  return (
    <form method="post" onSubmit={onSubmit} className="stack-8" style={{ gap: 20 }}>
      {existing && <input type="hidden" name="id" value={existing.id} />}
      {state.error && (
        <div role="alert" className="a-notice a-notice--error">
          {state.error}
        </div>
      )}
      {state.message && existing && (
        <div role="status" className="a-notice a-notice--ok" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: 12 }}>
          <span style={{ fontWeight: 600, color: 'var(--ok-dark)' }}>{state.message}</span>
          {state.secret && <TempPassword value={state.secret} />}
        </div>
      )}
      <Panel>
        <div className="a-grid a-grid--260">
          <Field label="Full name" id="nm">
            {existing ? (
              <input id="nm" type="text" value={existing.name} readOnly className="a-input" />
            ) : (
              <input id="nm" name="name" type="text" required className="a-input" />
            )}
          </Field>
          <Field label="Email" id="ea">
            {existing ? (
              <input id="ea" type="email" value={existing.email} readOnly className="a-input" />
            ) : (
              <input id="ea" name="email" type="email" required className="a-input" />
            )}
          </Field>
        </div>
        <fieldset className="fieldset">
          <legend className="a-field__label" style={{ marginBottom: 6 }}>
            Role
          </legend>
          {ROLES.map((x) => (
            <label key={x.label} className="a-role" data-on={x.label === role}>
              <input type="radio" name="role" value={x.label} checked={x.label === role} onChange={() => setRole(x.label)} />
              <span className="stack-8" style={{ gap: 2 }}>
                <span style={{ fontWeight: 600 }}>{x.label}</span>
                <span style={{ fontSize: 14, color: 'var(--text-2)' }}>{x.desc}</span>
              </span>
            </label>
          ))}
        </fieldset>
        {existing && (
          <label className="a-check">
            <input type="checkbox" name="reset" /> Reset their password and show me a new temporary one
          </label>
        )}
        <p style={{ margin: 0, fontSize: 15 }}>
          <strong>They’ll be able to edit:</strong> {r.edits}
        </p>
        <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <button type="submit" className="a-btn" disabled={pending}>
            {existing ? 'Save' : 'Add admin'}
          </button>
          <Link href="/admin/admins" className="text-link">
            Cancel
          </Link>
        </div>
        {!existing && (
          <p className="a-help">You’ll get a temporary password to send them. They can sign in with it straight away.</p>
        )}
      </Panel>
    </form>
  );
}

function TempPassword({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="stack-8" style={{ gap: 6 }}>
      <span style={{ fontSize: 14 }}>Temporary password. Send it to them privately. It won’t be shown again.</span>
      <span style={{ display: 'flex', gap: 10, alignItems: 'center', flexWrap: 'wrap' }}>
        <code className="a-secret">{value}</code>
        <button
          type="button"
          className="a-btn a-btn--ghost a-btn--sm"
          onClick={async () => {
            await navigator.clipboard.writeText(value);
            setCopied(true);
          }}
        >
          {copied ? 'Copied' : 'Copy'}
        </button>
      </span>
    </div>
  );
}
