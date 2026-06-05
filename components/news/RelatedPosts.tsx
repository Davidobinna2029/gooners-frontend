import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  posts: CanonicalPost[];
}

export default function RelatedPosts({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <section className="related-posts">
      <div className="container">
        <h2>Related Posts</h2>

        <div className="related-grid">
          {posts.map((post) => {
            const imageUrl = post.image?.url;

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="related-card"
              >
                <div className="related-image">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="related-content">
                  <h3>{post.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}