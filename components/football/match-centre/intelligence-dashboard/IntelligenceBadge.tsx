interface Props {

  value: string;

}

export default function IntelligenceBadge({

  value,

}: Props) {

  return (

    <span className="rounded-full bg-red-600 px-3 py-1 text-sm font-bold text-white">

      {value}

    </span>

  );

}