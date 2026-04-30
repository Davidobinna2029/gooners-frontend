import Link from "next/link";
import {
  getLatestPosts,
} from "@/lib/wordpress";

export default async function LatestNews() {
  // Fetch posts safely (already normalized in wordpress.ts)
  const posts = await getLatestPosts(1, 6);

  return (
    <div className="panel">
      <h2>Latest Arsenal News</h2>

      {/* EMPTY STATE (CRASH PROTECTION) */}
      {!posts || posts.length === 0 ? (
        <p className="muted">
          No news available right now. Please check back shortly.
        </p>
      ) : (
        <div className="news-list">
          {posts.map((post: any) => (
            <Link
              key={post.id}
              href={`/news/${post.slug}`}
              className="news-card"
            >
              {/* IMAGE */}
              <img
                src={post.image || "/placeholder.jpg"}
                alt={post.title}
                className="thumb-img"
                loading="lazy"
              />

              {/* CONTENT */}
              <div>
                <h3
                  dangerouslySetInnerHTML={{
                    __html: post.title,
                  }}
                />

                <p>
                  {post.date
                    ? new Date(post.date).toLocaleDateString()
                    : "No date"}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}