import Link from "next/link";
import {
  getCategories,
} from "@/lib/wordpress";

export default async function Header() {
  const categories =
    await getCategories();

  return (
    <header className="site-header">
      <div className="topbar">
        <div className="container topbar-inner">
          <Link
            href="/"
            className="logo"
          >
            ArsenalTalks
          </Link>

          <nav className="nav-menu">
            <Link href="/">
              Home
            </Link>

            <Link href="/news">
              News
            </Link>

            {categories
              ?.slice(0, 6)
              ?.map(
                (
                  cat: any
                ) => (
                  <Link
                    key={
                      cat.id
                    }
                    href={`/category/${cat.slug}`}
                  >
                    {
                      cat.name
                    }
                  </Link>
                )
              )}
          </nav>
        </div>
      </div>
    </header>
  );
}