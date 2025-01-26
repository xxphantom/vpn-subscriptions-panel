import { MigrateUpArgs, MigrateDownArgs } from '@payloadcms/db-postgres'
import { sql } from 'drizzle-orm'

export async function up({ payload }: MigrateUpArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

CREATE TABLE IF NOT EXISTS "subscriptions_rels" (
	"id" serial PRIMARY KEY NOT NULL,
	"order" integer,
	"parent_id" integer NOT NULL,
	"path" varchar NOT NULL,
	"subscription_groups_id" integer
);

CREATE TABLE IF NOT EXISTS "subscription_groups" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar NOT NULL,
	"description" varchar,
	"slug" varchar NOT NULL,
	"config_overrides_vpn_name" varchar,
	"config_overrides_config_update_hours" numeric,
	"config_overrides_support_chat_link" varchar,
	"config_overrides_site_link" varchar,
	"config_overrides_announce" varchar,
	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
);

CREATE INDEX IF NOT EXISTS "subscriptions_rels_order_idx" ON "subscriptions_rels" ("order");
CREATE INDEX IF NOT EXISTS "subscriptions_rels_parent_idx" ON "subscriptions_rels" ("parent_id");
CREATE INDEX IF NOT EXISTS "subscriptions_rels_path_idx" ON "subscriptions_rels" ("path");
CREATE UNIQUE INDEX IF NOT EXISTS "subscription_groups_slug_idx" ON "subscription_groups" ("slug");
CREATE INDEX IF NOT EXISTS "subscription_groups_created_at_idx" ON "subscription_groups" ("created_at");
DO $$ BEGIN
 ALTER TABLE "subscriptions_rels" ADD CONSTRAINT "subscriptions_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "subscriptions"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
 ALTER TABLE "subscriptions_rels" ADD CONSTRAINT "subscriptions_rels_subscription_groups_fk" FOREIGN KEY ("subscription_groups_id") REFERENCES "subscription_groups"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
`);

};

export async function down({ payload }: MigrateDownArgs): Promise<void> {
await payload.db.drizzle.execute(sql`

DROP TABLE "subscriptions_rels";
DROP TABLE "subscription_groups";`);

};
