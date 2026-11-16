
import { NextRequest, NextResponse } from "next/server";

const WP_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2"
).replace(/\/+$/, "");

const MAX_COMMENT_LENGTH = 2000;

function json(data: unknown, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: {
      "Cache-Control": "no-store, max-age=0",
    },
  });
}

function plainText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function validPostId(value: string | null): number | null {
  if (!value || !/^\d+$/.test(value)) return null;

  const id = Number(value);

  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

/* -------------------------------------------------------------------------- */
/* GET: approved comments only                                                */
/* -------------------------------------------------------------------------- */

export async function GET(request: NextRequest) {
  const postId = validPostId(
    request.nextUrl.searchParams.get("postId")
  );

  if (!postId) {
    return json({ error: "A valid article ID is required." }, 400);
  }

  try {
    const response = await fetch(
      `${WP_API}/comments?post=${postId}&status=approve&per_page=50&orderby=date&order=asc`,
      {
        method: "GET",
        headers: {
          Accept: "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      console.error("[COMMENTS] WordPress GET failed:", response.status);

      return json(
        { error: "Comments are temporarily unavailable." },
        502
      );
    }

    const comments = await response.json();

    if (!Array.isArray(comments)) {
      return json({ comments: [] });
    }

    const safeComments = comments.map((comment: any) => ({
      id: comment.id,
      author: plainText(comment.author_name) || "Guest",
      date: comment.date,
      content: plainText(comment.content?.rendered),
    }));

    return json({ comments: safeComments });
  } catch (error) {
    console.error("[COMMENTS] GET error:", error);

    return json(
      { error: "Unable to load comments right now." },
      500
    );
  }
}

/* -------------------------------------------------------------------------- */
/* POST: submit an anonymous comment for WordPress moderation                 */
/* -------------------------------------------------------------------------- */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const postId = Number(body.postId);
    const author = typeof body.name === "string" ? body.name.trim() : "";
    const email = typeof body.email === "string" ? body.email.trim() : "";
    const content =
      typeof body.content === "string" ? body.content.trim() : "";

    // Honeypot field: silently accept bot submissions without forwarding.
    if (typeof body.website === "string" && body.website.trim()) {
      return json({
        success: true,
        message: "Your comment has been submitted for review.",
      });
    }

    if (
      !Number.isSafeInteger(postId) ||
      postId <= 0 ||
      !author ||
      author.length > 60 ||
      author.length < 2 ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ||
      email.length > 254 ||
      content.length < 3 ||
      content.length > MAX_COMMENT_LENGTH
    ) {
      return json(
        { error: "Please check your name, email and comment." },
        400
      );
    }

    const response = await fetch(`${WP_API}/comments`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify({
        post: postId,
        author_name: author,
        author_email: email,
        content,
        type: "comment",
      }),
    });

    const result = await response.json().catch(() => null);

    if (!response.ok) {
      console.error(
        "[COMMENTS] WordPress POST failed:",
        response.status,
        result?.code
      );

      return json(
        {
          error:
            "Your comment could not be submitted. Please try again.",
        },
        response.status === 400 ? 400 : 502
      );
    }

    return json({
      success: true,
      message: "Your comment has been submitted and is awaiting moderation.",
    }, 201);
  } catch (error) {
    console.error("[COMMENTS] POST error:", error);

    return json(
      { error: "Unable to submit your comment right now." },
      500
    );
  }
}
