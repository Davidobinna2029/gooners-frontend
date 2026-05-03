// app/api/posts/route.ts

import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/fallbackStore";

const WP =
  process.env.WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2/posts";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const page = searchParams.get("page") || "1";

  const key = `posts:${page}`;

  try {
    const res = await fetch(`${WP}?_embed&page=${page}&per_page=10`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      setCache(key, data);
      return NextResponse.json(data);
    }
  } catch (err) {
    console.error("Fetch error:", err);
  }

  const cached = getCache<any[]>(key);
  if (cached) return NextResponse.json(cached);

  return NextResponse.json([]);
}