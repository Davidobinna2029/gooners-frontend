
"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import NewsCard from "@/components/news/NewsCard";
import type { CanonicalPost } from "@/types/content";

interface ApiPost {
  id: number;
  slug: string;
  date: string;
  title: string;
  excerpt?: string;
  content?: string;
  image: CanonicalPost["image"];
  categories?: number[];
  tags?: number[];
  category?: string | null;
  categoryName?: string | null;
  categoryNames?: string[];
  link?: string;
}

interface ApiPostsResponse {
  posts?: ApiPost[];
  page?: number;
  perPage?: number;
  totalPages?: number;
  totalPosts?: number;
  hasMore?: boolean;
  error?: string;
  message?: string;
}

interface HomepageInfiniteScrollProps {
  initialPosts?: CanonicalPost[];
  excludedIds?: number[];
}

function getCategoryNames(post: ApiPost): string[] {
  const candidates = [
    ...(Array.isArray(post.categoryNames) ? post.categoryNames : []),
    post.categoryName,
    post.category,
  ];

  const names: string[] = [];
  const seen = new Set<string>();

  for (const candidate of candidates) {
    if (typeof candidate !== "string") continue;

    const name = candidate.trim();
    if (!name) continue;

    const key = name.toLowerCase();

    if (seen.has(key)) continue;

    seen.add(key);
    names.push(name);
  }

  return names;
}

function normalizeCluster(
  category?: string | null
): CanonicalPost["cluster"] {
  if (typeof category !== "string" || !category.trim()) {
    return "other";
  }

  const normalized = category
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");

  if (
    normalized === "arsenal" ||
    normalized === "arsenal news"
  ) {
    return "arsenal";
  }

  if (normalized.includes("transfer")) {
    return "transfer";
  }

  if (
    normalized.includes("injury") ||
    normalized.includes("injuries")
  ) {
    return "injury";
  }

  if (
    normalized.includes("match") ||
    normalized.includes("fixture") ||
    normalized.includes("result")
  ) {
    return "match";
  }

  return "other";
}

function normalizePost(post: ApiPost): CanonicalPost {
  const categoryNames = getCategoryNames(post);
  const primaryCategory = categoryNames[0] ?? null;

  return {
    id: post.id,
    slug: post.slug,
    date: post.date,
    title: post.title,
    excerpt: post.excerpt ?? "",
    content: post.content,
    image: post.image ?? null,

    categories: Array.isArray(post.categories)
      ? post.categories
      : [],

    categoryName: primaryCategory,
    categoryNames,

    tags: Array.isArray(post.tags) ? post.tags : [],
    score: 0,

    cluster: normalizeCluster(
      primaryCategory ?? post.category
    ),

    link: post.link,
  };
}

function isValidApiPost(post: unknown): post is ApiPost {
  if (!post || typeof post !== "object") {
    return false;
  }

  const candidate = post as Partial<ApiPost>;

  return (
    typeof candidate.id === "number" &&
    Number.isFinite(candidate.id) &&
    typeof candidate.slug === "string" &&
    typeof candidate.title === "string" &&
    typeof candidate.date === "string"
  );
}

export default function HomepageInfiniteScroll({
  initialPosts = [],
  excludedIds = [],
}: HomepageInfiniteScrollProps) {
  const [posts, setPosts] = useState<CanonicalPost[]>(() => {
    const validPosts = Array.isArray(initialPosts)
      ? initialPosts.filter(
          (post): post is CanonicalPost =>
            Boolean(
              post &&
              typeof post.id === "number" &&
              typeof post.slug === "string"
            )
        )
      : [];

    const excluded = new Set(excludedIds);

    return validPosts.filter((post) => !excluded.has(post.id));
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const loadingRef = useRef(false);
  const pageRef = useRef(1);
  const hasMoreRef = useRef(true);
  const sentinelInViewRef = useRef(false);
  const postsRef = useRef<CanonicalPost[]>(posts);

  useEffect(() => {
    postsRef.current = posts;
  }, [posts]);

  const loadMore = useCallback(async () => {
    if (loadingRef.current || !hasMoreRef.current) {
      return;
    }

    loadingRef.current = true;
    setIsLoading(true);
    setError(null);

    try {
      const nextPage = pageRef.current + 1;
      const currentPosts = postsRef.current;

      const excludedPostIds = [
        ...new Set([
          ...excludedIds.filter(
            (id) => typeof id === "number" && Number.isFinite(id)
          ),
          ...currentPosts
            .map((post) => post.id)
            .filter(
              (id) => typeof id === "number" && Number.isFinite(id)
            ),
        ]),
      ];

      const params = new URLSearchParams({
        page: String(nextPage),
        per_page: "10",
      });

      if (excludedPostIds.length > 0) {
        params.set("exclude", excludedPostIds.join(","));
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
          `Failed to load more stories (${response.status}).`
        );
      }

      const data = (await response.json()) as ApiPostsResponse;

      if (!data || !Array.isArray(data.posts)) {
        throw new Error(
          data?.message ||
            data?.error ||
            "The server returned an invalid stories response."
        );
      }

      const existingIds = new Set([
        ...excludedIds,
        ...currentPosts.map((post) => post.id),
      ]);

      const existingSlugs = new Set(
        currentPosts.map((post) => post.slug)
      );

      const incoming = data.posts
        .filter(isValidApiPost)
        .filter(
          (post) =>
            !existingIds.has(post.id) &&
            !existingSlugs.has(post.slug)
        )
        .map(normalizePost);

      if (incoming.length > 0) {
        setPosts((previous) => {
          const knownIds = new Set([
            ...excludedIds,
            ...previous.map((post) => post.id),
          ]);

          const knownSlugs = new Set(
            previous.map((post) => post.slug)
          );

          const uniqueIncoming = incoming.filter((post) => {
            if (
              knownIds.has(post.id) ||
              knownSlugs.has(post.slug)
            ) {
              return false;
            }

            knownIds.add(post.id);
            knownSlugs.add(post.slug);

            return true;
          });

          if (uniqueIncoming.length === 0) {
            return previous;
          }

          const updated = [...previous, ...uniqueIncoming];
          postsRef.current = updated;

          return updated;
        });
      }

      pageRef.current = nextPage;

      const moreAvailable =
        typeof data.hasMore === "boolean"
          ? data.hasMore
          : typeof data.totalPages === "number"
            ? nextPage < data.totalPages
            : incoming.length > 0;

      const shouldContinue =
        moreAvailable && incoming.length > 0;

      hasMoreRef.current = shouldContinue;
      setHasMore(shouldContinue);

      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.set("page", String(nextPage));

        window.history.replaceState(
          {},
          "",
          `${url.pathname}${url.search}${url.hash}`
        );
      }
    } catch (caughtError: unknown) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to load more stories. Please try again."
      );
    } finally {
      loadingRef.current = false;
      setIsLoading(false);
    }
  }, [excludedIds]);

  const retryLoadMore = useCallback(() => {
    setError(null);
    sentinelInViewRef.current = false;
    void loadMore();
  }, [loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;

    if (!sentinel || !hasMore) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];

        if (!entry) return;

        if (!entry.isIntersecting) {
          sentinelInViewRef.current = false;
          return;
        }

        if (
          sentinelInViewRef.current ||
          loadingRef.current ||
          !hasMoreRef.current
        ) {
          return;
        }

        sentinelInViewRef.current = true;
        void loadMore();
      },
      {
        root: null,
        rootMargin: "400px 0px",
        threshold: 0,
      }
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [hasMore, loadMore]);

  return (
    <section aria-label="Latest Arsenal news">
      <div className="sky-news-list">
        {Array.isArray(posts) &&
          posts.map((post) => (
            <NewsCard
              key={`${post.id}-${post.slug}`}
              post={post}
            />
          ))}
      </div>

      {error && (
        <div
          className="my-6 flex flex-col items-center gap-3 text-center"
          role="alert"
        >
          <p className="text-sm text-red-600">{error}</p>

          <button
            type="button"
            onClick={retryLoadMore}
            disabled={isLoading}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Try Again
          </button>
        </div>
      )}

      {isLoading && (
        <p
          className="my-6 text-center text-sm text-gray-500"
          role="status"
          aria-live="polite"
        >
          Loading more stories…
        </p>
      )}

      {!hasMore && posts.length > 0 && (
        <p className="my-6 text-center text-sm text-gray-500">
          You&apos;re all caught up.
        </p>
      )}

      <div
        ref={sentinelRef}
        aria-hidden="true"
        className="h-px w-full"
      />
    </section>
  );
}
