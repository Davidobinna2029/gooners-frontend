import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json(data[0] || null);
  } catch (error) {
    console.error("Post API Error:", error);
    return NextResponse.json(null);
  }
}