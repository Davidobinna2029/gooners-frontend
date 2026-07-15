// components/match/StatusBadge.tsx

import { getStatusLabel } from "@/lib/match/utils";
import type { Match } from "@/lib/match/types";

interface StatusBadgeProps {
  match: Match;
}

export default function StatusBadge({ match }: StatusBadgeProps) {
  const label = getStatusLabel(match);

  const styles: Record<string, string> = {
    LIVE: "bg-red-600 text-white animate-pulse",
    HT: "bg-amber-500 text-white",
    FT: "bg-slate-700 text-white",
    AET: "bg-slate-700 text-white",
    PEN: "bg-slate-700 text-white",
    NS: "bg-blue-600 text-white",
    POSTPONED: "bg-orange-600 text-white",
    CANCELLED: "bg-gray-500 text-white",
  };

  return (
    <span
      className={[
        "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide",
        styles[match.status] ?? "bg-gray-200 text-gray-800",
      ].join(" ")}
    >
      {label}
    </span>
  );
}