async function getPosts() {
  const res = await fetch("/api/posts", {
    cache: "no-store",
  });

  return res.json();
}

export default async function NewsPage() {
  const posts = await getPosts();

  return (
    <div>
      <h1>Latest News</h1>

      {posts.map((post: any) => (
        <div key={post.id}>
          <a href={`/news/${post.slug}`}>
            <h2 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </a>
        </div>
      ))}
    </div>
  );
}