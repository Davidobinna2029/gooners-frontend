import type { CanonicalPost } from "./ingestPosts";

export type Cluster =
  | "arsenal"
  | "transfer"
  | "injury"
  | "match"
  | "other";

export function detectCluster(post: CanonicalPost): Cluster {
  const t = `${post.title} ${post.excerpt}`.toLowerCase();

  if (t.includes("injury")) return "injury";
  if (t.includes("transfer")) return "transfer";
  if (t.includes("vs") || t.includes("match")) return "match";
  if (t.includes("arsenal")) return "arsenal";

  return "other";
}

export function clusterPosts(posts: CanonicalPost[]) {
  const out: Record<Cluster, CanonicalPost[]> = {
    arsenal: [],
    transfer: [],
    injury: [],
    match: [],
    other: [],
  };

  for (const post of posts) {
    const c = detectCluster(post);
    out[c].push(post);
  }

  return out;
}