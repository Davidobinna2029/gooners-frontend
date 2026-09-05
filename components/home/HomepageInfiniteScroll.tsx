"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import NewsCard from "@/components/news/NewsCard";

import type {
  CanonicalPost,
} from "@/types/content";

/* ==========================================================
   API POST
========================================================== */

interface ApiPost {
  id: number;
  slug: string;
  title: string;
  excerpt: string;

  date: string;
  modified: string;

  status: string;

  image: string | null;

  author: string;

  category: string;

  categories: number[];

  featuredMedia: number | null;

  link: string;
}

/* ==========================================================
   API RESPONSE
========================================================== */

interface PostsResponse {
  posts: ApiPost[];

  page: number;

  perPage: number;

  totalPosts: number;

  totalPages: number;

  hasMore: boolean;
}

/* ==========================================================
   PROPS
========================================================== */

interface Props {
  /**
   * IDs already displayed by:
   *
   * Hero
   * Breaking
   * Trending
   * Latest
   *
   * These posts must never be returned/rendered again
   * by infinite scrolling.
   */
  excludedIds: number[];
}

/* ==========================================================
   CLUSTER NORMALIZER
========================================================== */

function normalizeCluster(
  category: string
): CanonicalPost["cluster"] {
  const value =
    category
      ?.trim()
      .toLowerCase();

  switch (value) {
    case "arsenal":
      return "arsenal";

    case "transfer":
    case "transfers":
    case "transfer-news":
      return "transfer";

    case "injury":
    case "injuries":
    case "injury-news":
      return "injury";

    case "match":
    case "match-analysis":
    case "matches":
      return "match";

    default:
      return "other";
  }
}

/* ==========================================================
   API → CANONICAL POST
========================================================== */

function normalizePost(
  post: ApiPost
): CanonicalPost {
  return {
    id: post.id,

    slug: post.slug,

    date: post.date,

    title: post.title,

    excerpt: post.excerpt,

    /*
     * The API has already extracted the real WordPress
     * featured image URL.
     *
     * No placeholder image is introduced here.
     */
    image: post.image
      ? {
          url: post.image,
        }
      : null,

    categories:
      Array.isArray(
        post.categories
      )
        ? post.categories
        : [],

    /*
     * The current /api/posts response does not return
     * WordPress tag IDs yet.
     *
     * Keep this empty until the API exposes them.
     */
    tags: [],

    /*
     * Infinite-scroll posts have not gone through the
     * homepage ranking engine, so they receive a neutral
     * client-side score.
     */
    score: 0,

    cluster:
      normalizeCluster(
        post.category
      ),

    link: post.link,

    /*
     * Content is intentionally omitted because the
     * homepage NewsCard does not need the full article body.
     */
  };
}

/* ==========================================================
   COMPONENT
========================================================== */

export default function HomepageInfiniteScroll({
  excludedIds,
}: Props) {
  /* ========================================================
     LOADED POSTS
  ======================================================== */

  const [posts, setPosts] =
    useState<CanonicalPost[]>([]);

  /* ========================================================
     CURRENT WORDPRESS PAGE

     Initial homepage already consumes page 1.

     Infinite scroll therefore starts at page 2.
  ======================================================== */

  const [page, setPage] =
    useState(2);

  /* ========================================================
     MORE POSTS AVAILABLE?
  ======================================================== */

  const [hasMore, setHasMore] =
    useState(true);

  /* ========================================================
     LOADING STATE
  ======================================================== */

  const [loading, setLoading] =
    useState(false);

  /* ========================================================
     ERROR STATE
  ======================================================== */

  const [error, setError] =
    useState<string | null>(
      null
    );

  /* ========================================================
     REQUEST LOCK

     Prevents IntersectionObserver from starting multiple
     requests at the same time.
  ======================================================== */

  const loadingRef =
    useRef(false);

  /* ========================================================
     GLOBAL CLIENT DEDUPLICATION REGISTRY

     Start with all posts already displayed by the server
     homepage.
  ======================================================== */

  const displayedIdsRef =
    useRef<Set<number>>(
      new Set(excludedIds)
    );

  /* ========================================================
     SENTINEL

     IntersectionObserver watches this element.
  ======================================================== */

  const sentinelRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* ========================================================
     LOAD MORE
  ======================================================== */

  const loadMore =
    useCallback(
      async () => {
        /*
         * Never start another request while one is already
         * running.
         */
        if (
          loadingRef.current ||
          !hasMore
        ) {
          return;
        }

        loadingRef.current =
          true;

        setLoading(true);

        setError(null);

        try {
          /*
           * Send every ID already displayed to the server.
           *
           * This includes:
           *
           * Hero
           * Breaking
           * Trending
           * Latest
           * Previously infinite-scrolled posts
           */
          const exclude =
            Array.from(
              displayedIdsRef.current
            ).join(",");

          const response =
            await fetch(
              `/api/posts?page=${page}&per_page=10&exclude=${exclude}`,
              {
                method: "GET",

                cache: "no-store",
              }
            );

          if (!response.ok) {
            throw new Error(
              "Failed to load more stories."
            );
          }

          const data: PostsResponse =
            await response.json();

          /*
           * Defensive client-side deduplication.
           *
           * The server already receives the exclusion list,
           * but we enforce the rule again on the client.
           */
          const uniquePosts =
            data.posts.filter(
              (post) => {
                if (
                  displayedIdsRef.current.has(
                    post.id
                  )
                ) {
                  return false;
                }

                displayedIdsRef.current.add(
                  post.id
                );

                return true;
              }
            );

          /*
           * Normalize API posts into CanonicalPost.
           */
          if (
            uniquePosts.length > 0
          ) {
            const normalizedPosts =
              uniquePosts.map(
                normalizePost
              );

            setPosts(
              (currentPosts) => [
                ...currentPosts,
                ...normalizedPosts,
              ]
            );
          }

          /*
           * Tell the component whether WordPress has
           * another page available.
           */
          setHasMore(
            data.hasMore
          );

          /*
           * Move to the next WordPress page.
           */
          setPage(
            (currentPage) =>
              currentPage + 1
          );
        } catch (err) {
          console.error(
            "Infinite scroll error:",
            err
          );

          setError(
            "Unable to load more stories."
          );
        } finally {
          loadingRef.current =
            false;

          setLoading(false);
        }
      },
      [page, hasMore]
    );

  /* ========================================================
     INTERSECTION OBSERVER
  ======================================================== */

  useEffect(() => {
    const sentinel =
      sentinelRef.current;

    if (!sentinel) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const entry =
            entries[0];

          if (
            entry?.isIntersecting
          ) {
            loadMore();
          }
        },
        {
          /*
           * Begin loading approximately 600px before
           * the visitor reaches the bottom.
           */
          rootMargin:
            "600px 0px",
        }
      );

    observer.observe(
      sentinel
    );

    return () => {
      observer.disconnect();
    };
  }, [loadMore]);

  /* ========================================================
     RENDER
  ======================================================== */

  return (
    <section className="homepage-section homepage-infinite-feed">

      {/* ====================================================
          INFINITE-SCROLLED NEWS
      ==================================================== */}

      {posts.map(
        (post) => (
          <NewsCard
            key={post.id}
            post={post}
          />
        )
      )}

      {/* ====================================================
          INFINITE SCROLL SENTINEL

          When this enters the viewport, the next page is
          requested automatically.
      ==================================================== */}

      <div
        ref={sentinelRef}
        className="homepage-infinite-sentinel"
        aria-hidden="true"
      />

      {/* ====================================================
          LOADING STATE
      ==================================================== */}

      {loading && (
        <div
          className="homepage-infinite-status"
          aria-live="polite"
        >
          Loading more stories…
        </div>
      )}

      {/* ====================================================
          ERROR STATE
      ==================================================== */}

      {!loading &&
        error && (
          <div
            className="homepage-infinite-status"
            role="alert"
          >
            <p>
              {error}
            </p>

            <button
              type="button"
              onClick={
                loadMore
              }
            >
              Try Again
            </button>
          </div>
        )}

      {/* ====================================================
          END OF FEED
      ==================================================== */}

      {!loading &&
        !error &&
        !hasMore &&
        posts.length > 0 && (
          <div
            className="homepage-infinite-status"
            aria-live="polite"
          >
            You’ve reached the end
            of the latest stories.
          </div>
        )}

    </section>
  );
}
