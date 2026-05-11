import InfiniteNews from "@/components/InfiniteNews";

import {
  getPosts,
} from "@/lib/wordpress";

export default async function NewsPage() {
  const posts =
    await getPosts(1);

  return (
    <main className="container page-space">
      <div className="section-title-row">
        <h2>
          Latest News
        </h2>
      </div>

      <InfiniteNews
        initialPosts={posts}
      />
    </main>
  );
}