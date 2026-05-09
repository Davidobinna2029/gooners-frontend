import { NextResponse } from "next/server";

const API =
  "https://api.arsenaltalks.com/wp-json/wp/v2";

export async function GET(
  request: Request
) {
  const { searchParams } =
    new URL(request.url);

  const page =
    searchParams.get("page") ||
    "1";

  try {
    const res = await fetch(
      `${API}/posts?_embed&per_page=6&page=${page}`,
      {
        next: {
          revalidate: 60,
        },
      }
    );

    const data =
      await res.json();

    return NextResponse.json(
      data
    );
  } catch (error) {
    return NextResponse.json(
      []
    );
  }
}