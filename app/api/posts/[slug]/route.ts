import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/api/wordpress";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;

    const post = await getPostBySlug(slug);

    if (!post) {
      return NextResponse.json(null, { status: 404 });
    }

    // ❌ NO IMAGE EXTRACTION HERE
    // ✅ RAW WORDPRESS DATA ONLY
    return NextResponse.json(post);
  } catch (error: any) {
    return NextResponse.json(
      {
        error: "Failed to fetch post",
        details: error?.message ?? "unknown",
      },
      { status: 500 }
    );
  }
}