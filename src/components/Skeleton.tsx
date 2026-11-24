/* Loading placeholders shaped like the real pages. Shown by loading.tsx files
   while a page's content is on its way, so slow connections see the layout first. */

function Bar({ w = '100%', h = 14, className }: { w?: string | number; h?: number; className?: string }) {
  return <span className={`sk${className ? ` ${className}` : ''}`} style={{ width: w, height: h }} />;
}

function Busy({ children }: { children: React.ReactNode }) {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading</span>
      <div aria-hidden="true">{children}</div>
    </div>
  );
}

function IntroSk({ button }: { button?: boolean }) {
  return (
    <section className="wrap intro">
      <Bar w="42%" h={40} />
      <div className="sk-stack" style={{ maxWidth: 720 }}>
        <Bar h={18} />
        <Bar w="85%" h={18} />
      </div>
      {button && <Bar w={200} h={46} className="sk--btn" />}
    </section>
  );
}

function RowsSk({ rows = 5 }: { rows?: number }) {
  return (
    <ul className="rule-list">
      {Array.from({ length: rows }, (_, i) => (
        <li key={i} className="row">
          <div className="row__main">
            <Bar w={`${70 - (i % 3) * 12}%`} h={20} />
            <Bar w="45%" />
          </div>
          <div className="row__side">
            <Bar w="70%" h={12} />
            <Bar w={90} h={20} />
          </div>
        </li>
      ))}
    </ul>
  );
}

function CardsSk({ count = 6, ratio = '4 / 3' }: { count?: number; ratio?: string }) {
  return (
    <ul className="sk-cards">
      {Array.from({ length: count }, (_, i) => (
        <li key={i}>
          <span className="sk" style={{ display: 'block', aspectRatio: ratio, width: '100%' }} />
          <Bar w="80%" h={16} />
          <Bar w="50%" h={12} />
        </li>
      ))}
    </ul>
  );
}

/** Intro and a rule list: most section pages. */
export function PageSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <Busy>
      <IntroSk />
      <section className="band">
        <div className="wrap band__inner">
          <RowsSk rows={rows} />
        </div>
      </section>
    </Busy>
  );
}

/** Intro and a grid of cards: products, gallery. */
export function GridSkeleton({ count = 6, ratio }: { count?: number; ratio?: string }) {
  return (
    <Busy>
      <IntroSk button />
      <section className="band">
        <div className="wrap band__inner">
          <CardsSk count={count} ratio={ratio} />
        </div>
      </section>
    </Busy>
  );
}

/** Published research: title, filter bar and rows. */
export function ResearchSkeleton() {
  return (
    <Busy>
      <section className="wrap research-intro">
        <div className="research-intro__top">
          <Bar w="40%" h={40} />
          <Bar w={190} h={46} className="sk--btn" />
        </div>
        <Bar w="55%" h={18} />
      </section>
      <section className="wrap research-filters">
        <div className="research-filters__bar">
          <Bar w="50%" h={46} />
          <Bar w={200} h={46} />
          <Bar w={120} h={46} />
        </div>
      </section>
      <section className="wrap research-results">
        <RowsSk rows={5} />
      </section>
    </Busy>
  );
}

/** Homepage: hero with the This week box, then a list. */
export function HomeSkeleton() {
  return (
    <Busy>
      <section className="wrap home-hero">
        <div className="home-hero__text">
          <Bar w="90%" h={44} />
          <Bar w="70%" h={44} />
          <div className="sk-stack">
            <Bar h={18} />
            <Bar h={18} />
            <Bar w="75%" h={18} />
          </div>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Bar w={190} h={48} className="sk--btn" />
            <Bar w={220} h={48} className="sk--btn" />
          </div>
        </div>
        <div className="sk-box">
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className="sk-box__row">
              <Bar w={44} h={12} />
              <div className="sk-stack" style={{ flex: 1 }}>
                <Bar w="60%" h={16} />
                <Bar w="90%" h={12} />
              </div>
            </div>
          ))}
        </div>
      </section>
      <section className="band band--white">
        <div className="wrap home-block">
          <Bar w={260} h={30} />
          <RowsSk rows={4} />
        </div>
      </section>
    </Busy>
  );
}

/** Admin pages: heading and two panels. */
export function AdminSkeleton() {
  return (
    <Busy>
      <div className="sk-stack" style={{ gap: 10 }}>
        <Bar w="35%" h={32} />
        <Bar w="55%" h={16} />
      </div>
      {[0, 1].map((p) => (
        <div key={p} className="a-panel" style={{ marginTop: 28 }}>
          <Bar w="25%" h={20} />
          {Array.from({ length: 4 }, (_, i) => (
            <Bar key={i} w={`${90 - i * 10}%`} h={16} />
          ))}
        </div>
      ))}
    </Busy>
  );
}
