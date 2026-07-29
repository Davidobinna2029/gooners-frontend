import ReportHeadline from "./ReportHeadline";
import ReportHighlights from "./ReportHighlights";
import ReportSection from "./ReportSection";

import type {
  ReportHighlight,
  ReportSectionData,
} from "./report.types";

interface Props {

  headline: string;

  summary: string;

  tactical: string;

  verdict: string;

  highlights: ReportHighlight[];

}

export default function MatchReport({

  headline,

  summary,

  tactical,

  verdict,

  highlights,

}: Props) {

  return (

    <article className="rounded-2xl border bg-white p-8 shadow-sm">

      <ReportHeadline
        headline={headline}
      />

      <ReportHighlights
        highlights={highlights}
      />

      <div className="mt-8">

        <ReportSection
          section={{
            title: "Match Summary",
            content: summary,
          }}
        />

        <ReportSection
          section={{
            title: "Tactical Analysis",
            content: tactical,
          }}
        />

        <ReportSection
          section={{
            title: "Final Verdict",
            content: verdict,
          }}
        />

      </div>

    </article>

  );

}