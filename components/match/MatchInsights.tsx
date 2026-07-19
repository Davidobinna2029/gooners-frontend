import type {

  MatchInsight,

} from "@/src/lib/football/insights/insightsEngine";

interface Props {

  insights: MatchInsight[];

}

export default function MatchInsights({

  insights,

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

        Match Insights

      </h3>

      <div className="space-y-3">

        {insights.map(

          (insight) => (

            <div

              key={insight.id}

              className="
                rounded-lg
                border
                bg-neutral-50
                p-3
              "

            >

              <p>

                • {insight.text}

              </p>

            </div>

          )

        )}

      </div>

    </section>

  );

}