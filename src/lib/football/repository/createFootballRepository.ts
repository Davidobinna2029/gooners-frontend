// src/lib/football/repository/createFootballRepository.ts

import type {
  FootballRepository,
} from "./footballRepository";


import {
  resolveAdvancedProvider,
} from "@/lib/football/advancedResolver";


import {
  adaptEvent,
  adaptLineup,
  adaptStatistics,
  adaptPlayer,
  adaptHeadToHead,
  adaptInjury,
} from "@/src/lib/football/adapters";



export function createFootballRepository(): FootballRepository {

  const provider =
    resolveAdvancedProvider();



  return {


    async getEvents(matchId) {

      const events =
        await provider.getEvents(matchId);


      return events.map(adaptEvent);

    },



    async getStatistics(matchId) {

      const statistics =
        await provider.getStatistics(matchId);


      return adaptStatistics(
        statistics
      );

    },



    async getLineups(matchId) {

      const lineups =
        await provider.getLineups(matchId);


      return lineups.map(
        adaptLineup
      );

    },



    async getHeadToHead(
      homeTeamId,
      awayTeamId
    ) {

      const matches =
        await provider.getHeadToHead(
          homeTeamId,
          awayTeamId
        );


      return matches.map(
        adaptHeadToHead
      );

    },



    async getInjuries(teamId) {

      const injuries =
        await provider.getInjuries(
          teamId
        );


      return injuries.map(
        adaptInjury
      );

    },



    async getPlayers(teamId) {

      const players =
        await provider.getPlayers(
          teamId
        );


      return players.map(
        adaptPlayer
      );

    },

  };

}