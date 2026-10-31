import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('en', 'no');
  CREATE TYPE "public"."enum__destinations_v_published_locale" AS ENUM('en', 'no');
  CREATE TYPE "public"."enum__lodges_v_published_locale" AS ENUM('en', 'no');
  CREATE TYPE "public"."enum__itineraries_v_published_locale" AS ENUM('en', 'no');
  CREATE TYPE "public"."enum__posts_v_published_locale" AS ENUM('en', 'no');
  CREATE TYPE "public"."enum__home_page_v_published_locale" AS ENUM('en', 'no');
  CREATE TABLE "destinations_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "destinations_locales" (
  	"name" varchar,
  	"tagline" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_destinations_v_version_highlights_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_destinations_v_locales" (
  	"version_name" varchar,
  	"version_tagline" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "lodges_locales" (
  	"summary" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_lodges_v_locales" (
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "itineraries_days_locales" (
  	"day_range" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "itineraries_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_itineraries_v_version_days_locales" (
  	"day_range" varchar,
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_itineraries_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "posts_locales" (
  	"title" varchar,
  	"excerpt" varchar,
  	"body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_posts_v_locales" (
  	"version_title" varchar,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "home_page_hero_slides_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_pillars_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_testimonials_locales" (
  	"quote" varchar,
  	"origin" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_page_locales" (
  	"hero_subheading" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"expert_banner_heading" varchar,
  	"expert_banner_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_hero_slides_locales" (
  	"eyebrow" varchar,
  	"heading" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_pillars_locales" (
  	"title" varchar,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_version_testimonials_locales" (
  	"quote" varchar,
  	"origin" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_home_page_v_locales" (
  	"version_hero_subheading" varchar,
  	"version_intro_heading" varchar,
  	"version_intro_body" varchar,
  	"version_expert_banner_heading" varchar,
  	"version_expert_banner_body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_settings_locales" (
  	"tagline" varchar DEFAULT 'Your choice. Your holiday. Our mission.',
  	"footer_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "expert_settings_locales" (
  	"expert_title" varchar DEFAULT 'Safari Expert, Arusha',
  	"greeting" varchar DEFAULT 'Karibu! I''m Baraka, the All in Tanzania AI safari expert. I''ve learned from our guides and planners, so ask me anything about parks, seasons, lodges or family trips, by typing or by talking. Tell me what you dream of seeing and we''ll shape your safari together.',
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "destinations_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_destinations_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_destinations_v" ADD COLUMN "published_locale" "enum__destinations_v_published_locale";
  ALTER TABLE "_destinations_v_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "lodges_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_lodges_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_lodges_v" ADD COLUMN "published_locale" "enum__lodges_v_published_locale";
  ALTER TABLE "_lodges_v_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "itineraries_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_itineraries_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_itineraries_v" ADD COLUMN "published_locale" "enum__itineraries_v_published_locale";
  ALTER TABLE "_itineraries_v_texts" ADD COLUMN "locale" "_locales";
  ALTER TABLE "_posts_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_posts_v" ADD COLUMN "published_locale" "enum__posts_v_published_locale";
  ALTER TABLE "_home_page_v" ADD COLUMN "snapshot" boolean;
  ALTER TABLE "_home_page_v" ADD COLUMN "published_locale" "enum__home_page_v_published_locale";
  ALTER TABLE "destinations_highlights_locales" ADD CONSTRAINT "destinations_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_locales" ADD CONSTRAINT "destinations_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_highlights_locales" ADD CONSTRAINT "_destinations_v_version_highlights_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destinations_v_version_highlights"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_locales" ADD CONSTRAINT "_destinations_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lodges_locales" ADD CONSTRAINT "lodges_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."lodges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lodges_v_locales" ADD CONSTRAINT "_lodges_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_lodges_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries_days_locales" ADD CONSTRAINT "itineraries_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."itineraries_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries_locales" ADD CONSTRAINT "itineraries_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_version_days_locales" ADD CONSTRAINT "_itineraries_v_version_days_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_itineraries_v_version_days"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_locales" ADD CONSTRAINT "_itineraries_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_itineraries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts_locales" ADD CONSTRAINT "posts_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_locales" ADD CONSTRAINT "_posts_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_posts_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides_locales" ADD CONSTRAINT "home_page_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars_locales" ADD CONSTRAINT "home_page_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_testimonials_locales" ADD CONSTRAINT "home_page_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_locales" ADD CONSTRAINT "home_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_slides_locales" ADD CONSTRAINT "_home_page_v_version_hero_slides_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_hero_slides"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_pillars_locales" ADD CONSTRAINT "_home_page_v_version_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_testimonials_locales" ADD CONSTRAINT "_home_page_v_version_testimonials_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v_version_testimonials"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_locales" ADD CONSTRAINT "_home_page_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_locales" ADD CONSTRAINT "site_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expert_settings_locales" ADD CONSTRAINT "expert_settings_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expert_settings"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "destinations_highlights_locales_locale_parent_id_unique" ON "destinations_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "destinations_highlights_locales_parent_id_idx" ON "destinations_highlights_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "destinations_locales_locale_parent_id_unique" ON "destinations_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "destinations_locales_parent_id_idx" ON "destinations_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_destinations_v_version_highlights_locales_locale_parent_id_" ON "_destinations_v_version_highlights_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_destinations_v_version_highlights_locales_parent_id_idx" ON "_destinations_v_version_highlights_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_destinations_v_locales_locale_parent_id_unique" ON "_destinations_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_destinations_v_locales_parent_id_idx" ON "_destinations_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "lodges_locales_locale_parent_id_unique" ON "lodges_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "lodges_locales_parent_id_idx" ON "lodges_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_lodges_v_locales_locale_parent_id_unique" ON "_lodges_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_lodges_v_locales_parent_id_idx" ON "_lodges_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "itineraries_days_locales_locale_parent_id_unique" ON "itineraries_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "itineraries_days_locales_parent_id_idx" ON "itineraries_days_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "itineraries_locales_locale_parent_id_unique" ON "itineraries_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "itineraries_locales_parent_id_idx" ON "itineraries_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_itineraries_v_version_days_locales_locale_parent_id_unique" ON "_itineraries_v_version_days_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_itineraries_v_version_days_locales_parent_id_idx" ON "_itineraries_v_version_days_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_itineraries_v_locales_locale_parent_id_unique" ON "_itineraries_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_itineraries_v_locales_parent_id_idx" ON "_itineraries_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "posts_locales_locale_parent_id_unique" ON "posts_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "posts_locales_parent_id_idx" ON "posts_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_posts_v_locales_locale_parent_id_unique" ON "_posts_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_posts_v_locales_parent_id_idx" ON "_posts_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_hero_slides_locales_locale_parent_id_unique" ON "home_page_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_hero_slides_locales_parent_id_idx" ON "home_page_hero_slides_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_pillars_locales_locale_parent_id_unique" ON "home_page_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_pillars_locales_parent_id_idx" ON "home_page_pillars_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_testimonials_locales_locale_parent_id_unique" ON "home_page_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_testimonials_locales_parent_id_idx" ON "home_page_testimonials_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_page_locales_locale_parent_id_unique" ON "home_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_page_locales_parent_id_idx" ON "home_page_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_hero_slides_locales_locale_parent_id_un" ON "_home_page_v_version_hero_slides_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_hero_slides_locales_parent_id_idx" ON "_home_page_v_version_hero_slides_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_pillars_locales_locale_parent_id_unique" ON "_home_page_v_version_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_pillars_locales_parent_id_idx" ON "_home_page_v_version_pillars_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_version_testimonials_locales_locale_parent_id_u" ON "_home_page_v_version_testimonials_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_version_testimonials_locales_parent_id_idx" ON "_home_page_v_version_testimonials_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_home_page_v_locales_locale_parent_id_unique" ON "_home_page_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_home_page_v_locales_parent_id_idx" ON "_home_page_v_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_settings_locales_locale_parent_id_unique" ON "site_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_settings_locales_parent_id_idx" ON "site_settings_locales" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "expert_settings_locales_locale_parent_id_unique" ON "expert_settings_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "expert_settings_locales_parent_id_idx" ON "expert_settings_locales" USING btree ("_parent_id");
  CREATE INDEX "destinations_texts_locale_parent" ON "destinations_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_destinations_v_snapshot_idx" ON "_destinations_v" USING btree ("snapshot");
  CREATE INDEX "_destinations_v_published_locale_idx" ON "_destinations_v" USING btree ("published_locale");
  CREATE INDEX "_destinations_v_texts_locale_parent" ON "_destinations_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "lodges_texts_locale_parent" ON "lodges_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_lodges_v_snapshot_idx" ON "_lodges_v" USING btree ("snapshot");
  CREATE INDEX "_lodges_v_published_locale_idx" ON "_lodges_v" USING btree ("published_locale");
  CREATE INDEX "_lodges_v_texts_locale_parent" ON "_lodges_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "itineraries_texts_locale_parent" ON "itineraries_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_itineraries_v_snapshot_idx" ON "_itineraries_v" USING btree ("snapshot");
  CREATE INDEX "_itineraries_v_published_locale_idx" ON "_itineraries_v" USING btree ("published_locale");
  CREATE INDEX "_itineraries_v_texts_locale_parent" ON "_itineraries_v_texts" USING btree ("locale","parent_id");
  CREATE INDEX "_posts_v_snapshot_idx" ON "_posts_v" USING btree ("snapshot");
  CREATE INDEX "_posts_v_published_locale_idx" ON "_posts_v" USING btree ("published_locale");
  CREATE INDEX "_home_page_v_snapshot_idx" ON "_home_page_v" USING btree ("snapshot");
  CREATE INDEX "_home_page_v_published_locale_idx" ON "_home_page_v" USING btree ("published_locale");
  -- Keep existing content: it becomes the English version.
  INSERT INTO "destinations_highlights_locales" ("text", "_locale", "_parent_id") SELECT "text", 'en', "id" FROM "destinations_highlights";
  INSERT INTO "destinations_locales" ("name", "tagline", "summary", "body", "_locale", "_parent_id") SELECT "name", "tagline", "summary", "body", 'en', "id" FROM "destinations";
  INSERT INTO "_destinations_v_version_highlights_locales" ("text", "_locale", "_parent_id") SELECT "text", 'en', "id" FROM "_destinations_v_version_highlights";
  INSERT INTO "_destinations_v_locales" ("version_name", "version_tagline", "version_summary", "version_body", "_locale", "_parent_id") SELECT "version_name", "version_tagline", "version_summary", "version_body", 'en', "id" FROM "_destinations_v";
  INSERT INTO "lodges_locales" ("summary", "body", "_locale", "_parent_id") SELECT "summary", "body", 'en', "id" FROM "lodges";
  INSERT INTO "_lodges_v_locales" ("version_summary", "version_body", "_locale", "_parent_id") SELECT "version_summary", "version_body", 'en', "id" FROM "_lodges_v";
  INSERT INTO "itineraries_days_locales" ("day_range", "title", "description", "_locale", "_parent_id") SELECT "day_range", "title", "description", 'en', "id" FROM "itineraries_days";
  INSERT INTO "itineraries_locales" ("title", "summary", "_locale", "_parent_id") SELECT "title", "summary", 'en', "id" FROM "itineraries";
  INSERT INTO "_itineraries_v_version_days_locales" ("day_range", "title", "description", "_locale", "_parent_id") SELECT "day_range", "title", "description", 'en', "id" FROM "_itineraries_v_version_days";
  INSERT INTO "_itineraries_v_locales" ("version_title", "version_summary", "_locale", "_parent_id") SELECT "version_title", "version_summary", 'en', "id" FROM "_itineraries_v";
  INSERT INTO "posts_locales" ("title", "excerpt", "body", "_locale", "_parent_id") SELECT "title", "excerpt", "body", 'en', "id" FROM "posts";
  INSERT INTO "_posts_v_locales" ("version_title", "version_excerpt", "version_body", "_locale", "_parent_id") SELECT "version_title", "version_excerpt", "version_body", 'en', "id" FROM "_posts_v";
  INSERT INTO "home_page_hero_slides_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "home_page_hero_slides";
  INSERT INTO "home_page_pillars_locales" ("title", "body", "_locale", "_parent_id") SELECT "title", "body", 'en', "id" FROM "home_page_pillars";
  INSERT INTO "home_page_testimonials_locales" ("quote", "origin", "_locale", "_parent_id") SELECT "quote", "origin", 'en', "id" FROM "home_page_testimonials";
  INSERT INTO "home_page_locales" ("hero_subheading", "intro_heading", "intro_body", "expert_banner_heading", "expert_banner_body", "_locale", "_parent_id") SELECT "hero_subheading", "intro_heading", "intro_body", "expert_banner_heading", "expert_banner_body", 'en', "id" FROM "home_page";
  INSERT INTO "_home_page_v_version_hero_slides_locales" ("eyebrow", "heading", "_locale", "_parent_id") SELECT "eyebrow", "heading", 'en', "id" FROM "_home_page_v_version_hero_slides";
  INSERT INTO "_home_page_v_version_pillars_locales" ("title", "body", "_locale", "_parent_id") SELECT "title", "body", 'en', "id" FROM "_home_page_v_version_pillars";
  INSERT INTO "_home_page_v_version_testimonials_locales" ("quote", "origin", "_locale", "_parent_id") SELECT "quote", "origin", 'en', "id" FROM "_home_page_v_version_testimonials";
  INSERT INTO "_home_page_v_locales" ("version_hero_subheading", "version_intro_heading", "version_intro_body", "version_expert_banner_heading", "version_expert_banner_body", "_locale", "_parent_id") SELECT "version_hero_subheading", "version_intro_heading", "version_intro_body", "version_expert_banner_heading", "version_expert_banner_body", 'en', "id" FROM "_home_page_v";
  INSERT INTO "site_settings_locales" ("tagline", "footer_note", "_locale", "_parent_id") SELECT "tagline", "footer_note", 'en', "id" FROM "site_settings";
  INSERT INTO "expert_settings_locales" ("expert_title", "greeting", "_locale", "_parent_id") SELECT "expert_title", "greeting", 'en', "id" FROM "expert_settings";
  UPDATE "destinations_texts" SET "locale" = 'en';
  UPDATE "_destinations_v_texts" SET "locale" = 'en';
  UPDATE "lodges_texts" SET "locale" = 'en';
  UPDATE "_lodges_v_texts" SET "locale" = 'en';
  UPDATE "itineraries_texts" SET "locale" = 'en';
  UPDATE "_itineraries_v_texts" SET "locale" = 'en';
  UPDATE "_destinations_v" SET "snapshot" = false;
  UPDATE "_lodges_v" SET "snapshot" = false;
  UPDATE "_itineraries_v" SET "snapshot" = false;
  UPDATE "_posts_v" SET "snapshot" = false;
  UPDATE "_home_page_v" SET "snapshot" = false;
  ALTER TABLE "destinations_highlights" DROP COLUMN "text";
  ALTER TABLE "destinations" DROP COLUMN "name";
  ALTER TABLE "destinations" DROP COLUMN "tagline";
  ALTER TABLE "destinations" DROP COLUMN "summary";
  ALTER TABLE "destinations" DROP COLUMN "body";
  ALTER TABLE "_destinations_v_version_highlights" DROP COLUMN "text";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_name";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_tagline";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_summary";
  ALTER TABLE "_destinations_v" DROP COLUMN "version_body";
  ALTER TABLE "lodges" DROP COLUMN "summary";
  ALTER TABLE "lodges" DROP COLUMN "body";
  ALTER TABLE "_lodges_v" DROP COLUMN "version_summary";
  ALTER TABLE "_lodges_v" DROP COLUMN "version_body";
  ALTER TABLE "itineraries_days" DROP COLUMN "day_range";
  ALTER TABLE "itineraries_days" DROP COLUMN "title";
  ALTER TABLE "itineraries_days" DROP COLUMN "description";
  ALTER TABLE "itineraries" DROP COLUMN "title";
  ALTER TABLE "itineraries" DROP COLUMN "summary";
  ALTER TABLE "_itineraries_v_version_days" DROP COLUMN "day_range";
  ALTER TABLE "_itineraries_v_version_days" DROP COLUMN "title";
  ALTER TABLE "_itineraries_v_version_days" DROP COLUMN "description";
  ALTER TABLE "_itineraries_v" DROP COLUMN "version_title";
  ALTER TABLE "_itineraries_v" DROP COLUMN "version_summary";
  ALTER TABLE "posts" DROP COLUMN "title";
  ALTER TABLE "posts" DROP COLUMN "excerpt";
  ALTER TABLE "posts" DROP COLUMN "body";
  ALTER TABLE "_posts_v" DROP COLUMN "version_title";
  ALTER TABLE "_posts_v" DROP COLUMN "version_excerpt";
  ALTER TABLE "_posts_v" DROP COLUMN "version_body";
  ALTER TABLE "home_page_hero_slides" DROP COLUMN "eyebrow";
  ALTER TABLE "home_page_hero_slides" DROP COLUMN "heading";
  ALTER TABLE "home_page_pillars" DROP COLUMN "title";
  ALTER TABLE "home_page_pillars" DROP COLUMN "body";
  ALTER TABLE "home_page_testimonials" DROP COLUMN "quote";
  ALTER TABLE "home_page_testimonials" DROP COLUMN "origin";
  ALTER TABLE "home_page" DROP COLUMN "hero_subheading";
  ALTER TABLE "home_page" DROP COLUMN "intro_heading";
  ALTER TABLE "home_page" DROP COLUMN "intro_body";
  ALTER TABLE "home_page" DROP COLUMN "expert_banner_heading";
  ALTER TABLE "home_page" DROP COLUMN "expert_banner_body";
  ALTER TABLE "_home_page_v_version_hero_slides" DROP COLUMN "eyebrow";
  ALTER TABLE "_home_page_v_version_hero_slides" DROP COLUMN "heading";
  ALTER TABLE "_home_page_v_version_pillars" DROP COLUMN "title";
  ALTER TABLE "_home_page_v_version_pillars" DROP COLUMN "body";
  ALTER TABLE "_home_page_v_version_testimonials" DROP COLUMN "quote";
  ALTER TABLE "_home_page_v_version_testimonials" DROP COLUMN "origin";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_hero_subheading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_intro_heading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_intro_body";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_expert_banner_heading";
  ALTER TABLE "_home_page_v" DROP COLUMN "version_expert_banner_body";
  ALTER TABLE "site_settings" DROP COLUMN "tagline";
  ALTER TABLE "site_settings" DROP COLUMN "footer_note";
  ALTER TABLE "expert_settings" DROP COLUMN "expert_title";
  ALTER TABLE "expert_settings" DROP COLUMN "greeting";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "destinations_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "destinations_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_version_highlights_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_destinations_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "lodges_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_lodges_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "itineraries_days_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "itineraries_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_itineraries_v_version_days_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_itineraries_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "posts_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_posts_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_pillars_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "home_page_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_hero_slides_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_pillars_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_version_testimonials_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_home_page_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "site_settings_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "expert_settings_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "destinations_highlights_locales" CASCADE;
  DROP TABLE "destinations_locales" CASCADE;
  DROP TABLE "_destinations_v_version_highlights_locales" CASCADE;
  DROP TABLE "_destinations_v_locales" CASCADE;
  DROP TABLE "lodges_locales" CASCADE;
  DROP TABLE "_lodges_v_locales" CASCADE;
  DROP TABLE "itineraries_days_locales" CASCADE;
  DROP TABLE "itineraries_locales" CASCADE;
  DROP TABLE "_itineraries_v_version_days_locales" CASCADE;
  DROP TABLE "_itineraries_v_locales" CASCADE;
  DROP TABLE "posts_locales" CASCADE;
  DROP TABLE "_posts_v_locales" CASCADE;
  DROP TABLE "home_page_hero_slides_locales" CASCADE;
  DROP TABLE "home_page_pillars_locales" CASCADE;
  DROP TABLE "home_page_testimonials_locales" CASCADE;
  DROP TABLE "home_page_locales" CASCADE;
  DROP TABLE "_home_page_v_version_hero_slides_locales" CASCADE;
  DROP TABLE "_home_page_v_version_pillars_locales" CASCADE;
  DROP TABLE "_home_page_v_version_testimonials_locales" CASCADE;
  DROP TABLE "_home_page_v_locales" CASCADE;
  DROP TABLE "site_settings_locales" CASCADE;
  DROP TABLE "expert_settings_locales" CASCADE;
  DROP INDEX "destinations_texts_locale_parent";
  DROP INDEX "_destinations_v_snapshot_idx";
  DROP INDEX "_destinations_v_published_locale_idx";
  DROP INDEX "_destinations_v_texts_locale_parent";
  DROP INDEX "lodges_texts_locale_parent";
  DROP INDEX "_lodges_v_snapshot_idx";
  DROP INDEX "_lodges_v_published_locale_idx";
  DROP INDEX "_lodges_v_texts_locale_parent";
  DROP INDEX "itineraries_texts_locale_parent";
  DROP INDEX "_itineraries_v_snapshot_idx";
  DROP INDEX "_itineraries_v_published_locale_idx";
  DROP INDEX "_itineraries_v_texts_locale_parent";
  DROP INDEX "_posts_v_snapshot_idx";
  DROP INDEX "_posts_v_published_locale_idx";
  DROP INDEX "_home_page_v_snapshot_idx";
  DROP INDEX "_home_page_v_published_locale_idx";
  ALTER TABLE "destinations_highlights" ADD COLUMN "text" varchar;
  ALTER TABLE "destinations" ADD COLUMN "name" varchar;
  ALTER TABLE "destinations" ADD COLUMN "tagline" varchar;
  ALTER TABLE "destinations" ADD COLUMN "summary" varchar;
  ALTER TABLE "destinations" ADD COLUMN "body" jsonb;
  ALTER TABLE "_destinations_v_version_highlights" ADD COLUMN "text" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_name" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_tagline" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_destinations_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "lodges" ADD COLUMN "summary" varchar;
  ALTER TABLE "lodges" ADD COLUMN "body" jsonb;
  ALTER TABLE "_lodges_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "_lodges_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "itineraries_days" ADD COLUMN "day_range" varchar;
  ALTER TABLE "itineraries_days" ADD COLUMN "title" varchar;
  ALTER TABLE "itineraries_days" ADD COLUMN "description" varchar;
  ALTER TABLE "itineraries" ADD COLUMN "title" varchar;
  ALTER TABLE "itineraries" ADD COLUMN "summary" varchar;
  ALTER TABLE "_itineraries_v_version_days" ADD COLUMN "day_range" varchar;
  ALTER TABLE "_itineraries_v_version_days" ADD COLUMN "title" varchar;
  ALTER TABLE "_itineraries_v_version_days" ADD COLUMN "description" varchar;
  ALTER TABLE "_itineraries_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_itineraries_v" ADD COLUMN "version_summary" varchar;
  ALTER TABLE "posts" ADD COLUMN "title" varchar;
  ALTER TABLE "posts" ADD COLUMN "excerpt" varchar;
  ALTER TABLE "posts" ADD COLUMN "body" jsonb;
  ALTER TABLE "_posts_v" ADD COLUMN "version_title" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_excerpt" varchar;
  ALTER TABLE "_posts_v" ADD COLUMN "version_body" jsonb;
  ALTER TABLE "home_page_hero_slides" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "home_page_hero_slides" ADD COLUMN "heading" varchar;
  ALTER TABLE "home_page_pillars" ADD COLUMN "title" varchar;
  ALTER TABLE "home_page_pillars" ADD COLUMN "body" varchar;
  ALTER TABLE "home_page_testimonials" ADD COLUMN "quote" varchar;
  ALTER TABLE "home_page_testimonials" ADD COLUMN "origin" varchar;
  ALTER TABLE "home_page" ADD COLUMN "hero_subheading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "intro_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "intro_body" varchar;
  ALTER TABLE "home_page" ADD COLUMN "expert_banner_heading" varchar;
  ALTER TABLE "home_page" ADD COLUMN "expert_banner_body" varchar;
  ALTER TABLE "_home_page_v_version_hero_slides" ADD COLUMN "eyebrow" varchar;
  ALTER TABLE "_home_page_v_version_hero_slides" ADD COLUMN "heading" varchar;
  ALTER TABLE "_home_page_v_version_pillars" ADD COLUMN "title" varchar;
  ALTER TABLE "_home_page_v_version_pillars" ADD COLUMN "body" varchar;
  ALTER TABLE "_home_page_v_version_testimonials" ADD COLUMN "quote" varchar;
  ALTER TABLE "_home_page_v_version_testimonials" ADD COLUMN "origin" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_hero_subheading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_intro_heading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_intro_body" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_expert_banner_heading" varchar;
  ALTER TABLE "_home_page_v" ADD COLUMN "version_expert_banner_body" varchar;
  ALTER TABLE "site_settings" ADD COLUMN "tagline" varchar DEFAULT 'Your choice. Your holiday. Our mission.';
  ALTER TABLE "site_settings" ADD COLUMN "footer_note" varchar;
  ALTER TABLE "expert_settings" ADD COLUMN "expert_title" varchar DEFAULT 'Safari Expert, Arusha';
  ALTER TABLE "expert_settings" ADD COLUMN "greeting" varchar DEFAULT 'Karibu! I''m Baraka, the All in Tanzania AI safari expert. I''ve learned from our guides and planners, so ask me anything about parks, seasons, lodges or family trips, by typing or by talking. Tell me what you dream of seeing and we''ll shape your safari together.';
  ALTER TABLE "destinations_texts" DROP COLUMN "locale";
  ALTER TABLE "_destinations_v" DROP COLUMN "snapshot";
  ALTER TABLE "_destinations_v" DROP COLUMN "published_locale";
  ALTER TABLE "_destinations_v_texts" DROP COLUMN "locale";
  ALTER TABLE "lodges_texts" DROP COLUMN "locale";
  ALTER TABLE "_lodges_v" DROP COLUMN "snapshot";
  ALTER TABLE "_lodges_v" DROP COLUMN "published_locale";
  ALTER TABLE "_lodges_v_texts" DROP COLUMN "locale";
  ALTER TABLE "itineraries_texts" DROP COLUMN "locale";
  ALTER TABLE "_itineraries_v" DROP COLUMN "snapshot";
  ALTER TABLE "_itineraries_v" DROP COLUMN "published_locale";
  ALTER TABLE "_itineraries_v_texts" DROP COLUMN "locale";
  ALTER TABLE "_posts_v" DROP COLUMN "snapshot";
  ALTER TABLE "_posts_v" DROP COLUMN "published_locale";
  ALTER TABLE "_home_page_v" DROP COLUMN "snapshot";
  ALTER TABLE "_home_page_v" DROP COLUMN "published_locale";
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum__destinations_v_published_locale";
  DROP TYPE "public"."enum__lodges_v_published_locale";
  DROP TYPE "public"."enum__itineraries_v_published_locale";
  DROP TYPE "public"."enum__posts_v_published_locale";
  DROP TYPE "public"."enum__home_page_v_published_locale";`)
}
