import type {
  MomentumPoint,
} from "./momentum.types";

interface Props {

  point: MomentumPoint;

}

export default function MomentumBar({

  point,

}: Props) {

  return (

    <div className="flex h-20 flex-col justify-end">

      <div
        className="rounded-t bg-red-600"
        style={{
          height: `${point.home}%`,
        }}
      />

      <div
        className="rounded-b bg-blue-600"
        style={{
          height: `${point.away}%`,
        }}
      />

    </div>

  );

}