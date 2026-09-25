import { NextResponse } from "next/server";

const WP_API = process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

export async function GET() {
  try {
    if (!WP_API) {
      return NextResponse.json(
        { error: "WordPress API URL is not configured" },
        { status: 500 }
      );
    }

    const url = new URL(`${WP_API}/categories`);
    url.searchParams.set("per_page", "100");
    url.searchParams.set("orderby", "name");
    url.searchParams.set("order", "asc");

    const response = await fetch(url.toString(), {
      headers: {
        Accept: "application/json",
      },
      next: {
        revalidate: 300,
      },
    });

    if (!response.ok) {
      const text = await response.text();

      return NextResponse.json(
        {
          error: "Failed to fetch WordPress categories",
          details: text,
        },
        { status: response.status }
      );
    }

    const categories = await response.json();

    return NextResponse.json(
      categories.map((category: any) => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
        count: category.count,
        parent: category.parent,
      }))
    );
  } catch (error) {
    console.error("Categories API error:", error);

    return NextResponse.json(
      {
        error: "Failed to fetch categories",
        details: String(error),
      },
      { status: 500 }
    );
  }
}