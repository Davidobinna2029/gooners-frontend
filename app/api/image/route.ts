import { NextRequest, NextResponse } from "next/server";

const ALLOWED = [
  "arsenaltalks.com",
  "i0.wp.com",
  "i1.wp.com",
  "i2.wp.com",
  "wordpress.com",
];

function isAllowed(url: string) {
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

  if (!url || !isAllowed(url)) {
    return new NextResponse("Invalid image source", { status: 403 });
  }

  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!res.ok || !res.body) {
      return new NextResponse("Image fetch failed", { status: 502 });
    }

    const contentType =
      res.headers.get("content-type") || "image/jpeg";

    return new NextResponse(res.body, {
      headers: {
        "Content-Type": contentType,

        /**
         * ESPN-style CDN caching (safe)
         */
        "Cache-Control": "public, s-maxage=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Proxy error", { status: 500 });
  }
}