"use client";


interface Props {

  home: number;

  away: number;

}



export default function PPDA({

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

        PPDA

      </h3>




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



      <p

        className="
          mt-4
          text-center
          text-xs
          text-neutral-500
        "

      >

        Lower PPDA indicates stronger pressing intensity

      </p>



    </section>


  );


}