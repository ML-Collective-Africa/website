'use client';

import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react';
import flat from '@/data/flat-map.json';
import land from '@/data/globe-land.json';
import { FLAT_PINS, type Place } from '@/content/site';
import { ChevronLeft, ChevronRight, CloseIcon } from '@/components/icons';

const FILTERS: [label: string, type: string | null][] = [
  ['All', null],
  ['Internships', 'Internship'],
  ['Grad school', 'Grad school'],
  ['Fellowships', 'Fellowship'],
];

const LAND = land as number[];
const R = 236;
const C = 250;
const D = Math.PI / 180;
const START = { lon: -18, lat: 8 };

/** Orthographic projection. The globe is centred on longitude -lon and latitude lat. */
function projector(lon0: number, lat0: number) {
  const l0 = -lon0 * D;
  const p0 = lat0 * D;
  const sp0 = Math.sin(p0);
  const cp0 = Math.cos(p0);
  return (lon: number, lat: number): [number, number, number] => {
    const l = lon * D - l0;
    const p = lat * D;
    const cp = Math.cos(p);
    const sp = Math.sin(p);
    const cl = Math.cos(l);
    const z = sp0 * sp + cp0 * cp * cl;
    return [C + R * cp * Math.sin(l), C - R * (cp0 * sp - sp0 * cp * cl), z];
  };
}

function landPath(proj: ReturnType<typeof projector>) {
  let d = '';
  for (let i = 0; i < LAND.length; i += 2) {
    const q = proj(LAND[i], LAND[i + 1]);
    if (q[2] <= 0.02) continue;
    const r = 0.9 + 1.6 * q[2];
    d += `M${(q[0] - r).toFixed(1)} ${q[1].toFixed(1)}a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(2 * r).toFixed(1)} 0a${r.toFixed(1)} ${r.toFixed(1)} 0 1 0 ${(-2 * r).toFixed(1)} 0`;
  }
  return d;
}

function ariaFor(p: Place & { shown: Place['people'] }) {
  return `${p.city}, ${p.country}, ${p.shown.length} ${p.shown.length === 1 ? 'member' : 'members'}`;
}

export function MembersMap({ places }: { places: Place[] }) {
  const [filter, setFilter] = useState('All');
  const [selected, setSelected] = useState<string | null>(null);
  const [rot, setRot] = useState(START);
  const drag = useRef<{ x: number; y: number; lon: number; lat: number; moved: boolean; id: number } | null>(null);
  const spin = useRef<{ frame: number; target: number } | null>(null);
  const lonRef = useRef(rot.lon);
  lonRef.current = rot.lon;

  const stopSpin = () => {
    if (spin.current) cancelAnimationFrame(spin.current.frame);
    spin.current = null;
  };
  useEffect(() => stopSpin, []);

  /** Turn the globe smoothly by `delta` degrees. Repeated clicks add up. */
  const turn = (delta: number) => {
    const target = (spin.current?.target ?? lonRef.current) + delta;
    stopSpin();
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setRot((r) => ({ ...r, lon: target }));
      return;
    }
    const from = lonRef.current;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 400);
      const eased = 1 - Math.pow(1 - t, 3);
      setRot((r) => ({ ...r, lon: from + (target - from) * eased }));
      if (t < 1) spin.current = { frame: requestAnimationFrame(step), target };
      else spin.current = null;
    };
    spin.current = { frame: requestAnimationFrame(step), target };
  };
  const [grabbing, setGrabbing] = useState(false);

  const type = FILTERS.find((f) => f[0] === filter)![1];
  const visible = useMemo(
    () =>
      places
        .map((p) => ({ ...p, shown: type ? p.people.filter((m) => m.type === type) : p.people }))
        .filter((p) => p.shown.length > 0),
    [places, type],
  );
  const sel = visible.find((p) => p.id === selected) ?? null;
  const count = visible.reduce((n, p) => n + p.shown.length, 0);

  const proj = useMemo(() => projector(rot.lon, rot.lat), [rot]);
  const d = useMemo(() => landPath(proj), [proj]);

  const pins = visible
    .map((p) => {
      const q = proj(p.lon, p.lat);
      return q[2] > 0.08 ? { p, left: q[0] / 5, top: q[1] / 5 } : null;
    })
    .filter((x): x is NonNullable<typeof x> => x !== null);
  const popPin = sel ? pins.find((x) => x.p.id === sel.id) : undefined;

  const pick = (id: string) => setSelected((cur) => (cur === id ? null : id));

  const onDown = (e: PointerEvent<HTMLDivElement>) => {
    const t = e.target as HTMLElement;
    if (t.closest('.pin') || t.closest('[role=dialog]')) return;
    stopSpin();
    drag.current = { x: e.clientX, y: e.clientY, lon: lonRef.current, lat: rot.lat, moved: false, id: e.pointerId };
  };
  const onMove = (e: PointerEvent<HTMLDivElement>) => {
    const g = drag.current;
    if (!g) return;
    const dx = e.clientX - g.x;
    const dy = e.clientY - g.y;
    if (!g.moved) {
      if (Math.abs(dx) + Math.abs(dy) < 4) return;
      g.moved = true;
      setGrabbing(true);
      try {
        e.currentTarget.setPointerCapture(g.id);
      } catch {
        /* pointer already released */
      }
    }
    const k = 180 / (e.currentTarget.getBoundingClientRect().width || 500);
    // Content follows the pointer: dragging right turns the globe to show places further west.
    setRot({ lon: g.lon + dx * k, lat: Math.max(-60, Math.min(60, g.lat + dy * k)) });
  };
  const onUp = () => {
    drag.current = null;
    setGrabbing(false);
  };

  return (
    <section aria-labelledby="map-h" className="band">
      <div className="wrap home-block" style={{ gap: 24 }}>
        <div className="home-block__head" style={{ alignItems: 'flex-end' }}>
          <div className="stack-8" style={{ maxWidth: 640 }}>
            <h2 id="map-h" className="h2 h2--section">
              Where our members have gone
            </h2>
            <p className="home-block__sub">
              <span className="hide-mobile">
                See our members on the map. Drag the globe and click a dot to see who went where for internships, grad
                school and fellowships.
              </span>
              <span className="show-mobile-inline">
                See our members on the map. Tap a dot to see who went where for internships, grad school and
                fellowships.
              </span>
            </p>
          </div>
          <div role="group" aria-label="Show" className="map-filters">
            {FILTERS.map(([label]) => (
              <button
                key={label}
                type="button"
                className="chip"
                aria-pressed={label === filter}
                onClick={() => {
                  setFilter(label);
                  setSelected(null);
                }}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Desktop: globe */}
        <div className="map-card map-globe">
          <div
            className="globe"
            style={{ cursor: grabbing ? 'grabbing' : 'grab' }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
            onPointerCancel={onUp}
          >
            <svg viewBox="0 0 500 500" width="100%" height="100%" aria-hidden="true" className="globe__svg">
              <circle cx="250" cy="250" r="236" fill="#F6F4FA" stroke="#E4E2E8" strokeWidth="1" />
              <path d={d} fill="#C9C5D1" />
            </svg>
            {pins.map(({ p, left, top }) => {
              const on = p.id === selected;
              const size = 12 + p.shown.length * 3;
              return (
                <button
                  key={p.id}
                  type="button"
                  className="pin"
                  aria-label={ariaFor(p)}
                  aria-pressed={on}
                  onClick={() => pick(p.id)}
                  style={{
                    left: `${left}%`,
                    top: `${top}%`,
                    width: size,
                    height: size,
                    background: on ? '#17161C' : '#971AF7',
                    boxShadow: `0 0 0 ${on ? 7 : 4}px rgba(151,26,247,.22), 0 2px 6px rgba(23,22,28,.25)`,
                  }}
                />
              );
            })}
            {sel && popPin && (
              <div
                key={sel.id}
                role="dialog"
                aria-label={sel.city}
                className="map-pop"
                style={{
                  // Grow out of the corner nearest the pin.
                  transformOrigin: `${popPin.left > 50 ? 'right' : 'left'} ${popPin.top > 45 ? 'calc(100% - 20px)' : '20px'}`,
                  left: `${popPin.left}%`,
                  top: `${popPin.top}%`,
                  transform: `${popPin.left > 50 ? 'translateX(calc(-100% - 18px))' : 'translateX(18px)'} ${
                    popPin.top > 45 ? 'translateY(calc(-100% + 20px))' : 'translateY(-20px)'
                  }`,
                }}
              >
                <div className="map-pop__head">
                  <div className="map-place">
                    <span className="map-place__country">{sel.country}</span>
                    <span className="map-place__city">{sel.city}</span>
                  </div>
                  <button type="button" aria-label="Close" className="map-pop__close" onClick={() => setSelected(null)}>
                    <CloseIcon size={12} />
                  </button>
                </div>
                <MemberList people={sel.shown} />
              </div>
            )}
          </div>
          <div className="globe__controls">
            <button
              type="button"
              className="round-btn"
              aria-label="Turn the globe left"
              onClick={() => turn(-25)}
            >
              <ChevronLeft />
            </button>
            <span>Drag the globe to look around</span>
            <button
              type="button"
              className="round-btn"
              aria-label="Turn the globe right"
              onClick={() => turn(25)}
            >
              <ChevronRight />
            </button>
          </div>
        </div>

        {/* Mobile: flat map with the selection below it */}
        <div className="map-flat">
          <div className="map-card" style={{ padding: 10 }}>
            <div className="flatmap">
              <FlatDots />
              {visible.map((p) => {
                const pos = FLAT_PINS[p.id];
                if (!pos) return null;
                const on = p.id === selected;
                const size = 8 + p.shown.length * 2;
                return (
                  <button
                    key={p.id}
                    type="button"
                    className="flatmap__pin"
                    aria-label={ariaFor(p)}
                    aria-pressed={on}
                    onClick={() => pick(p.id)}
                    style={{ left: `${pos[0]}%`, top: `${pos[1]}%` }}
                  >
                    <span
                      style={{
                        width: size,
                        height: size,
                        background: on ? '#17161C' : '#971AF7',
                        boxShadow: `0 0 0 ${on ? 5 : 3}px rgba(151,26,247,.22)`,
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <aside aria-live="polite" className="map-card map-aside">
            {sel ? (
              <>
                <div className="map-place">
                  <span className="map-place__country" style={{ fontSize: 13 }}>
                    {sel.country}
                  </span>
                  <h3 className="map-place__city" style={{ margin: 0, fontSize: 22 }}>
                    {sel.city}
                  </h3>
                </div>
                <MemberList people={sel.shown} large />
              </>
            ) : (
              <>
                <span className="map-count">{count}</span>
                <span style={{ fontSize: 16, lineHeight: 1.5 }}>
                  members in {visible.length} places so far. Tap a dot on the map to see who went where.
                </span>
              </>
            )}
          </aside>
        </div>
      </div>
    </section>
  );
}

function MemberList({ people, large }: { people: Place['people']; large?: boolean }) {
  return (
    <ul className={`map-members${large ? ' map-members--large' : ''}`}>
      {people.map((m, i) => (
        <li key={`${m.name}-${i}`}>
          <span className="map-members__name">{m.name}</span>
          <span className="map-members__what">{m.what}</span>
          <span className="map-members__type">
            {m.type} · {m.year}
          </span>
        </li>
      ))}
    </ul>
  );
}

const FLAT = flat as { r: number; dots: number[] };

function FlatDots() {
  const d = useMemo(() => {
    let s = '';
    const r = FLAT.r;
    for (let i = 0; i < FLAT.dots.length; i += 2) {
      const x = FLAT.dots[i];
      const y = FLAT.dots[i + 1];
      s += `M${x - r} ${y}a${r} ${r} 0 1 0 ${2 * r} 0a${r} ${r} 0 1 0 ${-2 * r} 0`;
    }
    return s;
  }, []);
  return (
    <svg viewBox="0 0 788 324" width="100%" height="100%" aria-hidden="true" className="flatmap__svg">
      <path d={d} fill="#D4D1DA" />
    </svg>
  );
}
