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
  promise: Promise<T>,
  fallback: T
): Promise<T> {
  try {
    return await promise;
  } catch (error) {
    console.error("safeFetch error:", error);

    return fallback;
  }
}

export type HomepageFeed = HomepageLayout;

export async function buildHomepageFeed(): Promise<HomepageFeed> {
  // =======================================================
  // 1. FETCH WORDPRESS POSTS
  // =======================================================

  const rawPosts = await safeFetch(
    getPosts(),
    []
  );

  console.log(
    "RAW POSTS:",
    Array.isArray(rawPosts) ? rawPosts.length : 0
  );

  // =======================================================
  // 2. MAP WORDPRESS → CANONICAL POSTS
  // =======================================================

  const posts = mapWordPressPosts(
    Array.isArray(rawPosts) ? rawPosts : []
  );

  console.log(
    "MAPPED POSTS:",
    posts.length
  );

  // =======================================================
  // 3. LOAD ACTIVE EDITORIAL OVERRIDES
  // =======================================================

  const overrides = await safeFetch(
    prisma.override.findMany({
      where: {
        OR: [
          {
            expiresAt: null,
          },
          {
            expiresAt: {
              gt: new Date(),
            },
          },
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
    []
  );

  console.log(
    "OVERRIDES:",
    overrides.length
  );

  // =======================================================
  // 4. LOAD EDITORIAL WORKFLOWS
  // =======================================================

  const workflows = await safeFetch(
    prisma.workflow.findMany(),
    []
  );

  console.log(
    "WORKFLOWS:",
    workflows.length
  );

  // =======================================================
  // 5. APPLY EDITORIAL OVERRIDES
  // =======================================================

  const overriddenPosts = applyOverrides(
    posts,
    overrides
  );

  // =======================================================
  // 6. RANK POSTS
  // =======================================================

  const ranked = rankPosts(
    overriddenPosts,
    workflows,
    overrides
  );

  console.log(
    "RANKED POSTS:",
    ranked.length
  );

  // =======================================================
  // GLOBAL HOMEPAGE DEDUPLICATION REGISTRY
  //
  // A post added to this Set is reserved and cannot appear
  // in another automatically generated homepage section.
  //
  // This prevents:
  //
  // HERO → TRENDING
  // HERO → LATEST
  // BREAKING → TRENDING
  // BREAKING → LATEST
  // TRENDING → LATEST
  //
  // duplicates.
  // =======================================================

  const usedPostIds = new Set<number>();

  // =======================================================
  // 7. HERO
  // =======================================================

  const hero = buildHero(
    ranked
  );

  for (const post of hero) {
    usedPostIds.add(post.id);
  }

  console.log(
    "HERO:",
    hero.map((post) => post.id)
  );

  // =======================================================
  // 8. BREAKING
  // =======================================================

  const breaking = buildBreaking(
    ranked,
    overrides,
    usedPostIds
  );

  console.log(
    "BREAKING:",
    breaking.map((post) => post.id)
  );

  // =======================================================
  // 9. TRENDING
  //
  // IMPORTANT:
  // Trending is deliberately allocated BEFORE Latest.
  //
  // Previously Latest reserved up to 20 posts first.
  // Because the homepage fetch currently returns only a
  // relatively small number of posts, Latest could consume
  // the entire available pool and leave Trending empty.
  //
  // Trending now gets first access to posts that are not
  // already reserved by Hero or Breaking.
  // =======================================================

  const trending = buildTrending(
    ranked,
    usedPostIds
  );

  console.log(
    "TRENDING:",
    trending.map((post) => post.id)
  );

  // =======================================================
  // 10. LATEST
  //
  // Latest receives only posts that have not already been
  // used by Hero, Breaking or Trending.
  // =======================================================

  const latest = buildLatest(
    ranked,
    usedPostIds
  );

  console.log(
    "LATEST:",
    latest.map((post) => post.id)
  );

  // =======================================================
  // 11. BUILD AUTOMATIC HOMEPAGE
  // =======================================================

  const automatic = buildHomepageLayout({
    hero,
    breaking,
    trending,
    latest,
    all: ranked,
  });

  // =======================================================
  // 12. LOAD PUBLISHED EDITORIAL HOMEPAGE
  // =======================================================

  const published = await getPublishedHomepage();

  // =======================================================
  // 13. MERGE AUTOMATIC + EDITORIAL HOMEPAGE
  // =======================================================

  return mergePublication(
    automatic,
    published
  );
}