import Link from "next/link";

import Hero from "@/components/home/Hero";
import NewsCard from "@/components/news/NewsCard";
import HomepageInfiniteScroll from "@/components/home/HomepageInfiniteScroll";

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

  /*
   * All posts already reserved by the homepage.
   *
   * These IDs are passed to the infinite-scroll component
   * so it never intentionally loads a story that has already
   * appeared in Hero, Breaking, Trending, or Latest.
   */
  const excludedIds = feed.all.map(
    (post) => post.id
  );

  return (
    <main className="sky-homepage">

      {/* =====================================================
          HERO
      ===================================================== */}

      {hero.length > 0 && (
        <section className="hero-zone">
          <Hero featured={hero} />
        </section>
      )}

      {/* =====================================================
          HOMEPAGE CONTENT
      ===================================================== */}

      <div className="homepage-shell">

        <div className="homepage-main">

          {/* =================================================
              BREAKING NEWS
          ================================================= */}

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

          {/* =================================================
              LATEST ARSENAL NEWS
          ================================================= */}

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

          {/* =================================================
              INFINITE SCROLL
              
              Loads additional stories automatically when
              the visitor approaches the bottom of the page.

              excludedIds contains every post already present
              in the initial homepage feed.
          ================================================= */}

          <HomepageInfiniteScroll
            excludedIds={excludedIds}
          />

        </div>

        {/* ===================================================
            SIDEBAR
        =================================================== */}

        <aside className="homepage-sidebar">

          {/* =================================================
              TRENDING
          ================================================= */}

          {feed.trending.length > 0 && (
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

          {/* =================================================
              TRANSFER HUB
          ================================================= */}

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

      {/* =====================================================
          MORE STORIES
          
          Kept as a fallback/navigation option. Infinite
          scrolling now provides the primary way to continue
          reading stories.
      ===================================================== */}

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
