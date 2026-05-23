import NewsCard from "@/components/news/NewsCard";

import {
  getCategoryPosts,
} from "@/lib/api/wordpress";

import {
  mapWordPressPosts,
} from "@/lib/mappers/wordpressMapper";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

export default async function CategoryPage({
  params,
}: Props) {
  const { slug } = await params;

  // 1. Fetch RAW WordPress posts
  const rawPosts = await getCategoryPosts(slug);

  // 2. Normalize into UI-safe structure
  const posts = mapWordPressPosts(rawPosts);

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