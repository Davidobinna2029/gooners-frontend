import { NextRequest, NextResponse } from "next/server";

import { Prisma } from "@prisma/client";

import { prisma } from "@/lib/db/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| RESTORE HOMEPAGE PUBLICATION
|--------------------------------------------------------------------------
|
| Creates a NEW publication from an existing publication.
| Nothing is overwritten.
|
| Timeline example:
|
| Morning Homepage
|        ↓
| Matchday Homepage
|        ↓
| Restored Morning Homepage
|
*/

export async function POST(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    /**
     * Load publication
     */
    const publication =
      await prisma.homepagePublication.findUnique({
        where: {
          id,
        },
      });

    if (!publication) {
      return NextResponse.json(
        {
          error: "Publication not found.",
        },
        {
          status: 404,
        }
      );
    }

    /**
     * Create a NEW publication
     * from the selected version.
     */
    const restored =
      await prisma.homepagePublication.create({
        data: {
          title: `${publication.title} (Restored)`,

          layout:
            publication.layout as Prisma.InputJsonValue,

          publishedBy: "Homepage Designer",

          publishedAt: new Date(),

          restoredFrom: publication.id,

          notes: `Restored from "${publication.title}"`,
        },
      });

    return NextResponse.json({
      success: true,
      publication: restored,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to restore homepage publication.",
      },
      {
        status: 500,
      }
    );
  }
}