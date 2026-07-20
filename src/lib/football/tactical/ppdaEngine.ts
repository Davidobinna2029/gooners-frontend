import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface PPDAResult {

  home: number;

  away: number;

}


const DEFENSIVE_ACTIONS = [

  "tackle",
  "interception",
  "foul",
  "block",
  "duel_won",
  "recovery",

];



function countOpponentPasses(

  events: FootballEvent[],

  teamId: number

): number {


  return events.filter(

    (event) =>

      event.teamId === teamId &&

      (
        event.type === "pass" ||
        event.type === "successful_pass"
      )

  ).length;


}




function countDefensiveActions(

  events: FootballEvent[],

  teamId: number

): number {


  return events.filter(

    (event) =>

      event.teamId === teamId &&

      DEFENSIVE_ACTIONS.includes(
        event.type
      )

  ).length;


}





export function calculatePPDA(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): PPDAResult {


  /**
   *
   * PPDA =
   *
   * Opponent Passes Allowed
   * ------------------------
   * Defensive Actions
   *
   */


  const homeDefensiveActions =
    countDefensiveActions(
      events,
      homeTeamId
    );


  const awayDefensiveActions =
    countDefensiveActions(
      events,
      awayTeamId
    );



  const homeOpponentPasses =
    countOpponentPasses(
      events,
      awayTeamId
    );



  const awayOpponentPasses =
    countOpponentPasses(
      events,
      homeTeamId
    );



  return {


    home:
      homeDefensiveActions === 0
        ? 0
        : Number(
            (
              homeOpponentPasses /
              homeDefensiveActions
            ).toFixed(2)
          ),



    away:
      awayDefensiveActions === 0
        ? 0
        : Number(
            (
              awayOpponentPasses /
              awayDefensiveActions
            ).toFixed(2)
          ),


  };


}