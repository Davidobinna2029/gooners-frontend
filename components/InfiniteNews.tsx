"use client";

import { useState } from "react";

import NewsCard from "./NewsCard";

interface Props {
  initialPosts: any[];
}

export default function InfiniteNews({
  initialPosts,
}: Props) {
  const [posts] =
    useState(initialPosts);

  return (
    <div className="news-grid">
      {posts.map((post: any) => (
        <NewsCard
          key={post.id}
          post={post}
        />
      ))}
    </div>
  );
}