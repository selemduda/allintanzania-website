import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "expert_chats" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"summary" varchar,
  	"turns" numeric DEFAULT 0,
  	"enquiry_id" integer,
  	"transcript" jsonb,
  	"token" varchar,
  	"messages" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "expert_settings" ALTER COLUMN "greeting" SET DEFAULT 'Karibu! I''m Baraka, the All in Tanzania AI safari expert. I''ve learned from our guides and planners, so ask me anything about parks, seasons, lodges or family trips, by typing or by talking. Tell me what you dream of seeing and we''ll shape your safari together.';
  ALTER TABLE "expert_settings" ALTER COLUMN "personality" SET DEFAULT 'Warm, knowledgeable and honest. Speaks in the style of a seasoned Tanzanian guide: uses the odd Swahili word (karibu, asante, pole pole, hakuna matata) naturally, paints vivid pictures of life in the bush (a dawn game drive, lions calling at night), and is practical about budgets, seasons and travel times. Never pushy. Always recommends our own safaris and partner lodges first.';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "expert_chats_id" integer;
  ALTER TABLE "pricing_settings" ADD COLUMN "show_prices" boolean DEFAULT false;
  ALTER TABLE "expert_chats" ADD CONSTRAINT "expert_chats_enquiry_id_enquiries_id_fk" FOREIGN KEY ("enquiry_id") REFERENCES "public"."enquiries"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "expert_chats_enquiry_idx" ON "expert_chats" USING btree ("enquiry_id");
  CREATE UNIQUE INDEX "expert_chats_token_idx" ON "expert_chats" USING btree ("token");
  CREATE INDEX "expert_chats_updated_at_idx" ON "expert_chats" USING btree ("updated_at");
  CREATE INDEX "expert_chats_created_at_idx" ON "expert_chats" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_expert_chats_fk" FOREIGN KEY ("expert_chats_id") REFERENCES "public"."expert_chats"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_expert_chats_id_idx" ON "payload_locked_documents_rels" USING btree ("expert_chats_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "expert_chats" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "expert_chats" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_expert_chats_fk";
  
  DROP INDEX "payload_locked_documents_rels_expert_chats_id_idx";
  ALTER TABLE "expert_settings" ALTER COLUMN "greeting" SET DEFAULT 'Karibu! I''m Baraka, born and raised near Arusha, and I''ve spent fifteen years guiding in the Serengeti. Tell me what you dream of seeing and I''ll help you shape your safari.';
  ALTER TABLE "expert_settings" ALTER COLUMN "personality" SET DEFAULT 'Warm, knowledgeable and honest. Speaks like a seasoned Tanzanian guide: uses the odd Swahili word (karibu, asante, pole pole, hakuna matata) naturally, tells short vivid stories from the bush, and is practical about budgets, seasons and travel times. Never pushy. Always recommends our own safaris and partner lodges first.';
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "expert_chats_id";
  ALTER TABLE "pricing_settings" DROP COLUMN "show_prices";`)
}
