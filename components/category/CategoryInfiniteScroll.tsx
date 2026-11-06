
"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import NewsCard from "@/components/news/NewsCard";
import type { CanonicalPost } from "@/types/content";

type ApiPost = Omit<CanonicalPost, "score"> & {
  score?: number;
};

interface PostsResponse {
  posts: ApiPost[];
  page: number;
  totalPages: number;
  hasMore: boolean;
  error?: string;
}

interface Props {
  initialPosts: CanonicalPost[];
  categoryId: number;
  categoryName: string;
}

const POSTS_PER_PAGE = 20;

export default function CategoryInfiniteScroll({
  initialPosts,
  categoryId,
  categoryName,
}: Props) {
  const [posts, setPosts] = useState<CanonicalPost[]>(initialPosts);
  const [page, setPage] = useState(1);

  const [hasMore, setHasMore] = useState(
    initialPosts.length === POSTS_PER_PAGE
  );

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) return;

    loadingRef.current = true;
    setLoading(true);
    setError("");

    try {
      const nextPage = page + 1;

      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: String(POSTS_PER_PAGE),
        category: String(categoryId),
      });

      const response = await fetch(`/api/posts?${params.toString()}`, {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(
          `Unable to load articles (${response.status}).`
        );
      }

      const data = (await response.json()) as PostsResponse;

      if (!Array.isArray(data.posts)) {
        throw new Error(
          "The server returned an invalid article list."
        );
      }

      const incomingPosts: CanonicalPost[] = data.posts.map((post) => ({
        ...post,
        score: post.score ?? 0,
        categoryName,
        categoryNames: [categoryName],
      }));

      setPosts((currentPosts) => {
        const existingIds = new Set(
          currentPosts.map((post) => post.id)
        );

        const newPosts = incomingPosts.filter(
          (post) => !existingIds.has(post.id)
        );

        return [...currentPosts, ...newPosts];
      });

      setPage(nextPage);
      setHasMore(Boolean(data.hasMore) && incomingPosts.length > 0);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong while loading articles."
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [categoryId, categoryName, hasMore, page]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "500px 0px",
      }
    );

    observer.observe(sentinel);

    return () => observer.disconnect();
  }, [hasMore, loadMore]);

  return (
    <>
      <div className="news-grid">
        {posts.map((post) => (
          <NewsCard key={post.id} post={post} />
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="category-load-more"
        aria-live="polite"
      >
        {loading && <p>Loading more articles...</p>}

        {error && (
          <div className="category-load-error">
            <p>{error}</p>

            <button
              type="button"
              onClick={() => void loadMore()}
            >
              Try again
            </button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <p>You have reached the end of this category.</p>
        )}
      </div>
    </>
  );
}
