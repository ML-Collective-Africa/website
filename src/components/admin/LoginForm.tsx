'use client';

import { useActionState } from 'react';
import { signIn, type FormState } from '@/lib/actions/admin';

export function LoginForm() {
  const [state, action, pending] = useActionState<FormState, FormData>(signIn, {});
  return (
    <form action={action} className="stack-8" style={{ gap: 14 }}>
      {state.error && (
        <div role="alert" className="a-notice a-notice--error">
          {state.error}
        </div>
      )}
      <div className="a-field">
        <label htmlFor="em" className="a-field__label">
          Email
        </label>
        <input
          id="em"
          name="email"
          type="email"
          autoComplete="username"
          required
          className="a-input"
          defaultValue={state.email}
          key={state.email ?? ''}
        />
      </div>
      <div className="a-field">
        <label htmlFor="pw" className="a-field__label">
          Password
        </label>
        <input id="pw" name="password" autoFocus={Boolean(state.error)} type="password" autoComplete="current-password" required className="a-input" />
      </div>
      <button type="submit" className="a-btn a-btn--lg" disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <p style={{ margin: 0, fontSize: 14, color: 'var(--text-2)' }}>Forgot your password? Ask the admin to reset it.</p>
    </form>
  );
}
