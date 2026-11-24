import Link from 'next/link';

export default function NotFound() {
  return (
    <>
      <main id="content" className="wrap intro" style={{ paddingBottom: 96 }}>
        <h1 className="h1">We can’t find that page</h1>
        <p className="lead">It may have moved, or the link may be out of date.</p>
        <div className="btn-row">
          <Link href="/" className="btn btn--purple">
            Go to the homepage
          </Link>
          <Link href="/research" className="text-link">
            Browse member research
          </Link>
        </div>
      </main>
    </>
  );
}
