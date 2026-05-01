import Link from "next/link";
import {
  getLatestPosts,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function NewsPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Number(searchParams.page || 1);
  const posts = await getLatestPosts(page, 10);

  return (
    <div className="panel">
      <h2>Latest Arsenal News</h2>

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

              <p>
                {new Date(post.date).toLocaleDateString()}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}