"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  initialPosts: NormalizedPost[];
}

export default function InfiniteNews({ initialPosts }: Props) {
  const [posts, setPosts] = useState<NormalizedPost[]>(initialPosts || []);
  const [page, setPage] = useState(2);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const loaderRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (loading || !hasMore) return;

    setLoading(true);

    try {
      const res = await fetch(`/api/posts?page=${page}&per_page=20`);

      if (!res.ok) {
        setHasMore(false);
        return;
      }

      const data = await res.json();

      if (!Array.isArray(data) || data.length === 0) {
        setHasMore(false);
        return;
      }

      setPosts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const filtered = data.filter((p: NormalizedPost) => !existingIds.has(p.id));
        return [...prev, ...filtered];
      });

      setPage((p) => p + 1);
    } catch (err) {
      console.error("Infinite scroll error:", err);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => observer.disconnect();
  }, [loaderRef.current, page, loading]);

  return (
    <section className="news-grid">
      {posts.map((post) => (
        <article key={post.id} className="news-card">
          <Link href={`/news/${post.slug}`}>
            <div className="news-image">
              <Image
                src={post.image || "/fallback.jpg"}
                alt={post.title}
                width={600}
                height={350}
                priority={false}
              />
            </div>

            <h3
              dangerouslySetInnerHTML={{
                __html: post.title,
              }}
            />
          </Link>
        </article>
      ))}

      {/* Loader trigger */}
      <div ref={loaderRef} style={{ height: 40 }} />

      {/* Loading state */}
      {loading && (
        <p style={{ textAlign: "center", padding: 20 }}>
          Loading more news...
        </p>
      )}

      {/* End state */}
      {!hasMore && (
        <p style={{ textAlign: "center", padding: 20 }}>
          No more articles
        </p>
      )}
    </section>
  );
}