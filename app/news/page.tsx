import InfiniteNews from "@/components/InfiniteNews";

import {
  getPosts,
} from "@/lib/wordpress";

export const dynamic =
  "force-dynamic";

export default async function NewsPage() {
  let posts: any[] = [];

  try {
    posts = await getPosts(1);
  } catch (error) {
    console.log(
      "Failed to fetch posts",
      error
    );
  }

  return (
    <main className="container page-space">
      <h1
        style={{
          fontSize: "48px",
          fontWeight: 900,
          marginBottom: "30px",
        }}
      >
        Latest Arsenal News
      </h1>

      <InfiniteNews
        initialPosts={posts}
      />
    </main>
  );
}