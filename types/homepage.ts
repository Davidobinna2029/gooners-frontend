import { NormalizedPost } from "./ui";

/**
 * CORE UI CONTRACT
 * UI ONLY consumes NormalizedPost
 */

export type Post = NormalizedPost;

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