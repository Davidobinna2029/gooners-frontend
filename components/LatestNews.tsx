import Link from "next/link";
import Image from "next/image";

import {
  getPosts,
} from "@/lib/wordpress";

export default async function LatestNews() {
  const posts: any =
    await getPosts();

  return (
    <section className="latest-news">
      <h2>
        Latest Arsenal News
      </h2>

      <div className="news-grid">
        {posts?.map(
          (post: any) => {
            const image =
              post?._embedded?.[
                "wp:featuredmedia"
              ]?.[0]
                ?.source_url ||
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
                    <Image
                      src={image}
                      alt={
                        post.title
                          .rendered
                      }
                      width={1200}
                      height={700}
                      priority
                    />
                  </div>

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
                </Link>
              </article>
            );
          }
        )}
      </div>
    </section>
  );
}