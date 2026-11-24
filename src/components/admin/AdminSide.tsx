'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Item = { label: string; href?: string; badge?: number };
type Group = { title?: string; items: Item[] };

/** Items without an href are on the roadmap but have no screen yet. */
export function AdminSide({ waiting, isSuper }: { waiting: number; isSuper: boolean }) {
  const pathname = usePathname() ?? '';
  const groups: Group[] = [
    { items: [{ label: 'Dashboard', href: '/admin' }, { label: 'Inbox', href: '/admin/inbox', badge: waiting }] },
    { title: 'Research', items: [{ label: 'Published papers', href: '/admin/papers' }, { label: 'Products' }, { label: 'Focus groups' }] },
    {
      title: 'Programmes',
      items: [{ label: 'This week' }, { label: 'Reading groups', href: '/admin/reading' }, { label: 'CS197 cohort' }, { label: 'Mentorship' }, { label: 'Internships' }],
    },
    {
      title: 'Life at MLC Africa',
      items: [{ label: 'Research showcase' }, { label: 'Monthly wins', href: '/admin/wins' }, { label: 'Gallery', href: '/admin/gallery' }],
    },
    { title: 'Initiatives', items: [{ label: 'Indaba' }, { label: 'Fundraisers' }, { label: 'Sponsors' }] },
    { title: 'Team', items: [{ label: 'People', href: '/admin/people' }, { label: 'Activity', href: '/admin/activity' }] },
  ];
  if (isSuper) {
    groups.push({ title: 'Super admin', items: [{ label: 'Admins', href: '/admin/admins' }, { label: 'Add an admin', href: '/admin/admins/new' }] });
  }

  const active = groups
    .flatMap((g) => g.items)
    .map((i) => i.href)
    .filter((h): h is string => Boolean(h) && (pathname === h || (h !== '/admin' && pathname.startsWith(`${h}/`))))
    .sort((a, b) => b.length - a.length)[0];

  return (
    <nav aria-label="Admin" className="admin-side">
      {groups.map((g, gi) => (
        <div key={gi} className="admin-side__group">
          {g.title && <span className="admin-side__title">{g.title}</span>}
          {g.items.map((i) =>
            i.href ? (
              <Link key={i.label} href={i.href} aria-current={i.href === active ? 'page' : undefined} className="admin-side__link">
                {i.label}
                {Boolean(i.badge) && (
                  <span className="admin-side__badge" aria-label={`${i.badge} waiting`}>
                    {i.badge}
                  </span>
                )}
              </Link>
            ) : (
              <span key={i.label} className="admin-side__link admin-side__link--soon" aria-disabled="true">
                {i.label}
                <span className="admin-side__soon">Soon</span>
              </span>
            ),
          )}
        </div>
      ))}
    </nav>
  );
}
