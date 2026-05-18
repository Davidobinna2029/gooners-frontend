import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch(`${process.env.ESPN_API_URL}/eng.1/scoreboard`);

    if (!res.ok) {
      return NextResponse.json(
        { error: "Failed to fetch scores" },
        { status: res.status }
      );
    }

    const data = await res.json();
    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { error: "Server error", details: error.message },
      { status: 500 }
    );
  }
}