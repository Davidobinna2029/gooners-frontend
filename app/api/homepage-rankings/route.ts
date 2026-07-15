import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const feed = await buildHomepageFeed();

    const hero = [
      ...(feed.heroMain
        ? [
            {
              slot: 1,
              postId: feed.heroMain.id,
              title: feed.heroMain.title,
              image: feed.heroMain.image ?? null,
              slug: feed.heroMain.slug,
            },
          ]
        : []),

      ...feed.heroSide.slice(0, 3).map((post, index) => ({
        slot: index + 2,
        postId: post.id,
        title: post.title,
        image: post.image ?? null,
        slug: post.slug,
      })),
    ];

    return Response.json({
      hero,

      heroMain: feed.heroMain,

      heroSide: feed.heroSide,

      breaking: feed.breaking,

      trending: feed.trending,

      latest: feed.latest,

      all: feed.all,

      stats: {
        hero: hero.length,

        breaking: feed.breaking.length,

        trending: feed.trending.length,

        latest: feed.latest.length,

        total: feed.all.length,
      },

      generatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error(error);

    return Response.json(
      {
        error: "Failed to build homepage",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}