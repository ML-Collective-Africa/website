'use client';

import { useEffect, useRef, useState } from 'react';
import { removeAdmin } from '@/lib/actions/admin';

/** Remove button with an inline confirmation, as in the SuperAdmins design. */
export function RemoveAdmin({ id, name }: { id: string; name: string }) {
  const [open, setOpen] = useState(false);
  const dialog = useRef<HTMLDivElement>(null);
  const trigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (open) dialog.current?.querySelector<HTMLButtonElement>('button')?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    trigger.current?.focus();
  };

  return (
    <>
      <button ref={trigger} type="button" className="a-link-danger" aria-label={`Remove ${name}`} onClick={() => setOpen(true)}>
        Remove
      </button>
      {open && (
        <div className="a-overlay" onKeyDown={(e) => e.key === 'Escape' && close()}>
          <div ref={dialog} role="alertdialog" aria-modal="true" aria-labelledby={`rm-${id}`} aria-describedby={`rmd-${id}`} className="a-dialog">
            <h2 id={`rm-${id}`}>Remove {name}?</h2>
            <p id={`rmd-${id}`}>They’ll lose access to admin straight away. Their past changes stay in the activity log.</p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <form action={removeAdmin}>
                <input type="hidden" name="id" value={id} />
                <button type="submit" className="a-btn a-btn--danger-fill">
                  Remove
                </button>
              </form>
              <button type="button" className="a-btn a-btn--ghost" onClick={close}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
