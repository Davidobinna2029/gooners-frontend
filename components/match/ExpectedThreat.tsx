interface Props {

  home: number;

  away: number;

}

export default function ExpectedThreat({

  home,

  away,

}: Props) {

  const total = home + away;

  const homeWidth =
    total === 0
      ? 50
      : (home / total) * 100;

  const awayWidth = 100 - homeWidth;

  return (

    <section
      className="
        rounded-xl
        border
        bg-white
        p-5
        shadow-sm
      "
    >

      <h3
        className="
          mb-4
          font-semibold
        "
      >
        Expected Threat (xT)
      </h3>

      <div
        className="
          mb-4
          flex
          justify-between
          text-lg
          font-bold
        "
      >

        <span>{home}</span>

        <span>{away}</span>

      </div>

      <div
        className="
          flex
          h-4
          overflow-hidden
          rounded-full
          bg-neutral-200
        "
      >

        <div
          className="bg-red-500"
          style={{
            width: `${homeWidth}%`,
          }}
        />

        <div
          className="bg-blue-500"
          style={{
            width: `${awayWidth}%`,
          }}
        />

      </div>

    </section>

  );

}