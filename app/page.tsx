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
        {/* HERO */}
        <section className="hero">
          <div className="container hero-grid">
            <div>
              <span className="badge">
                Arsenal FC Fan Hub
              </span>

              <h1 className="hero-title">
                Arsenal News, Transfers,
                Fixtures & Live Scores
              </h1>

              <p className="hero-text">
                The latest Arsenal stories,
                transfer updates, matchday
                coverage, live scores and
                league standings in one
                premium destination.
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

            <div className="panel hero-panel">
              <h2>Why ArsenalTalks?</h2>

              <ul className="hero-list">
                <li>
                  ✔ Fast Arsenal updates
                </li>
                <li>
                  ✔ Transfer rumours daily
                </li>
                <li>
                  ✔ Live football data
                </li>
                <li>
                  ✔ Fixtures & standings
                </li>
                <li>
                  ✔ Built for mobile fans
                </li>
              </ul>
            </div>
          </div>
        </section>

        {/* MAIN CONTENT */}
        <section className="container home-grid">
          {/* LEFT SIDE */}
          <section className="content-column">
            <LatestNews />

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
                  href="/category/community"
                  className="mini-card"
                >
                  Community
                </Link>
              </div>
            </div>

            <div className="panel">
              <h2>Fan Focus</h2>

              <p className="muted">
                ArsenalTalks gives Gooners
                sharp, clean and fast
                coverage all season long.
              </p>
            </div>
          </section>

          {/* SIDEBAR */}
          <aside className="sidebar sticky-sidebar">
            <NextMatch />

            <LiveScores />

            <Standings />

            <div className="panel">
              <h2>Trending Topics</h2>

              <ul className="list">
                <li>Saka injury update</li>
                <li>Summer striker race</li>
                <li>Rice form surge</li>
                <li>Arteta tactics</li>
                <li>Top four battle</li>
              </ul>
            </div>

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
                  <Link href="/matches">
                    Fixtures
                  </Link>
                </li>

                <li>
                  <Link href="/standings">
                    Standings
                  </Link>
                </li>
              </ul>
            </div>

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

            <Newsletter />

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