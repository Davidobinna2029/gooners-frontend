import Link from "next/link";
import Image from "next/image";
import {
  getLatestPosts,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function LatestNews() {
  const result =
    await getLatestPosts(1, 5);

  const posts =
    result.data || [];

  return (
    <div className="panel">
      <h2>
        Latest Arsenal News
      </h2>

      {posts.length === 0 ? (
        <p className="muted">
          No posts available.
        </p>
      ) : (
        <div className="news-list">
          {posts.map(
            (post: any) => (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="news-card"
              >
                <Image
                  src={getFeaturedImage(
                    post
                  )}
                  alt={
                    post.title
                      .rendered
                  }
                  width={140}
                  height={92}
                  className="thumb-img"
                />

                <div>
                  <h3
                    dangerouslySetInnerHTML={{
                      __html:
                        post.title
                          .rendered,
                    }}
                  />

                  <p>
                    {new Date(
                      post.date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            )
          )}
        </div>
      )}
    </div>
  );
}