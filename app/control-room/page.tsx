import ControlRoom from "@/components/control-room/ControlRoom";
import { getScores } from "@/lib/api/wordpress";

/**
 * LIVE PAGE CONFIG
 * Prevents static build timeout from ESPN API
 */
export const dynamic = "force-dynamic";

export const revalidate = 0;

export default async function Page() {
  const matches = await getScores();

  return (
    <ControlRoom matches={matches || []} />
  );
}