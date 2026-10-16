
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
  image: {
    url: string;
    width?: number;
    height?: number;
  } | null;
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
const WORDPRESS_HOST = "https://api.arsenaltalks.com";

function normalizeImageUrl(
  value: string | null | undefined
): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  try {
    const url = new URL(value.trim(), WORDPRESS_HOST);

    if (!["http:", "https:"].includes(url.protocol)) {
      return null;
    }

    const hostname = url.hostname.toLowerCase();

    if (
      hostname === "arsenaltalks.com" ||
      hostname === "www.arsenaltalks.com"
    ) {
      url.hostname = "api.arsenaltalks.com";
    }

    return url.toString();
  } catch {
    return null;
  }
}

function formatPublicationDate(
  value: string | null | undefined
): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  const timestamp = Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return null;
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(timestamp);
}

export default function TransferHub({
  excludedIds,
}: Props) {
  const [posts, setPosts] = useState<TransferPost[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [failedImageIds, setFailedImageIds] = useState<Set<number>>(
    () => new Set()
  );

  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);

  const displayedIdsRef = useRef<Set<number>>(
    new Set(Array.isArray(excludedIds) ? excludedIds : [])
  );

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!Array.isArray(excludedIds)) return;

    for (const id of excludedIds) {
      displayedIdsRef.current.add(id);
    }
  }, [excludedIds]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) {
      return;
    }

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    const requestedPage = pageRef.current;

    try {
      const params = new URLSearchParams({
        page: String(requestedPage),
        per_page: String(POSTS_PER_PAGE),
        category: String(TRANSFER_CATEGORY_ID),
      });

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
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to load transfer news (HTTP ${response.status}).`
        );
      }

      const data =
        (await response.json()) as TransferPostsResponse;

      if (
        !data ||
        !Array.isArray(data.posts) ||
        typeof data.hasMore !== "boolean"
      ) {
        throw new Error(
          "The transfer news API returned an invalid response."
        );
      }

      const uniquePosts: TransferPost[] = [];

      for (const post of data.posts) {
        if (
          !post ||
          typeof post.id !== "number" ||
          !Number.isFinite(post.id) ||
          typeof post.slug !== "string" ||
          typeof post.title !== "string" ||
          displayedIdsRef.current.has(post.id)
        ) {
          continue;
        }

        const imageUrl = normalizeImageUrl(post.image?.url);

        uniquePosts.push({
          ...post,
          image: imageUrl
            ? {
                url: imageUrl,
                width: post.image?.width,
                height: post.image?.height,
              }
            : null,
        });

        displayedIdsRef.current.add(post.id);
      }

      if (uniquePosts.length > 0) {
        setPosts((currentPosts) => [
          ...currentPosts,
          ...uniquePosts,
        ]);
      }

      const returnedPage = Number(data.page);

      const nextPage =
        Number.isFinite(returnedPage) &&
        returnedPage >= requestedPage
          ? returnedPage + 1
          : requestedPage + 1;

      pageRef.current = nextPage;

      const canContinue =
        data.hasMore && uniquePosts.length > 0;

      hasMoreRef.current = canContinue;
      setHasMore(canContinue);
    } catch (err) {
      console.error("Transfer Hub error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Unable to load transfer news. Please try again."
      );
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadMore();
  }, [loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (
      !sentinel ||
      !hasMore ||
      error ||
      typeof IntersectionObserver === "undefined"
    ) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "350px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, hasMore, error]);

  return (
    <section
      className="sidebar-card transfer-hub"
      aria-labelledby="transfer-hub-title"
    >
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
      </div>

      <div className="transfer-hub-feed">
        {posts.map((post) => {
          const imageUrl = normalizeImageUrl(
            post.image?.url
          );

          const showImage =
            Boolean(imageUrl) &&
            !failedImageIds.has(post.id);

          const publicationDate =
            formatPublicationDate(post.date);

          return (
            <a
              key={post.id}
              href={`/news/${post.slug}`}
              className="transfer-hub-story"
            >
              <div className="transfer-hub-image">
                {showImage && imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    onError={() => {
                      setFailedImageIds((previous) => {
                        const next = new Set(previous);
                        next.add(post.id);
                        return next;
                      });
                    }}
                  />
                ) : (
                  <div
                    className="transfer-hub-image-placeholder"
                    aria-hidden="true"
                  >
                    AFC
                  </div>
                )}
              </div>

              <div className="transfer-hub-story-content">
                <span className="transfer-hub-label">
                  TRANSFER
                </span>

                <h4>{post.title}</h4>

                {publicationDate && (
                  <time
                    className="transfer-hub-date"
                    dateTime={post.date}
                  >
                    {publicationDate}
                  </time>
                )}
              </div>
            </a>
          );
        })}
      </div>

      <div
        ref={sentinelRef}
        className="transfer-hub-sentinel"
        aria-hidden="true"
      />

      {loading && (
        <div
          className="transfer-hub-loading"
          aria-live="polite"
          aria-busy="true"
        >
          <span
            className="transfer-hub-spinner"
            aria-hidden="true"
          />

          <span>Loading transfer news...</span>
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
            onClick={() => void loadMore()}
          >
            Try Again
          </button>
        </div>
      )}

      {!loading && !error && posts.length === 0 && (
        <div className="transfer-hub-status">
          No transfer stories available.

          <p>
            <a href="/category/transfer-news">
              Browse the Transfer News archive
            </a>
          </p>
        </div>
      )}

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
