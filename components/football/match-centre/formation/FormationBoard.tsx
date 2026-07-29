import FormationLegend from "./FormationLegend";
import FormationPitch from "./FormationPitch";

import type {
  FormationTeam,
} from "./formation.types";

interface Props {

  home: FormationTeam;

  away: FormationTeam;

}

export default function FormationBoard({

  home,

  away,

}: Props) {

  return (

    <section className="rounded-2xl border bg-white p-6 shadow-sm">

      <h2 className="mb-6 text-2xl font-bold">

        Team Formations

      </h2>

      <div className="grid gap-10 lg:grid-cols-2">

        <div>

          <FormationLegend

            formation={home.formation}

          />

          <FormationPitch

            formation={home}

          />

        </div>

        <div>

          <FormationLegend

            formation={away.formation}

          />

          <FormationPitch

            formation={away}

          />

        </div>

      </div>

    </section>

  );

}