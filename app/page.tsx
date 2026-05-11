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

export default async function HomePage() {
  const posts =
    await getPosts(1);

  const featuredPosts =
    await getFeaturedPosts();

  const categories =
    await getCategories();

  return (
    <>
      <HeroCarousel
        posts={featuredPosts}
      />

      <div className="container homepage-layout">
        <main className="homepage-main">
          <section className="section-block">
            <div className="section-title-row">
              <h2>
                Latest Arsenal News
              </h2>
            </div>

            <InfiniteNews
              initialPosts={posts}
            />
          </section>

          {categories?.length >
            0 && (
            <section className="section-block">
              <div className="section-title-row">
                <h2>
                  Categories
                </h2>
              </div>

              <div className="category-grid">
                {categories.map(
                  (
                    category: any
                  ) => (
                    <a
                      key={
                        category.id
                      }
                      href={`/category/${category.slug}`}
                      className="category-card"
                    >
                      <div className="category-content">
                        <h3>
                          {
                            category.name
                          }
                        </h3>

                        <p>
                          {
                            category.count
                          }{" "}
                          posts
                        </p>
                      </div>
                    </a>
                  )
                )}
              </div>
            </section>
          )}
        </main>

        <aside className="homepage-sidebar">
          <LiveScores />

          <Standings />

          <NextMatch />
        </aside>
      </div>
    </>
  );
}