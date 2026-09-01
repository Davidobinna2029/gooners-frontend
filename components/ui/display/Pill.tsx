import type { ReactNode } from "react";

interface PillProps {
  children: ReactNode;
  variant?:
    | "neutral"
    | "primary"
    | "success"
    | "warning"
    | "danger";
  size?: "sm" | "md";
  className?: string;
}

export default function Pill({
  children,
  variant = "neutral",
  size = "md",
  className = "",
}: PillProps) {
  const variants = {
    neutral:
      "bg-gray-100 text-gray-700 border-gray-200",

    primary:
      "bg-red-50 text-red-700 border-red-200",

    success:
      "bg-green-50 text-green-700 border-green-200",

    warning:
      "bg-yellow-50 text-yellow-700 border-yellow-200",

    danger:
      "bg-red-100 text-red-700 border-red-300",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
  };

  return (
    <span
      className={`
        inline-flex
        items-center
        justify-center
        rounded-full
        border
        font-medium
        transition-all
        duration-200
        whitespace-nowrap
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
}