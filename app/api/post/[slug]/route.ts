// app/api/post/[slug]/route.ts

import { NextResponse } from "next/server";
import { getCache, setCache } from "@/lib/fallbackStore";

const WP =
  process.env.WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2/posts";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  const key = `post:${params.slug}`;

  try {
    const res = await fetch(`${WP}?slug=${params.slug}&_embed`, {
      headers: { "User-Agent": "Mozilla/5.0" },
      cache: "no-store",
    });

    if (res.ok) {
      const data = await res.json();
      const post = data[0] || null;

      if (post) setCache(key, post);

      return NextResponse.json(post);
    }
  } catch (err) {
    console.error("Post fetch error:", err);
  }

  const cached = getCache<any>(key);
  if (cached) return NextResponse.json(cached);

  return NextResponse.json(null);
}