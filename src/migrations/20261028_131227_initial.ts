import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_destinations_best_months" AS ENUM('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  CREATE TYPE "public"."enum_destinations_region" AS ENUM('northern', 'southern', 'coast', 'mountains');
  CREATE TYPE "public"."enum_destinations_type" AS ENUM('park', 'conservation', 'reserve', 'beach', 'mountain', 'town');
  CREATE TYPE "public"."enum_destinations_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__destinations_v_version_best_months" AS ENUM('Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
  CREATE TYPE "public"."enum__destinations_v_version_region" AS ENUM('northern', 'southern', 'coast', 'mountains');
  CREATE TYPE "public"."enum__destinations_v_version_type" AS ENUM('park', 'conservation', 'reserve', 'beach', 'mountain', 'town');
  CREATE TYPE "public"."enum__destinations_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_lodges_tier" AS ENUM('comfort', 'classic', 'luxury');
  CREATE TYPE "public"."enum_lodges_style" AS ENUM('tented', 'lodge', 'mobile', 'beach', 'hotel');
  CREATE TYPE "public"."enum_lodges_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__lodges_v_version_tier" AS ENUM('comfort', 'classic', 'luxury');
  CREATE TYPE "public"."enum__lodges_v_version_style" AS ENUM('tented', 'lodge', 'mobile', 'beach', 'hotel');
  CREATE TYPE "public"."enum__lodges_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_itineraries_styles" AS ENUM('migration', 'classic', 'beach', 'honeymoon', 'family', 'kilimanjaro', 'walking', 'cultural');
  CREATE TYPE "public"."enum_itineraries_tier" AS ENUM('comfort', 'classic', 'luxury');
  CREATE TYPE "public"."enum_itineraries_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__itineraries_v_version_styles" AS ENUM('migration', 'classic', 'beach', 'honeymoon', 'family', 'kilimanjaro', 'walking', 'cultural');
  CREATE TYPE "public"."enum__itineraries_v_version_tier" AS ENUM('comfort', 'classic', 'luxury');
  CREATE TYPE "public"."enum__itineraries_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_posts_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__posts_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_media_source" AS ENUM('upload', 'dropbox', 'sample');
  CREATE TYPE "public"."enum_enquiries_source" AS ENUM('contact', 'builder', 'ai');
  CREATE TYPE "public"."enum_enquiries_status" AS ENUM('new', 'contacted', 'quoted', 'booked', 'lost');
  CREATE TYPE "public"."enum_users_roles" AS ENUM('admin', 'editor', 'sales');
  CREATE TYPE "public"."enum_payload_folders_folder_type" AS ENUM('media');
  CREATE TYPE "public"."enum_home_page_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__home_page_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_site_settings_social_platform" AS ENUM('instagram', 'facebook', 'youtube', 'tiktok', 'tripadvisor', 'linkedin', 'x');
  CREATE TYPE "public"."enum_pricing_settings_seasons_jan" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_feb" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_mar" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_apr" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_may" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_jun" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_jul" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_aug" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_sep" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_oct" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_nov" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_pricing_settings_seasons_dec" AS ENUM('low', 'high', 'peak');
  CREATE TYPE "public"."enum_expert_settings_voice_provider" AS ENUM('browser', 'elevenlabs');
  CREATE TABLE "destinations_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "destinations_best_months" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_destinations_best_months",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "destinations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"region" "enum_destinations_region",
  	"type" "enum_destinations_type",
  	"order" numeric DEFAULT 100,
  	"tagline" varchar,
  	"hero_image_id" integer,
  	"summary" varchar,
  	"body" jsonb,
  	"recommended_nights" numeric DEFAULT 2,
  	"expert_notes" varchar,
  	"latitude" numeric,
  	"longitude" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_destinations_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "destinations_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "destinations_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_destinations_v_version_highlights" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_destinations_v_version_best_months" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__destinations_v_version_best_months",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_destinations_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_region" "enum__destinations_v_version_region",
  	"version_type" "enum__destinations_v_version_type",
  	"version_order" numeric DEFAULT 100,
  	"version_tagline" varchar,
  	"version_hero_image_id" integer,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_recommended_nights" numeric DEFAULT 2,
  	"version_expert_notes" varchar,
  	"version_latitude" numeric,
  	"version_longitude" numeric,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__destinations_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_destinations_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_destinations_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "lodges" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"slug" varchar,
  	"destination_id" integer,
  	"tier" "enum_lodges_tier" DEFAULT 'classic',
  	"style" "enum_lodges_style",
  	"price_code" varchar,
  	"hero_image_id" integer,
  	"summary" varchar,
  	"body" jsonb,
  	"featured" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_lodges_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "lodges_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "lodges_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_lodges_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_name" varchar,
  	"version_slug" varchar,
  	"version_destination_id" integer,
  	"version_tier" "enum__lodges_v_version_tier" DEFAULT 'classic',
  	"version_style" "enum__lodges_v_version_style",
  	"version_price_code" varchar,
  	"version_hero_image_id" integer,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_featured" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__lodges_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_lodges_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_lodges_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "itineraries_styles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_itineraries_styles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "itineraries_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day_range" varchar,
  	"title" varchar,
  	"destination_id" integer,
  	"lodge_id" integer,
  	"nights" numeric DEFAULT 1,
  	"description" varchar
  );
  
  CREATE TABLE "itineraries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"duration_days" numeric,
  	"tier" "enum_itineraries_tier" DEFAULT 'classic',
  	"from_price" numeric,
  	"hero_image_id" integer,
  	"summary" varchar,
  	"featured" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_itineraries_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "itineraries_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "_itineraries_v_version_styles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum__itineraries_v_version_styles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "_itineraries_v_version_days" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"day_range" varchar,
  	"title" varchar,
  	"destination_id" integer,
  	"lodge_id" integer,
  	"nights" numeric DEFAULT 1,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_itineraries_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_duration_days" numeric,
  	"version_tier" "enum__itineraries_v_version_tier" DEFAULT 'classic',
  	"version_from_price" numeric,
  	"version_hero_image_id" integer,
  	"version_summary" varchar,
  	"version_featured" boolean,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__itineraries_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_itineraries_v_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "posts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"slug" varchar,
  	"published_at" timestamp(3) with time zone,
  	"author" varchar,
  	"hero_image_id" integer,
  	"excerpt" varchar,
  	"body" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_posts_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_posts_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_title" varchar,
  	"version_slug" varchar,
  	"version_published_at" timestamp(3) with time zone,
  	"version_author" varchar,
  	"version_hero_image_id" integer,
  	"version_excerpt" varchar,
  	"version_body" jsonb,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__posts_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
  	"caption" varchar,
  	"credit" varchar,
  	"source" "enum_media_source" DEFAULT 'upload',
  	"dropbox_path" varchar,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_thumbnail_url" varchar,
  	"sizes_thumbnail_width" numeric,
  	"sizes_thumbnail_height" numeric,
  	"sizes_thumbnail_mime_type" varchar,
  	"sizes_thumbnail_filesize" numeric,
  	"sizes_thumbnail_filename" varchar,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_hero_url" varchar,
  	"sizes_hero_width" numeric,
  	"sizes_hero_height" numeric,
  	"sizes_hero_mime_type" varchar,
  	"sizes_hero_filesize" numeric,
  	"sizes_hero_filename" varchar
  );
  
  CREATE TABLE "enquiries" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar,
  	"country" varchar,
  	"travel_month" varchar,
  	"adults" numeric,
  	"children" numeric,
  	"message" varchar,
  	"trip" jsonb,
  	"estimate_total" numeric,
  	"estimate" jsonb,
  	"chat_transcript" jsonb,
  	"source" "enum_enquiries_source" DEFAULT 'contact',
  	"status" "enum_enquiries_status" DEFAULT 'new',
  	"assigned_to_id" integer,
  	"internal_notes" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "price_lists" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"active" boolean DEFAULT true,
  	"row_count" numeric,
  	"parse_errors" jsonb,
  	"rates" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric
  );
  
  CREATE TABLE "users_roles" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_users_roles",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_folders_folder_type" (
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"value" "enum_payload_folders_folder_type",
  	"id" serial PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "payload_folders" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"folder_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"lodges_id" integer,
  	"itineraries_id" integer,
  	"posts_id" integer,
  	"media_id" integer,
  	"enquiries_id" integer,
  	"price_lists_id" integer,
  	"users_id" integer,
  	"payload_folders_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_page_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar
  );
  
  CREATE TABLE "home_page_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar
  );
  
  CREATE TABLE "home_page_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"origin" varchar
  );
  
  CREATE TABLE "home_page" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_subheading" varchar,
  	"intro_heading" varchar,
  	"intro_body" varchar,
  	"intro_image_id" integer,
  	"expert_banner_heading" varchar,
  	"expert_banner_body" varchar,
  	"expert_banner_image_id" integer,
  	"_status" "enum_home_page_status" DEFAULT 'draft',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_page_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"itineraries_id" integer
  );
  
  CREATE TABLE "_home_page_v_version_hero_slides" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"eyebrow" varchar,
  	"heading" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"body" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v_version_testimonials" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"quote" varchar,
  	"author" varchar,
  	"origin" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_home_page_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"version_hero_subheading" varchar,
  	"version_intro_heading" varchar,
  	"version_intro_body" varchar,
  	"version_intro_image_id" integer,
  	"version_expert_banner_heading" varchar,
  	"version_expert_banner_body" varchar,
  	"version_expert_banner_image_id" integer,
  	"version__status" "enum__home_page_v_version_status" DEFAULT 'draft',
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "_home_page_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"destinations_id" integer,
  	"itineraries_id" integer
  );
  
  CREATE TABLE "site_settings_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"platform" "enum_site_settings_social_platform" NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"company_name" varchar DEFAULT 'All in Tanzania',
  	"tagline" varchar DEFAULT 'Your choice. Your holiday. Our mission.',
  	"email" varchar,
  	"phone" varchar,
  	"whatsapp" varchar,
  	"address" varchar,
  	"footer_note" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings_texts" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer NOT NULL,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pricing_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"seasons_jan" "enum_pricing_settings_seasons_jan" DEFAULT 'high' NOT NULL,
  	"seasons_feb" "enum_pricing_settings_seasons_feb" DEFAULT 'high' NOT NULL,
  	"seasons_mar" "enum_pricing_settings_seasons_mar" DEFAULT 'high' NOT NULL,
  	"seasons_apr" "enum_pricing_settings_seasons_apr" DEFAULT 'low' NOT NULL,
  	"seasons_may" "enum_pricing_settings_seasons_may" DEFAULT 'low' NOT NULL,
  	"seasons_jun" "enum_pricing_settings_seasons_jun" DEFAULT 'high' NOT NULL,
  	"seasons_jul" "enum_pricing_settings_seasons_jul" DEFAULT 'peak' NOT NULL,
  	"seasons_aug" "enum_pricing_settings_seasons_aug" DEFAULT 'peak' NOT NULL,
  	"seasons_sep" "enum_pricing_settings_seasons_sep" DEFAULT 'peak' NOT NULL,
  	"seasons_oct" "enum_pricing_settings_seasons_oct" DEFAULT 'high' NOT NULL,
  	"seasons_nov" "enum_pricing_settings_seasons_nov" DEFAULT 'low' NOT NULL,
  	"seasons_dec" "enum_pricing_settings_seasons_dec" DEFAULT 'peak' NOT NULL,
  	"markup_percent" numeric DEFAULT 20,
  	"vehicle_capacity" numeric DEFAULT 6,
  	"range_percent" numeric DEFAULT 10,
  	"child_age_limit" numeric DEFAULT 15,
  	"fallback_lodge_rates_comfort" numeric DEFAULT 180,
  	"fallback_lodge_rates_classic" numeric DEFAULT 380,
  	"fallback_lodge_rates_luxury" numeric DEFAULT 950,
  	"disclaimer" varchar DEFAULT 'This is an estimate based on our current rates and typical availability. Your safari expert will confirm the final price.',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "expert_settings_facts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"fact" varchar NOT NULL
  );
  
  CREATE TABLE "expert_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT true,
  	"expert_name" varchar DEFAULT 'Baraka',
  	"expert_title" varchar DEFAULT 'Safari Expert, Arusha',
  	"avatar_id" integer,
  	"greeting" varchar DEFAULT 'Karibu! I''m Baraka, born and raised near Arusha, and I''ve spent fifteen years guiding in the Serengeti. Tell me what you dream of seeing and I''ll help you shape your safari.',
  	"personality" varchar DEFAULT 'Warm, knowledgeable and honest. Speaks like a seasoned Tanzanian guide: uses the odd Swahili word (karibu, asante, pole pole, hakuna matata) naturally, tells short vivid stories from the bush, and is practical about budgets, seasons and travel times. Never pushy. Always recommends our own safaris and partner lodges first.',
  	"voice_provider" "enum_expert_settings_voice_provider" DEFAULT 'browser',
  	"voice_voice_id" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "destinations_highlights" ADD CONSTRAINT "destinations_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_best_months" ADD CONSTRAINT "destinations_best_months_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations" ADD CONSTRAINT "destinations_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "destinations_texts" ADD CONSTRAINT "destinations_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "destinations_rels" ADD CONSTRAINT "destinations_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_highlights" ADD CONSTRAINT "_destinations_v_version_highlights_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_version_best_months" ADD CONSTRAINT "_destinations_v_version_best_months_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_parent_id_destinations_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v" ADD CONSTRAINT "_destinations_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_destinations_v_texts" ADD CONSTRAINT "_destinations_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_rels" ADD CONSTRAINT "_destinations_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_destinations_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_destinations_v_rels" ADD CONSTRAINT "_destinations_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lodges" ADD CONSTRAINT "lodges_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lodges" ADD CONSTRAINT "lodges_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "lodges_texts" ADD CONSTRAINT "lodges_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lodges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lodges_rels" ADD CONSTRAINT "lodges_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lodges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "lodges_rels" ADD CONSTRAINT "lodges_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lodges_v" ADD CONSTRAINT "_lodges_v_parent_id_lodges_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."lodges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lodges_v" ADD CONSTRAINT "_lodges_v_version_destination_id_destinations_id_fk" FOREIGN KEY ("version_destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lodges_v" ADD CONSTRAINT "_lodges_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_lodges_v_texts" ADD CONSTRAINT "_lodges_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lodges_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lodges_v_rels" ADD CONSTRAINT "_lodges_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_lodges_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_lodges_v_rels" ADD CONSTRAINT "_lodges_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries_styles" ADD CONSTRAINT "itineraries_styles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries_days" ADD CONSTRAINT "itineraries_days_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "itineraries_days" ADD CONSTRAINT "itineraries_days_lodge_id_lodges_id_fk" FOREIGN KEY ("lodge_id") REFERENCES "public"."lodges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "itineraries_days" ADD CONSTRAINT "itineraries_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "itineraries" ADD CONSTRAINT "itineraries_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "itineraries_texts" ADD CONSTRAINT "itineraries_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_version_styles" ADD CONSTRAINT "_itineraries_v_version_styles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_itineraries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v_version_days" ADD CONSTRAINT "_itineraries_v_version_days_destination_id_destinations_id_fk" FOREIGN KEY ("destination_id") REFERENCES "public"."destinations"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itineraries_v_version_days" ADD CONSTRAINT "_itineraries_v_version_days_lodge_id_lodges_id_fk" FOREIGN KEY ("lodge_id") REFERENCES "public"."lodges"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itineraries_v_version_days" ADD CONSTRAINT "_itineraries_v_version_days_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_itineraries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_itineraries_v" ADD CONSTRAINT "_itineraries_v_parent_id_itineraries_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."itineraries"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itineraries_v" ADD CONSTRAINT "_itineraries_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_itineraries_v_texts" ADD CONSTRAINT "_itineraries_v_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_itineraries_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "posts" ADD CONSTRAINT "posts_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_parent_id_posts_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."posts"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_posts_v" ADD CONSTRAINT "_posts_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "media" ADD CONSTRAINT "media_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_assigned_to_id_users_id_fk" FOREIGN KEY ("assigned_to_id") REFERENCES "public"."users"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_roles" ADD CONSTRAINT "users_roles_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders_folder_type" ADD CONSTRAINT "payload_folders_folder_type_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_folders" ADD CONSTRAINT "payload_folders_folder_id_payload_folders_id_fk" FOREIGN KEY ("folder_id") REFERENCES "public"."payload_folders"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_lodges_fk" FOREIGN KEY ("lodges_id") REFERENCES "public"."lodges"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_itineraries_fk" FOREIGN KEY ("itineraries_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_posts_fk" FOREIGN KEY ("posts_id") REFERENCES "public"."posts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_enquiries_fk" FOREIGN KEY ("enquiries_id") REFERENCES "public"."enquiries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_price_lists_fk" FOREIGN KEY ("price_lists_id") REFERENCES "public"."price_lists"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_payload_folders_fk" FOREIGN KEY ("payload_folders_id") REFERENCES "public"."payload_folders"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_hero_slides" ADD CONSTRAINT "home_page_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_pillars" ADD CONSTRAINT "home_page_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_testimonials" ADD CONSTRAINT "home_page_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_intro_image_id_media_id_fk" FOREIGN KEY ("intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page" ADD CONSTRAINT "home_page_expert_banner_image_id_media_id_fk" FOREIGN KEY ("expert_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."home_page"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_page_rels" ADD CONSTRAINT "home_page_rels_itineraries_fk" FOREIGN KEY ("itineraries_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_slides" ADD CONSTRAINT "_home_page_v_version_hero_slides_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_hero_slides" ADD CONSTRAINT "_home_page_v_version_hero_slides_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_pillars" ADD CONSTRAINT "_home_page_v_version_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_version_testimonials" ADD CONSTRAINT "_home_page_v_version_testimonials_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_intro_image_id_media_id_fk" FOREIGN KEY ("version_intro_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v" ADD CONSTRAINT "_home_page_v_version_expert_banner_image_id_media_id_fk" FOREIGN KEY ("version_expert_banner_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_home_page_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_destinations_fk" FOREIGN KEY ("destinations_id") REFERENCES "public"."destinations"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_home_page_v_rels" ADD CONSTRAINT "_home_page_v_rels_itineraries_fk" FOREIGN KEY ("itineraries_id") REFERENCES "public"."itineraries"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_social" ADD CONSTRAINT "site_settings_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_settings_texts" ADD CONSTRAINT "site_settings_texts_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."site_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expert_settings_facts" ADD CONSTRAINT "expert_settings_facts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."expert_settings"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "expert_settings" ADD CONSTRAINT "expert_settings_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "destinations_highlights_order_idx" ON "destinations_highlights" USING btree ("_order");
  CREATE INDEX "destinations_highlights_parent_id_idx" ON "destinations_highlights" USING btree ("_parent_id");
  CREATE INDEX "destinations_best_months_order_idx" ON "destinations_best_months" USING btree ("order");
  CREATE INDEX "destinations_best_months_parent_idx" ON "destinations_best_months" USING btree ("parent_id");
  CREATE UNIQUE INDEX "destinations_slug_idx" ON "destinations" USING btree ("slug");
  CREATE INDEX "destinations_hero_image_idx" ON "destinations" USING btree ("hero_image_id");
  CREATE INDEX "destinations_updated_at_idx" ON "destinations" USING btree ("updated_at");
  CREATE INDEX "destinations_created_at_idx" ON "destinations" USING btree ("created_at");
  CREATE INDEX "destinations__status_idx" ON "destinations" USING btree ("_status");
  CREATE INDEX "destinations_texts_order_parent" ON "destinations_texts" USING btree ("order","parent_id");
  CREATE INDEX "destinations_rels_order_idx" ON "destinations_rels" USING btree ("order");
  CREATE INDEX "destinations_rels_parent_idx" ON "destinations_rels" USING btree ("parent_id");
  CREATE INDEX "destinations_rels_path_idx" ON "destinations_rels" USING btree ("path");
  CREATE INDEX "destinations_rels_media_id_idx" ON "destinations_rels" USING btree ("media_id");
  CREATE INDEX "_destinations_v_version_highlights_order_idx" ON "_destinations_v_version_highlights" USING btree ("_order");
  CREATE INDEX "_destinations_v_version_highlights_parent_id_idx" ON "_destinations_v_version_highlights" USING btree ("_parent_id");
  CREATE INDEX "_destinations_v_version_best_months_order_idx" ON "_destinations_v_version_best_months" USING btree ("order");
  CREATE INDEX "_destinations_v_version_best_months_parent_idx" ON "_destinations_v_version_best_months" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_parent_idx" ON "_destinations_v" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_version_version_slug_idx" ON "_destinations_v" USING btree ("version_slug");
  CREATE INDEX "_destinations_v_version_version_hero_image_idx" ON "_destinations_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_destinations_v_version_version_updated_at_idx" ON "_destinations_v" USING btree ("version_updated_at");
  CREATE INDEX "_destinations_v_version_version_created_at_idx" ON "_destinations_v" USING btree ("version_created_at");
  CREATE INDEX "_destinations_v_version_version__status_idx" ON "_destinations_v" USING btree ("version__status");
  CREATE INDEX "_destinations_v_created_at_idx" ON "_destinations_v" USING btree ("created_at");
  CREATE INDEX "_destinations_v_updated_at_idx" ON "_destinations_v" USING btree ("updated_at");
  CREATE INDEX "_destinations_v_latest_idx" ON "_destinations_v" USING btree ("latest");
  CREATE INDEX "_destinations_v_texts_order_parent" ON "_destinations_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_destinations_v_rels_order_idx" ON "_destinations_v_rels" USING btree ("order");
  CREATE INDEX "_destinations_v_rels_parent_idx" ON "_destinations_v_rels" USING btree ("parent_id");
  CREATE INDEX "_destinations_v_rels_path_idx" ON "_destinations_v_rels" USING btree ("path");
  CREATE INDEX "_destinations_v_rels_media_id_idx" ON "_destinations_v_rels" USING btree ("media_id");
  CREATE UNIQUE INDEX "lodges_slug_idx" ON "lodges" USING btree ("slug");
  CREATE INDEX "lodges_destination_idx" ON "lodges" USING btree ("destination_id");
  CREATE INDEX "lodges_hero_image_idx" ON "lodges" USING btree ("hero_image_id");
  CREATE INDEX "lodges_updated_at_idx" ON "lodges" USING btree ("updated_at");
  CREATE INDEX "lodges_created_at_idx" ON "lodges" USING btree ("created_at");
  CREATE INDEX "lodges__status_idx" ON "lodges" USING btree ("_status");
  CREATE INDEX "lodges_texts_order_parent" ON "lodges_texts" USING btree ("order","parent_id");
  CREATE INDEX "lodges_rels_order_idx" ON "lodges_rels" USING btree ("order");
  CREATE INDEX "lodges_rels_parent_idx" ON "lodges_rels" USING btree ("parent_id");
  CREATE INDEX "lodges_rels_path_idx" ON "lodges_rels" USING btree ("path");
  CREATE INDEX "lodges_rels_media_id_idx" ON "lodges_rels" USING btree ("media_id");
  CREATE INDEX "_lodges_v_parent_idx" ON "_lodges_v" USING btree ("parent_id");
  CREATE INDEX "_lodges_v_version_version_slug_idx" ON "_lodges_v" USING btree ("version_slug");
  CREATE INDEX "_lodges_v_version_version_destination_idx" ON "_lodges_v" USING btree ("version_destination_id");
  CREATE INDEX "_lodges_v_version_version_hero_image_idx" ON "_lodges_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_lodges_v_version_version_updated_at_idx" ON "_lodges_v" USING btree ("version_updated_at");
  CREATE INDEX "_lodges_v_version_version_created_at_idx" ON "_lodges_v" USING btree ("version_created_at");
  CREATE INDEX "_lodges_v_version_version__status_idx" ON "_lodges_v" USING btree ("version__status");
  CREATE INDEX "_lodges_v_created_at_idx" ON "_lodges_v" USING btree ("created_at");
  CREATE INDEX "_lodges_v_updated_at_idx" ON "_lodges_v" USING btree ("updated_at");
  CREATE INDEX "_lodges_v_latest_idx" ON "_lodges_v" USING btree ("latest");
  CREATE INDEX "_lodges_v_texts_order_parent" ON "_lodges_v_texts" USING btree ("order","parent_id");
  CREATE INDEX "_lodges_v_rels_order_idx" ON "_lodges_v_rels" USING btree ("order");
  CREATE INDEX "_lodges_v_rels_parent_idx" ON "_lodges_v_rels" USING btree ("parent_id");
  CREATE INDEX "_lodges_v_rels_path_idx" ON "_lodges_v_rels" USING btree ("path");
  CREATE INDEX "_lodges_v_rels_media_id_idx" ON "_lodges_v_rels" USING btree ("media_id");
  CREATE INDEX "itineraries_styles_order_idx" ON "itineraries_styles" USING btree ("order");
  CREATE INDEX "itineraries_styles_parent_idx" ON "itineraries_styles" USING btree ("parent_id");
  CREATE INDEX "itineraries_days_order_idx" ON "itineraries_days" USING btree ("_order");
  CREATE INDEX "itineraries_days_parent_id_idx" ON "itineraries_days" USING btree ("_parent_id");
  CREATE INDEX "itineraries_days_destination_idx" ON "itineraries_days" USING btree ("destination_id");
  CREATE INDEX "itineraries_days_lodge_idx" ON "itineraries_days" USING btree ("lodge_id");
  CREATE UNIQUE INDEX "itineraries_slug_idx" ON "itineraries" USING btree ("slug");
  CREATE INDEX "itineraries_hero_image_idx" ON "itineraries" USING btree ("hero_image_id");
  CREATE INDEX "itineraries_updated_at_idx" ON "itineraries" USING btree ("updated_at");
  CREATE INDEX "itineraries_created_at_idx" ON "itineraries" USING btree ("created_at");
  CREATE INDEX "itineraries__status_idx" ON "itineraries" USING btree ("_status");
  CREATE INDEX "itineraries_texts_order_parent" ON "itineraries_texts" USING btree ("order","parent_id");
  CREATE INDEX "_itineraries_v_version_styles_order_idx" ON "_itineraries_v_version_styles" USING btree ("order");
  CREATE INDEX "_itineraries_v_version_styles_parent_idx" ON "_itineraries_v_version_styles" USING btree ("parent_id");
  CREATE INDEX "_itineraries_v_version_days_order_idx" ON "_itineraries_v_version_days" USING btree ("_order");
  CREATE INDEX "_itineraries_v_version_days_parent_id_idx" ON "_itineraries_v_version_days" USING btree ("_parent_id");
  CREATE INDEX "_itineraries_v_version_days_destination_idx" ON "_itineraries_v_version_days" USING btree ("destination_id");
  CREATE INDEX "_itineraries_v_version_days_lodge_idx" ON "_itineraries_v_version_days" USING btree ("lodge_id");
  CREATE INDEX "_itineraries_v_parent_idx" ON "_itineraries_v" USING btree ("parent_id");
  CREATE INDEX "_itineraries_v_version_version_slug_idx" ON "_itineraries_v" USING btree ("version_slug");
  CREATE INDEX "_itineraries_v_version_version_hero_image_idx" ON "_itineraries_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_itineraries_v_version_version_updated_at_idx" ON "_itineraries_v" USING btree ("version_updated_at");
  CREATE INDEX "_itineraries_v_version_version_created_at_idx" ON "_itineraries_v" USING btree ("version_created_at");
  CREATE INDEX "_itineraries_v_version_version__status_idx" ON "_itineraries_v" USING btree ("version__status");
  CREATE INDEX "_itineraries_v_created_at_idx" ON "_itineraries_v" USING btree ("created_at");
  CREATE INDEX "_itineraries_v_updated_at_idx" ON "_itineraries_v" USING btree ("updated_at");
  CREATE INDEX "_itineraries_v_latest_idx" ON "_itineraries_v" USING btree ("latest");
  CREATE INDEX "_itineraries_v_texts_order_parent" ON "_itineraries_v_texts" USING btree ("order","parent_id");
  CREATE UNIQUE INDEX "posts_slug_idx" ON "posts" USING btree ("slug");
  CREATE INDEX "posts_hero_image_idx" ON "posts" USING btree ("hero_image_id");
  CREATE INDEX "posts_updated_at_idx" ON "posts" USING btree ("updated_at");
  CREATE INDEX "posts_created_at_idx" ON "posts" USING btree ("created_at");
  CREATE INDEX "posts__status_idx" ON "posts" USING btree ("_status");
  CREATE INDEX "_posts_v_parent_idx" ON "_posts_v" USING btree ("parent_id");
  CREATE INDEX "_posts_v_version_version_slug_idx" ON "_posts_v" USING btree ("version_slug");
  CREATE INDEX "_posts_v_version_version_hero_image_idx" ON "_posts_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_posts_v_version_version_updated_at_idx" ON "_posts_v" USING btree ("version_updated_at");
  CREATE INDEX "_posts_v_version_version_created_at_idx" ON "_posts_v" USING btree ("version_created_at");
  CREATE INDEX "_posts_v_version_version__status_idx" ON "_posts_v" USING btree ("version__status");
  CREATE INDEX "_posts_v_created_at_idx" ON "_posts_v" USING btree ("created_at");
  CREATE INDEX "_posts_v_updated_at_idx" ON "_posts_v" USING btree ("updated_at");
  CREATE INDEX "_posts_v_latest_idx" ON "_posts_v" USING btree ("latest");
  CREATE INDEX "media_dropbox_path_idx" ON "media" USING btree ("dropbox_path");
  CREATE INDEX "media_folder_idx" ON "media" USING btree ("folder_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_thumbnail_sizes_thumbnail_filename_idx" ON "media" USING btree ("sizes_thumbnail_filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_hero_sizes_hero_filename_idx" ON "media" USING btree ("sizes_hero_filename");
  CREATE INDEX "enquiries_assigned_to_idx" ON "enquiries" USING btree ("assigned_to_id");
  CREATE INDEX "enquiries_updated_at_idx" ON "enquiries" USING btree ("updated_at");
  CREATE INDEX "enquiries_created_at_idx" ON "enquiries" USING btree ("created_at");
  CREATE INDEX "price_lists_updated_at_idx" ON "price_lists" USING btree ("updated_at");
  CREATE INDEX "price_lists_created_at_idx" ON "price_lists" USING btree ("created_at");
  CREATE UNIQUE INDEX "price_lists_filename_idx" ON "price_lists" USING btree ("filename");
  CREATE INDEX "users_roles_order_idx" ON "users_roles" USING btree ("order");
  CREATE INDEX "users_roles_parent_idx" ON "users_roles" USING btree ("parent_id");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_folders_folder_type_order_idx" ON "payload_folders_folder_type" USING btree ("order");
  CREATE INDEX "payload_folders_folder_type_parent_idx" ON "payload_folders_folder_type" USING btree ("parent_id");
  CREATE INDEX "payload_folders_name_idx" ON "payload_folders" USING btree ("name");
  CREATE INDEX "payload_folders_folder_idx" ON "payload_folders" USING btree ("folder_id");
  CREATE INDEX "payload_folders_updated_at_idx" ON "payload_folders" USING btree ("updated_at");
  CREATE INDEX "payload_folders_created_at_idx" ON "payload_folders" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_destinations_id_idx" ON "payload_locked_documents_rels" USING btree ("destinations_id");
  CREATE INDEX "payload_locked_documents_rels_lodges_id_idx" ON "payload_locked_documents_rels" USING btree ("lodges_id");
  CREATE INDEX "payload_locked_documents_rels_itineraries_id_idx" ON "payload_locked_documents_rels" USING btree ("itineraries_id");
  CREATE INDEX "payload_locked_documents_rels_posts_id_idx" ON "payload_locked_documents_rels" USING btree ("posts_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_enquiries_id_idx" ON "payload_locked_documents_rels" USING btree ("enquiries_id");
  CREATE INDEX "payload_locked_documents_rels_price_lists_id_idx" ON "payload_locked_documents_rels" USING btree ("price_lists_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_payload_folders_id_idx" ON "payload_locked_documents_rels" USING btree ("payload_folders_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_page_hero_slides_order_idx" ON "home_page_hero_slides" USING btree ("_order");
  CREATE INDEX "home_page_hero_slides_parent_id_idx" ON "home_page_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "home_page_hero_slides_image_idx" ON "home_page_hero_slides" USING btree ("image_id");
  CREATE INDEX "home_page_pillars_order_idx" ON "home_page_pillars" USING btree ("_order");
  CREATE INDEX "home_page_pillars_parent_id_idx" ON "home_page_pillars" USING btree ("_parent_id");
  CREATE INDEX "home_page_testimonials_order_idx" ON "home_page_testimonials" USING btree ("_order");
  CREATE INDEX "home_page_testimonials_parent_id_idx" ON "home_page_testimonials" USING btree ("_parent_id");
  CREATE INDEX "home_page_intro_intro_image_idx" ON "home_page" USING btree ("intro_image_id");
  CREATE INDEX "home_page_expert_banner_expert_banner_image_idx" ON "home_page" USING btree ("expert_banner_image_id");
  CREATE INDEX "home_page__status_idx" ON "home_page" USING btree ("_status");
  CREATE INDEX "home_page_rels_order_idx" ON "home_page_rels" USING btree ("order");
  CREATE INDEX "home_page_rels_parent_idx" ON "home_page_rels" USING btree ("parent_id");
  CREATE INDEX "home_page_rels_path_idx" ON "home_page_rels" USING btree ("path");
  CREATE INDEX "home_page_rels_destinations_id_idx" ON "home_page_rels" USING btree ("destinations_id");
  CREATE INDEX "home_page_rels_itineraries_id_idx" ON "home_page_rels" USING btree ("itineraries_id");
  CREATE INDEX "_home_page_v_version_hero_slides_order_idx" ON "_home_page_v_version_hero_slides" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_hero_slides_parent_id_idx" ON "_home_page_v_version_hero_slides" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_hero_slides_image_idx" ON "_home_page_v_version_hero_slides" USING btree ("image_id");
  CREATE INDEX "_home_page_v_version_pillars_order_idx" ON "_home_page_v_version_pillars" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_pillars_parent_id_idx" ON "_home_page_v_version_pillars" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_testimonials_order_idx" ON "_home_page_v_version_testimonials" USING btree ("_order");
  CREATE INDEX "_home_page_v_version_testimonials_parent_id_idx" ON "_home_page_v_version_testimonials" USING btree ("_parent_id");
  CREATE INDEX "_home_page_v_version_intro_version_intro_image_idx" ON "_home_page_v" USING btree ("version_intro_image_id");
  CREATE INDEX "_home_page_v_version_expert_banner_version_expert_banner_idx" ON "_home_page_v" USING btree ("version_expert_banner_image_id");
  CREATE INDEX "_home_page_v_version_version__status_idx" ON "_home_page_v" USING btree ("version__status");
  CREATE INDEX "_home_page_v_created_at_idx" ON "_home_page_v" USING btree ("created_at");
  CREATE INDEX "_home_page_v_updated_at_idx" ON "_home_page_v" USING btree ("updated_at");
  CREATE INDEX "_home_page_v_latest_idx" ON "_home_page_v" USING btree ("latest");
  CREATE INDEX "_home_page_v_rels_order_idx" ON "_home_page_v_rels" USING btree ("order");
  CREATE INDEX "_home_page_v_rels_parent_idx" ON "_home_page_v_rels" USING btree ("parent_id");
  CREATE INDEX "_home_page_v_rels_path_idx" ON "_home_page_v_rels" USING btree ("path");
  CREATE INDEX "_home_page_v_rels_destinations_id_idx" ON "_home_page_v_rels" USING btree ("destinations_id");
  CREATE INDEX "_home_page_v_rels_itineraries_id_idx" ON "_home_page_v_rels" USING btree ("itineraries_id");
  CREATE INDEX "site_settings_social_order_idx" ON "site_settings_social" USING btree ("_order");
  CREATE INDEX "site_settings_social_parent_id_idx" ON "site_settings_social" USING btree ("_parent_id");
  CREATE INDEX "site_settings_texts_order_parent" ON "site_settings_texts" USING btree ("order","parent_id");
  CREATE INDEX "expert_settings_facts_order_idx" ON "expert_settings_facts" USING btree ("_order");
  CREATE INDEX "expert_settings_facts_parent_id_idx" ON "expert_settings_facts" USING btree ("_parent_id");
  CREATE INDEX "expert_settings_avatar_idx" ON "expert_settings" USING btree ("avatar_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "destinations_highlights" CASCADE;
  DROP TABLE "destinations_best_months" CASCADE;
  DROP TABLE "destinations" CASCADE;
  DROP TABLE "destinations_texts" CASCADE;
  DROP TABLE "destinations_rels" CASCADE;
  DROP TABLE "_destinations_v_version_highlights" CASCADE;
  DROP TABLE "_destinations_v_version_best_months" CASCADE;
  DROP TABLE "_destinations_v" CASCADE;
  DROP TABLE "_destinations_v_texts" CASCADE;
  DROP TABLE "_destinations_v_rels" CASCADE;
  DROP TABLE "lodges" CASCADE;
  DROP TABLE "lodges_texts" CASCADE;
  DROP TABLE "lodges_rels" CASCADE;
  DROP TABLE "_lodges_v" CASCADE;
  DROP TABLE "_lodges_v_texts" CASCADE;
  DROP TABLE "_lodges_v_rels" CASCADE;
  DROP TABLE "itineraries_styles" CASCADE;
  DROP TABLE "itineraries_days" CASCADE;
  DROP TABLE "itineraries" CASCADE;
  DROP TABLE "itineraries_texts" CASCADE;
  DROP TABLE "_itineraries_v_version_styles" CASCADE;
  DROP TABLE "_itineraries_v_version_days" CASCADE;
  DROP TABLE "_itineraries_v" CASCADE;
  DROP TABLE "_itineraries_v_texts" CASCADE;
  DROP TABLE "posts" CASCADE;
  DROP TABLE "_posts_v" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "enquiries" CASCADE;
  DROP TABLE "price_lists" CASCADE;
  DROP TABLE "users_roles" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_folders_folder_type" CASCADE;
  DROP TABLE "payload_folders" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_page_hero_slides" CASCADE;
  DROP TABLE "home_page_pillars" CASCADE;
  DROP TABLE "home_page_testimonials" CASCADE;
  DROP TABLE "home_page" CASCADE;
  DROP TABLE "home_page_rels" CASCADE;
  DROP TABLE "_home_page_v_version_hero_slides" CASCADE;
  DROP TABLE "_home_page_v_version_pillars" CASCADE;
  DROP TABLE "_home_page_v_version_testimonials" CASCADE;
  DROP TABLE "_home_page_v" CASCADE;
  DROP TABLE "_home_page_v_rels" CASCADE;
  DROP TABLE "site_settings_social" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TABLE "site_settings_texts" CASCADE;
  DROP TABLE "pricing_settings" CASCADE;
  DROP TABLE "expert_settings_facts" CASCADE;
  DROP TABLE "expert_settings" CASCADE;
  DROP TYPE "public"."enum_destinations_best_months";
  DROP TYPE "public"."enum_destinations_region";
  DROP TYPE "public"."enum_destinations_type";
  DROP TYPE "public"."enum_destinations_status";
  DROP TYPE "public"."enum__destinations_v_version_best_months";
  DROP TYPE "public"."enum__destinations_v_version_region";
  DROP TYPE "public"."enum__destinations_v_version_type";
  DROP TYPE "public"."enum__destinations_v_version_status";
  DROP TYPE "public"."enum_lodges_tier";
  DROP TYPE "public"."enum_lodges_style";
  DROP TYPE "public"."enum_lodges_status";
  DROP TYPE "public"."enum__lodges_v_version_tier";
  DROP TYPE "public"."enum__lodges_v_version_style";
  DROP TYPE "public"."enum__lodges_v_version_status";
  DROP TYPE "public"."enum_itineraries_styles";
  DROP TYPE "public"."enum_itineraries_tier";
  DROP TYPE "public"."enum_itineraries_status";
  DROP TYPE "public"."enum__itineraries_v_version_styles";
  DROP TYPE "public"."enum__itineraries_v_version_tier";
  DROP TYPE "public"."enum__itineraries_v_version_status";
  DROP TYPE "public"."enum_posts_status";
  DROP TYPE "public"."enum__posts_v_version_status";
  DROP TYPE "public"."enum_media_source";
  DROP TYPE "public"."enum_enquiries_source";
  DROP TYPE "public"."enum_enquiries_status";
  DROP TYPE "public"."enum_users_roles";
  DROP TYPE "public"."enum_payload_folders_folder_type";
  DROP TYPE "public"."enum_home_page_status";
  DROP TYPE "public"."enum__home_page_v_version_status";
  DROP TYPE "public"."enum_site_settings_social_platform";
  DROP TYPE "public"."enum_pricing_settings_seasons_jan";
  DROP TYPE "public"."enum_pricing_settings_seasons_feb";
  DROP TYPE "public"."enum_pricing_settings_seasons_mar";
  DROP TYPE "public"."enum_pricing_settings_seasons_apr";
  DROP TYPE "public"."enum_pricing_settings_seasons_may";
  DROP TYPE "public"."enum_pricing_settings_seasons_jun";
  DROP TYPE "public"."enum_pricing_settings_seasons_jul";
  DROP TYPE "public"."enum_pricing_settings_seasons_aug";
  DROP TYPE "public"."enum_pricing_settings_seasons_sep";
  DROP TYPE "public"."enum_pricing_settings_seasons_oct";
  DROP TYPE "public"."enum_pricing_settings_seasons_nov";
  DROP TYPE "public"."enum_pricing_settings_seasons_dec";
  DROP TYPE "public"."enum_expert_settings_voice_provider";`)
}
