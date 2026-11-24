'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState, type FocusEvent, type MouseEvent } from 'react';
import { NAV } from '@/content/nav';
import { ChevronDown, CloseIcon, MenuIcon } from './icons';
import { Logo } from './Logo';

/* One highlight bar per dropdown glides to the item under the pointer or
   keyboard focus, instead of each item flashing its own background. */
function glideTo(e: MouseEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) {
  const item = (e.target as HTMLElement).closest('a');
  const menu = e.currentTarget;
  const bar = menu.querySelector<HTMLElement>('.dd-glide');
  if (!item || !bar) return;
  // If the bar isn't showing yet (menu just opened), place it without sliding.
  const entering = menu.dataset.glide !== 'on' || Number(getComputedStyle(bar).opacity) < 0.5;
  if (entering) bar.style.transition = 'opacity 0.12s ease-out';
  menu.style.setProperty('--glide-y', `${item.offsetTop}px`);
  menu.style.setProperty('--glide-h', `${item.offsetHeight}px`);
  menu.dataset.glide = 'on';
  // Appear in place on entry. Only slide between items once it's showing.
  if (entering) requestAnimationFrame(() => (bar.style.transition = ''));
}

function glideOut(e: MouseEvent<HTMLDivElement> | FocusEvent<HTMLDivElement>) {
  const menu = e.currentTarget;
  const next = 'relatedTarget' in e ? (e.relatedTarget as Node | null) : null;
  if (next && menu.contains(next)) return;
  menu.dataset.glide = 'off';
}

function isIn(pathname: string, match: string) {
  return pathname === match || pathname.startsWith(`${match}/`);
}

export function SiteHeader() {
  const pathname = usePathname() ?? '/';
  const [open, setOpen] = useState(false);

  // Close the mobile menu after navigating.
  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <header className="site-header">
      <div className="wrap site-header__bar">
        <Link href="/" className="brand" aria-label="ML Collective Africa home">
          <Logo className="brand__logo" />
          <span className="brand__text">
            <span className="brand__name">ML Collective Africa</span>
            <span className="brand__sub">A chapter of ML Collective</span>
          </span>
        </Link>

        <nav aria-label="Main" className="main-nav">
          {NAV.map((s) => {
            const current = isIn(pathname, s.match);
            return (
              <div className="dd" key={s.key} data-section={s.key}>
                <Link className="navlink" href={s.href} aria-haspopup="true" aria-current={current ? 'page' : undefined}>
                  {s.label} <ChevronDown />
                </Link>
                <div className="dd-menu" onMouseOver={glideTo} onFocus={glideTo} onMouseLeave={glideOut} onBlur={glideOut}>
                  <span className="dd-glide" aria-hidden="true" />
                  {s.items.map((i) => (
                    <Link key={i.href} href={i.href}>
                      {i.label}
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <Link href="/join" className="nav-join">
            Join
          </Link>
        </nav>

        <button
          type="button"
          className="menu-btn"
          aria-expanded={open}
          aria-controls="mobile-menu"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <CloseIcon /> : <MenuIcon />}
          {open ? 'Close' : 'Menu'}
        </button>
      </div>

      {/* Always rendered so it can slide closed as well as open. Closed, it's inert. */}
      <div className="mobile-menu-wrap" data-open={open} inert={!open}>
        <div>
          <nav id="mobile-menu" aria-label="Main" className="mobile-menu">
            {NAV.map((s) => (
              <div className="mobile-menu__group" key={s.key}>
                <Link href={s.href} className="mobile-menu__top">
                  {s.label}
                </Link>
                {s.items.map((i) => (
                  <Link
                    key={i.href}
                    href={i.href}
                    className="mobile-menu__sub"
                    aria-current={pathname === i.href ? 'page' : undefined}
                  >
                    {i.label}
                  </Link>
                ))}
              </div>
            ))}
            <Link href="/join" className="mobile-menu__join">
              Join the community
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
