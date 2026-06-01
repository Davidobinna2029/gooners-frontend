"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  initialPosts: CanonicalPost[];
  fetchPage?: (page: number) => Promise<CanonicalPost[]>;
}

export default function InfiniteNews({
  initialPosts,
  fetchPage,
}: Props) {
  const [posts, setPosts] = useState<CanonicalPost[]>(initialPosts || []);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (!fetchPage || loading) return;

    setLoading(true);

    try {
      const next = page + 1;
      const newPosts = await fetchPage(next);

      if (Array.isArray(newPosts) && newPosts.length > 0) {
        setPosts((prev) => [...prev, ...newPosts]);
        setPage(next);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const el = observerRef.current;
    if (!el) return;

    const obs = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) loadMore();
    });

    obs.observe(el);
    return () => obs.disconnect();
  }, [page, fetchPage, loading]);

  return (
    <section className="news-grid">
      {posts.map((post) => {
        const imageUrl = post.image?.url || "/fallback.jpg";

        return (
          <article key={post.id} className="news-card">
            <Link href={`/news/${post.slug}`}>
              <div className="news-image">
                <Image
                  src={imageUrl}
                  alt={post.title || "Arsenal news"}
                  width={600}
                  height={400}
                  className="object-cover"
                  loading="lazy"
                />
              </div>

              <h3>{post.title}</h3>
            </Link>
          </article>
        );
      })}

      <div ref={observerRef} style={{ height: 40 }} />

      {loading && (
        <p style={{ textAlign: "center", padding: 20 }}>
          Loading more news...
        </p>
      )}
    </section>
  );
}