import type { ReactNode } from "react";

import { Heading } from "@/src/design-system/ui";

interface FootballSectionProps {
  title: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}

export default function FootballSection({
  title,
  children,
  className = "",
  action,
}: FootballSectionProps) {
  return (
    <section className={`space-y-4 ${className}`}>
      <div className="flex items-center justify-between">
        <Heading level={2}>
          {title}
        </Heading>

        {action}
      </div>

      {children}
    </section>
  );
}