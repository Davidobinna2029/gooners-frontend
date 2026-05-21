import Link from "next/link";
import Image from "next/image";

import { WordPressPost } from "@/types/wordpress";

interface Props {
  posts: WordPressPost[];
}

export default function RelatedPosts({
  posts,
}: Props) {
  return (
    <section className="related-posts">
      <h2>
        More Arsenal Stories
      </h2>

      <div className="news-grid">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="news-card"
          >
            <div className="news-image">
              <Image
                src={
                  post.featuredImage
                }
                alt={
                  post.title.rendered
                }
                fill
                className="object-cover"
              />
            </div>

            <div className="news-content">
              <h3>
                {
                  post.title
                    .rendered
                }
              </h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}