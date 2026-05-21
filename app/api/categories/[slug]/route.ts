import { NextResponse } from "next/server";

import {
  getCategoryPosts,
} from "@/lib/api/wordpress";

interface Params {
  params: Promise<{
    slug: string;
  }>;
}

export async function GET(
  request: Request,
  { params }: Params
) {
  try {
    const { slug } =
      await params;

    const posts =
      await getCategoryPosts(
        slug
      );

    return NextResponse.json(
      posts
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch category posts",
      },
      {
        status: 500,
      }
    );
  }
}