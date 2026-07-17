// src/design-system/football/shirt/FootballShirt.tsx

interface FootballShirtProps {
  number?: number;
  color?: string;
  textColor?: string;
  size?: number;
}

export default function FootballShirt({
  number,
  color = "#DC2626",
  textColor = "#FFFFFF",
  size = 46,
}: FootballShirtProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
    >
      <path
        fill={color}
        stroke="#ffffff"
        strokeWidth="2"
        d="
        M20 10
        L28 4
        H36
        L44 10
        L56 18
        L50 30
        L44 26
        V58
        H20
        V26
        L14 30
        L8 18
        Z
        "
      />

      <text
        x="32"
        y="38"
        textAnchor="middle"
        fontWeight="700"
        fontSize="18"
        fill={textColor}
      >
        {number}
      </text>
    </svg>
  );
}