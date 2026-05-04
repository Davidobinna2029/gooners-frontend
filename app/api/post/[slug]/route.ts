import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  const { slug } = await context.params;

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?slug=${slug}&_embed`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();
    const post = data[0];

    if (!post) return NextResponse.json(null);

    return NextResponse.json({
      ...post,
      featured_image:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/placeholder.jpg",
    });
  } catch (error) {
    console.error("Post API Error:", error);
    return NextResponse.json(null);
  }
}