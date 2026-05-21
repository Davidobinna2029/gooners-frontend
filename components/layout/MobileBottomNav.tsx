import Link from "next/link";

export default function MobileBottomNav() {
  return (
    <nav className="mobile-bottom-nav">
      <Link href="/">
        Home
      </Link>

      <Link href="/live">
        Live
      </Link>

      <Link href="/fixtures">
        Fixtures
      </Link>

      <Link href="/standings">
        Table
      </Link>

      <Link href="/search">
        Search
      </Link>
    </nav>
  );
}