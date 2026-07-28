// lib/football/data/loadMatchData.ts

import {
  getFixture,
  getFixtureEvents,
  getFixtureLineups,
  getFixturePlayers,
} from "./apiFootball/client";

import { mapApiFootballFixtureToNormalized } from "./apiFootball/mapMatchToNormalized";
import { mapApiFootballEventsToNormalized } from "./apiFootball/mapEventsToNormalized";
import { mapApiFootballLineupsToNormalized } from "./apiFootball/mapLineupsToNormalized";
import { mapApiFootballPlayersToNormalized } from "./apiFootball/mapPlayersToNormalized";

import type { MatchData } from "./types";

/* ==========================================================
   LOAD MATCH DATA (API-Football)

   Fetches all four endpoints needed for one match in parallel,
   then normalizes each into MatchData's provider-agnostic shape.
   Requires API_FOOTBALL_KEY to be set — see client.ts.
========================================================== */

export async function loadMatchData(
  matchId: string | number
): Promise<MatchData> {

  try {

    const fixtureId = Number(matchId);

    const [rawFixture, rawEvents, rawLineups, rawPlayersByTeam] =
      await Promise.all([
        getFixture(fixtureId),
        getFixtureEvents(fixtureId),
        getFixtureLineups(fixtureId),
        getFixturePlayers(fixtureId),
      ]);

    const match = mapApiFootballFixtureToNormalized(rawFixture);

    const events = mapApiFootballEventsToNormalized(
      rawEvents,
      match.homeTeam.id,
      match.awayTeam.id
    );

    const lineups = mapApiFootballLineupsToNormalized(
      rawLineups,
      match.homeTeam.id,
      match.awayTeam.id
    );

    const homePlayerBlock = rawPlayersByTeam.find(
      block => block.team.id === match.homeTeam.id
    );

    const awayPlayerBlock = rawPlayersByTeam.find(
      block => block.team.id === match.awayTeam.id
    );

    const players = [
      ...(homePlayerBlock
        ? mapApiFootballPlayersToNormalized(homePlayerBlock.players, "home")
        : []),
      ...(awayPlayerBlock
        ? mapApiFootballPlayersToNormalized(awayPlayerBlock.players, "away")
        : []),
    ];

    return {
      match,
      events,
      players,
      homeLineup: lineups.home,
      awayLineup: lineups.away,
      raw: {
        fixture: rawFixture,
        events: rawEvents,
        lineups: rawLineups,
        players: rawPlayersByTeam,
      },
    };

  } catch (error) {
    console.error("[loadMatchData]", error);
    throw new Error("Unable to load match data.");
  }

}