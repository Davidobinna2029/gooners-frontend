"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

interface Props {
  initialPosts: NormalizedPost[];
  fetchPage?: (page: number) => Promise<NormalizedPost[]>;
}

export default function InfiniteNews({
  initialPosts,
  fetchPage,
}: Props) {
  const [posts, setPosts] = useState(initialPosts || []);
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
      console.error("Infinite scroll error:", err);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const target = observerRef.current;
    if (!target) return;

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      { threshold: 1 }
    );

    obs.observe(target);
    return () => obs.disconnect();
  }, [observerRef.current, page]);

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
                height={400}
                className="object-cover"
              />
            </div>

            <h3>{post.title}</h3>
          </Link>
        </article>
      ))}

      {/* OBSERVER TRIGGER */}
      <div ref={observerRef} style={{ height: 40 }} />

      {loading && (
        <p style={{ textAlign: "center", padding: 20 }}>
          Loading more news...
        </p>
      )}
    </section>
  );
}