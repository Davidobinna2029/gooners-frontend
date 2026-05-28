import Link from "next/link";

import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function TrendingList({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="trending-section">
      <div className="container">

        <h2>Trending Now</h2>

        <div className="trending-list">
          {posts.map((post, index) => {
            const title = post.title ?? "Untitled";
            const slug = post.slug ?? "#";

            return (
              <Link
                key={post.id}
                href={`/news/${slug}`}
                className="trending-item"
              >
                <span className="trending-index">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <h3>{title}</h3>
              </Link>
            );
          })}
        </div>

      </div>
    </section>
  );
}