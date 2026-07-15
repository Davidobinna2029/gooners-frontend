import type { Match } from "@/lib/football/types/match";

interface Props {
  match: Match;
}

export default function MatchNews({
  match,
}: Props) {
  return (
    <section>
      <h3>Related News</h3>

      <p>
        Editorial match coverage will appear here.
      </p>
    </section>
  );
}