import type { Metadata } from 'next';
import { ConfirmButton } from '@/components/admin/ConfirmButton';
import { GalleryUpload } from '@/components/admin/GalleryUpload';
import { AdminHead, Panel } from '@/components/admin/ui';
import { deleteGalleryItem } from '@/lib/actions/admin';
import { readCollection } from '@/lib/store';

export const metadata: Metadata = { title: 'Gallery upload' };

export default async function AdminGalleryPage() {
  const items = (await readCollection('gallery')).sort((a, b) => b.order - a.order);
  const events = Array.from(new Set(['Indaba 2026', 'Workshop 2026', 'Indaba 2025', 'Conferences', 'Merch and branding', ...items.map((i) => i.event)]));
  return (
    <>
      <AdminHead
        title="Upload to the gallery"
        sub="Every photo needs a short description so people using screen readers know what’s in it."
      />
      <GalleryUpload events={events} />
      <Panel title={`On the site (${items.length})`}>
        <ul className="a-gallery-list">
          {items.map((i) => (
            <li key={i.id}>
              {i.src ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={i.src} alt="" className="a-thumb" />
              ) : (
                <span className="a-thumb a-thumb--empty">{i.video ? 'Video' : 'No photo'}</span>
              )}
              <span className="stack-8" style={{ gap: 2, minWidth: 0 }}>
                <strong style={{ fontSize: 15 }}>{i.caption || i.alt}</strong>
                <span style={{ fontSize: 13, color: 'var(--text-2)' }}>{i.event}</span>
              </span>
              <form action={deleteGalleryItem}>
                <input type="hidden" name="id" value={i.id} />
                <ConfirmButton message="Remove this from the gallery? You can undo it from Activity." className="a-btn a-btn--ghost a-btn--sm">
                  Remove
                </ConfirmButton>
              </form>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  );
}
