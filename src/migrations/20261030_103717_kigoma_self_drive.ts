import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TYPE "public"."enum_itineraries_styles" ADD VALUE 'selfdrive';
  ALTER TYPE "public"."enum__itineraries_v_version_styles" ADD VALUE 'selfdrive';
  CREATE TABLE "itineraries_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_itineraries_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "itineraries" ADD COLUMN "video_id" integer;
  ALTER TABLE "_itineraries_v" ADD COLUMN "version_video_id" integer;
  ALTER TABLE "itineraries_rels" ADD CONSTRAINT "itineraries_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries_rels" ADD CONSTRAINT "itineraries_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_rels" ADD CONSTRAINT "_itineraries_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_itineraries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_rels" ADD CONSTRAINT "_itineraries_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "itineraries_rels_order_idx" ON "itineraries_rels" USING btree ("order");
  CREATE INDEX "itineraries_rels_parent_idx" ON "itineraries_rels" USING btree ("parent_id");
  CREATE INDEX "itineraries_rels_path_idx" ON "itineraries_rels" USING btree ("path");
  CREATE INDEX "itineraries_rels_media_id_idx" ON "itineraries_rels" USING btree ("media_id");
  CREATE INDEX "_itineraries_v_rels_order_idx" ON "_itineraries_v_rels" USING btree ("order");
  CREATE INDEX "_itineraries_v_rels_parent_idx" ON "_itineraries_v_rels" USING btree ("parent_id");
  CREATE INDEX "_itineraries_v_rels_path_idx" ON "_itineraries_v_rels" USING btree ("path");
  CREATE INDEX "_itineraries_v_rels_media_id_idx" ON "_itineraries_v_rels" USING btree ("media_id");
  ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_video_id_media_id_fk" FOREIGN KEY ("video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itineraries_v" ADD CONSTRAINT "_itineraries_v_version_video_id_media_id_fk" FOREIGN KEY ("version_video_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "itineraries_video_idx" ON "itineraries" USING btree ("video_id");
  CREATE INDEX "_itineraries_v_version_version_video_idx" ON "_itineraries_v" USING btree ("version_video_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "itineraries_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_itineraries_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "itineraries_rels" CASCADE;
  DROP TABLE "_itineraries_v_rels" CASCADE;
  ALTER TABLE "itineraries" DROP CONSTRAINT "itineraries_video_id_media_id_fk";
  
  ALTER TABLE "_itineraries_v" DROP CONSTRAINT "_itineraries_v_version_video_id_media_id_fk";
  
  ALTER TABLE "itineraries_styles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum_itineraries_styles";
  CREATE TYPE "public"."enum_itineraries_styles" AS ENUM('migration', 'classic', 'beach', 'honeymoon', 'family', 'kilimanjaro', 'walking', 'cultural');
  ALTER TABLE "itineraries_styles" ALTER COLUMN "value" SET DATA TYPE "public"."enum_itineraries_styles" USING "value"::"public"."enum_itineraries_styles";
  ALTER TABLE "_itineraries_v_version_styles" ALTER COLUMN "value" SET DATA TYPE text;
  DROP TYPE "public"."enum__itineraries_v_version_styles";
  CREATE TYPE "public"."enum__itineraries_v_version_styles" AS ENUM('migration', 'classic', 'beach', 'honeymoon', 'family', 'kilimanjaro', 'walking', 'cultural');
  ALTER TABLE "_itineraries_v_version_styles" ALTER COLUMN "value" SET DATA TYPE "public"."enum__itineraries_v_version_styles" USING "value"::"public"."enum__itineraries_v_version_styles";
  DROP INDEX "itineraries_video_idx";
  DROP INDEX "_itineraries_v_version_version_video_idx";
  ALTER TABLE "itineraries" DROP COLUMN "video_id";
  ALTER TABLE "_itineraries_v" DROP COLUMN "version_video_id";`)
}
