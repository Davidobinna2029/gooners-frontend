import { API_BASE } from "@/lib/api/core/apiBase";
import { sanitizeHtml } from "@/lib/sanitize/sanitizeHtml";

export const revalidate = 30;

async function getPosts() {
  try {
    const res = await fetch(
      `${API_BASE}/posts?per_page=20&_embed=1`,
      { next: { revalidate: 30 } }
    );

    if (!res.ok) return [];

    const data = await res.json();
    return Array.isArray(data) ? data : [];
  } catch (err) {
    console.error("Posts request error:", err);
    return [];
  }
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <main className="news-page">
      <header className="news-header">
        <h1 className="news-title">Latest News</h1>
      </header>

      {posts.length === 0 ? (
        <p>No news available right now.</p>
      ) : (
        <div className="news-grid">
          {posts.map((post: any) => {
            const title = sanitizeHtml(
              post?.title?.rendered ?? "Untitled"
            );

            const slug = post?.slug ?? "#";

            return (
              <article key={post.id} className="news-card">
                <a href={`/news/${slug}`}>
                  <h2>{title}</h2>
                </a>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
}