import { getCategoryPosts } from "@/lib/wordpress";

import Header from "@/components/layout/Header";

import NewsCard from "@/components/news/NewsCard";

export default async function CategoryPage({
  params,
}: any) {
  const posts =
    await getCategoryPosts(
      params.slug
    );

  return (
    <>
      <Header />

      <main className="category-page">
        <h1>
          {params.slug.replace(
            "-",
            " "
          )}
        </h1>

        <div className="category-grid">
          {posts.map((post: any) => (
            <NewsCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      </main>
    </>
  );
}