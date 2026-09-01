import type { ReactNode } from "react";

type SurfaceVariant =
  | "default"
  | "subtle"
  | "highlight";

interface SurfaceProps {
  children: ReactNode;
  variant?: SurfaceVariant;
  className?: string;
}

const variants: Record<SurfaceVariant, string> = {
  default: "bg-white",
  subtle: "bg-gray-50",
  highlight:
    "bg-gradient-to-r from-red-50 to-white",
};

export default function Surface({
  children,
  variant = "default",
  className = "",
}: SurfaceProps) {
  return (
    <div
      className={`rounded-2xl border border-gray-200 ${variants[variant]} ${className}`}
    >
      {children}
    </div>
  );
}