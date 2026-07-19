import type {

  FormationSnapshot,

} from "@/src/lib/football/tactical/formationTracker";

interface Props {

  timeline: FormationSnapshot[];

}

export default function FormationTracker({

  timeline,

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

        Formation Timeline

      </h3>

      <div className="space-y-3">

        {timeline.map(

          (item, index) => (

            <div

              key={index}

              className="
                flex
                items-center
                justify-between
                rounded-lg
                border
                bg-neutral-50
                p-3
              "

            >

              <span

                className="
                  font-semibold
                "

              >

                {item.minute === 0
                  ? "Kickoff"
                  : `${item.minute}'`}

              </span>

              <span

                className="
                  text-red-600
                  font-bold
                "

              >

                {item.formation}

              </span>

            </div>

          )

        )}

      </div>

    </section>

  );

}