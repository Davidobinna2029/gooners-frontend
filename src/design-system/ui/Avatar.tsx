import Image from "next/image";

interface AvatarProps {
  src?: string;
  alt: string;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "square";
  className?: string;
}

const sizes = {
  sm: 32,
  md: 48,
  lg: 64,
};

export default function Avatar({
  src,
  alt,
  size = "md",
  shape = "rounded",
  className = "",
}: AvatarProps) {
  const dimension = sizes[size];

  return (
    <Image
      src={src || "/images/placeholder-avatar.png"}
      alt={alt}
      width={dimension}
      height={dimension}
      className={[
        shape === "rounded" ? "rounded-full" : "rounded-lg",
        "object-contain",
        className,
      ].join(" ")}
    />
  );
}