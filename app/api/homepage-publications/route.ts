import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const publications =
      await prisma.homepagePublication.findMany({
        orderBy: {
          publishedAt: "desc",
        },
      });

    return NextResponse.json(publications);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to load publication history.",
      },
      {
        status: 500,
      }
    );
  }
}