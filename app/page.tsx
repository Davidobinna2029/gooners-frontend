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

* HERO STORIES
  */
  const hero = (feed.hero || []).slice(0, 4);

const heroIds = new Set(hero.map((p) => p.id));

/**

* LATEST FEED
  */
  const latestPool = (feed.featured || []).filter(
  (p) => !heroIds.has(p.id)
  );

const latest = latestPool.slice(0, 15);

/**

* TRANSFERS
  */
  const transfers = (feed.transfer || []).slice(0, 8);

/**

* EDITOR PICKS
  */
  const editors = (feed.editors || []).slice(0, 6);

/**

* TRENDING
  */
  const trending = latest.slice(0, 5);

return ( <main className="sky-homepage">

```
  {/* HERO */}
  {hero.length > 0 && (
    <section className="hero-zone">
      <Hero featured={hero} />
    </section>
  )}

  <div className="homepage-shell">

    {/* MAIN FEED */}
    <div className="homepage-main">

      {/* BREAKING */}
      {hero.length > 1 && (
        <section className="homepage-section">
          <div className="section-header breaking">
            🔴 BREAKING
          </div>

          {hero.slice(1, 4).map((post) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </section>
      )}

      {/* LATEST NEWS */}
      {latest.length > 0 && (
        <section className="homepage-section">
          <div className="section-header">
            Latest Arsenal News
          </div>

          {latest.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </section>
      )}

      {/* TRANSFER WATCH */}
      {transfers.length > 0 && (
        <section className="homepage-section">
          <div className="section-header">
            Transfer Watch
          </div>

          {transfers.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </section>
      )}

    </div>

    {/* SIDEBAR */}
    <aside className="homepage-sidebar">

      {/* EDITOR PICKS */}
      {editors.length > 0 && (
        <section className="sidebar-card">
          <h3>Editor's Picks</h3>

          {editors.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="sidebar-link"
            >
              {post.title}
            </Link>
          ))}
        </section>
      )}

      {/* TRENDING */}
      {trending.length > 0 && (
        <section className="sidebar-card">
          <h3>Trending Now</h3>

          {trending.map((post, index) => (
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

      {/* TRANSFER HUB */}
      <section className="sidebar-card transfer-hub">
        <h3>Transfer Hub</h3>

        <p>
          Follow the latest Arsenal transfer
          rumours, negotiations and confirmed
          deals throughout the window.
        </p>

        <Link href="/news">
          View Transfer Coverage →
        </Link>
      </section>

    </aside>

  </div>

  {/* MORE STORIES */}
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
```

);
}
