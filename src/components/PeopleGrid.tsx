import type { Person } from '@/lib/types';
import { Avatar } from './ui';

export function PeopleGrid({ people, past }: { people: Person[]; past?: boolean }) {
  return (
    <ul className="people">
      {people.map((p) => (
        <li key={p.id}>
          <Avatar name={p.name} photo={p.photo} past={past} />
          <span className="people__name">{p.name}</span>
          <span className="people__role">{past && p.years ? `${p.role}, ${p.years}` : p.role}</span>
          {p.link && <a href={p.link}>{p.linkLabel || 'Profile'}</a>}
        </li>
      ))}
    </ul>
  );
}
