'use client';

import type { ReactNode } from 'react';

/** A submit button that asks first. Used for deletes and removals. */
export function ConfirmButton({ message, children, className }: { message: string; children: ReactNode; className?: string }) {
  return (
    <button
      type="submit"
      className={className ?? 'a-btn a-btn--danger'}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
    >
      {children}
    </button>
  );
}
