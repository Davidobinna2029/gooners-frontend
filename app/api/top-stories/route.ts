import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export async function GET() {
  try {
    const feed =
      await buildHomepageFeed();

    const topStories =
      feed.trending.map(
        (post) => ({
          id: post.id,
          title: post.title,
          slug: post.slug,
          finalScore:
            post.finalScore,
          freshnessScore:
            post.freshnessScore,
          editorialScore:
            post.editorialScore,
          workflowScore:
            post.workflowScore,
          overrideScore:
            post.overrideScore,
          flags:
            post.flags ?? {},
          featuredImage:
            (post as any)
              .featuredImage ??
            null,
          publishedAt:
            (post as any)
              .publishedAt ??
            null,
        })
      );

    return Response.json({
      success: true,
      count:
        topStories.length,
      generatedAt:
        new Date().toISOString(),
      stories:
        topStories,
    });
  } catch (error) {
    console.error(
      "Top stories error:",
      error
    );

    return Response.json(
      {
        success: false,
        error:
          "Failed to generate top stories",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}