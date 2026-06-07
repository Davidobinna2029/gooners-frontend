import { NextRequest, NextResponse } from "next/server";
import { getPostBySlug } from "@/lib/api/wordpress";

function extractImage(post: any): string | null {
  const media =
    post?._embedded?.["wp:featuredmedia"]?.[0];

  const url =
    media?.source_url ||
    media?.media_details?.sizes?.large?.source_url ||
    media?.media_details?.sizes?.full?.source_url ||
    null;

  if (!url) return null;

  return url.startsWith("//")
    ? `https:${url}`
    : url;
}

export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const { slug } = await context.params;

    const post = await getPostBySlug(slug);

    return NextResponse.json({
      ...post,
      image: post ? extractImage(post) : null,
    });
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