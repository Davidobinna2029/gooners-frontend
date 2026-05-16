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

            <Link href="/category/transfer-news">
              Transfer News
            </Link>

            <Link href="https://shop.arsenaltalks.com">
              Shop
            </Link>

            <Link href="/category/opinions">
              Opinions
            </Link>

            <Link href="/category/injury-news">
              Injury News
            </Link>

            <Link href="/about">
              About
            </Link>

            <Link href="/contact">
              Contact
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}