import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LatestNews from "@/components/LatestNews";
import LiveScores from "@/components/LiveScores";
import Standings from "@/components/Standings";
import NextMatch from "@/components/NextMatch";
import Newsletter from "@/components/Newsletter";
import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <Header />

      <main>
        {/* HERO SECTION */}
        <section className="hero">
          <div className="container hero-grid">
            {/* LEFT SIDE */}
            <div>
              <span className="badge">
                Arsenal FC Independent Fan Platform
              </span>

              <h1 className="hero-title">
                Arsenal News, Transfers,
                Fixtures & Live Scores
              </h1>

              <p className="hero-text">
                Breaking Arsenal updates,
                transfer rumours, matchday
                reactions, live football scores
                and Premier League standings —
                all in one elite destination.
              </p>

              <div className="btn-row">
                <Link
                  href="/news"
                  className="btn btn-red"
                >
                  Latest News
                </Link>

                <Link
                  href="/live-scores"
                  className="btn btn-dark"
                >
                  Live Scores
                </Link>
              </div>
            </div>

            {/* RIGHT HERO CARD */}
            <div className="panel hero-panel">
              <h2>Why ArsenalTalks?</h2>

              <ul className="hero-list">
                <li>
                  ✔ Breaking Arsenal news daily
                </li>
                <li>
                  ✔ Transfer rumours & updates
                </li>
                <li>
                  ✔ Live football scores
                </li>
                <li>
                  ✔ Fixtures & league table
                </li>
                <li>
                  ✔ Fast mobile experience
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* MAIN GRID */}
        <section className="container home-grid">
          {/* LEFT COLUMN */}
          <section className="content-column">
            <LatestNews />

            {/* QUICK LINKS */}
            <div className="panel">
              <h2>Explore More</h2>

              <div className="link-grid">
                <Link
                  href="/category/transfers"
                  className="mini-card"
                >
                  Transfers
                </Link>

                <Link
                  href="/matches"
                  className="mini-card"
                >
                  Fixtures
                </Link>

                <Link
                  href="/standings"
                  className="mini-card"
                >
                  Standings
                </Link>

                <Link
                  href="/category/match-reports"
                  className="mini-card"
                >
                  Reports
                </Link>
              </div>
            </div>

            {/* EXTRA SECTION */}
            <div className="panel">
              <h2>Fan Focus</h2>

              <p className="muted">
                ArsenalTalks delivers smart,
                fast and fan-first coverage for
                every Gooner worldwide.
              </p>
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="sidebar sticky-sidebar">
            <NextMatch />

            <LiveScores />

            <Standings />

            {/* TRENDING */}
            <div className="panel">
              <h2>Trending Topics</h2>

              <ul className="list">
                <li>Saka injury update</li>
                <li>Summer striker targets</li>
                <li>Rice top form</li>
                <li>Arteta tactics</li>
                <li>Champions League race</li>
              </ul>
            </div>

            {/* POPULAR */}
            <div className="panel">
              <h2>Popular Sections</h2>

              <ul className="list">
                <li>
                  <Link href="/news">
                    Latest News
                  </Link>
                </li>

                <li>
                  <Link href="/category/transfers">
                    Transfers
                  </Link>
                </li>

                <li>
                  <Link href="/category/injuries">
                    Injuries
                  </Link>
                </li>

                <li>
                  <Link href="/category/community">
                    Community
                  </Link>
                </li>
              </ul>
            </div>

            {/* POLL */}
            <div className="panel">
              <h2>Fan Poll</h2>

              <p className="muted">
                Should Arsenal sign a new
                striker this summer?
              </p>

              <div className="poll-buttons">
                <button className="vote-btn">
                  Yes
                </button>

                <button className="vote-btn dark-btn">
                  No
                </button>
              </div>
            </div>

            {/* NEWSLETTER */}
            <Newsletter />

            {/* AD SPACE */}
            <div className="panel ad-box">
              <span className="ad-label">
                Advertisement
              </span>

              <div className="ad-placeholder">
                300 x 250 Ad Space
              </div>
            </div>
          </aside>
        </section>
      </main>

      <Footer />
    </>
  );
}