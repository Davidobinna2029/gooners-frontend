
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

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return String(error);
}

function getErrorCode(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error
  ) {
    return String((error as { code: unknown }).code);
  }

  return "";
}

function isDatabaseUnavailableError(error: unknown): boolean {
  const message = getErrorMessage(error).toLowerCase();
  const code = getErrorCode(error).toUpperCase();

  return (
    // Neon quota / usage restrictions.
    message.includes("exceeded the quota") ||
    message.includes("quota exceeded") ||
    message.includes("usage limit exceeded") ||

    // Prisma connection and initialization errors.
    error instanceof Error &&
      error.name === "PrismaClientInitializationError" ||

    // Common Prisma connection error codes.
    ["P1001", "P1002", "P1017"].includes(code) ||

    // Network-level connection failures.
    message.includes("can't reach database server") ||
    message.includes("cannot reach database server") ||
    message.includes("connection refused") ||
    message.includes("connection timed out") ||
    message.includes("connect timeout") ||
    message.includes("econnrefused") ||
    message.includes("etimedout")
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
    console.error(
      `[HOMEPAGE] ${label} failed. Using fallback.`,
      getErrorMessage(error)
    );

    return fallback;
  }
}

export type HomepageFeed = HomepageLayout;

export async function buildHomepageFeed(): Promise<HomepageFeed> {
  // Database status is local to this request.
  // A later request can reconnect if Neon becomes available.
  let databaseUnavailable = false;
  let databaseWarningLogged = false;

  async function safeDatabaseFetch<T>(
    label: string,
    operation: () => Promise<T>,
    fallback: T
  ): Promise<T> {
    if (databaseUnavailable) {
      return fallback;
    }

    try {
      return await operation();
    } catch (error) {
      if (isDatabaseUnavailableError(error)) {
        databaseUnavailable = true;

        if (!databaseWarningLogged) {
          console.warn(
            "[HOMEPAGE] Neon database is unavailable. " +
              "Continuing with WordPress content and fallback data. " +
              "Check your Neon project, endpoint and DATABASE_URL."
          );

          databaseWarningLogged = true;
        }

        return fallback;
      }

      console.error(
        `[HOMEPAGE] ${label} failed. Using fallback.`,
        getErrorMessage(error)
      );

      return fallback;
    }
  }

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
  const overrides = await safeDatabaseFetch(
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
  const workflows = await safeDatabaseFetch(
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

  // 12. Load the published homepage if Neon is available.
  const published = await safeDatabaseFetch<HomepageLayout | null>(
    "Published homepage",
    () => getPublishedHomepage(),
    null
  );

  // 13. Use the published layout when available.
  return mergePublication(automatic, published);
}
