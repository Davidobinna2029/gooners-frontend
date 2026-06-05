"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import type { CanonicalPost } from "@/types/content";

interface Props {
  posts: CanonicalPost[];
}

export default function LatestNews({ posts }: Props) {
  const [items, setItems] = useState<CanonicalPost[]>(posts);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const observerRef = useRef<HTMLDivElement | null>(null);

  async function loadMore() {
    if (loading) return;

    setLoading(true);

    try {
      const nextPage = page + 1;

      const res = await fetch(
        `/api/posts?page=${nextPage}`
      );

      if (!res.ok) {
        setLoading(false);
        return;
      }

      const newPosts: CanonicalPost[] =
        await res.json();

      if (newPosts.length > 0) {
        setItems((prev) => [...prev, ...newPosts]);
        setPage(nextPage);
      }
    } catch (error) {
      console.error(
        "LatestNews infinite scroll error:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const element = observerRef.current;

    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          loadMore();
        }
      },
      {
        rootMargin: "300px",
      }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [page, loading]);

  if (!items.length) return null;

  return (
    <section className="latest-news">
      <div className="container">
        <h2>Latest News</h2>

        <div className="news-grid">
          {items.map((post) => {
            const imageUrl = post.image?.url;

            return (
              <Link
                key={post.id}
                href={`/news/${post.slug}`}
                className="news-card"
              >
                <div className="news-image">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={post.title}
                      fill
                      sizes="(max-width:768px) 100vw, (max-width:1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                  ) : null}
                </div>

                <div className="news-content">
                  <h3>{post.title}</h3>
                </div>
              </Link>
            );
          })}
        </div>

        <div
          ref={observerRef}
          style={{ height: 40 }}
        />

        {loading && (
          <p
            style={{
              textAlign: "center",
              padding: "20px 0",
            }}
          >
            Loading more news...
          </p>
        )}
      </div>
    </section>
  );
}