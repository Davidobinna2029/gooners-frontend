import type { ReactNode } from "react";

import { Card } from "@/src/design-system/ui";

interface FootballCardProps {
  children: ReactNode;
  className?: string;
}

export default function FootballCard({
  children,
  className = "",
}: FootballCardProps) {
  return (
    <Card className={`overflow-hidden ${className}`}>
      {children}
    </Card>
  );
}