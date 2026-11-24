import Link from 'next/link';
import type { CSSProperties, ReactNode } from 'react';
import { PersonSilhouette } from './icons';

/* Small building blocks shared by the public pages. Styles live in globals.css. */

export function Intro({ title, lead, children, tight }: { title: ReactNode; lead?: ReactNode; children?: ReactNode; tight?: boolean }) {
  return (
    <section className={`wrap intro${tight ? ' intro--tight' : ''}`}>
      {typeof title === 'string' ? <h1 className="h1">{title}</h1> : title}
      {lead && <p className="lead">{lead}</p>}
      {children}
    </section>
  );
}

/** A full width band with a grey top rule. White bands alternate with paper ones. */
export function Band({
  white,
  children,
  id,
  label,
  innerClassName,
}: {
  white?: boolean;
  children: ReactNode;
  id?: string;
  label?: string;
  innerClassName?: string;
}) {
  return (
    <section id={id} aria-label={label} className={`band${white ? ' band--white' : ''}`}>
      <div className={innerClassName ?? 'wrap band__inner'}>{children}</div>
    </section>
  );
}

export function TwoCol({ children }: { children: ReactNode }) {
  return <div className="two-col">{children}</div>;
}

export function Col({ children }: { children: ReactNode }) {
  return <div className="col">{children}</div>;
}

/** The one accent colour block at the bottom of a page. */
export function Banner({
  title,
  cta,
  href,
  variant,
}: {
  title: string;
  cta: string;
  href: string;
  variant?: 'indaba';
}) {
  return (
    <section className={`banner${variant ? ` banner--${variant}` : ''}`}>
      <div className="wrap banner__inner">
        <h2 className="banner__title">{title}</h2>
        <SmartLink href={href} className="banner__cta">
          {cta}
        </SmartLink>
      </div>
    </section>
  );
}

/** Next Link for internal paths, a plain anchor for everything else. */
export function SmartLink({ href, children, ...rest }: { href: string; children: ReactNode; className?: string; style?: CSSProperties }) {
  if (href.startsWith('/')) {
    return (
      <Link href={href} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={href} {...rest}>
      {children}
    </a>
  );
}

export function ButtonLink({
  href,
  children,
  variant = 'fill',
  className,
}: {
  href: string | undefined;
  children: ReactNode;
  variant?: 'fill' | 'outline';
  className?: string;
}) {
  // Links that are still missing from the content are left out rather than shown broken.
  if (!href) return null;
  return (
    <SmartLink href={href} className={`btn btn--${variant}${className ? ` ${className}` : ''}`}>
      {children}
    </SmartLink>
  );
}

export function TextLink({ href, children }: { href: string | undefined; children: ReactNode }) {
  if (!href) return null;
  return (
    <SmartLink href={href} className="text-link">
      {children}
    </SmartLink>
  );
}

export function ArrowLink({ href, children, back }: { href: string; children: ReactNode; back?: boolean }) {
  return (
    <SmartLink href={href} className="arrow-link">
      {back && <span aria-hidden="true">←</span>}
      {children}
      {!back && <span aria-hidden="true">→</span>}
    </SmartLink>
  );
}

export function Tag({ children, strong }: { children: ReactNode; strong?: boolean }) {
  return (
    <span className="tag" style={strong ? { fontWeight: 600 } : undefined}>
      {children}
    </span>
  );
}

export function Avatar({ name, photo, past }: { name: string; photo?: string; past?: boolean }) {
  return (
    <span className={`avatar${past ? ' avatar--past' : ''}`}>
      <span className="avatar__img" role="img" aria-label={`Photo of ${name}`}>
        {photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={photo} alt="" />
        ) : (
          <PersonSilhouette />
        )}
      </span>
    </span>
  );
}

export function PlaceholderMedia({
  label,
  ratio = '4 / 3',
  soft,
  hideLabel,
  children,
}: {
  label: string;
  ratio?: string;
  soft?: boolean;
  /** Keep the label for screen readers only and show just the children. */
  hideLabel?: boolean;
  children?: ReactNode;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`placeholder-media${soft ? ' placeholder-media--soft' : ''}`}
      style={{ aspectRatio: ratio }}
    >
      {children}
      {!hideLabel && <span>{label}</span>}
    </div>
  );
}

/** Text with “quoted titles” set in italics, as in the monthly wins. */
export function WithTitles({ text }: { text: string }) {
  const parts = text.split(/(“[^”]+”)/g);
  return (
    <>
      {parts.map((p, i) => (p.startsWith('“') ? <em key={i}>{p}</em> : <span key={i}>{p}</span>))}
    </>
  );
}
