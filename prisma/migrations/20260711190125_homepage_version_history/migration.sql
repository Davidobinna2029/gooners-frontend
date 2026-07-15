-- AlterTable
ALTER TABLE "public"."HomepagePublication" ADD COLUMN     "notes" TEXT,
ADD COLUMN     "restoredFrom" TEXT,
ADD COLUMN     "title" TEXT NOT NULL DEFAULT 'Homepage Publish';
