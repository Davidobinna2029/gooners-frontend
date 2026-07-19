"use client";

import AnimatedScore from "./AnimatedScore";

interface Props {

  homeTeam: string;

  awayTeam: string;

  homeScore: number;

  awayScore: number;

}

export default function LiveScoreboard({

  homeTeam,

  awayTeam,

  homeScore,

  awayScore,

}: Props) {

  return (

    <div
      className="
        flex
        items-center
        justify-center
        gap-6
        rounded-xl
        bg-neutral-900
        px-6
        py-4
        text-white
        shadow-lg
      "
    >

      <span className="font-semibold">

        {homeTeam}

      </span>

      <div
        className="
          flex
          items-center
          gap-2
          text-3xl
          font-black
        "
      >

        <AnimatedScore
          value={homeScore}
        />

        <span>-</span>

        <AnimatedScore
          value={awayScore}
        />

      </div>

      <span className="font-semibold">

        {awayTeam}

      </span>

    </div>

  );

}