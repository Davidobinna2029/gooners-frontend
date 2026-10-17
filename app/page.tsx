export const dynamic = "force-dynamic";

import HomepageRenderer from "@/components/home/HomepageRenderer";
import { buildHomepageFeed } from "@/lib/orchestrator/homepage";

export default async function HomePage() {
  const feed = await buildHomepageFeed();

  return <HomepageRenderer feed={feed} />;
}