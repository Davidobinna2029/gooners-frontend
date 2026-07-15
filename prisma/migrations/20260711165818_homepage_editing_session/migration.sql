-- CreateTable
CREATE TABLE "public"."HomepageEditingSession" (
    "id" TEXT NOT NULL,
    "layout" JSONB NOT NULL,
    "editor" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageEditingSession_pkey" PRIMARY KEY ("id")
);
