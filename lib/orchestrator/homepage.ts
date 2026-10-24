
import { prisma } from "@/lib/db/prisma";

import { getPosts } from "@/lib/api/wordpress";
import { mapWordPressPosts } from "@/lib/mappers/wordpressMapper";

import { applyOverrides } from "@/lib/editorial/overrides";

import { buildHero } from "@/lib/homepage/hero";
import { buildBreaking } from "@/lib/homepage/breaking";
import { buildTrending } from "@/lib/homepage/trending";
import { buildLatest } from "@/lib/homepage/latest";

import { getPublishedHomepage } from "@/lib/homepage/publication";
import { mergePublication } from "@/lib/homepage/mergePublication";

import {
  buildHomepageLayout,
  type HomepageLayout,
} from "@/lib/homepage/layout";

import { rankPosts } from "@/lib/engine/ranking";

async function safeFetch<T>(
  label: string,
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    console.error(`[HOMEPAGE] ${label} failed. Using fallback.`, error);
    return fallback;
  }
}

export type HomepageFeed = HomepageLayout;

export async function buildHomepageFeed(): Promise<HomepageFeed> {
  // 1. Fetch WordPress posts.
  const rawPosts = await safeFetch(
    "WordPress posts",
    () => getPosts(),
    []
  );

  // 2. Map WordPress posts to the canonical post format.
  const posts = mapWordPressPosts(
    Array.isArray(rawPosts) ? rawPosts : []
  );

  console.log("[HOMEPAGE] WordPress posts:", posts.length);

  // 3. Load active editorial overrides.
  // If Neon is unavailable, continue without overrides.
  const overrides = await safeFetch(
    "Editorial overrides",
    () =>
      prisma.override.findMany({
        where: {
          OR: [
            { expiresAt: null },
            { expiresAt: { gt: new Date() } },
          ],
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
    []
  );

  // 4. Load editorial workflows.
  // If Neon is unavailable, continue without workflow records.
  const workflows = await safeFetch(
    "Editorial workflows",
    () => prisma.workflow.findMany(),
    []
  );

  // 5. Apply any available editorial overrides.
  const overriddenPosts = applyOverrides(posts, overrides);

  // 6. Rank available posts.
  const ranked = rankPosts(
    overriddenPosts,
    workflows,
    overrides
  );

  console.log("[HOMEPAGE] Ranked posts:", ranked.length);

  // 7. Build Hero.
  const usedPostIds = new Set<number>();

  const hero = buildHero(ranked);

  for (const post of hero) {
    usedPostIds.add(post.id);
  }

  // 8. Build Breaking.
  const breaking = buildBreaking(
    ranked,
    overrides,
    usedPostIds
  );

  // 9. Build Trending before Latest to preserve section priority.
  const trending = buildTrending(
    ranked,
    usedPostIds
  );

  // 10. Build Latest from posts not already allocated.
  const latest = buildLatest(
    ranked,
    usedPostIds
  );

  // 11. Build the automatically generated homepage.
  const automatic = buildHomepageLayout({
    hero,
    breaking,
    trending,
    latest,
    all: ranked,
  });

  // 12. Load the published editorial homepage.
  // If Neon is unavailable, use the automatic homepage.
  const published = await safeFetch(
    "Published homepage",
    () => getPublishedHomepage(),
    null
  );

  // 13. Merge the editorial publication when available.
  // A null publication should leave the automatic layout intact.
  return mergePublication(
    automatic,
    published
  );
}
