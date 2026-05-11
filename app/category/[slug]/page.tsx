import InfiniteNews from "@/components/InfiniteNews";

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
    <main className="container page-space">
      <div className="section-title-row">
        <h2>
          {slug.replace(
            "-",
            " "
          )}
        </h2>
      </div>

      <InfiniteNews
        initialPosts={posts}
      />
    </main>
  );
}