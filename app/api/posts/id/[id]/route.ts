import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { updateWorkflow } from "@/lib/editorial/workflow";

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

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

/**
 * WordPress requests should never be allowed to hang
 * for the ~74 seconds we were seeing previously.
 */
const WP_REQUEST_TIMEOUT = 30_000;

type PublishStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "APPROVED"
  | "PUBLISHED"
  | "REJECTED";

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

/**
 * Fetch wrapper specifically for WordPress.
 *
 * Provides:
 * - explicit timeout
 * - clearer operation-specific errors
 * - protection against long hanging requests
 */
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

function normalizeImageUrl(
  url: unknown
): string | null {
  if (
    typeof url !== "string" ||
    !url.trim()
  ) {
    return null;
  }

  return url
    .replace(
      /^https?:\/\/(?:www\.)?arsenaltalks\.com/i,
      "https://api.arsenaltalks.com"
    )
    .trim();
}

function normalizePostImages(post: any) {
  if (
    !post ||
    typeof post !== "object"
  ) {
    return post;
  }

  const normalized = {
    ...post,
  };

  if (
    normalized.jetpack_featured_media_url
  ) {
    normalized.jetpack_featured_media_url =
      normalizeImageUrl(
        normalized.jetpack_featured_media_url
      );
  }

  if (
    normalized.featured_media_url
  ) {
    normalized.featured_media_url =
      normalizeImageUrl(
        normalized.featured_media_url
      );
  }

  const featuredMedia =
    normalized?._embedded?.[
      "wp:featuredmedia"
    ]?.[0];

  if (featuredMedia) {
    normalized._embedded = {
      ...normalized._embedded,
      "wp:featuredmedia": [
        {
          ...featuredMedia,
          source_url:
            normalizeImageUrl(
              featuredMedia.source_url
            ),
          media_details:
            featuredMedia.media_details
              ? {
                  ...featuredMedia.media_details,
                }
              : featuredMedia.media_details,
        },
      ],
    };
  }

  return normalized;
}

function parseCategories(
  value: FormDataEntryValue | null
): number[] {
  if (
    typeof value !== "string" ||
    !value.trim()
  ) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);

    if (Array.isArray(parsed)) {
      return parsed
        .map((item) => Number(item))
        .filter(
          (item) =>
            Number.isInteger(item) &&
            item > 0
        );
    }
  } catch {
    // Fall through to comma-separated parsing.
  }

  return value
    .split(",")
    .map((item) =>
      Number(item.trim())
    )
    .filter(
      (item) =>
        Number.isInteger(item) &&
        item > 0
    );
}

function cleanText(
  value: FormDataEntryValue | null
): string {
  if (typeof value !== "string") {
    return "";
  }

  return value.trim();
}

function parsePostId(
  value: string
) {
  const id = Number.parseInt(
    value,
    10
  );

  if (
    !Number.isInteger(id) ||
    id <= 0
  ) {
    return null;
  }

  return id;
}

function mapWorkflowStatusToWordPressStatus(
  status: PublishStatus
): "draft" | "publish" {
  return status === "PUBLISHED"
    ? "publish"
    : "draft";
}

function canEdit(
  role: string | undefined
) {
  return (
    role === "WRITER" ||
    role === "EDITOR" ||
    role === "ADMIN" ||
    role === "OWNER"
  );
}

function canPublish(
  role: string | undefined
) {
  return (
    role === "EDITOR" ||
    role === "ADMIN" ||
    role === "OWNER"
  );
}

function isValidWorkflowStatus(
  value: string
): value is PublishStatus {
  return (
    value === "DRAFT" ||
    value === "IN_REVIEW" ||
    value === "APPROVED" ||
    value === "PUBLISHED" ||
    value === "REJECTED"
  );
}

function getAuditAction(
  status: PublishStatus
) {
  switch (status) {
    case "IN_REVIEW":
      return "SUBMIT_FOR_REVIEW";

    case "APPROVED":
      return "APPROVE_POST";

    case "PUBLISHED":
      return "PUBLISH_POST";

    case "REJECTED":
      return "REJECT_POST";

    case "DRAFT":
    default:
      return "UPDATE_POST";
  }
}

/**
 * GET
 *
 * Authenticated admin/editor lookup of a
 * single WordPress post by numeric ID.
 *
 * /api/posts/id/13916
 */
export async function GET(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  try {
    if (!WP_API) {
      return NextResponse.json(
        {
          error:
            "WordPress API URL is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
        },
        {
          status: 401,
        }
      );
    }

    const user =
      session.user as SessionUser;

    if (!canEdit(user.role)) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to edit posts.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      id: rawId,
    } = await context.params;

    const postId =
      parsePostId(rawId);

    if (!postId) {
      return NextResponse.json(
        {
          error:
            "Invalid post ID.",
        },
        {
          status: 400,
        }
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
          cache: "no-store",
        },
        `GET post #${postId}`
      );

    const responseText =
      await response.text();

    let post: any = null;

    try {
      post = responseText
        ? JSON.parse(
            responseText
          )
        : null;
    } catch {
      post = null;
    }

    if (response.status === 404) {
      return NextResponse.json(
        {
          error:
            "Post not found.",
        },
        {
          status: 404,
        }
      );
    }

    if (!response.ok) {
      console.error(
        "WordPress GET post failed:",
        response.status,
        responseText
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch WordPress post.",
          details:
            post?.message ||
            responseText ||
            "Unknown WordPress error.",
        },
        {
          status:
            response.status ||
            500,
        }
      );
    }

    return NextResponse.json({
      success: true,
      post:
        normalizePostImages(
          post
        ),
    });
  } catch (error: unknown) {
    console.error(
      "GET /api/posts/id/[id] failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch post.",
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
 * PUT
 *
 * Updates an existing WordPress post.
 *
 * WordPress is the source of truth.
 *
 * Workflow and audit persistence are deliberately
 * non-fatal because Neon may be unavailable.
 *
 * /api/posts/id/13916
 */
export async function PUT(
  request: NextRequest,
  context: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  let updatedPostId:
    | number
    | null = null;

  try {
    if (!WP_API) {
      return NextResponse.json(
        {
          error:
            "WordPress API URL is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    const session =
      await getServerSession(
        authOptions
      );

    if (!session?.user) {
      return NextResponse.json(
        {
          error: "Unauthorized.",
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
            "Authenticated user ID is missing from the session.",
        },
        {
          status: 401,
        }
      );
    }

    if (!canEdit(user.role)) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to edit posts.",
        },
        {
          status: 403,
        }
      );
    }

    const {
      id: rawId,
    } = await context.params;

    const postId =
      parsePostId(rawId);

    if (!postId) {
      return NextResponse.json(
        {
          error:
            "Invalid post ID.",
        },
        {
          status: 400,
        }
      );
    }

    const formData =
      await request.formData();

    const title =
      cleanText(
        formData.get("title")
      );

    const slug =
      cleanText(
        formData.get("slug")
      );

    const excerpt =
      cleanText(
        formData.get("excerpt")
      );

    const contentEntry =
      formData.get("content");

    const content =
      typeof contentEntry ===
      "string"
        ? contentEntry
        : "";

    const requestedStatusRaw =
      cleanText(
        formData.get("status")
      );

    const requestedStatus =
      requestedStatusRaw
        ? requestedStatusRaw.toUpperCase()
        : "DRAFT";

    const seoTitle =
      cleanText(
        formData.get("seoTitle")
      );

    const metaDescription =
      cleanText(
        formData.get(
          "metaDescription"
        )
      );

    const focusKeyphrase =
      cleanText(
        formData.get(
          "focusKeyphrase"
        )
      );

    const categories =
      parseCategories(
        formData.get(
          "categories"
        )
      );

    if (!title) {
      return NextResponse.json(
        {
          error:
            "Post title is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (!content.trim()) {
      return NextResponse.json(
        {
          error:
            "Post content is required.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      !isValidWorkflowStatus(
        requestedStatus
      )
    ) {
      return NextResponse.json(
        {
          error:
            `Invalid workflow status: ${requestedStatus}`,
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Writers may edit posts but cannot publish.
     */
    if (
      requestedStatus ===
        "PUBLISHED" &&
      !canPublish(user.role)
    ) {
      return NextResponse.json(
        {
          error:
            "You do not have permission to publish posts.",
        },
        {
          status: 403,
        }
      );
    }

    /**
     * ---------------------------------------------------------
     * OPTIONAL FEATURED IMAGE UPLOAD
     * ---------------------------------------------------------
     *
     * We only contact /media when a new image was actually
     * selected.
     */
    const featuredImageEntry =
      formData.get(
        "featuredImage"
      );

    let mediaId:
      | number
      | null = null;

    if (
      featuredImageEntry &&
      featuredImageEntry instanceof
        File &&
      featuredImageEntry.size > 0
    ) {
      const file =
        featuredImageEntry;

      if (
        !ALLOWED_IMAGE_TYPES.includes(
          file.type
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Invalid featured image type. Use JPG, PNG, WebP, or GIF.",
          },
          {
            status: 400,
          }
        );
      }

      if (
        file.size >
        MAX_IMAGE_SIZE
      ) {
        return NextResponse.json(
          {
            error:
              "Featured image is too large. Maximum size is 10MB.",
          },
          {
            status: 400,
          }
        );
      }

      console.log(
        `Uploading featured image for post #${postId}:`,
        {
          name: file.name,
          type: file.type,
          size: file.size,
        }
      );

      const imageBuffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      let mediaResponse:
        | Response
        | null = null;

      try {
        mediaResponse =
          await wpFetch(
            `${WP_API}/media`,
            {
              method: "POST",
              headers: {
                Authorization:
                  getWpAuthHeader(),
                "Content-Type":
                  file.type,
                "Content-Disposition":
                  `attachment; filename="${file.name.replace(
                    /"/g,
                    ""
                  )}"`,
              },
              body: imageBuffer,
            },
            `featured image upload for post #${postId}`
          );
      } catch (error: unknown) {
        console.error(
          "WordPress featured image upload network error:",
          error
        );

        return NextResponse.json(
          {
            error:
              "Featured image upload failed.",
            details:
              error instanceof Error
                ? error.message
                : "Unknown WordPress media network error.",
            operation:
              "featured-image-upload",
          },
          {
            status: 502,
          }
        );
      }

      const mediaResponseText =
        await mediaResponse.text();

      let media: any = null;

      try {
        media =
          mediaResponseText
            ? JSON.parse(
                mediaResponseText
              )
            : null;
      } catch {
        media = null;
      }

      if (!mediaResponse.ok) {
        console.error(
          "WordPress media upload failed:",
          {
            status:
              mediaResponse.status,
            body:
              mediaResponseText,
          }
        );

        return NextResponse.json(
          {
            error:
              "Featured image upload failed.",
            details:
              media?.message ||
              mediaResponseText ||
              "Unknown WordPress media error.",
            operation:
              "featured-image-upload",
            wordpressStatus:
              mediaResponse.status,
          },
          {
            status: 502,
          }
        );
      }

      if (
        !media?.id ||
        !Number.isInteger(
          Number(media.id)
        )
      ) {
        console.error(
          "WordPress returned invalid media response:",
          media
        );

        return NextResponse.json(
          {
            error:
              "WordPress returned an invalid media ID.",
            details:
              "The image upload response did not contain a valid media ID.",
            operation:
              "featured-image-upload",
          },
          {
            status: 502,
          }
        );
      }

      mediaId =
        Number(media.id);

      console.log(
        `Featured image uploaded successfully. Media ID: ${mediaId}`
      );
    }

    /**
     * ---------------------------------------------------------
     * WORDPRESS POST UPDATE
     * ---------------------------------------------------------
     */
    const wordpressStatus =
      mapWorkflowStatusToWordPressStatus(
        requestedStatus
      );

    const wordpressPayload: Record<
      string,
      unknown
    > = {
      title,
      content,
      excerpt,
      status:
        wordpressStatus,
      categories,

      meta: {
        _yoast_wpseo_title:
          seoTitle,
        _yoast_wpseo_metadesc:
          metaDescription,
        _yoast_wpseo_focuskw:
          focusKeyphrase,
      },
    };

    /**
     * Only include slug when the editor supplied one.
     */
    if (slug) {
      wordpressPayload.slug =
        slug;
    }

    /**
     * Only replace the featured image
     * when a new image was uploaded.
     */
    if (
      mediaId !== null
    ) {
      wordpressPayload.featured_media =
        mediaId;
    }

    console.log(
      `Updating WordPress post #${postId}:`,
      {
        status:
          wordpressStatus,
        workflowStatus:
          requestedStatus,
        hasNewFeaturedImage:
          mediaId !== null,
        mediaId,
        categories,
        hasSeoTitle:
          Boolean(seoTitle),
        hasMetaDescription:
          Boolean(
            metaDescription
          ),
        hasFocusKeyphrase:
          Boolean(
            focusKeyphrase
          ),
      }
    );

    let postResponse:
      | Response
      | null = null;

    try {
      postResponse =
        await wpFetch(
          `${WP_API}/posts/${postId}`,
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
            body: JSON.stringify(
              wordpressPayload
            ),
          },
          `post update for #${postId}`
        );
    } catch (error: unknown) {
      console.error(
        "WordPress post update network error:",
        error
      );

      return NextResponse.json(
        {
          error:
            "Could not connect to WordPress while updating the post.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown WordPress network error.",
          operation:
            "post-update",
          postId,
        },
        {
          status: 502,
        }
      );
    }

    const postResponseText =
      await postResponse.text();

    let updatedPost: any =
      null;

    try {
      updatedPost =
        postResponseText
          ? JSON.parse(
              postResponseText
            )
          : null;
    } catch {
      updatedPost = null;
    }

    if (
      postResponse.status ===
      404
    ) {
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

    if (!postResponse.ok) {
      console.error(
        "WordPress post update failed:",
        {
          status:
            postResponse.status,
          body:
            postResponseText,
        }
      );

      return NextResponse.json(
        {
          error:
            "Failed to update WordPress post.",
          details:
            updatedPost?.message ||
            postResponseText ||
            "Unknown WordPress error.",
          operation:
            "post-update",
          wordpressStatus:
            postResponse.status,
        },
        {
          status:
            postResponse.status ||
            502,
        }
      );
    }

    if (
      !updatedPost?.id ||
      !Number.isInteger(
        Number(updatedPost.id)
      )
    ) {
      console.error(
        "WordPress returned an invalid post update response:",
        updatedPost
      );

      return NextResponse.json(
        {
          error:
            "WordPress updated the post but returned an invalid post ID.",
          operation:
            "post-update",
        },
        {
          status: 502,
        }
      );
    }

    updatedPostId =
      Number(updatedPost.id);

    console.log(
      `WordPress post #${updatedPostId} updated successfully.`
    );

    /**
     * ---------------------------------------------------------
     * OPTIONAL NEON WORKFLOW
     * ---------------------------------------------------------
     *
     * WordPress has already succeeded.
     * Neon failure must never make the user think the
     * WordPress update failed.
     */
    let workflow =
      null;

    let workflowError:
      | string
      | null = null;

    try {
      workflow =
        await updateWorkflow(
          updatedPostId,
          requestedStatus,
          userId
        );
    } catch (error: unknown) {
      workflowError =
        error instanceof Error
          ? error.message
          : "Unknown workflow error.";

      console.error(
        "Workflow persistence failed after WordPress post update:",
        error
      );
    }

    /**
     * ---------------------------------------------------------
     * OPTIONAL AUDIT LOG
     * ---------------------------------------------------------
     */
    let auditError:
      | string
      | null = null;

    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action:
            getAuditAction(
              requestedStatus
            ),
          targetId:
            updatedPostId,
          metadata: {
            postId:
              updatedPostId,
            title,
            slug:
              updatedPost.slug ||
              slug ||
              null,
            status:
              requestedStatus,
            seoTitle:
              seoTitle ||
              null,
            metaDescription:
              metaDescription ||
              null,
            focusKeyphrase:
              focusKeyphrase ||
              null,
            featuredMediaId:
              mediaId,
          },
        },
      });
    } catch (error: unknown) {
      auditError =
        error instanceof Error
          ? error.message
          : "Unknown audit log error.";

      console.error(
        "Audit log creation failed:",
        error
      );
    }

    const normalizedPost =
      normalizePostImages(
        updatedPost
      );

    /**
     * WordPress succeeded but workflow persistence failed.
     */
    if (workflowError) {
      return NextResponse.json(
        {
          success: true,
          postUpdated: true,
          postId:
            updatedPostId,
          warning:
            "WordPress post was updated successfully, but the editorial workflow could not be saved.",
          workflowError,
          auditError,
          post:
            normalizedPost,
          workflow: null,
        },
        {
          status: 207,
        }
      );
    }

    /**
     * WordPress + workflow succeeded.
     * Audit failure remains non-fatal.
     */
    return NextResponse.json(
      {
        success: true,
        postUpdated: true,
        postId:
          updatedPostId,
        post:
          normalizedPost,
        workflow,
        auditError,
      },
      {
        status: 200,
      }
    );
  } catch (error: unknown) {
    console.error(
      "PUT /api/posts/id/[id] failed:",
      error
    );

    /**
     * If WordPress already succeeded, NEVER tell the
     * browser that the entire operation failed.
     *
     * This prevents duplicate submissions.
     */
    if (updatedPostId) {
      return NextResponse.json(
        {
          success: true,
          postUpdated: true,
          postId:
            updatedPostId,
          warning:
            "The WordPress post was updated successfully, but a later optional server operation failed. Do not submit the update again.",
          details:
            error instanceof Error
              ? error.message
              : "Unknown server error.",
        },
        {
          status: 207,
        }
      );
    }

    return NextResponse.json(
      {
        error:
          "Failed to update post.",
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