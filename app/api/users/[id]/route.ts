import { prisma } from "@/lib/db/prisma";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    return Response.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const currentRole =
    (session.user as any)
      ?.role;

  if (
    currentRole !==
      "OWNER" &&
    currentRole !==
      "ADMIN"
  ) {
    return Response.json(
      {
        error:
          "Forbidden",
      },
      {
        status: 403,
      }
    );
  }

  const { id } =
    await params;

  const body =
    await req.json();

  const targetUser =
    await prisma.user.findUnique(
      {
        where: { id },
      }
    );

  if (!targetUser) {
    return Response.json(
      {
        error:
          "User not found",
      },
      {
        status: 404,
      }
    );
  }

  if (
    targetUser.role ===
      "OWNER" &&
    currentRole !==
      "OWNER"
  ) {
    return Response.json(
      {
        error:
          "Cannot modify owner",
      },
      {
        status: 403,
      }
    );
  }

  const updatedUser =
    await prisma.user.update({
      where: { id },

      data: {
        role: body.role,
      },
    });

  await prisma.auditLog.create(
    {
      data: {
        userId:
          (
            session.user as any
          ).id,

        action:
          "USER_ROLE_CHANGED",

        metadata: {
          targetUserId:
            id,

          email:
            targetUser.email,

          oldRole:
            targetUser.role,

          newRole:
            body.role,
        },
      },
    }
  );

  return Response.json(
    updatedUser
  );
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: Promise<{
      id: string;
    }>;
  }
) {
  const session =
    await getServerSession(
      authOptions
    );

  if (!session) {
    return Response.json(
      {
        error:
          "Unauthorized",
      },
      {
        status: 401,
      }
    );
  }

  const currentRole =
    (session.user as any)
      ?.role;

  if (
    currentRole !==
    "OWNER"
  ) {
    return Response.json(
      {
        error:
          "Only owners can delete users",
      },
      {
        status: 403,
      }
    );
  }

  const { id } =
    await params;

  const targetUser =
    await prisma.user.findUnique(
      {
        where: { id },
      }
    );

  if (!targetUser) {
    return Response.json(
      {
        error:
          "User not found",
      },
      {
        status: 404,
      }
    );
  }

  const currentUserId =
    (session.user as any)
      ?.id;

  if (
    currentUserId ===
    targetUser.id
  ) {
    return Response.json(
      {
        error:
          "You cannot delete yourself",
      },
      {
        status: 403,
      }
    );
  }

  if (
    targetUser.role ===
    "OWNER"
  ) {
    return Response.json(
      {
        error:
          "Cannot delete owner account",
      },
      {
        status: 403,
      }
    );
  }

  await prisma.auditLog.create(
    {
      data: {
        userId:
          currentUserId,

        action:
          "USER_DELETED",

        metadata: {
          deletedUserId:
            targetUser.id,

          deletedEmail:
            targetUser.email,

          deletedRole:
            targetUser.role,
        },
      },
    }
  );

  await prisma.user.delete({
    where: {
      id,
    },
  });

  return Response.json({
    success: true,
  });
}