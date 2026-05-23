import Link from "next/link";
import Image from "next/image";

import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function LatestNews({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <section className="latest-news">
      <div className="container">

        <h2>Latest News</h2>

        <div className="news-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="news-card"
            >
              <div className="news-image">
                <Image
                  src={post.image || "/fallback.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover"
                />
              </div>

              <h3>{post.title}</h3>
            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}