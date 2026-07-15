-- CreateTable
CREATE TABLE "public"."HomepagePublication" (
    "id" TEXT NOT NULL,
    "draftId" TEXT,
    "layout" JSONB NOT NULL,
    "publishedBy" TEXT NOT NULL,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "HomepagePublication_pkey" PRIMARY KEY ("id")
);
