import { NextResponse } from "next/server";

import {
  getLiveScores,
  getStandings,
  getNextMatch,
} from "@/lib/football";

export async function GET() {
  try {
    const [
      liveScores,
      standings,
      nextMatch,
    ] = await Promise.all([
      getLiveScores(),
      getStandings(),
      getNextMatch(),
    ]);

    return NextResponse.json({
      liveScores,
      standings,
      nextMatch,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error:
          "Failed to fetch football data",
      },
      {
        status: 500,
      }
    );
  }
}