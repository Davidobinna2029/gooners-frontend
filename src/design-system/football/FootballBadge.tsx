// src/design-system/football/FootballBadge.tsx

import { Badge } from "@/src/design-system/ui";

interface FootballBadgeProps {
  status: string;
}

type BadgeVariant =
  | "default"
  | "info"
  | "success"
  | "warning"
  | "danger";

const variants: Record<string, BadgeVariant> = {
  // Live
  LIVE: "danger",
  IN_PLAY: "danger",

  // Paused
  PAUSED: "warning",
  HT: "warning",

  // Finished
  FT: "default",
  FINISHED: "default",

  // Extra Time
  ET: "info",

  // Penalties
  PENS: "info",
  PENALTIES: "info",

  // Scheduled
  SCHEDULED: "info",
  TIMED: "info",

  // Delays
  POSTPONED: "warning",
  SUSPENDED: "warning",
  INTERRUPTED: "warning",

  // Cancelled
  CANCELLED: "default",
  ABANDONED: "default",
};

export default function FootballBadge({
  status,
}: FootballBadgeProps) {
  const normalizedStatus = status.toUpperCase();

  return (
    <Badge
      variant={variants[normalizedStatus] ?? "default"}
    >
      {normalizedStatus.replace(/_/g, " ")}
    </Badge>
  );
}