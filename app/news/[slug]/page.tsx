
import type { Metadata } from "next";
import { Fragment, type ReactNode } from "react";
import Image from "next/image";
import parse from "html-react-parser";
import GettyEmbed from "@/components/news/GettyEmbed";
import XEmbedEnhancer from "@/components/news/XEmbedEnhancer";
import NewsletterSignup from "@/components/news/NewsletterSignup";

import {
  getPostBySlug,
  getPosts,
} from "@/lib/api/wordpress";

import { mapWordPressPost } from "@/lib/mappers/wordpressMapper";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

import { getFeaturedImage } from "@/lib/media/getFeaturedImage";

import ArticleMeta from "@/components/news/ArticleMeta";
import ShareBar from "@/components/news/ShareBar";
import AuthorBox from "@/components/news/AuthorBox";

interface Props {
  params: Promise<{
    slug: string;
  }>;
}

const SITE_URL = "https://arsenaltalks.com";
const SITE_NAME = "ArsenalTalks";
const WORDPRESS_MEDIA_HOST = "https://api.arsenaltalks.com";

const DEFAULT_DESCRIPTION =
  "Latest Arsenal news, transfer updates, match reports, injury news and more from ArsenalTalks.";

function cleanText(value: unknown): string {
  if (typeof value !== "string") return "";

  return value.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function limitText(value: string, maxLength: number): string {
  if (value.length <= maxLength) return value;

  return `${value.slice(0, maxLength - 1).trim()}…`;
}

function removeSiteNameSuffix(value: string): string {
  return value.replace(/\s*[-|]\s*ArsenalTalks\s*$/i, "").trim();
}

/* ============================================================
   SEO
============================================================ */

function getSeoTitle(rawPost: any, fallbackTitle: string): string {
  const value =
    rawPost?.arsenaltalks_seo?.title ||
    rawPost?.meta?._yoast_wpseo_title ||
    rawPost?.yoast_head_json?.title ||
    "";

  const cleaned = cleanText(value);

  return cleaned ? removeSiteNameSuffix(cleaned) : fallbackTitle.trim();
}

function getSeoDescription(
  rawPost: any,
  fallbackExcerpt: string
): string {
  const value =
    rawPost?.arsenaltalks_seo?.description ||
    rawPost?.meta?._yoast_wpseo_metadesc ||
    rawPost?.yoast_head_json?.description ||
    "";

  const description = cleanText(value);

  if (description) return limitText(description, 160);

  const excerpt = cleanText(fallbackExcerpt);

  return excerpt ? limitText(excerpt, 160) : DEFAULT_DESCRIPTION;
}

function getFocusKeyphrase(rawPost: any): string {
  return cleanText(
    rawPost?.arsenaltalks_seo?.focuskw ||
      rawPost?.meta?._yoast_wpseo_focuskw ||
      ""
  );
}

function getArticleUrl(slug: string): string {
  return `${SITE_URL}/news/${slug}`;
}

/* ============================================================
   ARTICLE DATA
============================================================ */

function getAuthorName(rawPost: any): string {
  const author = rawPost?._embedded?.author?.[0]?.name;

  return typeof author === "string" && author.trim()
    ? author.trim()
    : SITE_NAME;
}

function getCategoryName(rawPost: any): string {
  const terms = rawPost?._embedded?.["wp:term"] || [];

  for (const group of terms) {
    if (!Array.isArray(group)) continue;

    for (const term of group) {
      if (
        term?.taxonomy === "category" &&
        typeof term?.name === "string" &&
        term.name.trim()
      ) {
        return term.name.trim();
      }
    }
  }

  return "Arsenal";
}

/* ============================================================
   WORDPRESS MEDIA URLS
============================================================ */

function normalizeWordPressMediaUrl(value: string): string {
  let url = value.trim().replace(/&(?:amp|#038);/gi, "&");

  if (!url) return "";

  if (/^(?:data:|blob:|about:|#)/i.test(url)) {
    return url;
  }

  if (url.startsWith("//")) {
    url = `https:${url}`;
  }

  if (/^\/wp-content\/uploads\//i.test(url)) {
    url = `${WORDPRESS_MEDIA_HOST}${url}`;
  }

  url = url.replace(
    /^http:\/\/api\.arsenaltalks\.com(?=\/)/i,
    WORDPRESS_MEDIA_HOST
  );

  url = url.replace(
    /^https?:\/\/(?:www\.)?arsenaltalks\.com(?=\/wp-content\/uploads\/)/i,
    WORDPRESS_MEDIA_HOST
  );

  return url;
}

function getHtmlAttribute(
  html: string,
  attribute: string
): string | null {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const expression = new RegExp(
    `(?:^|\\s)${escaped}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s>]+))`,
    "i"
  );

  const match = html.match(expression);

  return match ? (match[1] ?? match[2] ?? match[3] ?? "") : null;
}

function setHtmlAttribute(
  html: string,
  attribute: string,
  value: string
): string {
  const escaped = attribute.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

  const expression = new RegExp(
    `\\s${escaped}\\s*=\\s*(?:"[^"]*"|'[^']*'|[^\\s>]+)`,
    "i"
  );

  const safeValue = value
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");

  if (expression.test(html)) {
    return html.replace(expression, ` ${attribute}="${safeValue}"`);
  }

  return html.replace(/\s*\/?>$/, (closing) => {
    return ` ${attribute}="${safeValue}"${closing}`;
  });
}

function normalizeWordPressSrcSet(value: string): string {
  if (/data:/i.test(value)) return value;

  return value
    .split(",")
    .map((candidate) => {
      const trimmed = candidate.trim();
      if (!trimmed) return "";

      const match = trimmed.match(/^(\S+)(\s+.+)?$/);
      if (!match) return trimmed;

      return `${normalizeWordPressMediaUrl(match[1])}${match[2] || ""}`;
    })
    .filter(Boolean)
    .join(", ");
}

function isPlaceholderImage(value: string): boolean {
  const url = value.trim();

  return (
    !url ||
    /^data:image\/(?:gif|svg\+xml)/i.test(url) ||
    /(?:placeholder|spacer|loading|blank)\.(?:gif|png|svg)(?:[?#]|$)/i.test(
      url
    )
  );
}

/* ============================================================
   ARTICLE IMAGE NORMALIZATION
============================================================ */

function normalizeArticleImageTag(tag: string): string {
  const isImage = /^<img\b/i.test(tag);
  const isSource = /^<source\b/i.test(tag);

  if (!isImage && !isSource) return tag;

  let result = tag;

  // Normalize media URLs only. Preserve the original image attributes,
  // dimensions, classes, and inline styles supplied by WordPress.
  const sourceAttributes = [
    "src",
    "data-src",
    "data-lazy-src",
    "data-original",
    "data-original-src",
  ];

  const candidates = sourceAttributes
    .map((attribute) => getHtmlAttribute(result, attribute))
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0
    );

  const usableSource =
    candidates.find((value) => !isPlaceholderImage(value)) || candidates[0];

  if (usableSource) {
    const normalized = normalizeWordPressMediaUrl(usableSource);

    if (normalized) {
      result = setHtmlAttribute(result, "src", normalized);
    }
  }

  for (const attribute of ["srcset", "data-srcset", "data-lazy-srcset"]) {
    const value = getHtmlAttribute(result, attribute);

    if (value) {
      result = setHtmlAttribute(
        result,
        attribute,
        normalizeWordPressSrcSet(value)
      );
    }
  }

  return result;
}

function normalizeArticleImages(html: string): string {
  return html.replace(
    /<(?:img|source)\b[^>]*>/gi,
    (tag) => normalizeArticleImageTag(tag)
  );
}

/* ============================================================
   CONTENT CLEANING
============================================================ */

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function removeFeaturedImage(
  html: string,
  imageUrl: string
): string {
  const normalizedTarget = normalizeWordPressMediaUrl(imageUrl);

  if (!normalizedTarget) return html;

  const escapedUrl = escapeRegExp(normalizedTarget);

  let result = html.replace(
    new RegExp(
      `<img\\b(?=[^>]*\\bsrc=["']${escapedUrl}(?:[?#][^"']*)?["'])[^>]*\\/?\\s*>`,
      "gi"
    ),
    ""
  );

  result = result.replace(
    new RegExp(
      `<figure\\b[^>]*>[\\s\\S]*?<img\\b(?=[^>]*\\bsrc=["']${escapedUrl}(?:[?#][^"']*)?["'])[^>]*>[\\s\\S]*?<\\/figure>`,
      "gi"
    ),
    ""
  );

  return result;
}

/* ============================================================
   GETTY EMBED HANDLING
============================================================ */

/**
 * Only accept HTTPS iframe URLs hosted on Getty's embed domain.
 * A Getty detail-page URL is not an embed URL.
 */
function getAllowedGettyEmbedUrl(value: string): string | null {
  try {
    const url = new URL(value);

    if (
      url.protocol !== "https:" ||
      url.hostname !== "embed.gettyimages.com"
    ) {
      return null;
    }

    return url.toString();
  } catch {
    return null;
  }
}

/**
 * Preserve supported Getty embed iframes.
 * Remove third-party Getty scripts from article HTML.
 *
 * Script-based Getty embeds need a separate, official integration;
 * html-react-parser does not execute scripts from HTML strings.
 */
function removeGettyEmbeds(html: string): string {
  const scriptBodies = Array.from(
    html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi),
    (match) => match[1]
  );

  // Only consider scripts that appear to contain Getty widget settings.
  const widgetScripts = scriptBodies.filter(
    (script) =>
      /\b(?:gie|widgets\.load)\b/i.test(script) &&
      /\bid\s*:/i.test(script) &&
      /\bsig\s*:/i.test(script) &&
      /\bitems\s*:/i.test(script)
  );

  const usedScripts = new Set<number>();

  const anchorCount = (
    html.match(
      /<a\b(?=[^>]*\bclass=["'][^"]*\bgie-single\b[^"]*["'])[^>]*>[\s\S]*?<\/a\s*>/gi
    ) ?? []
  ).length;

  let anchorIndex = 0;

  let result = html.replace(
    /<a\b(?=[^>]*\bclass=["'][^"]*\bgie-single\b[^"]*["'])[^>]*>[\s\S]*?<\/a\s*>/gi,
    (anchorHtml) => {
      const currentAnchorIndex = anchorIndex++;
      const id = getHtmlAttribute(anchorHtml, "id");

      if (!id) {
        console.warn("[GETTY EMBED] Getty anchor has no ID.", {
          anchorIndex: currentAnchorIndex,
        });
        return "";
      }

      const escapedId = escapeRegExp(id);

      let scriptIndex = widgetScripts.findIndex(
        (script, index) =>
          !usedScripts.has(index) &&
          new RegExp(
            `\\bid\\s*:\\s*['"]${escapedId}['"]`,
            "i"
          ).test(script)
      );

      // Some older Getty snippets omit the matching ID from the settings.
      // Use positional matching only when there is exactly one script per anchor.
      if (
        scriptIndex < 0 &&
        widgetScripts.length === anchorCount &&
        !usedScripts.has(currentAnchorIndex)
      ) {
        scriptIndex = currentAnchorIndex;
      }

      if (scriptIndex < 0) {
        console.warn("[GETTY EMBED] No matching widget script found.", {
          id,
          anchorIndex: currentAnchorIndex,
          availableWidgetScripts: widgetScripts.length,
        });
        return "";
      }

      usedScripts.add(scriptIndex);
      const script = widgetScripts[scriptIndex];

      const getValue = (key: string, fallback = ""): string => {
        const escapedKey = escapeRegExp(key);

        const match = script.match(
          new RegExp(
            `\\b${escapedKey}\\s*:\\s*(?:"([^"]*)"|'([^']*)'|(true|false)|([\\d.]+))`,
            "i"
          )
        );

        return match
          ? match[1] ?? match[2] ?? match[3] ?? match[4] ?? fallback
          : fallback;
      };

      const sig = getValue("sig");
      const items = getValue("items");

      if (!sig || !items) {
        console.warn("[GETTY EMBED] Incomplete widget configuration.", {
          id,
          anchorIndex: currentAnchorIndex,
        });
        return "";
      }

      const attributes: Record<string, string> = {
        "data-id": id,
        "data-sig": sig,
        "data-items": items,
        "data-width": getValue("w", "594px"),
        "data-height": getValue("h", "396px"),
        "data-caption": getValue("caption", "true"),
        "data-tld": getValue("tld", "com"),
        "data-is360": getValue("is360", "false"),
      };

      const escapeAttribute = (value: string) =>
        value
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;")
          .replace(/</g, "&lt;")
          .replace(/>/g, "&gt;");

      const serializedAttributes = Object.entries(attributes)
        .map(
          ([key, value]) => `${key}="${escapeAttribute(value)}"`
        )
        .join(" ");

      return `<getty-embed ${serializedAttributes}></getty-embed>`;
    }
  );

  // Scripts in article HTML are not executed by html-react-parser. Their
  // Getty settings have now been extracted into one placeholder per anchor.
  result = result.replace(
    /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
    ""
  );

  // Preserve only secure Getty embed iframes. Leave unrelated iframes alone.
  result = result.replace(
    /<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>[\s\S]*?<\/iframe\s*>/gi,
    (iframe, src: string) => {
      if (!/gettyimages\.com/i.test(src)) return iframe;

      const allowedUrl = getAllowedGettyEmbedUrl(src);
      if (!allowedUrl) return "";

      return iframe.replace(
        /(\bsrc=["'])[^"']+(["'])/i,
        `$1${allowedUrl}$2`
      );
    }
  );

  return result;
}

/**
 * Resolve a Getty detail URL through Getty's oEmbed endpoint.
 *
 * The detail URL itself is not an image file. Getty's oEmbed response
 * supplies the signed, official iframe URL when the asset is embeddable.
 * If Getty does not return an embed, retain an ordinary link instead.
 */
async function getGettyEmbedMarkup(rawUrl: string): Promise<string | null> {
  let parsedUrl: URL;

  try {
    parsedUrl = new URL(rawUrl);
  } catch {
    return null;
  }

  if (parsedUrl.protocol !== "https:") return null;

  const isGettyDetail =
    parsedUrl.hostname === "gettyimages.com" ||
    parsedUrl.hostname === "www.gettyimages.com" ||
    parsedUrl.hostname === "gettyimages.co.uk" ||
    parsedUrl.hostname === "www.gettyimages.co.uk";

  const isGettyEmbed = parsedUrl.hostname === "embed.gettyimages.com";

  if (isGettyEmbed) {
    const embedUrl = getAllowedGettyEmbedUrl(parsedUrl.toString());
    return embedUrl ? buildGettyIframe(embedUrl) : null;
  }

  if (!isGettyDetail) return null;

  try {
    const endpoint = new URL("https://embed.gettyimages.com/oembed");

    endpoint.searchParams.set("url", parsedUrl.toString());
    endpoint.searchParams.set("caller", "arsenaltalks.com");
    endpoint.searchParams.set("format", "json");

    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: { Accept: "application/json" },
      cache: "no-store",
      signal: AbortSignal.timeout(5000),
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { html?: unknown };

    if (typeof data.html !== "string") return null;

    const iframeMatch = data.html.match(
      /<iframe\b([^>]*)\bsrc=["']([^"']+)["']([^>]*)>/i
    );

    if (!iframeMatch?.[2]) return null;

    const iframeUrl = iframeMatch[2].startsWith("//")
      ? `https:${iframeMatch[2]}`
      : iframeMatch[2];

    const allowedUrl = getAllowedGettyEmbedUrl(iframeUrl);

    // Keep Getty's original oEmbed HTML intact once its iframe host is verified.
    return allowedUrl ? data.html : null;
  } catch (error) {
    console.warn("[GETTY EMBED] Could not resolve Getty oEmbed URL", {
      url: parsedUrl.toString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return null;
  }
}

function buildGettyIframe(embedUrl: string): string {
  const safeUrl = embedUrl
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");

  // Do not impose a width, height, aspect ratio, or crop on Getty media.
  // Getty's own embed document controls its presentation.
  return `<iframe src="${safeUrl}" title="Getty Images photo" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe>`;
}

/**
 * Turn Getty shortcodes and Markdown placeholders into inline official embeds.
 * The original position in the article is preserved.
 */
async function renderGettyPlaceholderInPlace(html: string): Promise<string> {
  const pattern =
    /\[embedpress\]\s*(https?:\/\/[^\s\[]+)\s*\[\/embedpress\]|\[Embed from Getty Images\]\(\s*(https?:\/\/[^)\s]+)\s*\)/gi;

  const matches = Array.from(html.matchAll(pattern));

  if (!matches.length) return html;

  let result = html;

  // Resolve from the end so replacing an earlier match cannot shift later offsets.
  for (const match of matches.reverse()) {
    const rawUrl = (match[1] || match[2] || "").trim();
    const start = match.index ?? -1;

    if (start < 0) continue;

    const replacement = await getGettyEmbedMarkup(rawUrl);
    const original = match[0];

    const safeUrl = (() => {
      try {
        const url = new URL(rawUrl);

        if (url.protocol !== "https:") return "";

        if (
          ![
            "gettyimages.com",
            "www.gettyimages.com",
            "gettyimages.co.uk",
            "www.gettyimages.co.uk",
          ].includes(url.hostname)
        ) {
          return "";
        }

        return url.toString()
          .replace(/&/g, "&amp;")
          .replace(/"/g, "&quot;");
      } catch {
        return "";
      }
    })();

    const fallback = safeUrl
      ? `<p class="getty-link-inline my-6"><a href="${safeUrl}" target="_blank" rel="noopener noreferrer">View photo and licensing information on Getty Images ↗</a></p>`
      : "";

    result =
      result.slice(0, start) +
      (replacement || fallback) +
      result.slice(start + original.length);
  }

  return result;
}

/**
 * Prevent invalid HTML such as:
 *
 * <p>
 *   <getty-embed></getty-embed>
 * </p>
 *
 * The Getty placeholder is ultimately rendered as a DIV. A DIV cannot
 * be a child of a P element, so unwrap paragraphs containing only that
 * placeholder before html-react-parser processes the content.
 */
function unwrapGettyParagraphs(html: string): string {
  return html.replace(
    /<p\b[^>]*>\s*(<getty-embed\b[^>]*>\s*<\/getty-embed>)\s*<\/p>/gi,
    "$1"
  );
}

function cleanEmptyContent(html: string): string {
  return html
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "")
    .replace(/<div>\s*(?:&nbsp;|\s)*<\/div>/gi, "")
    .trim();
}

function logArticleImageStage(
  slug: string,
  stage: string,
  html: string
): void {
  console.info(`[ARTICLE IMAGE DEBUG] ${stage}`, {
    slug,
    imageTags: (html.match(/<img\b/gi) ?? []).length,
    figureTags: (html.match(/<figure\b/gi) ?? []).length,
    containsGetty: /gettyimages|gie-single/i.test(html),
  });
}

async function getArticleContent(
  rawPost: any,
  imageUrl: string | null
): Promise<string> {
  const rawContent = rawPost?.content?.rendered;
  const slug = String(rawPost?.slug ?? "unknown");

  let articleContent =
    typeof rawContent === "string" && rawContent.trim()
      ? rawContent
      : "<p>No content available.</p>";

  logArticleImageStage(slug, "1. RAW WORDPRESS CONTENT", articleContent);

  articleContent = normalizeArticleImages(articleContent);

  if (imageUrl) {
    articleContent = removeFeaturedImage(articleContent, imageUrl);
  }

  articleContent = removeGettyEmbeds(articleContent);
  articleContent = cleanEmptyContent(articleContent);
  articleContent = await renderGettyPlaceholderInPlace(articleContent);

  // Fix invalid paragraph nesting around Getty placeholders.
  articleContent = unwrapGettyParagraphs(articleContent);

  logArticleImageStage(slug, "2. FINAL CONTENT", articleContent);

  return articleContent || "<p>No content available.</p>";
}

/* ============================================================
   SAFE ARTICLE RECOMMENDATIONS
============================================================ */

/**
 * WordPress recommendations are optional. A failed request or a malformed
 * recommendation must never prevent the main article from rendering.
 */
async function getSafePostBySlug(slug: string): Promise<any | null> {
  try {
    return await getPostBySlug(slug);
  } catch (error) {
    console.error("[ARTICLE] Could not load WordPress article", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });

    return null;
  }
}

function isArsenalCategory(rawPost: any): boolean {
  const termGroups = rawPost?._embedded?.["wp:term"];

  if (!Array.isArray(termGroups)) return false;

  return termGroups.some(
    (group: any) =>
      Array.isArray(group) &&
      group.some(
        (term: any) =>
          term?.taxonomy === "category" &&
          (String(term?.slug ?? "").toLowerCase() === "arsenal" ||
            String(term?.name ?? "").trim().toLowerCase() === "arsenal")
      )
  );
}

async function getSafeTrendingPosts(currentSlug: string): Promise<any[]> {
  try {
    const feed = await buildHomepageFeed();
    const trending = Array.isArray(feed?.trending) ? feed.trending : [];

    return trending
      .filter(
        (item: any) =>
          item?.slug &&
          item.slug !== currentSlug &&
          typeof item.title === "string" &&
          cleanText(item.title)
      )
      .slice(0, 2);
  } catch (error) {
    console.error("[ARTICLE] Homepage Trending stories could not be loaded", {
      currentSlug,
      error: error instanceof Error ? error.message : String(error),
    });

    return [];
  }
}

async function getSafeRelatedPosts(currentSlug: string): Promise<any[]> {
  try {
    const rawPosts = await getPosts();

    if (!Array.isArray(rawPosts)) {
      console.warn("[ARTICLE] Arsenal stories response was not an array.");
      return [];
    }

    const related: any[] = [];
    const seenSlugs = new Set<string>([currentSlug]);

    // Only use posts assigned to the exact Arsenal category. Map each record
    // independently so one malformed WordPress post cannot break the page.
    for (const rawItem of rawPosts) {
      if (!rawItem || !isArsenalCategory(rawItem)) continue;

      try {
        const item = mapWordPressPost(rawItem);
        const itemSlug = String(item?.slug ?? "");

        // The mapper may omit the featured image when WordPress returns it
        // through _embedded media. Resolve it from the original REST record.
        const rawFeaturedImage = getFeaturedImage(rawItem);

        const mappedImage =
          typeof item?.image?.url === "string" ? item.image.url.trim() : "";

        const thumbnailUrl = rawFeaturedImage || mappedImage;

        if (
          itemSlug &&
          !seenSlugs.has(itemSlug) &&
          typeof item.title === "string" &&
          cleanText(item.title) &&
          thumbnailUrl
        ) {
          related.push({
            ...item,
            image: { ...(item.image ?? {}), url: thumbnailUrl },
          });

          seenSlugs.add(itemSlug);
        }
      } catch (error) {
        console.warn("[ARTICLE] Skipping an invalid Arsenal story", {
          error: error instanceof Error ? error.message : String(error),
        });
      }

      if (related.length >= 4) break;
    }

    return related;
  } catch (error) {
    console.error("[ARTICLE] Arsenal stories could not be loaded", {
      currentSlug,
      error: error instanceof Error ? error.message : String(error),
    });

    return [];
  }
}

/* ============================================================
   ARTICLE INSERTION POINTS
============================================================ */

/**
 * Place READ MORE after paragraph two, the newsletter after paragraph five,
 * and MORE ARSENAL STORIES before the second-to-last paragraph.
 * The original WordPress HTML remains unchanged.
 */
function getArticleInsertionPoints(html: string): {
  readMoreAt: number;
  newsletterAt: number;
  moreStoriesAt: number;
} {
  const paragraphs = Array.from(
    html.matchAll(/<p\b[^>]*>[\s\S]*?<\/p\s*>/gi)
  );

  const secondParagraph = paragraphs[1] ?? paragraphs[0];
  const fifthParagraph = paragraphs[4];
  const secondToLastParagraph =
    paragraphs.length >= 2
      ? paragraphs[paragraphs.length - 2]
      : paragraphs[0];

  return {
    readMoreAt: secondParagraph
      ? (secondParagraph.index ?? 0) + secondParagraph[0].length
      : 0,

    // Short articles still receive the newsletter, placed at the end.
    newsletterAt: fifthParagraph
      ? (fifthParagraph.index ?? 0) + fifthParagraph[0].length
      : html.length,

    moreStoriesAt: secondToLastParagraph?.index ?? html.length,
  };
}

/* ============================================================
   ARTICLE HTML RENDERING
============================================================ */

function renderArticleHtml(html: string) {
  return parse(html, {
    replace: (domNode: any) => {
      if (domNode?.type !== "tag" || domNode?.name !== "getty-embed") {
        return undefined;
      }

      const attrs = domNode.attribs || {};

      return (
        <div
          className="not-prose article-getty-embed my-4 block w-full max-w-full"
          style={{
            display: "block",
            width: "100%",
            maxWidth: "100%",
            minWidth: 0,
            height: "auto",
            minHeight: 0,
            marginTop: "16px",
            marginBottom: "16px",
            padding: 0,
            overflow: "visible",
          }}
        >
          <GettyEmbed
            id={attrs["data-id"] || ""}
            sig={attrs["data-sig"] || ""}
            items={attrs["data-items"] || ""}
            width={attrs["data-width"] || "594px"}
            height={attrs["data-height"] || "396px"}
            caption={attrs["data-caption"] !== "false"}
            tld={attrs["data-tld"] || "com"}
            is360={attrs["data-is360"] === "true"}
          />
        </div>
      );
    },
  });
}

/* ============================================================
   READ MORE SECTION
============================================================ */

function ReadMoreSection({ posts }: { posts: any[] }) {
  if (!posts.length) return null;

  return (
    <section
      className="my-8 border-l-4 border-red-600 bg-gray-50 px-5 py-4"
      aria-labelledby="read-more-heading"
    >
      <h2
        id="read-more-heading"
        className="mb-3 text-sm font-extrabold uppercase tracking-wider text-gray-900"
      >
        READ MORE
      </h2>

      <ul className="m-0 list-none space-y-2 p-0">
        {posts.map((story: any) => (
          <li key={story.id ?? story.slug} className="m-0">
            <a
              href={getArticleUrl(story.slug)}
              className="font-semibold text-gray-800 no-underline transition-colors hover:text-red-600"
            >
              {cleanText(story.title)}
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}

/* ============================================================
   MORE ARSENAL STORIES SECTION
============================================================ */

function MoreArsenalStoriesSection({ posts }: { posts: any[] }) {
  if (!posts.length) return null;

  return (
    <section
      className="not-prose my-9 w-full border-y border-gray-200 py-6"
      aria-labelledby="more-arsenal-stories-heading"
    >
      <div className="mb-5 flex items-center gap-3">
        <span className="h-6 w-1 rounded-full bg-red-600" />

        <h2
          id="more-arsenal-stories-heading"
          className="text-xl font-extrabold uppercase tracking-wide text-gray-950"
        >
          MORE ARSENAL STORIES
        </h2>
      </div>

      <div className="space-y-3">
        {posts.map((story: any) => {
          const imageValue =
            typeof story.image?.url === "string" ? story.image.url.trim() : "";

          const storyImage = imageValue
            ? normalizeWordPressMediaUrl(imageValue)
            : null;

          return (
            <article
              key={story.id ?? story.slug}
              className="group flex w-full items-stretch gap-0 overflow-hidden rounded-lg border border-gray-200 bg-white transition-colors hover:border-gray-300"
            >
              <a
                href={getArticleUrl(story.slug)}
                aria-label={`Read ${cleanText(story.title)}`}
                className="relative block min-h-[104px] w-28 shrink-0 self-stretch overflow-hidden bg-gray-100"
              >
                {storyImage ? (
                  <Image
                    src={storyImage}
                    alt={cleanText(story.title) || "Arsenal story"}
                    fill
                    sizes="112px"
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[104px] w-full items-center justify-center bg-gray-100 text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Arsenal
                  </div>
                )}
              </a>

              <div className="flex min-w-0 flex-1 flex-col justify-center px-3 py-3 sm:px-4">
                <span className="mb-1 text-[10px] font-extrabold uppercase tracking-[0.16em] text-red-600">
                  Arsenal News
                </span>

                <a
                  href={getArticleUrl(story.slug)}
                  className="block text-sm font-bold leading-snug text-gray-900 no-underline transition-colors hover:text-red-600 sm:text-base"
                >
                  {cleanText(story.title)}
                </a>

                <span className="mt-2 text-xs font-semibold text-gray-500">
                  Read story <span aria-hidden="true">→</span>
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ============================================================
   METADATA
============================================================ */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawPost = await getSafePostBySlug(slug);

  if (!rawPost) {
    return {
      title: "Article Not Found",
      description: "The requested article could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  let post: any;

  try {
    post = mapWordPressPost(rawPost);
  } catch (error) {
    console.error("[ARTICLE METADATA] Could not map WordPress article", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });

    return {
      title: SITE_NAME,
      description: DEFAULT_DESCRIPTION,
      robots: {
        index: false,
        follow: true,
      },
    };
  }

  const articleSlug = post.slug || slug;
  const articleUrl = getArticleUrl(articleSlug);

  const seoTitle = getSeoTitle(rawPost, post.title);
  const seoDescription = getSeoDescription(rawPost, post.excerpt || "");

  const mappedImageUrl =
    typeof post.image?.url === "string" && post.image.url.trim()
      ? post.image.url.trim()
      : null;

  const imageUrl = getFeaturedImage(rawPost) || mappedImageUrl;

  const normalizedImageUrl = imageUrl
    ? normalizeWordPressMediaUrl(imageUrl)
    : null;

  const publishedTime = post.date || undefined;
  const modifiedTime = rawPost?.modified || publishedTime;

  const authorName = getAuthorName(rawPost);
  const categoryName = getCategoryName(rawPost);
  const focusKeyphrase = getFocusKeyphrase(rawPost);

  return {
    title: seoTitle,
    description: seoDescription,
    keywords: focusKeyphrase ? [focusKeyphrase] : undefined,
    authors: [{ name: authorName }],
    creator: authorName,
    publisher: SITE_NAME,
    metadataBase: new URL(SITE_URL),

    alternates: {
      canonical: articleUrl,
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },

    openGraph: {
      type: "article",
      locale: "en_GB",
      url: articleUrl,
      siteName: SITE_NAME,
      title: seoTitle,
      description: seoDescription,
      publishedTime,
      modifiedTime,
      authors: [authorName],
      section: categoryName,

      images: normalizedImageUrl
        ? [
            {
              url: normalizedImageUrl,
              width: 1200,
              height: 675,
              alt: post.title,
            },
          ]
        : [],
    },

    twitter: {
      card: normalizedImageUrl ? "summary_large_image" : "summary",
      title: seoTitle,
      description: seoDescription,
      images: normalizedImageUrl ? [normalizedImageUrl] : undefined,
    },

    other: {
      "article:section": categoryName,
    },
  };
}

/* ============================================================
   ARTICLE PAGE
============================================================ */

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const rawPost = await getSafePostBySlug(slug);

  if (!rawPost) {
    return (
      <div className="container py-20 text-center">
        <h1 className="text-4xl font-bold">Article Not Found</h1>

        <p className="mt-4 text-gray-400">
          This article may have been removed or the URL is incorrect.
        </p>
      </div>
    );
  }

  // Map the primary article independently from optional recommendations.
  // If recommendations fail, the article continues rendering normally.
  let post: any;

  try {
    post = mapWordPressPost(rawPost);
  } catch (error) {
    console.error("[ARTICLE] Could not map WordPress article", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });

    return (
      <div className="container mx-auto max-w-3xl px-4 py-20 text-center">
        <h1 className="text-2xl font-bold">
          Article temporarily unavailable
        </h1>

        <p className="mt-4 text-gray-600">
          We could not load this article right now. Please try again shortly.
        </p>
      </div>
    );
  }

  const articleSlug = post.slug || slug;
  const articleUrl = getArticleUrl(articleSlug);

  const mappedImageUrl =
    typeof post.image?.url === "string" && post.image.url.trim()
      ? post.image.url.trim()
      : null;

  const imageUrl = getFeaturedImage(rawPost) || mappedImageUrl;

  const normalizedImageUrl = imageUrl
    ? normalizeWordPressMediaUrl(imageUrl)
    : null;

  const seoDescription = getSeoDescription(rawPost, post.excerpt || "");
  const authorName = getAuthorName(rawPost);
  const categoryName = getCategoryName(rawPost);

  const publishedTime = post.date || undefined;
  const modifiedTime = rawPost?.modified || publishedTime;

  let articleContent = "<p>Article content is temporarily unavailable.</p>";

  try {
    articleContent = await getArticleContent(rawPost, normalizedImageUrl);
  } catch (error) {
    console.error("[ARTICLE] Could not prepare article content", {
      slug,
      error: error instanceof Error ? error.message : String(error),
    });
  }

  // Both recommendation sources are optional. If either source fails, the
  // main article continues rendering normally.
  const [trendingPosts, moreArsenalStories] = await Promise.all([
    getSafeTrendingPosts(articleSlug),
    getSafeRelatedPosts(articleSlug),
  ]);

  const insertionPoints = getArticleInsertionPoints(articleContent);

  const readMoreAt = Math.max(
    0,
    Math.min(insertionPoints.readMoreAt, articleContent.length)
  );

  const newsletterAt = Math.max(
    0,
    Math.min(insertionPoints.newsletterAt, articleContent.length)
  );

  const moreStoriesAt = Math.max(
    0,
    Math.min(insertionPoints.moreStoriesAt, articleContent.length)
  );

  // Keep the three in-article modules in their natural document order.
  // Fragments provide stable keys for the mixed HTML/component array.
  const articleInsertions: Array<{
    position: number;
    key: string;
    element: ReactNode;
  }> = [
    {
      position: readMoreAt,
      key: "read-more",
      element: <ReadMoreSection posts={trendingPosts} />,
    },
    {
      position: newsletterAt,
      key: "newsletter",
      element: <NewsletterSignup />,
    },
    {
      position: moreStoriesAt,
      key: "more-arsenal-stories",
      element: <MoreArsenalStoriesSection posts={moreArsenalStories} />,
    },
  ].sort((a, b) => a.position - b.position);

  const articleParts: ReactNode[] = [];
  let contentCursor = 0;

  articleInsertions.forEach((insertion) => {
    const insertionPosition = Math.max(contentCursor, insertion.position);

    if (insertionPosition > contentCursor) {
      articleParts.push(
        <Fragment key={`article-html-${contentCursor}`}>
          {renderArticleHtml(
            articleContent.slice(contentCursor, insertionPosition)
          )}
        </Fragment>
      );
    }

    articleParts.push(
      <Fragment key={insertion.key}>{insertion.element}</Fragment>
    );

    contentCursor = insertionPosition;
  });

  if (contentCursor < articleContent.length) {
    articleParts.push(
      <Fragment key={`article-html-${contentCursor}`}>
        {renderArticleHtml(articleContent.slice(contentCursor))}
      </Fragment>
    );
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: post.title,
    description: seoDescription,
    url: articleUrl,

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl,
    },

    datePublished: publishedTime,
    dateModified: modifiedTime,

    author: {
      "@type": "Person",
      name: authorName,
    },

    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    articleSection: categoryName,

    isPartOf: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
    },

    ...(normalizedImageUrl
      ? {
          image: [
            {
              "@type": "ImageObject",
              url: normalizedImageUrl,
              width: 1200,
              height: 675,
            },
          ],
        }
      : {}),
  };

  return (
    <article className="article-page py-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(structuredData),
        }}
      />

      <div className="container mx-auto max-w-[480px] px-4 md:max-w-[800px]">
        <header className="article-header mb-8">
          <span className="article-category text-sm font-medium uppercase tracking-widest text-red-500">
            {categoryName}
          </span>

          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl lg:text-5xl">
            {post.title}
          </h1>

          <ArticleMeta date={post.date} />
        </header>

        {normalizedImageUrl && (
          <div className="article-featured-image mb-10 -mx-4 md:mx-0">
            <Image
              src={normalizedImageUrl}
              alt={post.title}
              width={1200}
              height={675}
              priority
              className="article-image h-auto w-full rounded-2xl object-cover"
            />
          </div>
        )}

        <div className="article-layout flex flex-col gap-10 lg:flex-row">
          <main className="article-main min-w-0 flex-1">
            <XEmbedEnhancer className="article-body prose prose-base max-w-none md:prose-lg">
              {articleParts}
            </XEmbedEnhancer>

            <ShareBar slug={articleSlug} title={post.title} />

            <AuthorBox />
          </main>

          <aside className="article-sidebar hidden w-full lg:block lg:w-80">
            {/* Sidebar content */}
          </aside>
        </div>
      </div>
    </article>
  );
}
