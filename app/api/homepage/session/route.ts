import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/*
|--------------------------------------------------------------------------
| GET CURRENT EDITING SESSION
|--------------------------------------------------------------------------
*/

export async function GET() {
  try {
    const session =
      await prisma.homepageEditingSession.findFirst({
        where: {
          active: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });

    return NextResponse.json(session);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load editing session.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| CREATE OR UPDATE SESSION
|--------------------------------------------------------------------------
*/

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      layout,
      editor = "Homepage Designer",
    } = body;

    const existing =
      await prisma.homepageEditingSession.findFirst({
        where: {
          active: true,
        },
      });

    if (existing) {
      const updated =
        await prisma.homepageEditingSession.update({
          where: {
            id: existing.id,
          },
          data: {
            layout,
            editor,
          },
        });

      return NextResponse.json(updated);
    }

    const created =
      await prisma.homepageEditingSession.create({
        data: {
          layout,
          editor,
          active: true,
        },
      });

    return NextResponse.json(created);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to save editing session.",
      },
      {
        status: 500,
      }
    );
  }
}