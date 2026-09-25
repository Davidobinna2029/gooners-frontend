import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import {
  getAllWorkflows,
  updateWorkflow,
  type WorkflowStatus,
} from "@/lib/editorial/workflow";

const WP_API = (
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL || ""
).replace(/\/+$/, "");

const WP_USERNAME =
  process.env.WORDPRESS_USERNAME ||
  process.env.WP_USERNAME ||
  "";

const WP_APP_PASSWORD =
  process.env.WORDPRESS_APP_PASSWORD ||
  process.env.WP_APP_PASSWORD ||
  "";

const WP_REQUEST_TIMEOUT = 30_000;

const VALID_STATUSES: WorkflowStatus[] = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
];

const WRITER_ALLOWED_STATUSES: WorkflowStatus[] = [
  "DRAFT",
  "IN_REVIEW",
];

type SessionUser = {
  id?: string;
  email?: string | null;
  role?: string;
};

function getWpAuthHeader() {
  if (!WP_USERNAME || !WP_APP_PASSWORD) {
    throw new Error(
      "WordPress authentication credentials are not configured."
    );
  }

  return `Basic ${Buffer.from(
    `${WP_USERNAME}:${WP_APP_PASSWORD}`
  ).toString("base64")}`;
}

async function wpFetch(
  url: string,
  options: RequestInit,
  operation: string
): Promise<Response> {
  const controller = new AbortController();

  const timeout = setTimeout(() => {
    controller.abort();
  }, WP_REQUEST_TIMEOUT);

  try {
    return await fetch(url, {
      ...options,
      signal: controller.signal,
      cache: "no-store",
    });
  } catch (error: unknown) {
    const message =
      error instanceof Error
        ? error.message
        : "Unknown network error.";

    const errorName =
      error instanceof Error
        ? error.name
        : "";

    if (
      errorName === "AbortError" ||
      message.toLowerCase().includes("aborted")
    ) {
      throw new Error(
        `WordPress ${operation} timed out after ${
          WP_REQUEST_TIMEOUT / 1000
        } seconds.`
      );
    }

    throw new Error(
      `WordPress ${operation} failed: ${message}`
    );
  } finally {
    clearTimeout(timeout);
  }
}

function resolveAuthorName(post: any): string {
  const embeddedAuthor =
    post?._embedded?.author?.[0];

  if (
    embeddedAuthor &&
    !embeddedAuthor.code &&
    typeof embeddedAuthor.name === "string" &&
    embeddedAuthor.name.trim()
  ) {
    return embeddedAuthor.name.trim();
  }

  if (
    Number.isInteger(post?.author) &&
    post.author > 0
  ) {
    return `WordPress Author #${post.author}`;
  }

  return "Unknown Author";
}

function getCategoryName(post: any): string {
  const terms =
    post?._embedded?.["wp:term"] ?? [];

  const categoryGroup =
    terms.find(
      (group: any[]) =>
        Array.isArray(group) &&
        group.some(
          (term: any) =>
            term?.taxonomy === "category"
        )
    ) ?? [];

  return (
    categoryGroup.find(
      (term: any) =>
        term?.taxonomy === "category"
    )?.name ??
    "Uncategorized"
  );
}

function getFeaturedImage(post: any): string | null {
  const image =
    post?._embedded?.[
      "wp:featuredmedia"
    ]?.[0]?.source_url;

  return typeof image === "string" &&
    image.trim()
    ? image
    : null;
}

function deriveWorkflowStatus(
  wordpressStatus: string | undefined
): WorkflowStatus {
  switch (wordpressStatus) {
    case "publish":
      return "PUBLISHED";

    case "pending":
      return "IN_REVIEW";

    case "draft":
    case "future":
    default:
      return "DRAFT";
  }
}

function buildWorkflowFromWordPress(
  post: any
) {
  return {
    id: `wp-${post.id}`,
    postId: Number(post.id),

    status: deriveWorkflowStatus(
      post.status
    ),

    updatedBy: "WordPress",

    updatedAt:
      post.modified ||
      post.date ||
      new Date().toISOString(),

    title:
      post?.title?.rendered ||
      `Post #${post.id}`,

    slug:
      post?.slug ||
      null,

    author:
      resolveAuthorName(post),

    category:
      getCategoryName(post),

    image:
      getFeaturedImage(post),

    articleUrl:
      post?.link ||
      null,
  };
}

async function getWordPressPostsForFallback() {
  if (!WP_API) {
    throw new Error(
      "WordPress API URL is not configured."
    );
  }

  const response =
    await wpFetch(
      `${WP_API}/posts?per_page=50&page=1&_embed=1&orderby=date&order=desc`,
      {
        method: "GET",
        headers: {
          Authorization:
            getWpAuthHeader(),
          Accept:
            "application/json",
        },
      },
      "workflow fallback request"
    );

  const responseText =
    await response.text();

  let posts: any = null;

  try {
    posts = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    posts = null;
  }

  if (!response.ok) {
    throw new Error(
      posts?.message ||
        responseText ||
        `WordPress returned HTTP ${response.status}.`
    );
  }

  if (!Array.isArray(posts)) {
    throw new Error(
      "WordPress returned an invalid posts response."
    );
  }

  return posts.map(
    buildWorkflowFromWordPress
  );
}

async function getWordPressPost(
  postId: number
) {
  if (!WP_API) {
    throw new Error(
      "WordPress API URL is not configured."
    );
  }

  const response =
    await wpFetch(
      `${WP_API}/posts/${postId}?_embed=1`,
      {
        method: "GET",
        headers: {
          Authorization:
            getWpAuthHeader(),
          Accept:
            "application/json",
        },
      },
      `GET post #${postId}`
    );

  const responseText =
    await response.text();

  let post: any = null;

  try {
    post = responseText
      ? JSON.parse(responseText)
      : null;
  } catch {
    post = null;
  }

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(
      post?.message ||
        responseText ||
        `WordPress returned HTTP ${response.status}.`
    );
  }

  return post;
}

/**
 * GET /api/workflows
 *
 * Neon is preferred when available.
 *
 * If Neon is unavailable because of quota,
 * WordPress becomes the fallback source.
 */
export async function GET() {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * TRY NEON FIRST
     * ---------------------------------------------------------
     */

    try {
      const workflows =
        await getAllWorkflows();

      const enriched =
        await Promise.all(
          workflows.map(
            async (workflow) => {
              try {
                const post =
                  await getWordPressPost(
                    workflow.postId
                  );

                if (!post) {
                  return {
                    ...workflow,
                    title:
                      `Post #${workflow.postId}`,
                    slug: null,
                    author:
                      "Unknown Author",
                    category:
                      "Uncategorized",
                    image: null,
                    articleUrl: null,
                  };
                }

                return {
                  ...workflow,

                  title:
                    post?.title?.rendered ||
                    `Post #${workflow.postId}`,

                  slug:
                    post?.slug ||
                    null,

                  author:
                    resolveAuthorName(post),

                  category:
                    getCategoryName(post),

                  image:
                    getFeaturedImage(post),

                  articleUrl:
                    post?.link ||
                    null,
                };
              } catch (error) {
                console.error(
                  `Failed to enrich workflow for post ${workflow.postId}:`,
                  error
                );

                return {
                  ...workflow,
                  title:
                    `Post #${workflow.postId}`,
                  slug: null,
                  author:
                    "Unknown Author",
                  category:
                    "Uncategorized",
                  image: null,
                  articleUrl: null,
                };
              }
            }
          )
        );

      return NextResponse.json(
        enriched,
        {
          headers: {
            "X-ArsenalTalks-Workflow-Source":
              "neon",
          },
        }
      );
    } catch (neonError) {
      /*
       * Neon is optional.
       *
       * This is expected while the Neon Free
       * plan is over its compute allowance.
       */
      console.warn(
        "Neon workflow storage unavailable. Using WordPress fallback.",
        neonError
      );

      const fallback =
        await getWordPressPostsForFallback();

      return NextResponse.json(
        fallback,
        {
          headers: {
            "X-ArsenalTalks-Workflow-Source":
              "wordpress",
          },
        }
      );
    }
  } catch (error: unknown) {
    console.error(
      "GET /api/workflows failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to load editorial workflows.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * POST /api/workflows
 *
 * WordPress is updated FIRST.
 *
 * Neon is optional persistence.
 */
export async function POST(
  request: NextRequest
) {
  try {
    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          error: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      session.user as SessionUser;

    const userId =
      user.id;

    if (!userId) {
      return NextResponse.json(
        {
          error:
            "Authenticated user ID is missing.",
        },
        {
          status: 401,
        }
      );
    }

    let body: unknown;

    try {
      body =
        await request.json();
    } catch {
      return NextResponse.json(
        {
          error:
            "Invalid JSON body.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof body !== "object" ||
      body === null ||
      Array.isArray(body)
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid request body.",
        },
        {
          status: 400,
        }
      );
    }

    const payload =
      body as {
        postId?: unknown;
        status?: unknown;
      };

    if (
      typeof payload.postId !==
        "number" ||
      !Number.isInteger(
        payload.postId
      ) ||
      payload.postId <= 0
    ) {
      return NextResponse.json(
        {
          error: "Invalid postId.",
          message:
            "postId must be a positive integer.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof payload.status !==
        "string" ||
      !VALID_STATUSES.includes(
        payload.status as WorkflowStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            "Invalid workflow status.",
          allowedStatuses:
            VALID_STATUSES,
        },
        {
          status: 400,
        }
      );
    }

    const status =
      payload.status as WorkflowStatus;

    /*
     * Writers can only move stories to
     * Draft or In Review.
     */
    if (
      user.role === "WRITER" &&
      !WRITER_ALLOWED_STATUSES.includes(
        status
      )
    ) {
      return NextResponse.json(
        {
          error: "Forbidden.",
          message:
            "Writers can only set workflow status to DRAFT or IN_REVIEW.",
        },
        {
          status: 403,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * VERIFY WORDPRESS POST
     * ---------------------------------------------------------
     */

    let existingPost: any;

    try {
      existingPost =
        await getWordPressPost(
          payload.postId
        );
    } catch (error: unknown) {
      console.error(
        "Failed to load WordPress post before workflow update:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not connect to WordPress.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown WordPress error.",
          operation:
            "wordpress-read",
        },
        {
          status: 502,
        }
      );
    }

    if (!existingPost) {
      return NextResponse.json(
        {
          error:
            "WordPress post not found.",
        },
        {
          status: 404,
        }
      );
    }

    /*
     * ---------------------------------------------------------
     * MAP WORKFLOW → WORDPRESS
     * ---------------------------------------------------------
     *
     * DRAFT       → draft
     * IN_REVIEW   → draft
     * APPROVED    → draft
     * PUBLISHED   → publish
     * REJECTED    → draft
     *
     * Approved does NOT publish.
     */

    const wordpressStatus =
      status === "PUBLISHED"
        ? "publish"
        : "draft";

    let wordpressResponse:
      | Response
      | null = null;

    try {
      wordpressResponse =
        await wpFetch(
          `${WP_API}/posts/${payload.postId}`,
          {
            method: "PUT",
            headers: {
              Authorization:
                getWpAuthHeader(),
              "Content-Type":
                "application/json",
              Accept:
                "application/json",
            },
            body: JSON.stringify({
              status:
                wordpressStatus,
            }),
          },
          `workflow update for post #${payload.postId}`
        );
    } catch (error: unknown) {
      console.error(
        "WordPress workflow update failed:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not connect to WordPress while updating the workflow.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown WordPress error.",
          operation:
            "wordpress-update",
        },
        {
          status: 502,
        }
      );
    }

    const wordpressText =
      await wordpressResponse.text();

    let updatedPost: any = null;

    try {
      updatedPost =
        wordpressText
          ? JSON.parse(
              wordpressText
            )
          : null;
    } catch {
      updatedPost = null;
    }

    if (!wordpressResponse.ok) {
      console.error(
        "WordPress rejected workflow update:",
        {
          status:
            wordpressResponse.status,
          body:
            wordpressText,
        }
      );

      return NextResponse.json(
        {
          error:
            "WordPress rejected the workflow update.",
          details:
            updatedPost?.message ||
            wordpressText ||
            "Unknown WordPress error.",
          operation:
            "wordpress-update",
        },
        {
          status:
            wordpressResponse.status ===
              401 ||
            wordpressResponse.status ===
              403
              ? 403
              : 502,
        }
      );
    }

    console.log(
      `WordPress workflow update succeeded for post #${payload.postId}: ${wordpressStatus}`
    );

    /*
     * ---------------------------------------------------------
     * OPTIONAL NEON PERSISTENCE
     * ---------------------------------------------------------
     */

    let workflow: any = null;
    let neonAvailable = true;

    try {
      workflow =
        await updateWorkflow(
          payload.postId,
          status,
          userId
        );
    } catch (error: unknown) {
      neonAvailable = false;

      console.warn(
        `Neon workflow persistence failed for post #${payload.postId}:`,
        error
      );
    }

    const now =
      new Date().toISOString();

    const responseWorkflow =
      workflow ?? {
        id: `wp-${payload.postId}`,
        postId:
          payload.postId,
        status,
        updatedBy:
          user.email ||
          userId,
        updatedAt: now,
      };

    /*
     * 207 means:
     *
     * WordPress succeeded.
     * Neon was unavailable.
     *
     * This is still a successful editorial
     * action.
     */

    return NextResponse.json(
      {
        ...responseWorkflow,

        wordpressUpdated: true,
        wordpressStatus,
        neonAvailable,

        post: updatedPost
          ? {
              id:
                updatedPost.id,
              status:
                updatedPost.status,
              slug:
                updatedPost.slug,
              link:
                updatedPost.link,
            }
          : null,
      },
      {
        status:
          neonAvailable
            ? 200
            : 207,

        headers: {
          "X-ArsenalTalks-Workflow-Source":
            neonAvailable
              ? "wordpress-neon"
              : "wordpress",
        },
      }
    );
  } catch (error: unknown) {
    console.error(
      "POST /api/workflows failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to update workflow.",
        details:
          error instanceof Error
            ? error.message
            : "Unknown server error.",
      },
      {
        status: 500,
      }
    );
  }
}