import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  getLatestPosts,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function NewsPage() {
  const posts = await getLatestPosts();

  return (
    <>
      <Header />

      <main className="container page-space">
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
                  alt={post.title.rendered}
                  className="thumb-img"
                />

                <div>
                  <h3
                    dangerouslySetInnerHTML={{
                      __html:
                        post.title.rendered,
                    }}
                  />

                  <p>
                    {new Date(
                      post.date
                    ).toLocaleDateString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}