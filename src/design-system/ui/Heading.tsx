import type { ReactNode, ElementType } from "react";

interface HeadingProps {
  children: ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  className?: string;
}

export default function Heading({
  children,
  level = 2,
  className = "",
}: HeadingProps) {
  const Tag: ElementType = `h${level}`;

  const styles = {
    1: "text-4xl md:text-5xl font-bold tracking-tight",
    2: "text-3xl font-bold",
    3: "text-2xl font-semibold",
    4: "text-xl font-semibold",
    5: "text-lg font-semibold",
    6: "text-base font-semibold",
  };

  return (
    <Tag className={`${styles[level]} ${className}`}>
      {children}
    </Tag>
  );
}