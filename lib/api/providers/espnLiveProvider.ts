import { fetchSafe } from "@/lib/api/core/fetcher";

/**
 * ESPN-style unofficial endpoint base
 * (this is the common public feed pattern)
 */
const ESPN_BASE =
  "https://site.web.api.espn.com/apis/v2/sports/soccer/eng.1/scoreboard";

/**
 * Fetch raw ESPN data
 */
export async function fetchESPNMatches() {
  return fetchSafe<any>(ESPN_BASE, {
    fallback: { events: [] },
  });
}