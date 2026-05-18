"use client";

import { useEffect, useState } from "react";

export default function PostsList() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    async function loadPosts() {
      const res = await fetch("/api/posts");
      const data = await res.json();
      setPosts(data);
    }
    loadPosts();
  }, []);

  return (
    <section>
      <h2>Latest Posts</h2>
      <ul>
        {posts.map((post) => (
          <li key={post.id}>
            <a href={`/news/${post.slug}`}>{post.title.rendered}</a>
          </li>
        ))}
      </ul>
    </section>
  );
}