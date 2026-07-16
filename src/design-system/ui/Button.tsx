import type { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "danger" | "ghost";
}

const variants = {
  primary:
    "bg-red-600 text-white hover:bg-red-700",
  secondary:
    "bg-gray-100 text-gray-900 hover:bg-gray-200",
  danger:
    "bg-red-700 text-white hover:bg-red-800",
  ghost:
    "bg-transparent text-gray-700 hover:bg-gray-100",
};

export default function Button({
  children,
  variant = "primary",
  className = "",
  ...props
}: ButtonProps) {
  return (
    <button
      className={[
        "inline-flex",
        "items-center",
        "justify-center",
        "rounded-xl",
        "px-4",
        "py-2.5",
        "font-medium",
        "transition-colors",
        "duration-200",
        "focus:outline-none",
        "focus:ring-2",
        "focus:ring-red-500",
        "disabled:opacity-50",
        "disabled:cursor-not-allowed",
        variants[variant],
        className,
      ].join(" ")}
      {...props}
    >
      {children}
    </button>
  );
}