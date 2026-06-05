import { NextRequest, NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

/**
 * SAFE IMAGE EXTRACTOR
 */
function extractImage(post: any): string | null {
  const media =
    post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    null;

  if (!url) return null;

  return url.startsWith("//") ? `https:${url}` : url;
}

export async function GET(request: NextRequest) {
  try {
    const page =
      Number(request.nextUrl.searchParams.get("page")) || 1;

    const wpRes = await fetch(
      `${WP_API}/posts?page=${page}&per_page=20&_embed=1`,
      {
        next: {
          revalidate: 30,
        },
      }
    );

    if (!wpRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: wpRes.status }
      );
    }

    const data = await wpRes.json();

    if (!Array.isArray(data)) {
      return NextResponse.json([]);
    }

    /**
     * FORCE IMAGE CONSISTENCY LAYER
     */
    const normalized = data.map((post) => ({
      ...post,

      /**
       * ALWAYS GUARANTEE THIS EXISTS
       */
      image: extractImage(post),
    }));

    return NextResponse.json(normalized);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error?.message ?? "unknown",
      },
      { status: 500 }
    );
  }
}