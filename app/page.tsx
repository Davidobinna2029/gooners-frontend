import HeroCarousel from "@/components/HeroCarousel";
import NewsCard from "@/components/NewsCard";

import LiveScores from "@/components/LiveScores";
import LeagueTable from "@/components/LeagueTable";
import NextMatch from "@/components/NextMatch";

import {
  getPosts,
} from "@/lib/wordpress";

export default async function HomePage() {
  const posts =
    await getPosts(1);

  const heroPosts =
    posts.slice(0, 4);

  const latestPosts =
    posts.slice(4, 10);

  return (
    <>
      <HeroCarousel
        posts={heroPosts}
      />

      <div className="container">
        <div className="portal-layout">
          <main className="portal-main">
            <section className="portal-section">
              <div className="section-heading">
                <h2>
                  Latest Arsenal
                  News
                </h2>
              </div>

              <div className="portal-news-list">
                {latestPosts.map(
                  (
                    post: any
                  ) => (
                    <NewsCard
                      key={
                        post.id
                      }
                      post={
                        post
                      }
                    />
                  )
                )}
              </div>
            </section>
          </main>

          <aside className="portal-sidebar">
            <LiveScores />

            <NextMatch />

            <LeagueTable />
          </aside>
        </div>
      </div>
    </>
  );
}