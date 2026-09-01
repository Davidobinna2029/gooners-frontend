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
    console.error(
      "safeFetch error:",
      error
    );

    return fallback;
  }
}

export type HomepageFeed =
  HomepageLayout;

export async function buildHomepageFeed(): Promise<HomepageFeed> {

  // =======================================================
  // 1. FETCH WORDPRESS POSTS
  // =======================================================

  const rawPosts =
    await safeFetch(
      getPosts(),
      []
    );

  console.log(
    "RAW POSTS:",
    Array.isArray(rawPosts)
      ? rawPosts.length
      : 0
  );

  // =======================================================
  // 2. MAP WORDPRESS → CANONICAL POSTS
  // =======================================================

  const posts =
    mapWordPressPosts(
      Array.isArray(rawPosts)
        ? rawPosts
        : []
    );

  console.log(
    "MAPPED POSTS:",
    posts.length
  );

  // =======================================================
  // 3. LOAD ACTIVE OVERRIDES
  // =======================================================

  const overrides =
    await safeFetch(
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

  // =======================================================
  // 4. LOAD WORKFLOWS
  // =======================================================

  const workflows =
    await safeFetch(
      prisma.workflow.findMany(),
      []
    );

  console.log(
    "OVERRIDES:",
    overrides.length
  );

  console.log(
    "WORKFLOWS:",
    workflows.length
  );

  // =======================================================
  // 5. APPLY EDITORIAL OVERRIDES
  // =======================================================

  const overriddenPosts =
    applyOverrides(
      posts,
      overrides
    );

  // =======================================================
  // 6. RANK POSTS
  // =======================================================

  const ranked =
    rankPosts(
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
  // Once a post enters this Set, it cannot appear in
  // another homepage section.
  // =======================================================

  const usedPostIds =
    new Set<number>();

  // =======================================================
  // 7. HERO
  // =======================================================

  const hero =
    buildHero(ranked);

  for (const post of hero) {
    usedPostIds.add(post.id);
  }

  console.log(
    "HERO:",
    hero.map(
      (post) => post.id
    )
  );

  // =======================================================
  // 8. BREAKING
  // =======================================================

  const breaking =
    buildBreaking(
      ranked,
      overrides,
      usedPostIds
    );

  console.log(
    "BREAKING:",
    breaking.map(
      (post) => post.id
    )
  );

  // =======================================================
  // 9. LATEST
  // =======================================================

  const latest =
    buildLatest(
      ranked,
      usedPostIds
    );

  console.log(
    "LATEST:",
    latest.map(
      (post) => post.id
    )
  );

  // =======================================================
  // 10. TRENDING
  // =======================================================

  const trending =
    buildTrending(
      ranked,
      usedPostIds
    );

  console.log(
    "TRENDING:",
    trending.map(
      (post) => post.id
    )
  );

  // =======================================================
  // 11. BUILD AUTOMATIC HOMEPAGE
  // =======================================================

  const automatic =
    buildHomepageLayout({
      hero,
      breaking,
      trending,
      latest,
      all: ranked,
    });

  // =======================================================
  // 12. LOAD PUBLISHED EDITORIAL LAYOUT
  // =======================================================

  const published =
    await getPublishedHomepage();

  // =======================================================
  // 13. MERGE AUTOMATIC + EDITORIAL HOMEPAGE
  // =======================================================

  return mergePublication(
    automatic,
    published
  );
}