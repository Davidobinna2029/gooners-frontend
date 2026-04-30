export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Link from "next/link";
import Image from "next/image";
import {
  getLatestPosts,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function NewsPage({ searchParams }: any) {
  const currentPage = Number(searchParams?.page) || 1;

  const result = await getLatestPosts(currentPage, 12);
  const posts = result.data || [];
  const totalPages = result.totalPages || 1;

  return (
    <>
      <Header />

      <main className="container page-space">
        <section className="panel">
          <h1>Latest Arsenal News</h1>

          {posts.length === 0 ? (
            <p>No posts available.</p>
          ) : (
            <>
              <div className="bottom-grid">
                {posts.map((post: any) => (
                  <Link
                    key={post.id}
                    href={`/news/${post.slug}`}
                    className="news-tile"
                  >
                    <div className="tile-thumb">
                      <Image
                        src={getFeaturedImage(post)}
                        alt={post.title.rendered}
                        fill
                        className="tile-img"
                      />
                    </div>

                    <h4
                      dangerouslySetInnerHTML={{
                        __html: post.title.rendered,
                      }}
                    />
                  </Link>
                ))}
              </div>

              {/* PAGINATION */}
              <div className="pagination">
                {currentPage > 1 && (
                  <Link
                    href={`/news?page=${currentPage - 1}`}
                    className="page-btn"
                  >
                    ← Prev
                  </Link>
                )}

                {Array.from(
                  { length: totalPages },
                  (_, i) => i + 1
                )
                  .slice(
                    Math.max(0, currentPage - 2),
                    currentPage + 1
                  )
                  .map((page) => (
                    <Link
                      key={page}
                      href={`/news?page=${page}`}
                      className={`page-number ${
                        page === currentPage
                          ? "active"
                          : ""
                      }`}
                    >
                      {page}
                    </Link>
                  ))}

                {currentPage < totalPages && (
                  <Link
                    href={`/news?page=${currentPage + 1}`}
                    className="page-btn"
                  >
                    Next →
                  </Link>
                )}
              </div>
            </>
          )}
        </section>
      </main>

      <Footer />
    </>
  );
}