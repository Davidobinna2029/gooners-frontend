import Link from "next/link";

import Hero from "@/components/home/Hero";
import NewsCard from "@/components/news/NewsCard";

import type { HomepageFeed } from "@/lib/orchestrator/homepage";

interface Props {
  feed: HomepageFeed;
}

export default function HomepageRenderer({
  feed,
}: Props) {
  const hero = [
    ...(feed.heroMain
      ? [feed.heroMain]
      : []),
    ...feed.heroSide,
  ];

  return (
    <main className="sky-homepage">
      {hero.length > 0 && (
        <section className="hero-zone">
          <Hero featured={hero} />
        </section>
      )}

      <div className="homepage-shell">
        <div className="homepage-main">
          {feed.breaking.length > 0 && (
            <section className="homepage-section">
              <div className="section-header breaking">
                🔴 BREAKING
              </div>

              {feed.breaking.map(
                (post) => (
                  <NewsCard
                    key={post.id}
                    post={post}
                  />
                )
              )}
            </section>
          )}

          {feed.latest.length > 0 && (
            <section className="homepage-section">
              <div className="section-header">
                Latest Arsenal News
              </div>

              {feed.latest.map(
                (post) => (
                  <NewsCard
                    key={post.id}
                    post={post}
                  />
                )
              )}
            </section>
          )}
        </div>

        <aside className="homepage-sidebar">
          {feed.trending.length >
            0 && (
            <section className="sidebar-card">
              <h3>
                Trending Now
              </h3>

              {feed.trending.map(
                (
                  post,
                  index
                ) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="trending-link"
                  >
                    <span>
                      {index + 1}
                    </span>

                    {post.title}
                  </Link>
                )
              )}
            </section>
          )}

          <section className="sidebar-card transfer-hub">
            <h3>
              Transfer Hub
            </h3>

            <p>
              Follow the latest Arsenal transfer rumours,
              negotiations and confirmed deals.
            </p>

            <Link href="/news">
              View Transfer Coverage →
            </Link>
          </section>
        </aside>
      </div>

      <section className="homepage-more">
        <div className="container">
          <Link
            href="/news"
            className="more-stories-btn"
          >
            More Stories →
          </Link>
        </div>
      </section>
    </main>
  );
}