import ControlRoom from "@/components/control-room/ControlRoom";
import { getScores } from "@/lib/api/wordpress";

export default async function Page() {
  const matches = await getScores();

  return <ControlRoom matches={matches} />;
}