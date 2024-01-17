ALTER TABLE "locations" ADD COLUMN "created_at" timestamp with time zone DEFAULT now() NOT NULL;--> statement-breakpoint
ALTER TABLE "locations" ADD COLUMN "search" text GENERATED ALWAYS AS (coalesce(name, '') || '|' || coalesce(address, '') || '|' || coalesce(description, '') || '|' || coalesce(phone, '')) STORED;
