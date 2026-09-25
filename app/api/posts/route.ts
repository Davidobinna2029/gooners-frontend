import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { updateWorkflow } from "@/lib/editorial/workflow";

const WP_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL;

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

/**
 * =========================================================
 * WORDPRESS AUTHENTICATION
 * =========================================================
 */

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
 * =========================================================
 * IMAGE URL NORMALIZATION
 * =========================================================
 *
 * WordPress may return:
 *
 * https://arsenaltalks.com/...
 * https://www.arsenaltalks.com/...
 *
 * The headless frontend should use:
 *
 * https://api.arsenaltalks.com/...
 */

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

function normalizePosts(
  posts: any[]
) {
  return posts.map(
    normalizePostImages
  );
}

/**
 * =========================================================
 * INTEGER PARSER
 * =========================================================
 */

function parseInteger(
  value: string | null,
  fallback: number
) {
  const parsed =
    Number.parseInt(
      value || "",
      10
    );

  if (
    !Number.isFinite(parsed)
  ) {
    return fallback;
  }

  return parsed;
}

/**
 * =========================================================
 * CATEGORY PARSER
 * =========================================================
 */

function parseCategories(
  value: string | null
): number[] {
  if (!value) {
    return [];
  }

  try {
    const parsed =
      JSON.parse(value);

    if (
      Array.isArray(parsed)
    ) {
      return parsed
        .map((item) =>
          Number(item)
        )
        .filter(
          (item) =>
            Number.isInteger(item) &&
            item > 0
        );
    }
  } catch {
    /*
     * Fall through to
     * comma-separated parsing.
     */
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

/**
 * =========================================================
 * FORM DATA CLEANER
 * =========================================================
 */

function cleanText(
  value: FormDataEntryValue | null
): string {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value.trim();
}

/**
 * =========================================================
 * WORKFLOW HELPERS
 * =========================================================
 */

function mapWorkflowStatusToWordPressStatus(
  status: PublishStatus
): "draft" | "publish" {
  return status === "PUBLISHED"
    ? "publish"
    : "draft";
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

/**
 * =========================================================
 * HTML / TEXT NORMALIZATION
 * =========================================================
 */

function stripHtml(
  value: unknown
): string {
  if (
    typeof value !== "string"
  ) {
    return "";
  }

  return value
    .replace(
      /<[^>]*>/g,
      ""
    )
    .replace(
      /&nbsp;/gi,
      " "
    )
    .replace(
      /&amp;/gi,
      "&"
    )
    .replace(
      /&quot;/gi,
      '"'
    )
    .replace(
      /&#039;/gi,
      "'"
    )
    .replace(
      /&#8217;/gi,
      "’"
    )
    .replace(
      /&#8216;/gi,
      "‘"
    )
    .replace(
      /&#8220;/gi,
      "“"
    )
    .replace(
      /&#8221;/gi,
      "”"
    )
    .replace(
      /&#8211;/gi,
      "–"
    )
    .replace(
      /&#8212;/gi,
      "—"
    )
    .trim();
}

/**
 * =========================================================
 * FRONTEND POST NORMALIZER
 * =========================================================
 *
 * Converts a raw WordPress REST post into the stable
 * shape consumed by:
 *
 * - HomepageInfiniteScroll
 * - TransferHub
 * - Other public feed components
 */

function normalizeFrontendPost(
  post: any
) {
  const featuredMedia =
    post?._embedded?.[
      "wp:featuredmedia"
    ]?.[0];

  const image =
    normalizeImageUrl(
      featuredMedia?.source_url ||
        post?.jetpack_featured_media_url ||
        post?.featured_media_url
    );

  const embeddedTerms =
    post?._embedded?.[
      "wp:term"
    ];

  let categoryName =
    "Arsenal";

  if (
    Array.isArray(
      embeddedTerms
    )
  ) {
    const categories =
      embeddedTerms
        .flat()
        .filter(
          (term: any) =>
            term?.taxonomy ===
            "category"
        );

    if (
      categories.length > 0
    ) {
      categoryName =
        categories[0]?.name ||
        "Arsenal";
    }
  }

  const title =
    stripHtml(
      post?.title?.rendered ||
        post?.title ||
        ""
    );

  const excerpt =
    stripHtml(
      post?.excerpt?.rendered ||
        post?.excerpt ||
        ""
    );

  const author =
    post?._embedded?.author?.[0]
      ?.name ||
    "ArsenalTalks";

  return {
    id: Number(post.id),

    slug:
      post.slug || "",

    title,

    excerpt,

    date:
      post.date || "",

    modified:
      post.modified || "",

    status:
      post.status || "publish",

    image,

    author,

    category:
      categoryName,

    categories:
      Array.isArray(
        post.categories
      )
        ? post.categories
        : [],

    featuredMedia:
      post.featured_media
        ? Number(
            post.featured_media
          )
        : null,

    link:
      post.slug
        ? `/news/${post.slug}`
        : "/news",
  };
}

/**
 * =========================================================
 * GET /api/posts
 * =========================================================
 *
 * Public WordPress post feed.
 *
 * Supported parameters:
 *
 * ?page=1
 * ?per_page=20
 * ?exclude=123,456
 * ?category=56
 *
 * Transfer News:
 *
 * ?category=56
 *
 * The response format is:
 *
 * {
 *   posts: [],
 *   page: number,
 *   perPage: number,
 *   totalPosts: number,
 *   totalPages: number,
 *   hasMore: boolean
 * }
 */

export async function GET(
  request: NextRequest
) {
  try {
    /**
     * -------------------------------------------------------
     * WORDPRESS API CHECK
     * -------------------------------------------------------
     */

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

    /**
     * -------------------------------------------------------
     * QUERY PARAMETERS
     * -------------------------------------------------------
     */

    const { searchParams } =
      new URL(request.url);

    const page = Math.max(
      1,
      parseInteger(
        searchParams.get("page"),
        1
      )
    );

    const requestedPerPage =
      parseInteger(
        searchParams.get(
          "per_page"
        ),
        20
      );

    /*
     * Prevent excessively large
     * WordPress requests.
     */
    const perPage = Math.min(
      Math.max(
        requestedPerPage,
        1
      ),
      100
    );

    const exclude =
      searchParams.get(
        "exclude"
      );

    /**
     * Optional category ID.
     *
     * Transfer News = 56.
     */
    const category =
      searchParams.get(
        "category"
      );

    const categoryId =
      category
        ? parseInteger(
            category,
            0
          )
        : 0;

    /**
     * -------------------------------------------------------
     * BUILD WORDPRESS QUERY
     * -------------------------------------------------------
     */

    const params =
      new URLSearchParams();

    params.set(
      "page",
      String(page)
    );

    params.set(
      "per_page",
      String(perPage)
    );

    params.set(
      "_embed",
      "1"
    );

    /**
     * Exclude posts already rendered
     * elsewhere on the homepage.
     */
    if (
      exclude &&
      exclude.trim()
    ) {
      params.set(
        "exclude",
        exclude
      );
    }

    /**
     * Optional category filter.
     *
     * WordPress expects:
     *
     * categories=56
     */
    if (
      categoryId > 0
    ) {
      params.set(
        "categories",
        String(categoryId)
      );
    }

    /**
     * -------------------------------------------------------
     * FETCH WORDPRESS
     * -------------------------------------------------------
     */

    const response =
      await fetch(
        `${WP_API}/posts?${params.toString()}`,
        {
          method: "GET",

          headers: {
            Accept:
              "application/json",
          },

          next: {
            revalidate: 60,
          },
        }
      );

    /**
     * -------------------------------------------------------
     * WORDPRESS ERROR
     * -------------------------------------------------------
     */

    if (!response.ok) {
      const errorText =
        await response.text();

      console.error(
        "WordPress GET /posts failed:",
        response.status,
        errorText
      );

      return NextResponse.json(
        {
          error:
            "Failed to fetch WordPress posts.",

          status:
            response.status,
        },
        {
          status:
            response.status,
        }
      );
    }

    /**
     * -------------------------------------------------------
     * PARSE WORDPRESS RESPONSE
     * -------------------------------------------------------
     */

    const posts =
      await response.json();

    /**
     * -------------------------------------------------------
     * INVALID WORDPRESS RESPONSE
     * -------------------------------------------------------
     */

    if (
      !Array.isArray(posts)
    ) {
      return NextResponse.json(
        {
          posts: [],
          page,
          perPage,
          totalPosts: 0,
          totalPages: 0,
          hasMore: false,
        },
        {
          status: 200,
        }
      );
    }

    /**
     * -------------------------------------------------------
     * NORMALIZE WORDPRESS IMAGES
     * -------------------------------------------------------
     */

    const normalizedPosts =
      normalizePosts(posts);

    /**
     * -------------------------------------------------------
     * NORMALIZE FRONTEND POSTS
     * -------------------------------------------------------
     */

    const frontendPosts =
      normalizedPosts.map(
        normalizeFrontendPost
      );

    /**
     * -------------------------------------------------------
     * WORDPRESS PAGINATION HEADERS
     * -------------------------------------------------------
     *
     * WordPress REST API normally provides:
     *
     * X-WP-Total
     * X-WP-TotalPages
     */

    const totalHeader =
      response.headers.get(
        "X-WP-Total"
      );

    const totalPagesHeader =
      response.headers.get(
        "X-WP-TotalPages"
      );

    const parsedTotal =
      Number.parseInt(
        totalHeader || "",
        10
      );

    const parsedTotalPages =
      Number.parseInt(
        totalPagesHeader || "",
        10
      );

    /**
     * -------------------------------------------------------
     * TOTAL POSTS
     * -------------------------------------------------------
     */

    const totalPosts =
      Number.isFinite(
        parsedTotal
      )
        ? parsedTotal
        : frontendPosts.length;

    /**
     * -------------------------------------------------------
     * TOTAL PAGES
     * -------------------------------------------------------
     */

    const totalPages =
      Number.isFinite(
        parsedTotalPages
      ) &&
      parsedTotalPages > 0
        ? parsedTotalPages
        : Math.ceil(
            totalPosts /
              perPage
          );

    /**
     * -------------------------------------------------------
     * HAS MORE
     * -------------------------------------------------------
     */

    const hasMore =
      page < totalPages;

    /**
     * -------------------------------------------------------
     * RETURN PAGINATED RESPONSE
     * -------------------------------------------------------
     */

    return NextResponse.json(
      {
        posts:
          frontendPosts,

        page,

        perPage,

        totalPosts,

        totalPages,

        hasMore,
      },
      {
        headers: {
          "Cache-Control":
            "public, s-maxage=60, stale-while-revalidate=300",
        },
      }
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "GET /api/posts failed:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Failed to fetch posts.",

        details:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * =========================================================
 * POST /api/posts
 * =========================================================
 *
 * Creates a WordPress post from the admin Create Post page.
 *
 * Expected multipart/form-data:
 *
 * title
 * slug
 * excerpt
 * content
 * categories
 * status
 * seoTitle
 * metaDescription
 * focusKeyphrase
 * featuredImage
 */

export async function POST(
  request: NextRequest
) {
  let createdPostId:
    | number
    | null = null;

  try {
    /**
     * -------------------------------------------------------
     * WORDPRESS API CHECK
     * -------------------------------------------------------
     */

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

    /**
     * -------------------------------------------------------
     * AUTHENTICATION
     * -------------------------------------------------------
     */

    const session =
      await getServerSession(
        authOptions
      );

    if (
      !session?.user
    ) {
      return NextResponse.json(
        {
          error:
            "Unauthorized.",
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

    const role =
      user.role;

    /**
     * -------------------------------------------------------
     * FORM DATA
     * -------------------------------------------------------
     */

    const formData =
      await request.formData();

    const title =
      cleanText(
        formData.get(
          "title"
        )
      );

    const slug =
      cleanText(
        formData.get(
          "slug"
        )
      );

    const excerpt =
      cleanText(
        formData.get(
          "excerpt"
        )
      );

    const contentEntry =
      formData.get(
        "content"
      );

    const content =
      typeof contentEntry ===
      "string"
        ? contentEntry
        : "";

    const requestedStatusRaw =
      cleanText(
        formData.get(
          "status"
        )
      );

    const requestedStatus =
      requestedStatusRaw
        ? requestedStatusRaw.toUpperCase()
        : "DRAFT";

    const seoTitle =
      cleanText(
        formData.get(
          "seoTitle"
        )
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
        ) as
          | string
          | null
      );

    /**
     * -------------------------------------------------------
     * VALIDATION
     * -------------------------------------------------------
     */

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
     * Writers may create drafts
     * and submit posts for review,
     * but cannot directly publish.
     */

    if (
      requestedStatus ===
        "PUBLISHED" &&
      !canPublish(role)
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
     * -------------------------------------------------------
     * FEATURED IMAGE
     * -------------------------------------------------------
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

      /**
       * Validate image type.
       */

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

      /**
       * Validate image size.
       */

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

      /**
       * Convert image to buffer.
       */

      const imageBuffer =
        Buffer.from(
          await file.arrayBuffer()
        );

      /**
       * Upload image to WordPress.
       */

      const mediaResponse =
        await fetch(
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
          }
        );

      if (
        !mediaResponse.ok
      ) {
        const mediaError =
          await mediaResponse.text();

        console.error(
          "WordPress media upload failed:",
          mediaResponse.status,
          mediaError
        );

        return NextResponse.json(
          {
            error:
              "Featured image upload failed.",

            details:
              mediaError,
          },
          {
            status: 500,
          }
        );
      }

      const media =
        await mediaResponse.json();

      if (
        !media?.id ||
        !Number.isInteger(
          Number(media.id)
        )
      ) {
        return NextResponse.json(
          {
            error:
              "WordPress returned an invalid media ID.",
          },
          {
            status: 500,
          }
        );
      }

      mediaId =
        Number(media.id);
    }

    /**
     * -------------------------------------------------------
     * WORDPRESS POST PAYLOAD
     * -------------------------------------------------------
     *
     * Yoast fields are included here.
     *
     * They require the corresponding WordPress REST
     * meta fields to be registered as writable.
     */

    const wordpressStatus =
      mapWorkflowStatusToWordPressStatus(
        requestedStatus
      );

    const wordpressPayload:
      Record<
        string,
        unknown
      > = {
      title,

      slug:
        slug || undefined,

      content,

      excerpt,

      status:
        wordpressStatus,

      categories,
    };

    if (mediaId) {
      wordpressPayload.featured_media =
        mediaId;
    }

    /**
     * -------------------------------------------------------
     * YOAST SEO
     * -------------------------------------------------------
     */

    const seoMeta:
      Record<
        string,
        string
      > = {};

    if (seoTitle) {
      seoMeta[
        "_yoast_wpseo_title"
      ] = seoTitle;
    }

    if (metaDescription) {
      seoMeta[
        "_yoast_wpseo_metadesc"
      ] =
        metaDescription;
    }

    if (focusKeyphrase) {
      seoMeta[
        "_yoast_wpseo_focuskw"
      ] =
        focusKeyphrase;
    }

    if (
      Object.keys(
        seoMeta
      ).length > 0
    ) {
      wordpressPayload.meta =
        seoMeta;
    }

    /**
     * -------------------------------------------------------
     * CREATE WORDPRESS POST
     * -------------------------------------------------------
     */

    const postResponse =
      await fetch(
        `${WP_API}/posts`,
        {
          method: "POST",

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
        }
      );

    const postResponseText =
      await postResponse.text();

    let createdPost:
      | any
      | null = null;

    try {
      createdPost =
        postResponseText
          ? JSON.parse(
              postResponseText
            )
          : null;
    } catch {
      createdPost = null;
    }

    if (
      !postResponse.ok
    ) {
      console.error(
        "WordPress post creation failed:",
        postResponse.status,
        postResponseText
      );

      return NextResponse.json(
        {
          error:
            "Failed to create WordPress post.",

          details:
            createdPost?.message ||
            postResponseText ||
            "Unknown WordPress error.",
        },
        {
          status:
            postResponse.status ||
            500,
        }
      );
    }

    /**
     * -------------------------------------------------------
     * VALIDATE CREATED POST
     * -------------------------------------------------------
     */

    if (
      !createdPost?.id ||
      !Number.isInteger(
        Number(
          createdPost.id
        )
      )
    ) {
      return NextResponse.json(
        {
          error:
            "WordPress created the post but returned an invalid post ID.",
        },
        {
          status: 500,
        }
      );
    }

    createdPostId =
      Number(
        createdPost.id
      );

    /**
     * -------------------------------------------------------
     * UPDATE EDITORIAL WORKFLOW
     * -------------------------------------------------------
     */

    let workflow =
      null;

    let workflowError:
      | string
      | null = null;

    try {
      workflow =
        await updateWorkflow(
          createdPostId,
          requestedStatus,
          userId
        );
    } catch (
      error: unknown
    ) {
      workflowError =
        error instanceof
        Error
          ? error.message
          : "Unknown workflow error.";

      console.error(
        "Workflow persistence failed after WordPress post creation:",
        error
      );
    }

    /**
     * -------------------------------------------------------
     * AUDIT LOG
     * -------------------------------------------------------
     */

    let auditError:
      | string
      | null = null;

    try {
      let action =
        "CREATE_DRAFT";

      if (
        requestedStatus ===
        "IN_REVIEW"
      ) {
        action =
          "SUBMIT_FOR_REVIEW";
      } else if (
        requestedStatus ===
        "APPROVED"
      ) {
        action =
          "APPROVE_POST";
      } else if (
        requestedStatus ===
        "PUBLISHED"
      ) {
        action =
          "PUBLISH_POST";
      } else if (
        requestedStatus ===
        "REJECTED"
      ) {
        action =
          "REJECT_POST";
      }

      await prisma.auditLog.create(
        {
          data: {
            userId,

            action,

            targetId:
              createdPostId,

            metadata: {
              postId:
                createdPostId,

              title,

              slug:
                createdPost.slug ||
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
        }
      );
    } catch (
      error: unknown
    ) {
      auditError =
        error instanceof
        Error
          ? error.message
          : "Unknown audit log error.";

      console.error(
        "Audit log creation failed:",
        error
      );
    }

    /**
     * -------------------------------------------------------
     * NORMALIZE RESPONSE
     * -------------------------------------------------------
     */

    const normalizedPost =
      normalizePostImages(
        createdPost
      );

    /**
     * IMPORTANT:
     *
     * The WordPress post has already been created.
     *
     * If Neon workflow/audit persistence fails,
     * DO NOT tell the frontend to retry the
     * entire post creation request.
     *
     * This prevents duplicate WordPress posts.
     */

    if (workflowError) {
      return NextResponse.json(
        {
          success: false,

          postCreated: true,

          postId:
            createdPostId,

          warning:
            "WordPress post was created successfully, but the editorial workflow could not be saved.",

          workflowError,

          auditError,

          post:
            normalizedPost,

          workflow:
            null,
        },
        {
          status: 207,
        }
      );
    }

    /**
     * -------------------------------------------------------
     * SUCCESS
     * -------------------------------------------------------
     */

    return NextResponse.json(
      {
        success: true,

        postCreated: true,

        postId:
          createdPostId,

        post:
          normalizedPost,

        workflow,

        auditError,
      },
      {
        status: 201,
      }
    );
  } catch (
    error: unknown
  ) {
    console.error(
      "POST /api/posts failed:",
      error
    );

    /**
     * If WordPress already created the post,
     * explicitly tell the frontend not to retry.
     */

    if (createdPostId) {
      return NextResponse.json(
        {
          success: false,

          postCreated: true,

          postId:
            createdPostId,

          warning:
            "The WordPress post was created successfully, but a later server operation failed. Do not submit the post again.",

          details:
            error instanceof
            Error
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
          "Failed to create post.",

        details:
          error instanceof
          Error
            ? error.message
            : "Unknown server error.",
      },
      {
        status: 500,
      }
    );
  }
}