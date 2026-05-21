import Link from "next/link";
import Image from "next/image";

interface Props {
  posts: any[];
}

export default function FeaturedGrid({ posts }: Props) {
  if (!posts?.length) {
    return null;
  }

  return (
    <section>
      <div className="container">
        <h2>Latest Arsenal News</h2>

        <div className="news-grid">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="news-card"
            >
              <div className="news-image">
                <Image
                  src={post.featuredImage}
                  alt={post.title?.rendered || "Arsenal news"}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="news-content">
                <h3 dangerouslySetInnerHTML={{ __html: post.title?.rendered }} />
                <p>{post.category}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}