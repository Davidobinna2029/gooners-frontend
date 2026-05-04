import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_URL}/wp-json/wp/v2/posts?_embed&per_page=10`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
        },
        cache: "no-store",
      }
    );

    const data = await res.json();

    const posts = data.map((post: any) => ({
      id: post.id,
      slug: post.slug,
      title: post.title,
      excerpt: post.excerpt,
      content: post.content,
      featured_image:
        post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ||
        "/placeholder.jpg",
    }));

    return NextResponse.json(posts);
  } catch (error) {
    console.error("Posts API Error:", error);
    return NextResponse.json([]);
  }
}