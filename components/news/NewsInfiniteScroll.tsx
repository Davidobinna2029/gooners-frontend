"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

interface NewsPost {
  id: number;
  slug: string;
  title: string;
  excerpt?: string;
  date?: string;
  image?: {
    url?: string;
  } | null;
  category?: string;
}

interface ApiPost {
  id: number;
  slug?: string;
  title?: string;
  excerpt?: string;
  date?: string;
  image?: {
    url?: string;
  } | null;
  categories?: number[];
}

/* -------------------------------------------------------------------------- */
/* Helpers                                                                    */
/* -------------------------------------------------------------------------- */

function normalizeImageUrl(
  url?: string | null
): string | null {
  if (!url) {
    return null;
  }

  try {
    const parsed = new URL(url);

    if (
      parsed.hostname === "arsenaltalks.com" ||
      parsed.hostname === "www.arsenaltalks.com"
    ) {
      parsed.hostname = "api.arsenaltalks.com";
    }

    return parsed.toString();
  } catch {
    return url;
  }
}

function stripHtml(
  value?: string
): string {
  if (!value) {
    return "";
  }

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function formatDate(
  date?: string
): string {
  if (!date) {
    return "";
  }

  const parsed = new Date(date);

  if (Number.isNaN(parsed.getTime())) {
    return "";
  }

  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(parsed);
}

function mapApiPost(
  post: ApiPost
): NewsPost {
  const imageUrl = normalizeImageUrl(
    post.image?.url
  );

  return {
    id: post.id,
    slug: post.slug || "",
    title: stripHtml(post.title),
    excerpt: stripHtml(post.excerpt),
    date: post.date,
    image: imageUrl
      ? {
          url: imageUrl,
        }
      : null,
    category: "Arsenal News",
  };
}

/* -------------------------------------------------------------------------- */
/* News card                                                                  */
/* -------------------------------------------------------------------------- */

function NewsFeedCard({
  post,
}: {
  post: NewsPost;
}) {
  const imageUrl =
    normalizeImageUrl(
      post.image?.url
    );

  return (
    <article className="news-feed-card">
      <Link
        href={`/news/${post.slug}`}
        className="news-feed-image-link"
        aria-label={post.title}
      >
        <div
          className="news-feed-image"
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 10",
            overflow: "hidden",
            background: "#e5e7eb",
          }}
        >
          {imageUrl ? (
            <Image
              src={imageUrl}
              alt={post.title}
              fill
              unoptimized
              className="news-feed-image-img"
              sizes="(max-width: 700px) 100vw, 280px"
              priority={false}
            />
          ) : (
            <div
              className="news-feed-image-empty"
              aria-hidden="true"
            >
              <span>ArsenalTalks</span>
            </div>
          )}
        </div>
      </Link>

      <div className="news-feed-content">
        <div className="news-feed-meta">
          <span className="news-feed-category">
            {post.category ||
              "Arsenal News"}
          </span>

          {post.date ? (
            <>
              <span
                className="news-feed-meta-dot"
                aria-hidden="true"
              >
                •
              </span>

              <time dateTime={post.date}>
                {formatDate(post.date)}
              </time>
            </>
          ) : null}
        </div>

        <h2 className="news-feed-title">
          <Link href={`/news/${post.slug}`}>
            {post.title}
          </Link>
        </h2>

        {post.excerpt ? (
          <p className="news-feed-excerpt">
            {post.excerpt}
          </p>
        ) : null}

        <Link
          href={`/news/${post.slug}`}
          className="news-feed-read-more"
          aria-label={`Read ${post.title}`}
        >
          Read story
          <span aria-hidden="true">
            {" "}
            →
          </span>
        </Link>
      </div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* Main component                                                             */
/* -------------------------------------------------------------------------- */

export default function NewsInfiniteScroll({
  initialPosts = [],
  initialPage = 1,
  totalPages = 0,
  hasMore = false,
}: {
  initialPosts?: NewsPost[];
  initialPage?: number;
  totalPages?: number;
  hasMore?: boolean;
}) {
  const router = useRouter();

  const [posts, setPosts] =
    useState<NewsPost[]>(
      initialPosts
    );

  const [page, setPage] =
    useState<number>(
      initialPage
    );

  const [canLoadMore, setCanLoadMore] =
    useState<boolean>(
      hasMore
    );

  const [loading, setLoading] =
    useState<boolean>(false);

  const [error, setError] =
    useState<string | null>(
      null
    );

  const loadingRef =
    useRef(false);

  const loadedIdsRef =
    useRef<Set<number>>(
      new Set(
        initialPosts.map(
          (post) => post.id
        )
      )
    );

  const sentinelRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* ---------------------------------------------------------------------- */
  /* Synchronize server-rendered data                                      */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    loadedIdsRef.current =
      new Set(
        initialPosts.map(
          (post) => post.id
        )
      );

    setPosts(initialPosts);
    setPage(initialPage);
    setCanLoadMore(hasMore);
  }, [
    initialPosts,
    initialPage,
    hasMore,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Load next page                                                         */
  /* ---------------------------------------------------------------------- */

  const loadMore =
    useCallback(async () => {
      if (loadingRef.current) {
        return;
      }

      if (!canLoadMore) {
        return;
      }

      loadingRef.current = true;

      setLoading(true);
      setError(null);

      const nextPage =
        page + 1;

      try {
        const response =
          await fetch(
            `/api/posts?page=${nextPage}&per_page=5`,
            {
              method: "GET",
              cache: "no-store",
              headers: {
                Accept:
                  "application/json",
              },
            }
          );

        if (!response.ok) {
          throw new Error(
            `Failed to load page ${nextPage}`
          );
        }

        const data =
          await response.json();

        const incomingPosts: ApiPost[] =
          Array.isArray(
            data?.posts
          )
            ? data.posts
            : [];

        const mappedPosts =
          incomingPosts
            .map(mapApiPost)
            .filter(
              (post) =>
                post.id &&
                post.slug &&
                post.title
            );

        const uniquePosts =
          mappedPosts.filter(
            (post) => {
              if (
                loadedIdsRef.current.has(
                  post.id
                )
              ) {
                return false;
              }

              loadedIdsRef.current.add(
                post.id
              );

              return true;
            }
          );

        if (
          uniquePosts.length > 0
        ) {
          setPosts(
            (currentPosts) => [
              ...currentPosts,
              ...uniquePosts,
            ]
          );
        }

        /*
         * Prefer the API's explicit hasMore value.
         *
         * If it is not supplied, fall back to the
         * server-rendered total page count when available.
         */
        const apiHasMore =
          typeof data?.hasMore ===
          "boolean"
            ? data.hasMore
            : totalPages > 0
              ? nextPage < totalPages
              : uniquePosts.length > 0;

        setCanLoadMore(
          apiHasMore
        );

        setPage(
          nextPage
        );

        /*
         * Update URL without a full page reload
         * and without changing scroll position.
         */
        router.replace(
          `/news?page=${nextPage}`,
          {
            scroll: false,
          }
        );
      } catch (err) {
        console.error(
          "News infinite scroll error:",
          err
        );

        setError(
          "Failed to load more news."
        );
      } finally {
        loadingRef.current =
          false;

        setLoading(false);
      }
    }, [
      canLoadMore,
      page,
      router,
      totalPages,
    ]);

  /* ---------------------------------------------------------------------- */
  /* Intersection Observer                                                   */
  /* ---------------------------------------------------------------------- */

  useEffect(() => {
    const sentinel =
      sentinelRef.current;

    if (!sentinel) {
      return;
    }

    if (!canLoadMore) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting &&
            !loadingRef.current
          ) {
            void loadMore();
          }
        },
        {
          root: null,
          rootMargin:
            "800px 0px",
          threshold: 0,
        }
      );

    observer.observe(
      sentinel
    );

    return () => {
      observer.disconnect();
    };
  }, [
    canLoadMore,
    loadMore,
  ]);

  /* ---------------------------------------------------------------------- */
  /* Retry                                                                   */
  /* ---------------------------------------------------------------------- */

  const retry =
    useCallback(() => {
      void loadMore();
    }, [loadMore]);

  /* ---------------------------------------------------------------------- */
  /* Render                                                                  */
  /* ---------------------------------------------------------------------- */

  return (
    <div className="news-feed">
      {posts.length > 0 ? (
        posts.map((post) => (
          <NewsFeedCard
            key={post.id}
            post={post}
          />
        ))
      ) : (
        <div className="news-empty">
          <p>
            No Arsenal news available
            right now.
          </p>
        </div>
      )}

      <div
        ref={sentinelRef}
        className="news-infinite-sentinel"
        aria-hidden="true"
      />

      {loading ? (
        <div
          className="news-loading"
          role="status"
          aria-live="polite"
        >
          <span className="news-loading-spinner" />
          <span>
            Loading more Arsenal news…
          </span>
        </div>
      ) : null}

      {error ? (
        <div
          className="news-error"
          role="alert"
        >
          <p>{error}</p>

          <button
            type="button"
            onClick={retry}
            className="news-retry"
          >
            Try again
          </button>
        </div>
      ) : null}

      {!loading &&
      !error &&
      !canLoadMore &&
      posts.length > 0 ? (
        <div className="news-end">
          <span>
            You’ve reached the end of
            the latest Arsenal news.
          </span>
        </div>
      ) : null}
    </div>
  );
}