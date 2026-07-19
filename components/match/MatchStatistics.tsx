import type {
  TeamStatistic,
} from "@/src/lib/football/types";

import {
  FootballSection,
  FootballStatBar,
} from "@/src/design-system";

import EmptyState from "@/src/design-system/ui/EmptyState";


interface Props {
  statistics?: TeamStatistic[];
}


interface StatRow {
  label: string;
  home: number;
  away: number;
}


function buildStatRows(
  statistics: TeamStatistic[]
): StatRow[] {

  const home =
    statistics.find(
      (stat) => stat.side === "home"
    );

  const away =
    statistics.find(
      (stat) => stat.side === "away"
    );


  if (!home || !away) {
    return [];
  }


  return [
    {
      label: "Possession",
      home: home.possession,
      away: away.possession,
    },

    {
      label: "Shots",
      home: home.shots,
      away: away.shots,
    },

    {
      label: "Shots On Target",
      home: home.shotsOnTarget,
      away: away.shotsOnTarget,
    },

    {
      label: "Corners",
      home: home.corners,
      away: away.corners,
    },

    {
      label: "Fouls",
      home: home.fouls,
      away: away.fouls,
    },

    {
      label: "Offsides",
      home: home.offsides,
      away: away.offsides,
    },

    {
      label: "Yellow Cards",
      home: home.yellowCards,
      away: away.yellowCards,
    },

    {
      label: "Red Cards",
      home: home.redCards,
      away: away.redCards,
    },

    {
      label: "Passes",
      home: home.passes,
      away: away.passes,
    },

    {
      label: "Pass Accuracy",
      home: home.passAccuracy,
      away: away.passAccuracy,
    },

    ...(home.expectedGoals !== undefined &&
      away.expectedGoals !== undefined
      ? [
          {
            label: "Expected Goals (xG)",
            home: home.expectedGoals,
            away: away.expectedGoals,
          },
        ]
      : []),
  ];
}


export default function MatchStatistics({
  statistics = [],
}: Props) {

  const rows =
    buildStatRows(statistics);


  if (!rows.length) {
    return (
      <FootballSection title="Match Statistics">

        <EmptyState
          title="No Statistics"
          description="Statistics are not available for this match."
        />

      </FootballSection>
    );
  }


  return (
    <FootballSection title="Match Statistics">

      <div className="space-y-5">

        {rows.map((stat) => (

          <FootballStatBar
            key={stat.label}

            label={stat.label}

            home={stat.home}

            away={stat.away}

            homeDisplay={String(stat.home)}

            awayDisplay={String(stat.away)}
          />

        ))}

      </div>

    </FootballSection>
  );
}