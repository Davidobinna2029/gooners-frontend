import { prisma } from "@/lib/db/prisma";
import { publishEvent } from "@/lib/newsroom/events";
import { clearHomepageCache } from "@/lib/homepage/cache";

export async function GET() {
  try {
    const overrides =
      await prisma.override.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

    return Response.json(overrides);
  } catch (error) {
    return Response.json(
      {
        error: "Failed to fetch overrides",
        details: String(error),
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(
  request: Request
) {
  try {
    const body =
      await request.json();

    const override =
      await prisma.override.create({
        data: {
          postId: Number(
            body.postId
          ),
          type: body.type,
          value:
            body.value ?? null,
          reason:
            body.reason ?? null,
          createdBy:
            body.createdBy ??
            "admin",
        },
      });

    /**
     * Homepage has changed.
     * Clear cached homepage so the
     * next request rebuilds it with
     * the latest editorial overrides.
     */
    clearHomepageCache();

    console.log(
      "Homepage cache cleared."
    );

    const user =
      await prisma.user.findFirst({
        where: {
          role: "ADMIN",
        },
      });

    if (user) {
      await prisma.auditLog.create({
        data: {
          userId: user.id,
          action:
            "OVERRIDE_CREATED",
          targetId:
            override.postId,
          metadata: {
            overrideId:
              override.id,
            type:
              override.type,
            value:
              override.value,
            reason:
              override.reason,
          },
        },
      });
    }

    publishEvent({
      type: "override",
      payload: {
        overrideId:
          override.id,
        postId:
          override.postId,
        overrideType:
          override.type,
        value:
          override.value,
        reason:
          override.reason,
        createdAt:
          override.createdAt,
      },
    });

    if (
      override.type ===
      "FORCE_BREAKING"
    ) {
      publishEvent({
        type: "breaking",
        payload: {
          postId:
            override.postId,
          reason:
            override.reason,
        },
      });
    }

    if (
      override.type ===
      "HERO_POSITION"
    ) {
      publishEvent({
        type: "hero",
        payload: {
          postId:
            override.postId,
          slot:
            override.value,
        },
      });
    }

    publishEvent({
      type: "audit",
      payload: {
        action:
          "OVERRIDE_CREATED",
        postId:
          override.postId,
      },
    });

    return Response.json(
      override,
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(
      "Override creation failed:",
      error
    );

    return Response.json(
      {
        error:
          "Failed to create override",
        details:
          String(error),
      },
      {
        status: 500,
      }
    );
  }
}