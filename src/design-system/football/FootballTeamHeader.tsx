import Image from "next/image";

interface FootballTeamHeaderProps {
  name: string;
  crest?: string | null;
  subtitle?: string;
  align?: "left" | "center";
  size?: "sm" | "md" | "lg";
}

export default function FootballTeamHeader({
  name,
  crest,
  subtitle,
  align = "center",
  size = "md",
}: FootballTeamHeaderProps) {
  const imageSize = {
    sm: 40,
    md: 56,
    lg: 72,
  };

  const titleSize = {
    sm: "text-base",
    md: "text-lg",
    lg: "text-xl",
  };

  return (
    <div
      className={`flex flex-col ${
        align === "center"
          ? "items-center text-center"
          : "items-start text-left"
      }`}
    >
      {crest && (
        <Image
          src={crest}
          alt={name}
          width={imageSize[size]}
          height={imageSize[size]}
          className="mb-3 object-contain"
        />
      )}

      <h3
        className={`font-bold ${titleSize[size]}`}
      >
        {name}
      </h3>

      {subtitle && (
        <p className="text-sm text-gray-500">
          {subtitle}
        </p>
      )}
    </div>
  );
}