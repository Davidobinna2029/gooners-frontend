"use client";

import { useEffect, useState } from "react";

interface Props {

  visible: boolean;

  player?: string;

  minute?: number;

  homeTeam?: string;

  awayTeam?: string;

  homeScore?: number;

  awayScore?: number;

}

export default function GoalBanner({

  visible,

  player,

  minute,

  homeTeam,

  awayTeam,

  homeScore,

  awayScore,

}: Props) {

  const [
    show,
    setShow,
  ] = useState(false);

  useEffect(() => {

    if (!visible) {

      setShow(false);

      return;

    }

    setShow(true);

  }, [visible]);

  return (

    <div

      className={`
        fixed
        left-1/2
        top-6
        z-[9999]
        w-[90%]
        max-w-xl
        -translate-x-1/2
        transform
        rounded-2xl
        bg-gradient-to-r
        from-red-700
        via-red-600
        to-red-700
        shadow-2xl
        transition-all
        duration-500

        ${
          show
            ? "translate-y-0 opacity-100"
            : "-translate-y-16 opacity-0"
        }
      `}

    >

      <div className="px-8 py-6 text-center text-white">

        <div className="text-4xl font-black tracking-wide">

          ⚽ GOOOOAAALLLL!!

        </div>

        <div className="mt-3 text-2xl font-bold">

          {player}

        </div>

        <div className="mt-2 text-lg">

          {minute}'
        </div>

        <div className="mt-5 flex items-center justify-center gap-6 text-xl font-bold">

          <span>{homeTeam}</span>

          <span>

            {homeScore} - {awayScore}

          </span>

          <span>{awayTeam}</span>

        </div>

      </div>

    </div>

  );

}