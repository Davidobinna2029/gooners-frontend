import Link from "next/link";

import {
  getPosts,
} from "@/lib/wordpress";

export default async function LatestNews() {
  const posts: any =
    await getPosts();

  return (
    <section className="latest-news">
      <div className="section-header">
        <h2>
          Latest Arsenal News
        </h2>
      </div>

      <div className="news-grid">
        {posts?.map(
          (post: any) => {
            const image =
              post?._embedded?.[
                "wp:featuredmedia"
              ]?.[0]
                ?.source_url ||
              post?.jetpack_featured_media_url ||
              "/fallback.jpg";

            return (
              <article
                key={post.id}
                className="news-card"
              >
                <Link
                  href={`/news/${post.slug}`}
                >
                  <div className="news-image">
                    <img
                      src={image}
                      alt={
                        post.title
                          .rendered
                      }
                    />
                  </div>

                  <div className="news-content">
                    <h3>
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            post
                              .title
                              .rendered,
                        }}
                      />
                    </h3>
                  </div>
                </Link>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}