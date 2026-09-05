import { NextRequest, NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

function extractImage(post: any): string | null {
  const media =
    post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    null;

  if (!url) {
    return null;
  }

  return url.startsWith("//")
    ? `https:${url}`
    : url;
}

function stripHtml(html?: string): string {
  if (!html) {
    return "";
  }

  return html
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET(request: NextRequest) {
  try {
    if (!WP_API) {
      return NextResponse.json(
        {
          error: "WordPress API URL is not configured",
        },
        {
          status: 500,
        }
      );
    }

    const searchParams =
      request.nextUrl.searchParams;

    const page = Math.max(
      1,
      Number(searchParams.get("page")) || 1
    );

    const perPage = Math.min(
      20,
      Math.max(
        1,
        Number(searchParams.get("per_page")) || 10
      )
    );

    const excludeParam =
      searchParams.get("exclude") || "";

    const excludedIds = new Set(
      excludeParam
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isInteger(id) && id > 0)
    );

    const wpUrl = new URL(
      `${WP_API}/posts`
    );

    wpUrl.searchParams.set(
      "page",
      String(page)
    );

    wpUrl.searchParams.set(
      "per_page",
      String(perPage)
    );

    wpUrl.searchParams.set(
      "_embed",
      "1"
    );

    const response = await fetch(
      wpUrl.toString(),
      {
        next: {
          revalidate: 30,
        },
      }
    );

    /*
     * WordPress returns 400 when a requested page
     * is beyond the available page range.
     *
     * Treat that as the natural end of the feed.
     */
    if (
      response.status === 400 &&
      page > 1
    ) {
      return NextResponse.json({
        posts: [],
        page,
        perPage,
        totalPosts: 0,
        totalPages: 0,
        hasMore: false,
      });
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Failed to fetch posts",
        },
        {
          status: response.status,
        }
      );
    }

    const posts = await response.json();

    if (!Array.isArray(posts)) {
      return NextResponse.json({
        posts: [],
        page,
        perPage,
        totalPosts: 0,
        totalPages: 0,
        hasMore: false,
      });
    }

    const totalPosts =
      Number(
        response.headers.get(
          "X-WP-Total"
        )
      ) || 0;

    const totalPages =
      Number(
        response.headers.get(
          "X-WP-TotalPages"
        )
      ) || 0;

    const normalized = posts
      .filter(
        (post) =>
          !excludedIds.has(
            Number(post.id)
          )
      )
      .map((post) => ({
        id: post.id,

        slug: post.slug,

        title: stripHtml(
          post.title?.rendered
        ),

        excerpt: stripHtml(
          post.excerpt?.rendered
        ),

        date: post.date,

        modified: post.modified,

        status: post.status,

        image: extractImage(post),

        author:
          post?._embedded?.author?.[0]
            ?.name ?? "Unknown",

        category:
          post?._embedded?.["wp:term"]?.[0]?.[0]
            ?.name ?? "",

        categories:
          post.categories ?? [],

        featuredMedia:
          post.featured_media ?? null,

        link: post.link,
      }));

    return NextResponse.json({
      posts: normalized,

      page,

      perPage,

      totalPosts,

      totalPages,

      hasMore:
        page < totalPages,
    });
  } catch (error: any) {
    console.error(
      "Posts API Error:",
      error
    );

    return NextResponse.json(
      {
        error: "Internal server error",
        details:
          error?.message ??
          "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}