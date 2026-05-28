import Link from "next/link";
import Image from "next/image";

import type { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function TrendingRail({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="trending-rail">
      <div className="container">
        <h2>Trending</h2>

        <div className="rail-scroll">
          {posts.map((post) => {
            const title = post.title ?? "Untitled";
            const image = post.image || "/fallback.jpg";
            const slug = post.slug ?? "#";

            return (
              <Link
                key={post.id}
                href={`/news/${slug}`}
                className="rail-card"
              >
                <div className="rail-image">
                  <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 60vw, 25vw"
                    className="object-cover"
                    loading="lazy"
                    quality={75}
                  />
                </div>

                <h3>{title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}