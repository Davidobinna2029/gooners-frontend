import { prisma } from "@/lib/db/prisma";

export default async function NewsroomStats() {
  const [
    totalUsers,
    drafts,
    reviews,
    published,
    auditLogs,
  ] = await Promise.all([
    prisma.user.count(),

    prisma.workflow.count({
      where: {
        status: "DRAFT",
      },
    }),

    prisma.workflow.count({
      where: {
        status: "IN_REVIEW",
      },
    }),

    prisma.workflow.count({
      where: {
        status: "PUBLISHED",
      },
    }),

    prisma.auditLog.count(),
  ]);

  const cards = [
    {
      label: "Users",
      value: totalUsers,
      icon: "👥",
    },
    {
      label: "Drafts",
      value: drafts,
      icon: "📝",
    },
    {
      label: "In Review",
      value: reviews,
      icon: "🔍",
    },
    {
      label: "Published",
      value: published,
      icon: "🚀",
    },
    {
      label: "Audit Events",
      value: auditLogs,
      icon: "📊",
    },
  ];

  return (
    <div className="newsroom-stats">
      {cards.map((card) => (
        <div
          key={card.label}
          className="newsroom-stat-card"
        >
          <div
            style={{
              fontSize: "24px",
              marginBottom: "10px",
            }}
          >
            {card.icon}
          </div>

          <span>{card.label}</span>

          <strong>{card.value}</strong>
        </div>
      ))}
    </div>
  );
}