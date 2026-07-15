import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const result = await prisma.$queryRaw`SELECT 1 as ok`;

    return Response.json({
      success: true,
      result
    });
  } catch (error) {
    return Response.json({
      success: false,
      error: String(error)
    });
  }
}