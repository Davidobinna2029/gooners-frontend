import Link from "next/link";

import Hero from "@/components/home/Hero";
import NewsCard from "@/components/news/NewsCard";
import HomepageInfiniteScroll from "@/components/home/HomepageInfiniteScroll";
import TransferHub from "@/components/home/TransferHub";

import type { HomepageFeed } from "@/lib/orchestrator/homepage";

interface Props {
  feed: HomepageFeed;
}

export default function HomepageRenderer({
  feed,
}: Props) {
  /* ==========================================================
     HERO
     
     Hero is composed of the main hero story plus the
     supporting hero stories.
  ========================================================== */

  const hero = [
    ...(feed.heroMain
      ? [feed.heroMain]
      : []),
    ...feed.heroSide,
  ];

  /* ==========================================================
     FIXED HOMEPAGE RESERVED IDS
     
     IMPORTANT:
     
     Do NOT use feed.all here.
     
     feed.all contains the complete ranked WordPress pool,
     not just the posts actually displayed on the homepage.
     
     The infinite-scroll API should exclude only posts that
     visitors have already seen in the editorial homepage
     sections.
     
     Therefore the reserved set consists of:
     
     - Hero
     - Breaking
     - Trending
     - Latest
     
     This set remains stable while infinite scrolling.
  ========================================================== */

  const reservedPosts = [
    ...hero,
    ...feed.breaking,
    ...feed.trending,
    ...feed.latest,
  ];

  /* ==========================================================
     GLOBAL RESERVED-ID DEDUPLICATION
     
     A post could theoretically appear in more than one
     source array if an editorial override or future layout
     change introduces overlap.
     
     Remove duplicate IDs before passing them to the client.
  ========================================================== */

  const excludedIds = Array.from(
    new Set(
      reservedPosts.map(
        (post) => post.id
      )
    )
  );

  return (
    <main className="sky-homepage">

      {/* ======================================================
          HERO
      ====================================================== */}

      {hero.length > 0 && (
        <section className="hero-zone">
          <Hero
            featured={hero}
          />
        </section>
      )}

      {/* ======================================================
          HOMEPAGE CONTENT
      ====================================================== */}

      <div className="homepage-shell">

        {/* ====================================================
            MAIN COLUMN
        ==================================================== */}

        <div className="homepage-main">

          {/* ==================================================
              BREAKING NEWS
          ================================================== */}

          {feed.breaking.length > 0 && (
            <section
              className="homepage-section"
              aria-labelledby="homepage-breaking-heading"
            >
              <div
                id="homepage-breaking-heading"
                className="section-header breaking"
              >
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

          {/* ==================================================
              LATEST ARSENAL NEWS
          ================================================== */}

          {feed.latest.length > 0 && (
            <section
              className="homepage-section"
              aria-labelledby="homepage-latest-heading"
            >
              <div
                id="homepage-latest-heading"
                className="section-header"
              >
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

          {/* ==================================================
              INFINITE NEWS FEED
              
              Only the IDs actually displayed above are passed
              as reserved IDs.
              
              HomepageInfiniteScroll keeps these exclusions
              fixed while it requests subsequent pages.
          ================================================== */}

          <HomepageInfiniteScroll
            excludedIds={
              excludedIds
            }
          />

        </div>

        {/* ====================================================
            SIDEBAR
        ==================================================== */}

        <aside
          className="homepage-sidebar"
          aria-label="ArsenalTalks sidebar"
        >

          {/* ==================================================
              TRENDING
          ================================================== */}

          {feed.trending.length > 0 && (
            <section
              className="sidebar-card"
              aria-labelledby="homepage-trending-heading"
            >
              <h3 id="homepage-trending-heading">
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
                    <span
                      aria-hidden="true"
                    >
                      {index + 1}
                    </span>

                    <span>
                      {post.title}
                    </span>
                  </Link>
                )
              )}
            </section>
          )}

          {/* ==================================================
              TRANSFER HUB
              
              Keep the existing TransferHub component and its
              current editorial exclusion behavior.
          ================================================== */}

          <TransferHub
            excludedIds={
              excludedIds
            }
          />

        </aside>

      </div>

    </main>
  );
}