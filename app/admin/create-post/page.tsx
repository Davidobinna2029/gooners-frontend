"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";

type Category = {
  id: number;
  name: string;
  slug: string;
};

type SessionUser = {
  id?: string;
  email?: string;
  role?: "WRITER" | "EDITOR" | "ADMIN" | "OWNER";
};

type SessionResponse = {
  user?: SessionUser;
};

type PublishStatus =
  | "DRAFT"
  | "IN_REVIEW"
  | "PUBLISHED";

const SEO_TITLE_MAX = 60;
const META_DESCRIPTION_MAX = 160;
const FOCUS_KEYPHRASE_MAX = 100;

function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function stripHtml(value: string): string {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#039;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function buildDescription(
  excerpt: string,
  content: string
): string {
  const source =
    stripHtml(excerpt) ||
    stripHtml(content);

  return source
    .slice(0, META_DESCRIPTION_MAX)
    .trim();
}

export default function CreatePostPage() {
  const [session, setSession] =
    useState<SessionResponse | null>(null);

  const [categories, setCategories] =
    useState<Category[]>([]);

  const [title, setTitle] =
    useState("");

  const [slug, setSlug] =
    useState("");

  const [slugManuallyEdited, setSlugManuallyEdited] =
    useState(false);

  const [excerpt, setExcerpt] =
    useState("");

  const [content, setContent] =
    useState("");

  const [selectedCategories, setSelectedCategories] =
    useState<number[]>([]);

  const [featuredImage, setFeaturedImage] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  /**
   * SEO fields
   */
  const [seoTitle, setSeoTitle] =
    useState("");

  const [metaDescription, setMetaDescription] =
    useState("");

  const [focusKeyphrase, setFocusKeyphrase] =
    useState("");

  const [seoTitleManuallyEdited, setSeoTitleManuallyEdited] =
    useState(false);

  const [
    metaDescriptionManuallyEdited,
    setMetaDescriptionManuallyEdited,
  ] = useState(false);

  /**
   * UI state
   */
  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [createdPost, setCreatedPost] =
    useState<any>(null);

  /**
   * ---------------------------------------------------------
   * Load session and categories
   * ---------------------------------------------------------
   */
  useEffect(() => {
    async function loadData() {
      try {
        const [
          sessionResponse,
          categoriesResponse,
        ] = await Promise.all([
          fetch("/api/auth/session", {
            cache: "no-store",
          }),

          fetch("/api/categories", {
            cache: "no-store",
          }),
        ]);

        if (sessionResponse.ok) {
          const sessionData =
            await sessionResponse.json();

          setSession(sessionData);
        }

        if (categoriesResponse.ok) {
          const categoryData =
            await categoriesResponse.json();

          if (Array.isArray(categoryData)) {
            setCategories(categoryData);
          }
        }
      } catch (loadError) {
        console.error(
          "Failed to load Create Post data:",
          loadError
        );

        setError(
          "Failed to load the publishing interface."
        );
      }
    }

    loadData();
  }, []);

  /**
   * ---------------------------------------------------------
   * Automatically generate slug from title
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (
      !slugManuallyEdited &&
      title.trim()
    ) {
      setSlug(slugify(title));
    }
  }, [
    title,
    slugManuallyEdited,
  ]);

  /**
   * ---------------------------------------------------------
   * Automatically use article title as SEO title
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (!seoTitleManuallyEdited) {
      setSeoTitle(
        title.slice(
          0,
          SEO_TITLE_MAX
        )
      );
    }
  }, [
    title,
    seoTitleManuallyEdited,
  ]);

  /**
   * ---------------------------------------------------------
   * Automatically generate meta description
   * ---------------------------------------------------------
   */
  useEffect(() => {
    if (
      !metaDescriptionManuallyEdited
    ) {
      setMetaDescription(
        buildDescription(
          excerpt,
          content
        )
      );
    }
  }, [
    excerpt,
    content,
    metaDescriptionManuallyEdited,
  ]);

  /**
   * ---------------------------------------------------------
   * Derived values
   * ---------------------------------------------------------
   */
  const currentRole =
    session?.user?.role ||
    "WRITER";

  const canPublish = [
    "EDITOR",
    "ADMIN",
    "OWNER",
  ].includes(currentRole);

  const previewTitle =
    seoTitle.trim() ||
    title.trim() ||
    "Your article title";

  const previewDescription =
    metaDescription.trim() ||
    "Your meta description will appear here.";

  const previewUrl =
    `arsenaltalks.com/news/${
      slug ||
      "your-article-slug"
    }`;

  const titleLength =
    seoTitle.length;

  const descriptionLength =
    metaDescription.length;

  const focusLength =
    focusKeyphrase.length;

  const titleStatus =
    titleLength === 0
      ? "empty"
      : titleLength <= SEO_TITLE_MAX
        ? "good"
        : "long";

  const descriptionStatus =
    descriptionLength === 0
      ? "empty"
      : descriptionLength <= META_DESCRIPTION_MAX
        ? "good"
        : "long";

  const focusStatus =
    focusLength === 0
      ? "empty"
      : "good";

  const categoryOptions =
    useMemo(
      () =>
        [...categories].sort(
          (a, b) =>
            a.name.localeCompare(
              b.name
            )
        ),
      [categories]
    );

  /**
   * ---------------------------------------------------------
   * Featured image
   * ---------------------------------------------------------
   */
  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setFeaturedImage(null);
      setImagePreview(null);
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
        "Please select a JPG, PNG, WebP, or GIF image."
      );

      event.target.value = "";
      return;
    }

    if (
      file.size >
      10 * 1024 * 1024
    ) {
      setError(
        "Featured image must be 10MB or smaller."
      );

      event.target.value = "";
      return;
    }

    setError("");
    setFeaturedImage(file);

    const objectUrl =
      URL.createObjectURL(file);

    setImagePreview(objectUrl);
  }

  function removeImage() {
    if (imagePreview) {
      URL.revokeObjectURL(
        imagePreview
      );
    }

    setFeaturedImage(null);
    setImagePreview(null);
  }

  /**
   * ---------------------------------------------------------
   * Categories
   * ---------------------------------------------------------
   */
  function toggleCategory(
    categoryId: number
  ) {
    setSelectedCategories(
      (current) =>
        current.includes(categoryId)
          ? current.filter(
              (id) =>
                id !== categoryId
            )
          : [
              ...current,
              categoryId,
            ]
    );
  }

  /**
   * ---------------------------------------------------------
   * Basic HTML toolbar
   * ---------------------------------------------------------
   */
  function insertHtml(
    before: string,
    after: string
  ) {
    const textarea =
      document.getElementById(
        "content"
      ) as HTMLTextAreaElement | null;

    if (!textarea) {
      return;
    }

    const start =
      textarea.selectionStart;

    const end =
      textarea.selectionEnd;

    const selected =
      content.slice(
        start,
        end
      );

    const replacement =
      `${before}${selected}${after}`;

    const newContent =
      content.slice(
        0,
        start
      ) +
      replacement +
      content.slice(end);

    setContent(newContent);

    requestAnimationFrame(() => {
      textarea.focus();

      const cursor =
        start +
        replacement.length;

      textarea.setSelectionRange(
        cursor,
        cursor
      );
    });
  }

  /**
   * ---------------------------------------------------------
   * Submit article
   *
   * IMPORTANT:
   * This function receives ONLY the workflow status.
   * There is no FormEvent argument anymore.
   * ---------------------------------------------------------
   */
  async function handleSubmit(
    status: PublishStatus
  ) {
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError(
        "Please enter an article title."
      );
      return;
    }

    if (!content.trim()) {
      setError(
        "Please enter article content."
      );
      return;
    }

    if (
      status === "PUBLISHED" &&
      !canPublish
    ) {
      setError(
        "You do not have permission to publish posts."
      );
      return;
    }

    setSaving(true);

    try {
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
        "status",
        status
      );

      /**
       * SEO
       */
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

      /**
       * Featured image
       */
      if (featuredImage) {
        formData.append(
          "featuredImage",
          featuredImage
        );
      }

      const response =
        await fetch(
          "/api/posts",
          {
            method: "POST",
            body: formData,
          }
        );

      const data =
        await response.json();

      if (!response.ok) {
        /**
         * Important:
         * WordPress may have created the post even if
         * the Neon workflow operation subsequently failed.
         *
         * Never submit the same article again in this case.
         */
        if (
          data?.postCreated &&
          data?.postId
        ) {
          setCreatedPost(
            data.post
          );

          setError(
            `WordPress created post #${data.postId}, but the editorial workflow could not be saved. Do not submit this article again.`
          );

          return;
        }

        throw new Error(
          data?.error ||
            data?.details ||
            "Failed to create post."
        );
      }

      setCreatedPost(
        data.post
      );

      setSuccess(
        status === "PUBLISHED"
          ? "Article published successfully."
          : status === "IN_REVIEW"
            ? "Article submitted for review successfully."
            : "Draft saved successfully."
      );

      /**
       * Reset article form
       */
      setTitle("");
      setSlug("");
      setSlugManuallyEdited(
        false
      );

      setExcerpt("");
      setContent("");

      setSelectedCategories(
        []
      );

      removeImage();

      setSeoTitle("");
      setMetaDescription("");
      setFocusKeyphrase("");

      setSeoTitleManuallyEdited(
        false
      );

      setMetaDescriptionManuallyEdited(
        false
      );
    } catch (submitError) {
      console.error(
        "Create post failed:",
        submitError
      );

      setError(
        submitError instanceof Error
          ? submitError.message
          : "Failed to create article."
      );
    } finally {
      setSaving(false);
    }
  }

  /**
   * ---------------------------------------------------------
   * Form submit
   *
   * Pressing Enter / browser form submission simply saves
   * a draft. The explicit buttons control the other statuses.
   * ---------------------------------------------------------
   */
  function handleFormSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    handleSubmit("DRAFT");
  }

  /**
   * ---------------------------------------------------------
   * Loading
   * ---------------------------------------------------------
   */
  if (!session) {
    return (
      <main className="min-h-screen bg-white p-8">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm text-gray-500">
            Loading editor…
          </p>
        </div>
      </main>
    );
  }

  /**
   * ---------------------------------------------------------
   * Render
   * ---------------------------------------------------------
   */
  return (
    <main className="min-h-screen bg-[#f8f8f8]">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-1 text-xs font-semibold uppercase tracking-[0.18em] text-[#d10000]">
              ArsenalTalks
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-[#111111]">
              Create Post
            </h1>

            <p className="mt-1 text-sm text-gray-500">
              Write, optimize and publish an ArsenalTalks article.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-600">
              {currentRole}
            </span>

            <Link
              href="/admin"
              className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Admin
            </Link>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Success */}
        {success && (
          <div className="mb-5 rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* Created post */}
        {createdPost?.link && (
          <div className="mb-5 rounded-xl border border-gray-200 bg-white px-4 py-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                  Created article
                </p>

                <p className="mt-1 text-sm font-medium text-gray-900">
                  Post #{createdPost.id}
                </p>
              </div>

              <a
                href={createdPost.link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm font-semibold text-[#d10000] hover:underline"
              >
                Open WordPress post →
              </a>
            </div>
          </div>
        )}

        <form
          onSubmit={
            handleFormSubmit
          }
        >
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">

            {/* =================================================
                MAIN EDITOR
                ================================================= */}
            <div className="space-y-6">

              {/* Article */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-gray-900">
                    Article
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    Enter the core article information.
                  </p>
                </div>

                {/* Title */}
                <div className="mb-5">
                  <label
                    htmlFor="title"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Title
                  </label>

                  <input
                    id="title"
                    value={title}
                    onChange={(event) =>
                      setTitle(
                        event.target.value
                      )
                    }
                    placeholder="Enter article title"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-lg font-semibold text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Slug */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="slug"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      URL Slug
                    </label>

                    {slugManuallyEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setSlugManuallyEdited(
                            false
                          );

                          setSlug(
                            slugify(
                              title
                            )
                          );
                        }}
                        className="text-xs font-semibold text-[#d10000] hover:underline"
                      >
                        Reset from title
                      </button>
                    )}
                  </div>

                  <div className="flex overflow-hidden rounded-xl border border-gray-300 bg-white">
                    <span className="flex items-center border-r border-gray-200 bg-gray-50 px-3 text-xs text-gray-500">
                      /news/
                    </span>

                    <input
                      id="slug"
                      value={slug}
                      onChange={(event) => {
                        setSlugManuallyEdited(
                          true
                        );

                        setSlug(
                          slugify(
                            event.target.value
                          )
                        );
                      }}
                      placeholder="article-slug"
                      className="min-w-0 flex-1 px-3 py-3 text-sm text-gray-900 outline-none"
                    />
                  </div>
                </div>

                {/* Excerpt */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="excerpt"
                      className="block text-sm font-semibold text-gray-800"
                    >
                      Excerpt
                    </label>

                    <span className="text-xs text-gray-400">
                      {excerpt.length}
                    </span>
                  </div>

                  <textarea
                    id="excerpt"
                    value={excerpt}
                    onChange={(event) =>
                      setExcerpt(
                        event.target.value
                      )
                    }
                    rows={4}
                    placeholder="Short summary of the article"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />
                </div>

                {/* Content */}
                <div>
                  <label
                    htmlFor="content"
                    className="mb-2 block text-sm font-semibold text-gray-800"
                  >
                    Article Content
                  </label>

                  {/* Toolbar */}
                  <div className="mb-2 flex flex-wrap gap-1 rounded-t-xl border border-b-0 border-gray-300 bg-gray-50 p-2">
                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<strong>",
                          "</strong>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      B
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<em>",
                          "</em>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs italic text-gray-700 hover:bg-white"
                    >
                      I
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<h2>",
                          "</h2>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      H2
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<h3>",
                          "</h3>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-bold text-gray-700 hover:bg-white"
                    >
                      H3
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<p>",
                          "</p>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                    >
                      P
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        insertHtml(
                          "<blockquote>",
                          "</blockquote>"
                        )
                      }
                      className="rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-white"
                    >
                      Quote
                    </button>
                  </div>

                  <textarea
                    id="content"
                    value={content}
                    onChange={(event) =>
                      setContent(
                        event.target.value
                      )
                    }
                    rows={24}
                    placeholder="<p>Start writing your article...</p>"
                    className="w-full resize-y rounded-b-xl border border-gray-300 bg-white px-4 py-4 font-mono text-sm leading-6 text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    HTML is supported.
                  </p>
                </div>
              </section>

              {/* SEO */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="text-base font-bold text-gray-900">
                      SEO
                    </h2>

                    <span className="rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-green-700">
                      Yoast
                    </span>
                  </div>

                  <p className="mt-1 text-sm text-gray-500">
                    Control the search title, meta description and focus keyphrase for this article.
                  </p>
                </div>

                {/* SEO Title */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="seoTitle"
                      className="text-sm font-semibold text-gray-800"
                    >
                      SEO Title
                    </label>

                    <span
                      className={`text-xs font-medium ${
                        titleStatus ===
                        "good"
                          ? "text-green-600"
                          : titleStatus ===
                              "long"
                            ? "text-red-600"
                            : "text-gray-400"
                      }`}
                    >
                      {titleLength}/
                      {SEO_TITLE_MAX}
                    </span>
                  </div>

                  <input
                    id="seoTitle"
                    value={seoTitle}
                    maxLength={
                      SEO_TITLE_MAX
                    }
                    onChange={(event) => {
                      setSeoTitleManuallyEdited(
                        true
                      );

                      setSeoTitle(
                        event.target.value
                      );
                    }}
                    placeholder="SEO title"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Default: article title
                    </p>

                    {seoTitleManuallyEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setSeoTitleManuallyEdited(
                            false
                          );

                          setSeoTitle(
                            title.slice(
                              0,
                              SEO_TITLE_MAX
                            )
                          );
                        }}
                        className="text-xs font-semibold text-[#d10000] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Meta Description */}
                <div className="mb-5">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="metaDescription"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Meta Description
                    </label>

                    <span
                      className={`text-xs font-medium ${
                        descriptionStatus ===
                        "good"
                          ? "text-green-600"
                          : descriptionStatus ===
                              "long"
                            ? "text-red-600"
                            : "text-gray-400"
                      }`}
                    >
                      {descriptionLength}/
                      {
                        META_DESCRIPTION_MAX
                      }
                    </span>
                  </div>

                  <textarea
                    id="metaDescription"
                    value={
                      metaDescription
                    }
                    maxLength={
                      META_DESCRIPTION_MAX
                    }
                    onChange={(event) => {
                      setMetaDescriptionManuallyEdited(
                        true
                      );

                      setMetaDescription(
                        event.target.value
                      );
                    }}
                    rows={4}
                    placeholder="Write a concise description of the article"
                    className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />

                  <div className="mt-2 flex items-center justify-between">
                    <p className="text-xs text-gray-400">
                      Defaults from the excerpt/content.
                    </p>

                    {metaDescriptionManuallyEdited && (
                      <button
                        type="button"
                        onClick={() => {
                          setMetaDescriptionManuallyEdited(
                            false
                          );

                          setMetaDescription(
                            buildDescription(
                              excerpt,
                              content
                            )
                          );
                        }}
                        className="text-xs font-semibold text-[#d10000] hover:underline"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>

                {/* Focus Keyphrase */}
                <div className="mb-7">
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="focusKeyphrase"
                      className="text-sm font-semibold text-gray-800"
                    >
                      Focus Keyphrase
                    </label>

                    <span className="text-xs text-gray-400">
                      {focusLength}/
                      {
                        FOCUS_KEYPHRASE_MAX
                      }
                    </span>
                  </div>

                  <input
                    id="focusKeyphrase"
                    value={
                      focusKeyphrase
                    }
                    maxLength={
                      FOCUS_KEYPHRASE_MAX
                    }
                    onChange={(event) =>
                      setFocusKeyphrase(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Arsenal transfer news"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 focus:border-[#d10000] focus:ring-2 focus:ring-red-100"
                  />

                  <p className="mt-2 text-xs text-gray-400">
                    Leave empty if you have not selected a target keyphrase.
                  </p>
                </div>

                {/* Google Preview */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-900">
                      Search Preview
                    </h3>

                    <span className="text-xs text-gray-400">
                      Google-style preview
                    </span>
                  </div>

                  <div className="rounded-xl border border-gray-200 bg-white p-4">
                    <div className="mb-1 truncate text-xs text-gray-500">
                      {previewUrl}
                    </div>

                    <div className="mb-1 line-clamp-2 text-lg font-medium leading-6 text-[#1a0dab]">
                      {previewTitle}
                    </div>

                    <div className="line-clamp-3 text-sm leading-5 text-gray-600">
                      {previewDescription}
                    </div>
                  </div>
                </div>

                {/* SEO Guidance */}
                <div className="mt-5 rounded-xl border border-gray-200 bg-gray-50 p-4">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wide text-gray-700">
                    Editorial SEO guidance
                  </p>

                  <ul className="space-y-1.5 text-xs leading-5 text-gray-500">
                    <li>
                      • Keep the SEO title concise and descriptive.
                    </li>

                    <li>
                      • Write a unique meta description that accurately summarizes the article.
                    </li>

                    <li>
                      • Use one specific focus keyphrase rather than several unrelated phrases.
                    </li>

                    <li>
                      • The focus keyphrase is optional and is not automatically invented by the system.
                    </li>
                  </ul>
                </div>
              </section>

              {/* Featured Image */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:p-6">
                <div className="mb-5">
                  <h2 className="text-base font-bold text-gray-900">
                    Featured Image
                  </h2>

                  <p className="mt-1 text-sm text-gray-500">
                    JPG, PNG, WebP or GIF. Maximum 10MB.
                  </p>
                </div>

                {imagePreview ? (
                  <div className="overflow-hidden rounded-xl border border-gray-200">
                    <img
                      src={imagePreview}
                      alt="Featured image preview"
                      className="max-h-[420px] w-full object-cover"
                    />

                    <div className="flex items-center justify-between border-t border-gray-200 bg-white p-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-medium text-gray-800">
                          {featuredImage?.name}
                        </p>

                        <p className="text-xs text-gray-400">
                          {featuredImage
                            ? `${(
                                featuredImage.size /
                                1024 /
                                1024
                              ).toFixed(
                                2
                              )} MB`
                            : ""}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={
                          removeImage
                        }
                        className="rounded-lg px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <label
                    htmlFor="featuredImage"
                    className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center transition hover:border-[#d10000] hover:bg-red-50"
                  >
                    <span className="mb-2 text-3xl">
                      ↑
                    </span>

                    <span className="text-sm font-semibold text-gray-700">
                      Choose featured image
                    </span>

                    <span className="mt-1 text-xs text-gray-400">
                      JPG, PNG, WebP or GIF
                    </span>

                    <input
                      id="featuredImage"
                      type="file"
                      accept="image/jpeg,image/png,image/webp,image/gif"
                      onChange={
                        handleImageChange
                      }
                      className="hidden"
                    />
                  </label>
                )}
              </section>
            </div>

            {/* =================================================
                SIDEBAR
                ================================================= */}
            <aside className="space-y-6">

              {/* Publish */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-gray-900">
                  Publish
                </h2>

                <div className="mb-4 rounded-xl bg-gray-50 p-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">
                      Role
                    </span>

                    <span className="text-xs font-bold text-gray-900">
                      {currentRole}
                    </span>
                  </div>
                </div>

                <div className="grid gap-2">

                  {/* Save Draft */}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      handleSubmit(
                        "DRAFT"
                      )
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving…"
                      : "Save Draft"}
                  </button>

                  {/* Submit for Review */}
                  <button
                    type="button"
                    disabled={saving}
                    onClick={() =>
                      handleSubmit(
                        "IN_REVIEW"
                      )
                    }
                    className="w-full rounded-xl bg-gray-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {saving
                      ? "Saving…"
                      : "Submit for Review"}
                  </button>

                  {/* Publish */}
                  {canPublish && (
                    <button
                      type="button"
                      disabled={saving}
                      onClick={() =>
                        handleSubmit(
                          "PUBLISHED"
                        )
                      }
                      className="w-full rounded-xl bg-[#d10000] px-4 py-3 text-sm font-bold text-white transition hover:bg-[#b80000] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {saving
                        ? "Publishing…"
                        : "Publish"}
                    </button>
                  )}
                </div>

                {!canPublish && (
                  <p className="mt-3 text-center text-xs leading-5 text-gray-400">
                    Writers can save drafts and submit articles for editorial review.
                  </p>
                )}
              </section>

              {/* Categories */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-1 text-base font-bold text-gray-900">
                  Categories
                </h2>

                <p className="mb-4 text-xs text-gray-500">
                  Select one or more categories.
                </p>

                <div className="space-y-2">
                  {categoryOptions.length ===
                  0 ? (
                    <p className="text-sm text-gray-400">
                      No categories available.
                    </p>
                  ) : (
                    categoryOptions.map(
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
                              toggleCategory(
                                category.id
                              )
                            }
                            className="h-4 w-4 rounded border-gray-300 accent-[#d10000]"
                          />

                          <span className="text-sm text-gray-700">
                            {
                              category.name
                            }
                          </span>
                        </label>
                      )
                    )
                  )}
                </div>
              </section>

              {/* SEO Status */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-4 text-base font-bold text-gray-900">
                  SEO Status
                </h2>

                <div className="space-y-3">
                  <SeoStatus
                    label="SEO title"
                    value={
                      titleStatus
                    }
                  />

                  <SeoStatus
                    label="Meta description"
                    value={
                      descriptionStatus
                    }
                  />

                  <SeoStatus
                    label="Focus keyphrase"
                    value={
                      focusStatus
                    }
                  />

                  <SeoStatus
                    label="Featured image"
                    value={
                      featuredImage
                        ? "good"
                        : "empty"
                    }
                  />
                </div>
              </section>

              {/* Workflow */}
              <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <h2 className="mb-3 text-base font-bold text-gray-900">
                  Workflow
                </h2>

                <div className="space-y-2 text-xs leading-5 text-gray-500">
                  <p>
                    <strong className="text-gray-700">
                      Draft
                    </strong>{" "}
                    — saved privately.
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Review
                    </strong>{" "}
                    — sent to the editorial queue.
                  </p>

                  <p>
                    <strong className="text-gray-700">
                      Published
                    </strong>{" "}
                    — made public on WordPress.
                  </p>
                </div>
              </section>
            </aside>
          </div>
        </form>
      </div>
    </main>
  );
}

/**
 * SEO status indicator.
 */
function SeoStatus({
  label,
  value,
}: {
  label: string;
  value: "good" | "long" | "empty";
}) {
  const isGood =
    value === "good";

  const isLong =
    value === "long";

  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-sm text-gray-600">
        {label}
      </span>

      <span
        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
          isGood
            ? "bg-green-50 text-green-700"
            : isLong
              ? "bg-red-50 text-red-700"
              : "bg-gray-100 text-gray-500"
        }`}
      >
        {isGood
          ? "Ready"
          : isLong
            ? "Too long"
            : "Empty"}
      </span>
    </div>
  );
}