// app/news/page.tsx

import { getLatestPosts } from "@/lib/wordpress";
import Link from "next/link";

export default async function NewsPage() {
  const posts = await getLatestPosts();

  return (
    <div>
      <h1>Latest News</h1>

      {posts.length === 0 && <p>No posts available</p>}

      {posts.map((post: any) => (
        <div key={post.id}>
          <Link href={`/news/${post.slug}`}>
            {post.title.rendered}
          </Link>
        </div>
      ))}
    </div>
  );
}