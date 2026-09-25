"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import Link from "next/link";

interface TransferPost {
  id: number;
  slug: string;
  title: string;
  image: string | null;
  date: string;
}

interface TransferPostsResponse {
  posts: TransferPost[];
  page: number;
  perPage: number;
  totalPosts: number;
  totalPages: number;
  hasMore: boolean;
}

interface Props {
  excludedIds: number[];
}

const TRANSFER_CATEGORY_ID = 56;
const POSTS_PER_PAGE = 5;

export default function TransferHub({
  excludedIds,
}: Props) {
  const [posts, setPosts] = useState<TransferPost[]>(
    []
  );

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(
    null
  );

  const loadingRef = useRef(false);

  const displayedIdsRef = useRef<Set<number>>(
    new Set(excludedIds)
  );

  const sentinelRef =
    useRef<HTMLDivElement | null>(null);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMore) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const exclude = Array.from(
        displayedIdsRef.current
      ).join(",");

      const params = new URLSearchParams();

      params.set("page", String(page));
      params.set(
        "per_page",
        String(POSTS_PER_PAGE)
      );
      params.set(
        "category",
        String(TRANSFER_CATEGORY_ID)
      );

      if (exclude) {
        params.set("exclude", exclude);
      }

      const response = await fetch(
        `/api/posts?${params.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      if (!response.ok) {
        throw new Error(
          "Failed to load transfer news."
        );
      }

      const data: TransferPostsResponse =
        await response.json();

      const uniquePosts = data.posts.filter(
        (post) => {
          if (
            displayedIdsRef.current.has(post.id)
          ) {
            return false;
          }

          displayedIdsRef.current.add(post.id);

          return true;
        }
      );

      if (uniquePosts.length > 0) {
        setPosts((currentPosts) => [
          ...currentPosts,
          ...uniquePosts,
        ]);
      }

      setHasMore(data.hasMore);

      setPage(
        (currentPage) => currentPage + 1
      );
    } catch (err) {
      console.error(
        "Transfer Hub error:",
        err
      );

      setError(
        "Unable to load transfer news."
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, [page, hasMore]);

  /*
   * Load the first batch when the Transfer Hub
   * mounts.
   */
  useEffect(() => {
    loadMore();
  }, [loadMore]);

  /*
   * Infinite scroll inside the Transfer Hub.
   */
  useEffect(() => {
    const sentinel =
      sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry = entries[0];

          if (entry?.isIntersecting) {
            loadMore();
          }
        },
        {
          rootMargin: "300px 0px",
        }
      );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  return (
    <section className="sidebar-card transfer-hub">
      <div className="transfer-hub-header">
        <div>
          <h3>Transfer Hub</h3>

          <p>
            Latest Arsenal transfer news,
            rumours and confirmed deals.
          </p>
        </div>
      </div>

      <div className="transfer-hub-feed">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/news/${post.slug}`}
            className="transfer-hub-story"
          >
            <div className="transfer-hub-image">
              {post.image ? (
                <img
                  src={post.image}
                  alt=""
                  loading="lazy"
                />
              ) : (
                <div className="transfer-hub-image-placeholder">
                  Arsenal
                </div>
              )}
            </div>

            <div className="transfer-hub-story-content">
              <h4>{post.title}</h4>
            </div>
          </Link>
        ))}
      </div>

      <div
        ref={sentinelRef}
        className="transfer-hub-sentinel"
        aria-hidden="true"
      />

      {loading && (
        <div
          className="transfer-hub-status"
          aria-live="polite"
        >
          Loading transfer news…
        </div>
      )}

      {!loading && error && (
        <div
          className="transfer-hub-status"
          role="alert"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={loadMore}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading &&
        !error &&
        posts.length === 0 && (
          <div className="transfer-hub-status">
            No transfer stories available.
          </div>
        )}

      {!loading &&
        !error &&
        !hasMore &&
        posts.length > 0 && (
          <div
            className="transfer-hub-status"
            aria-live="polite"
          >
            You’ve reached the end of the transfer
            stories.
          </div>
        )}

      <Link
        href="/category/transfer-news"
        className="transfer-hub-link"
      >
        View All Transfer News →
      </Link>
    </section>
  );
}