interface Props {
  label: string;
}

export default function AwardBadge({
  label,
}: Props) {
  return (
    <div className="inline-flex items-center rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-amber-700">

      ⭐

      <span className="ml-2">
        {label}
      </span>

    </div>
  );
}