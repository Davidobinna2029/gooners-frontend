import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container header-inner">

        {/* LOGO */}

        <Link
          href="/"
          className="logo"
        >
          ArsenalTalks
        </Link>

        {/* NAVIGATION */}

        <nav className="nav-links">
          <Link href="/">
            Home
          </Link>

          <Link href="/news">
            News
          </Link>

          <Link href="/live">
            Live
          </Link>

          <Link href="/standings">
            Standings
          </Link>

          <Link href="/fixtures">
            Fixtures
          </Link>

          <Link href="/transfers">
            Transfers
          </Link>

          <Link href="/search">
            Search
          </Link>
        </nav>
      </div>
    </header>
  );
}