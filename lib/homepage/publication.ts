
import { prisma } from "@/lib/db/prisma";

import type { HomepageLayout } from "@/lib/homepage/layout";

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
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    const lowerMessage = message.toLowerCase();

    const quotaExceeded =
      lowerMessage.includes("exceeded the quota") ||
      lowerMessage.includes("quota exceeded") ||
      lowerMessage.includes("usage limit exceeded");

    if (quotaExceeded) {
      console.warn(
        "[HOMEPAGE] Published homepage unavailable: " +
          "database quota exceeded. Using automatic layout."
      );
    } else {
      console.error(
        "[HOMEPAGE] Failed to load published homepage.",
        error
      );
    }

    return null;
  }
}
