import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  getPostBySlug,
  getFeaturedImage,
} from "@/lib/wordpress";

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPostBySlug(
    params.slug
  );

  if (!post) {
    return <div>Post not found.</div>;
  }

  return (
    <>
      <Header />

      <main className="container page-space">
        <article className="article">
          <img
            src={getFeaturedImage(post)}
            alt={post.title.rendered}
            className="hero-image"
          />

          <h1
            dangerouslySetInnerHTML={{
              __html: post.title.rendered,
            }}
          />

          <div
            dangerouslySetInnerHTML={{
              __html: post.content.rendered,
            }}
          />
        </article>
      </main>

      <Footer />
    </>
  );
}