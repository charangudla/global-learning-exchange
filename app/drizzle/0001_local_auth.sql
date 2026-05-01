CREATE TYPE "public"."auth_provider" AS ENUM('local', 'supabase', 'authjs', 'keycloak');--> statement-breakpoint
CREATE TABLE "local_auth_identities" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"provider" "auth_provider" DEFAULT 'local' NOT NULL,
	"password_hash" text NOT NULL,
	"password_updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "local_auth_sessions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"token_hash" text NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"revoked_at" timestamp with time zone,
	"user_agent" text,
	"ip_address" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "local_auth_identities" ADD CONSTRAINT "local_auth_identities_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "local_auth_sessions" ADD CONSTRAINT "local_auth_sessions_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "local_auth_identities_provider_idx" ON "local_auth_identities" USING btree ("provider");--> statement-breakpoint
CREATE UNIQUE INDEX "local_auth_sessions_token_hash_unique" ON "local_auth_sessions" USING btree ("token_hash");--> statement-breakpoint
CREATE INDEX "local_auth_sessions_user_idx" ON "local_auth_sessions" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "local_auth_sessions_expires_idx" ON "local_auth_sessions" USING btree ("expires_at");