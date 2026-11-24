import { notFound } from 'next/navigation';

/* Any address that doesn't match a page shows the site's 404, inside the site layout.
   notFound() runs in generateMetadata too, before streaming starts, so the status is 404. */
export function generateMetadata() {
  notFound();
}

export default function Missing() {
  notFound();
}
