"use client";

import { useEffect, useState } from "react";

import GoalBanner from "./GoalBanner";

import type {
  AnimationEvent,
} from "./types";

interface Props {
  events: AnimationEvent[];
}

export default function CelebrationManager({
  events,
}: Props) {

  const [
    currentGoal,
    setCurrentGoal,
  ] = useState<AnimationEvent | null>(
    null
  );

  useEffect(() => {

    const goal =
      events.find(
        (event) =>
          event.type === "goal"
      );

    if (!goal) return;

    setCurrentGoal(goal);

    const timer =
      setTimeout(() => {

        setCurrentGoal(null);

      }, goal.duration ?? 3000);

    return () =>
      clearTimeout(timer);

  }, [events]);

  return (
    <>
      <GoalBanner
        visible={
          currentGoal !== null
        }
        player={
          currentGoal?.subtitle
        }
        minute={
          currentGoal?.minute
        }
      />
    </>
  );

}