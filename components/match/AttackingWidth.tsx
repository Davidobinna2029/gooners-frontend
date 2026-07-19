// components/match/AttackingWidth.tsx


interface Props {

  home: number;

  away: number;

}



export default function AttackingWidth({

  home,

  away,

}: Props) {


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
          text-lg
          font-bold
        "

      >

        Attacking Width

      </h3>



      <div className="space-y-5">


        <WidthBar

          label="Home"

          value={home}

        />


        <WidthBar

          label="Away"

          value={away}

        />


      </div>


    </section>

  );

}



function WidthBar({

  label,

  value,

}: {

  label: string;

  value: number;

}) {


  const style =

    value >= 70

      ? "Wide Attack"

      : value >= 40

      ? "Balanced"

      : "Central Attack";



  return (

    <div>


      <div

        className="
          mb-2
          flex
          justify-between
          text-sm
        "

      >

        <span>

          {label}

        </span>



        <span

          className="
            font-bold
          "

        >

          {value}% · {style}

        </span>


      </div>



      <div

        className="
          h-3
          overflow-hidden
          rounded-full
          bg-neutral-200
        "

      >

        <div

          className="
            h-full
            rounded-full
            bg-red-600
          "

          style={{

            width: `${value}%`

          }}

        />


      </div>


    </div>

  );

}