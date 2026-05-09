import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export default async function LatestNews() {
  const posts: any = await getPosts();

  return (
    <section className="latest-news">
      <h2>Latest Arsenal News</h2>

      <div className="news-grid">
        {posts.map((post: any) => {
          const image =
            post?._embedded?.[
              "wp:featuredmedia"
            ]?.[0]?.source_url;

          return (
            <article
              key={post.id}
              className="news-card"
            >
              {image && (
                <img
                  src={image}
                  alt={
                    post.title.rendered
                  }
                />
              )}

              <h3>
                <Link
                  href={`/news/${post.slug}`}
                >
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        post.title
                          .rendered,
                    }}
                  />
                </Link>
              </h3>
            </article>
          );
        })}
      </div>
    </section>
  );
}