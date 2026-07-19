import type {
  FootballEvent,
} from "@/src/lib/football/types";

export interface FormationSnapshot {

  minute: number;

  formation: string;

}

export function buildFormationTimeline(

  events: FootballEvent[],

  initialFormation = "4-3-3"

): FormationSnapshot[] {

  const timeline: FormationSnapshot[] = [

    {

      minute: 0,

      formation: initialFormation,

    },

  ];

  for (const event of events) {

    if (event.type !== "formation_change") {

      continue;

    }

    timeline.push({

      minute: event.minute,

      formation:
        event.formation ?? initialFormation,

    });

  }

  return timeline.sort(

    (a, b) => a.minute - b.minute

  );

}