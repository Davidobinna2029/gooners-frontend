import { NextRequest, NextResponse } from "next/server";

/**
 * EDGE IMAGE PROXY
 * - fetches remote images
 * - caches at CDN edge (Vercel)
 * - prevents WordPress blocking issues
 */
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  const url = searchParams.get("url");

  if (!url) {
    return new NextResponse("Missing URL", { status: 400 });
  }

  try {
    const imageRes = await fetch(url, {
      headers: {
        // trick some servers into allowing fetch
        "User-Agent": "Mozilla/5.0",
      },
    });

    if (!imageRes.ok) {
      return new NextResponse("Image fetch failed", {
        status: 502,
      });
    }

    const contentType =
      imageRes.headers.get("content-type") || "image/jpeg";

    const buffer = await imageRes.arrayBuffer();

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,

        /**
         * EDGE CACHING (VERY IMPORTANT)
         * 1 year immutable cache on CDN
         */
        "Cache-Control": "public, s-maxage=31536000, immutable",
      },
    });
  } catch (err) {
    return new NextResponse("Proxy error", { status: 500 });
  }
}