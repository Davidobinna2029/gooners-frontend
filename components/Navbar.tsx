import Link from "next/link";

import {
  getCategories,
} from "@/lib/wordpress";

export default async function Navbar() {
  const categories =
    await getCategories();

  return (
    <header className="site-header">
      {/* TOP HEADER */}

      <div className="top-header">
        <div className="container top-header-inner">
          <Link
            href="/"
            className="logo"
          >
            ArsenalTalks
          </Link>

          <div className="site-tagline">
            Where Gooners Speak Football
          </div>
        </div>
      </div>

      {/* NAVIGATION */}

      <div className="menu-wrapper">
        <div className="container">
          <nav className="navbar">
            <Link href="/">
              Home
            </Link>

            <Link href="/news">
              Latest News
            </Link>

            {categories
              ?.slice(0, 8)
              .map((cat: any) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                >
                  {cat.name}
                </Link>
              ))}
          </nav>
        </div>
      </div>
    </header>
  );
}