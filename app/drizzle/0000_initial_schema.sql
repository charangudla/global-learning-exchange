CREATE TYPE "public"."age_range" AS ENUM('under_13', '13_17', '18_24', '25_34', '35_44', '45_54', '55_plus', 'prefer_not_to_say');--> statement-breakpoint
CREATE TYPE "public"."ai_conversation_type" AS ENUM('student_tutor', 'speaker_verification', 'request_drafting', 'matching', 'session_notes');--> statement-breakpoint
CREATE TYPE "public"."ai_message_role" AS ENUM('system', 'user', 'assistant', 'tool');--> statement-breakpoint
CREATE TYPE "public"."attachment_status" AS ENUM('private', 'visible', 'hidden', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."booking_status" AS ENUM('draft', 'requested', 'pending_speaker_response', 'confirmed', 'cancelled', 'cancelled_by_admin', 'completed', 'no_show', 'disputed', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."chat_message_status" AS ENUM('visible', 'hidden', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."chat_thread_status" AS ENUM('active', 'archived', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."content_status" AS ENUM('draft', 'private', 'pending_review', 'public', 'hidden', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."credential_status" AS ENUM('pending', 'verified', 'limited_verified', 'needs_review', 'rejected');--> statement-breakpoint
CREATE TYPE "public"."credential_type" AS ENUM('linkedin', 'google_scholar', 'orcid', 'university_profile', 'company_profile', 'portfolio', 'certification', 'publication', 'other');--> statement-breakpoint
CREATE TYPE "public"."meeting_provider" AS ENUM('zoom', 'google_meet', 'webex', 'jitsi', 'livekit', 'other');--> statement-breakpoint
CREATE TYPE "public"."moderation_action_type" AS ENUM('block', 'unblock', 'suspend', 'restore', 'hide', 'cancel', 'dispute', 'resolve', 'request_more_info');--> statement-breakpoint
CREATE TYPE "public"."moderation_target_type" AS ENUM('user', 'speaker', 'request', 'booking', 'session', 'event', 'review', 'note', 'recording', 'content', 'chat_message', 'attachment');--> statement-breakpoint
CREATE TYPE "public"."report_status" AS ENUM('open', 'in_review', 'resolved', 'dismissed');--> statement-breakpoint
CREATE TYPE "public"."request_status" AS ENUM('draft', 'open', 'matched', 'booked', 'cancelled', 'cancelled_by_admin', 'completed', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."request_urgency" AS ENUM('flexible', 'this_week', 'next_24_hours', 'urgent');--> statement-breakpoint
CREATE TYPE "public"."response_status" AS ENUM('pending', 'accepted', 'declined', 'withdrawn');--> statement-breakpoint
CREATE TYPE "public"."review_status" AS ENUM('visible', 'hidden', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."session_financial_intent" AS ENUM('free', 'free_donations_accepted', 'paid_requested', 'student_offer', 'sponsored');--> statement-breakpoint
CREATE TYPE "public"."speaker_verification_status" AS ENUM('verification_pending', 'verified', 'limited_verified', 'needs_review', 'suspended', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."subject_context" AS ENUM('learning', 'teaching');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('student', 'speaker', 'admin');--> statement-breakpoint
CREATE TYPE "public"."user_status" AS ENUM('active', 'blocked', 'suspended', 'deleted_by_user');--> statement-breakpoint
CREATE TYPE "public"."verification_event_status" AS ENUM('pending', 'sent', 'verified', 'failed', 'expired', 'blocked');--> statement-breakpoint
CREATE TYPE "public"."verification_event_type" AS ENUM('email_otp', 'phone_otp', 'speaker_profile', 'credential_link', 'ai_profile_review');--> statement-breakpoint
CREATE TYPE "public"."verification_risk_level" AS ENUM('low', 'medium', 'high', 'unknown');--> statement-breakpoint
CREATE TABLE "ai_conversations" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid,
	"type" "ai_conversation_type" NOT NULL,
	"title" text,
	"subject_id" uuid,
	"language" varchar(16) DEFAULT 'en' NOT NULL,
	"model" text,
	"prompt_version" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ai_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"conversation_id" uuid NOT NULL,
	"role" "ai_message_role" NOT NULL,
	"content" text NOT NULL,
	"token_count" integer,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "attachments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"uploader_id" uuid NOT NULL,
	"chat_message_id" uuid,
	"request_id" uuid,
	"booking_id" uuid,
	"file_name" text NOT NULL,
	"storage_path" text NOT NULL,
	"mime_type" text NOT NULL,
	"size_bytes" integer NOT NULL,
	"status" "attachment_status" DEFAULT 'private' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "attachments_size_positive" CHECK ("attachments"."size_bytes" > 0)
);
--> statement-breakpoint
CREATE TABLE "availability_windows" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"speaker_id" uuid NOT NULL,
	"day_of_week" integer NOT NULL,
	"start_minute" integer NOT NULL,
	"end_minute" integer NOT NULL,
	"time_zone" text DEFAULT 'UTC' NOT NULL,
	"valid_from" timestamp with time zone,
	"valid_until" timestamp with time zone,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "availability_windows_day_range" CHECK ("availability_windows"."day_of_week" >= 0 AND "availability_windows"."day_of_week" <= 6),
	CONSTRAINT "availability_windows_minute_range" CHECK ("availability_windows"."start_minute" >= 0 AND "availability_windows"."start_minute" < 1440 AND "availability_windows"."end_minute" > "availability_windows"."start_minute" AND "availability_windows"."end_minute" <= 1440)
);
--> statement-breakpoint
CREATE TABLE "bookings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"response_id" uuid,
	"student_id" uuid NOT NULL,
	"speaker_id" uuid NOT NULL,
	"subject_id" uuid,
	"title" text NOT NULL,
	"status" "booking_status" DEFAULT 'requested' NOT NULL,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"meeting_provider" "meeting_provider",
	"meeting_url" text,
	"session_intent" "session_financial_intent" DEFAULT 'free' NOT NULL,
	"price_cents" integer,
	"donation_allowed" boolean DEFAULT false NOT NULL,
	"student_confirmed_at" timestamp with time zone,
	"speaker_confirmed_at" timestamp with time zone,
	"completed_at" timestamp with time zone,
	"cancelled_by_user_id" uuid,
	"cancellation_reason" text,
	"no_show_marked_by_user_id" uuid,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "bookings_end_after_start" CHECK ("bookings"."end_at" > "bookings"."start_at"),
	CONSTRAINT "bookings_price_nonnegative" CHECK ("bookings"."price_cents" IS NULL OR "bookings"."price_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "calendar_holds" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"speaker_id" uuid NOT NULL,
	"request_id" uuid,
	"start_at" timestamp with time zone NOT NULL,
	"end_at" timestamp with time zone NOT NULL,
	"expires_at" timestamp with time zone NOT NULL,
	"released_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "calendar_holds_end_after_start" CHECK ("calendar_holds"."end_at" > "calendar_holds"."start_at")
);
--> statement-breakpoint
CREATE TABLE "chat_messages" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"thread_id" uuid NOT NULL,
	"sender_id" uuid NOT NULL,
	"body" text NOT NULL,
	"status" "chat_message_status" DEFAULT 'visible' NOT NULL,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"hidden_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "chat_threads" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid,
	"booking_id" uuid,
	"status" "chat_thread_status" DEFAULT 'active' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "content_items" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid,
	"speaker_id" uuid,
	"subject_id" uuid,
	"title" text NOT NULL,
	"description" text,
	"language" varchar(16) DEFAULT 'en' NOT NULL,
	"status" "content_status" DEFAULT 'private' NOT NULL,
	"video_url" text,
	"notes" text,
	"transcript" text,
	"instructor_approved_at" timestamp with time zone,
	"admin_approved_at" timestamp with time zone,
	"published_at" timestamp with time zone,
	"hidden_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "moderation_actions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"admin_id" uuid NOT NULL,
	"target_type" "moderation_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"action" "moderation_action_type" NOT NULL,
	"reason" text NOT NULL,
	"previous_status" text,
	"next_status" text,
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "reports" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"reporter_id" uuid NOT NULL,
	"target_type" "moderation_target_type" NOT NULL,
	"target_id" uuid NOT NULL,
	"status" "report_status" DEFAULT 'open' NOT NULL,
	"reason" text NOT NULL,
	"details" text,
	"resolved_by_admin_id" uuid,
	"resolved_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "request_responses" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"speaker_id" uuid NOT NULL,
	"status" "response_status" DEFAULT 'pending' NOT NULL,
	"message" text NOT NULL,
	"proposed_start_at" timestamp with time zone,
	"proposed_end_at" timestamp with time zone,
	"session_intent" "session_financial_intent" DEFAULT 'free' NOT NULL,
	"requested_price_cents" integer,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "request_responses_requested_price_nonnegative" CHECK ("request_responses"."requested_price_cents" IS NULL OR "request_responses"."requested_price_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "session_reviews" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"booking_id" uuid NOT NULL,
	"reviewer_id" uuid NOT NULL,
	"reviewee_id" uuid NOT NULL,
	"rating" integer NOT NULL,
	"body" text,
	"status" "review_status" DEFAULT 'visible' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "session_reviews_rating_range" CHECK ("session_reviews"."rating" >= 1 AND "session_reviews"."rating" <= 5)
);
--> statement-breakpoint
CREATE TABLE "speaker_credentials" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"speaker_id" uuid NOT NULL,
	"type" "credential_type" NOT NULL,
	"url" text NOT NULL,
	"status" "credential_status" DEFAULT 'pending' NOT NULL,
	"ai_summary" text,
	"ai_risk_level" "verification_risk_level" DEFAULT 'unknown',
	"reviewed_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "speaker_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"verification_status" "speaker_verification_status" DEFAULT 'verification_pending' NOT NULL,
	"headline" text,
	"bio" text,
	"teaching_languages" jsonb DEFAULT '["en"]'::jsonb NOT NULL,
	"default_session_intent" "session_financial_intent" DEFAULT 'free' NOT NULL,
	"hourly_rate_cents" integer,
	"donation_accepted" boolean DEFAULT false NOT NULL,
	"availability_summary" text,
	"completed_sessions_count" integer DEFAULT 0 NOT NULL,
	"average_rating" integer DEFAULT 0 NOT NULL,
	"verified_at" timestamp with time zone,
	"limited_verified_at" timestamp with time zone,
	"suspended_at" timestamp with time zone,
	"blocked_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "speaker_profiles_hourly_rate_nonnegative" CHECK ("speaker_profiles"."hourly_rate_cents" IS NULL OR "speaker_profiles"."hourly_rate_cents" >= 0),
	CONSTRAINT "speaker_profiles_completed_sessions_nonnegative" CHECK ("speaker_profiles"."completed_sessions_count" >= 0),
	CONSTRAINT "speaker_profiles_average_rating_range" CHECK ("speaker_profiles"."average_rating" >= 0 AND "speaker_profiles"."average_rating" <= 500)
);
--> statement-breakpoint
CREATE TABLE "student_profiles" (
	"user_id" uuid PRIMARY KEY NOT NULL,
	"age_range" "age_range" DEFAULT 'prefer_not_to_say' NOT NULL,
	"education_level" text,
	"learning_goals" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "student_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"student_id" uuid NOT NULL,
	"subject_id" uuid,
	"title" text NOT NULL,
	"description" text NOT NULL,
	"education_level" text,
	"preferred_language" varchar(16) DEFAULT 'en' NOT NULL,
	"urgency" "request_urgency" DEFAULT 'flexible' NOT NULL,
	"status" "request_status" DEFAULT 'open' NOT NULL,
	"session_intent" "session_financial_intent" DEFAULT 'free' NOT NULL,
	"payment_offer_cents" integer,
	"preferred_time_windows" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "student_requests_payment_offer_nonnegative" CHECK ("student_requests"."payment_offer_cents" IS NULL OR "student_requests"."payment_offer_cents" >= 0)
);
--> statement-breakpoint
CREATE TABLE "subjects" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"slug" text NOT NULL,
	"name" text NOT NULL,
	"parent_subject_id" uuid,
	"description" text,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_roles" (
	"user_id" uuid NOT NULL,
	"role" "user_role" NOT NULL,
	"assigned_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_roles_user_id_role_pk" PRIMARY KEY("user_id","role")
);
--> statement-breakpoint
CREATE TABLE "user_subjects" (
	"user_id" uuid NOT NULL,
	"subject_id" uuid NOT NULL,
	"context" "subject_context" NOT NULL,
	"proficiency_level" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "user_subjects_user_id_subject_id_context_pk" PRIMARY KEY("user_id","subject_id","context")
);
--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"email" text NOT NULL,
	"phone_number" varchar(32) NOT NULL,
	"display_name" text NOT NULL,
	"status" "user_status" DEFAULT 'active' NOT NULL,
	"preferred_platform_language" varchar(16) DEFAULT 'en' NOT NULL,
	"preferred_session_language" varchar(16) DEFAULT 'en' NOT NULL,
	"country_code" varchar(2),
	"time_zone" text DEFAULT 'UTC' NOT NULL,
	"email_verified_at" timestamp with time zone,
	"phone_verified_at" timestamp with time zone,
	"last_active_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "verification_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"type" "verification_event_type" NOT NULL,
	"status" "verification_event_status" DEFAULT 'pending' NOT NULL,
	"target" text NOT NULL,
	"provider" text,
	"provider_reference" text,
	"attempts" integer DEFAULT 0 NOT NULL,
	"risk_level" "verification_risk_level" DEFAULT 'unknown',
	"metadata" jsonb DEFAULT '{}'::jsonb NOT NULL,
	"expires_at" timestamp with time zone,
	"verified_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_conversations" ADD CONSTRAINT "ai_conversations_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "ai_messages" ADD CONSTRAINT "ai_messages_conversation_id_ai_conversations_id_fk" FOREIGN KEY ("conversation_id") REFERENCES "public"."ai_conversations"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_uploader_id_users_id_fk" FOREIGN KEY ("uploader_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_chat_message_id_chat_messages_id_fk" FOREIGN KEY ("chat_message_id") REFERENCES "public"."chat_messages"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_request_id_student_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."student_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "availability_windows" ADD CONSTRAINT "availability_windows_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_request_id_student_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."student_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_response_id_request_responses_id_fk" FOREIGN KEY ("response_id") REFERENCES "public"."request_responses"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_cancelled_by_user_id_users_id_fk" FOREIGN KEY ("cancelled_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_no_show_marked_by_user_id_users_id_fk" FOREIGN KEY ("no_show_marked_by_user_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_holds" ADD CONSTRAINT "calendar_holds_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_holds" ADD CONSTRAINT "calendar_holds_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "calendar_holds" ADD CONSTRAINT "calendar_holds_request_id_student_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."student_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_thread_id_chat_threads_id_fk" FOREIGN KEY ("thread_id") REFERENCES "public"."chat_threads"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_messages" ADD CONSTRAINT "chat_messages_sender_id_users_id_fk" FOREIGN KEY ("sender_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_request_id_student_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."student_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "chat_threads" ADD CONSTRAINT "chat_threads_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "content_items" ADD CONSTRAINT "content_items_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "moderation_actions" ADD CONSTRAINT "moderation_actions_admin_id_users_id_fk" FOREIGN KEY ("admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_reporter_id_users_id_fk" FOREIGN KEY ("reporter_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "reports" ADD CONSTRAINT "reports_resolved_by_admin_id_users_id_fk" FOREIGN KEY ("resolved_by_admin_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_responses" ADD CONSTRAINT "request_responses_request_id_student_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."student_requests"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "request_responses" ADD CONSTRAINT "request_responses_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_booking_id_bookings_id_fk" FOREIGN KEY ("booking_id") REFERENCES "public"."bookings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_reviewer_id_users_id_fk" FOREIGN KEY ("reviewer_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session_reviews" ADD CONSTRAINT "session_reviews_reviewee_id_users_id_fk" FOREIGN KEY ("reviewee_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaker_credentials" ADD CONSTRAINT "speaker_credentials_speaker_id_speaker_profiles_user_id_fk" FOREIGN KEY ("speaker_id") REFERENCES "public"."speaker_profiles"("user_id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "speaker_profiles" ADD CONSTRAINT "speaker_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_profiles" ADD CONSTRAINT "student_profiles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_requests" ADD CONSTRAINT "student_requests_student_id_users_id_fk" FOREIGN KEY ("student_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "student_requests" ADD CONSTRAINT "student_requests_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_roles" ADD CONSTRAINT "user_roles_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subjects" ADD CONSTRAINT "user_subjects_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_subjects" ADD CONSTRAINT "user_subjects_subject_id_subjects_id_fk" FOREIGN KEY ("subject_id") REFERENCES "public"."subjects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "verification_events" ADD CONSTRAINT "verification_events_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "ai_conversations_user_idx" ON "ai_conversations" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "ai_conversations_type_idx" ON "ai_conversations" USING btree ("type");--> statement-breakpoint
CREATE INDEX "ai_messages_conversation_idx" ON "ai_messages" USING btree ("conversation_id");--> statement-breakpoint
CREATE INDEX "ai_messages_role_idx" ON "ai_messages" USING btree ("role");--> statement-breakpoint
CREATE INDEX "attachments_uploader_idx" ON "attachments" USING btree ("uploader_id");--> statement-breakpoint
CREATE INDEX "attachments_message_idx" ON "attachments" USING btree ("chat_message_id");--> statement-breakpoint
CREATE INDEX "attachments_request_idx" ON "attachments" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "attachments_booking_idx" ON "attachments" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "attachments_status_idx" ON "attachments" USING btree ("status");--> statement-breakpoint
CREATE INDEX "availability_windows_speaker_idx" ON "availability_windows" USING btree ("speaker_id");--> statement-breakpoint
CREATE INDEX "availability_windows_day_idx" ON "availability_windows" USING btree ("day_of_week");--> statement-breakpoint
CREATE INDEX "bookings_student_idx" ON "bookings" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "bookings_speaker_idx" ON "bookings" USING btree ("speaker_id");--> statement-breakpoint
CREATE INDEX "bookings_status_idx" ON "bookings" USING btree ("status");--> statement-breakpoint
CREATE INDEX "bookings_start_at_idx" ON "bookings" USING btree ("start_at");--> statement-breakpoint
CREATE INDEX "calendar_holds_student_idx" ON "calendar_holds" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "calendar_holds_speaker_idx" ON "calendar_holds" USING btree ("speaker_id");--> statement-breakpoint
CREATE INDEX "calendar_holds_expires_idx" ON "calendar_holds" USING btree ("expires_at");--> statement-breakpoint
CREATE INDEX "chat_messages_thread_idx" ON "chat_messages" USING btree ("thread_id");--> statement-breakpoint
CREATE INDEX "chat_messages_sender_idx" ON "chat_messages" USING btree ("sender_id");--> statement-breakpoint
CREATE INDEX "chat_messages_status_idx" ON "chat_messages" USING btree ("status");--> statement-breakpoint
CREATE INDEX "chat_threads_request_idx" ON "chat_threads" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "chat_threads_booking_idx" ON "chat_threads" USING btree ("booking_id");--> statement-breakpoint
CREATE INDEX "chat_threads_status_idx" ON "chat_threads" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_items_status_idx" ON "content_items" USING btree ("status");--> statement-breakpoint
CREATE INDEX "content_items_subject_idx" ON "content_items" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "content_items_speaker_idx" ON "content_items" USING btree ("speaker_id");--> statement-breakpoint
CREATE INDEX "content_items_language_idx" ON "content_items" USING btree ("language");--> statement-breakpoint
CREATE INDEX "moderation_actions_admin_idx" ON "moderation_actions" USING btree ("admin_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_target_idx" ON "moderation_actions" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "moderation_actions_action_idx" ON "moderation_actions" USING btree ("action");--> statement-breakpoint
CREATE INDEX "reports_reporter_idx" ON "reports" USING btree ("reporter_id");--> statement-breakpoint
CREATE INDEX "reports_target_idx" ON "reports" USING btree ("target_type","target_id");--> statement-breakpoint
CREATE INDEX "reports_status_idx" ON "reports" USING btree ("status");--> statement-breakpoint
CREATE INDEX "request_responses_request_idx" ON "request_responses" USING btree ("request_id");--> statement-breakpoint
CREATE INDEX "request_responses_speaker_idx" ON "request_responses" USING btree ("speaker_id");--> statement-breakpoint
CREATE INDEX "request_responses_status_idx" ON "request_responses" USING btree ("status");--> statement-breakpoint
CREATE UNIQUE INDEX "session_reviews_booking_reviewer_unique" ON "session_reviews" USING btree ("booking_id","reviewer_id");--> statement-breakpoint
CREATE INDEX "session_reviews_reviewee_idx" ON "session_reviews" USING btree ("reviewee_id");--> statement-breakpoint
CREATE INDEX "session_reviews_status_idx" ON "session_reviews" USING btree ("status");--> statement-breakpoint
CREATE INDEX "speaker_credentials_speaker_idx" ON "speaker_credentials" USING btree ("speaker_id");--> statement-breakpoint
CREATE UNIQUE INDEX "speaker_credentials_speaker_url_unique" ON "speaker_credentials" USING btree ("speaker_id","url");--> statement-breakpoint
CREATE INDEX "speaker_profiles_status_idx" ON "speaker_profiles" USING btree ("verification_status");--> statement-breakpoint
CREATE INDEX "student_requests_student_idx" ON "student_requests" USING btree ("student_id");--> statement-breakpoint
CREATE INDEX "student_requests_subject_idx" ON "student_requests" USING btree ("subject_id");--> statement-breakpoint
CREATE INDEX "student_requests_status_idx" ON "student_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "student_requests_language_idx" ON "student_requests" USING btree ("preferred_language");--> statement-breakpoint
CREATE UNIQUE INDEX "subjects_slug_unique" ON "subjects" USING btree ("slug");--> statement-breakpoint
CREATE INDEX "subjects_parent_idx" ON "subjects" USING btree ("parent_subject_id");--> statement-breakpoint
CREATE INDEX "user_roles_role_idx" ON "user_roles" USING btree ("role");--> statement-breakpoint
CREATE INDEX "user_subjects_subject_context_idx" ON "user_subjects" USING btree ("subject_id","context");--> statement-breakpoint
CREATE UNIQUE INDEX "users_email_unique" ON "users" USING btree ("email");--> statement-breakpoint
CREATE UNIQUE INDEX "users_phone_number_unique" ON "users" USING btree ("phone_number");--> statement-breakpoint
CREATE INDEX "users_status_idx" ON "users" USING btree ("status");--> statement-breakpoint
CREATE INDEX "verification_events_user_idx" ON "verification_events" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX "verification_events_status_idx" ON "verification_events" USING btree ("status");