"use client";

import { useEffect, useState } from "react";

export function useLiveScores() {
  const [matches, setMatches] = useState<any[]>([]);

  const fetchScores = async () => {
    try {
      const res = await fetch("/api/scores");
      const data = await res.json();
      setMatches(data);
    } catch (err) {
      console.error("Live fetch error:", err);
    }
  };

  useEffect(() => {
    fetchScores();

    const interval = setInterval(() => {
      fetchScores();
    }, 30000); // every 30 seconds

    return () => clearInterval(interval);
  }, []);

  return matches;
}