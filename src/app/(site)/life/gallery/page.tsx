import type { Metadata } from 'next';
import { Pager } from '@/components/Pager';
import { Intro, PlaceholderMedia } from '@/components/ui';
import { getGallery } from '@/lib/cms';
import { pageParam, paginate } from '@/lib/utils';

export const metadata: Metadata = { title: 'Gallery' };

function youtubeId(url: string) {
  return url.match(/(?:youtu\.be\/|v=|embed\/|shorts\/)([\w-]{11})/)?.[1];
}

export default async function GalleryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const { page } = await searchParams;
  const { items, pages, current } = paginate(await getGallery(), pageParam(page), 9);
  return (
    <>
      <Intro
        title="Gallery"
        lead="Check out our members out in the world: starting grad school, interning, presenting posters, giving talks and more."
      />
      <section className="band">
        <div className="wrap band__inner" style={{ paddingTop: 32, paddingBottom: 64, gap: 24 }}>
          <ul className="gallery">
            {items.map((i) => {
              const yt = i.video ? youtubeId(i.video) : undefined;
              return (
                <li key={i.id}>
                  {yt ? (
                    <iframe
                      className="gallery__media"
                      src={`https://www.youtube-nocookie.com/embed/${yt}?cc_load_policy=1`}
                      title={i.alt}
                      loading="lazy"
                      allow="encrypted-media; picture-in-picture"
                      allowFullScreen
                    />
                  ) : i.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img className="gallery__media" src={i.src} alt={i.alt} loading="lazy" />
                  ) : (
                    <PlaceholderMedia label={i.alt} hideLabel>
                      <span aria-hidden="true">Photo</span>
                    </PlaceholderMedia>
                  )}
                  <span className="gallery__caption">{i.caption}</span>
                  <span className="gallery__event">{i.event}</span>
                </li>
              );
            })}
          </ul>
          <Pager label="Gallery pages" page={current} pages={pages} hrefFor={(n) => `/life/gallery?page=${n}`} />
        </div>
      </section>
    </>
  );
}
