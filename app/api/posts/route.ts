import { NextResponse } from "next/server";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

// Simple in-memory cache (helps Vercel reduce repeated calls)
let cache: any = null;
let lastFetch = 0;

const CACHE_TTL = 60 * 1000; // 1 minute

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);

    const page = url.searchParams.get("page") || "1";
    const perPage = url.searchParams.get("per_page") || "10";

    const now = Date.now();

    // Serve cache if still valid
    if (cache && now - lastFetch < CACHE_TTL) {
      return NextResponse.json(cache);
    }

    const res = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&page=${page}&per_page=${perPage}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) {
      console.error("WordPress API error:", res.status);

      // Fallback: return cache if available
      if (cache) {
        return NextResponse.json(cache);
      }

      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: 500 }
      );
    }

    const data = await res.json();

    // update cache
    cache = data;
    lastFetch = now;

    return NextResponse.json(data);
  } catch (error) {
    console.error("API route crash:", error);

    if (cache) {
      return NextResponse.json(cache);
    }

    return NextResponse.json(
      { error: "Server error fetching posts" },
      { status: 500 }
    );
  }
}