'use client';

import Link from 'next/link';

/* Shown when an admin change fails, most often because the server can't save
   data yet (for example on Vercel without a database). */
export default function AdminError({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="a-panel" role="alert" style={{ gap: 12 }}>
      <h1 style={{ margin: 0, fontSize: 24, fontWeight: 700 }}>That change couldn’t be saved</h1>
      <p style={{ margin: 0, fontSize: 15, lineHeight: 1.5, color: 'var(--text-2)', maxWidth: 640 }}>
        Nothing was changed on the site. If this keeps happening, the server may not be able to save data yet. On
        hosting like Vercel, admin needs a database connected before changes can be saved.
      </p>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
        <button type="button" className="a-btn" onClick={reset}>
          Try again
        </button>
        <Link href="/admin" className="text-link">
          Back to the dashboard
        </Link>
      </div>
    </div>
  );
}
