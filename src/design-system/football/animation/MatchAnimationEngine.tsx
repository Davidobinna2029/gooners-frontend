"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  footballAnimationQueue,
} from "./animationQueue";

import CelebrationManager from "./CelebrationManager";

import BallAnimation from "./BallAnimation";
import CardAnimation from "./CardAnimation";
import GoalAnimation from "./GoalAnimation";
import SubstitutionAnimation from "./SubstitutionAnimation";

import type {
  AnimationEvent,
} from "./types";

interface Props {
  /**
   * Optional animations passed directly.
   *
   * If omitted, animations are received
   * from the global animation queue.
   */
  events?: AnimationEvent[];
}

export default function MatchAnimationEngine({
  events = [],
}: Props) {

  const [
    active,
    setActive,
  ] = useState<AnimationEvent[]>(events);

  /**
   * Listen to animation queue.
   */
  useEffect(() => {

    const unsubscribe =
      footballAnimationQueue.subscribe(
        setActive
      );

    return unsubscribe;

  }, []);

  /**
   * Remove finished animations.
   */
  useEffect(() => {

    if (!active.length) {

      return;

    }

    const timers = active.map(
      (event) =>

        setTimeout(() => {

          footballAnimationQueue.dequeue();

        }, event.duration ?? 2500)

    );

    return () => {

      timers.forEach(
        clearTimeout
      );

    };

  }, [active]);

  return (

    <>

      {/* ==========================
          GLOBAL MATCH CELEBRATIONS
         ========================== */}

      <CelebrationManager
        events={active}
      />

      {/* ==========================
          INDIVIDUAL ANIMATIONS
         ========================== */}

      {active.map((event) => {

        switch (event.type) {

          case "ball":

            return (

              <BallAnimation
                key={event.id}
                x={event.x ?? 50}
                y={event.y ?? 50}
                visible
              />

            );

          case "goal":

            return (

              <GoalAnimation
                key={event.id}
              />

            );

          case "yellow":

            return (

              <CardAnimation
                key={event.id}
                type="yellow"
              />

            );

          case "red":

            return (

              <CardAnimation
                key={event.id}
                type="red"
              />

            );

          case "substitution":

            return (

              <SubstitutionAnimation
                key={event.id}
              />

            );

          default:

            return null;

        }

      })}

    </>

  );

}