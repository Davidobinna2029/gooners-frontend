import { NormalizedPost } from "@/lib/mappers/wordpressMapper";

/**
 * SAFE STRING CHECK
 */
function safeText(value: any) {
  return typeof value === "string" ? value : "";
}

/**
 * SINGLE SOURCE OF TRUTH FEED SPLITTER (CLEAN ARCHITECTURE)
 */
export function buildHomepageFeed(posts: NormalizedPost[]) {
  if (!Array.isArray(posts) || posts.length === 0) {
    return {
      hero: [],
      breaking: [],
      trending: [],
      editors: [],
      transfer: [],
      featured: [],
    };
  }

  /**
   * STEP 1: REMOVE DUPLICATES (CRITICAL FIX)
   */
  const seen = new Set<number>();

  const unique = posts.filter((p) => {
    if (!p?.id) return false;
    if (seen.has(p.id)) return false;
    seen.add(p.id);
    return true;
  });

  /**
   * STEP 2: STRICT SLOT ALLOCATION (NO OVERLAP = NO STACKING BUG)
   * Each post belongs to ONE section only.
   */
  const hero = unique.slice(0, 1);          // SINGLE HERO ONLY
  const breaking = unique.slice(1, 6);      // 5 items max
  const trending = unique.slice(6, 14);     // 8 items
  const editors = unique.slice(14, 20);     // 6 items
  const transfer = unique.slice(20, 28);    // 8 items
  const featured = unique.slice(28, 40);    // rest

  /**
   * STEP 3: OPTIONAL FILTER SAFETY (NO TITLE CRASHES)
   */
  const transferFiltered = unique.filter((p) =>
    safeText(p.title).toLowerCase().includes("transfer")
  );

  return {
    hero,
    breaking,
    trending,
    editors,
    transfer: transferFiltered.length ? transferFiltered : transfer,
    featured,
  };
}