import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface GoalCreatingActionsResult {

  home: number;

  away: number;

}



const GCA_EVENTS = [

  "pass",

  "successful_pass",

  "key_pass",

  "cross",

  "carry",

  "dribble",

  "take_on",

  "recovery",

  "interception",

];



function isGoalCreatingAction(

  event: FootballEvent

): boolean {


  return GCA_EVENTS.includes(

    event.type

  );


}



function getGoalSequence(

  events: FootballEvent[],

  index: number

): FootballEvent[] {


  const goal =
    events[index];



  if (

    !goal.possessionId

  ) {

    return [];

  }



  return events.filter(

    (event) =>


      event.possessionId ===
      goal.possessionId &&


      isGoalCreatingAction(event)


  );


}



export function calculateGoalCreatingActions(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): GoalCreatingActionsResult {


  let home = 0;

  let away = 0;



  events.forEach(

    (event, index) => {


      if (

        event.type !== "goal" &&

        event.type !== "penalty_goal"

      ) {

        return;

      }



      const sequence =

        getGoalSequence(

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