"use client";


import type {
  HeatPoint,
} from "@/src/lib/football/analytics/heatMapEngine";


interface Props {

  points: HeatPoint[];

}



export default function HeatMap({
  points,
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
          font-bold
        "
      >
        Heat Map
      </h3>


      <div
        className="
          relative
          h-[320px]
          overflow-hidden
          rounded-lg
          bg-green-900
        "
      >


        {points.map(
          (point, index) => (

            <div

              key={index}

              className="
                absolute
                h-10
                w-10
                rounded-full
                bg-red-500/40
                blur-xl
              "

              style={{

                left:
                  `${point.x}%`,


                top:
                  `${point.y}%`,


                opacity:
                  Math.min(
                    point.intensity / 5,
                    1
                  ),

              }}

            />

          )

        )}


      </div>


    </section>

  );

}