import { NextResponse } from "next/server";

import {
  getLiveScores,
  getStandings,
  getArsenalNextMatch,
} from "@/lib/football";

export async function GET() {
  try {
    const liveScores =
      await getLiveScores();

    const standings =
      await getStandings();

    const nextMatch =
      await getArsenalNextMatch();

    return NextResponse.json({
      liveScores,
      standings,
      nextMatch,
    });
  } catch (error) {
    console.error(
      "Football API Error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch football data",
      },
      { status: 500 }
    );
  }
}