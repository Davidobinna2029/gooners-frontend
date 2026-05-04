import { NextResponse } from "next/server";
import { getStandings, getMatches } from "@/lib/football";

export async function GET() {
  try {
    const standings = await getStandings();
    const matches = await getMatches();

    return NextResponse.json({
      standings,
      matches,
    });
  } catch (error) {
    console.error("Football API Error:", error);
    return NextResponse.json({});
  }
}