import { NextRequest, NextResponse } from "next/server";

const ALLOWED = ["arsenaltalks.com", "i0.wp.com", "i1.wp.com", "i2.wp.com"];

function allowed(url: string) {
  try {
    const host = new URL(url).hostname;
    return ALLOWED.some((d) => host.includes(d));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const url = searchParams.get("url");

  if (!url || !allowed(url)) {
    return new NextResponse("Invalid image", { status: 403 });
  }

  try {
    const res = await fetch(url);

    if (!res.ok || !res.body) {
      return new NextResponse("Image failed", { status: 502 });
    }

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": res.headers.get("content-type") || "image/jpeg",
        "Cache-Control": "public, s-maxage=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Proxy error", { status: 500 });
  }
}