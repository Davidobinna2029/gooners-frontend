-- AlterTable
ALTER TABLE "public"."HomepagePublication" ADD COLUMN     "scheduledFor" TIMESTAMP(3),
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';
