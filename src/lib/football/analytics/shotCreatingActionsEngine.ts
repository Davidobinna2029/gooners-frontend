import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface ShotCreatingActionsResult {

  home: number;

  away: number;

}



const SCA_EVENTS = [

  "key_pass",

  "successful_pass",

  "pass",

  "cross",

  "carry",

  "dribble",

  "take_on",

  "recovery",

  "interception",

];



function isShotCreatingAction(

  event: FootballEvent

): boolean {


  return SCA_EVENTS.includes(

    event.type

  );


}



function getShotSequence(

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


      isShotCreatingAction(event)


  );


}





export function calculateShotCreatingActions(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): ShotCreatingActionsResult {


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




      const sequence =

        getShotSequence(

          events,

          index

        );



      sequence.forEach(

        (action) => {


          if (

            action.teamId === homeTeamId

          ) {

            home++;

          }



          else if (

            action.teamId === awayTeamId

          ) {

            away++;

          }


        }

      );


    }

  );



  return {

    home,

    away,

  };


}