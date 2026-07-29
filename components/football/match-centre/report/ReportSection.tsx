import {
  cleanParagraph,
} from "./report.utils";

import type {
  ReportSectionData,
} from "./report.types";

interface Props {
  section: ReportSectionData;
}

export default function ReportSection({
  section,
}: Props) {

  return (

    <section className="mb-10">

      <h2 className="mb-4 text-2xl font-bold">

        {section.title}

      </h2>

      <p className="leading-8 text-gray-700">

        {cleanParagraph(section.content)}

      </p>

    </section>

  );

}