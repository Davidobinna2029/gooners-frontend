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

        {/* 🔴 BREAKING BAR */}
        <section className="breaking-bar">
          <div className="container">
            <span className="breaking-label">BREAKING</span>
            <div className="breaking-scroll">
              <span>Arsenal pushing for summer striker signing</span>
              <span> • </span>
              <span>Saka returns to full training ahead of clash</span>
              <span> • </span>
              <span>Arteta confirms tactical shift in midfield</span>
            </div>
          </div>
        </section>

        {/* 🔥 HERO */}
        <section className="hero">
          <div className="container hero-grid">

            <div className="hero-left">
              <span className="badge">Arsenal FC Fan Hub</span>

              <h1 className="hero-title">
                Arsenal News, Transfers,
                Fixtures & Live Scores
              </h1>

              <p className="hero-text">
                Fast, clean and reliable Arsenal coverage — breaking news,
                transfer updates, matchday insights and live football data.
              </p>

              <div className="btn-row">
                <Link href="/news" className="btn btn-red">
                  Latest News
                </Link>

                <Link href="/matches" className="btn btn-dark">
                  Fixtures
                </Link>
              </div>
            </div>

            <div className="panel hero-panel">
              <h2>Matchday Hub</h2>

              <ul className="hero-list">
                <li>✔ Live scores & match updates</li>
                <li>✔ Arsenal fixtures & kickoff times</li>
                <li>✔ Premier League standings</li>
                <li>✔ Transfer & injury updates</li>
                <li>✔ Built for mobile fans</li>
              </ul>
            </div>

          </div>
        </section>

        {/* 🧱 MAIN GRID */}
        <section className="container home-grid">

          {/* LEFT CONTENT */}
          <section className="content-column">

            {/* 🔥 LATEST NEWS */}
            <LatestNews />

            {/* ⚡ QUICK NAV */}
            <div className="panel">
              <h2>Explore Arsenal</h2>

              <div className="link-grid">
                <Link href="/category/transfers" className="mini-card">
                  Transfers
                </Link>

                <Link href="/matches" className="mini-card">
                  Fixtures
                </Link>

                <Link href="/standings" className="mini-card">
                  Standings
                </Link>

                <Link href="/category/community" className="mini-card">
                  Community
                </Link>
              </div>
            </div>

            {/* 📢 FAN MESSAGE */}
            <div className="panel">
              <h2>For Gooners</h2>

              <p className="muted">
                ArsenalTalks delivers fast, focused and reliable Arsenal coverage.
                Built for fans who want clarity without noise.
              </p>
            </div>

          </section>

          {/* 🧱 SIDEBAR */}
          <aside className="sidebar sticky-sidebar">

            {/* ⏱ NEXT MATCH */}
            <NextMatch />

            {/* ⚽ LIVE SCORES */}
            <LiveScores />

            {/* 📊 TABLE */}
            <Standings />

            {/* 🔥 TRENDING */}
            <div className="panel">
              <h2>Trending</h2>

              <ul className="list">
                <li>Saka injury update</li>
                <li>Striker transfer shortlist</li>
                <li>Declan Rice form analysis</li>
                <li>Arteta tactical changes</li>
                <li>Top four race heating up</li>
              </ul>
            </div>

            {/* 📂 POPULAR */}
            <div className="panel">
              <h2>Popular</h2>

              <ul className="list">
                <li><Link href="/news">Latest News</Link></li>
                <li><Link href="/category/transfers">Transfers</Link></li>
                <li><Link href="/matches">Fixtures</Link></li>
                <li><Link href="/standings">Standings</Link></li>
              </ul>
            </div>

            {/* 🗳 POLL */}
            <div className="panel">
              <h2>Fan Poll</h2>

              <p className="muted">
                Should Arsenal sign a striker this summer?
              </p>

              <div className="poll-buttons">
                <button className="vote-btn">Yes</button>
                <button className="vote-btn dark-btn">No</button>
              </div>
            </div>

            {/* 📧 NEWSLETTER */}
            <Newsletter />

            {/* 💰 AD */}
            <div className="panel ad-box">
              <span className="ad-label">Advertisement</span>

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