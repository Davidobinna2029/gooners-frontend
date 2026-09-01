import { NextRequest, NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

/**
 * Extract Featured Image
 */
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

/**
 * Strip HTML tags
 */
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
    const page =
      Number(
        request.nextUrl.searchParams.get("page")
      ) || 1;

    const response = await fetch(
      `${WP_API}/posts?page=${page}&per_page=5&_embed=1`,
      {
        next: {
          revalidate: 30,
        },
      }
    );

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
      return NextResponse.json([]);
    }

    const normalized = posts.map((post) => ({
      id: post.id,

      slug: post.slug,

      title:
        stripHtml(
          post.title?.rendered
        ),

      excerpt:
        stripHtml(
          post.excerpt?.rendered
        ),

      date: post.date,

      modified: post.modified,

      status: post.status,

      image:
        extractImage(post),

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

    return NextResponse.json(normalized);
  } catch (error: any) {
    console.error(
      "Posts API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Internal server error",
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