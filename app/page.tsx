import LatestNews from "@/components/LatestNews";
import InfiniteNews from "@/components/InfiniteNews";
import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";

export default function HomePage() {
  return (
    <main className="elite-homepage">
      {/* HERO */}
      <section className="elite-hero">
        <div className="hero-overlay">
          <div className="container hero-content">
            <span className="breaking-badge">
              ARSENAL DAILY
            </span>

            <h1>
              Arsenal News,
              Transfers,
              Fixtures &
              Live Match Updates
            </h1>

            <p>
              Your elite Arsenal destination
              for breaking news, transfer
              stories, Premier League
              standings, live scores and
              match coverage.
            </p>
          </div>
        </div>
      </section>

      {/* MAIN */}
      <section className="container homepage-layout">
        {/* LEFT */}
        <div className="homepage-main">
          <div className="section-block">
            <div className="section-title-row">
              <h2>
                Latest Arsenal News
              </h2>
            </div>

            <LatestNews />
          </div>

          <div className="section-block">
            <div className="section-title-row">
              <h2>
                More Stories
              </h2>
            </div>

            <InfiniteNews />
          </div>
        </div>

        {/* RIGHT */}
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