import type {
  FormationShiftType,
} from "@/lib/football/intelligence/formationShiftEngine";

interface Props {
  type: FormationShiftType;
}

const styles: Record<
  FormationShiftType,
  string
> = {
  attacking:
    "bg-red-100 text-red-700",

  defensive:
    "bg-blue-100 text-blue-700",

  balanced:
    "bg-emerald-100 text-emerald-700",

  unknown:
    "bg-gray-100 text-gray-700",
};

export default function FormationShiftBadge({
  type,
}: Props) {
  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wide ${
        styles[type] ??
        "bg-gray-100 text-gray-700"
      }`}
    >
      {type}
    </span>
  );
}