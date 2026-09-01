import type { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
}

export default function GlassCard({
  children,
  className = "",
}: GlassCardProps) {
  return (
    <section
      className={[
        "rounded-3xl",
        "border border-gray-200/80",
        "bg-white/95",
        "backdrop-blur-sm",
        "shadow-sm",
        "transition-all duration-300",
        "hover:-translate-y-0.5",
        "hover:shadow-lg",
        "overflow-hidden",
        className,
      ].join(" ")}
    >
      {children}
    </section>
  );
}