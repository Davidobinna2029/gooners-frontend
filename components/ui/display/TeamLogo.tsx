import Image from "next/image";

interface TeamLogoProps {
  teamName: string;
  logoUrl?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export default function TeamLogo({
  teamName,
  logoUrl,
  size = "md",
  className = "",
}: TeamLogoProps) {
  const sizes = {
    sm: "h-8 w-8",
    md: "h-12 w-12",
    lg: "h-16 w-16",
    xl: "h-20 w-20",
  };

  const initials = teamName
    .split(" ")
    .map((word) => word[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className={`
        ${sizes[size]}
        ${className}
        overflow-hidden
        rounded-full
        border
        border-gray-200
        bg-white
        flex
        items-center
        justify-center
        shadow-sm
      `}
    >
      {logoUrl ? (
        <Image
          src={logoUrl}
          alt={teamName}
          width={80}
          height={80}
          className="h-full w-full object-contain"
        />
      ) : (
        <span className="text-sm font-bold text-gray-700">
          {initials}
        </span>
      )}
    </div>
  );
}