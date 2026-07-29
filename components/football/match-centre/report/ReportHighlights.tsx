import type {
  ReportHighlight,
} from "./report.types";

interface Props {
  highlights: ReportHighlight[];
}

export default function ReportHighlights({
  highlights,
}: Props) {

  if (highlights.length === 0) {

    return null;

  }

  return (

    <aside className="rounded-xl border bg-gray-50 p-6">

      <h3 className="mb-4 text-lg font-bold">

        Key Highlights

      </h3>

      <ul className="space-y-3">

        {highlights.map(item => (

          <li
            key={item.id}
            className="text-gray-700"
          >

            • {item.text}

          </li>

        ))}

      </ul>

    </aside>

  );

}