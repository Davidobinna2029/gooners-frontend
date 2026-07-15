import {
  getNextMatch,
  getFixtures,
  getResults,
  getStandings,
} from "../index";

import {
  fetchTeamOverview,
} from "../repositories/teamRepository";

import type {
  FootballDashboard,
} from "../models/footballDashboard";

const TEAM_ID = 57;

export async function buildFootballDashboard():
Promise<FootballDashboard> {
  const [
    nextMatch,
    fixtures,
    results,
    standings,
    team,
  ] = await Promise.all([
    getNextMatch(),
    getFixtures(),
    getResults(),
    getStandings(),
    fetchTeamOverview(TEAM_ID),
  ]);

  return {
    nextMatch,
    fixtures,
    results,
    standings,
    team,
  };
}