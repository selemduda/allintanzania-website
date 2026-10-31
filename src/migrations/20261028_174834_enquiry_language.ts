import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_enquiries_language" AS ENUM('en', 'no');
  ALTER TABLE "enquiries" ADD COLUMN "language" "enum_enquiries_language" DEFAULT 'en';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "enquiries" DROP COLUMN "language";
  DROP TYPE "public"."enum_enquiries_language";`)
}
