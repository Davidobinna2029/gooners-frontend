import Link from "next/link";
import Image from "next/image";

const API =
  process.env
    .NEXT_PUBLIC_WORDPRESS_API;

async function getCategoryPosts(
  slug: string
) {
  const catRes = await fetch(
    `${API}/categories?slug=${slug}`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  const cats =
    await catRes.json();

  if (!cats.length) return [];

  const categoryId =
    cats[0].id;

  const postsRes = await fetch(
    `${API}/posts?_embed&categories=${categoryId}&per_page=4`,
    {
      next: {
        revalidate: 60,
      },
    }
  );

  return postsRes.json();
}

interface Props {
  title: string;
  slug: string;
}

export default async function CategorySection({
  title,
  slug,
}: Props) {
  const posts =
    await getCategoryPosts(
      slug
    );

  if (!posts.length) return null;

  return (
    <section className="category-section">
      <div className="section-title-row">
        <h2>{title}</h2>
      </div>

      <div className="category-grid">
        {posts.map((post: any) => {
          const image =
            post?._embedded?.[
              "wp:featuredmedia"
            ]?.[0]?.source_url ||
            "/fallback.jpg";

          return (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="category-card"
            >
              <div className="category-image">
                <Image
                  src={image}
                  alt={
                    post.title.rendered
                  }
                  fill
                />
              </div>

              <div className="category-content">
                <h3
                  dangerouslySetInnerHTML={{
                    __html:
                      post.title
                        .rendered,
                  }}
                />
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}