import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const [
      draft,
      review,
      approved,
      published,
      rejected,
      overrides,
      workflows,
      audits,
      latestAudit,
    ] = await Promise.all([
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
          status: "APPROVED",
        },
      }),

      prisma.workflow.count({
        where: {
          status: "PUBLISHED",
        },
      }),

      prisma.workflow.count({
        where: {
          status: "REJECTED",
        },
      }),

      prisma.override.count(),

      prisma.workflow.count(),

      prisma.auditLog.count({
        where: {
          createdAt: {
            gte: new Date(
              new Date().setHours(
                0,
                0,
                0,
                0
              )
            ),
          },
        },
      }),

      prisma.auditLog.findFirst({
        orderBy: {
          createdAt: "desc",
        },
      }),
    ]);

    return Response.json({
      draft,
      review,
      approved,
      published,
      rejected,

      overrides,

      workflows,

      auditsToday: audits,

      lastActivity:
        latestAudit?.createdAt ??
        null,
    });
  } catch (error) {
    return Response.json(
      {
        error:
          "Failed to load analytics",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}