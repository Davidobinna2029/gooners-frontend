import Image from "next/image";
import parse from "html-react-parser";

import {
  getPostBySlug,
  getPosts,
} from "@/lib/api/wordpress";

import ArticleMeta from "@/components/news/ArticleMeta";
import ShareBar from "@/components/news/ShareBar";
import RelatedPosts from "@/components/news/RelatedPosts";
import AuthorBox from "@/components/news/AuthorBox";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | ArsenalTalks",
    };
  }

  return {
    title: `${post.title.rendered} | ArsenalTalks`,
    description: post.excerpt.rendered
      .replace(/<[^>]+>/g, "")
      .slice(0, 150),
    openGraph: {
      title: post.title.rendered,
      description: post.excerpt.rendered
        .replace(/<[^>]+>/g, "")
        .slice(0, 150),
      images: [
        {
          url: post.featuredImage,
        },
      ],
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  const latest = await getPosts();

  if (!post) {
    return (
      <div className="container">
        <div style={{ padding: "80px 0" }}>
          <h1>Article not found</h1>
          <p>
            This article may have been removed or the URL is incorrect.
          </p>
        </div>
      </div>
    );
  }

  return (
    <article className="article-page">
      <div className="container">
        <header className="article-header">
          <span className="article-category">
            {post.category || "Arsenal"} {/* ✅ fixed */}
          </span>

          <h1>{post.title.rendered}</h1>

          <ArticleMeta author={post.author} date={post.date} />
        </header>

        <div className="article-image">
          <Image
            src={post.featuredImage}
            alt={post.title.rendered}
            fill
            priority
            className="object-cover"
          />
        </div>

        <div className="article-layout">
          <aside className="article-sidebar">
            <ShareBar slug={post.slug} title={post.title.rendered} />
          </aside>

          <main className="article-main">
            <div className="article-body">
              {parse(post.content.rendered)}
            </div>

            <AuthorBox author={post.author} />

            <RelatedPosts
              posts={latest
                .filter((item) => item.id !== post.id)
                .slice(0, 4)}
            />
          </main>
        </div>
      </div>
    </article>
  );
}