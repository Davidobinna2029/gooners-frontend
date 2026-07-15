import { NextRequest, NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

interface ScheduleRequest {
  title: string;
  layout: unknown;
  publishedBy: string;
  scheduledFor: string;
  notes?: string;
}

/*
|--------------------------------------------------------------------------
| SCHEDULE HOMEPAGE
|--------------------------------------------------------------------------
|
| Creates a homepage publication that will become live later.
|
*/

export async function POST(request: NextRequest) {
  try {
    const body =
      (await request.json()) as ScheduleRequest;

    const {
      title,
      layout,
      publishedBy,
      scheduledFor,
      notes,
    } = body;

    if (
      !title ||
      !layout ||
      !publishedBy ||
      !scheduledFor
    ) {
      return NextResponse.json(
        {
          error:
            "Missing required scheduling fields.",
        },
        {
          status: 400,
        }
      );
    }

    const scheduledDate =
      new Date(scheduledFor);

    if (
      Number.isNaN(
        scheduledDate.getTime()
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid scheduled date.",
        },
        {
          status: 400,
        }
      );
    }

    const publication =
      await prisma.homepagePublication.create({
        data: {
          title,

          layout: layout as any,

          publishedBy,

          notes,

          scheduledFor: scheduledDate,

          status: "scheduled",
        },
      });

    return NextResponse.json({
      success: true,
      publication,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to schedule homepage.",
      },
      {
        status: 500,
      }
    );
  }
}