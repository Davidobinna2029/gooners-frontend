// src/design-system/football/player/PlayerGlow.tsx

interface Props {
  active?: boolean;

  color?: string;

  children?: React.ReactNode;
}

export default function PlayerGlow({
  active = false,
  color = "#22C55E",
  children,
}: Props) {

  return (

    <div className="relative">

      {active && (

        <>
          {/* Soft outer glow */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              animate-ping
              opacity-40
            "
            style={{
              backgroundColor: color,
            }}
          />

          {/* Bright ring */}

          <div
            className="
              absolute
              inset-0
              rounded-full
              border-2
              shadow-2xl
            "
            style={{
              borderColor: color,
              boxShadow: `0 0 24px ${color}`,
            }}
          />
        </>

      )}

      <div
        className={`
          relative
          transition-transform
          duration-300
          ${active ? "scale-110" : "scale-100"}
        `}
      >
        {children}
      </div>

    </div>

  );

}