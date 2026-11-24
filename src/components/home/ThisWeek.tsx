'use client';

import Link from 'next/link';
import { useEffect, useId, useState } from 'react';
import { LINKS } from '@/content/links';
import type { Session } from '@/content/site';

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const OPTIONS = [
  { value: 'wat', label: 'WAT, Lagos' },
  { value: 'gmt', label: 'GMT, Accra' },
  { value: 'cat', label: 'CAT, Johannesburg' },
  { value: 'eat', label: 'EAT, Nairobi' },
  { value: 'local', label: 'My time zone' },
] as const;
type Zone = (typeof OPTIONS)[number]['value'];

const FIXED: Record<Exclude<Zone, 'local'>, number> = { wat: 1, gmt: 0, cat: 2, eat: 3 };
const LABELS: Record<Exclude<Zone, 'local'>, string> = {
  wat: 'West Africa Time (Lagos, Kinshasa)',
  gmt: 'GMT (Accra, Dakar)',
  cat: 'Central Africa Time (Johannesburg, Harare)',
  eat: 'East Africa Time (Nairobi, Addis Ababa)',
};

function localOffset() {
  return -new Date().getTimezoneOffset() / 60;
}

/** Move a WAT day and hour into another UTC offset. */
function shift(day: number, hour: number, offset: number) {
  const total = day * 24 + hour + (offset - 1);
  const t = ((total % 168) + 168) % 168;
  const d = Math.floor(t / 24);
  const hf = t - d * 24;
  const h = Math.floor(hf);
  const m = Math.round((hf - h) * 60);
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return { day: DAYS[d], time: `${h12}${m ? `:${String(m).padStart(2, '0')}` : ''}${h < 12 ? 'am' : 'pm'}` };
}

export function ThisWeek({ sessions, compact }: { sessions: Session[]; compact?: boolean }) {
  const id = useId();
  const [zone, setZone] = useState<Zone>('wat');
  const [local, setLocal] = useState({ offset: 1, place: 'your time zone' });

  useEffect(() => {
    let place = 'your time zone';
    try {
      place = Intl.DateTimeFormat().resolvedOptions().timeZone.split('/').pop()!.replace(/_/g, ' ');
    } catch {
      /* keep the generic label */
    }
    setLocal({ offset: localOffset(), place });
  }, []);

  const offset = zone === 'local' ? local.offset : FIXED[zone];
  const sign = local.offset >= 0 ? '+' : '−';
  const note =
    zone === 'wat'
      ? 'Times are in West Africa Time. Pick your zone to convert them.'
      : `Showing times in ${zone === 'local' ? `your time zone, ${local.place} (UTC${sign}${Math.abs(local.offset)})` : LABELS[zone]}.`;

  const select = (
    <select id={id} className="week__select" value={zone} onChange={(e) => setZone(e.target.value as Zone)}>
      {OPTIONS.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  );

  return (
    <aside aria-labelledby={`${id}-h`} className={`week${compact ? ' week--compact' : ''}`}>
      <div className="week__head">
        <h2 id={`${id}-h`} className="week__title">
          This week
        </h2>
        <label htmlFor={id} className="week__label week__label--inline">
          Show times in
          {select}
        </label>
      </div>
      <p aria-live="polite" className="week__note">
        {note}
      </p>
      <ol className="week__list">
        {sessions.map((s) => {
          const t = shift(s.day, s.hour, offset);
          return (
            <li key={s.name} className="week__item">
              <div className="week__when">
                <span className="week__day">{t.day}</span>
                <span className="week__time">{t.time}</span>
              </div>
              <div className="week__what">
                <span className="week__name">{s.name}</span>
                <span className="week__detail">{s.detail}</span>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="week__foot">
        <a href={LINKS.calendar}>
          Add the MLC calendar<span className="sr-only"> (opens external site)</span>
        </a>
        <Link href="/programmes">How each session works</Link>
      </div>
    </aside>
  );
}
