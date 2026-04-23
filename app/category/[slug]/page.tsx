import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import {
  getPostsByCategorySlug,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts =
    await getPostsByCategorySlug(
      params.slug
    );

  return (
    <>
      <Header />

      <main className="container page-space">
        <div className="panel">
          <h2>
            {params.slug.replace("-", " ")}
          </h2>

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