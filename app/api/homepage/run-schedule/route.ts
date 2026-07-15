import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

/*
|--------------------------------------------------------------------------
| HOMEPAGE SCHEDULER
|--------------------------------------------------------------------------
|
| Finds every scheduled homepage whose scheduled time has passed
| and marks it as published.
|
| Intended to be called by:
|
| • Vercel Cron
| • GitHub Actions
| • EasyCron
| • UptimeRobot
| • Manual testing
|
*/

export async function GET() {
  try {
    const now = new Date();

    /**
     * Find due scheduled publications
     */
    const scheduled =
      await prisma.homepagePublication.findMany({
        where: {
          status: "scheduled",
          scheduledFor: {
            lte: now,
          },
        },
        orderBy: {
          scheduledFor: "asc",
        },
      });

    if (scheduled.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        message: "No scheduled homepages are due.",
      });
    }

    /**
     * Publish every due homepage
     */
    for (const publication of scheduled) {
      await prisma.homepagePublication.update({
        where: {
          id: publication.id,
        },
        data: {
          status: "published",
          publishedAt: new Date(),
        },
      });
    }

    return NextResponse.json({
      success: true,
      processed: scheduled.length,
      publications: scheduled.map((item) => ({
        id: item.id,
        title: item.title,
      })),
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to execute homepage scheduler.",
      },
      {
        status: 500,
      }
    );
  }
}