
import { NextRequest, NextResponse } from "next/server";
import { decode } from "html-entities";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db/prisma";
import { updateWorkflow } from "@/lib/editorial/workflow";

const WP_API =
  process.env.NEXT_PUBLIC_WORDPRESS_API_URL ||
  "https://api.arsenaltalks.com/wp-json/wp/v2";

const WP_USERNAME = process.env.WORDPRESS_USERNAME;
const WP_APP_PASSWORD = process.env.WORDPRESS_APP_PASSWORD;

const DEFAULT_PER_PAGE = 20;
const MAX_PER_PAGE = 100;
const WP_GET_TIMEOUT = 30_000;
const WP_GET_REVALIDATE_SECONDS = 30;

const VALID_WORKFLOW_STATUSES = [
  "DRAFT",
  "IN_REVIEW",
  "APPROVED",
  "PUBLISHED",
  "REJECTED",
] as const;

type WorkflowStatus =
  (typeof VALID_WORKFLOW_STATUSES)[number];

const PUBLISH_ROLES = ["OWNER", "ADMIN", "EDITOR"] as const;

const TRANSIENT_NETWORK_CODES = new Set([
  "EAI_AGAIN",
  "ECONNRESET",
  "ECONNREFUSED",
  "ETIMEDOUT",
  "UND_ERR_CONNECT_TIMEOUT",
  "UND_ERR_SOCKET",
  "EHOSTUNREACH",
]);

/* -------------------------------------------------------------------------- */
/* WordPress authentication                                                   */
/* -------------------------------------------------------------------------- */

function getWordPressAuth(): string | null {
  if (!WP_USERNAME || !WP_APP_PASSWORD) {
    return null;
  }

  return Buffer.from(
    `${WP_USERNAME}:${WP_APP_PASSWORD}`
  ).toString("base64");
}

/* -------------------------------------------------------------------------- */
/* Text helpers                                                               */
/* -------------------------------------------------------------------------- */

function stripHtml(value: unknown): string {
  if (typeof value !== "string") {
    return "";
  }

  const stripped = value
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]*>/g, "")
    .replace(/\s+/g, " ")
    .trim();

  return decode(stripped);
}

/* -------------------------------------------------------------------------- */
/* Image helpers                                                              */
/* -------------------------------------------------------------------------- */

function normalizeImageUrl(value: unknown): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();

  if (!trimmed) {
    return null;
  }

  return trimmed.replace(
    /^https?:\/\/(?:www\.)?arsenaltalks\.com/i,
    "https://api.arsenaltalks.com"
  );
}

function extractImage(post: any): string | null {
  const media = post?._embedded?.["wp:featuredmedia"]?.[0];

  const candidates = [
    media?.source_url,
    media?.guid?.rendered,
    media?.media_details?.sizes?.full?.source_url,
    media?.media_details?.sizes?.large?.source_url,
    media?.media_details?.sizes?.medium_large?.source_url,
    media?.media_details?.sizes?.medium?.source_url,
    media?.media_details?.sizes?.thumbnail?.source_url,
    media?.link,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeImageUrl(candidate);

    if (normalized) {
      return normalized;
    }
  }

  return (
    normalizeImageUrl(post?.featured_media_url) ||
    normalizeImageUrl(post?.jetpack_featured_media_url)
  );
}

/* -------------------------------------------------------------------------- */
/* WordPress category helpers                                                 */
/* -------------------------------------------------------------------------- */

/**
 * Extract actual WordPress category names from the embedded wp:term response.
 * This avoids making an additional WordPress request for every post.
 */
function extractCategoryNames(post: any): string[] {
  const termGroups = post?._embedded?.["wp:term"];

  if (!Array.isArray(termGroups)) {
    return [];
  }

  const names = termGroups
    .flatMap((group: unknown) =>
      Array.isArray(group) ? group : []
    )
    .filter(
      (term: any) =>
        term?.taxonomy === "category" &&
        typeof term?.name === "string" &&
        term.name.trim().length > 0
    )
    .map((term: any) => stripHtml(term.name))
    .filter(Boolean);

  return [...new Set(names)];
}

/* -------------------------------------------------------------------------- */
/* WordPress request helpers                                                  */
/* -------------------------------------------------------------------------- */

function getWpHeaders(includeJson = false): HeadersInit {
  const headers: Record<string, string> = {
    Accept: "application/json",
  };

  const auth = getWordPressAuth();

  if (auth) {
    headers.Authorization = `Basic ${auth}`;
  }

  if (includeJson) {
    headers["Content-Type"] = "application/json";
  }

  return headers;
}

async function safeJson(response: Response): Promise<any> {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text };
  }
}

function getNetworkErrorCode(error: unknown): string | null {
  let current: unknown = error;

  for (let depth = 0; depth < 6 && current; depth++) {
    if (typeof current !== "object") {
      return null;
    }

    const item = current as {
      code?: unknown;
      cause?: unknown;
    };

    if (typeof item.code === "string") {
      return item.code;
    }

    current = item.cause;
  }

  return null;
}

/* ========================================================================== */
/* GET /api/posts                                                             */
/* ========================================================================== */

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const pageParam = Number(searchParams.get("page") || "1");
  const perPageParam = Number(
    searchParams.get("per_page") || DEFAULT_PER_PAGE
  );

  const page =
    Number.isFinite(pageParam) && pageParam > 0
      ? Math.floor(pageParam)
      : 1;

  const perPage =
    Number.isFinite(perPageParam) && perPageParam > 0
      ? Math.min(Math.floor(perPageParam), MAX_PER_PAGE)
      : DEFAULT_PER_PAGE;

  const excludeParam = searchParams.get("exclude") || "";
  const categoryParam = searchParams.get("category");

  const excludeIds = [
    ...new Set(
      excludeParam
        .split(",")
        .map((id) => Number(id.trim()))
        .filter((id) => Number.isSafeInteger(id) && id > 0)
    ),
  ];

  const wpParams = new URLSearchParams();

  wpParams.set("page", String(page));
  wpParams.set("per_page", String(perPage));

  // Embed both featured images and WordPress taxonomy terms.
  wpParams.set("_embed", "wp:featuredmedia,wp:term");

  wpParams.set("orderby", "date");
  wpParams.set("order", "desc");

  wpParams.set(
    "_fields",
    [
      "id",
      "date",
      "slug",
      "title",
      "excerpt",
      "featured_media",
      "categories",
      "tags",
      "link",
      "featured_media_url",
      "jetpack_featured_media_url",
      "_links",
      "_embedded",
    ].join(",")
  );

  if (
    categoryParam &&
    Number.isFinite(Number(categoryParam)) &&
    Number(categoryParam) > 0
  ) {
    wpParams.set("categories", String(Number(categoryParam)));
  }

  if (excludeIds.length > 0) {
    wpParams.set("exclude", excludeIds.join(","));
  }

  const wpUrl = `${WP_API}/posts?${wpParams.toString()}`;
  const startedAt = Date.now();

  let response: Response | null = null;
  let networkError: unknown = null;
  let timedOut = false;

  console.log(
    `[API POSTS] GET page=${page} per_page=${perPage} category=${categoryParam || "all"}`
  );

  // Make at most two attempts for transient network failures.
  for (let attempt = 1; attempt <= 2; attempt++) {
    const controller = new AbortController();

    const timeout = setTimeout(() => {
      controller.abort();
    }, WP_GET_TIMEOUT);

    try {
      response = await fetch(wpUrl, {
        method: "GET",
        headers: getWpHeaders(),
        next: {
          revalidate: WP_GET_REVALIDATE_SECONDS,
        },
        signal: controller.signal,
      });

      console.log(
        `[API POSTS] WordPress responded in ${
          Date.now() - startedAt
        }ms; attempt=${attempt}; status=${response.status}`
      );

      networkError = null;
      break;
    } catch (error) {
      networkError = error;

      const isAbortError =
        error instanceof Error && error.name === "AbortError";

      const errorCode = getNetworkErrorCode(error);

      timedOut = isAbortError;

      const canRetry =
        attempt === 1 &&
        !isAbortError &&
        errorCode !== null &&
        TRANSIENT_NETWORK_CODES.has(errorCode);

      console.error("[API POSTS] WordPress connection failed:", {
        attempt,
        page,
        perPage,
        errorCode,
        timedOut: isAbortError,
        message:
          error instanceof Error ? error.message : String(error),
        elapsedMs: Date.now() - startedAt,
        retrying: canRetry,
      });

      if (!canRetry) {
        break;
      }

      await new Promise((resolve) => setTimeout(resolve, 300));
    } finally {
      clearTimeout(timeout);
    }
  }

  if (!response) {
    const errorCode = getNetworkErrorCode(networkError);

    return NextResponse.json(
      {
        error: timedOut
          ? "WordPress API request timed out"
          : "WordPress API is temporarily unreachable",
        code: errorCode,
        page,
        perPage,
        retryable: true,
      },
      {
        status: timedOut ? 504 : 502,
        headers: {
          "Cache-Control": "private, no-store",
          "Retry-After": "2",
        },
      }
    );
  }

  if (!response.ok) {
    const errorBody = await response.text();

    console.error("[API POSTS] WordPress request failed:", {
      status: response.status,
      statusText: response.statusText,
      page,
      perPage,
      body: errorBody.slice(0, 1000),
    });

    return NextResponse.json(
      {
        error: "Failed to fetch WordPress posts",
        status: response.status,
        details: errorBody.slice(0, 1000),
        page,
        perPage,
      },
      {
        status: 502,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  }

  try {
    const posts = await safeJson(response);

    if (!Array.isArray(posts)) {
      console.error("[API POSTS] Invalid WordPress response:", posts);

      return NextResponse.json(
        {
          error: "Invalid WordPress posts response",
          posts: [],
          page,
          perPage,
          totalPosts: 0,
          totalPages: 0,
          hasMore: false,
        },
        {
          status: 502,
          headers: {
            "Cache-Control": "private, no-store",
          },
        }
      );
    }

    const totalHeader = response.headers.get("X-WP-Total");
    const totalPagesHeader = response.headers.get("X-WP-TotalPages");

    const totalPosts =
      totalHeader && Number.isFinite(Number(totalHeader))
        ? Number(totalHeader)
        : posts.length;

    const totalPages =
      totalPagesHeader &&
      Number.isFinite(Number(totalPagesHeader))
        ? Number(totalPagesHeader)
        : Math.ceil(totalPosts / perPage);

    const frontendPosts = posts.map((post: any) => {
      const title = stripHtml(
        post?.title?.rendered || post?.title || ""
      );

      const excerpt = stripHtml(
        post?.excerpt?.rendered || post?.excerpt || ""
      );

      const image = extractImage(post);
      const categoryNames = extractCategoryNames(post);

      return {
        id: post?.id,
        date: post?.date,
        slug: post?.slug || "",
        title,
        excerpt,
        content: "",
        image: image ? { url: image } : null,
        categories: Array.isArray(post?.categories)
          ? post.categories
          : [],

        // Actual names supplied by WordPress.
        categoryName: categoryNames[0] || null,
        categoryNames,

        tags: Array.isArray(post?.tags) ? post.tags : [],
        link: post?.link || null,
        featured_media: post?.featured_media || 0,
      };
    });

    console.log(
      `[API POSTS] Success: ${frontendPosts.length} posts, page ${page}/${totalPages}, total ${Date.now() - startedAt}ms`
    );

    return NextResponse.json(
      {
        posts: frontendPosts,
        page,
        perPage,
        totalPosts,
        totalPages,
        hasMore: page < totalPages,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("[API POSTS] Failed to process WordPress response:", {
      page,
      message:
        error instanceof Error ? error.message : String(error),
    });

    return NextResponse.json(
      {
        error: "Failed to process WordPress posts",
        page,
        perPage,
      },
      { status: 502 }
    );
  }
}

/* ========================================================================== */
/* POST /api/posts                                                            */
/* ========================================================================== */

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = session.user as {
      id?: string;
      email?: string | null;
      role?: string;
    };

    const userId = user.id || user.email || "";
    const userRole = user.role || "WRITER";

    const formData = await request.formData();

    const titleValue = formData.get("title");
    const contentValue = formData.get("content");
    const excerptValue = formData.get("excerpt");
    const slugValue = formData.get("slug");
    const statusValue = formData.get("status");
    const categoryValue = formData.get("categories");
    const tagsValue = formData.get("tags");
    const seoTitleValue = formData.get("seo_title");
    const seoDescriptionValue = formData.get("seo_description");
    const seoFocusKeywordValue = formData.get("seo_focus_keyword");
    const featuredImage = formData.get("featured_image");

    const title =
      typeof titleValue === "string" ? titleValue.trim() : "";

    const content =
      typeof contentValue === "string" ? contentValue : "";

    const excerpt =
      typeof excerptValue === "string" ? excerptValue : "";

    const slug =
      typeof slugValue === "string" ? slugValue.trim() : "";

    const requestedStatus =
      typeof statusValue === "string" && statusValue.trim()
        ? statusValue.trim().toUpperCase()
        : "DRAFT";

    const categoriesRaw =
      typeof categoryValue === "string" ? categoryValue : "";

    const tagsRaw =
      typeof tagsValue === "string" ? tagsValue : "";

    const seoTitle =
      typeof seoTitleValue === "string" ? seoTitleValue : "";

    const seoDescription =
      typeof seoDescriptionValue === "string"
        ? seoDescriptionValue
        : "";

    const seoFocusKeyword =
      typeof seoFocusKeywordValue === "string"
        ? seoFocusKeywordValue
        : "";

    if (!title) {
      return NextResponse.json(
        { error: "Post title is required" },
        { status: 400 }
      );
    }

    if (!content) {
      return NextResponse.json(
        { error: "Post content is required" },
        { status: 400 }
      );
    }

    if (
      !VALID_WORKFLOW_STATUSES.includes(
        requestedStatus as WorkflowStatus
      )
    ) {
      return NextResponse.json(
        {
          error: "Invalid workflow status",
          validStatuses: VALID_WORKFLOW_STATUSES,
        },
        { status: 400 }
      );
    }

    const workflowStatus = requestedStatus as WorkflowStatus;

    if (
      workflowStatus === "PUBLISHED" &&
      !PUBLISH_ROLES.includes(
        userRole as "OWNER" | "ADMIN" | "EDITOR"
      )
    ) {
      return NextResponse.json(
        {
          error: "You do not have permission to publish posts.",
          requiredRoles: PUBLISH_ROLES,
        },
        { status: 403 }
      );
    }

    let categories: number[] = [];

    if (categoriesRaw) {
      try {
        const parsed = JSON.parse(categoriesRaw);

        if (Array.isArray(parsed)) {
          categories = parsed
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);
        }
      } catch {
        categories = categoriesRaw
          .split(",")
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value) && value > 0);
      }
    }

    let tags: number[] = [];

    if (tagsRaw) {
      try {
        const parsed = JSON.parse(tagsRaw);

        if (Array.isArray(parsed)) {
          tags = parsed
            .map((value) => Number(value))
            .filter((value) => Number.isFinite(value) && value > 0);
        }
      } catch {
        tags = tagsRaw
          .split(",")
          .map((value) => Number(value.trim()))
          .filter((value) => Number.isFinite(value) && value > 0);
      }
    }

    const wpAuth = getWordPressAuth();

    if (!wpAuth) {
      return NextResponse.json(
        { error: "WordPress credentials are not configured." },
        { status: 500 }
      );
    }

    if (slug) {
      const duplicateUrl =
        `${WP_API}/posts?slug=${encodeURIComponent(slug)}&_embed=1`;

      const duplicateResponse = await fetch(duplicateUrl, {
        method: "GET",
        headers: getWpHeaders(),
        cache: "no-store",
      });

      if (duplicateResponse.ok) {
        const duplicatePosts = await safeJson(duplicateResponse);

        if (
          Array.isArray(duplicatePosts) &&
          duplicatePosts.length > 0
        ) {
          return NextResponse.json(
            {
              error: "A post with this slug already exists.",
              post: duplicatePosts[0],
            },
            { status: 409 }
          );
        }
      }
    }

    let featuredMediaId: number | undefined;

    if (
      featuredImage &&
      featuredImage instanceof File &&
      featuredImage.size > 0
    ) {
      const imageBuffer = Buffer.from(
        await featuredImage.arrayBuffer()
      );

      const filename =
        featuredImage.name || "arsenaltalks-image.jpg";

      const contentType =
        featuredImage.type || "application/octet-stream";

      const mediaApi =
        `${WP_API.replace(/\/wp\/v2$/, "")}/media`;

      const uploadResponse = await fetch(mediaApi, {
        method: "POST",
        headers: {
          Authorization: `Basic ${wpAuth}`,
          "Content-Disposition":
            `attachment; filename="${filename}"`,
          "Content-Type": contentType,
        },
        body: imageBuffer,
      });

      if (!uploadResponse.ok) {
        const uploadError = await uploadResponse.text();

        console.error(
          "WordPress featured image upload failed:",
          uploadError
        );

        return NextResponse.json(
          {
            error: "Failed to upload featured image.",
            details: uploadError,
          },
          { status: 502 }
        );
      }

      const uploadedMedia = await safeJson(uploadResponse);

      if (uploadedMedia?.id) {
        featuredMediaId = Number(uploadedMedia.id);
      }
    }

    const wpPostPayload: Record<string, any> = {
      title,
      content,
      excerpt,
      status: workflowStatus === "PUBLISHED" ? "publish" : "draft",
    };

    if (slug) {
      wpPostPayload.slug = slug;
    }

    if (categories.length > 0) {
      wpPostPayload.categories = categories;
    }

    if (tags.length > 0) {
      wpPostPayload.tags = tags;
    }

    if (featuredMediaId) {
      wpPostPayload.featured_media = featuredMediaId;
    }

    const createResponse = await fetch(`${WP_API}/posts`, {
      method: "POST",
      headers: getWpHeaders(true),
      body: JSON.stringify(wpPostPayload),
    });

    const createdPost = await safeJson(createResponse);

    if (!createResponse.ok) {
      console.error(
        "WordPress post creation failed:",
        createdPost
      );

      return NextResponse.json(
        {
          error: "Failed to create WordPress post.",
          details: createdPost,
        },
        { status: createResponse.status || 502 }
      );
    }

    const postId = Number(createdPost?.id);

    if (!Number.isFinite(postId) || postId <= 0) {
      return NextResponse.json(
        {
          error:
            "WordPress created the post but returned an invalid post ID.",
          post: createdPost,
        },
        { status: 502 }
      );
    }

    const seoMeta: Record<string, string> = {};

    if (seoTitle.trim()) {
      seoMeta["_yoast_wpseo_title"] = seoTitle.trim();
    }

    if (seoDescription.trim()) {
      seoMeta["_yoast_wpseo_metadesc"] = seoDescription.trim();
    }

    if (seoFocusKeyword.trim()) {
      seoMeta["_yoast_wpseo_focuskw"] = seoFocusKeyword.trim();
    }

    if (Object.keys(seoMeta).length > 0) {
      const seoResponse = await fetch(
        `${WP_API}/posts/${postId}`,
        {
          method: "POST",
          headers: getWpHeaders(true),
          body: JSON.stringify({ meta: seoMeta }),
        }
      );

      if (!seoResponse.ok) {
        const seoError = await seoResponse.text();

        console.error(
          "Yoast SEO meta update failed:",
          seoError
        );
      }
    }

    let workflowResult: any = null;

    try {
      workflowResult = await updateWorkflow(
        postId,
        workflowStatus,
        userId
      );
    } catch (workflowError) {
      console.error(
        "Workflow update failed after WordPress post creation:",
        workflowError
      );

      return NextResponse.json(
        {
          warning:
            "Post was created in WordPress, but the editorial workflow could not be updated.",
          post: createdPost,
          workflowError:
            workflowError instanceof Error
              ? workflowError.message
              : String(workflowError),
        },
        { status: 207 }
      );
    }

    try {
      await prisma.auditLog.create({
        data: {
          userId,
          action: "CREATE_POST",
          targetId: postId,
          metadata: JSON.stringify({
            postId,
            title,
            slug: createdPost?.slug || slug || null,
            workflowStatus,
            categories,
            tags,
            featuredMediaId: featuredMediaId || null,
            seo: Object.keys(seoMeta).length > 0,
          }),
        },
      });
    } catch (auditError) {
      console.error(
        "Audit log creation failed:",
        auditError
      );
    }

    return NextResponse.json(
      {
        success: true,
        post: {
          id: postId,
          slug: createdPost?.slug || slug || null,
          title: stripHtml(
            createdPost?.title?.rendered ||
              createdPost?.title ||
              title
          ),
          link: createdPost?.link || null,
          status: createdPost?.status || null,
          date: createdPost?.date || null,
        },
        workflow: workflowResult,
        message: "Post created successfully.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("POST /api/posts error:", error);

    return NextResponse.json(
      {
        error: "Failed to create post.",
        details:
          error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
