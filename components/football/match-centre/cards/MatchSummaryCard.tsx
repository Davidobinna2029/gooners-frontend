import type { MatchFactsViewModel } from "@/lib/football/mappers/mapMatchFacts";

import {
  GlassCard,
  CardHeader,
  CardBody,
} from "@/components/football/ui";

import MatchScoreboard from "../shared/MatchScoreboard";
import SummaryTiles from "../shared/SummaryTiles";

interface Props {
  facts: MatchFactsViewModel;
}

export default function MatchSummaryCard({
  facts,
}: Props) {
  return (
    <GlassCard>

      <CardHeader
        title="Match Summary"
        subtitle="Overview of the fixture"
      />

      <CardBody>

        <MatchScoreboard facts={facts} />

        <SummaryTiles facts={facts} />

      </CardBody>

    </GlassCard>
  );
}