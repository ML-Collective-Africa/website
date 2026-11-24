'use client';

import { useField } from '@payloadcms/ui';

/* Shown on a placement whose city couldn't be found for the map. */
export default function MapStatus({ path }: { path: string }) {
  const { value } = useField<string>({ path });
  if (!value) return null;
  return (
    <div className="mlc-map-status" role="status">
      <strong>Not on the map yet.</strong> {value}
    </div>
  );
}
