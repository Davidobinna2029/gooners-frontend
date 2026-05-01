import { NextResponse } from "next/server";

const WORDPRESS_URL =
  process.env.NEXT_PUBLIC_WORDPRESS_URL ||
  "https://api.arsenaltalks.com";

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // 1. Get category ID
    const catRes = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/categories?slug=${params.slug}`
    );

    const categories = await catRes.json();
    const categoryId = categories?.[0]?.id;

    if (!categoryId) {
      return NextResponse.json([]);
    }

    // 2. Fetch posts in that category
    const postsRes = await fetch(
      `${WORDPRESS_URL}/wp-json/wp/v2/posts?categories=${categoryId}&_embed`
    );

    const posts = await postsRes.json();

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json([]);
  }
}