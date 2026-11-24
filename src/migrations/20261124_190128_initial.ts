import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_announcements_kind" AS ENUM('special-session', 'event');
  CREATE TYPE "public"."enum_submissions_status" AS ENUM('new', 'approved', 'declined');
  CREATE TYPE "public"."enum_submissions_type" AS ENUM('paper', 'product');
  CREATE TYPE "public"."enum_reading_months_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__reading_months_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_placements_type" AS ENUM('internship', 'grad-school', 'fellowship', 'programme');
  CREATE TYPE "public"."enum_wins_months_wins_kind" AS ENUM('Research', 'Paper', 'Award', 'Talk', 'Travel grant', 'Internship', 'Grad school', 'Fellowship', 'Career', 'Open source', 'Mentorship', 'Community');
  CREATE TYPE "public"."enum_wins_months_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__wins_months_v_version_wins_kind" AS ENUM('Research', 'Paper', 'Award', 'Talk', 'Travel grant', 'Internship', 'Grad school', 'Fellowship', 'Career', 'Open source', 'Mentorship', 'Community');
  CREATE TYPE "public"."enum__wins_months_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum_people_group" AS ENUM('organiser', 'advisor', 'torchbearer');
  CREATE TYPE "public"."enum_users_role" AS ENUM('super-admin', 'editor');
  CREATE TYPE "public"."enum_this_week_sessions_day" AS ENUM('0', '1', '2', '3', '4', '5', '6');
  CREATE TABLE "announcements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"kind" "enum_announcements_kind" DEFAULT 'special-session' NOT NULL,
  	"title" varchar NOT NULL,
  	"starts_at" timestamp(3) with time zone NOT NULL,
  	"details" varchar,
  	"link_label" varchar,
  	"link_url" varchar,
  	"show_from" timestamp(3) with time zone,
  	"on_homepage" boolean DEFAULT true,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "submissions" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_submissions_status" DEFAULT 'new' NOT NULL,
  	"featured" boolean DEFAULT true,
  	"internal_note" varchar,
  	"published_paper_id" integer,
  	"published_product_id" integer,
  	"type" "enum_submissions_type" NOT NULL,
  	"title" varchar NOT NULL,
  	"authors" varchar,
  	"venue" varchar,
  	"month" varchar,
  	"topic" varchar,
  	"summary" varchar,
  	"links_paper" varchar,
  	"links_code" varchar,
  	"links_slides" varchar,
  	"links_recording" varchar,
  	"figure_id" integer,
  	"email" varchar NOT NULL,
  	"co_authors_agreed" boolean,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "papers" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar NOT NULL,
  	"authors" varchar NOT NULL,
  	"venue" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"topic" varchar NOT NULL,
  	"summary" varchar,
  	"abstract" varchar,
  	"links_paper" varchar,
  	"links_code" varchar,
  	"links_slides" varchar,
  	"links_recording" varchar,
  	"figure_id" integer,
  	"visible" boolean DEFAULT true,
  	"featured" boolean DEFAULT false,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"team" varchar NOT NULL,
  	"link" varchar,
  	"image_id" integer,
  	"visible" boolean DEFAULT true,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "focus_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"topic" varchar NOT NULL,
  	"status" varchar NOT NULL,
  	"members" varchar NOT NULL,
  	"slides" varchar,
  	"visible" boolean DEFAULT true,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "reading_months_papers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"title" varchar,
  	"note" varchar,
  	"led_by" varchar,
  	"slides" varchar
  );
  
  CREATE TABLE "reading_months" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"month" timestamp(3) with time zone,
  	"theme" varchar,
  	"title" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_reading_months_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_reading_months_v_version_papers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone,
  	"title" varchar,
  	"note" varchar,
  	"led_by" varchar,
  	"slides" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_reading_months_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_month" timestamp(3) with time zone,
  	"version_theme" varchar,
  	"version_title" varchar,
  	"version_key" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__reading_months_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "placements" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"person" varchar NOT NULL,
  	"type" "enum_placements_type" NOT NULL,
  	"title" varchar,
  	"organisation" varchar NOT NULL,
  	"year" numeric NOT NULL,
  	"place_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "places" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"city" varchar NOT NULL,
  	"country" varchar NOT NULL,
  	"latitude" numeric NOT NULL,
  	"longitude" numeric NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "wins_months_wins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"kind" "enum_wins_months_wins_kind",
  	"text" varchar,
  	"highlight" boolean
  );
  
  CREATE TABLE "wins_months" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"month" timestamp(3) with time zone,
  	"intro" varchar,
  	"title" varchar,
  	"key" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_wins_months_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "_wins_months_v_version_wins" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"kind" "enum__wins_months_v_version_wins_kind",
  	"text" varchar,
  	"highlight" boolean,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_wins_months_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_month" timestamp(3) with time zone,
  	"version_intro" varchar,
  	"version_title" varchar,
  	"version_key" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__wins_months_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"latest" boolean
  );
  
  CREATE TABLE "showcase_talks" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"speaker" varchar NOT NULL,
  	"title" varchar NOT NULL,
  	"summary" varchar NOT NULL,
  	"slides" varchar
  );
  
  CREATE TABLE "showcase" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"date" timestamp(3) with time zone NOT NULL,
  	"notes" varchar,
  	"title" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "gallery" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"photo_id" integer,
  	"video" varchar,
  	"video_description" varchar,
  	"caption" varchar NOT NULL,
  	"event" varchar NOT NULL,
  	"sort_date" timestamp(3) with time zone NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "people" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"group" "enum_people_group" DEFAULT 'organiser' NOT NULL,
  	"role" varchar NOT NULL,
  	"years" varchar,
  	"link" varchar,
  	"link_label" varchar DEFAULT 'LinkedIn',
  	"photo_id" integer,
  	"order" numeric DEFAULT 100,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
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
  	"name" varchar NOT NULL,
  	"role" "enum_users_role" DEFAULT 'editor' NOT NULL,
  	"must_change_password" boolean DEFAULT false,
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
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"alt" varchar NOT NULL,
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
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
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
  	"announcements_id" integer,
  	"submissions_id" integer,
  	"papers_id" integer,
  	"products_id" integer,
  	"focus_groups_id" integer,
  	"reading_months_id" integer,
  	"placements_id" integer,
  	"places_id" integer,
  	"wins_months_id" integer,
  	"showcase_id" integer,
  	"gallery_id" integer,
  	"people_id" integer,
  	"users_id" integer,
  	"media_id" integer
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
  
  CREATE TABLE "this_week_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"day" "enum_this_week_sessions_day" NOT NULL,
  	"time" varchar NOT NULL,
  	"name" varchar NOT NULL,
  	"detail" varchar NOT NULL
  );
  
  CREATE TABLE "this_week" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "cs197" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"show" boolean DEFAULT true,
  	"title" varchar NOT NULL,
  	"subtitle" varchar,
  	"button_label" varchar DEFAULT 'Apply for the next cohort',
  	"apply_url" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_settings" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"discord" varchar,
  	"mailing_list" varchar,
  	"calendar" varchar,
  	"sunday_slot_form" varchar,
  	"focus_group_update_form" varchar,
  	"mentee_form" varchar,
  	"mentor_form" varchar,
  	"opportunities_doc" varchar,
  	"seeded" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_published_paper_id_papers_id_fk" FOREIGN KEY ("published_paper_id") REFERENCES "public"."papers"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_published_product_id_products_id_fk" FOREIGN KEY ("published_product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "submissions" ADD CONSTRAINT "submissions_figure_id_media_id_fk" FOREIGN KEY ("figure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "papers" ADD CONSTRAINT "papers_figure_id_media_id_fk" FOREIGN KEY ("figure_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "reading_months_papers" ADD CONSTRAINT "reading_months_papers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."reading_months"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reading_months_v_version_papers" ADD CONSTRAINT "_reading_months_v_version_papers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_reading_months_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_reading_months_v" ADD CONSTRAINT "_reading_months_v_parent_id_reading_months_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."reading_months"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "placements" ADD CONSTRAINT "placements_place_id_places_id_fk" FOREIGN KEY ("place_id") REFERENCES "public"."places"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "wins_months_wins" ADD CONSTRAINT "wins_months_wins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."wins_months"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wins_months_v_version_wins" ADD CONSTRAINT "_wins_months_v_version_wins_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_wins_months_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_wins_months_v" ADD CONSTRAINT "_wins_months_v_parent_id_wins_months_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."wins_months"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "showcase_talks" ADD CONSTRAINT "showcase_talks_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "gallery" ADD CONSTRAINT "gallery_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "people" ADD CONSTRAINT "people_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_announcements_fk" FOREIGN KEY ("announcements_id") REFERENCES "public"."announcements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_submissions_fk" FOREIGN KEY ("submissions_id") REFERENCES "public"."submissions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_papers_fk" FOREIGN KEY ("papers_id") REFERENCES "public"."papers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_focus_groups_fk" FOREIGN KEY ("focus_groups_id") REFERENCES "public"."focus_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reading_months_fk" FOREIGN KEY ("reading_months_id") REFERENCES "public"."reading_months"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_placements_fk" FOREIGN KEY ("placements_id") REFERENCES "public"."placements"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_places_fk" FOREIGN KEY ("places_id") REFERENCES "public"."places"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_wins_months_fk" FOREIGN KEY ("wins_months_id") REFERENCES "public"."wins_months"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_showcase_fk" FOREIGN KEY ("showcase_id") REFERENCES "public"."showcase"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_gallery_fk" FOREIGN KEY ("gallery_id") REFERENCES "public"."gallery"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_people_fk" FOREIGN KEY ("people_id") REFERENCES "public"."people"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "this_week_sessions" ADD CONSTRAINT "this_week_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."this_week"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "announcements_updated_at_idx" ON "announcements" USING btree ("updated_at");
  CREATE INDEX "announcements_created_at_idx" ON "announcements" USING btree ("created_at");
  CREATE INDEX "submissions_published_paper_idx" ON "submissions" USING btree ("published_paper_id");
  CREATE INDEX "submissions_published_product_idx" ON "submissions" USING btree ("published_product_id");
  CREATE INDEX "submissions_figure_idx" ON "submissions" USING btree ("figure_id");
  CREATE INDEX "submissions_updated_at_idx" ON "submissions" USING btree ("updated_at");
  CREATE INDEX "submissions_created_at_idx" ON "submissions" USING btree ("created_at");
  CREATE INDEX "papers_figure_idx" ON "papers" USING btree ("figure_id");
  CREATE UNIQUE INDEX "papers_slug_idx" ON "papers" USING btree ("slug");
  CREATE INDEX "papers_updated_at_idx" ON "papers" USING btree ("updated_at");
  CREATE INDEX "papers_created_at_idx" ON "papers" USING btree ("created_at");
  CREATE INDEX "products_image_idx" ON "products" USING btree ("image_id");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "focus_groups_updated_at_idx" ON "focus_groups" USING btree ("updated_at");
  CREATE INDEX "focus_groups_created_at_idx" ON "focus_groups" USING btree ("created_at");
  CREATE INDEX "reading_months_papers_order_idx" ON "reading_months_papers" USING btree ("_order");
  CREATE INDEX "reading_months_papers_parent_id_idx" ON "reading_months_papers" USING btree ("_parent_id");
  CREATE INDEX "reading_months_key_idx" ON "reading_months" USING btree ("key");
  CREATE INDEX "reading_months_updated_at_idx" ON "reading_months" USING btree ("updated_at");
  CREATE INDEX "reading_months_created_at_idx" ON "reading_months" USING btree ("created_at");
  CREATE INDEX "reading_months__status_idx" ON "reading_months" USING btree ("_status");
  CREATE INDEX "_reading_months_v_version_papers_order_idx" ON "_reading_months_v_version_papers" USING btree ("_order");
  CREATE INDEX "_reading_months_v_version_papers_parent_id_idx" ON "_reading_months_v_version_papers" USING btree ("_parent_id");
  CREATE INDEX "_reading_months_v_parent_idx" ON "_reading_months_v" USING btree ("parent_id");
  CREATE INDEX "_reading_months_v_version_version_key_idx" ON "_reading_months_v" USING btree ("version_key");
  CREATE INDEX "_reading_months_v_version_version_updated_at_idx" ON "_reading_months_v" USING btree ("version_updated_at");
  CREATE INDEX "_reading_months_v_version_version_created_at_idx" ON "_reading_months_v" USING btree ("version_created_at");
  CREATE INDEX "_reading_months_v_version_version__status_idx" ON "_reading_months_v" USING btree ("version__status");
  CREATE INDEX "_reading_months_v_created_at_idx" ON "_reading_months_v" USING btree ("created_at");
  CREATE INDEX "_reading_months_v_updated_at_idx" ON "_reading_months_v" USING btree ("updated_at");
  CREATE INDEX "_reading_months_v_latest_idx" ON "_reading_months_v" USING btree ("latest");
  CREATE INDEX "placements_place_idx" ON "placements" USING btree ("place_id");
  CREATE INDEX "placements_updated_at_idx" ON "placements" USING btree ("updated_at");
  CREATE INDEX "placements_created_at_idx" ON "placements" USING btree ("created_at");
  CREATE INDEX "places_updated_at_idx" ON "places" USING btree ("updated_at");
  CREATE INDEX "places_created_at_idx" ON "places" USING btree ("created_at");
  CREATE INDEX "wins_months_wins_order_idx" ON "wins_months_wins" USING btree ("_order");
  CREATE INDEX "wins_months_wins_parent_id_idx" ON "wins_months_wins" USING btree ("_parent_id");
  CREATE INDEX "wins_months_key_idx" ON "wins_months" USING btree ("key");
  CREATE INDEX "wins_months_updated_at_idx" ON "wins_months" USING btree ("updated_at");
  CREATE INDEX "wins_months_created_at_idx" ON "wins_months" USING btree ("created_at");
  CREATE INDEX "wins_months__status_idx" ON "wins_months" USING btree ("_status");
  CREATE INDEX "_wins_months_v_version_wins_order_idx" ON "_wins_months_v_version_wins" USING btree ("_order");
  CREATE INDEX "_wins_months_v_version_wins_parent_id_idx" ON "_wins_months_v_version_wins" USING btree ("_parent_id");
  CREATE INDEX "_wins_months_v_parent_idx" ON "_wins_months_v" USING btree ("parent_id");
  CREATE INDEX "_wins_months_v_version_version_key_idx" ON "_wins_months_v" USING btree ("version_key");
  CREATE INDEX "_wins_months_v_version_version_updated_at_idx" ON "_wins_months_v" USING btree ("version_updated_at");
  CREATE INDEX "_wins_months_v_version_version_created_at_idx" ON "_wins_months_v" USING btree ("version_created_at");
  CREATE INDEX "_wins_months_v_version_version__status_idx" ON "_wins_months_v" USING btree ("version__status");
  CREATE INDEX "_wins_months_v_created_at_idx" ON "_wins_months_v" USING btree ("created_at");
  CREATE INDEX "_wins_months_v_updated_at_idx" ON "_wins_months_v" USING btree ("updated_at");
  CREATE INDEX "_wins_months_v_latest_idx" ON "_wins_months_v" USING btree ("latest");
  CREATE INDEX "showcase_talks_order_idx" ON "showcase_talks" USING btree ("_order");
  CREATE INDEX "showcase_talks_parent_id_idx" ON "showcase_talks" USING btree ("_parent_id");
  CREATE INDEX "showcase_updated_at_idx" ON "showcase" USING btree ("updated_at");
  CREATE INDEX "showcase_created_at_idx" ON "showcase" USING btree ("created_at");
  CREATE INDEX "gallery_photo_idx" ON "gallery" USING btree ("photo_id");
  CREATE INDEX "gallery_updated_at_idx" ON "gallery" USING btree ("updated_at");
  CREATE INDEX "gallery_created_at_idx" ON "gallery" USING btree ("created_at");
  CREATE INDEX "people_photo_idx" ON "people" USING btree ("photo_id");
  CREATE INDEX "people_updated_at_idx" ON "people" USING btree ("updated_at");
  CREATE INDEX "people_created_at_idx" ON "people" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_announcements_id_idx" ON "payload_locked_documents_rels" USING btree ("announcements_id");
  CREATE INDEX "payload_locked_documents_rels_submissions_id_idx" ON "payload_locked_documents_rels" USING btree ("submissions_id");
  CREATE INDEX "payload_locked_documents_rels_papers_id_idx" ON "payload_locked_documents_rels" USING btree ("papers_id");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_focus_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("focus_groups_id");
  CREATE INDEX "payload_locked_documents_rels_reading_months_id_idx" ON "payload_locked_documents_rels" USING btree ("reading_months_id");
  CREATE INDEX "payload_locked_documents_rels_placements_id_idx" ON "payload_locked_documents_rels" USING btree ("placements_id");
  CREATE INDEX "payload_locked_documents_rels_places_id_idx" ON "payload_locked_documents_rels" USING btree ("places_id");
  CREATE INDEX "payload_locked_documents_rels_wins_months_id_idx" ON "payload_locked_documents_rels" USING btree ("wins_months_id");
  CREATE INDEX "payload_locked_documents_rels_showcase_id_idx" ON "payload_locked_documents_rels" USING btree ("showcase_id");
  CREATE INDEX "payload_locked_documents_rels_gallery_id_idx" ON "payload_locked_documents_rels" USING btree ("gallery_id");
  CREATE INDEX "payload_locked_documents_rels_people_id_idx" ON "payload_locked_documents_rels" USING btree ("people_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "this_week_sessions_order_idx" ON "this_week_sessions" USING btree ("_order");
  CREATE INDEX "this_week_sessions_parent_id_idx" ON "this_week_sessions" USING btree ("_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "announcements" CASCADE;
  DROP TABLE "submissions" CASCADE;
  DROP TABLE "papers" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "focus_groups" CASCADE;
  DROP TABLE "reading_months_papers" CASCADE;
  DROP TABLE "reading_months" CASCADE;
  DROP TABLE "_reading_months_v_version_papers" CASCADE;
  DROP TABLE "_reading_months_v" CASCADE;
  DROP TABLE "placements" CASCADE;
  DROP TABLE "places" CASCADE;
  DROP TABLE "wins_months_wins" CASCADE;
  DROP TABLE "wins_months" CASCADE;
  DROP TABLE "_wins_months_v_version_wins" CASCADE;
  DROP TABLE "_wins_months_v" CASCADE;
  DROP TABLE "showcase_talks" CASCADE;
  DROP TABLE "showcase" CASCADE;
  DROP TABLE "gallery" CASCADE;
  DROP TABLE "people" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "this_week_sessions" CASCADE;
  DROP TABLE "this_week" CASCADE;
  DROP TABLE "cs197" CASCADE;
  DROP TABLE "site_settings" CASCADE;
  DROP TYPE "public"."enum_announcements_kind";
  DROP TYPE "public"."enum_submissions_status";
  DROP TYPE "public"."enum_submissions_type";
  DROP TYPE "public"."enum_reading_months_status";
  DROP TYPE "public"."enum__reading_months_v_version_status";
  DROP TYPE "public"."enum_placements_type";
  DROP TYPE "public"."enum_wins_months_wins_kind";
  DROP TYPE "public"."enum_wins_months_status";
  DROP TYPE "public"."enum__wins_months_v_version_wins_kind";
  DROP TYPE "public"."enum__wins_months_v_version_status";
  DROP TYPE "public"."enum_people_group";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_this_week_sessions_day";`)
}
