// components/match/PressingIntensity.tsx

interface Props {

  home: number;

  away: number;

}


export default function PressingIntensity({

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

        Pressing Intensity

      </h3>


      <div className="space-y-4">


        <IntensityBar

          label="Home"

          value={home}

        />


        <IntensityBar

          label="Away"

          value={away}

        />


      </div>


    </section>

  );

}



function IntensityBar({

  label,

  value,

}: {

  label: string;

  value: number;

}) {


  return (

    <div>


      <div

        className="
          mb-1
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

          {value}%

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