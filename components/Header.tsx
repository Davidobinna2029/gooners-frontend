import Link from "next/link";

export default function Header() {
  return (
    <header className="site-header">
      <div className="container">
        <nav className="navbar">
          <Link
            href="/"
            className="logo"
          >
            ArsenalTalks
          </Link>

          <div className="nav-links">
            <Link href="/">
              Home
            </Link>

            <Link href="/news">
              News
            </Link>

            <Link href="/category/transfers">
              Transfers
            </Link>

            <Link href="/category/premier-league">
              Premier League
            </Link>

            <Link href="/category/champions-league">
              Champions League
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}