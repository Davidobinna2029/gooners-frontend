import { NextResponse } from "next/server";

import {
  getCategoryPosts,
} from "@/lib/wordpress";

export async function GET(
  request: Request,
  context: {
    params: Promise<{
      slug: string;
    }>;
  }
) {
  try {
    const { slug } =
      await context.params;

    const posts =
      await getCategoryPosts(
        slug
      );

    return NextResponse.json(
      posts
    );
  } catch (error) {
    console.error(
      "Category Route Error:",
      error
    );

    return NextResponse.json(
      []
    );
  }
}