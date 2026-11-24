import Link from 'next/link';
import type { ReactNode } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from './icons';

/* Round 44px buttons in the order « ‹ 1 2 3 › », with "Page X of Y" below.
   Pass hrefFor for server-rendered lists (links), or onPage inside client components. */

type Props = {
  label: string;
  page: number;
  pages: number;
  hrefFor?: (n: number) => string;
  onPage?: (n: number) => void;
};

export function Pager({ label, page, pages, hrefFor, onPage }: Props) {
  if (pages <= 1) return null;
  const noPrev = page <= 1;
  const noNext = page >= pages;

  const Btn = ({ n, aria, disabled, current, children }: { n: number; aria: string; disabled?: boolean; current?: boolean; children: ReactNode }) => {
    if (onPage) {
      return (
        <button
          type="button"
          className="pg"
          aria-label={aria}
          aria-current={current ? 'page' : undefined}
          disabled={disabled}
          onClick={() => onPage(n)}
        >
          {children}
        </button>
      );
    }
    if (disabled) {
      return (
        <span className="pg" aria-label={aria} aria-disabled="true" role="link">
          {children}
        </span>
      );
    }
    return (
      <Link className="pg" href={hrefFor ? hrefFor(n) : `?page=${n}`} aria-label={aria} aria-current={current ? 'page' : undefined} scroll={false}>
        {children}
      </Link>
    );
  };

  return (
    <nav aria-label={label} className="pager">
      <div className="pager__buttons">
        <Btn n={1} aria="First page" disabled={noPrev}>
          <ChevronsLeft />
        </Btn>
        <Btn n={page - 1} aria="Previous page" disabled={noPrev}>
          <ChevronLeft />
        </Btn>
        {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
          <Btn key={n} n={n} aria={`Page ${n}`} current={n === page}>
            {n}
          </Btn>
        ))}
        <Btn n={page + 1} aria="Next page" disabled={noNext}>
          <ChevronRight />
        </Btn>
        <Btn n={pages} aria="Last page" disabled={noNext}>
          <ChevronsRight />
        </Btn>
      </div>
      <span className="pager__label">
        Page {page} of {pages}
      </span>
    </nav>
  );
}
