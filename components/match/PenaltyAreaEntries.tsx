"use client";


interface Props {

  home: number;

  away: number;

}



export default function PenaltyAreaEntries({

  home,

  away,

}: Props) {


  const total =
    home + away;



  const homePercentage =
    total === 0
      ? 50
      : (home / total) * 100;



  const awayPercentage =
    total === 0
      ? 50
      : (away / total) * 100;



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

        Penalty Area Entries

      </h3>



      <div

        className="
          mb-4
          flex
          justify-between
          text-center
        "

      >



        <div>


          <p

            className="
              text-xs
              uppercase
              text-neutral-500
            "

          >

            Home

          </p>



          <p

            className="
              text-2xl
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
              uppercase
              text-neutral-500
            "

          >

            Away

          </p>



          <p

            className="
              text-2xl
              font-bold
            "

          >

            {away}

          </p>


        </div>



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
            bg-red-600
            transition-all
          "

          style={{

            width:
              `${homePercentage}%`,

          }}

        />


      </div>





      <div

        className="
          mt-2
          flex
          justify-between
          text-xs
          text-neutral-500
        "

      >


        <span>

          {homePercentage.toFixed(0)}%

        </span>



        <span>

          {awayPercentage.toFixed(0)}%

        </span>


      </div>



    </section>


  );


}