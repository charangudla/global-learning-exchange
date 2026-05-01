# MVP Development Plan

## Development Strategy

Build the MVP as a vertical slice first:

Student signs up, verifies email/phone, asks AI for help, creates a request, a verified speaker responds, both confirm a booking, they exchange messages, the session is marked complete, both leave reviews, and admin can moderate the records.

Do not start with a polished landing page. Start with the real workflow.

## Phase 0: Project Setup

Goal: create the application foundation.

Tasks:

- Scaffold Next.js app with TypeScript and App Router.
- Add Tailwind CSS, shadcn/ui, lucide-react, Zod, Drizzle, Supabase client, and test tools.
- Configure environment variables.
- Create base layouts for public pages, auth pages, dashboard pages, and admin pages.
- Add linting, formatting, and TypeScript strict mode.
- Add initial README setup instructions.

Required accounts:

- Supabase project
- Twilio Verify service
- OpenAI API key
- Vercel project, when ready to deploy

Suggested local environment variables:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `DATABASE_URL`
- `TWILIO_ACCOUNT_SID`
- `TWILIO_AUTH_TOKEN`
- `TWILIO_VERIFY_SERVICE_SID`
- `OPENAI_API_KEY`

## Phase 1: Data Model

Goal: define the core database before screens become messy.

Initial tables:

- `users`
- `user_profiles`
- `student_profiles`
- `speaker_profiles`
- `verification_events`
- `speaker_credentials`
- `subjects`
- `user_subjects`
- `student_requests`
- `request_responses`
- `availability_windows`
- `bookings`
- `chat_threads`
- `chat_messages`
- `attachments`
- `session_reviews`
- `content_items`
- `reports`
- `moderation_actions`
- `ai_conversations`
- `ai_messages`

Important rules:

- Store all dates/times in UTC.
- Store user time zone separately.
- Do not hard-delete moderation-sensitive records.
- Use status fields for blocked, hidden, suspended, disputed, and cancelled records.

## Phase 2: Auth And User Verification

Goal: no user can use the platform fully until email and phone are verified.

Build:

- Signup/login.
- Email OTP verification.
- Phone OTP verification.
- User onboarding.
- Role selection: student or speaker.
- Route guards for unverified users.

Acceptance criteria:

- User can create account.
- User must verify email.
- User must verify phone.
- Unverified user cannot request sessions, accept bookings, chat, or publish a speaker profile.

## Phase 3: Student Dashboard And AI Tutor

Goal: students can get help immediately.

Build:

- Student dashboard.
- AI tutor chat.
- Subject/level/language-aware prompt context.
- Save AI conversations.
- Button to convert AI conversation into a student request draft.

Acceptance criteria:

- Verified student can ask AI a question.
- AI can suggest next steps.
- Student can create a request draft from the AI chat.

## Phase 4: Speaker Application And Automated Verification

Goal: speakers can become visible without manual admin work in ordinary cases.

Build:

- Speaker application form.
- Credential links: LinkedIn, Google Scholar, ORCID, university profile, company profile, portfolio, certifications.
- AI profile summary.
- Automated verification decision:
  - `verified`
  - `limited_verified`
  - `needs_review`
- Admin exception review page.

Acceptance criteria:

- Speaker completes application.
- System checks email/phone verification.
- System summarizes profile with AI.
- Low-risk speaker can become verified automatically.
- Admin can review exceptions.

## Phase 5: Marketplace And Requests

Goal: support both Fiverr-style and Upwork-style discovery.

Build:

- Speaker search page.
- Speaker profile page.
- Student request posting.
- Request browsing for verified speakers.
- Filters by subject, language, availability, free/donation/paid, rating, and verification status.

Acceptance criteria:

- Student can browse speakers.
- Student can post request.
- Speaker can browse matching requests.
- Speaker can respond to request.

## Phase 6: Booking And Calendar

Goal: students and speakers can schedule one-on-one sessions.

Build:

- Speaker availability windows.
- Booking request flow.
- Accept, decline, propose alternate time.
- Calendar hold expiration.
- Booking statuses.
- Meeting link storage.

Acceptance criteria:

- Student can request a time.
- Speaker can accept or propose alternate time.
- Confirmed booking stores meeting link.
- Booking appears in both users' dashboards.

## Phase 7: Chat And Files

Goal: users can clarify the session before confirming or attending.

Build:

- Chat thread per request/booking.
- Realtime chat updates.
- File attachments.
- Admin visibility for reported chats.
- Safety notice about private contact sharing.

Acceptance criteria:

- Student and speaker can exchange messages.
- Attachments can be uploaded and viewed.
- Chat is tied to the session/request.

## Phase 8: Session Completion, Reviews, And Reliability

Goal: close the loop after the session.

Build:

- Mark session complete.
- Mark no-show.
- Student reviews speaker.
- Speaker reviews student.
- Reliability score updates.
- Points updates.
- Session history.

Acceptance criteria:

- Completed session appears in history.
- Both sides can review.
- No-show affects reliability.
- Ratings appear on profiles.

## Phase 9: Content Library

Goal: public learning content can grow from completed sessions.

Build:

- Add notes or transcript text to completed sessions.
- Add external recording URL.
- Instructor approval for public sharing.
- Admin content moderation.
- Public content library search.

Acceptance criteria:

- Notes can be private or public.
- Public content appears in library.
- Admin can hide/block content.

## Phase 10: Admin And Moderation

Goal: admins can protect the platform.

Build:

- User list.
- Speaker verification exception queue.
- Session/request/booking/event list.
- Reports/disputes queue.
- Content approval queue.
- Block/unblock controls.
- Suspend/restore speaker privileges.
- Moderation action log.

Acceptance criteria:

- Admin can block and unblock accounts.
- Admin can block/hide/cancel sessions, requests, events, reviews, notes, recordings, and content.
- Every admin action has an audit record.

## First Development Milestone

The first milestone should be a rough but working vertical slice:

1. Verified student account.
2. Verified speaker account.
3. AI tutor chat.
4. Student request.
5. Speaker response.
6. Booking confirmation.
7. Chat.
8. Session completion.
9. Reviews.
10. Admin block/unblock.

This proves the product before we spend time polishing every page.

