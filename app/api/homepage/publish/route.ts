import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/db/prisma";

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      layout,
      publishedBy = "Homepage Designer",
      draftId = null,
    } = body;

    if (!layout) {
      return NextResponse.json(
        {
          error: "Missing homepage layout.",
        },
        {
          status: 400,
        }
      );
    }

    /*
     * Remove previous publication
     */

    await prisma.homepagePublication.deleteMany();

    /*
     * Publish new homepage
     */

    const publication =
      await prisma.homepagePublication.create({
        data: {
          draftId,
          layout,
          publishedBy,
          publishedAt: new Date(),
        },
      });

    /*
     * Optional:
     * Mark the draft as published
     */

    if (draftId) {
      await prisma.homepageDraft.update({
        where: {
          id: draftId,
        },
        data: {
          published: true,
        },
      });
    }

    /*
     * Refresh pages
     */

    revalidatePath("/");
    revalidatePath("/preview/homepage");

    return NextResponse.json({
      success: true,
      publication,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to publish homepage.",
      },
      {
        status: 500,
      }
    );
  }
}