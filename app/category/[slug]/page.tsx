import NewsCard from "@/components/news/NewsCard";

import {
  getCategoryPosts,
} from "@/lib/api/wordpress";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } =
    await params;

  const posts =
    await getCategoryPosts(
      slug
    );

  return (
    <main className="category-page">
      <div className="container">
        <h1 className="category-title">
          {slug}
        </h1>

        <div className="news-grid">
          {posts.map((post) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </div>
    </main>
  );
}