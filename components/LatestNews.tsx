import Link from "next/link";
import {
  getLatestPosts,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function LatestNews() {
  const posts = await getLatestPosts(1, 5);

  return (
    <div className="panel">
      <h2>Latest News</h2>

      <div className="news-list">
        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="news-card"
          >
            <img
              src={getFeaturedImage(post)}
              className="thumb-img"
              alt={post.title.rendered}
            />

            <div>
              <h3
                dangerouslySetInnerHTML={{
                  __html: post.title.rendered,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}