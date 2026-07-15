import {
  buildHomepageFeed as buildOrchestratedHomepageFeed,
} from "@/lib/orchestrator/homepage";

import type {
  HomepageLayout,
} from "@/lib/homepage/layout";

export type HomepageFeed = HomepageLayout;

export async function buildHomepageFeed(): Promise<HomepageFeed> {
  return await buildOrchestratedHomepageFeed();
}