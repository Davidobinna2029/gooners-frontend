// components/match/DefensiveLineHeight.tsx


interface Props {

  home: number;

  away: number;

}



export default function DefensiveLineHeight({

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

        Defensive Line Height

      </h3>



      <div className="space-y-5">


        <Line

          label="Home"

          value={home}

        />



        <Line

          label="Away"

          value={away}

        />


      </div>



    </section>

  );

}



function Line({

  label,

  value,

}: {

  label: string;

  value: number;

}) {


  const block =

    value >= 65

      ? "High Block"

      : value >= 35

      ? "Medium Block"

      : "Low Block";



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

          {value}m · {block}

        </span>


      </div>



      <div

        className="
          h-3
          rounded-full
          bg-neutral-200
          overflow-hidden
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