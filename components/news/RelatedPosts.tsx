import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  posts: CanonicalPost[];
}

export default function RelatedPosts({ posts }: Props) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return null;
  }

  return (
    <section className="related-posts">
      <div className="container">
        <h2>Related Posts</h2>

        <div className="related-grid">
          {posts.map((post) => {
            const imageUrl = post.image?.url || "/fallback.jpg";

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="related-card"
              >
                <div className="related-image">
                  <Image
                    src={imageUrl}
                    alt={post.title || "Related news"}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h3>{post.title}</h3>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}