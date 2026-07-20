"use client";


interface Props {

  home: number;

  away: number;

}



export default function ExpectedAssists({

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

        Expected Assists (xA)

      </h3>



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


          <p className="text-2xl font-bold">
            {home.toFixed(2)}
          </p>


        </div>




        <div>

          <p className="text-xs text-neutral-500">
            Away
          </p>


          <p className="text-2xl font-bold">
            {away.toFixed(2)}
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

        Estimated chance creation value from passes before shots

      </p>



    </section>


  );


}