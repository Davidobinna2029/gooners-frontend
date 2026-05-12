import HeroMagazine from "@/components/HeroMagazine";
import InfiniteNews from "@/components/InfiniteNews";
import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";

import {
  getPosts,
  getFeaturedPosts,
} from "@/lib/wordpress";

export default async function HomePage() {
  const posts =
    await getPosts(1);

  const featuredPosts =
    await getFeaturedPosts();

  return (
    <>
      <HeroMagazine
        posts={featuredPosts}
      />

      <div className="container homepage-layout">
        <main className="homepage-main">
          <section className="section-block">
            <div className="section-title-row">
              <h2>
                Latest News
              </h2>
            </div>

            <InfiniteNews
              initialPosts={posts}
            />
          </section>
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