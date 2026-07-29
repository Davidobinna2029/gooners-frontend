interface Props {

  formation: string;

}

export default function FormationLegend({

  formation,

}: Props) {

  return (

    <div className="mb-4 flex items-center justify-between">

      <h3 className="text-xl font-bold">

        Formation

      </h3>

      <span className="rounded-full bg-gray-100 px-4 py-2 font-semibold">

        {formation}

      </span>

    </div>

  );

}