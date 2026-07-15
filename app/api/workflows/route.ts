import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`
      SELECT * FROM "Workflow"
    `;

    return Response.json(result);
  } catch (error) {
    return Response.json(
      {
        error: "Workflow table test failed",
        details: String(error),
      },
      { status: 500 }
    );
  }
}