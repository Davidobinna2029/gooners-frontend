"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

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

      const exclude = Array.from(
        displayedIdsRef.current
      ).join(",");

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
   * Infinite scroll.
   *
   * Loads the next batch automatically when the
   * visitor gets close to the bottom of the hub.
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
          rootMargin: "350px 0px",
        }
      );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  return (
    <section
      className="sidebar-card transfer-hub"
      aria-labelledby="transfer-hub-title"
    >

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="transfer-hub-heading">

        <div className="transfer-hub-heading-main">

          <span
            className="transfer-hub-accent"
            aria-hidden="true"
          />

          <div>

            <h3 id="transfer-hub-title">
              Transfer Hub
            </h3>

            <p>
              Arsenal transfer news,
              rumours &amp; deals
            </p>

          </div>

        </div>

        <span
          className="transfer-hub-live"
          aria-label="Live transfer coverage"
        >
          LIVE
        </span>

      </div>

      {/* =================================================
          STORIES
      ================================================= */}

      <div className="transfer-hub-feed">

        {posts.map(
          (post, index) => (
            <a
              key={post.id}
              href={`/news/${post.slug}`}
              className="transfer-hub-story"
            >

              {/* Story number */}

              <span
                className="transfer-hub-number"
                aria-hidden="true"
              >
                {String(index + 1).padStart(
                  2,
                  "0"
                )}
              </span>

              {/* Featured image */}

              <div className="transfer-hub-image">

                {post.image ? (
                  <img
                    src={post.image}
                    alt=""
                    loading="lazy"
                  />
                ) : (
                  <div className="transfer-hub-image-placeholder">
                    AFC
                  </div>
                )}

              </div>

              {/* Story content */}

              <div className="transfer-hub-story-content">

                <span className="transfer-hub-label">
                  TRANSFER
                </span>

                <h4>
                  {post.title}
                </h4>

              </div>

            </a>
          )
        )}

      </div>

      {/* =================================================
          INFINITE SCROLL SENTINEL
      ================================================= */}

      <div
        ref={sentinelRef}
        className="transfer-hub-sentinel"
        aria-hidden="true"
      />

      {/* =================================================
          LOADING
      ================================================= */}

      {loading && (
        <div
          className="transfer-hub-loading"
          aria-live="polite"
        >
          <span
            className="transfer-hub-spinner"
            aria-hidden="true"
          />

          <span>
            Loading transfer news…
          </span>
        </div>
      )}

      {/* =================================================
          ERROR
      ================================================= */}

      {!loading && error && (
        <div
          className="transfer-hub-status"
          role="alert"
        >

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={loadMore}
          >
            Try Again
          </button>

        </div>
      )}

      {/* =================================================
          EMPTY STATE
      ================================================= */}

      {!loading &&
        !error &&
        posts.length === 0 && (
          <div className="transfer-hub-status">
            No transfer stories available.
          </div>
        )}

      {/* =================================================
          END OF FEED
      ================================================= */}

      {!loading &&
        !error &&
        !hasMore &&
        posts.length > 0 && (
          <div
            className="transfer-hub-end"
            aria-live="polite"
          >
            End of transfer coverage
          </div>
        )}

    </section>
  );
}