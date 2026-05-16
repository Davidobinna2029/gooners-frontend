import Link from "next/link";

export default function Header() {
  return (
    <header className="header">
      <div className="header-inner">
        {/* LOGO */}
        <Link href="/" className="logo">
          ArsenalTalks
        </Link>

        {/* NAV */}
        <nav className="nav">
          <Link href="/category/transfer-news">
            Transfers
          </Link>

          <Link href="/category/injury-news">
            Injuries
          </Link>

          <Link href="/category/ucl">
            UCL
          </Link>

          <Link href="/category/opinions">
            Opinions
          </Link>
        </nav>
      </div>
    </header>
  );
}