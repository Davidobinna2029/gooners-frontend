import NewsCard from "@/components/NewsCard";

import {
  getCategoryPosts,
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
    await getCategoryPosts(
      slug
    );

  return (
    <div className="container page-space">
      <section className="section-block">
        <div className="section-title-row">
          <h2>
            {slug.replace(
              /-/g,
              " "
            )}
          </h2>
        </div>

        <div className="news-grid">
          {posts.map(
            (post: any) => (
              <NewsCard
                key={post.id}
                post={post}
              />
            )
          )}
        </div>
      </section>
    </div>
  );
}