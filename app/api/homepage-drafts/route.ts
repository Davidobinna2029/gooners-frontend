import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const drafts = await prisma.homepageDraft.findMany({
      orderBy: {
        updatedAt: "desc",
      },
    });

    return NextResponse.json(drafts);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to load homepage drafts.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: NextRequest
) {
  try {
    const body = await request.json();

    const {
      name,
      layout,
      createdBy,
    } = body;

    if (!name || !layout || !createdBy) {
      return NextResponse.json(
        {
          error: "Missing required fields.",
        },
        {
          status: 400,
        }
      );
    }

    const draft =
      await prisma.homepageDraft.create({
        data: {
          name,
          layout,
          createdBy,
        },
      });

    return NextResponse.json(draft);
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: "Failed to save homepage draft.",
      },
      {
        status: 500,
      }
    );
  }
}