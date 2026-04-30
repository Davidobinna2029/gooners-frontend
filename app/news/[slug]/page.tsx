export const dynamic = "force-dynamic";

import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Image from "next/image";
import { getPost, getFeaturedImage } from "@/lib/wordpress";

export default async function PostPage({ params }: any) {
  const post = await getPost(params.slug);

  if (!post) {
    return (
      <div className="container page-space">
        <h1>Post not found</h1>
      </div>
    );
  }

  return (
    <>
      <Header />

      <main className="container page-space">
        <article className="article">
          <h1
            dangerouslySetInnerHTML={{
              __html: post.title.rendered,
            }}
          />

          <Image
            src={getFeaturedImage(post)}
            alt={post.title.rendered}
            width={800}
            height={450}
            className="hero-image"
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