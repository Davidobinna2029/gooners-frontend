import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export default function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl",
        "border",
        "border-gray-200",
        "bg-white",
        "shadow-sm",
        "transition-all",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}