import Link from "next/link";
import Image from "next/image";

import Header from "@/components/Header";

import {
  getPosts,
  getFeaturedPosts,
} from "@/lib/wordpress";

import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";

export default async function HomePage() {
  const featured =
    await getFeaturedPosts();

  const posts =
    await getPosts();

  const hero =
    featured?.[0];

  return (
    <>
      <Header />

      {/* HERO */}

      <section className="hero-section">
        <div className="hero-image-wrap">
          {hero?.featuredImage ? (
            <Image
              src={
                hero.featuredImage
              }
              alt={
                hero.title.rendered
              }
              fill
              unoptimized
              className="hero-image"
            />
          ) : (
            <img
              src="/fallback.jpg"
              className="hero-image"
            />
          )}
        </div>

        <div className="hero-overlay">
          <div className="container">
            <div className="hero-content">
              <span>
                Breaking News
              </span>

              <h1
                dangerouslySetInnerHTML={{
                  __html:
                    hero?.title
                      ?.rendered ||
                    "",
                }}
              />

              <Link
                href={`/post/${hero?.slug}`}
                className="hero-btn"
              >
                Read More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN */}

      <main className="container homepage">
        {/* LEFT */}

        <section className="main-content">
          <div className="block">
            <div className="block-title red">
              Latest Arsenal News
            </div>

            <div className="news-list">
              {posts.map(
                (post: any) => (
                  <Link
                    key={post.id}
                    href={`/post/${post.slug}`}
                    className="news-row"
                  >
                    <div className="news-text">
                      <h3
                        dangerouslySetInnerHTML={{
                          __html:
                            post.title
                              .rendered,
                        }}
                      />
                    </div>

                    <div className="news-thumb">
                      {post.featuredImage ? (
                        <Image
                          src={
                            post.featuredImage
                          }
                          alt={
                            post.title
                              .rendered
                          }
                          fill
                          unoptimized
                          className="cover"
                        />
                      ) : (
                        <img src="/fallback.jpg" />
                      )}
                    </div>
                  </Link>
                )
              )}
            </div>
          </div>
        </section>

        {/* RIGHT */}

        <aside className="sidebar">
          <div className="sidebar-box">
            <div className="sidebar-title">
              Live Scores
            </div>

            <LiveScores />
          </div>

          <div className="sidebar-box">
            <div className="sidebar-title">
              Next Match
            </div>

            <NextMatch />
          </div>

          <div className="sidebar-box">
            <div className="sidebar-title">
              League Standings
            </div>

            <Standings />
          </div>
        </aside>
      </main>
    </>
  );
}