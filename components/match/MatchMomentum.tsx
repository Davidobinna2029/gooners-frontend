"use client";

import { useMemo } from "react";

import MomentumBar
  from "@/src/design-system/football/momentum/MomentumBar";

import {
  calculateMomentum,
} from "@/src/lib/football/momentum/momentumEngine";

import {
  useLiveStore,
} from "@/src/lib/football/live/liveStore";

interface Props {
  homeTeamId: number;
  awayTeamId: number;
}

export default function MatchMomentum({
  homeTeamId,
  awayTeamId,
}: Props) {

  const events =
    useLiveStore(
      (state) => state.events
    );

  const momentum =
    useMemo(() => {

      return calculateMomentum(
        events,
        homeTeamId,
        awayTeamId
      );

    }, [
      events,
      homeTeamId,
      awayTeamId,
    ]);

  return (

    <div className="mb-6">

      <MomentumBar
        home={momentum.home}
        away={momentum.away}
      />

    </div>

  );

}