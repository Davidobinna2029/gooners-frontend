import type { ReactNode } from "react";

interface BadgeProps {
  children: ReactNode;
  variant?:
    | "neutral"
    | "success"
    | "danger"
    | "warning"
    | "accent";
  size?: "sm" | "md";
  className?: string;
}

export default function Badge({
  children,
  variant = "neutral",
  size = "sm",
  className = "",
}: BadgeProps) {
  const variants = {
    neutral:
      "bg-gray-100 text-gray-700 border-gray-200",

    success:
      "bg-green-100 text-green-700 border-green-200",

    danger:
      "bg-red-100 text-red-700 border-red-200",

    warning:
      "bg-yellow-100 text-yellow-800 border-yellow-200",

    accent:
      "bg-red-600 text-white border-red-600",
  };

  const sizes = {
    sm: "px-2 py-1 text-xs",
    md: "px-3 py-1.5 text-sm",
  };

  return (
    <span
      className={`inline-flex items-center justify-center rounded-full border font-semibold uppercase tracking-wide transition-colors duration-200 ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </span>
  );
}