import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "about_page_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "about_page_sections_locales" (
  	"heading" varchar,
  	"body" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "about_page_values_locales" (
  	"title" varchar NOT NULL,
  	"body" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "about_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show_logo" boolean DEFAULT true,
  	"image_id" integer,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "about_page_locales" (
  	"heading" varchar,
  	"intro" varchar,
  	"closing_heading" varchar,
  	"meta_title" varchar,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "about_page_sections" ADD CONSTRAINT "about_page_sections_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_sections" ADD CONSTRAINT "about_page_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_sections_locales" ADD CONSTRAINT "about_page_sections_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_sections"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values" ADD CONSTRAINT "about_page_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page_values_locales" ADD CONSTRAINT "about_page_values_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page_values"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "about_page" ADD CONSTRAINT "about_page_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "about_page_locales" ADD CONSTRAINT "about_page_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."about_page"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "about_page_sections_order_idx" ON "about_page_sections" USING btree ("_order");
  CREATE INDEX "about_page_sections_parent_id_idx" ON "about_page_sections" USING btree ("_parent_id");
  CREATE INDEX "about_page_sections_image_idx" ON "about_page_sections" USING btree ("image_id");
  CREATE UNIQUE INDEX "about_page_sections_locales_locale_parent_id_unique" ON "about_page_sections_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_sections_locales_parent_id_idx" ON "about_page_sections_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_values_order_idx" ON "about_page_values" USING btree ("_order");
  CREATE INDEX "about_page_values_parent_id_idx" ON "about_page_values" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "about_page_values_locales_locale_parent_id_unique" ON "about_page_values_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_values_locales_parent_id_idx" ON "about_page_values_locales" USING btree ("_parent_id");
  CREATE INDEX "about_page_image_idx" ON "about_page" USING btree ("image_id");
  CREATE UNIQUE INDEX "about_page_locales_locale_parent_id_unique" ON "about_page_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "about_page_locales_parent_id_idx" ON "about_page_locales" USING btree ("_parent_id");`)

  // Start the editable About page with the wording the site showed before, and copy the
  // "Why travel with us" boxes from the Home page, so nothing changes on the live site.
  const text = {
    en: {
      heading: 'Tanzania is our home',
      intro:
        'All in Tanzania is a Tanzanian-owned safari company. Our guides grew up between the Serengeti and Kilimanjaro, and every journey we plan is shaped around one thing: your choice, your holiday, our mission.',
      closingHeading: 'Ready when you are',
      metaTitle: 'About us',
      metaDescription: 'A Tanzanian–Norwegian safari company with offices in Tanzania and Tønsberg, Norway.',
    },
    no: {
      heading: 'Tanzania er vårt hjem',
      intro:
        'All in Tanzania er et tanzaniansk-eid safariselskap med norsk kontor i Tønsberg. Guidene våre vokste opp mellom Serengeti og Kilimanjaro, og hver reise vi planlegger bygger på én ting: ditt valg, din ferie, vårt oppdrag.',
      closingHeading: 'Klar når du er',
      metaTitle: 'Om oss',
      metaDescription: 'Et tanzaniansk-norsk safariselskap med kontorer i Tanzania og i Tønsberg.',
    },
  } as const

  const pillars = async (locale: 'en' | 'no') => {
    const home = await payload.findGlobal({ slug: 'home-page', locale, depth: 0, req, overrideAccess: true })
    return (home.pillars ?? []).map((p) => ({ title: p.title, body: p.body }))
  }

  const en = await payload.updateGlobal({
    slug: 'about-page',
    locale: 'en',
    req,
    overrideAccess: true,
    data: { showLogo: true, ...text.en, values: await pillars('en') },
  })
  const noPillars = await pillars('no')
  await payload.updateGlobal({
    slug: 'about-page',
    locale: 'no',
    req,
    overrideAccess: true,
    data: {
      ...text.no,
      // Same rows as English (matched by id), with the Norwegian wording.
      values: (en.values ?? []).map((row, i) => ({
        id: row.id,
        title: noPillars[i]?.title || row.title,
        body: noPillars[i]?.body ?? row.body,
      })),
    },
  })
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "about_page_sections" CASCADE;
  DROP TABLE "about_page_sections_locales" CASCADE;
  DROP TABLE "about_page_values" CASCADE;
  DROP TABLE "about_page_values_locales" CASCADE;
  DROP TABLE "about_page" CASCADE;
  DROP TABLE "about_page_locales" CASCADE;`)
}
