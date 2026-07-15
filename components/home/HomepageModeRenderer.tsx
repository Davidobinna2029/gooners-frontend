import Link from "next/link";

import Hero from "@/components/home/Hero";
import MatchHero from "@/components/home/MatchHero";
import LiveMatchBanner from "@/components/home/LiveMatchBanner";
import MatchCentreSection from "@/components/home/MatchCentreSection";
import NewsCard from "@/components/news/NewsCard";

import { HomepageMode } from "@/lib/matchday/mode";
import { fetchNextMatch } from "@/lib/football/services/match";

import type { HomepageFeed } from "@/lib/orchestrator/homepage";

interface Props {
  mode: HomepageMode;
  feed: HomepageFeed;
}

export default async function HomepageModeRenderer({
  mode,
  feed,
}: Props) {
  const hero = [
    ...(feed.heroMain ? [feed.heroMain] : []),
    ...feed.heroSide,
  ];

  const nextMatch = await fetchNextMatch();

  function renderHero() {
    switch (mode) {
      case HomepageMode.MATCHDAY_PRE:
      case HomepageMode.LIVE_MATCH:
      case HomepageMode.HALF_TIME:
      case HomepageMode.FULL_TIME:
      case HomepageMode.POST_MATCH:
        return <MatchHero nextMatch={nextMatch} />;

      case HomepageMode.NORMAL:
      case HomepageMode.TRANSFER_DEADLINE:
      case HomepageMode.BREAKING_NEWS:
      default:
        return <Hero featured={hero} />;
    }
  }

  return (
    <main className="sky-homepage">
      <LiveMatchBanner
        mode={mode}
        match={nextMatch}
      />

      <section className="hero-zone">
        {renderHero()}
      </section>

      <MatchCentreSection />

      <div className="homepage-shell">
        <div className="homepage-main">
          {feed.breaking.length > 0 && (
            <section className="homepage-section">
              <div className="section-header breaking">
                🔴 BREAKING
              </div>

              {feed.breaking.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                />
              ))}
            </section>
          )}

          {feed.latest.length > 0 && (
            <section className="homepage-section">
              <div className="section-header">
                Latest Arsenal News
              </div>

              {feed.latest.map((post) => (
                <NewsCard
                  key={post.id}
                  post={post}
                />
              ))}
            </section>
          )}
        </div>

        <aside className="homepage-sidebar">
          {feed.trending.length > 0 && (
            <section className="sidebar-card">
              <h3>Trending Now</h3>

              {feed.trending.map((post, index) => (
                <Link
                  key={post.id}
                  href={`/news/${post.slug}`}
                  className="trending-link"
                >
                  <span>{index + 1}</span>
                  {post.title}
                </Link>
              ))}
            </section>
          )}

          <section className="sidebar-card transfer-hub">
            <h3>Transfer Hub</h3>

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