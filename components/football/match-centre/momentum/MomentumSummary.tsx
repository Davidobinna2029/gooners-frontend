import type {

  MomentumSummary,

} from "./momentum.types";

interface Props {

  summary: MomentumSummary;

}

export default function MomentumSummary({

  summary,

}: Props) {

  return (

    <div className="grid grid-cols-3 gap-4 rounded-xl border bg-gray-50 p-4">

      <div className="text-center">

        <p className="text-xs uppercase text-gray-500">

          Home Control

        </p>

        <p className="text-2xl font-bold">

          {summary.homeControl}%

        </p>

      </div>

      <div className="text-center">

        <p className="text-xs uppercase text-gray-500">

          Swings

        </p>

        <p className="text-2xl font-bold">

          {summary.swings}

        </p>

      </div>

      <div className="text-center">

        <p className="text-xs uppercase text-gray-500">

          Away Control

        </p>

        <p className="text-2xl font-bold">

          {summary.awayControl}%

        </p>

      </div>

    </div>

  );

}