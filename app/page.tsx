export const revalidate = 30;

import Link from "next/link";

import Hero from "@/components/home/Hero";
import NewsCard from "@/components/news/NewsCard";

import { getPosts } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

async function safeFetch<T>(p: Promise<T>, fallback: T): Promise<T> {
  try {
    return await p;
  } catch {
    return fallback;
  }
}

export default async function HomePage() {
  const [rawPosts] = await Promise.all([
    safeFetch(getPosts(), []),
  ]);

  const posts = mapWordPressPosts(
    Array.isArray(rawPosts) ? rawPosts : []
  );

  const feed = buildHomepageFeed(posts);

  /**
   * =========================
   * HERO SECTION (TOP PRIORITY)
   * =========================
   */
  const hero = (feed.hero || []).slice(0, 4);

  const heroIds = new Set(hero.map((p) => p.id));

  /**
   * =========================
   * LATEST FEED (MAIN CONSUMPTION LAYER)
   * =========================
   */
  const latestPool = (feed.featured || []).filter(
    (p) => !heroIds.has(p.id)
  );

  const latest = latestPool.slice(0, 12);

  /**
   * =========================
   * TRANSFERS (INTENT CLUSTER)
   * =========================
   */
  const transfers = (feed.transfer || []).slice(0, 6);

  /**
   * =========================
   * EDITORIAL PICKS (AUTHORITY LAYER)
   * =========================
   */
  const editors = (feed.editors || []).slice(0, 6);

  return (
    <main className="home-page">

      {/* =========================
          HERO SECTION
      ========================= */}
      {hero.length > 0 && (
        <section className="hero-zone">
          <Hero featured={hero} />
        </section>
      )}

      {/* =========================
          LATEST NEWS (PRIMARY FEED)
      ========================= */}
      {latest.length > 0 && (
        <section className="homepage-section">
          <div className="container">
            <h2 className="section-title">Latest Arsenal News</h2>

            <div className="homepage-grid">
              {latest.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          TRANSFER WATCH
      ========================= */}
      {transfers.length > 0 && (
        <section className="homepage-section">
          <div className="container">
            <h2 className="section-title">Transfer Watch</h2>

            <div className="homepage-grid">
              {transfers.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          EDITOR'S PICKS
      ========================= */}
      {editors.length > 0 && (
        <section className="homepage-section">
          <div className="container">
            <h2 className="section-title">Editor&apos;s Picks</h2>

            <div className="homepage-grid">
              {editors.map((post) => (
                <NewsCard key={post.id} post={post} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================
          MORE STORIES CTA
      ========================= */}
      <section className="homepage-more">
        <div className="container">
          <Link href="/news" className="more-stories-btn">
            More Stories →
          </Link>
        </div>
      </section>

    </main>
  );
}