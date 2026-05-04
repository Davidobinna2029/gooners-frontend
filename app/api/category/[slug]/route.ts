import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?_embed`,
      { cache: "no-store" }
    );

    const data = await res.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Category API Error:", error);
    return NextResponse.json([]);
  }
}