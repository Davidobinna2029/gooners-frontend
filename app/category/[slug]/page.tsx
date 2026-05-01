import Link from "next/link";
import { getFeaturedImage } from "@/lib/wordpress";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/category/${params.slug}`,
    { cache: "no-store" }
  );

  const posts = await res.json();

  return (
    <div className="panel">
      <h2>{params.slug.replace("-", " ")}</h2>

      <div className="news-list">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="news-card"
          >
            <img
              src={getFeaturedImage(post)}
              className="thumb-img"
            />
            <h3
              dangerouslySetInnerHTML={{
                __html: post.title.rendered,
              }}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}