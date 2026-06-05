import { NextRequest, NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function GET(request: NextRequest) {
  try {
    const page =
      Number(request.nextUrl.searchParams.get("page")) || 1;

    const wpRes = await fetch(
      `${WP_API}/posts?page=${page}&per_page=20&_embed=1`,
      {
        next: {
          revalidate: 30,
        },
      }
    );

    if (!wpRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch posts" },
        { status: wpRes.status }
      );
    }

    const data = await wpRes.json();

    return NextResponse.json(
      Array.isArray(data) ? data : []
    );
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