import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const logs = await prisma.auditLog.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 25,
      include: {
        user: true,
      },
    });

    return Response.json(logs);
  } catch (error) {
    return Response.json(
      {
        error: "Failed to load activity timeline",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}