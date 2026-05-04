async function getPosts(slug: string) {
  const res = await fetch(`/api/category/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function CategoryPage({
  params,
}: {
  params: { slug: string };
}) {
  const posts = await getPosts(params.slug);

  return (
    <div>
      <h1>{params.slug}</h1>

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