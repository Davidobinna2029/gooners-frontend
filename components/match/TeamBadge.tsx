// components/match/TeamBadge.tsx

import Image from "next/image";

interface TeamBadgeProps {
  logo?: string;
  name: string;
  size?: number;
}

export default function TeamBadge({
  logo,
  name,
  size = 48,
}: TeamBadgeProps) {
  return (
    <div
      className="flex items-center justify-center rounded-full bg-white shadow-sm"
      style={{
        width: size,
        height: size,
      }}
    >
      <Image
        src={logo || "/images/team-placeholder.png"}
        alt={name}
        width={size - 8}
        height={size - 8}
        className="object-contain"
      />
    </div>
  );
}