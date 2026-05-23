import Link from "next/link";
import Image from "next/image";

import { NormalizedPost }
  from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function TrendingList({
  posts,
}: Props) {
  if (!posts?.length) return null;

  return (
    <section className="trending-section">
      <div className="container">
        <h2>Trending Now</h2>

        <div className="trending-list">
          {posts.map((post, index) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="trending-item"
            >
              <span className="trending-index">
                {String(index + 1).padStart(2, "0")}
              </span>

              <h3>{post.title}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}