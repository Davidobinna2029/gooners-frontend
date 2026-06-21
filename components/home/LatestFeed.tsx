"use client";

import { useEffect, useState } from "react";
import NewsCard from "@/components/news/NewsCard";
import type { CanonicalPost } from "@/types/content";

interface Props {
  initialPosts: CanonicalPost[];
}

export default function LatestFeed({ initialPosts }: Props) {
  const [posts, setPosts] = useState(initialPosts);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}&limit=12`);
      const data = await res.json();

      setPosts((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      console.error("Failed to load more posts", err);
    }

    setLoading(false);
  }

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.body.offsetHeight;

      if (scrollTop + windowHeight >= docHeight - 300) {
        loadMore();
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [page, loading]);

  return (
    <div className="homepage-grid">
      {posts.map((post) => (
        <NewsCard key={post.id} post={post} />
      ))}

      {loading && (
        <p style={{ textAlign: "center", padding: "20px" }}>
          Loading more stories...
        </p>
      )}
    </div>
  );
}