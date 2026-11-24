type P = { size?: number };

export function ChevronDown({ size = 12 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 4.5l3 3 3-3" />
    </svg>
  );
}

export function ChevronLeft({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M10 4L6 8l4 4" />
    </svg>
  );
}

export function ChevronRight({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 4l4 4-4 4" />
    </svg>
  );
}

export function ChevronsLeft({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M8 4L4 8l4 4M12 4L8 8l4 4" />
    </svg>
  );
}

export function ChevronsRight({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M4 4l4 4-4 4M8 4l4 4-4 4" />
    </svg>
  );
}

export function ExternalIcon({ size = 14 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.7" aria-hidden="true">
      <path d="M5 2h7v7M12 2L4.5 9.5M10 8.5V12H2V4h3.5" />
    </svg>
  );
}

export function MenuIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 4h12M2 8h12M2 12h12" />
    </svg>
  );
}

export function CloseIcon({ size = 16 }: P) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 3l10 10M13 3L3 13" />
    </svg>
  );
}

export function ListIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M1 3h12M1 7h12M1 11h12" />
    </svg>
  );
}

export function GridIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="1" y="1" width="5" height="5" />
      <rect x="8" y="1" width="5" height="5" />
      <rect x="1" y="8" width="5" height="5" />
      <rect x="8" y="8" width="5" height="5" />
    </svg>
  );
}

export function NotesIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M3 1.5h5l3 3v8H3z M8 1.5v3h3 M5 7.5h4 M5 10h4" />
    </svg>
  );
}

export function CheckIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M5 11.5l4 4 8-9" />
    </svg>
  );
}

export function PlayIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="#FFFFFF" aria-hidden="true">
      <path d="M6 4l10 6-10 6z" />
    </svg>
  );
}

export function PersonSilhouette() {
  return (
    <svg width="78%" height="78%" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="12" cy="9" r="4.6" />
      <path d="M2.5 24c0-5.6 4.3-9.2 9.5-9.2s9.5 3.6 9.5 9.2z" />
    </svg>
  );
}
