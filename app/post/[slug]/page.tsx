import NewsCard from "@/components/NewsCard";

import {
  getPostsByCategory,
} from "@/lib/wordpress";

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
    await getPostsByCategory(
      slug
    );

  return (
    <main className="container page-space">
      <div className="section-title-row">
        <h2>
          {slug.replace(
            "-",
            " "
          )}
        </h2>
      </div>

      <div className="news-grid">
        {posts.map((post: any) => (
          <NewsCard
            key={post.id}
            post={post}
          />
        ))}
      </div>
    </main>
  );
}