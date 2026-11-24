import type { Metadata } from 'next';
import Link from 'next/link';
import { Pager } from '@/components/Pager';
import { Band, Intro, PlaceholderMedia } from '@/components/ui';
import { getProducts } from '@/lib/content';
import { pageParam, paginate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Product-driven research' };
export const dynamic = 'force-dynamic';

export default async function ProductsPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const { items, pages, current } = paginate(await getProducts(), pageParam(page), 6);
  return (
    <>
      <Intro
        title="Product-driven research"
        lead="Research that turned into something people can use: tools, systems and prototypes, many of them built for competitions and challenges."
      >
        <div className="btn-row">
          <Link href="/research/submit?type=Product" className="btn btn--fill">
            Submit a product
          </Link>
        </div>
      </Intro>
      <Band>
        <ul className="product-grid">
          {items.map((p) => (
            <li key={p.id} className="card product">
              {p.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.image.src} alt={p.image.alt} className="product__img" />
              ) : (
                <PlaceholderMedia label={`Screenshot of ${p.name}`} ratio="16 / 9" soft />
              )}
              <div className="product__body">
                <h2 className="product__name">{p.name}</h2>
                <p className="row__desc">{p.description}</p>
                <span className="product__team">{p.team}</span>
                {p.href && (
                  <a href={p.href} className="arrow-link">
                    Learn more <span aria-hidden="true">→</span>
                  </a>
                )}
              </div>
            </li>
          ))}
        </ul>
        <Pager label="Product pages" page={current} pages={pages} hrefFor={(n) => `/research/products?page=${n}`} />
      </Band>
    </>
  );
}
