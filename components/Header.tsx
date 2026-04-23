import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container navbar">

        <Link href="/" className="logo">
          ArsenalTalks
        </Link>

        <nav className="nav-links">
          <Link href="/">Home</Link>
          <Link href="/news">News</Link>
          <Link href="/matches">Matches</Link>
          <Link href="/live-scores">Live Scores</Link>
          <Link href="/standings">Standings</Link>
        </nav>

      </div>
    </header>
  );
}