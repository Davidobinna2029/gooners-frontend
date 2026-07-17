interface Props {
  name: string;
  number?: number;
}

export default function FootballPitchPlayer({
  name,
  number,
}: Props) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-600 font-bold text-white shadow-lg">
        {number ?? ""}
      </div>

      <span className="mt-2 text-center text-xs font-medium text-white">
        {name}
      </span>
    </div>
  );
}