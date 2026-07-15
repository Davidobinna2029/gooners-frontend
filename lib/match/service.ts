// lib/match/service.ts

import type { Match } from "./types";

/**
 * Returns the featured match for the homepage.
 *
 * Priority:
 * 1. Live Arsenal match
 * 2. Next Arsenal fixture
 * 3. Most recent Arsenal result
 */
export async function getFeaturedMatch(): Promise<Match | null> {
  try {
    // TODO:
    // Replace with your football API integration.
    //
    // Example flow:
    // - Fetch live fixtures
    // - If Arsenal is live → return it
    // - Otherwise fetch upcoming fixtures
    // - Otherwise fetch latest result

    return null;
  } catch (error) {
    console.error("[Match Service]", error);
    return null;
  }
}

/**
 * Returns all upcoming Arsenal fixtures.
 */
export async function getUpcomingFixtures(): Promise<Match[]> {
  try {
    return [];
  } catch (error) {
    console.error("[Upcoming Fixtures]", error);
    return [];
  }
}

/**
 * Returns recent Arsenal results.
 */
export async function getRecentResults(): Promise<Match[]> {
  try {
    return [];
  } catch (error) {
    console.error("[Recent Results]", error);
    return [];
  }
}