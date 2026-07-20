"use client";


interface Compactness {

  verticalCompactness: number;

  horizontalCompactness: number;

  overall: number;

}


interface Props {

  home: Compactness;

  away: Compactness;

}



export default function DefensiveCompactness({

  home,

  away,

}: Props) {


  return (

    <section

      className="
        rounded-xl
        border
        bg-white
        p-4
        shadow-sm
      "

    >


      <h3

        className="
          mb-4
          text-base
          font-semibold
        "

      >

        Defensive Compactness

      </h3>



      <CompactRow

        label="Overall"

        home={home.overall}

        away={away.overall}

      />


      <CompactRow

        label="Vertical"

        home={home.verticalCompactness}

        away={away.verticalCompactness}

      />


      <CompactRow

        label="Horizontal"

        home={home.horizontalCompactness}

        away={away.horizontalCompactness}

      />


    </section>


  );


}



function CompactRow({

  label,

  home,

  away,

}: {

  label: string;

  home: number;

  away: number;

}) {


  return (

    <div

      className="
        mb-3
        rounded-lg
        bg-neutral-50
        p-3
      "

    >


      <p

        className="
          mb-2
          text-sm
          font-medium
        "

      >

        {label}

      </p>



      <div

        className="
          flex
          justify-between
          text-center
        "

      >


        <div>

          <p className="text-xs text-neutral-500">
            Home
          </p>

          <p className="text-xl font-bold">
            {home}
          </p>

        </div>



        <div>

          <p className="text-xs text-neutral-500">
            Away
          </p>

          <p className="text-xl font-bold">
            {away}
          </p>

        </div>


      </div>


    </div>


  );


}