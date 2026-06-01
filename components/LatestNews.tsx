"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  posts: CanonicalPost[];
  fetchPage?: (page: number) => Promise<CanonicalPost[]>;
}

export default function LatestNews({ posts, fetchPage }: Props) {
  const [items, setItems] = useState<CanonicalPost[]>(posts || []);
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
        setItems((prev) => [...prev, ...newPosts]);
        setPage(next);
      }
    } catch (err) {
      console.error("Infinite scroll error:", err);
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

  if (!items.length) return null;

  return (
    <section className="latest-news">
      <div className="container">

        <h2>Latest News</h2>

        <div className="news-grid">
          {items.map((post) => {
            const imageUrl = post.image?.url || "/fallback.jpg";

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="news-card"
              >
                <div className="news-image">
                  <Image
                    src={imageUrl}
                    alt={post.title || "News"}
                    fill
                    className="object-cover"
                    loading="lazy"
                  />
                </div>

                <h3>{post.title}</h3>
              </Link>
            );
          })}
        </div>

        <div ref={observerRef} style={{ height: 40 }} />

        {loading && (
          <p style={{ textAlign: "center", padding: 20 }}>
            Loading more news...
          </p>
        )}

      </div>
    </section>
  );
}