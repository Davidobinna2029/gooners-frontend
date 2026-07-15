import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export async function buildHomepage() {
  const feed =
    await buildHomepageFeed();

  return {
    heroMain:
      feed.heroMain,

    heroSide:
      feed.heroSide,

    breaking:
      feed.breaking,

    latest:
      feed.latest,

    trending:
      feed.trending,

    all:
      feed.all,

    lastUpdated:
      new Date(),
  };
}