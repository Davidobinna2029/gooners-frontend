import { NextResponse } from "next/server";

export async function GET() {
  try {
    const wpRes = await fetch(
      `${process.env.NEXT_PUBLIC_WORDPRESS_API_URL}/categories`
    );

    if (!wpRes.ok) {
      return NextResponse.json(
        { error: "Failed to fetch categories" },
        { status: wpRes.status }
      );
    }

    const data = await wpRes.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}