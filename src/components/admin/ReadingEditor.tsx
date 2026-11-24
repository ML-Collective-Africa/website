'use client';

import { useRouter } from 'next/navigation';
import { useActionState, useState } from 'react';
import { saveReading, type FormState } from '@/lib/actions/admin';
import type { ReadingMonth, ReadingPaper } from '@/lib/types';
import { newId } from '@/lib/utils';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

type Option = { key: string; label: string; status?: 'draft' | 'published' };

export function ReadingEditor({ monthKey, options, initial }: { monthKey: string; options: Option[]; initial: ReadingMonth }) {
  const router = useRouter();
  const [state, action, pending] = useActionState<FormState, FormData>(saveReading, {});
  const onSubmit = useKeepValues(action);
  const [rows, setRows] = useState<ReadingPaper[]>(
    initial.papers.length ? initial.papers : [{ id: newId(), date: '', title: '' }],
  );
  const update = (i: number, patch: Partial<ReadingPaper>) => setRows((r) => r.map((row, j) => (j === i ? { ...row, ...patch } : row)));

  return (
    <form method="post" onSubmit={onSubmit} className="stack-8" style={{ gap: 28 }}>
      <input type="hidden" name="papers" value={JSON.stringify(rows)} />
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
      <Panel title="This month">
        <div className="a-grid a-grid--260">
          <Field label="Month" id="mo">
            <select
              id="mo"
              name="month"
              className="a-select"
              value={monthKey}
              onChange={(e) => router.push(`/admin/reading?month=${e.target.value}`)}
            >
              {options.map((o) => (
                <option key={o.key} value={o.key}>
                  {o.label}
                  {o.status === 'draft' ? ' (draft)' : o.status === 'published' ? ' (published)' : ''}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Theme" id="th">
            <input id="th" name="theme" type="text" defaultValue={initial.theme} className="a-input" placeholder="For example, Speech and audio" />
          </Field>
        </div>
      </Panel>

      <Panel title="Papers">
        <div className="a-table-wrap a-table-wrap--flat">
          <table className="a-table a-table--edit">
            <thead>
              <tr>
                <th scope="col">Date</th>
                <th scope="col">Paper</th>
                <th scope="col">Note</th>
                <th scope="col">Led by</th>
                <th scope="col">Slides link</th>
                <th scope="col">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.id}>
                  <td>
                    <input aria-label={`Date, row ${i + 1}`} value={r.date} placeholder="Sat 3 Oct" onChange={(e) => update(i, { date: e.target.value })} className="a-input a-input--sm" style={{ width: 110 }} />
                  </td>
                  <td>
                    <input aria-label={`Paper title, row ${i + 1}`} value={r.title} onChange={(e) => update(i, { title: e.target.value })} className="a-input a-input--sm" style={{ minWidth: 260 }} />
                  </td>
                  <td>
                    <input aria-label={`Note, row ${i + 1}`} value={r.note ?? ''} onChange={(e) => update(i, { note: e.target.value })} className="a-input a-input--sm" style={{ minWidth: 200 }} />
                  </td>
                  <td>
                    <input aria-label={`Led by, row ${i + 1}`} value={r.ledBy ?? ''} onChange={(e) => update(i, { ledBy: e.target.value })} className="a-input a-input--sm" style={{ width: 150 }} />
                  </td>
                  <td>
                    <input aria-label={`Slides link, row ${i + 1}`} type="url" value={r.slides ?? ''} placeholder="https://" onChange={(e) => update(i, { slides: e.target.value })} className="a-input a-input--sm" style={{ width: 180 }} />
                  </td>
                  <td>
                    <button type="button" aria-label={`Remove row ${i + 1}`} className="a-btn a-btn--ghost a-btn--sm" onClick={() => setRows((rs) => rs.filter((_, j) => j !== i))}>
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <button type="button" className="a-btn a-btn--ghost" onClick={() => setRows((r) => [...r, { id: newId(), date: '', title: '' }])}>
            Add a paper
          </button>
        </div>
        <p className="a-help">The first Saturday of the month is shown as the survey paper if it has no note. Led by is for the team and isn’t shown on the site.</p>
      </Panel>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        <button type="submit" name="intent" value="publish" className="a-btn" disabled={pending}>
          Save and publish
        </button>
        <button type="submit" name="intent" value="draft" className="a-btn a-btn--ghost" disabled={pending}>
          Save as draft
        </button>
      </div>
    </form>
  );
}
