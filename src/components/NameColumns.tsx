import type { NameLine } from '@/content/site';

export function NameColumns({ items }: { items: NameLine[] }) {
  return (
    <ul className="name-cols">
      {items.map((p, i) => (
        <li key={`${p.name}-${i}`}>
          <strong>{p.name}</strong>
          {p.lines.map((l) => (
            <span key={l}>{l}</span>
          ))}
        </li>
      ))}
    </ul>
  );
}
