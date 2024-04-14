CREATE TABLE IF NOT EXISTS "district" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "district_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"href" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "link_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "local_link" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"href" varchar NOT NULL,
	"click_count" integer DEFAULT 0 NOT NULL,
	"link_id" uuid NOT NULL,
	"local_id" uuid NOT NULL,
	"district_id" uuid NOT NULL,
	CONSTRAINT "local_link_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "local" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	CONSTRAINT "local_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"email" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	CONSTRAINT "user_id_unique" UNIQUE("id"),
	CONSTRAINT "user_email_unique" UNIQUE("email")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link" ADD CONSTRAINT "link_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "local_link" ADD CONSTRAINT "local_link_link_id_link_id_fk" FOREIGN KEY ("link_id") REFERENCES "link"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "local_link" ADD CONSTRAINT "local_link_local_id_local_id_fk" FOREIGN KEY ("local_id") REFERENCES "local"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "local_link" ADD CONSTRAINT "local_link_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "local" ADD CONSTRAINT "local_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
