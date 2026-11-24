'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { savePerson, type FormState } from '@/lib/actions/admin';
import type { Person, PersonGroup } from '@/lib/types';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

export function PersonForm({ person, group }: { person?: Person; group: PersonGroup }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePerson, {});
  const onSubmit = useKeepValues(action);
  const [g, setG] = useState<PersonGroup>(person?.group ?? group);
  return (
    <form method="post" onSubmit={onSubmit} className="a-edit">
      <input type="hidden" name="id" value={person?.id ?? ''} />
      <input type="hidden" name="photo_src" value={person?.photo ?? ''} />
      <div className="a-edit__main">
        {state.error && (
          <div role="alert" className="a-notice a-notice--error">
            {state.error}
          </div>
        )}
        <Panel title="Details">
          <Field label="Full name" id="nm" required>
            <input id="nm" name="name" type="text" defaultValue={person?.name} className="a-input" required />
          </Field>
          <Field label="Role" id="ro" hint="What they look after, for example Saturday Reading Groups">
            <input id="ro" name="role" type="text" defaultValue={person?.role} aria-describedby="ro-h" className="a-input" />
          </Field>
          <div className="a-grid">
            <Field label="Group" id="gr">
              <select id="gr" name="group" value={g} onChange={(e) => setG(e.target.value as PersonGroup)} className="a-select">
                <option value="organiser">Organiser</option>
                <option value="advisor">Advisor</option>
                <option value="torchbearer">Torchbearer</option>
              </select>
            </Field>
            {g === 'torchbearer' ? (
              <Field label="Years active" id="yr" hint="For example, 2023 to 2025">
                <input id="yr" name="years" type="text" defaultValue={person?.years} aria-describedby="yr-h" className="a-input" />
              </Field>
            ) : (
              <Field label="Organiser since" id="si">
                <input id="si" name="since" type="text" inputMode="numeric" defaultValue={person?.since} className="a-input" />
              </Field>
            )}
          </div>
          <div className="a-grid">
            <Field label="Profile link" id="li">
              <input id="li" name="link" type="url" defaultValue={person?.link} placeholder="https://" className="a-input" />
            </Field>
            <Field label="Link label" id="ll">
              <input id="ll" name="link_label" type="text" defaultValue={person?.linkLabel ?? 'LinkedIn'} className="a-input" />
            </Field>
          </div>
          <Field label="Photo" id="ph" hint="A square photo works best. PNG or JPG, up to 5 MB.">
            <input id="ph" name="photo" type="file" accept="image/png,image/jpeg" aria-describedby="ph-h" />
          </Field>
        </Panel>
      </div>
      <aside className="a-edit__side">
        <Panel>
          <button type="submit" className="a-btn" disabled={pending}>
            {pending ? 'Saving…' : person ? 'Save changes' : 'Add to the site'}
          </button>
          <Link href={`/admin/people?group=${person?.group ?? group}`} className="text-link">
            Cancel
          </Link>
        </Panel>
      </aside>
    </form>
  );
}
