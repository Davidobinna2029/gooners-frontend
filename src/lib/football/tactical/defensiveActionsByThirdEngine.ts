import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface DefensiveThirdActions {

  defensiveThird: number;

  middleThird: number;

  attackingThird: number;

}


export interface DefensiveActionsByThirdResult {

  home: DefensiveThirdActions;

  away: DefensiveThirdActions;

}



const DEFENSIVE_ACTIONS = [

  "tackle",

  "interception",

  "clearance",

  "block",

  "recovery",

  "duel_won",

];



function createEmptyResult(): DefensiveThirdActions {

  return {

    defensiveThird: 0,

    middleThird: 0,

    attackingThird: 0,

  };

}



function getThird(

  x: number

):

"defensiveThird" |
"middleThird" |
"attackingThird" {


  if (x < 33) {

    return "defensiveThird";

  }


  if (x < 67) {

    return "middleThird";

  }


  return "attackingThird";

}



function isDefensiveAction(

  event: FootballEvent

): boolean {


  return DEFENSIVE_ACTIONS.includes(

    event.type

  );


}



export function calculateDefensiveActionsByThird(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): DefensiveActionsByThirdResult {



  const home =
    createEmptyResult();


  const away =
    createEmptyResult();




  for (const event of events) {


    if (

      !event.teamId ||

      event.x === undefined

    ) {

      continue;

    }



    if (

      !isDefensiveAction(event)

    ) {

      continue;

    }



    const zone =
      getThird(event.x);



    if (

      event.teamId === homeTeamId

    ) {


      home[zone]++;


    }


    else if (

      event.teamId === awayTeamId

    ) {


      away[zone]++;


    }


  }



  return {

    home,

    away,

  };


}