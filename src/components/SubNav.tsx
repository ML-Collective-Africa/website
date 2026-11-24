'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SUBNAV, sectionByKey, type SectionKey } from '@/content/nav';

/** Section subnav. The current page gets the section accent underline. */
export function SubNav({ section, current }: { section: SectionKey; current?: string }) {
  const pathname = usePathname() ?? '';
  const items = SUBNAV[section];
  const s = sectionByKey(section);
  // The longest matching href wins, so /research/papers/x marks Published research.
  const active =
    current ??
    items
      .map((i) => i.href)
      .filter((h) => pathname === h || pathname.startsWith(`${h}/`))
      .sort((a, b) => b.length - a.length)[0];

  return (
    <div className="subnav">
      <nav aria-label={`${s.label} pages`} className="wrap subnav__nav">
        <span className="subnav__label">{s.label}</span>
        {items.map((i) => (
          <Link key={i.href} href={i.href} aria-current={i.href === active ? 'page' : undefined}>
            {i.label}
          </Link>
        ))}
      </nav>
    </div>
  );
}
