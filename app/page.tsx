import Link from "next/link";
import Image from "next/image";

import HeroCarousel from "@/components/HeroCarousel";
import InfiniteNews from "@/components/InfiniteNews";
import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";

import {
  getPosts,
  getFeaturedPosts,
  getCategories,
} from "@/lib/wordpress";

import {
  getLiveScores,
  getStandings,
  getNextMatch,
} from "@/lib/football";

export default async function HomePage() {
  const posts = await getPosts(1);

  const featuredPosts =
    await getFeaturedPosts();

  const categories =
    await getCategories();

  const liveScores =
    await getLiveScores();

  const standings =
    await getStandings();

  const nextMatch =
    await getNextMatch();

  return (
    <>
      {/* HERO */}
      <HeroCarousel
        posts={featuredPosts}
      />

      {/* MAIN */}
      <div className="container">
        <div className="homepage-layout">
          {/* LEFT */}
          <main className="homepage-main">
            {/* CATEGORIES */}
            <section className="section-block">
              <div className="section-title-row">
                <h2>Categories</h2>
              </div>

              <div className="nav-links">
                <Link href="/">
                  Home
                </Link>

                {categories?.map(
                  (category: any) => (
                    <Link
                      key={category.id}
                      href={`/category/${category.slug}`}
                    >
                      {category.name}
                    </Link>
                  )
                )}
              </div>
            </section>

            {/* TOP STORIES */}
            <section className="section-block">
              <div className="section-title-row">
                <h2>
                  Top Arsenal Stories
                </h2>
              </div>

              <div className="news-grid">
                {posts
                  ?.slice(0, 6)
                  ?.map((post: any) => (
                    <Link
                      href={`/news/${post.slug}`}
                      key={post.id}
                      className="news-card"
                    >
                      <div className="news-image">
                        <Image
                          src={
                            post.featuredImage ||
                            "/fallback.jpg"
                          }
                          alt={
                            post.title
                              ?.rendered
                          }
                          fill
                          unoptimized
                          className="object-cover"
                        />
                      </div>

                      <div className="news-content">
                        <h3
                          dangerouslySetInnerHTML={{
                            __html:
                              post.title
                                ?.rendered,
                          }}
                        />

                        <p
                          dangerouslySetInnerHTML={{
                            __html:
                              post.excerpt
                                ?.rendered
                                ?.replace(
                                  /<[^>]+>/g,
                                  ""
                                )
                                ?.slice(
                                  0,
                                  120
                                ) +
                              "...",
                          }}
                        />
                      </div>
                    </Link>
                  ))}
              </div>
            </section>

            {/* LATEST NEWS */}
            <section className="section-block">
              <div className="section-title-row">
                <h2>Latest News</h2>
              </div>

              <InfiniteNews
                initialPosts={posts}
              />
            </section>
          </main>

          {/* SIDEBAR */}
          <aside className="homepage-sidebar">
            <LiveScores
              matches={liveScores}
            />

            <Standings
              standings={standings}
            />

            <NextMatch
              match={nextMatch}
            />
          </aside>
        </div>
      </div>
    </>
  );
}