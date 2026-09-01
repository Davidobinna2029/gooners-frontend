import type { HTMLAttributes } from "react";

interface DividerProps extends HTMLAttributes<HTMLHRElement> {
  spacing?: "none" | "sm" | "md" | "lg";
}

export default function Divider({
  spacing = "md",
  className = "",
  ...props
}: DividerProps) {
  const spacingClasses = {
    none: "",
    sm: "my-2",
    md: "my-4",
    lg: "my-6",
  };

  return (
    <hr
      className={`border-0 border-t border-gray-200 ${spacingClasses[spacing]} ${className}`}
      {...props}
    />
  );
}