
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

let databaseQuotaWarningLogged = false;

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function isDatabaseQuotaError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();

  return (
    message.includes("exceeded the quota") ||
    message.includes("quota exceeded") ||
    message.includes("usage limit exceeded")
  );
}

async function safeFetch<T>(
  label: string,
  operation: () => Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isDatabaseQuotaError(error)) {
      if (!databaseQuotaWarningLogged) {
        console.warn(
          "[HOMEPAGE] Database quota exceeded. " +
            "Continuing with available fallback data. " +
            "Restore database access in the Neon Console."
        );

        databaseQuotaWarningLogged = true;
      }

      return fallback;
    }

    console.error(
      `[HOMEPAGE] ${label} failed. Using fallback.`,
      error
    );

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
  const workflows = await safeFetch(
    "Editorial workflows",
    () => prisma.workflow.findMany(),
    []
  );

  // 5. Apply available editorial overrides.
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

  // 9. Build Trending before Latest.
  const trending = buildTrending(
    ranked,
    usedPostIds
  );

  // 10. Build Latest.
  const latest = buildLatest(
    ranked,
    usedPostIds
  );

  // 11. Build the automatic homepage from WordPress posts.
  const automatic = buildHomepageLayout({
    hero,
    breaking,
    trending,
    latest,
    all: ranked,
  });

  // 12. Load the published homepage.
  // A database failure falls back to null.
  const published = await safeFetch<HomepageLayout | null>(
    "Published homepage",
    () => getPublishedHomepage(),
    null
  );

  // 13. Use the published layout when available.
  return mergePublication(automatic, published);
}
