import type { CanonicalPost } from "@/types/content";

export interface RankedPost extends CanonicalPost {
  finalScore: number;
  freshnessScore: number;
  editorialScore: number;
  workflowScore: number;
  overrideScore: number;
  flags?: {
    hero?: boolean;
    breaking?: boolean;
  };
}

function getAgeHours(
  date?: string
): number {
  if (!date) return 9999;

  const published =
    new Date(date).getTime();

  const now =
    Date.now();

  return (
    now - published
  ) /
    1000 /
    60 /
    60;
}

/**
 * FRESHNESS SCORE
 */
function getFreshnessScore(
  post: CanonicalPost
): number {
  const ageHours =
    getAgeHours(
      post.date
    );

  if (ageHours <= 1)
    return 100;

  if (ageHours <= 3)
    return 90;

  if (ageHours <= 6)
    return 80;

  if (ageHours <= 12)
    return 60;

  if (ageHours <= 24)
    return 40;

  if (ageHours <= 48)
    return 20;

  return 0;
}

/**
 * EDITORIAL SCORE
 */
function getEditorialScore(
  post: CanonicalPost
): number {
  let score = 0;

  if (
    post.categories?.length
  ) {
    score +=
      post.categories.length *
      3;
  }

  if (
    post.tags?.length
  ) {
    score +=
      post.tags.length;
  }

  if (post.image) {
    score += 15;
  }

  if (
    post.excerpt
  ) {
    score += 5;
  }

  return score;
}

/**
 * WORKFLOW SCORE
 */
function getWorkflowScore(
  workflow: any
): number {
  if (!workflow)
    return 0;

  switch (
    workflow.status
  ) {
    case "PUBLISHED":
      return 100;

    case "APPROVED":
      return 75;

    case "IN_REVIEW":
      return 40;

    case "DRAFT":
      return 10;

    case "REJECTED":
      return -1000;

    default:
      return 0;
  }
}

export function rankPosts(
  posts: CanonicalPost[],
  workflows: any[] = [],
  overrides: any[] = []
): RankedPost[] {
  const ranked =
    posts
      .map((post) => {
        const workflow =
          workflows.find(
            (
              item
            ) =>
              item.postId ===
              post.id
          );

        const postOverrides =
          overrides.filter(
            (
              item
            ) =>
              item.postId ===
              post.id
          );

        /**
         * BLOCK / HIDE POSTS
         */
        const blocked =
          postOverrides.some(
            (
              override
            ) =>
              override.type ===
                "BLOCK_POST" ||
              override.type ===
                "HIDE_POST"
          );

        if (
          blocked
        ) {
          return null;
        }

        const freshnessScore =
          getFreshnessScore(
            post
          );

        const editorialScore =
          getEditorialScore(
            post
          );

        const workflowScore =
          getWorkflowScore(
            workflow
          );

        let overrideScore =
          Number(
            (post as any)
              .score ?? 0
          );

        const flags: {
          hero?: boolean;
          breaking?: boolean;
        } = {};

        let finalScore =
          freshnessScore +
          editorialScore +
          workflowScore +
          overrideScore;

        /**
         * APPLY OVERRIDES
         */
        for (const override of postOverrides) {
          switch (
            override.type
          ) {
            case "BOOST_SCORE":
              finalScore +=
                Number(
                  override.value ??
                    100
                );

              overrideScore +=
                Number(
                  override.value ??
                    100
                );

              break;

            case "PIN_TO_HERO":
              finalScore +=
                10000;

              flags.hero =
                true;

              (
                post as any
              )._pinHero =
                true;

              break;

            case "HERO_POSITION":
              finalScore +=
                8000;

              flags.hero =
                true;

              (
                post as any
              )._heroPosition =
                override.value;

              break;

            case "FORCE_BREAKING":
              finalScore +=
                5000;

              flags.breaking =
                true;

              (
                post as any
              )._breaking =
                true;

              break;
          }
        }

        const rankedPost: RankedPost =
          {
            ...post,

            freshnessScore,

            editorialScore,

            workflowScore,

            overrideScore,

            finalScore,

            flags,
          };

        return rankedPost;
      })
      .filter(
        (post) =>
          post !== null
      ) as RankedPost[];

  return ranked.sort(
    (a, b) =>
      b.finalScore -
      a.finalScore
  );
}