import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types";

interface Props {
  posts: CanonicalPost[];
}

export default function FeaturedGrid({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) return null;

  return (
    <section className="featured-grid">
      <div className="container">

        <div className="grid-layout">
          {posts.map((post) => (
            <article key={post.id} className="featured-card">

              <Link href={`/news/${post.slug}`}>

                {/* IMAGE WRAPPER (FIXED FOR next/image fill) */}
                <div className="featured-image">
                  <Image
                    src={post.image?.url || "/fallback.jpg"}
                    alt={post.title || "Featured image"}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>

                <div className="featured-content">
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                </div>

              </Link>

            </article>
          ))}
        </div>

      </div>
    </section>
  );
}