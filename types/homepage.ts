import type { CanonicalPost } from "./content";

/**
 * CORE UI CONTRACT
 * UI ONLY consumes CanonicalPost
 */

export type Post = CanonicalPost;

/**
 * Strict homepage feed structure
 */
export type HomePageFeed = Readonly<{
  hero: readonly Post[];
  trending: readonly Post[];
  editorsPicks: readonly Post[];
  transfers: readonly Post[];
  latest: readonly Post[];
}>;

/**
 * Reusable section type
 */
export type PostSection = readonly Post[];