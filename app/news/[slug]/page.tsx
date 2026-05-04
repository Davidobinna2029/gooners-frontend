async function getPost(slug: string) {
  const res = await fetch(`/api/post/${slug}`, {
    cache: "no-store",
  });

  return res.json();
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) return <p>Post not found</p>;

  return (
    <article>
      <h1 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />

      <img src={post.featured_image} alt="" />

      <div dangerouslySetInnerHTML={{ __html: post.content.rendered }} />
    </article>
  );
}