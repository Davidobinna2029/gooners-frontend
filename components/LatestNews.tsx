import Link from "next/link";

async function getPosts() {
  try {
    const res = await fetch("/api/posts", {
      cache: "no-store",
    });

    if (!res.ok) throw new Error("Failed to fetch");

    return await res.json();
  } catch (err) {
    console.error("Frontend fetch error:", err);
    return [];
  }
}

export default async function LatestNews() {
  const posts = await getPosts();

  return (
    <div className="panel">
      <h2>Latest News</h2>

      <div className="news-list">
        {posts.length === 0 && (
          <p>No news available right now.</p>
        )}

        {posts.map((post: any) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="news-card"
          >
            <img
              src={post.featured_image || "/placeholder.jpg"}
              className="thumb-img"
              alt={post.title.rendered}
            />

            <div>
              <h3
                dangerouslySetInnerHTML={{
                  __html: post.title.rendered,
                }}
              />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}