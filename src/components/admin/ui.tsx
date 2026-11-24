import Link from 'next/link';
import type { ReactNode } from 'react';

export function AdminHead({ title, sub, action, crumbs }: { title: string; sub?: ReactNode; action?: ReactNode; crumbs?: { label: string; href?: string }[] }) {
  return (
    <>
      {crumbs && (
        <nav aria-label="Breadcrumb" className="a-crumbs">
          {crumbs.map((c, i) => (
            <span key={c.label}>
              {i > 0 && <span aria-hidden="true"> › </span>}
              {c.href ? <Link href={c.href}>{c.label}</Link> : <span aria-current="page">{c.label}</span>}
            </span>
          ))}
        </nav>
      )}
      <div className="a-head">
        <div className="a-head__text">
          <h1>{title}</h1>
          {sub && <p>{sub}</p>}
        </div>
        {action}
      </div>
    </>
  );
}

export function Panel({ title, children, className }: { title?: ReactNode; children: ReactNode; className?: string }) {
  return (
    <section className={`a-panel${className ? ` ${className}` : ''}`}>
      {title && <h2 className="a-panel__title">{title}</h2>}
      {children}
    </section>
  );
}

export function Field({
  label,
  id,
  hint,
  required,
  error,
  children,
}: {
  label: ReactNode;
  id: string;
  hint?: string;
  required?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div className="a-field">
      <label htmlFor={id} className="a-field__label">
        {label} {required && <span className="a-req">(required)</span>}
      </label>
      {hint && (
        <span id={`${id}-h`} className="a-field__hint">
          {hint}
        </span>
      )}
      {error && <span className="a-field__error">{error}</span>}
      {children}
    </div>
  );
}

export function Pill({ tone, children }: { tone: 'ok' | 'muted' | 'purple' | 'warn'; children: ReactNode }) {
  return <span className={`a-pill a-pill--${tone}`}>{children}</span>;
}

export function Notice({ tone = 'ok', children }: { tone?: 'ok' | 'error' | 'info'; children: ReactNode }) {
  return (
    <div role={tone === 'error' ? 'alert' : 'status'} className={`a-notice a-notice--${tone}`}>
      {children}
    </div>
  );
}
