import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/api/wordpress";

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{ slug: string }>;
  }
) {
  try {
    const { slug } = await context.params;

    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(null, {
        status: 404,
      });
    }

    // No image extraction here.
    // Raw WordPress data only.
    return NextResponse.json(post);
  } catch (error: unknown) {
    console.error(
      "GET /api/posts/[slug] failed:",
      error
    );

    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}