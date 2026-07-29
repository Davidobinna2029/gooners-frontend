import FormationPlayer from "./FormationPlayer";

import type {
  FormationTeam,
} from "./formation.types";

interface Props {

  formation: FormationTeam;

}

export default function FormationPitch({

  formation,

}: Props) {

  return (

    <div className="rounded-xl bg-green-700 p-6">

      <div
        className="grid min-h-[500px] grid-cols-5 grid-rows-6 gap-4"
      >

        {formation.players.map(player => (

          <FormationPlayer

            key={player.id}

            player={player}

          />

        ))}

      </div>

    </div>

  );

}