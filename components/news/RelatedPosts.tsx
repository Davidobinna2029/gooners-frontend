import Link from "next/link";
import Image from "next/image";

import { NormalizedPost }
  from "@/lib/mappers/wordpressMapper";

interface Props {
  posts: NormalizedPost[];
}

export default function RelatedPosts({
  posts,
}: Props) {
  if (!posts?.length) return null;

  return (
    <section className="related-posts">
      <div className="container">
        <h2>Related Posts</h2>

        <div className="related-grid">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="related-card"
            >
              <div className="related-image">
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