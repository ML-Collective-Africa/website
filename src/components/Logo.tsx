/* The ML Collective logo, from https://mlcollective.org/logo/ (mlc_logo.svg).
   It lives in public/logo.svg and is drawn at 33 by 44, portrait. */
export function Logo({ className }: { className?: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src="/logo.svg" alt="" width={33} height={44} className={className} />;
}
