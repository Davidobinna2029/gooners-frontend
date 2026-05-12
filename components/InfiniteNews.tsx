"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import Image from "next/image";

interface Props {
  initialPosts: any[];
}

export default function InfiniteNews({
  initialPosts,
}: Props) {
  const [posts, setPosts] =
    useState(initialPosts);

  const [page, setPage] =
    useState(2);

  const [loading, setLoading] =
    useState(false);

  const [hasMore, setHasMore] =
    useState(true);

  async function loadMore() {
    if (
      loading ||
      !hasMore
    )
      return;

    setLoading(true);

    try {
      const res =
        await fetch(
          `/api/posts?page=${page}`
        );

      const data =
        await res.json();

      if (
        !data ||
        data.length === 0
      ) {
        setHasMore(false);
      } else {
        setPosts((prev) => [
          ...prev,
          ...data,
        ]);

        setPage(
          (prev) => prev + 1
        );
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  }

  useEffect(() => {
    function onScroll() {
      if (
        window.innerHeight +
          window.scrollY >=
          document.body
            .offsetHeight -
            1200 &&
        hasMore
      ) {
        loadMore();
      }
    }

    window.addEventListener(
      "scroll",
      onScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        onScroll
      );
  }, [page, hasMore]);

  return (
    <div className="news-grid">
      {posts.map(
        (post: any) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="news-card"
          >
            <div className="news-image relative">
              <Image
                src={
                  post.featuredImage ||
                  "/fallback.jpg"
                }
                alt={
                  post.title
                    .rendered
                }
                fill
                unoptimized
                className="object-cover"
              />
            </div>

            <div className="news-content">
              <h3
                dangerouslySetInnerHTML={{
                  __html:
                    post.title
                      .rendered,
                }}
              />

              <p
                dangerouslySetInnerHTML={{
                  __html:
                    post.excerpt
                      ?.rendered
                      ?.replace(
                        /<[^>]+>/g,
                        ""
                      )
                      ?.slice(
                        0,
                        120
                      ) +
                    "...",
                }}
              />
            </div>
          </Link>
        )
      )}

      {loading && (
        <p className="loading-text">
          Loading more news...
        </p>
      )}
    </div>
  );
}