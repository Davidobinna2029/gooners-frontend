"use client";

import { useEffect, useMemo, useState } from "react";

interface Props {
  kickoff?: string;
}

function formatTime(ms: number) {
  const totalSeconds = Math.max(
    0,
    Math.floor(ms / 1000)
  );

  const days = Math.floor(
    totalSeconds / 86400
  );

  const hours = Math.floor(
    (totalSeconds % 86400) / 3600
  );

  const minutes = Math.floor(
    (totalSeconds % 3600) / 60
  );

  const seconds =
    totalSeconds % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
  };
}

export default function MatchCountdown({
  kickoff,
}: Props) {
  const kickoffDate = useMemo(() => {
    return kickoff
      ? new Date(kickoff)
      : null;
  }, [kickoff]);

  const [remaining, setRemaining] =
    useState(0);

  useEffect(() => {
    if (!kickoffDate) return;

    const update = () => {
      setRemaining(
        kickoffDate.getTime() -
          Date.now()
      );
    };

    update();

    const timer = setInterval(
      update,
      1000
    );

    return () =>
      clearInterval(timer);
  }, [kickoffDate]);

  if (!kickoffDate) return null;

  if (remaining <= 0) {
    return (
      <div className="match-countdown live">
        🔴 Match In Progress
      </div>
    );
  }

  const {
    days,
    hours,
    minutes,
    seconds,
  } = formatTime(remaining);

  return (
    <div className="match-countdown">

      <div className="countdown-title">
        Kickoff In
      </div>

      <div className="countdown-grid">

        <div className="countdown-box">
          <strong>{days}</strong>
          <span>Days</span>
        </div>

        <div className="countdown-box">
          <strong>{hours}</strong>
          <span>Hours</span>
        </div>

        <div className="countdown-box">
          <strong>{minutes}</strong>
          <span>Minutes</span>
        </div>

        <div className="countdown-box">
          <strong>{seconds}</strong>
          <span>Seconds</span>
        </div>

      </div>

    </div>
  );
}