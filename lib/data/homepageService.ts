import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

import {
  getHomepageCache,
  setHomepageCache,
} from "@/lib/homepage/cache";

export async function buildHomepage() {
  /**
   * Serve valid cache immediately
   */
  const cached =
    getHomepageCache();

  if (cached) {
    console.log(
      "Serving homepage from cache."
    );

    return {
      ...cached,
      lastUpdated: new Date(),
      cached: true,
    };
  }

  console.log(
    "Building homepage..."
  );

  try {
    const feed =
      await buildHomepageFeed();

    /**
     * Save successful homepage
     */
    setHomepageCache(feed);

    return {
      ...feed,
      lastUpdated: new Date(),
      cached: false,
    };
  } catch (error) {
    console.error(
      "Homepage build failed:",
      error
    );

    /**
     * One last attempt to return cache
     */
    const fallback =
      getHomepageCache();

    if (fallback) {
      console.log(
        "Serving stale homepage cache."
      );

      return {
        ...fallback,
        lastUpdated: new Date(),
        cached: true,
        stale: true,
      };
    }

    throw error;
  }
}