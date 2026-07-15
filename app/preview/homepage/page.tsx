import HomepageRenderer from "@/components/home/HomepageRenderer";

import { buildPreviewFeed } from "@/lib/orchestrator/previewHomepage";

export default async function HomepagePreviewPage() {
  const feed = await buildPreviewFeed();

  return <HomepageRenderer feed={feed} />;
}