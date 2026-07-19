// src/lib/football/match/getMatchCentreData.ts

import {
  createFootballRepository,
} from "@/src/lib/football/repository/createFootballRepository";


export async function getMatchCentreData(
  matchId: number,
  homeTeamId: number,
  awayTeamId: number
) {

  const repository =
    createFootballRepository();


  const safeFetch = async <T>(
    request: Promise<T>,
    fallback: T
  ): Promise<T> => {

    try {

      return await request;

    } catch (error) {

      console.error(
        "Match Centre data error:",
        error
      );

      return fallback;

    }

  };


  const [
    events,
    statistics,
    lineups,
    headToHead,
    homeInjuries,
    awayInjuries,

  ] = await Promise.all([


    safeFetch(
      repository.getEvents(matchId),
      []
    ),


    safeFetch(
      repository.getStatistics(matchId),
      []
    ),


    safeFetch(
      repository.getLineups(matchId),
      []
    ),


    safeFetch(
      repository.getHeadToHead(
        homeTeamId,
        awayTeamId
      ),
      []
    ),


    safeFetch(
      repository.getInjuries(homeTeamId),
      []
    ),


    safeFetch(
      repository.getInjuries(awayTeamId),
      []
    ),

  ]);


  return {

    events,

    statistics,

    lineups,

    headToHead,

    injuries: [
      ...homeInjuries,
      ...awayInjuries,
    ],

  };

}