import {
  getESPNLiveMatches,
  getESPNStandings,
  getESPNUCLMatches,
  getESPNNextMatch,
} from "./providers/espn";

/**
 * UNIVERSAL SPORTS API
 * APP NEVER TALKS TO ESPN DIRECTLY
 */

/**
 * LIVE MATCHES
 */
export async function getLiveMatches() {
  return getESPNLiveMatches();
}

/**
 * STANDINGS
 */
export async function getStandings() {
  return getESPNStandings();
}

/**
 * UCL MATCHES
 */
export async function getUCLMatches() {
  return getESPNUCLMatches();
}

/**
 * NEXT MATCH
 */
export async function getNextMatch() {
  return getESPNNextMatch();
}