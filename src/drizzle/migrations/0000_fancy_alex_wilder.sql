CREATE TABLE IF NOT EXISTS "click" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"district_code" varchar NOT NULL,
	"locale_code" varchar NOT NULL,
	"link_code" varchar NOT NULL,
	"ip" "cidr" DEFAULT '0.0.0.0',
	"is_bot" boolean DEFAULT false,
	"user_agent_stringify" varchar,
	"user_agent_hash" varchar,
	CONSTRAINT "click_id_unique" UNIQUE("id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "district" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	CONSTRAINT "district_id_unique" UNIQUE("id"),
	CONSTRAINT "district_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "link" (
	"id" uuid DEFAULT gen_random_uuid(),
	"title" varchar NOT NULL,
	"code" varchar PRIMARY KEY NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"url" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	"status" varchar DEFAULT 'ACTIVE' NOT NULL,
	CONSTRAINT "link_id_unique" UNIQUE("id"),
	CONSTRAINT "link_code_unique" UNIQUE("code")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "locale" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar NOT NULL,
	"code" varchar NOT NULL,
	"district_id" uuid NOT NULL,
	CONSTRAINT "locale_id_unique" UNIQUE("id")
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
CREATE INDEX IF NOT EXISTS "user_agent_hash_index" ON "click" ("user_agent_hash");--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "click" ADD CONSTRAINT "click_district_code_district_code_fk" FOREIGN KEY ("district_code") REFERENCES "district"("code") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "locale" ADD CONSTRAINT "locale_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user" ADD CONSTRAINT "user_district_id_district_id_fk" FOREIGN KEY ("district_id") REFERENCES "district"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
