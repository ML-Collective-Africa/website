'use client';

import { useState } from 'react';
import { declineSubmission } from '@/lib/actions/admin';

export function DeclineBox({ id, firstName }: { id: string; firstName: string }) {
  const [open, setOpen] = useState(false);
  if (!open) {
    return (
      <button type="button" className="a-btn a-btn--danger" onClick={() => setOpen(true)}>
        Decline
      </button>
    );
  }
  return (
    <form action={declineSubmission} className="stack-8">
      <input type="hidden" name="id" value={id} />
      <label htmlFor="why" className="a-field__label">
        Note why, for the team
      </label>
      <span className="a-field__hint">Only admins see this. Use it when you write to {firstName}.</span>
      <textarea id="why" name="reason" rows={4} className="a-textarea" autoFocus />
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button type="submit" className="a-btn a-btn--danger">
          Decline
        </button>
        <button type="button" className="a-btn a-btn--ghost" onClick={() => setOpen(false)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
