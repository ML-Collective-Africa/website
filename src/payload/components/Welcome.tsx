'use client';

import { useAuth } from '@payloadcms/ui';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { OPEN_INVITE } from './InviteAdmin';

/* Top of the admin dashboard: a nudge to set a personal password, then the
   common jobs as big buttons that open the right form straight away, so nobody
   has to hunt through the menu. Colours match each section of the website. */

type Task = { title: string; hint: string; href: string; colour: string; superOnly?: boolean };

const TASKS: Task[] = [
  {
    title: 'Post an announcement',
    hint: 'The banner under the homepage hero',
    href: '/admin/collections/announcements/create',
    colour: '#971af7',
  },
  {
    title: 'Update “This week”',
    hint: 'The sessions box on the homepage',
    href: '/admin/globals/this-week',
    colour: '#971af7',
  },
  {
    title: 'Add a month’s wins',
    hint: 'One entry per month',
    href: '/admin/collections/wins-months/create',
    colour: '#47454f',
  },
  {
    title: 'Add a reading list',
    hint: 'One entry per month',
    href: '/admin/collections/reading-months/create',
    colour: '#1d4ed8',
  },
  {
    title: 'Add a placement',
    hint: 'Internship, grad school or fellowship. Also puts them on the map',
    href: '/admin/collections/placements/create',
    colour: '#00794a',
  },
  {
    title: 'Add a showcase session',
    hint: 'Research showcase talks, on a Sunday',
    href: '/admin/collections/showcase/create',
    colour: '#47454f',
  },
  {
    title: 'Add an organiser',
    hint: 'Organisers, advisors and Torchbearers',
    href: '/admin/collections/people/create',
    colour: '#a3157a',
  },
  {
    title: 'Invite an admin',
    hint: 'You get a message with a temporary password to send them',
    href: '/admin/collections/users/create',
    colour: '#57545f',
    superOnly: true,
  },
];

export default function Welcome() {
  const { user } = useAuth<{ name?: string; mustChangePassword?: boolean; role?: string }>();
  const first = user?.name?.split(' ')[0];
  const [waiting, setWaiting] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/submissions?where[status][equals]=new&limit=0&depth=0', { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setWaiting(typeof d?.totalDocs === 'number' ? d.totalDocs : null))
      .catch(() => setWaiting(null));
  }, []);

  const tasks = TASKS.filter((t) => !t.superOnly || user?.role === 'super-admin');

  return (
    <div className="mlc-welcome">
      {user?.mustChangePassword && (
        <div className="mlc-welcome__alert" role="alert">
          <strong>You’re using a temporary password.</strong> Set your own on{' '}
          <Link href="/admin/account">your account page</Link> before you do anything else.
        </div>
      )}

      <h2 className="mlc-welcome__title">{first ? `Hello, ${first}` : 'Hello'}</h2>
      <p className="mlc-welcome__text">What would you like to do? Changes go live on the website within a few seconds.</p>

      <Link
        href="/admin/collections/submissions?where[status][equals]=new"
        className={`mlc-review${waiting ? ' mlc-review--waiting' : ''}`}
      >
        <span className="mlc-review__count">{waiting ?? '–'}</span>
        <span>
          <strong className="mlc-review__title">
            {waiting === 1 ? 'Research submission to review' : 'Research submissions to review'}
          </strong>
          <span className="mlc-review__hint">
            {waiting ? 'Open one and set it to Approved to publish it, or Declined.' : 'Nothing waiting right now.'}
          </span>
        </span>
        <span className="mlc-review__arrow" aria-hidden="true">→</span>
      </Link>

      <ul className="mlc-tasks">
        {tasks.map((t) => {
          const inner = (
            <>
              <span className="mlc-task__title">
                {t.title}
                <span className="mlc-task__plus" aria-hidden="true">+</span>
              </span>
              <span className="mlc-task__hint">{t.hint}</span>
            </>
          );
          const style = { '--task': t.colour } as React.CSSProperties;
          return (
            <li key={t.href}>
              {t.superOnly ? (
                // Opens the invite box in the top bar (InviteAdmin.tsx).
                <button type="button" className="mlc-task" style={style} onClick={() => window.dispatchEvent(new Event(OPEN_INVITE))}>
                  {inner}
                </button>
              ) : (
                <Link href={t.href} className="mlc-task" style={style}>
                  {inner}
                </Link>
              )}
            </li>
          );
        })}
      </ul>

      <p className="mlc-welcome__more">Everything else is listed below and in the menu on the left.</p>
    </div>
  );
}
