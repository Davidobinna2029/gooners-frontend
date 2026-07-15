import { OverrideType, WorkflowStatus } from "@prisma/client";

export type RankingPost = {
  id: number;
  title?: string;
  publishedAt?: Date | null;
};

export type RankingWorkflow = {
  postId: number;
  status: WorkflowStatus;
};

export type RankingOverride = {
  postId: number;
  type: OverrideType;
  value?: number | null;
};

export type RankedPost = RankingPost & {
  score: number;
  breakdown: {
    freshness: number;
    workflow: number;
    overrides: number;
    total: number;
  };
};

function getWorkflowScore(
  status?: WorkflowStatus
) {
  switch (status) {
    case "PUBLISHED":
      return 100;

    case "APPROVED":
      return 70;

    case "IN_REVIEW":
      return 40;

    case "DRAFT":
      return 10;

    case "REJECTED":
      return -100;

    default:
      return 0;
  }
}

function getFreshnessScore(
  publishedAt?: Date | null
) {
  if (!publishedAt) {
    return 0;
  }

  const ageHours =
    (Date.now() -
      new Date(publishedAt).getTime()) /
    (1000 * 60 * 60);

  if (ageHours <= 1) return 100;
  if (ageHours <= 3) return 90;
  if (ageHours <= 6) return 75;
  if (ageHours <= 12) return 60;
  if (ageHours <= 24) return 45;
  if (ageHours <= 48) return 25;

  return 10;
}

function getOverrideScore(
  overrides: RankingOverride[]
) {
  let score = 0;

  for (const override of overrides) {
    switch (override.type) {
      case "PIN_TO_HERO":
        score += 1000;
        break;

      case "HERO_POSITION":
        score += 800;
        break;

      case "FORCE_BREAKING":
        score += 700;
        break;

      case "BOOST_SCORE":
        score += override.value ?? 100;
        break;

      case "BLOCK_POST":
        score -= 5000;
        break;

      case "HIDE_POST":
        score -= 10000;
        break;
    }
  }

  return score;
}

export function rankPosts(
  posts: RankingPost[],
  workflows: RankingWorkflow[],
  overrides: RankingOverride[]
): RankedPost[] {
  return posts
    .map((post) => {
      const workflow =
        workflows.find(
          (w) => w.postId === post.id
        );

      const postOverrides =
        overrides.filter(
          (o) => o.postId === post.id
        );

      const freshness =
        getFreshnessScore(
          post.publishedAt
        );

      const workflowScore =
        getWorkflowScore(
          workflow?.status
        );

      const overrideScore =
        getOverrideScore(
          postOverrides
        );

      const total =
        freshness +
        workflowScore +
        overrideScore;

      return {
        ...post,
        score: total,

        breakdown: {
          freshness,
          workflow: workflowScore,
          overrides: overrideScore,
          total,
        },
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score
    );
}