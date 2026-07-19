"use client";

import {
  useEffect,
} from "react";

import {
  startMatchPolling,
  stopMatchPolling,
  resetMatchPolling,
} from "./matchPoller";

interface Props {
  matchId: number;

  children: React.ReactNode;
}

export default function LiveMatchProvider({
  matchId,
  children,
}: Props) {

  useEffect(() => {

    startMatchPolling(matchId);

    return () => {

      stopMatchPolling();

      resetMatchPolling();

    };

  }, [matchId]);

  return <>{children}</>;

}