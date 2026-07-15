import { notFound } from "next/navigation";

import MatchCentre from "@/components/match/MatchCentre";
import { fetchMatch } from "@/lib/football/services/match";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function MatchPage({
  params,
}: Props) {
  const { id } = await params;

  const match = await fetchMatch(Number(id));

  if (!match) {
    notFound();
  }

  return <MatchCentre match={match} />;
}