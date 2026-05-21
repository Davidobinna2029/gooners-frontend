import { NextResponse } from "next/server";

import {
  getPostBySlug,
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

    const post =
      await getPostBySlug(
        slug
      );

    return NextResponse.json(
      post
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          "Failed to fetch post",
      },
      {
        status: 500,
      }
    );
  }
}