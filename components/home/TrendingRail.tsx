import Link from "next/link";
import Image from "next/image";
import { WordPressPost } from "@/types/wordpress";

interface Props {
  posts: WordPressPost[];
}

export default function TrendingRail({ posts }: Props) {
  if (!posts?.length) {
    return null;
  }

  const trending = posts.slice(0, 5);

  return (
    <section className="trending-rail">
      <div className="container">
        <div className="section-heading">
          <h2>Trending Now</h2>
        </div>

        <div className="trending-grid">
          {trending.map((post) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="trending-card"
            >
              <div className="trending-image">
                <Image
                  src={post.featuredImage}
                  alt={post.title?.rendered || "Arsenal news"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="trending-content">
                <p className="trending-tag">{post.category}</p>

                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title?.rendered || "",
                  }}
                />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}