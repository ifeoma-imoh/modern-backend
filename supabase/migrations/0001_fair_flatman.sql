CREATE TABLE IF NOT EXISTS "comments_table" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"post_id" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "comments_table" ADD CONSTRAINT "comments_table_post_id_posts_table_id_fk" FOREIGN KEY ("post_id") REFERENCES "public"."posts_table"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
