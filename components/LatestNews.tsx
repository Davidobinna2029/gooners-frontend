"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function LatestNews() {
  const [posts, setPosts] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/posts")
      .then((res) => res.json())
      .then(setPosts);
  }, []);

  return (
    <div className="panel">
      <h2>Latest News</h2>

      <div className="news-list">
        {posts.map((post) => (
          <Link key={post.id} href={`/news/${post.slug}`}>
            <img src={post.featured_image} alt="" />
            <h3 dangerouslySetInnerHTML={{ __html: post.title.rendered }} />
          </Link>
        ))}
      </div>
    </div>
  );
}