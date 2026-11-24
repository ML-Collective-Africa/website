'use client';

import { useActionState, useEffect, useRef, useState } from 'react';
import { uploadGallery, type FormState } from '@/lib/actions/admin';
import { Field, Panel } from './ui';
import { useKeepValues } from './useKeepValues';

type Picked = { name: string; url: string; alt: string; caption: string };

export function GalleryUpload({ events }: { events: string[] }) {
  const [state, action, pending] = useActionState<FormState, FormData>(uploadGallery, {});
  const onSubmit = useKeepValues(action);
  const [picked, setPicked] = useState<Picked[]>([]);
  const [video, setVideo] = useState('');
  const [videoAlt, setVideoAlt] = useState('');
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null);
  const form = useRef<HTMLFormElement>(null);

  const setFiles = (files: FileList | null) => {
    if (!files) return;
    setPicked(Array.from(files).map((f) => ({ name: f.name, url: URL.createObjectURL(f), alt: '', caption: '' })));
  };

  useEffect(() => {
    if (state.message) {
      form.current?.reset();
      setPicked([]);
      setVideo('');
      setVideoAlt('');
    }
  }, [state]);

  const missing = picked.filter((p) => !p.alt.trim()).length + (video && !videoAlt.trim() ? 1 : 0);
  const ready = picked.length + (video ? 1 : 0);

  return (
    <form ref={form} method="post" onSubmit={onSubmit} className="stack-8" style={{ gap: 28 }}>
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
      <Panel>
        <div className="a-grid a-grid--260">
          <Field label="Event" id="ev">
            <select id="ev" name="event" className="a-select">
              {events.map((e) => (
                <option key={e}>{e}</option>
              ))}
            </select>
          </Field>
          <Field label="YouTube link, for videos" id="yt" hint="Make sure captions are turned on">
            <input id="yt" name="video" type="url" value={video} onChange={(e) => setVideo(e.target.value)} aria-describedby="yt-h" className="a-input" />
          </Field>
        </div>
        <div
          className={`a-drop${dragging ? ' a-drop--over' : ''}`}
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            if (input.current && e.dataTransfer.files.length) {
              input.current.files = e.dataTransfer.files;
              setFiles(e.dataTransfer.files);
            }
          }}
        >
          <span style={{ fontSize: 16, fontWeight: 600 }}>Drag photos here, or</span>
          <label className="a-btn a-btn--ghost" style={{ cursor: 'pointer' }}>
            Choose files
            <input
              ref={input}
              type="file"
              name="photos"
              accept="image/png,image/jpeg"
              multiple
              className="sr-only"
              onChange={(e) => setFiles(e.target.files)}
            />
          </label>
          <span style={{ fontSize: 14, color: 'var(--text-2)' }}>
            JPG or PNG, up to 10 MB each. For videos, upload to YouTube first and paste the link above.
          </span>
        </div>
      </Panel>

      {ready > 0 && (
        <Panel title={`${ready === 1 ? '1 item' : `${ready} items`} ready`}>
          <ul className="a-uploads">
            {picked.map((p, i) => (
              <li key={p.url}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={p.url} alt={`Preview of ${p.name}`} className="a-uploads__preview" />
                <div className="stack-8" style={{ flex: '1 1 320px', gap: 14 }}>
                  <Field
                    label="Describe the image"
                    id={`alt${i}`}
                    required
                    hint="What’s in the photo, for screen reader users"
                    error={!p.alt.trim() ? 'Add a description before publishing' : undefined}
                  >
                    <input
                      id={`alt${i}`}
                      name={`alt_${i}`}
                      type="text"
                      value={p.alt}
                      onChange={(e) => setPicked((ps) => ps.map((x, j) => (j === i ? { ...x, alt: e.target.value } : x)))}
                      aria-describedby={`alt${i}-h`}
                      className="a-input"
                    />
                  </Field>
                  <Field label="Caption" id={`cap${i}`}>
                    <input
                      id={`cap${i}`}
                      name={`caption_${i}`}
                      type="text"
                      value={p.caption}
                      onChange={(e) => setPicked((ps) => ps.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))}
                      className="a-input"
                    />
                  </Field>
                </div>
              </li>
            ))}
            {video && (
              <li>
                <span className="a-uploads__preview a-thumb--empty">YouTube video</span>
                <div className="stack-8" style={{ flex: '1 1 320px', gap: 14 }}>
                  <Field label="Describe the video" id="valt" required error={!videoAlt.trim() ? 'Add a description before publishing' : undefined}>
                    <input id="valt" name="video_alt" type="text" value={videoAlt} onChange={(e) => setVideoAlt(e.target.value)} className="a-input" />
                  </Field>
                  <Field label="Caption" id="vcap">
                    <input id="vcap" name="video_caption" type="text" className="a-input" />
                  </Field>
                </div>
              </li>
            )}
          </ul>
        </Panel>
      )}

      <div style={{ display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
        <button type="submit" className="a-btn" disabled={pending || ready === 0 || missing > 0}>
          {pending ? 'Publishing…' : 'Publish to gallery'}
        </button>
        {missing > 0 && (
          <span style={{ fontSize: 14, color: 'var(--danger)', fontWeight: 500 }}>
            {missing === 1 ? '1 item still needs a description' : `${missing} items still need a description`}
          </span>
        )}
      </div>
    </form>
  );
}
