import Link from "next/link";

import {
  getCategories,
} from "@/lib/wordpress";

export default async function Header() {
  const categories =
    await getCategories();

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

            {categories
              ?.slice(0, 8)
              .map(
                (
                  category: any
                ) => (
                  <Link
                    key={
                      category.id
                    }
                    href={`/category/${category.slug}`}
                  >
                    {
                      category.name
                    }
                  </Link>
                )
              )}
          </div>
        </nav>
      </div>
    </header>
  );
}