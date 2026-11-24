'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { NAV } from '@/content/nav';
import { ChevronDown, CloseIcon, MenuIcon } from './icons';
import { Logo } from './Logo';

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
                <div className="dd-menu">
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
