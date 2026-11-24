'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { saveWins, type FormState } from '@/lib/actions/admin';
import type { Win, WinKind, WinsMonth } from '@/lib/types';
import { newId } from '@/lib/utils';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

type Option = { key: string; label: string; status?: 'draft' | 'published' };

export function WinsEditor({ month, kinds, options }: { month: WinsMonth; kinds: WinKind[]; options: Option[] }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(saveWins, {});
  const onSubmit = useKeepValues(action);
  const [wins, setWins] = useState<Win[]>(month.wins.length ? month.wins : [{ id: newId(), name: '', kind: 'Paper', text: '' }]);
  const update = (i: number, patch: Partial<Win>) => setWins((w) => w.map((x, j) => (j === i ? { ...x, ...patch } : x)));
  const highlights = wins.filter((w) => w.highlight).length;

  return (
    <form method="post" onSubmit={onSubmit} className="stack-8" style={{ gap: 28 }}>
      <input type="hidden" name="wins" value={JSON.stringify(wins)} />
      {state.error && (
        <div role="alert" className="a-notice a-notice--error">
          {state.error}
        </div>
      )}
      {state.message && (
        <div role="status" className="a-notice a-notice--ok">
          {state.message}
        </div>
      )}
      <Panel title={month.label}>
        <div className="a-grid a-grid--260">
          <Field label="Month" id="mo">
            <select id="mo" name="month" className="a-select" value={month.key} onChange={(e) => router.push(`/admin/wins?month=${e.target.value}`)}>
              {options.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                  {o.status ? ` (${o.status})` : ''}
                </option>
              ))}
            </select>
          </Field>
        </div>
        <Field label="A line about the month" id="note">
          <textarea id="note" name="note" rows={2} defaultValue={month.note} className="a-textarea" />
        </Field>
        <ul className="a-wins">
          {wins.map((w, i) => (
            <li key={w.id}>
              <Field label="Name" id={`wn${i}`}>
                <input id={`wn${i}`} value={w.name} onChange={(e) => update(i, { name: e.target.value })} className="a-input" />
              </Field>
              <Field label="Type of win" id={`wk${i}`}>
                <select id={`wk${i}`} value={w.kind} onChange={(e) => update(i, { kind: e.target.value as WinKind })} className="a-select">
                  {kinds.map((k) => (
                    <option key={k}>{k}</option>
                  ))}
                </select>
              </Field>
              <Field label="What happened" id={`wt${i}`} hint="The full sentence for the site. Put paper titles in “curly quotes” to set them in italics.">
                <textarea id={`wt${i}`} rows={2} value={w.text} onChange={(e) => update(i, { text: e.target.value })} aria-describedby={`wt${i}-h`} className="a-textarea" />
              </Field>
              <div className="a-wins__actions">
                <label className="a-check">
                  <input type="checkbox" checked={Boolean(w.highlight)} onChange={(e) => update(i, { highlight: e.target.checked })} /> On the homepage
                </label>
                <button type="button" aria-label={`Remove win ${i + 1}`} className="a-btn a-btn--ghost a-btn--sm" onClick={() => setWins((ws) => ws.filter((_, j) => j !== i))}>
                  Remove
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div>
          <button type="button" className="a-btn a-btn--ghost" onClick={() => setWins((w) => [...w, { id: newId(), name: '', kind: 'Paper', text: '' }])}>
            Add a win
          </button>
        </div>
        <p className="a-help">
          The homepage shows four wins from the latest published month, starting with the ones ticked here ({highlights} ticked).
        </p>
      </Panel>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {month.status === 'published' ? (
          <>
            <button type="submit" name="intent" value="save" className="a-btn" disabled={pending}>
              Save changes
            </button>
            <button type="submit" name="intent" value="unpublish" className="a-btn a-btn--ghost" disabled={pending}>
              Move back to draft
            </button>
          </>
        ) : (
          <>
            <button type="submit" name="intent" value="publish" className="a-btn" disabled={pending}>
              Publish {month.label.split(' ')[0]}
            </button>
            <button type="submit" name="intent" value="save" className="a-btn a-btn--ghost" disabled={pending}>
              Save draft
            </button>
          </>
        )}
      </div>
    </form>
  );
}
