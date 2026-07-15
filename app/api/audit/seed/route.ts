import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";

export async function GET() {
  const hashedPassword =
    await bcrypt.hash(
      "TemporaryPassword123!",
      10
    );

  const user =
    await prisma.user.upsert({
      where: {
        email:
          "info@arsenaltalks.com",
      },

      update: {},

      create: {
        email:
          "info@arsenaltalks.com",

        password:
          hashedPassword,

        role: "ADMIN",
      },
    });

  const log =
    await prisma.auditLog.create({
      data: {
        userId: user.id,

        action:
          "WORKFLOW_APPROVED",

        targetId: 1001,

        metadata: {
          status:
            "APPROVED",
        },
      },
    });

  return Response.json(log);
}