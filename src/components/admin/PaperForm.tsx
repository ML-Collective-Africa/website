'use client';

import Link from 'next/link';
import { useActionState, useState } from 'react';
import { savePaper, type FormState } from '@/lib/actions/admin';
import type { Paper } from '@/lib/types';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

export function PaperForm({ paper, topics }: { paper?: Paper; topics: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(savePaper, {});
  const onSubmit = useKeepValues(action);
  const [preview, setPreview] = useState<string | undefined>(paper?.figure?.src);
  const [removeFig, setRemoveFig] = useState(false);
  const allTopics = Array.from(new Set([...(paper ? [paper.topic] : []), ...topics]));

  return (
    <form method="post" onSubmit={onSubmit} className="a-edit">
      <input type="hidden" name="id" value={paper?.id ?? ''} />
      <input type="hidden" name="figure_src" value={paper?.figure?.src ?? ''} />
      <div className="a-edit__main">
        {state.error && (
          <div role="alert" className="a-notice a-notice--error">
            {state.error}
          </div>
        )}
        <Panel title="Details">
          <Field label="Title" id="ti" required>
            <input id="ti" name="title" type="text" defaultValue={paper?.title} className="a-input" required />
          </Field>
          <Field label="Authors" id="au" hint="In the order they appear on the paper">
            <input id="au" name="authors" type="text" defaultValue={paper?.authors} aria-describedby="au-h" className="a-input" />
          </Field>
          <div className="a-grid">
            <Field label="Where it appeared" id="ve">
              <input id="ve" name="venue" type="text" defaultValue={paper?.venue} className="a-input" />
            </Field>
            <Field label="Year" id="yr">
              <input id="yr" name="year" type="text" inputMode="numeric" pattern="\d{4}" defaultValue={paper?.year} className="a-input" />
            </Field>
            <Field label="Topic" id="tp">
              <select id="tp" name="topic" defaultValue={paper?.topic ?? allTopics[0]} className="a-select">
                {allTopics.map((t) => (
                  <option key={t}>{t}</option>
                ))}
              </select>
            </Field>
          </div>
          <Field label="Summary" id="su" hint="Two to four sentences in plain language">
            <textarea id="su" name="summary" rows={4} defaultValue={paper?.summary} aria-describedby="su-h" className="a-textarea" />
          </Field>
          <Field label="Abstract" id="ab" hint="Optional. Shown behind “Read the abstract”.">
            <textarea id="ab" name="abstract" rows={5} defaultValue={paper?.abstract} aria-describedby="ab-h" className="a-textarea" />
          </Field>
        </Panel>

        <Panel title="Links">
          <div className="a-grid a-grid--260">
            {(['paper', 'code', 'slides', 'recording'] as const).map((k, i) => (
              <Field key={k} label={k[0].toUpperCase() + k.slice(1)} id={`l${i + 1}`}>
                <input id={`l${i + 1}`} name={`link_${k}`} type="url" defaultValue={paper?.links[k]} className="a-input" />
              </Field>
            ))}
          </div>
        </Panel>

        <Panel title="Figure">
          <div className="a-figure">
            {preview && !removeFig ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={preview} alt="" className="a-figure__preview" />
            ) : (
              <div className="a-figure__preview a-figure__preview--empty">No figure</div>
            )}
            <div className="stack-8" style={{ flex: '1 1 280px', gap: 14 }}>
              <Field label="Image" id="fig" hint="PNG or JPG, up to 10 MB">
                <input
                  id="fig"
                  name="figure"
                  type="file"
                  accept="image/png,image/jpeg"
                  aria-describedby="fig-h"
                  onChange={(e) => {
                    const f = e.target.files?.[0];
                    if (f) {
                      setPreview(URL.createObjectURL(f));
                      setRemoveFig(false);
                    }
                  }}
                />
              </Field>
              <Field label="Describe the image" id="alt" hint="For people using screen readers" required={Boolean(preview && !removeFig)}>
                <input id="alt" name="figure_alt" type="text" defaultValue={paper?.figure?.alt} aria-describedby="alt-h" className="a-input" />
              </Field>
              {paper?.figure && (
                <label className="a-check">
                  <input type="checkbox" name="figure_remove" checked={removeFig} onChange={(e) => setRemoveFig(e.target.checked)} /> Remove the
                  figure
                </label>
              )}
            </div>
          </div>
        </Panel>
      </div>

      <aside className="a-edit__side">
        <Panel title="Visibility">
          <fieldset className="fieldset">
            <legend className="sr-only">Visibility</legend>
            <label className="a-check">
              <input type="radio" name="visibility" value="published" defaultChecked={paper ? paper.visible : true} /> Published
            </label>
            <label className="a-check">
              <input type="radio" name="visibility" value="hidden" defaultChecked={paper ? !paper.visible : false} /> Hidden
            </label>
          </fieldset>
          <label className="a-check">
            <input type="checkbox" name="featured" defaultChecked={paper?.featured} /> Feature on the homepage
          </label>
          <button type="submit" className="a-btn" disabled={pending}>
            {pending ? 'Saving…' : paper ? 'Save changes' : 'Add paper'}
          </button>
          <Link href="/admin/papers" className="text-link">
            Cancel
          </Link>
        </Panel>
      </aside>
    </form>
  );
}
