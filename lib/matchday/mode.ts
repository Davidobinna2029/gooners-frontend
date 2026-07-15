export enum HomepageMode {
  NORMAL = "NORMAL",

  MATCHDAY_PRE = "MATCHDAY_PRE",

  LIVE_MATCH = "LIVE_MATCH",

  HALF_TIME = "HALF_TIME",

  FULL_TIME = "FULL_TIME",

  POST_MATCH = "POST_MATCH",

  TRANSFER_DEADLINE = "TRANSFER_DEADLINE",

  BREAKING_NEWS = "BREAKING_NEWS",
}

export interface MatchContext {
  hasMatchToday: boolean;

  isLive: boolean;

  isHalfTime: boolean;

  isFullTime: boolean;

  kickoff?: Date | null;

  finalWhistle?: Date | null;

  transferDeadline?: boolean;

  breakingNews?: boolean;
}

/**
 * Determines which homepage mode should be active.
 *
 * This is the central decision engine for ArsenalTalks.
 *
 * Future integrations:
 * - Fixtures API
 * - Live Scores API
 * - Editorial Overrides
 * - Manual Matchday Switch
 */
export function determineHomepageMode(
  context: MatchContext
): HomepageMode {
  if (context.breakingNews) {
    return HomepageMode.BREAKING_NEWS;
  }

  if (context.transferDeadline) {
    return HomepageMode.TRANSFER_DEADLINE;
  }

  if (context.isHalfTime) {
    return HomepageMode.HALF_TIME;
  }

  if (context.isLive) {
    return HomepageMode.LIVE_MATCH;
  }

  if (context.isFullTime) {
    return HomepageMode.FULL_TIME;
  }

  if (context.hasMatchToday) {
    return HomepageMode.MATCHDAY_PRE;
  }

  return HomepageMode.NORMAL;
}

/**
 * Temporary placeholder.
 *
 * Later this will read:
 * - Fixtures API
 * - Live Match API
 * - Editorial overrides
 *
 * and return the real match context.
 */
export async function getMatchContext(): Promise<MatchContext> {
  return {
    hasMatchToday: false,

    isLive: false,

    isHalfTime: false,

    isFullTime: false,

    kickoff: null,

    finalWhistle: null,

    transferDeadline: false,

    breakingNews: false,
  };
}