CREATE TABLE IF NOT EXISTS "click" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"local_code" varchar NOT NULL,
	"link_code" varchar NOT NULL,
	"ip" "cidr" DEFAULT '0.0.0.0',
	CONSTRAINT "click_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "district" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	CONSTRAINT "district_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" varchar NOT NULL,
	"code" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"url" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	CONSTRAINT "link_id_unique" UNIQUE("id"),
	CONSTRAINT "link_code_unique" UNIQUE("code")
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
 ALTER TABLE "click" ADD CONSTRAINT "click_local_code_local_code_fk" FOREIGN KEY ("local_code") REFERENCES "local"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "click" ADD CONSTRAINT "click_link_code_link_code_fk" FOREIGN KEY ("link_code") REFERENCES "link"("code") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "link" ADD CONSTRAINT "link_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
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
