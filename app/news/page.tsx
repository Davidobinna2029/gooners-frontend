import type { Metadata } from "next";
import Link from "next/link";

import { API_BASE } from "@/lib/api/core/apiBase";
import { sanitizeHtml } from "@/lib/sanitize/sanitizeHtml";

import NewsInfiniteScroll from "@/components/news/NewsInfiniteScroll";
import NewsTopicNav from "./NewsTopicNav";

export const revalidate = 30;

const POSTS_PER_PAGE = 5;
const SITE_URL = "https://arsenaltalks.com";

interface NewsPageProps {
  searchParams: Promise<{
    page?: string;
  }>;
}

interface WordPressPost {
  id: number;
  slug: string;
  date?: string;
  link?: string;
  title?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
  categories?: number[];
  _embedded?: {
    ["wp:featuredmedia"]?: Array<{
      source_url?: string;
      media_details?: {
        sizes?: {
          full?: {
            source_url?: string;
          };
          large?: {
            source_url?: string;
          };
          medium_large?: {
            source_url?: string;
          };
        };
      };
    }>;
    ["wp:term"]?: Array<
      Array<{
        id?: number;
        name?: string;
        slug?: string;
        taxonomy?: string;
      }>
    >;
  };
}

interface PostsResult {
  posts: WordPressPost[];
  totalPages: number;
}

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

function getPageNumber(value?: string): number {
  const parsed = Number.parseInt(value ?? "1", 10);

  if (!Number.isFinite(parsed) || parsed < 1) {
    return 1;
  }

  return parsed;
}

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || !value.trim()) {
    return null;
  }

  let url = value.trim();

  /*
   * Keep WordPress media on the API domain.
   * This matches the working image configuration used elsewhere
   * in the ArsenalTalks frontend.
   */
  url = url.replace(
    /^https?:\/\/(?:www\.)?arsenaltalks\.com/i,
    "https://api.arsenaltalks.com"
  );

  return url;
}

function extractImage(post: WordPressPost): string | null {
  const media = post._embedded?.["wp:featuredmedia"]?.[0];

  if (!media) {
    return null;
  }

  const imageUrl =
    media.source_url ??
    media.media_details?.sizes?.full?.source_url ??
    media.media_details?.sizes?.large?.source_url ??
    media.media_details?.sizes?.medium_large?.source_url ??
    null;

  return normalizeImageUrl(imageUrl);
}

function extractCategory(post: WordPressPost): string {
  const terms = post._embedded?.["wp:term"] ?? [];

  for (const termGroup of terms) {
    if (!Array.isArray(termGroup)) {
      continue;
    }

    const category = termGroup.find(
      (term) => term?.taxonomy === "category" && term?.name
    );

    if (category?.name) {
      return category.name;
    }
  }

  return "Arsenal";
}

async function getPosts(page: number): Promise<PostsResult> {
  const url = new URL(`${API_BASE}/posts`);

  url.searchParams.set("page", String(page));
  url.searchParams.set("per_page", String(POSTS_PER_PAGE));
  url.searchParams.set("_embed", "1");
  url.searchParams.set("orderby", "date");
  url.searchParams.set("order", "desc");

  try {
    const response = await fetch(url.toString(), {
      next: {
        revalidate: 30,
      },
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.error(
        `[NewsPage] WordPress API returned ${response.status} for page ${page}`
      );

      return {
        posts: [],
        totalPages: 0,
      };
    }

    const posts = (await response.json()) as WordPressPost[];

    const totalPagesHeader = response.headers.get("X-WP-TotalPages");

    const totalPages = totalPagesHeader
      ? Number.parseInt(totalPagesHeader, 10)
      : posts.length < POSTS_PER_PAGE
        ? page
        : page + 1;

    return {
      posts: Array.isArray(posts) ? posts : [],
      totalPages: Number.isFinite(totalPages) ? totalPages : page,
    };
  } catch (error) {
    console.error("[NewsPage] Failed to fetch WordPress posts:", error);

    return {
      posts: [],
      totalPages: 0,
    };
  }
}

export async function generateMetadata({
  searchParams,
}: NewsPageProps): Promise<Metadata> {
  const params = await searchParams;
  const page = getPageNumber(params.page);

  const isFirstPage = page === 1;

  const title = isFirstPage
    ? "Latest Arsenal News | ArsenalTalks"
    : `Latest Arsenal News — Page ${page} | ArsenalTalks`;

  const description = isFirstPage
    ? "Latest Arsenal news, transfer updates, injury reports, match coverage and stories from around the club."
    : `Latest Arsenal news and stories from ArsenalTalks — page ${page} of the latest Arsenal coverage.`;

  const canonical = isFirstPage
    ? `${SITE_URL}/news`
    : `${SITE_URL}/news?page=${page}`;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "ArsenalTalks",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NewsPage({
  searchParams,
}: NewsPageProps) {
  const params = await searchParams;

  const page = getPageNumber(params.page);

  const { posts, totalPages } = await getPosts(page);

  const pageExists = totalPages === 0 || page <= totalPages;

  const initialPosts: NewsPost[] = posts.map((post) => ({
    id: post.id,
    slug: post.slug,
    title: sanitizeHtml(post.title?.rendered ?? ""),
    excerpt: sanitizeHtml(post.excerpt?.rendered ?? ""),
    date: post.date,
    image: extractImage(post)
      ? {
          url: extractImage(post) ?? undefined,
        }
      : null,
    category: extractCategory(post),
  }));

  return (
    <main className="news-page">
      {/* =========================================================
          NEWSROOM INTRO
      ========================================================= */}
      <section className="news-hero">
        <div className="news-hero-inner">
          <div className="news-kicker">ARSENALTALKS NEWSROOM</div>

          <h1 className="news-title">
            {page === 1
              ? "Latest Arsenal News"
              : `Latest Arsenal News — Page ${page}`}
          </h1>

          <p className="news-intro">
            The latest Arsenal news, transfer updates, injury reports, match
            coverage and stories from around the club.
          </p>
        </div>
      </section>

      {/* =========================================================
          NEWS TOPIC NAVIGATION
          Client component handles active route state.
      ========================================================= */}
      <NewsTopicNav />

      {/* =========================================================
          MAIN NEWSROOM LAYOUT
      ========================================================= */}
      <div className="news-layout">
        {/* =======================================================
            MAIN FEED
        ======================================================= */}
        <section
          className="news-feed-column"
          aria-label="Latest Arsenal news"
        >
          {!pageExists || initialPosts.length === 0 ? (
            <div className="news-empty">
              <h2>No stories found</h2>

              <p>
                There are currently no Arsenal stories available for this
                page.
              </p>

              {page > 1 && (
                <Link href="/news" className="news-read-more">
                  Return to latest news →
                </Link>
              )}
            </div>
          ) : (
            <NewsInfiniteScroll
              initialPosts={initialPosts}
              initialPage={page}
              totalPages={totalPages}
              hasMore={page < totalPages}
            />
          )}
        </section>

        {/* =======================================================
            SIDEBAR
        ======================================================= */}
        <aside
          className="news-sidebar"
          aria-label="ArsenalTalks news navigation"
        >
          {/* Arsenal News */}
          <section className="news-sidebar-block">
            <h2 className="news-sidebar-heading">Arsenal News</h2>

            <nav aria-label="Arsenal news categories">
              <Link
                href="/category/arsenal"
                className="news-sidebar-link"
              >
                Arsenal
              </Link>

              <Link
                href="/category/injury-news"
                className="news-sidebar-link"
              >
                Injury News
              </Link>

              <Link
                href="/category/match-reports"
                className="news-sidebar-link"
              >
                Match Reports
              </Link>

              <Link
                href="/category/women"
                className="news-sidebar-link"
              >
                Arsenal Women
              </Link>

              <Link
                href="/opinion"
                className="news-sidebar-link"
              >
                Opinion
              </Link>
            </nav>
          </section>

          {/* Transfer Hub */}
          <section className="news-sidebar-block">
            <h2 className="news-sidebar-heading">Transfer Hub</h2>

            <nav aria-label="Transfer navigation">
              <Link
                href="/transfers"
                className="news-sidebar-link"
              >
                Transfer News
              </Link>

              <Link
                href="/category/transfer-news"
                className="news-sidebar-link"
              >
                Latest Transfer Stories
              </Link>
            </nav>
          </section>

          {/* Match Coverage */}
          <section className="news-sidebar-block">
            <h2 className="news-sidebar-heading">Match Coverage</h2>

            <nav aria-label="Match coverage navigation">
              <Link
                href="/fixtures"
                className="news-sidebar-link"
              >
                Fixtures
              </Link>

              <Link
                href="/standings"
                className="news-sidebar-link"
              >
                Premier League Table
              </Link>

              <Link
                href="/category/match-reports"
                className="news-sidebar-link"
              >
                Match Reports
              </Link>
            </nav>
          </section>
        </aside>
      </div>

      {/* =========================================================
          CRAWLABLE PAGINATION
          Kept server-rendered for SEO.
      ========================================================= */}
      {pageExists && totalPages > 0 && (
        <nav
          className="news-pagination"
          aria-label="News pagination"
        >
          {page > 1 && (
            <Link
              href={page === 2 ? "/news" : `/news?page=${page - 1}`}
              rel="prev"
            >
              ← Previous
            </Link>
          )}

          <span>
            Page {page}
            {totalPages > 0 ? ` of ${totalPages}` : ""}
          </span>

          {page < totalPages && (
            <Link
              href={`/news?page=${page + 1}`}
              rel="next"
            >
              Next →
            </Link>
          )}
        </nav>
      )}
    </main>
  );
}