import Link from "next/link";

interface Props {
  posts: any[];
}

export default function TrendingList({ posts }: Props) {
  if (!posts?.length) return null;

  return (
    <section className="trending-section">
      <div className="container">
        <h2>Trending Now</h2>

        <div className="trending-list">
          {posts.map((post: any, index) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="trending-item"
            >
              <span>{String(index + 1).padStart(2, "0")}</span>

              <h3
                dangerouslySetInnerHTML={{
                  __html: post.title?.rendered || "",
                }}
              />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}