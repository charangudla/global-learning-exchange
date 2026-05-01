import { sql } from "drizzle-orm";
import {
  boolean,
  check,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from "drizzle-orm/pg-core";

export const userStatusEnum = pgEnum("user_status", [
  "active",
  "blocked",
  "suspended",
  "deleted_by_user"
]);

export const userRoleEnum = pgEnum("user_role", [
  "student",
  "speaker",
  "admin"
]);

export const ageRangeEnum = pgEnum("age_range", [
  "under_13",
  "13_17",
  "18_24",
  "25_34",
  "35_44",
  "45_54",
  "55_plus",
  "prefer_not_to_say"
]);

export const speakerVerificationStatusEnum = pgEnum(
  "speaker_verification_status",
  [
    "verification_pending",
    "verified",
    "limited_verified",
    "needs_review",
    "suspended",
    "blocked"
  ]
);

export const verificationEventTypeEnum = pgEnum("verification_event_type", [
  "email_otp",
  "phone_otp",
  "speaker_profile",
  "credential_link",
  "ai_profile_review"
]);

export const verificationEventStatusEnum = pgEnum(
  "verification_event_status",
  ["pending", "sent", "verified", "failed", "expired", "blocked"]
);

export const verificationRiskLevelEnum = pgEnum("verification_risk_level", [
  "low",
  "medium",
  "high",
  "unknown"
]);

export const authProviderEnum = pgEnum("auth_provider", [
  "local",
  "supabase",
  "authjs",
  "keycloak"
]);

export const credentialTypeEnum = pgEnum("credential_type", [
  "linkedin",
  "google_scholar",
  "orcid",
  "university_profile",
  "company_profile",
  "portfolio",
  "certification",
  "publication",
  "other"
]);

export const credentialStatusEnum = pgEnum("credential_status", [
  "pending",
  "verified",
  "limited_verified",
  "needs_review",
  "rejected"
]);

export const subjectContextEnum = pgEnum("subject_context", [
  "learning",
  "teaching"
]);

export const requestStatusEnum = pgEnum("request_status", [
  "draft",
  "open",
  "matched",
  "booked",
  "cancelled",
  "cancelled_by_admin",
  "completed",
  "blocked"
]);

export const requestUrgencyEnum = pgEnum("request_urgency", [
  "flexible",
  "this_week",
  "next_24_hours",
  "urgent"
]);

export const sessionFinancialIntentEnum = pgEnum(
  "session_financial_intent",
  ["free", "free_donations_accepted", "paid_requested", "student_offer", "sponsored"]
);

export const responseStatusEnum = pgEnum("response_status", [
  "pending",
  "accepted",
  "declined",
  "withdrawn"
]);

export const bookingStatusEnum = pgEnum("booking_status", [
  "draft",
  "requested",
  "pending_speaker_response",
  "confirmed",
  "cancelled",
  "cancelled_by_admin",
  "completed",
  "no_show",
  "disputed",
  "blocked"
]);

export const meetingProviderEnum = pgEnum("meeting_provider", [
  "zoom",
  "google_meet",
  "webex",
  "jitsi",
  "livekit",
  "other"
]);

export const chatThreadStatusEnum = pgEnum("chat_thread_status", [
  "active",
  "archived",
  "blocked"
]);

export const chatMessageStatusEnum = pgEnum("chat_message_status", [
  "visible",
  "hidden",
  "blocked"
]);

export const attachmentStatusEnum = pgEnum("attachment_status", [
  "private",
  "visible",
  "hidden",
  "blocked"
]);

export const reviewStatusEnum = pgEnum("review_status", [
  "visible",
  "hidden",
  "blocked"
]);

export const contentStatusEnum = pgEnum("content_status", [
  "draft",
  "private",
  "pending_review",
  "public",
  "hidden",
  "blocked"
]);

export const reportStatusEnum = pgEnum("report_status", [
  "open",
  "in_review",
  "resolved",
  "dismissed"
]);

export const moderationTargetTypeEnum = pgEnum("moderation_target_type", [
  "user",
  "speaker",
  "request",
  "booking",
  "session",
  "event",
  "review",
  "note",
  "recording",
  "content",
  "chat_message",
  "attachment"
]);

export const moderationActionTypeEnum = pgEnum("moderation_action_type", [
  "block",
  "unblock",
  "suspend",
  "restore",
  "hide",
  "cancel",
  "dispute",
  "resolve",
  "request_more_info"
]);

export const aiConversationTypeEnum = pgEnum("ai_conversation_type", [
  "student_tutor",
  "speaker_verification",
  "request_drafting",
  "matching",
  "session_notes"
]);

export const aiMessageRoleEnum = pgEnum("ai_message_role", [
  "system",
  "user",
  "assistant",
  "tool"
]);

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .defaultNow()
    .notNull()
};

export const users = pgTable(
  "users",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    email: text("email").notNull(),
    phoneNumber: varchar("phone_number", { length: 32 }).notNull(),
    displayName: text("display_name").notNull(),
    status: userStatusEnum("status").default("active").notNull(),
    preferredPlatformLanguage: varchar("preferred_platform_language", {
      length: 16
    })
      .default("en")
      .notNull(),
    preferredSessionLanguage: varchar("preferred_session_language", {
      length: 16
    })
      .default("en")
      .notNull(),
    countryCode: varchar("country_code", { length: 2 }),
    timeZone: text("time_zone").default("UTC").notNull(),
    emailVerifiedAt: timestamp("email_verified_at", { withTimezone: true }),
    phoneVerifiedAt: timestamp("phone_verified_at", { withTimezone: true }),
    lastActiveAt: timestamp("last_active_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    uniqueIndex("users_email_unique").on(table.email),
    uniqueIndex("users_phone_number_unique").on(table.phoneNumber),
    index("users_status_idx").on(table.status)
  ]
);

export const userRoles = pgTable(
  "user_roles",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    role: userRoleEnum("role").notNull(),
    assignedAt: timestamp("assigned_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.role] }),
    index("user_roles_role_idx").on(table.role)
  ]
);

export const localAuthIdentities = pgTable(
  "local_auth_identities",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .primaryKey(),
    provider: authProviderEnum("provider").default("local").notNull(),
    passwordHash: text("password_hash").notNull(),
    passwordUpdatedAt: timestamp("password_updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
    ...timestamps
  },
  (table) => [index("local_auth_identities_provider_idx").on(table.provider)]
);

export const localAuthSessions = pgTable(
  "local_auth_sessions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    tokenHash: text("token_hash").notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revoked_at", { withTimezone: true }),
    userAgent: text("user_agent"),
    ipAddress: text("ip_address"),
    ...timestamps
  },
  (table) => [
    uniqueIndex("local_auth_sessions_token_hash_unique").on(table.tokenHash),
    index("local_auth_sessions_user_idx").on(table.userId),
    index("local_auth_sessions_expires_idx").on(table.expiresAt)
  ]
);

export const studentProfiles = pgTable("student_profiles", {
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .primaryKey(),
  ageRange: ageRangeEnum("age_range").default("prefer_not_to_say").notNull(),
  educationLevel: text("education_level"),
  learningGoals: text("learning_goals"),
  ...timestamps
});

export const speakerProfiles = pgTable(
  "speaker_profiles",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .primaryKey(),
    verificationStatus: speakerVerificationStatusEnum("verification_status")
      .default("verification_pending")
      .notNull(),
    headline: text("headline"),
    bio: text("bio"),
    teachingLanguages: jsonb("teaching_languages")
      .$type<string[]>()
      .default(sql`'["en"]'::jsonb`)
      .notNull(),
    defaultSessionIntent: sessionFinancialIntentEnum("default_session_intent")
      .default("free")
      .notNull(),
    hourlyRateCents: integer("hourly_rate_cents"),
    donationAccepted: boolean("donation_accepted").default(false).notNull(),
    availabilitySummary: text("availability_summary"),
    completedSessionsCount: integer("completed_sessions_count")
      .default(0)
      .notNull(),
    averageRating: integer("average_rating").default(0).notNull(),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    limitedVerifiedAt: timestamp("limited_verified_at", {
      withTimezone: true
    }),
    suspendedAt: timestamp("suspended_at", { withTimezone: true }),
    blockedAt: timestamp("blocked_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("speaker_profiles_status_idx").on(table.verificationStatus),
    check(
      "speaker_profiles_hourly_rate_nonnegative",
      sql`${table.hourlyRateCents} IS NULL OR ${table.hourlyRateCents} >= 0`
    ),
    check(
      "speaker_profiles_completed_sessions_nonnegative",
      sql`${table.completedSessionsCount} >= 0`
    ),
    check(
      "speaker_profiles_average_rating_range",
      sql`${table.averageRating} >= 0 AND ${table.averageRating} <= 500`
    )
  ]
);

export const verificationEvents = pgTable(
  "verification_events",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    type: verificationEventTypeEnum("type").notNull(),
    status: verificationEventStatusEnum("status").default("pending").notNull(),
    target: text("target").notNull(),
    provider: text("provider"),
    providerReference: text("provider_reference"),
    attempts: integer("attempts").default(0).notNull(),
    riskLevel: verificationRiskLevelEnum("risk_level").default("unknown"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    verifiedAt: timestamp("verified_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("verification_events_user_idx").on(table.userId),
    index("verification_events_status_idx").on(table.status)
  ]
);

export const speakerCredentials = pgTable(
  "speaker_credentials",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    speakerId: uuid("speaker_id")
      .references(() => speakerProfiles.userId, { onDelete: "cascade" })
      .notNull(),
    type: credentialTypeEnum("type").notNull(),
    url: text("url").notNull(),
    status: credentialStatusEnum("status").default("pending").notNull(),
    aiSummary: text("ai_summary"),
    aiRiskLevel: verificationRiskLevelEnum("ai_risk_level").default("unknown"),
    reviewedAt: timestamp("reviewed_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("speaker_credentials_speaker_idx").on(table.speakerId),
    uniqueIndex("speaker_credentials_speaker_url_unique").on(
      table.speakerId,
      table.url
    )
  ]
);

export const subjects = pgTable(
  "subjects",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    slug: text("slug").notNull(),
    name: text("name").notNull(),
    parentSubjectId: uuid("parent_subject_id"),
    description: text("description"),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("subjects_slug_unique").on(table.slug),
    index("subjects_parent_idx").on(table.parentSubjectId)
  ]
);

export const userSubjects = pgTable(
  "user_subjects",
  {
    userId: uuid("user_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    subjectId: uuid("subject_id")
      .references(() => subjects.id, { onDelete: "cascade" })
      .notNull(),
    context: subjectContextEnum("context").notNull(),
    proficiencyLevel: text("proficiency_level"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    primaryKey({ columns: [table.userId, table.subjectId, table.context] }),
    index("user_subjects_subject_context_idx").on(
      table.subjectId,
      table.context
    )
  ]
);

export const studentRequests = pgTable(
  "student_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    subjectId: uuid("subject_id").references(() => subjects.id),
    title: text("title").notNull(),
    description: text("description").notNull(),
    educationLevel: text("education_level"),
    preferredLanguage: varchar("preferred_language", { length: 16 })
      .default("en")
      .notNull(),
    urgency: requestUrgencyEnum("urgency").default("flexible").notNull(),
    status: requestStatusEnum("status").default("open").notNull(),
    sessionIntent: sessionFinancialIntentEnum("session_intent")
      .default("free")
      .notNull(),
    paymentOfferCents: integer("payment_offer_cents"),
    preferredTimeWindows: jsonb("preferred_time_windows")
      .$type<Array<{ startAt: string; endAt: string }>>()
      .default(sql`'[]'::jsonb`)
      .notNull(),
    ...timestamps
  },
  (table) => [
    index("student_requests_student_idx").on(table.studentId),
    index("student_requests_subject_idx").on(table.subjectId),
    index("student_requests_status_idx").on(table.status),
    index("student_requests_language_idx").on(table.preferredLanguage),
    check(
      "student_requests_payment_offer_nonnegative",
      sql`${table.paymentOfferCents} IS NULL OR ${table.paymentOfferCents} >= 0`
    )
  ]
);

export const requestResponses = pgTable(
  "request_responses",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id")
      .references(() => studentRequests.id, { onDelete: "cascade" })
      .notNull(),
    speakerId: uuid("speaker_id")
      .references(() => speakerProfiles.userId)
      .notNull(),
    status: responseStatusEnum("status").default("pending").notNull(),
    message: text("message").notNull(),
    proposedStartAt: timestamp("proposed_start_at", { withTimezone: true }),
    proposedEndAt: timestamp("proposed_end_at", { withTimezone: true }),
    sessionIntent: sessionFinancialIntentEnum("session_intent")
      .default("free")
      .notNull(),
    requestedPriceCents: integer("requested_price_cents"),
    ...timestamps
  },
  (table) => [
    index("request_responses_request_idx").on(table.requestId),
    index("request_responses_speaker_idx").on(table.speakerId),
    index("request_responses_status_idx").on(table.status),
    check(
      "request_responses_requested_price_nonnegative",
      sql`${table.requestedPriceCents} IS NULL OR ${table.requestedPriceCents} >= 0`
    )
  ]
);

export const availabilityWindows = pgTable(
  "availability_windows",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    speakerId: uuid("speaker_id")
      .references(() => speakerProfiles.userId, { onDelete: "cascade" })
      .notNull(),
    dayOfWeek: integer("day_of_week").notNull(),
    startMinute: integer("start_minute").notNull(),
    endMinute: integer("end_minute").notNull(),
    timeZone: text("time_zone").default("UTC").notNull(),
    validFrom: timestamp("valid_from", { withTimezone: true }),
    validUntil: timestamp("valid_until", { withTimezone: true }),
    isActive: boolean("is_active").default(true).notNull(),
    ...timestamps
  },
  (table) => [
    index("availability_windows_speaker_idx").on(table.speakerId),
    index("availability_windows_day_idx").on(table.dayOfWeek),
    check(
      "availability_windows_day_range",
      sql`${table.dayOfWeek} >= 0 AND ${table.dayOfWeek} <= 6`
    ),
    check(
      "availability_windows_minute_range",
      sql`${table.startMinute} >= 0 AND ${table.startMinute} < 1440 AND ${table.endMinute} > ${table.startMinute} AND ${table.endMinute} <= 1440`
    )
  ]
);

export const bookings = pgTable(
  "bookings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => studentRequests.id),
    responseId: uuid("response_id").references(() => requestResponses.id),
    studentId: uuid("student_id")
      .references(() => users.id)
      .notNull(),
    speakerId: uuid("speaker_id")
      .references(() => speakerProfiles.userId)
      .notNull(),
    subjectId: uuid("subject_id").references(() => subjects.id),
    title: text("title").notNull(),
    status: bookingStatusEnum("status").default("requested").notNull(),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    meetingProvider: meetingProviderEnum("meeting_provider"),
    meetingUrl: text("meeting_url"),
    sessionIntent: sessionFinancialIntentEnum("session_intent")
      .default("free")
      .notNull(),
    priceCents: integer("price_cents"),
    donationAllowed: boolean("donation_allowed").default(false).notNull(),
    studentConfirmedAt: timestamp("student_confirmed_at", {
      withTimezone: true
    }),
    speakerConfirmedAt: timestamp("speaker_confirmed_at", {
      withTimezone: true
    }),
    completedAt: timestamp("completed_at", { withTimezone: true }),
    cancelledByUserId: uuid("cancelled_by_user_id").references(() => users.id),
    cancellationReason: text("cancellation_reason"),
    noShowMarkedByUserId: uuid("no_show_marked_by_user_id").references(
      () => users.id
    ),
    ...timestamps
  },
  (table) => [
    index("bookings_student_idx").on(table.studentId),
    index("bookings_speaker_idx").on(table.speakerId),
    index("bookings_status_idx").on(table.status),
    index("bookings_start_at_idx").on(table.startAt),
    check("bookings_end_after_start", sql`${table.endAt} > ${table.startAt}`),
    check(
      "bookings_price_nonnegative",
      sql`${table.priceCents} IS NULL OR ${table.priceCents} >= 0`
    )
  ]
);

export const calendarHolds = pgTable(
  "calendar_holds",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    studentId: uuid("student_id")
      .references(() => users.id, { onDelete: "cascade" })
      .notNull(),
    speakerId: uuid("speaker_id")
      .references(() => speakerProfiles.userId, { onDelete: "cascade" })
      .notNull(),
    requestId: uuid("request_id").references(() => studentRequests.id, {
      onDelete: "cascade"
    }),
    startAt: timestamp("start_at", { withTimezone: true }).notNull(),
    endAt: timestamp("end_at", { withTimezone: true }).notNull(),
    expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
    releasedAt: timestamp("released_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("calendar_holds_student_idx").on(table.studentId),
    index("calendar_holds_speaker_idx").on(table.speakerId),
    index("calendar_holds_expires_idx").on(table.expiresAt),
    check(
      "calendar_holds_end_after_start",
      sql`${table.endAt} > ${table.startAt}`
    )
  ]
);

export const chatThreads = pgTable(
  "chat_threads",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").references(() => studentRequests.id, {
      onDelete: "cascade"
    }),
    bookingId: uuid("booking_id").references(() => bookings.id, {
      onDelete: "cascade"
    }),
    status: chatThreadStatusEnum("status").default("active").notNull(),
    ...timestamps
  },
  (table) => [
    index("chat_threads_request_idx").on(table.requestId),
    index("chat_threads_booking_idx").on(table.bookingId),
    index("chat_threads_status_idx").on(table.status)
  ]
);

export const chatMessages = pgTable(
  "chat_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    threadId: uuid("thread_id")
      .references(() => chatThreads.id, { onDelete: "cascade" })
      .notNull(),
    senderId: uuid("sender_id")
      .references(() => users.id)
      .notNull(),
    body: text("body").notNull(),
    status: chatMessageStatusEnum("status").default("visible").notNull(),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("chat_messages_thread_idx").on(table.threadId),
    index("chat_messages_sender_idx").on(table.senderId),
    index("chat_messages_status_idx").on(table.status)
  ]
);

export const attachments = pgTable(
  "attachments",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    uploaderId: uuid("uploader_id")
      .references(() => users.id)
      .notNull(),
    chatMessageId: uuid("chat_message_id").references(() => chatMessages.id, {
      onDelete: "cascade"
    }),
    requestId: uuid("request_id").references(() => studentRequests.id, {
      onDelete: "cascade"
    }),
    bookingId: uuid("booking_id").references(() => bookings.id, {
      onDelete: "cascade"
    }),
    fileName: text("file_name").notNull(),
    storagePath: text("storage_path").notNull(),
    mimeType: text("mime_type").notNull(),
    sizeBytes: integer("size_bytes").notNull(),
    status: attachmentStatusEnum("status").default("private").notNull(),
    ...timestamps
  },
  (table) => [
    index("attachments_uploader_idx").on(table.uploaderId),
    index("attachments_message_idx").on(table.chatMessageId),
    index("attachments_request_idx").on(table.requestId),
    index("attachments_booking_idx").on(table.bookingId),
    index("attachments_status_idx").on(table.status),
    check("attachments_size_positive", sql`${table.sizeBytes} > 0`)
  ]
);

export const sessionReviews = pgTable(
  "session_reviews",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id")
      .references(() => bookings.id, { onDelete: "cascade" })
      .notNull(),
    reviewerId: uuid("reviewer_id")
      .references(() => users.id)
      .notNull(),
    revieweeId: uuid("reviewee_id")
      .references(() => users.id)
      .notNull(),
    rating: integer("rating").notNull(),
    body: text("body"),
    status: reviewStatusEnum("status").default("visible").notNull(),
    ...timestamps
  },
  (table) => [
    uniqueIndex("session_reviews_booking_reviewer_unique").on(
      table.bookingId,
      table.reviewerId
    ),
    index("session_reviews_reviewee_idx").on(table.revieweeId),
    index("session_reviews_status_idx").on(table.status),
    check(
      "session_reviews_rating_range",
      sql`${table.rating} >= 1 AND ${table.rating} <= 5`
    )
  ]
);

export const contentItems = pgTable(
  "content_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    bookingId: uuid("booking_id").references(() => bookings.id),
    speakerId: uuid("speaker_id").references(() => speakerProfiles.userId),
    subjectId: uuid("subject_id").references(() => subjects.id),
    title: text("title").notNull(),
    description: text("description"),
    language: varchar("language", { length: 16 }).default("en").notNull(),
    status: contentStatusEnum("status").default("private").notNull(),
    videoUrl: text("video_url"),
    notes: text("notes"),
    transcript: text("transcript"),
    instructorApprovedAt: timestamp("instructor_approved_at", {
      withTimezone: true
    }),
    adminApprovedAt: timestamp("admin_approved_at", { withTimezone: true }),
    publishedAt: timestamp("published_at", { withTimezone: true }),
    hiddenAt: timestamp("hidden_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("content_items_status_idx").on(table.status),
    index("content_items_subject_idx").on(table.subjectId),
    index("content_items_speaker_idx").on(table.speakerId),
    index("content_items_language_idx").on(table.language)
  ]
);

export const reports = pgTable(
  "reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    reporterId: uuid("reporter_id")
      .references(() => users.id)
      .notNull(),
    targetType: moderationTargetTypeEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    status: reportStatusEnum("status").default("open").notNull(),
    reason: text("reason").notNull(),
    details: text("details"),
    resolvedByAdminId: uuid("resolved_by_admin_id").references(() => users.id),
    resolvedAt: timestamp("resolved_at", { withTimezone: true }),
    ...timestamps
  },
  (table) => [
    index("reports_reporter_idx").on(table.reporterId),
    index("reports_target_idx").on(table.targetType, table.targetId),
    index("reports_status_idx").on(table.status)
  ]
);

export const moderationActions = pgTable(
  "moderation_actions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    adminId: uuid("admin_id")
      .references(() => users.id)
      .notNull(),
    targetType: moderationTargetTypeEnum("target_type").notNull(),
    targetId: uuid("target_id").notNull(),
    action: moderationActionTypeEnum("action").notNull(),
    reason: text("reason").notNull(),
    previousStatus: text("previous_status"),
    nextStatus: text("next_status"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    index("moderation_actions_admin_idx").on(table.adminId),
    index("moderation_actions_target_idx").on(
      table.targetType,
      table.targetId
    ),
    index("moderation_actions_action_idx").on(table.action)
  ]
);

export const aiConversations = pgTable(
  "ai_conversations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: uuid("user_id").references(() => users.id, {
      onDelete: "cascade"
    }),
    type: aiConversationTypeEnum("type").notNull(),
    title: text("title"),
    subjectId: uuid("subject_id").references(() => subjects.id),
    language: varchar("language", { length: 16 }).default("en").notNull(),
    model: text("model"),
    promptVersion: text("prompt_version"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    ...timestamps
  },
  (table) => [
    index("ai_conversations_user_idx").on(table.userId),
    index("ai_conversations_type_idx").on(table.type)
  ]
);

export const aiMessages = pgTable(
  "ai_messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    conversationId: uuid("conversation_id")
      .references(() => aiConversations.id, { onDelete: "cascade" })
      .notNull(),
    role: aiMessageRoleEnum("role").notNull(),
    content: text("content").notNull(),
    tokenCount: integer("token_count"),
    metadata: jsonb("metadata")
      .$type<Record<string, unknown>>()
      .default(sql`'{}'::jsonb`)
      .notNull(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull()
  },
  (table) => [
    index("ai_messages_conversation_idx").on(table.conversationId),
    index("ai_messages_role_idx").on(table.role)
  ]
);

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;
export type LocalAuthIdentity = typeof localAuthIdentities.$inferSelect;
export type NewLocalAuthIdentity = typeof localAuthIdentities.$inferInsert;
export type LocalAuthSession = typeof localAuthSessions.$inferSelect;
export type NewLocalAuthSession = typeof localAuthSessions.$inferInsert;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type NewStudentProfile = typeof studentProfiles.$inferInsert;
export type SpeakerProfile = typeof speakerProfiles.$inferSelect;
export type NewSpeakerProfile = typeof speakerProfiles.$inferInsert;
export type StudentRequest = typeof studentRequests.$inferSelect;
export type NewStudentRequest = typeof studentRequests.$inferInsert;
export type Booking = typeof bookings.$inferSelect;
export type NewBooking = typeof bookings.$inferInsert;
export type ModerationAction = typeof moderationActions.$inferSelect;
export type NewModerationAction = typeof moderationActions.$inferInsert;
