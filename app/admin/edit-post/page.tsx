"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type WorkflowStatus =
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

type SessionData = {
  user?: SessionUser;
};

type WordPressPost = {
  id: number;
  date?: string;
  modified?: string;
  slug: string;
  status: string;
  title?: {
    rendered?: string;
  };
  content?: {
    rendered?: string;
  };
  excerpt?: {
    rendered?: string;
  };
  featured_media?: number;
  categories?: number[];
  meta?: {
    _yoast_wpseo_title?: string;
    _yoast_wpseo_metadesc?: string;
    _yoast_wpseo_focuskw?: string;
    [key: string]: unknown;
  };
  arsenaltalks_seo?: {
    title?: string;
    description?: string;
    focuskw?: string;
  };
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url?: string;
      [key: string]: unknown;
    }>;
    "wp:term"?: Array<
      Array<{
        id?: number;
        name?: string;
        slug?: string;
      }>
    >;
    [key: string]: unknown;
  };
};

type ApiResponse = {
  success?: boolean;
  error?: unknown;
  details?: unknown;
  message?: unknown;
  warning?: unknown;
  workflow?: unknown;
  post?: WordPressPost;
  postUpdated?: boolean;
  postId?: number;
  auditError?: unknown;
  workflowError?: unknown;
  [key: string]: unknown;
};

const WORKFLOW_STATUSES: Array<{
  value: WorkflowStatus;
  label: string;
}> = [
  {
    value: "DRAFT",
    label: "Draft",
  },
  {
    value: "IN_REVIEW",
    label: "In Review",
  },
  {
    value: "APPROVED",
    label: "Approved",
  },
  {
    value: "PUBLISHED",
    label: "Published",
  },
  {
    value: "REJECTED",
    label: "Rejected",
  },
];

function decodeHtml(value: string): string {
  if (!value) {
    return "";
  }

  if (typeof window === "undefined") {
    return value;
  }

  const textarea =
    document.createElement(
      "textarea"
    );

  textarea.innerHTML = value;

  return textarea.value;
}

function htmlToPlainText(
  value: string
): string {
  if (!value) {
    return "";
  }

  if (typeof window === "undefined") {
    return value
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();
  }

  const div =
    document.createElement(
      "div"
    );

  div.innerHTML = value;

  return (
    div.textContent
      ?.replace(/\s+/g, " ")
      .trim() || ""
  );
}

function normalizeImageUrl(
  url: string | null | undefined
): string {
  if (!url) {
    return "";
  }

  return url
    .replace(
      /^https?:\/\/(?:www\.)?arsenaltalks\.com/i,
      "https://api.arsenaltalks.com"
    )
    .trim();
}

function stripHtml(
  value: string
): string {
  return value
    .replace(/<[^>]*>/g, " ")
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
      /\s+/g,
      " "
    )
    .trim();
}

function createSlug(
  value: string
): string {
  return value
    .toLowerCase()
    .trim()
    .replace(
      /['’]/g,
      ""
    )
    .replace(
      /[^a-z0-9]+/g,
      "-"
    )
    .replace(
      /^-+|-+$/g,
      "");
}

function getInitialWorkflowStatus(
  post: WordPressPost
): WorkflowStatus {
  if (
    post.status ===
    "publish"
  ) {
    return "PUBLISHED";
  }

  return "DRAFT";
}

/**
 * Safely convert an unknown API error
 * into a string accepted by Error().
 */
function getApiErrorMessage(
  value: unknown
): string {
  if (
    typeof value ===
    "string"
  ) {
    return value;
  }

  if (
    value instanceof Error
  ) {
    return value.message;
  }

  if (
    value &&
    typeof value ===
      "object"
  ) {
    try {
      return JSON.stringify(
        value
      );
    } catch {
      return "Unknown API error.";
    }
  }

  return "";
}

export default function EditPostPage() {
  const router =
    useRouter();

  const searchParams =
    useSearchParams();

  /*
   * This remains string | null.
   * We NEVER pass it directly into
   * encodeURIComponent().
   */
  const postId =
    searchParams.get(
      "id"
    );

  const [session, setSession] =
    useState<SessionData | null>(
      null
    );

  const [post, setPost] =
    useState<WordPressPost | null>(
      null
    );

  const [categories, setCategories] =
    useState<Category[]>(
      []
    );

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [
    selectedCategories,
    setSelectedCategories,
  ] = useState<number[]>(
    []
  );

  const [
    featuredImage,
    setFeaturedImage,
  ] = useState<File | null>(
    null
  );

  const [
    featuredImagePreview,
    setFeaturedImagePreview,
  ] = useState("");

  const [seoTitle, setSeoTitle] =
    useState("");

  const [
    metaDescription,
    setMetaDescription,
  ] = useState("");

  const [
    focusKeyphrase,
    setFocusKeyphrase,
  ] = useState("");

  const [
    workflowStatus,
    setWorkflowStatus,
  ] =
    useState<WorkflowStatus>(
      "DRAFT"
    );

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [
    successMessage,
    setSuccessMessage,
  ] = useState("");

  const [
    warningMessage,
    setWarningMessage,
  ] = useState("");

  const [
    slugManuallyEdited,
    setSlugManuallyEdited,
  ] = useState(false);

  /*
   * LOAD POST
   */
  useEffect(() => {
    let cancelled = false;

    async function loadPage() {
      /*
       * Get the ID locally and narrow it.
       */
      const currentPostId =
        searchParams.get(
          "id"
        );

      if (!currentPostId) {
        setError(
          "No post ID was provided."
        );

        setLoading(false);

        return;
      }

      /*
       * currentPostId is guaranteed
       * to be a string here.
       */
      const encodedPostId =
        encodeURIComponent(
          currentPostId
        );

      try {
        setLoading(true);
        setError("");
        setSuccessMessage("");
        setWarningMessage("");

        const [
          sessionResponse,
          categoriesResponse,
          postResponse,
        ] = await Promise.all([
          fetch(
            "/api/auth/session",
            {
              cache:
                "no-store",
            }
          ),

          fetch(
            "/api/categories",
            {
              cache:
                "no-store",
            }
          ),

          fetch(
            `/api/posts/id/${encodedPostId}`,
            {
              cache:
                "no-store",
            }
          ),
        ]);

        const sessionData: SessionData =
          await sessionResponse.json();

        if (
          !sessionResponse.ok
        ) {
          throw new Error(
            "Failed to load authentication session."
          );
        }

        if (
          !sessionData?.user
        ) {
          router.push(
            "/admin"
          );

          return;
        }

        if (
          !categoriesResponse.ok
        ) {
          throw new Error(
            "Failed to load categories."
          );
        }

        const categoriesData =
          await categoriesResponse.json();

        if (
          !postResponse.ok
        ) {
          const postError: ApiResponse =
            await postResponse
              .json()
              .catch(
                () => ({})
              );

          const message =
            getApiErrorMessage(
              postError.error
            ) ||
            getApiErrorMessage(
              postError.details
            ) ||
            getApiErrorMessage(
              postError.message
            ) ||
            `Failed to load post. HTTP ${postResponse.status}`;

          throw new Error(
            message
          );
        }

        const postData: ApiResponse =
          await postResponse.json();

        if (
          !postData?.post
        ) {
          throw new Error(
            "The WordPress post could not be loaded."
          );
        }

        if (cancelled) {
          return;
        }

        const loadedPost =
          postData.post;

        setSession(
          sessionData
        );

        setPost(
          loadedPost
        );

        const loadedTitle =
          decodeHtml(
            loadedPost.title
              ?.rendered ||
              ""
          );

        const loadedSlug =
          loadedPost.slug ||
          "";

        const loadedExcerpt =
          htmlToPlainText(
            loadedPost.excerpt
              ?.rendered ||
              ""
          );

        const loadedContent =
          loadedPost.content
            ?.rendered ||
            "";

        setTitle(
          loadedTitle
        );

        setSlug(
          loadedSlug
        );

        setExcerpt(
          loadedExcerpt
        );

        setContent(
          loadedContent
        );

        setSlugManuallyEdited(
          true
        );

        setSelectedCategories(
          Array.isArray(
            loadedPost.categories
          )
            ? loadedPost.categories
                .map((id) =>
                  Number(id)
                )
                .filter(
                  (id) =>
                    Number.isInteger(
                      id
                    ) &&
                    id > 0
                )
            : []
        );

        const embeddedImage =
          loadedPost
            ._embedded
            ?.[
              "wp:featuredmedia"
            ]?.[0]
            ?.source_url;

        setFeaturedImagePreview(
          normalizeImageUrl(
            embeddedImage
          )
        );

        const seo =
          loadedPost.arsenaltalks_seo ||
          {};

        const nativeMeta =
          loadedPost.meta ||
          {};

        setSeoTitle(
          String(
            seo.title ??
              nativeMeta._yoast_wpseo_title ??
              ""
          )
        );

        setMetaDescription(
          String(
            seo.description ??
              nativeMeta._yoast_wpseo_metadesc ??
              ""
          )
        );

        setFocusKeyphrase(
          String(
            seo.focuskw ??
              nativeMeta._yoast_wpseo_focuskw ??
              ""
          )
        );

        setWorkflowStatus(
          getInitialWorkflowStatus(
            loadedPost
          )
        );

        const loadedCategories =
          Array.isArray(
            categoriesData?.categories
          )
            ? categoriesData.categories
            : Array.isArray(
                  categoriesData
                )
              ? categoriesData
              : [];

        setCategories(
          loadedCategories.map(
            (
              category: Category
            ) => ({
              id: Number(
                category.id
              ),
              name: String(
                category.name
              ),
              slug: String(
                category.slug ||
                  ""
              ),
            })
          )
        );
      } catch (
        loadError: unknown
      ) {
        if (cancelled) {
          return;
        }

        console.error(
          "EDIT POST LOAD ERROR:",
          loadError
        );

        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Failed to load post."
        );
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadPage();

    return () => {
      cancelled = true;
    };
  }, [
    router,
    searchParams,
  ]);

  /*
   * Generate slug from title
   * until manually edited.
   */
  useEffect(() => {
    if (
      !slugManuallyEdited &&
      title.trim()
    ) {
      setSlug(
        createSlug(title)
      );
    }
  }, [
    title,
    slugManuallyEdited,
  ]);

  /*
   * Clean up blob URLs.
   */
  useEffect(() => {
    return () => {
      if (
        featuredImagePreview.startsWith(
          "blob:"
        )
      ) {
        URL.revokeObjectURL(
          featuredImagePreview
        );
      }
    };
  }, [
    featuredImagePreview,
  ]);

  const userRole =
    session?.user?.role ||
    "";

  const canPublish =
    userRole === "EDITOR" ||
    userRole === "ADMIN" ||
    userRole === "OWNER";

  const titleLength =
    title.length;

  const metaDescriptionLength =
    metaDescription.length;

  const focusKeyphraseLength =
    focusKeyphrase.length;

  const plainContent =
    useMemo(
      () =>
        stripHtml(
          content
        ),
      [content]
    );

  const contentWordCount =
    useMemo(() => {
      if (!plainContent) {
        return 0;
      }

      return plainContent
        .split(/\s+/)
        .filter(Boolean)
        .length;
    }, [plainContent]);

  const seoPreviewTitle =
    seoTitle.trim() ||
    title.trim() ||
    "Your SEO title will appear here";

  const seoPreviewDescription =
    metaDescription.trim() ||
    excerpt.trim() ||
    "Your meta description will appear here.";

  const seoPreviewSlug =
    slug.trim() ||
    "your-post-slug";

  function handleCategoryToggle(
    categoryId: number
  ) {
    setSelectedCategories(
      (current) => {
        if (
          current.includes(
            categoryId
          )
        ) {
          return current.filter(
            (id) =>
              id !==
              categoryId
          );
        }

        return [
          ...current,
          categoryId,
        ];
      }
    );
  }

  function handleFeaturedImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
      "image/gif",
    ];

    if (
      !allowedTypes.includes(
        file.type
      )
    ) {
      setError(
        "Invalid featured image type. Use JPG, PNG, WebP, or GIF."
      );

      event.target.value =
        "";

      return;
    }

    const maxSize =
      10 * 1024 * 1024;

    if (
      file.size > maxSize
    ) {
      setError(
        "Featured image is too large. Maximum size is 10MB."
      );

      event.target.value =
        "";

      return;
    }

    if (
      featuredImagePreview.startsWith(
        "blob:"
      )
    ) {
      URL.revokeObjectURL(
        featuredImagePreview
      );
    }

    const previewUrl =
      URL.createObjectURL(
        file
      );

    setFeaturedImage(
      file
    );

    setFeaturedImagePreview(
      previewUrl
    );

    setError("");
    setSuccessMessage("");
    setWarningMessage("");
  }

  function handleSlugChange(
    value: string
  ) {
    setSlugManuallyEdited(
      true
    );

    setSlug(
      createSlug(value)
    );
  }

  async function savePost(
    event?: FormEvent,
    requestedStatus?: WorkflowStatus
  ) {
    event?.preventDefault();

    /*
     * Narrow the ID again before using it.
     */
    const currentPostId =
      searchParams.get(
        "id"
      );

    if (!currentPostId) {
      setError(
        "No post ID was provided."
      );

      return;
    }

    const encodedPostId =
      encodeURIComponent(
        currentPostId
      );

    if (!title.trim()) {
      setError(
        "Post title is required."
      );

      return;
    }

    if (!content.trim()) {
      setError(
        "Post content is required."
      );

      return;
    }

    const status =
      requestedStatus ||
      workflowStatus;

    if (
      status ===
        "PUBLISHED" &&
      !canPublish
    ) {
      setError(
        "You do not have permission to publish posts."
      );

      return;
    }

    try {
      setSaving(true);
      setError("");
      setSuccessMessage("");
      setWarningMessage("");

      const formData =
        new FormData();

      formData.append(
        "title",
        title.trim()
      );

      formData.append(
        "slug",
        slug.trim()
      );

      formData.append(
        "excerpt",
        excerpt.trim()
      );

      formData.append(
        "content",
        content
      );

      formData.append(
        "categories",
        JSON.stringify(
          selectedCategories
        )
      );

      formData.append(
        "seoTitle",
        seoTitle.trim()
      );

      formData.append(
        "metaDescription",
        metaDescription.trim()
      );

      formData.append(
        "focusKeyphrase",
        focusKeyphrase.trim()
      );

      formData.append(
        "status",
        status
      );

      if (
        featuredImage
      ) {
        formData.append(
          "featuredImage",
          featuredImage
        );
      }

      console.log(
        "Saving WordPress post:",
        {
          postId:
            currentPostId,
          status,
          hasFeaturedImage:
            Boolean(
              featuredImage
            ),
          featuredImageName:
            featuredImage?.name ||
            null,
        }
      );

      const response =
        await fetch(
          `/api/posts/id/${encodedPostId}`,
          {
            method:
              "PUT",
            body:
              formData,
          }
        );

      const data: ApiResponse =
        await response
          .json()
          .catch(
            () => ({})
          );

      /*
       * 207 means WordPress succeeded
       * but optional workflow/audit
       * persistence failed.
       */
      if (
        !response.ok &&
        response.status !==
          207
      ) {
        console.error(
          "EDIT POST API ERROR:",
          {
            status:
              response.status,
            statusText:
              response.statusText,
            response:
              data,
          }
        );

        const apiMessage =
          getApiErrorMessage(
            data.error
          ) ||
          getApiErrorMessage(
            data.details
          ) ||
          getApiErrorMessage(
            data.message
          );

        throw new Error(
          apiMessage ||
            `Failed to update post. HTTP ${response.status}`
        );
      }

      if (
        response.status ===
        207
      ) {
        setWarningMessage(
          getApiErrorMessage(
            data.warning
          ) ||
            "The WordPress post was updated successfully, but an optional editorial operation could not be completed."
        );
      } else {
        setSuccessMessage(
          status ===
            "PUBLISHED"
            ? "Post published successfully."
            : status ===
                "IN_REVIEW"
              ? "Post submitted for review successfully."
              : status ===
                  "APPROVED"
                ? "Post approved successfully."
                : status ===
                    "REJECTED"
                  ? "Post rejected successfully."
                  : "Post saved successfully."
        );
      }

      setWorkflowStatus(
        status
      );

      if (
        data.post
      ) {
        setPost(
          data.post
        );

        const returnedImage =
          data.post
            ._embedded
            ?.[
              "wp:featuredmedia"
            ]?.[0]
            ?.source_url;

        if (
          returnedImage
        ) {
          setFeaturedImagePreview(
            normalizeImageUrl(
              returnedImage
            )
          );
        }

        setFeaturedImage(
          null
        );
      }
    } catch (
      saveError: unknown
    ) {
      console.error(
        "Failed to save post:",
        saveError
      );

      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "Failed to save post."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-7xl px-6 py-10">
          <div className="animate-pulse">
            <div className="h-8 w-48 rounded bg-gray-200" />

            <div className="mt-3 h-4 w-80 rounded bg-gray-100" />

            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_360px]">
              <div className="space-y-5">
                <div className="h-14 rounded bg-gray-100" />
                <div className="h-14 rounded bg-gray-100" />
                <div className="h-48 rounded bg-gray-100" />
                <div className="h-96 rounded bg-gray-100" />
              </div>

              <div className="space-y-5">
                <div className="h-56 rounded bg-gray-100" />
                <div className="h-64 rounded bg-gray-100" />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (
    error &&
    !post
  ) {
    return (
      <main className="min-h-screen bg-white">
        <div className="mx-auto max-w-4xl px-6 py-16">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6">
            <h1 className="text-xl font-bold text-red-800">
              Unable to load post
            </h1>

            <p className="mt-2 text-sm text-red-700">
              {error}
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin"
                )
              }
              className="mt-5 rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white hover:bg-gray-800"
            >
              Back to Admin
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f8f9fa]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 border-b border-gray-200 bg-white">
        <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6">
          <div>
            <div className="text-xl font-black tracking-tight text-black">
              ArsenalTalks
            </div>

            <div className="text-xs font-medium uppercase tracking-[0.18em] text-gray-500">
              Editorial
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin"
                )
              }
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50"
            >
              Admin
            </button>

            {post?.slug && (
              <a
                href={`https://arsenaltalks.com/news/${post.slug}`}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-gray-800"
              >
                View Article
              </a>
            )}
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-6 py-8">
        {/* PAGE HEADING */}
        <div className="mb-8">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-gray-950">
                Edit Post
              </h1>

              <p className="mt-1 text-sm text-gray-500">
                Editing WordPress post #
                {postId}
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              <span
                className={`h-2 w-2 rounded-full ${
                  workflowStatus ===
                  "PUBLISHED"
                    ? "bg-green-500"
                    : workflowStatus ===
                        "IN_REVIEW"
                      ? "bg-yellow-500"
                      : workflowStatus ===
                          "APPROVED"
                        ? "bg-blue-500"
                        : workflowStatus ===
                            "REJECTED"
                          ? "bg-red-500"
                          : "bg-gray-400"
                }`}
              />

              {workflowStatus}
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            <div className="font-bold">
              Error
            </div>

            <div className="mt-1">
              {error}
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {successMessage && (
          <div className="mb-6 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            <div className="font-bold">
              Success
            </div>

            <div className="mt-1">
              {successMessage}
            </div>
          </div>
        )}

        {/* WARNING */}
        {warningMessage && (
          <div className="mb-6 rounded-xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-sm text-yellow-800">
            <div className="font-bold">
              WordPress updated successfully
            </div>

            <div className="mt-1">
              {warningMessage}
            </div>
          </div>
        )}

        <form
          onSubmit={(event) =>
            savePost(
              event,
              workflowStatus
            )
          }
        >
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* MAIN EDITOR */}
            <section className="space-y-6">
              {/* ARTICLE */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-gray-950">
                    Article
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Edit the main article content and
                    publishing information.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* TITLE */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-title"
                        className="text-sm font-bold text-gray-800"
                      >
                        Title
                      </label>

                      <span className="text-xs text-gray-400">
                        {titleLength}{" "}
                        characters
                      </span>
                    </div>

                    <input
                      id="post-title"
                      type="text"
                      value={title}
                      onChange={(event) =>
                        setTitle(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-semibold text-gray-950 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="Enter article title"
                    />
                  </div>

                  {/* SLUG */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-slug"
                        className="text-sm font-bold text-gray-800"
                      >
                        Slug
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setSlug(
                            createSlug(
                              title
                            )
                          );

                          setSlugManuallyEdited(
                            true
                          );
                        }}
                        className="text-xs font-semibold text-red-600 hover:text-red-700"
                      >
                        Generate from title
                      </button>
                    </div>

                    <input
                      id="post-slug"
                      type="text"
                      value={slug}
                      onChange={(event) =>
                        handleSlugChange(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="article-slug"
                    />

                    <p className="mt-1.5 text-xs text-gray-400">
                      /news/
                      {slug ||
                        "article-slug"}
                    </p>
                  </div>

                  {/* EXCERPT */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-excerpt"
                        className="text-sm font-bold text-gray-800"
                      >
                        Excerpt
                      </label>

                      <span className="text-xs text-gray-400">
                        {excerpt.length}{" "}
                        characters
                      </span>
                    </div>

                    <textarea
                      id="post-excerpt"
                      value={excerpt}
                      onChange={(event) =>
                        setExcerpt(
                          event.target.value
                        )
                      }
                      rows={4}
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="Write a short article excerpt..."
                    />
                  </div>

                  {/* CONTENT */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="post-content"
                        className="text-sm font-bold text-gray-800"
                      >
                        Content
                      </label>

                      <span className="text-xs text-gray-400">
                        {contentWordCount}{" "}
                        words
                      </span>
                    </div>

                    <textarea
                      id="post-content"
                      value={content}
                      onChange={(event) =>
                        setContent(
                          event.target.value
                        )
                      }
                      rows={24}
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 font-mono text-sm leading-6 text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="Write your article content..."
                    />

                    <p className="mt-2 text-xs text-gray-400">
                      WordPress HTML is preserved.
                      You can edit HTML directly in
                      this field.
                    </p>
                  </div>
                </div>
              </div>

              {/* YOAST SEO */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5">
                  <h2 className="text-lg font-bold text-gray-950">
                    Yoast SEO
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    These fields are saved directly to
                    WordPress Yoast SEO metadata.
                  </p>
                </div>

                <div className="space-y-5">
                  {/* SEO TITLE */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="seo-title"
                        className="text-sm font-bold text-gray-800"
                      >
                        SEO Title
                      </label>

                      <span
                        className={`text-xs ${
                          seoTitle.length >
                          60
                            ? "font-semibold text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {seoTitle.length}
                        /60
                      </span>
                    </div>

                    <input
                      id="seo-title"
                      type="text"
                      value={seoTitle}
                      onChange={(event) =>
                        setSeoTitle(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="SEO title"
                    />
                  </div>

                  {/* META DESCRIPTION */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="meta-description"
                        className="text-sm font-bold text-gray-800"
                      >
                        Meta Description
                      </label>

                      <span
                        className={`text-xs ${
                          metaDescriptionLength >
                          160
                            ? "font-semibold text-red-600"
                            : "text-gray-400"
                        }`}
                      >
                        {
                          metaDescriptionLength
                        }
                        /160
                      </span>
                    </div>

                    <textarea
                      id="meta-description"
                      value={
                        metaDescription
                      }
                      onChange={(event) =>
                        setMetaDescription(
                          event.target.value
                        )
                      }
                      rows={4}
                      className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm leading-6 text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="Meta description"
                    />
                  </div>

                  {/* FOCUS KEYPHRASE */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="focus-keyphrase"
                        className="text-sm font-bold text-gray-800"
                      >
                        Focus Keyphrase
                      </label>

                      <span className="text-xs text-gray-400">
                        {
                          focusKeyphraseLength
                        }{" "}
                        characters
                      </span>
                    </div>

                    <input
                      id="focus-keyphrase"
                      type="text"
                      value={
                        focusKeyphrase
                      }
                      onChange={(event) =>
                        setFocusKeyphrase(
                          event.target.value
                        )
                      }
                      className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-800 outline-none transition focus:border-red-600 focus:ring-2 focus:ring-red-100"
                      placeholder="e.g. Arsenal target Eze"
                    />
                  </div>

                  {/* SEARCH PREVIEW */}
                  <div>
                    <div className="mb-2 text-sm font-bold text-gray-800">
                      Search Preview
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                      <div className="text-xs text-green-700">
                        arsenaltalks.com
                        {" › "}
                        news
                        {" › "}
                        {
                          seoPreviewSlug
                        }
                      </div>

                      <div className="mt-1 line-clamp-2 text-lg font-medium leading-6 text-[#1a0dab]">
                        {
                          seoPreviewTitle
                        }
                      </div>

                      <div className="mt-1 line-clamp-3 text-sm leading-5 text-gray-600">
                        {
                          seoPreviewDescription
                        }
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* SIDEBAR */}
            <aside className="space-y-6">
              {/* EDITORIAL STATUS */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-950">
                  Editorial Status
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Choose the editorial workflow state
                  before saving.
                </p>

                <div className="mt-5 space-y-2">
                  {WORKFLOW_STATUSES.map(
                    (status) => {
                      const disabled =
                        status.value ===
                          "PUBLISHED" &&
                        !canPublish;

                      return (
                        <label
                          key={
                            status.value
                          }
                          className={`flex cursor-pointer items-center gap-3 rounded-xl border px-3 py-3 transition ${
                            workflowStatus ===
                            status.value
                              ? "border-red-300 bg-red-50"
                              : "border-gray-200 bg-white hover:bg-gray-50"
                          } ${
                            disabled
                              ? "cursor-not-allowed opacity-50"
                              : ""
                          }`}
                        >
                          <input
                            type="radio"
                            name="workflow-status"
                            value={
                              status.value
                            }
                            checked={
                              workflowStatus ===
                              status.value
                            }
                            disabled={
                              disabled
                            }
                            onChange={() =>
                              setWorkflowStatus(
                                status.value
                              )
                            }
                            className="h-4 w-4 accent-red-600"
                          />

                          <span className="text-sm font-semibold text-gray-800">
                            {
                              status.label
                            }
                          </span>
                        </label>
                      );
                    }
                  )}
                </div>

                {!canPublish && (
                  <p className="mt-3 text-xs leading-5 text-gray-500">
                    Your current role cannot publish
                    posts. An Editor, Admin or Owner must
                    publish the article.
                  </p>
                )}
              </div>

              {/* FEATURED IMAGE */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-950">
                  Featured Image
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Upload a new image to replace the
                  current WordPress featured image.
                </p>

                <div className="mt-5">
                  {featuredImagePreview ? (
                    <div className="overflow-hidden rounded-xl border border-gray-200 bg-gray-100">
                      <img
                        src={
                          featuredImagePreview
                        }
                        alt="Featured image preview"
                        className="aspect-video w-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex aspect-video items-center justify-center rounded-xl border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                      No featured image
                    </div>
                  )}

                  <label
                    htmlFor="featured-image"
                    className="mt-4 flex cursor-pointer items-center justify-center rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-bold text-gray-700 transition hover:bg-gray-50"
                  >
                    Choose New Image
                  </label>

                  <input
                    id="featured-image"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={
                      handleFeaturedImageChange
                    }
                    className="hidden"
                  />

                  {featuredImage && (
                    <div className="mt-3 rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-600">
                      <div className="font-semibold">
                        New image selected
                      </div>

                      <div className="mt-0.5 truncate">
                        {
                          featuredImage.name
                        }
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* CATEGORIES */}
              <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <h2 className="text-lg font-bold text-gray-950">
                  Categories
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                  Select one or more WordPress
                  categories.
                </p>

                <div className="mt-5 space-y-2">
                  {categories.length ===
                  0 ? (
                    <div className="rounded-xl bg-gray-50 p-4 text-sm text-gray-500">
                      No categories found.
                    </div>
                  ) : (
                    categories.map(
                      (category) => (
                        <label
                          key={
                            category.id
                          }
                          className="flex cursor-pointer items-center gap-3 rounded-lg px-2 py-2 hover:bg-gray-50"
                        >
                          <input
                            type="checkbox"
                            checked={selectedCategories.includes(
                              category.id
                            )}
                            onChange={() =>
                              handleCategoryToggle(
                                category.id
                              )
                            }
                            className="h-4 w-4 rounded accent-red-600"
                          />

                          <span className="text-sm font-medium text-gray-700">
                            {
                              category.name
                            }
                          </span>
                        </label>
                      )
                    )
                  )}
                </div>
              </div>

              {/* POST INFORMATION */}
              {post && (
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                  <h2 className="text-lg font-bold text-gray-950">
                    Post Information
                  </h2>

                  <div className="mt-4 space-y-3 text-sm">
                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        WordPress ID
                      </span>

                      <span className="font-semibold text-gray-800">
                        {post.id}
                      </span>
                    </div>

                    <div className="flex justify-between gap-4">
                      <span className="text-gray-500">
                        WP Status
                      </span>

                      <span className="font-semibold text-gray-800">
                        {post.status}
                      </span>
                    </div>

                    {post.modified && (
                      <div className="flex justify-between gap-4">
                        <span className="text-gray-500">
                          Modified
                        </span>

                        <span className="text-right font-semibold text-gray-800">
                          {new Date(
                            post.modified
                          ).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </aside>
          </div>

          {/* ACTION BAR */}
          <div className="sticky bottom-0 z-20 mt-8 border-t border-gray-200 bg-white/95 py-4 backdrop-blur">
            <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
              <div className="text-sm text-gray-500">
                Current action:{" "}
                <span className="font-bold text-gray-800">
                  {workflowStatus}
                </span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    savePost(
                      undefined,
                      "DRAFT"
                    )
                  }
                  className="rounded-xl border border-gray-300 bg-white px-5 py-3 text-sm font-bold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving &&
                  workflowStatus ===
                    "DRAFT"
                    ? "Saving..."
                    : "Save Draft"}
                </button>

                <button
                  type="button"
                  disabled={
                    saving
                  }
                  onClick={() =>
                    savePost(
                      undefined,
                      "IN_REVIEW"
                    )
                  }
                  className="rounded-xl border border-yellow-400 bg-yellow-50 px-5 py-3 text-sm font-bold text-yellow-800 transition hover:bg-yellow-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving &&
                  workflowStatus ===
                    "IN_REVIEW"
                    ? "Submitting..."
                    : "Submit for Review"}
                </button>

                <button
                  type="button"
                  disabled={
                    saving ||
                    !canPublish
                  }
                  onClick={() =>
                    savePost(
                      undefined,
                      "PUBLISHED"
                    )
                  }
                  className="rounded-xl bg-[#d10000] px-6 py-3 text-sm font-bold text-white transition hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {saving &&
                  workflowStatus ===
                    "PUBLISHED"
                    ? "Publishing..."
                    : "Publish"}
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}