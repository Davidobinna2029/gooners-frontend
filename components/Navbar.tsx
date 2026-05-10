import Link from "next/link";

const API =
  process.env
    .NEXT_PUBLIC_WORDPRESS_API;

async function getCategories() {
  const res = await fetch(
    `${API}/categories?per_page=8`,
    {
      next: {
        revalidate: 120,
      },
    }
  );

  return res.json();
}

export default async function Navbar() {
  const categories =
    await getCategories();

  return (
    <header className="site-header">
      <div className="container navbar">
        <Link
          href="/"
          className="logo"
        >
          ArsenalTalks
        </Link>

        <nav className="nav-links">
          <Link href="/">
            Home
          </Link>

          {categories.map(
            (cat: any) => (
              <Link
                key={cat.id}
                href={`/category/${cat.slug}`}
              >
                {cat.name}
              </Link>
            )
          )}
        </nav>
      </div>
    </header>
  );
}