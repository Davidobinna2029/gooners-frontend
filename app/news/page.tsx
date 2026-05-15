import InfiniteNews from "@/components/InfiniteNews";

import {
  getPosts,
} from "@/lib/wordpress";

export default async function NewsPage() {
  const posts =
    await getPosts(1);

  return (
    <main className="container page-space">
      <h1 className="page-title">
        Latest Arsenal News
      </h1>

      <InfiniteNews
        initialPosts={posts}
      />
    </main>
  );
}