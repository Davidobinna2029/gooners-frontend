import { prisma } from "@/lib/db/prisma";

import type {
  HomepageLayout,
} from "@/lib/homepage/layout";

export async function getPublishedHomepage(): Promise<HomepageLayout | null> {
  try {
    const publication =
      await prisma.homepagePublication.findFirst({
        orderBy: {
          publishedAt: "desc",
        },
      });

    if (!publication) {
      return null;
    }

    return publication.layout as unknown as HomepageLayout;
  } catch (error) {
    console.error(
      "Failed to load published homepage:",
      error
    );

    return null;
  }
}