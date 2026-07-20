import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface KeyPassChainsResult {

  home: number;

  away: number;

}



const CHAIN_EVENTS = [

  "pass",

  "successful_pass",

  "key_pass",

  "carry",

  "dribble",

  "take_on",

];



function isChainEvent(

  event: FootballEvent

): boolean {


  return CHAIN_EVENTS.includes(

    event.type

  );


}



function calculateChainValue(

  chain: FootballEvent[]

): number {


  let value = 0;



  for (const event of chain) {


    if (

      event.type === "key_pass"

    ) {

      value += 1;

    }



    else if (

      event.type === "successful_pass"

    ) {

      value += 0.25;

    }



    else if (

      event.type === "pass"

    ) {

      value += 0.15;

    }



    if (

      event.progressive

    ) {

      value += 0.25;

    }



    if (

      event.xT

    ) {

      value += event.xT;

    }



  }



  return value;


}





function getPreviousChain(

  events: FootballEvent[],

  index: number

): FootballEvent[] {


  const shot =
    events[index];


  if (

    !shot.possessionId

  ) {

    return [];

  }



  return events.filter(

    (event) =>


      event.possessionId ===
      shot.possessionId &&


      isChainEvent(event)



  );


}





export function calculateKeyPassChains(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): KeyPassChainsResult {


  let home = 0;

  let away = 0;



  events.forEach(

    (event, index) => {


      if (

        event.type !== "shot" &&

        event.type !== "shot_on_target"

      ) {

        return;

      }



      const chain =

        getPreviousChain(

          events,

          index

        );



      if (

        !chain.length

      ) {

        return;

      }



      const value =

        calculateChainValue(

          chain

        );



      if (

        event.teamId === homeTeamId

      ) {

        home += value;

      }



      else if (

        event.teamId === awayTeamId

      ) {

        away += value;

      }


    }

  );



  return {

    home:
      Number(
        home.toFixed(2)
      ),


    away:
      Number(
        away.toFixed(2)
      ),

  };


}