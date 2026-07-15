/**
 * ArsenalTalks Newsroom OS
 * Posts Query Builder (Core Data Contract Layer)
 *
 * This file standardizes ALL WordPress post queries
 * so ranking, personalization, dedupe, and workflow
 * systems can safely modify requests without breaking structure.
 */

export interface PostsQuery {
  perPage?: number;
  page?: number;

  category?: number;
  categories?: number[];

  exclude?: number[];
  include?: number[];

  slug?: string;
  id?: number;

  search?: string;

  orderBy?: "date" | "relevance" | "title" | "modified";
  order?: "asc" | "desc";

  sticky?: boolean;

  author?: number;

  status?: "publish" | "draft" | "private";

  before?: string; // ISO date filter
  after?: string;  // ISO date filter
}

/**
 * Converts structured query object → WordPress REST API query string
 */
export function buildPostsQuery(q: PostsQuery = {}): string {
  const params = new URLSearchParams();

  // Always embed media for newsroom UI
  params.set("_embed", "1");

  // Pagination
  if (q.perPage) params.set("per_page", String(q.perPage));
  if (q.page) params.set("page", String(q.page));

  // Category filters
  if (q.category) {
    params.set("categories", String(q.category));
  }

  if (q.categories?.length) {
    params.set("categories", q.categories.join(","));
  }

  // Include / Exclude control (critical for dedupe + overrides)
  if (q.exclude?.length) {
    params.set("exclude", q.exclude.join(","));
  }

  if (q.include?.length) {
    params.set("include", q.include.join(","));
  }

  // Identity queries
  if (q.slug) {
    params.set("slug", q.slug);
  }

  if (q.id) {
    params.set("include", String(q.id));
  }

  // Search
  if (q.search) {
    params.set("search", q.search);
  }

  // Sorting
  if (q.orderBy) {
    params.set("orderby", q.orderBy);
  }

  if (q.order) {
    params.set("order", q.order);
  }

  // Editorial / CMS features (important for Phase 2+)
  if (q.sticky !== undefined) {
    params.set("sticky", String(q.sticky));
  }

  if (q.author) {
    params.set("author", String(q.author));
  }

  if (q.status) {
    params.set("status", q.status);
  }

  // Time-based filtering (useful for trending + personalization decay)
  if (q.before) {
    params.set("before", q.before);
  }

  if (q.after) {
    params.set("after", q.after);
  }

  return `/posts?${params.toString()}`;
}