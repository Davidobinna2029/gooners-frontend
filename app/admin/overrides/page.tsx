export const dynamic = "force-dynamic";

import { prisma } from "@/lib/db/prisma";

export default async function OverridesPage() {
  const overrides =
    await prisma.override.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });

  return (
    <div>
      <h2>Content Overrides</h2>

      {overrides.map((o) => (
        <div
          key={o.id}
          className="override-card"
        >
          <p>
            Post: {o.postId}
          </p>

          <p>
            Type: {o.type}
          </p>

          <p>
            Reason: {o.reason}
          </p>
        </div>
      ))}
    </div>
  );
}