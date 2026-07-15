-- CreateTable
CREATE TABLE "public"."HomepageLayout" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Homepage Draft',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "layout" JSONB NOT NULL,
    "createdBy" TEXT,
    "publishedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HomepageLayout_pkey" PRIMARY KEY ("id")
);
