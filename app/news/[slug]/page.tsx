
import type { Metadata } from "next";
import Image from "next/image";
import parse from "html-react-parser";
import GettyEmbed from "@/components/news/GettyEmbed";
import XEmbedEnhancer from "@/components/news/XEmbedEnhancer";

import { getPostBySlug } from "@/lib/api/wordpress";

import { mapWordPressPost } from "@/lib/mappers/wordpressMapper";

import { getFeaturedImage } from "@/lib/media/getFeaturedImage";

import ArticleMeta from "@/components/news/ArticleMeta";
import ShareBar from "@/components/news/ShareBar";
import AuthorBox from "@/components/news/AuthorBox";
import RelatedStoryGrid from "@/components/news/RelatedStoryGrid";

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
    `(?:^|\s)${escaped}\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))`,
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
    `\s${escaped}\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)`,
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
    candidates.find((value) => !isPlaceholderImage(value)) ||
    candidates[0];

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

  if (isImage) {
    result = setHtmlAttribute(result, "loading", "lazy");
    result = setHtmlAttribute(result, "decoding", "async");

    const existingStyle = getHtmlAttribute(result, "style") || "";

    const safeStyles = existingStyle
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .filter(
        (part) =>
          !/^(?:max-width|height|display|visibility|opacity)\s*:/i.test(
            part
          )
      );

    result = setHtmlAttribute(
      result,
      "style",
      [
        ...safeStyles,
        "max-width:100%",
        "height:auto",
        "display:block",
        "visibility:visible",
        "opacity:1",
      ].join(";")
    );
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

  const targetPath = (() => {
    try {
      return new URL(normalizedTarget).pathname.toLowerCase();
    } catch {
      return normalizedTarget.split(/[?#]/)[0].toLowerCase();
    }
  })();

  const isFeaturedImageTag = (tag: string): boolean => {
    const candidates = [
      getHtmlAttribute(tag, "src"),
      getHtmlAttribute(tag, "data-src"),
      getHtmlAttribute(tag, "data-lazy-src"),
      getHtmlAttribute(tag, "data-original"),
      getHtmlAttribute(tag, "data-original-src"),
    ].filter((value): value is string => Boolean(value));

    return candidates.some((candidate) => {
      const normalized = normalizeWordPressMediaUrl(candidate);
      try {
        return new URL(normalized).pathname.toLowerCase() === targetPath;
      } catch {
        return normalized.split(/[?#]/)[0].toLowerCase() === targetPath;
      }
    });
  };

  // Remove the complete wrapper first, so a featured image does not leave
  // behind an empty figure or picture element in the article.
  let result = html.replace(
    /<(figure|picture)\b[^>]*>[\s\S]*?<\/\1\s*>/gi,
    (wrapper) =>
      /<img\b[^>]*>/i.test(wrapper) &&
      Array.from(wrapper.matchAll(/<img\b[^>]*>/gi)).some((match) =>
        isFeaturedImageTag(match[0])
      )
        ? ""
        : wrapper
  );

  // Also remove the exact featured image when WordPress has not wrapped it.
  result = result.replace(/<img\b[^>]*>/gi, (tag) =>
    isFeaturedImageTag(tag) ? "" : tag
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

  // Getty's embed configuration can be wrapped in gie(callback), and some
  // versions omit the anchor ID from the configuration object. Do not require
  // an id property just to recognise a valid widget configuration.
  const widgetScripts = scriptBodies.filter(
    (script) =>
      /(?:gie\s*\(|widgets\s*\.\s*load\s*\()/i.test(script) &&
      /\bsig\s*:/i.test(script) &&
      /\bitems\s*:/i.test(script)
  );

  const usedScripts = new Set<number>();
  let anchorIndex = 0;

  let result = html.replace(
    /<a\b(?=[^>]*\bclass=["'][^"']*\bgie-single\b[^"']*["'])[^>]*>[\s\S]*?<\/a\s*>/gi,
    (anchorHtml) => {
      const currentAnchorIndex = anchorIndex++;
      const anchorId = getHtmlAttribute(anchorHtml, "id") || "";

      const hasId = (script: string, id: string) => {
        if (!id) return false;
        const escapedId = escapeRegExp(id);
        return new RegExp(
          String.raw`\bid\s*:\s*['"]${escapedId}['"]`,
          "i"
        ).test(script);
      };

      let scriptIndex = widgetScripts.findIndex(
        (script, index) =>
          !usedScripts.has(index) && hasId(script, anchorId)
      );

      // Getty has used snippets where the config omits `id`. Pair those
      // snippets with anchors by their document order when possible.
      if (scriptIndex < 0 && widgetScripts[currentAnchorIndex] && !usedScripts.has(currentAnchorIndex)) {
        scriptIndex = currentAnchorIndex;
      }

      // If there is only one valid config and one anchor, it is unambiguous.
      if (scriptIndex < 0 && widgetScripts.length === 1 && !usedScripts.has(0)) {
        scriptIndex = 0;
      }

      if (scriptIndex < 0) {
        console.warn("[GETTY EMBED] No matching widget configuration; preserving Getty link.", {
          id: anchorId || undefined,
          anchorIndex: currentAnchorIndex,
          availableWidgetScripts: widgetScripts.length,
        });
        return anchorHtml;
      }

      usedScripts.add(scriptIndex);
      const script = widgetScripts[scriptIndex];

      const getValue = (key: string, fallback = ""): string => {
        const escapedKey = escapeRegExp(key);
        const match = script.match(
          new RegExp(
            String.raw`(?:['"])?${escapedKey}(?:['"])?\s*:\s*(?:"([^"]*)"|'([^']*)'|(true|false)|([\d.]+))`,
            "i"
          )
        );
        return match
          ? match[1] ?? match[2] ?? match[3] ?? match[4] ?? fallback
          : fallback;
      };

      const id = anchorId || getValue("id");
      const sig = getValue("sig");
      const items = getValue("items");

      if (!id || !sig || !items) {
        console.warn("[GETTY EMBED] Incomplete widget configuration; preserving Getty link.", {
          id: id || undefined,
          anchorIndex: currentAnchorIndex,
          hasSignature: Boolean(sig),
          hasItems: Boolean(items),
        });
        return anchorHtml;
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
        .map(([key, value]) => `${key}="${escapeAttribute(value)}"`)
        .join(" ");

      return `<getty-embed ${serializedAttributes}></getty-embed>`;
    }
  );

  // The widget settings have been moved into React-rendered placeholders.
  // Remove source scripts because html-react-parser does not execute them.
  result = result.replace(
    /<script\b[^>]*>[\s\S]*?<\/script\s*>/gi,
    ""
  );

  // Keep valid Getty iframes and leave unrelated iframe embeds untouched.
  result = result.replace(
    /<iframe\b[^>]*\bsrc=["']([^"']+)["'][^>]*>(?:[\s\S]*?<\/iframe\s*>)?/gi,
    (iframe, src: string) => {
      if (!/gettyimages\.com/i.test(src)) return iframe;
      const allowedUrl = getAllowedGettyEmbedUrl(src);
      if (!allowedUrl) return "";
      return iframe.replace(/(\bsrc=["'])[^"']+(["'])/i, `$1${allowedUrl}$2`);
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

    const iframeTag = iframeMatch[0];
    const iframeUrl = iframeMatch[2].startsWith("//")
      ? `https:${iframeMatch[2]}`
      : iframeMatch[2];
    const width = Number(iframeTag.match(/\bwidth=["']?(\d+)/i)?.[1]);
    const height = Number(iframeTag.match(/\bheight=["']?(\d+)/i)?.[1]);

    const allowedUrl = getAllowedGettyEmbedUrl(iframeUrl);
    return allowedUrl
      ? buildGettyIframe(
          allowedUrl,
          Number.isFinite(width) && width > 0 ? width : 594,
          Number.isFinite(height) && height > 0 ? height : 396
        )
      : null;
  } catch (error) {
    console.warn("[GETTY EMBED] Could not resolve Getty oEmbed URL", {
      url: parsedUrl.toString(),
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return null;
  }
}

function buildGettyIframe(
  embedUrl: string,
  width = 594,
  height = 396
): string {
  const safeUrl = embedUrl
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;");

  // Keep the embed at Getty's supplied dimensions on wider article columns.
  // It scales down on narrow screens without growing taller on desktop.
  const safeWidth = Number.isFinite(width) && width > 0 ? width : 594;
  const safeHeight = Number.isFinite(height) && height > 0 ? height : 396;

  return `
    <figure
      class="getty-embed"
      style="display:block;width:100%;max-width:${safeWidth}px;margin:0;padding:0;overflow:hidden;line-height:0;"
    >
      <div
        style="position:relative;display:block;width:100%;max-width:${safeWidth}px;aspect-ratio:${safeWidth}/${safeHeight};margin:0;padding:0;"
      >
        <iframe
          src="${safeUrl}"
          title="Getty Images photo"
          width="${safeWidth}"
          height="${safeHeight}"
          loading="lazy"
          allowfullscreen
          referrerpolicy="strict-origin-when-cross-origin"
          style="position:absolute;inset:0;display:block;width:100%;height:100%;margin:0;padding:0;border:0;"
        ></iframe>
      </div>
    </figure>
  `;
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
        ) return "";
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

function cleanEmptyContent(html: string): string {
  return html
    .replace(/<p>\s*(?:&nbsp;|\s)*<\/p>/gi, "")
    .replace(/<div>\s*(?:&nbsp;|\s)*<\/div>/gi, "")
    .trim();
}

function addRelatedStoryMarkers(html: string): string {
  const readMoreMarker =
    "<arsenaltalks-read-more></arsenaltalks-read-more>";
  const moreStoriesMarker =
    "<arsenaltalks-more-stories></arsenaltalks-more-stories>";

  // Always remove previously inserted markers before recalculating positions.
  const cleanHtml = html
    .replace(/<arsenaltalks-read-more\s*><\/arsenaltalks-read-more>/gi, "")
    .replace(/<arsenaltalks-more-stories\s*><\/arsenaltalks-more-stories>/gi, "");

  const paragraphClosings = Array.from(cleanHtml.matchAll(/<\/p\s*>/gi));
  const paragraphOpenings = Array.from(cleanHtml.matchAll(/<p\b[^>]*>/gi));

  const insertions: Array<{ position: number; marker: string }> = [];

  // READ MORE appears directly after paragraph four (after the featured image,
  // which is rendered separately above the article body).
  if (paragraphClosings.length >= 4) {
    const fourthParagraphEnd = paragraphClosings[3];
    insertions.push({
      position: (fourthParagraphEnd.index ?? 0) + fourthParagraphEnd[0].length,
      marker: readMoreMarker,
    });
  }

  // Put MORE ARSENAL STORIES immediately before the penultimate paragraph.
  // Six paragraphs are the minimum that allows it to follow READ MORE after
  // paragraph four while still leaving the final two paragraphs untouched.
  if (paragraphOpenings.length >= 6) {
    const penultimateParagraphStart =
      paragraphOpenings[paragraphOpenings.length - 2].index ?? -1;

    if (penultimateParagraphStart >= 0) {
      insertions.push({
        position: penultimateParagraphStart,
        marker: moreStoriesMarker,
      });
    }
  }

  // Insert from right to left so earlier HTML offsets remain valid.
  // When positions coincide, MORE ARSENAL STORIES is inserted first so
  // READ MORE remains first in the rendered document.
  insertions.sort((a, b) => {
    if (a.position !== b.position) return b.position - a.position;
    if (a.marker === moreStoriesMarker) return -1;
    if (b.marker === moreStoriesMarker) return 1;
    return 0;
  });

  let result = cleanHtml;
  for (const insertion of insertions) {
    result =
      result.slice(0, insertion.position) +
      insertion.marker +
      result.slice(insertion.position);
  }

  return result;
}

function getRelatedCategoryNames(rawPost: any): string[] {
  const terms = rawPost?._embedded?.["wp:term"];
  if (!Array.isArray(terms)) return [];

  return terms
    .flatMap((group: any) => (Array.isArray(group) ? group : []))
    .filter((term: any) => term?.taxonomy === "category")
    .map((term: any) => String(term?.name || term?.slug || "").toLowerCase())
    .filter(Boolean);
}

/**
 * Fetch raw WordPress posts directly for the related-story cards.
 *
 * The article page needs the original `_embedded.wp:featuredmedia` object.
 * Using the normal post helper here can leave the mapped post without that
 * raw media object, which means the card's conditional never renders an img.
 */
async function getLatestRelatedWordPressPosts(): Promise<any[]> {
  const endpoint = new URL(
    "/wp-json/wp/v2/posts",
    WORDPRESS_MEDIA_HOST
  );

  endpoint.searchParams.set("per_page", "40");
  endpoint.searchParams.set("_embed", "1");
  endpoint.searchParams.set("status", "publish");

  try {
    const response = await fetch(endpoint.toString(), {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!response.ok) {
      console.error("[MORE ARSENAL STORIES] WordPress request failed", {
        status: response.status,
        endpoint: endpoint.toString(),
      });
      return [];
    }

    const data: unknown = await response.json();

    if (!Array.isArray(data)) {
      console.error("[MORE ARSENAL STORIES] WordPress returned an unexpected response");
      return [];
    }

    console.info("[MORE ARSENAL STORIES] WordPress posts received", {
      count: data.length,
      postsWithFeaturedMedia: data.filter(
        (item: any) =>
          Number(item?.featured_media) > 0 ||
          Boolean(item?._embedded?.["wp:featuredmedia"]?.[0]?.source_url)
      ).length,
    });

    return data;
  } catch (error) {
    console.error("[MORE ARSENAL STORIES] Could not fetch WordPress posts", {
      error: error instanceof Error ? error.message : "Unknown error",
    });
    return [];
  }
}

async function getRelatedImageUrl(rawPost: any, mappedPost: any): Promise<string | null> {
  const media = rawPost?._embedded?.["wp:featuredmedia"]?.[0];

  // WordPress may expose the featured image in different places depending on
  // the REST response and the mapper. Check all common fields before querying
  // the media endpoint by featured_media ID.
  const candidates = [
    getFeaturedImage(rawPost),
    mappedPost?.image?.url,
    mappedPost?.image?.src,
    mappedPost?.featuredImage?.url,
    mappedPost?.featured_image_url,
    media?.media_details?.sizes?.large?.source_url,
    media?.media_details?.sizes?.medium_large?.source_url,
    media?.media_details?.sizes?.full?.source_url,
    media?.source_url,
    rawPost?.featured_image_url,
    rawPost?.featured_media_url,
    rawPost?.jetpack_featured_media_url,
  ];

  for (const candidate of candidates) {
    if (typeof candidate !== "string" || !candidate.trim()) continue;
    const normalized = normalizeWordPressMediaUrl(candidate);
    if (normalized && !isPlaceholderImage(normalized)) return normalized;
  }

  // A featured_media ID is authoritative even when _embed failed to include
  // the media object. Fetch the media record and prefer its largest available
  // source URL, falling back to source_url.
  const mediaId = Number(rawPost?.featured_media);
  if (Number.isInteger(mediaId) && mediaId > 0) {
    try {
      const response = await fetch(
        `${WORDPRESS_MEDIA_HOST}/wp-json/wp/v2/media/${mediaId}?_fields=source_url,media_details,guid`,
        { next: { revalidate: 3600 } }
      );

      if (response.ok) {
        const resolvedMedia = await response.json();
        const resolvedSizes = resolvedMedia?.media_details?.sizes;
        const resolvedCandidates = [
          resolvedSizes?.large?.source_url,
          resolvedSizes?.medium_large?.source_url,
          resolvedSizes?.full?.source_url,
          resolvedMedia?.source_url,
          resolvedMedia?.guid?.rendered,
        ];

        for (const candidate of resolvedCandidates) {
          if (typeof candidate !== "string" || !candidate.trim()) continue;
          const normalized = normalizeWordPressMediaUrl(candidate);
          if (normalized && !isPlaceholderImage(normalized)) return normalized;
        }
      } else {
        console.warn("[RELATED STORY IMAGE] WordPress media lookup failed", {
          postId: rawPost?.id,
          mediaId,
          status: response.status,
        });
      }
    } catch (error) {
      console.warn("[RELATED STORY IMAGE] Could not resolve featured media", {
        postId: rawPost?.id,
        mediaId,
        error: error instanceof Error ? error.message : "Unknown error",
      });
    }
  }

  return null;
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

  logArticleImageStage(slug, "2. FINAL CONTENT", articleContent);

  return articleContent || "<p>No content available.</p>";
}

/* ============================================================
   METADATA
============================================================ */

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { slug } = await params;
  const rawPost = await getPostBySlug(slug);

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

  const post = mapWordPressPost(rawPost);
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
  const rawPost = await getPostBySlug(slug);

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

  const rawLatest = await getLatestRelatedWordPressPosts();
  const post = mapWordPressPost(rawPost);
  const articleSlug = post.slug || slug;
  const articleUrl = getArticleUrl(articleSlug);

  // Keep the raw WordPress records alongside their mapped versions so each
  // recommendation can use the original featured-media data as an image fallback.
  const relatedCandidates = Array.isArray(rawLatest)
    ? await Promise.all(
        rawLatest.map(async (rawRelated: any) => {
          const mapped = mapWordPressPost(rawRelated);
          const relatedImageUrl = await getRelatedImageUrl(rawRelated, mapped);
          const categoryNames = [
            ...getRelatedCategoryNames(rawRelated),
            ...(Array.isArray(mapped?.categories)
              ? mapped.categories.map((category: any) =>
                  String(category?.name || category?.slug || category || "").toLowerCase()
                )
              : []),
          ];
          const isArsenalStory = categoryNames.some((name) =>
            /\b(?:arsenal|transfer news|injury news|match reports|women|opinion)\b/i.test(name)
          );
          const popularity = [
            rawRelated?.views,
            rawRelated?.view_count,
            rawRelated?.post_views_count,
            rawRelated?.arsenaltalks_views,
            rawRelated?.meta?.views,
          ].map(Number).find((value) => Number.isFinite(value) && value > 0) || 0;

          return {
            ...mapped,
            relatedImageUrl,
            isArsenalStory,
            popularity,
            categoryNames,
          };
        })
      )
    : [];

  const validRelatedCandidates = relatedCandidates.filter(
    (item: any) => item?.slug && item.slug !== articleSlug
  );

  // Prefer Arsenal coverage and, when the source exposes a view count, rank
  // more-read stories first. Otherwise preserve WordPress's newest-first order.
  const eligibleRelatedPosts = [...validRelatedCandidates].sort(
    (a: any, b: any) =>
      Number(b.isArsenalStory) - Number(a.isArsenalStory) ||
      b.popularity - a.popularity
  );

  const readMorePosts = eligibleRelatedPosts.slice(0, 2);
  const readMoreIds = new Set(readMorePosts.map((item: any) => item.id));

  // Select image-backed stories after reserving READ MORE. Filtering happens
  // before the four-card limit so stories without images cannot consume slots.
  const moreArsenalPosts = eligibleRelatedPosts
    .filter(
      (item: any) =>
        !readMoreIds.has(item.id) &&
        typeof item.relatedImageUrl === "string" &&
        item.relatedImageUrl.trim().length > 0
    )
    .slice(0, 4);

  // Temporary diagnostic: confirms which image URLs reach the related-story cards.
  console.log(
    "[MORE ARSENAL STORIES - SELECTED IMAGES]",
    moreArsenalPosts.map((item: any) => ({
      id: item.id,
      title: item.title,
      image: item.relatedImageUrl,
    }))
  );

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

  const articleContent = await getArticleContent(
    rawPost,
    normalizedImageUrl
  );

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

      <div className="container mx-auto w-full max-w-[1200px] px-4 sm:px-6 lg:px-8">
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
          <main className="article-main min-w-0 flex-1 lg:max-w-[820px]">
            <XEmbedEnhancer className="article-body prose prose-base max-w-none md:prose-lg">
              {parse(addRelatedStoryMarkers(articleContent), {
                replace: (domNode: any) => {
                  if (domNode?.type !== "tag") {
                    return undefined;
                  }

                  if (domNode.name === "arsenaltalks-read-more") {
                    return (
                      <RelatedStoryGrid
                        heading="READ MORE"
                        posts={readMorePosts}
                        variant="links"
                        getArticleUrl={getArticleUrl}
                        cleanText={cleanText}
                        normalizeImageUrl={normalizeWordPressMediaUrl}
                      />
                    );
                  }

                  if (domNode.name === "arsenaltalks-more-stories") {
                    return (
                      <RelatedStoryGrid
                        heading="MORE ARSENAL STORIES"
                        posts={moreArsenalPosts}
                        getArticleUrl={getArticleUrl}
                        cleanText={cleanText}
                        normalizeImageUrl={normalizeWordPressMediaUrl}
                      />
                    );
                  }

                  if (domNode.name !== "getty-embed") {
                    return undefined;
                  }

                  const attrs = domNode.attribs || {};

                  return (
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
                  );
                },
              })}
            </XEmbedEnhancer>

            <ShareBar slug={articleSlug} title={post.title} />

            <AuthorBox />
          </main>

          <aside className="article-sidebar hidden w-full lg:block lg:w-80 lg:shrink-0">
            {/* Sidebar content */}
          </aside>
        </div>
      </div>
    </article>
  );
}