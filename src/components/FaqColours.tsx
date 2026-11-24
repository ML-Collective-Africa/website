'use client';

import { useRef, type MouseEvent, type ReactNode } from 'react';

/* Each time the pointer moves onto a question, it picks a hover colour at random
   from the site's section colours, never the same one twice in a row. All of them
   pass AA contrast on white. */
const PALETTE = ['#A3157A', '#1E3A6E', '#1D4ED8', '#00794A', '#7A12CC'];

export function FaqColours({ className, children }: { className?: string; children: ReactNode }) {
  const current = useRef<HTMLElement | null>(null);
  const last = useRef('');

  const onOver = (e: MouseEvent<HTMLDivElement>) => {
    const summary = (e.target as HTMLElement).closest('summary');
    if (!summary || summary === current.current) return;
    current.current = summary;
    const choices = PALETTE.filter((c) => c !== last.current);
    const colour = choices[Math.floor(Math.random() * choices.length)];
    last.current = colour;
    summary.style.setProperty('--faq-hover', colour);
  };

  const onOut = (e: MouseEvent<HTMLDivElement>) => {
    const next = e.relatedTarget as Node | null;
    if (current.current && !(next && current.current.contains(next))) current.current = null;
  };

  return (
    <div className={className} onMouseOver={onOver} onMouseOut={onOut}>
      {children}
    </div>
  );
}
