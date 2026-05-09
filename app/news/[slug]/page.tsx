import { getPost } from "@/lib/wordpress";

export default async function SingleNewsPage({
  params,
}: {
  params: Promise<{
    slug: string;
  }>;
}) {
  const { slug } =
    await params;

  const post: any =
    await getPost(slug);

  if (!post) {
    return <div>Post not found</div>;
  }

  const image =
    post?._embedded?.[
      "wp:featuredmedia"
    ]?.[0]?.source_url;

  return (
    <main className="article-page">
      {image && (
        <img
          src={image}
          alt={
            post.title.rendered
          }
        />
      )}

      <h1
        dangerouslySetInnerHTML={{
          __html:
            post.title.rendered,
        }}
      />

      <div
        dangerouslySetInnerHTML={{
          __html:
            post.content
              .rendered,
        }}
      />
    </main>
  );
}