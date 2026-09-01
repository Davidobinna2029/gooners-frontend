import type { CSSProperties } from "react";

interface ProgressBarProps {
  value: number;
  max?: number;
  color?: "red" | "green" | "blue" | "yellow" | "gray";
  height?: "sm" | "md" | "lg";
  showValue?: boolean;
  className?: string;
}

export default function ProgressBar({
  value,
  max = 100,
  color = "red",
  height = "md",
  showValue = false,
  className = "",
}: ProgressBarProps) {
  const percentage = Math.max(
    0,
    Math.min((value / max) * 100, 100)
  );

  const colors = {
    red: "bg-red-600",
    green: "bg-green-600",
    blue: "bg-blue-600",
    yellow: "bg-yellow-500",
    gray: "bg-gray-600",
  };

  const heights = {
    sm: "h-2",
    md: "h-3",
    lg: "h-4",
  };

  return (
    <div className={`w-full ${className}`}>

      <div
        className={`
          overflow-hidden
          rounded-full
          bg-gray-200
          ${heights[height]}
        `}
      >
        <div
          className={`
            h-full
            rounded-full
            transition-all
            duration-700
            ease-out
            ${colors[color]}
          `}
          style={
            {
              width: `${percentage}%`,
            } as CSSProperties
          }
        />
      </div>

      {showValue && (
        <p className="mt-2 text-right text-sm font-medium text-gray-600">
          {value}
        </p>
      )}

    </div>
  );
}