import { prisma } from "@/lib/db/prisma";

import { getPublishedHomepage } from "@/lib/homepage/publication";
import { mergePublication } from "@/lib/homepage/mergePublication";

import type { HomepageFeed } from "./homepage";
import { buildHomepageFeed } from "./homepage";

/**
 * Preview Homepage Feed
 *
 * Priority:
 *
 * 1. Editing Session
 * 2. Published Homepage
 * 3. Automatic Homepage
 */
export async function buildPreviewFeed(): Promise<HomepageFeed> {
  /**
   * Automatic homepage
   */
  const automatic =
    await buildHomepageFeed();

  /**
   * Active editing session
   */
  const session =
    await prisma.homepageEditingSession.findFirst({
      where: {
        active: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });

  /**
   * If an editor is actively editing,
   * preview that layout immediately.
   */
  if (session?.layout) {
    console.log(
      "🟢 Preview using editing session."
    );

    return mergePublication(
      automatic,
      session.layout as unknown as HomepageFeed
    );
  }

  /**
   * Otherwise use the published homepage.
   */
  const published =
    await getPublishedHomepage();

  console.log(
    "🟡 Preview using published homepage."
  );

  return mergePublication(
    automatic,
    published
  );
}