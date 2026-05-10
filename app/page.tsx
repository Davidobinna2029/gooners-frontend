import HeroCarousel from "@/components/HeroCarousel";
import BreakingTicker from "@/components/BreakingTicker";
import CategorySection from "@/components/CategorySection";
import InfiniteNews from "@/components/InfiniteNews";

import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";

const API =
  process.env
    .NEXT_PUBLIC_WORDPRESS_API;

async function getHeroPosts() {
  const res = await fetch(
    `${API}/posts?_embed&per_page=5`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return res.json();
}

export default async function HomePage() {
  const heroPosts =
    await getHeroPosts();

  return (
    <main>
      <BreakingTicker />

      <HeroCarousel
        posts={heroPosts}
      />

      <section className="container homepage-layout">
        <div className="homepage-main">
          <CategorySection
            title="Transfer News"
            slug="transfer-news"
          />

          <CategorySection
            title="Matchday"
            slug="matchday"
          />

          <CategorySection
            title="Arsenal Women"
            slug="arsenal-women"
          />

          <CategorySection
            title="Opinion"
            slug="opinion"
          />

          <section>
            <div className="section-title-row">
              <h2>
                Latest Stories
              </h2>
            </div>

            <InfiniteNews />
          </section>
        </div>

        <aside className="homepage-sidebar">
          <div className="sidebar-card">
            <div className="sidebar-title">
              Live Scores
            </div>

            <LiveScores />
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">
              Premier League Table
            </div>

            <Standings />
          </div>

          <div className="sidebar-card">
            <div className="sidebar-title">
              Arsenal Next Match
            </div>

            <NextMatch />
          </div>
        </aside>
      </section>
    </main>
  );
}