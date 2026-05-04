import { NextResponse } from "next/server";

const SITE_URL = process.env.NEXT_PUBLIC_WORDPRESS_URL;

export async function GET(
  req: Request,
  { params }: { params: { slug: string } }
) {
  try {
    // get category ID
    const catRes = await fetch(
      `${SITE_URL}/wp-json/wp/v2/categories?slug=${params.slug}`
    );

    const cats = await catRes.json();
    const catId = cats[0]?.id;

    if (!catId) {
      return NextResponse.json([]);
    }

    // fetch posts in category
    const postRes = await fetch(
      `${SITE_URL}/wp-json/wp/v2/posts?categories=${catId}&_embed`
    );

    const posts = await postRes.json();

    return NextResponse.json(posts);
  } catch (err) {
    console.error("Category error:", err);
    return NextResponse.json([]);
  }
}