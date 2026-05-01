import { NextResponse } from "next/server";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    const res = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${params.slug}&_embed`,
      { next: { revalidate: 60 } }
    );

    if (!res.ok) {
      return NextResponse.json(null);
    }

    const data = await res.json();
    return NextResponse.json(data?.[0] || null);
  } catch {
    return NextResponse.json(null);
  }
}