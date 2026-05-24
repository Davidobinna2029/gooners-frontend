import { NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function GET() {
  try {
    const wpRes = await fetch(
      `${WP_API}/posts?per_page=20&_embed=1`,
      {
        // IMPORTANT: prevents Vercel cold slowdown
        next: { revalidate: 30 },
      }
    );

    if (!wpRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: wpRes.status }
      );
    }

    const data = await wpRes.json();

    // HARD GUARD: always return array
    if (!Array.isArray(data)) {
      return NextResponse.json([]);
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Server error",
        details: error?.message ?? "unknown",
      },
      { status: 500 }
    );
  }
}