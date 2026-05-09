import Link from "next/link";
import { getPosts } from "@/lib/wordpress";

export default async function NewsPage() {
  const posts: any = await getPosts();

  return (
    <main className="container">
      <h1>Arsenal News</h1>

      <div className="news-grid">
        {posts.map((post: any) => {
          const image =
            post?._embedded?.[
              "wp:featuredmedia"
            ]?.[0]?.source_url;

          return (
            <article key={post.id}>
              {image && (
                <img
                  src={image}
                  alt={
                    post.title.rendered
                  }
                />
              )}

              <h2>
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
              </h2>
            </article>
          );
        })}
      </div>
    </main>
  );
}