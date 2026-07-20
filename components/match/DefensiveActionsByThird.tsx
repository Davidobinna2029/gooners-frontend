"use client";


interface TeamActions {

  defensiveThird: number;

  middleThird: number;

  attackingThird: number;

}


interface Props {

  home: TeamActions;

  away: TeamActions;

}



export default function DefensiveActionsByThird({

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

        Defensive Actions By Third

      </h3>



      <div

        className="
          space-y-4
        "

      >


        <ActionRow

          label="Defensive Third"

          home={home.defensiveThird}

          away={away.defensiveThird}

        />


        <ActionRow

          label="Middle Third"

          home={home.middleThird}

          away={away.middleThird}

        />


        <ActionRow

          label="Attacking Third"

          home={home.attackingThird}

          away={away.attackingThird}

        />



      </div>



    </section>


  );


}



function ActionRow({

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


          <p

            className="
              text-xs
              text-neutral-500
            "

          >

            Home

          </p>


          <p

            className="
              text-xl
              font-bold
            "

          >

            {home}

          </p>


        </div>




        <div>


          <p

            className="
              text-xs
              text-neutral-500
            "

          >

            Away

          </p>


          <p

            className="
              text-xl
              font-bold
            "

          >

            {away}

          </p>


        </div>



      </div>



    </div>


  );


}