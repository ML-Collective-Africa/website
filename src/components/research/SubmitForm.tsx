'use client';

import Link from 'next/link';
import { useActionState, useEffect, useRef, useState } from 'react';
import { CheckIcon, ChevronRight } from '@/components/icons';
import { submitResearch, type SubmitState } from '@/lib/actions/submit';
import { LINKS } from '@/content/links';

const TOPICS = ['NLP', 'Speech', 'Medical imaging', 'Health', 'Vision', 'Vision and language', 'Safety', 'Robotics', 'Industry', 'Science', 'Systems', 'Policy', 'Theory', 'Optimisation', 'Efficiency'];
const INITIAL: SubmitState = { ok: false, errors: [] };

export function SubmitForm({ initialType }: { initialType: 'Paper' | 'Product' }) {
  const [state, action, pending] = useActionState(submitResearch, INITIAL);
  const [type, setType] = useState(initialType);
  const [topic, setTopic] = useState('');
  const [hasFigure, setHasFigure] = useState(false);
  const [done, setDone] = useState(false);
  const [formKey, setFormKey] = useState(0);
  const summaryRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (state.ok) setDone(true);
    else if (state.errors.length) summaryRef.current?.focus();
  }, [state]);
  useEffect(() => {
    if (done) doneRef.current?.focus();
  }, [done]);

  const err = (f: SubmitState['errors'][number]['field']) => state.errors.find((e) => e.field === f)?.message;
  const v = (k: string) => state.values?.[k];

  if (done) {
    return (
      <div className="wrap submit">
        <Breadcrumb />
        <section aria-live="polite" className="submit-done">
          <span aria-hidden="true" className="submit-done__icon">
            <CheckIcon />
          </span>
          <h1 ref={doneRef} tabIndex={-1} style={{ margin: 0, fontSize: 32, fontWeight: 700 }}>
            Thanks, we have it
          </h1>
          <p className="prose">
            An organiser will look over your submission and add it to the Research page, usually within a week. We’ll
            email you if anything needs changing.
          </p>
          <div className="btn-row" style={{ gap: 20, paddingTop: 4 }}>
            <Link href="/research" className="btn btn--fill">
              Back to Research
            </Link>
            <button
              type="button"
              className="link-button"
              onClick={() => {
                setDone(false);
                setTopic('');
                setHasFigure(false);
                setFormKey((k) => k + 1);
              }}
            >
              Submit another
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="wrap submit">
      <Breadcrumb />
      <div className="submit__grid">
        <div className="submit__main">
          <h1 className="h1">Submit your research</h1>
          <p className="prose">
            Share a published paper, or a product that came out of your research, like a hackathon win or a startup. It
            takes about five minutes, and an organiser checks every entry before it goes live.
          </p>

          {state.errors.length > 0 && (
            <div role="alert" tabIndex={-1} ref={summaryRef} className="error-summary">
              <strong>
                {state.errors.length === 1 ? 'One thing needs' : `${['Two', 'Three', 'Four', 'Five'][state.errors.length - 2] ?? state.errors.length} things need`} fixing before you submit
              </strong>
              {state.errors.map((e) => (
                <a key={e.field} href={`#f-${e.field}`}>
                  {e.message}
                </a>
              ))}
            </div>
          )}

          <form key={formKey} action={action} noValidate className="submit__form">
            <div className="hp" aria-hidden="true">
              <label>
                Leave this empty <input type="text" name="website" tabIndex={-1} autoComplete="off" />
              </label>
            </div>

            <fieldset className="fieldset">
              <legend className="field__label" style={{ marginBottom: 10 }}>
                What are you sharing
              </legend>
              <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                {(['Paper', 'Product'] as const).map((t) => (
                  <label key={t} className="radio-card" data-on={type === t}>
                    <input type="radio" name="type" value={t} checked={type === t} onChange={() => setType(t)} />
                    {t}
                  </label>
                ))}
              </div>
            </fieldset>

            <div className="field">
              <label htmlFor="f-title" className="field__label">
                Title
              </label>
              {err('title') && (
                <span id="title-err" className="field__error">
                  {err('title')}
                </span>
              )}
              <input
                id="f-title"
                name="title"
                type="text"
                className="input"
                defaultValue={v('title')}
                aria-invalid={Boolean(err('title'))}
                aria-describedby={err('title') ? 'title-err' : undefined}
              />
            </div>

            <div className="field">
              <label htmlFor="f-authors" className="field__label">
                Authors or presenters
              </label>
              <span id="authors-hint" className="field__hint">
                Separate names with commas, in the order they appear on the work.
              </span>
              <input id="f-authors" name="authors" type="text" className="input" defaultValue={v('authors')} aria-describedby="authors-hint" />
            </div>

            <div className="form-grid">
              <div className="field">
                <label htmlFor="f-venue" className="field__label">
                  Where it appeared
                </label>
                <input id="f-venue" name="venue" type="text" className="input" placeholder="For example, AfricaNLP at ACL 2026" defaultValue={v('venue')} />
              </div>
              <div className="field">
                <label htmlFor="f-date" className="field__label">
                  Date
                </label>
                <input id="f-date" name="date" type="month" className="input" defaultValue={v('date')} />
              </div>
              <div className="field">
                <label htmlFor="f-topic" className="field__label">
                  Topic
                </label>
                <select id="f-topic" name="topic" className="select" value={topic} onChange={(e) => setTopic(e.target.value)}>
                  <option value="">Choose a topic</option>
                  {TOPICS.map((t) => (
                    <option key={t}>{t}</option>
                  ))}
                  <option>Other</option>
                </select>
                {topic === 'Other' && (
                  <>
                    <label htmlFor="f-topic-other" className="field__label" style={{ fontSize: 15, marginTop: 6 }}>
                      Tell us the topic
                    </label>
                    <input id="f-topic-other" name="topic_other" type="text" className="input" placeholder="For example, Climate or Agriculture" />
                    <span className="field__hint">An organiser will add it as a new topic if it fits.</span>
                  </>
                )}
              </div>
            </div>

            <div className="field">
              <label htmlFor="f-summary" className="field__label">
                Short summary
              </label>
              <span id="summary-hint" className="field__hint">
                Two to four sentences in plain language. What problem you looked at, what you did, and what you found.
              </span>
              <textarea id="f-summary" name="summary" rows={5} className="textarea" defaultValue={v('summary')} aria-describedby="summary-hint" />
            </div>

            <fieldset className="fieldset" style={{ gap: 12 }} id="f-links">
              <legend className="field__label" style={{ marginBottom: 4 }}>
                Links
              </legend>
              <span className="field__hint" style={{ marginTop: -6 }}>
                Add whatever you have. You can leave the rest empty.
              </span>
              {err('links') && <span className="field__error">{err('links')}</span>}
              <div className="form-grid form-grid--280">
                {[
                  ['paper', 'Paper', 'arxiv.org, OpenReview or ACL Anthology'],
                  ['code', 'Code', ''],
                  ['slides', 'Slides', ''],
                  ['recording', 'Recording', ''],
                ].map(([k, label, ph]) => (
                  <div className="field" key={k}>
                    <label htmlFor={`l-${k}`} style={{ fontSize: 15, fontWeight: 500 }}>
                      {label}
                    </label>
                    <input id={`l-${k}`} name={`link_${k}`} type="url" className="input input--sm" placeholder={ph || undefined} defaultValue={v(`link_${k}`)} />
                  </div>
                ))}
              </div>
            </fieldset>

            <div className="field" id="f-figure">
              <label htmlFor="f-figure-file" className="field__label">
                A figure from your work <span style={{ fontWeight: 400, color: 'var(--text-2)' }}>(optional)</span>
              </label>
              <span id="fig-hint" className="field__hint">
                One image that shows the work at a glance. PNG or JPG, up to 5 MB. We’ll ask you for a one line description
                so screen reader users get it too.
              </span>
              {err('figure') && <span className="field__error">{err('figure')}</span>}
              <input
                id="f-figure-file"
                name="figure"
                type="file"
                accept="image/png,image/jpeg"
                aria-describedby="fig-hint"
                style={{ fontSize: 15, padding: '10px 0' }}
                onChange={(e) => setHasFigure(Boolean(e.target.files?.length))}
              />
              {hasFigure && (
                <div className="field" id="f-figureAlt">
                  <label htmlFor="f-figure-alt" style={{ fontSize: 15, fontWeight: 600 }}>
                    Describe the figure in one line
                  </label>
                  {err('figureAlt') && <span className="field__error">{err('figureAlt')}</span>}
                  <input id="f-figure-alt" name="figure_alt" type="text" className="input input--sm" aria-invalid={Boolean(err('figureAlt'))} />
                </div>
              )}
            </div>

            <div className="field">
              <label htmlFor="f-email" className="field__label">
                Your email
              </label>
              <span id="email-hint" className="field__hint">
                Only used if we have questions. It won’t appear on the site.
              </span>
              {err('email') && <span className="field__error">{err('email')}</span>}
              <input
                id="f-email"
                name="email"
                type="email"
                autoComplete="email"
                className="input"
                defaultValue={v('email')}
                aria-invalid={Boolean(err('email'))}
                aria-describedby="email-hint"
              />
            </div>

            <label className="check">
              <input type="checkbox" name="agreed" defaultChecked={v('agreed') === 'on'} />
              My co-authors are happy for this to be shared on the MLC Africa website.
            </label>

            <div className="submit__actions">
              <button type="submit" className="btn btn--fill btn--lg" disabled={pending}>
                {pending ? 'Sending…' : 'Submit for review'}
              </button>
              <Link href="/research" className="text-link">
                Cancel
              </Link>
            </div>
          </form>
        </div>

        <aside aria-label="Before you submit" className="submit__aside">
          <h2 style={{ margin: 0, fontSize: 17, fontWeight: 600, color: 'var(--ink)' }}>Good to know</h2>
          <p>
            Papers go under Published research. Products, like hackathon wins, funded startups and incubator projects, go
            under Product research.
          </p>
          <p>
            If you used MLC as an affiliation, check the <a href={LINKS.affiliationGuide}>affiliation guide</a> first.
          </p>
          <p>Need to fix an entry that’s already up? Use this same form and mention it in the summary.</p>
        </aside>
      </div>
    </div>
  );
}

function Breadcrumb() {
  return (
    <nav aria-label="Breadcrumb" style={{ fontSize: 14 }}>
      <ol className="crumbs">
        <li>
          <Link href="/research">Research</Link>
        </li>
        <li aria-hidden="true" style={{ display: 'flex' }}>
          <ChevronRight size={14} />
        </li>
        <li aria-current="page">Submit your research</li>
      </ol>
    </nav>
  );
}
