import { prisma } from "@/lib/db/prisma";
import bcrypt from "bcrypt";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { canManageUsers } from "@/lib/permissions";

export async function GET() {
  const session =
    await getServerSession(
      authOptions
    );

  const role =
    (session?.user as any)?.role;

  if (
    !session ||
    !canManageUsers(role)
  ) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const users =
    await prisma.user.findMany({
      orderBy: {
        createdAt: "desc",
      },

      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

  return Response.json(users);
}

export async function POST(
  req: Request
) {
  const session =
    await getServerSession(
      authOptions
    );

  const role =
    (session?.user as any)?.role;

  if (
    !session ||
    !canManageUsers(role)
  ) {
    return Response.json(
      {
        error: "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const body =
    await req.json();

  const {
    email,
    password,
    role: newRole,
  } = body;

  if (
    !email ||
    !password ||
    !newRole
  ) {
    return Response.json(
      {
        error:
          "Missing required fields",
      },
      {
        status: 400,
      }
    );
  }

  const existingUser =
    await prisma.user.findUnique({
      where: {
        email,
      },
    });

  if (existingUser) {
    return Response.json(
      {
        error:
          "User already exists",
      },
      {
        status: 409,
      }
    );
  }

  const hashedPassword =
    await bcrypt.hash(
      password,
      10
    );

  const user =
    await prisma.user.create({
      data: {
        email,
        password:
          hashedPassword,
        role: newRole,
      },

      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

  await prisma.auditLog.create({
    data: {
      userId:
        (session.user as any).id,

      action:
        "USER_CREATED",

      metadata: {
        createdUser:
          user.email,
        role:
          user.role,
      },
    },
  });

  return Response.json(user);
}