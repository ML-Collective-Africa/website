'use client';

import { useNav } from '@payloadcms/ui';
import { useEffect, useRef } from 'react';

/* Payload hides the side menu on any window narrower than 1440px, which is most
   laptops, so people couldn't see where anything was. Between 1025px and 1440px
   the menu fits beside the page, so keep it open, unless this person closed it
   with the menu button themselves. Renders nothing. */

const KEY = 'mlc-admin-nav';
const fits = () => window.innerWidth > 1024 && window.innerWidth <= 1440;

function closedByHand() {
  try {
    return localStorage.getItem(KEY) === 'closed';
  } catch {
    return false;
  }
}

export default function NavOpener() {
  const { hydrated, navOpen, setNavOpen } = useNav();
  const openRef = useRef(navOpen);
  openRef.current = navOpen;

  // Remember only what people choose with the menu button, not Payload's own
  // automatic closing. Capture phase runs before Payload's click handler.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (!(e.target as Element | null)?.closest?.('.nav-toggler') || !fits()) return;
      try {
        localStorage.setItem(KEY, openRef.current ? 'closed' : 'open');
      } catch {
        /* storage blocked */
      }
    };
    document.addEventListener('click', onClick, true);
    return () => document.removeEventListener('click', onClick, true);
  }, []);

  // Payload closes the menu once it has measured the window; open it again.
  useEffect(() => {
    if (hydrated && !navOpen && fits() && !closedByHand()) setNavOpen(true);
  }, [hydrated, navOpen, setNavOpen]);

  return null;
}
