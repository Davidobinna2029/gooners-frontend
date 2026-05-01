import { getPost, getFeaturedImage } from "@/lib/wordpress";

export const revalidate = 60;

export default async function Page({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);

  if (!post) {
    return <h1>Post not found</h1>;
  }

  return (
    <article className="article">
      <h1
        dangerouslySetInnerHTML={{
          __html: post.title.rendered,
        }}
      />

      <img
        src={getFeaturedImage(post)}
        className="hero-image"
      />

      <div
        dangerouslySetInnerHTML={{
          __html: post.content.rendered,
        }}
      />
    </article>
  );
}