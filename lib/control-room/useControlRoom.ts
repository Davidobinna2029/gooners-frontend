"use client";

import { useMemo, useState } from "react";

export default function useControlRoom(matches: any[]) {
  const safe = Array.isArray(matches) ? matches : [];

  const [activeMatchId, setActiveMatchId] = useState(
    safe?.[0]?.id || null
  );

  const activeMatch = useMemo(() => {
    return safe.find((m) => m.id === activeMatchId) || safe[0];
  }, [activeMatchId, safe]);

  return {
    matches: safe,
    activeMatch,
    activeMatchId,
    setActiveMatchId,
  };
}