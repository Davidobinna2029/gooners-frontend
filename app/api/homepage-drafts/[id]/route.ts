import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

/*
|--------------------------------------------------------------------------
| GET SINGLE DRAFT
|--------------------------------------------------------------------------
*/

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    const draft =
      await prisma.homepageDraft.findUnique({
        where: {
          id,
        },
      });

    if (!draft) {
      return NextResponse.json(
        {
          error: "Draft not found.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json(draft);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load draft.",
      },
      {
        status: 500,
      }
    );
  }
}

/*
|--------------------------------------------------------------------------
| DELETE DRAFT
|--------------------------------------------------------------------------
*/

export async function DELETE(
  request: NextRequest,
  { params }: RouteContext
) {
  try {
    const { id } = await params;

    await prisma.homepageDraft.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to delete draft.",
      },
      {
        status: 500,
      }
    );
  }
}