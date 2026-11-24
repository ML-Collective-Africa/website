/* Shown on the admin sign-in page. */
export default function Logo() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src="/logo.svg" alt="" width={36} height={48} />
      <span style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.15 }}>
        <span style={{ fontWeight: 700, fontSize: 20, color: 'var(--mlc-ink)' }}>ML Collective Africa</span>
        <span style={{ fontWeight: 500, fontSize: 13, color: 'var(--mlc-muted)' }}>Website admin</span>
      </span>
    </div>
  );
}
