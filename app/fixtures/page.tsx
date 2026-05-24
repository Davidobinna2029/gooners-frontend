import Fixtures from "@/components/sports/Fixtures";

/**
 * FIXTURES PAGE
 * Prevent static build timeout (live/remote data safe mode)
 */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function FixturesPage() {
  return (
    <main className="fixtures-page">
      <div className="container">
        <h1>Fixtures</h1>

        <Fixtures />
      </div>
    </main>
  );
}