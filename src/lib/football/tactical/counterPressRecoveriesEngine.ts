import type {
  FootballEvent,
} from "@/src/lib/football/types";


export interface CounterPressRecoveriesResult {

  home: number;

  away: number;

}


const POSSESSION_LOSSES = [

  "blocked_shot",
  "offside",
  "foul",
  "take_on",

];


const RECOVERY_ACTIONS = [

  "recovery",
  "interception",
  "tackle",
  "duel_won",

];



function isPossessionLoss(

  event: FootballEvent

): boolean {

  return POSSESSION_LOSSES.includes(
    event.type
  );

}



function isRecovery(

  event: FootballEvent

): boolean {

  return RECOVERY_ACTIONS.includes(
    event.type
  );

}



export function calculateCounterPressRecoveries(

  events: FootballEvent[],

  homeTeamId: number,

  awayTeamId: number

): CounterPressRecoveriesResult {


  let home = 0;

  let away = 0;


  const sortedEvents =
    [...events].sort(

      (a, b) =>

        a.minute - b.minute

    );



  for (
    let i = 0;
    i < sortedEvents.length;
    i++
  ) {


    const loss =
      sortedEvents[i];



    if (
      !loss.teamId ||
      !isPossessionLoss(loss)
    ) {

      continue;

    }



    /**
     *
     * Search next actions.
     *
     * Counter press window:
     * approximately 8 seconds.
     *
     * Since event feeds usually
     * store minutes, we use the
     * same minute window.
     *
     */


    for (

      let j = i + 1;

      j < sortedEvents.length;

      j++

    ) {


      const recovery =
        sortedEvents[j];



      if (

        recovery.minute -
        loss.minute > 1

      ) {

        break;

      }



      if (

        !recovery.teamId ||
        !isRecovery(recovery)

      ) {

        continue;

      }




      if (

        recovery.teamId === loss.teamId

      ) {



        if (

          recovery.teamId === homeTeamId

        ) {

          home++;

        }


        else if (

          recovery.teamId === awayTeamId

        ) {

          away++;

        }



        break;

      }


    }


  }



  return {

    home,

    away,

  };


}