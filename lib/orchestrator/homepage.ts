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

import {
  rankPosts,
} from "@/lib/engine/ranking";

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
  /**
   * -------------------------------------------------------
   * FETCH WORDPRESS POSTS
   * -------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------
   * LOAD ACTIVE OVERRIDES
   * -------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------
   * LOAD WORKFLOWS
   * -------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------
   * APPLY EDITORIAL OVERRIDES
   * -------------------------------------------------------
   */

  const overriddenPosts =
    applyOverrides(
      posts,
      overrides
    );

  /**
   * -------------------------------------------------------
   * RANK POSTS
   * -------------------------------------------------------
   */

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

  /**
   * -------------------------------------------------------
   * HERO ENGINE
   * -------------------------------------------------------
   */

  const hero =
    buildHero(ranked);

  const usedPostIds =
    new Set(
      hero.map(
        (post) => post.id
      )
    );

  /**
   * -------------------------------------------------------
   * BREAKING ENGINE
   * -------------------------------------------------------
   */

  const breaking =
    buildBreaking(
      ranked,
      overrides
    );

  /**
   * -------------------------------------------------------
   * TRENDING ENGINE
   * -------------------------------------------------------
   */

  const trending =
    buildTrending(
      ranked,
      usedPostIds
    );

  /**
   * -------------------------------------------------------
   * LATEST ENGINE
   * -------------------------------------------------------
   */

  const latest =
    buildLatest(
      ranked
    );

  console.log(
    "HERO:",
    hero.map(
      (post) => post.id
    )
  );

  console.log(
    "BREAKING:",
    breaking.length
  );

  console.log(
    "TRENDING:",
    trending.length
  );

  console.log(
    "LATEST:",
    latest.length
  );

  /**
   * -------------------------------------------------------
   * BUILD AUTOMATIC HOMEPAGE
   * -------------------------------------------------------
   */

  const automatic =
    buildHomepageLayout({
      hero,
      breaking,
      trending,
      latest,
      all: ranked,
    });

  /**
   * -------------------------------------------------------
   * LOAD PUBLISHED EDITORIAL LAYOUT
   * -------------------------------------------------------
   */

  const published =
    await getPublishedHomepage();

  /**
   * -------------------------------------------------------
   * MERGE AUTOMATIC + EDITORIAL HOMEPAGE
   * -------------------------------------------------------
   */

  return mergePublication(
    automatic,
    published
  );
}