# Engineering Principles

## Engineering Strategy

Build the MVP as a modular monolith with strong boundaries. The first goal is not to create many services. The first goal is to create a reliable end-to-end learning workflow that can later be split into services only when scale or operational needs justify it.

Core strategy:

- Build vertical slices instead of isolated features.
- Keep business logic in domain modules, not scattered across UI components.
- Use explicit status fields for workflows like verification, booking, moderation, and content approval.
- Make every sensitive action auditable.
- Prefer simple, boring, well-tested code over clever abstractions.
- Design for global users from day one: language, time zone, accessibility, and slow network conditions matter.

## Software Engineering Principles

### 1. Modular Domain Boundaries

Organize the app by product domains:

- Auth and verification
- Users and profiles
- Speaker verification
- Student requests
- Marketplace search
- Booking and availability
- Chat and attachments
- AI tutor
- Reviews and reliability
- Content library
- Admin and moderation
- Payments and donations later

Each domain should own its validation, database access, service logic, and tests.

### 2. Strong Types And Validation

- Use TypeScript strict mode.
- Use Zod schemas for form and API validation.
- Validate inputs on both client and server.
- Never trust client-side checks for permissions or business rules.
- Use typed database queries through Drizzle.

### 3. Workflow State Machines

Important workflows should use explicit statuses.

Examples:

- User status: `active`, `blocked`, `suspended`, `deleted_by_user`.
- Speaker status: `verification_pending`, `verified`, `limited_verified`, `needs_review`, `suspended`, `blocked`.
- Booking status: `draft`, `requested`, `confirmed`, `cancelled`, `cancelled_by_admin`, `completed`, `no_show`, `disputed`, `blocked`.
- Content status: `draft`, `private`, `pending_review`, `public`, `hidden`, `blocked`.

Avoid ambiguous booleans like `isDone` or `isOkay` for complex workflows.

### 4. Keep Data Consistent

- Use database constraints where possible.
- Use transactions for multi-step changes like booking confirmation, no-show handling, reviews, and moderation.
- Store timestamps in UTC.
- Store user time zones separately.
- Do not hard-delete sensitive records. Use statuses and audit logs.

### 5. Build For Change

Use provider interfaces for services likely to change:

- AI provider
- SMS/phone verification provider
- Email provider
- Video meeting provider
- Payment provider
- File storage provider

This lets us start with Supabase, Twilio, OpenAI, Zoom links, and Stripe later without locking the app into one vendor forever.

## Security Principles

### 1. Secure By Default

- Users cannot request sessions, chat, book, or publish profiles until email and phone are verified.
- Speakers cannot offer sessions until speaker verification is complete.
- Blocked or suspended users lose access immediately.
- Admin actions should require strong authorization checks.

### 2. Least Privilege

- Use role-based permissions for student, speaker, admin, and system actions.
- Admin roles should have levels, so not every admin can perform every action.
- Use Supabase Row Level Security for sensitive data.
- Never expose service-role keys to the browser.

### 3. Input And Output Safety

- Validate all form inputs.
- Escape user-generated content.
- Sanitize rendered rich text or avoid rich text in MVP.
- Use parameterized queries through the ORM.
- Protect against XSS, CSRF, SQL injection, file upload abuse, and broken access control.

### 4. Verification Abuse Controls

- Rate-limit email and phone OTP attempts.
- Log verification attempts.
- Detect repeated phone/email changes.
- Add CAPTCHA or friction if abuse appears.
- Watch for duplicate accounts, suspicious links, and spammy request patterns.

### 5. File Upload Safety

- Restrict file types.
- Enforce file size limits.
- Store uploads outside the database.
- Use private buckets by default.
- Generate short-lived signed URLs for private files.
- Add malware scanning later if public uploads grow.

### 6. Privacy And Minor Safety

- Collect only necessary personal information.
- Do not record student webcams by default.
- Do not record student microphones by default.
- Keep chats and session metadata reviewable only for authorized moderation cases.
- Make public notes and recordings opt-in and approval-based.
- Avoid exposing student age publicly.

### 7. AI Safety

- AI should assist verification and moderation, not make irreversible decisions without auditability.
- Keep AI outputs traceable to the input and prompt version used.
- Treat public profile links and uploaded content as untrusted input.
- Protect AI workflows against prompt injection from profile text, files, or external pages.
- Avoid sending unnecessary personal data to AI providers.
- Store AI decisions as recommendations with confidence/risk labels.

## Quality Principles

### 1. Definition Of Done

A feature is not done until:

- It works for the happy path.
- It handles common error states.
- It checks authorization server-side.
- It validates input server-side.
- It has focused tests for risky behavior.
- It has loading, empty, and failure states in the UI.
- It logs important system or moderation actions.
- It does not break the core student-to-speaker booking flow.

### 2. UX Quality

- Build real workflows first, not marketing pages.
- Keep dashboards dense, scannable, and marketplace-like.
- Make free, donation, paid, and sponsored session intent impossible to miss.
- Use preferred language and time zone everywhere matching depends on them.
- Ensure mobile usability for global students.
- Keep accessibility in mind: keyboard navigation, labels, contrast, and readable layouts.

### 3. Observability

Track important events:

- Signup
- Email verification
- Phone verification
- Speaker verification decision
- Student request created
- Booking requested
- Booking confirmed
- Session completed
- No-show marked
- Review submitted
- Report created
- Admin moderation action
- AI tutor session created

Use structured logs for backend errors and moderation actions.

### 4. Error Handling

- Show user-friendly errors.
- Log developer-friendly errors.
- Do not leak secrets, tokens, stack traces, or private account details to users.
- Make retry behavior safe and idempotent for actions like sending OTPs, creating bookings, and submitting reviews.

## Testing Principles

### 1. Test By Risk

Do not chase 100% coverage for the MVP. Prioritize tests around money, identity, minors, permissions, booking state, moderation, and AI workflow safety.

### 2. Unit Tests

Use unit tests for:

- Verification decision rules
- Booking status transitions
- No-show and reliability scoring
- Points calculations
- Permission checks
- Zod validation schemas
- Payment/donation intent rules

### 3. Integration Tests

Use integration tests for:

- Database queries
- Auth guards
- Speaker verification workflow
- Student request and speaker response workflow
- Booking confirmation
- Chat creation
- Review submission
- Moderation logging

### 4. End-To-End Tests

Use Playwright for core flows:

- Student signup with email and phone verification.
- Speaker signup with email and phone verification.
- Speaker automated verification.
- Student asks AI tutor.
- Student posts request.
- Speaker responds.
- Booking is confirmed.
- Chat works.
- Session is completed.
- Both users review.
- Admin blocks and unblocks a user or session.

### 5. Security And Permission Tests

Explicitly test that:

- Unverified users cannot book, chat, or publish profiles.
- Unverified speakers cannot accept sessions.
- Students cannot access other students' private chats or files.
- Speakers cannot access unrelated bookings.
- Blocked users cannot continue platform activity.
- Non-admins cannot perform admin actions.
- Hidden or blocked content is not publicly visible.

### 6. AI Tests

Test AI workflows with fixed fixtures:

- Speaker profile summary returns expected structured fields.
- Risk labels are stored.
- AI output does not directly approve high-risk profiles.
- Uploaded transcript generates notes without exposing private student data.
- Prompt-injection-style profile text does not override system rules.

## Code Review Principles

Review should focus on:

- Broken access control
- Incorrect status transitions
- Data leaks
- Missing validation
- Unsafe file handling
- Race conditions in booking/calendar logic
- Missing audit logs
- Missing tests for high-risk logic
- UI states that confuse free/donation/paid expectations

## Release Principles

- Use migrations for every database change.
- Deploy small increments.
- Keep feature flags for risky features.
- Run smoke tests after deployment.
- Keep rollback simple.
- Never deploy secrets into the client bundle.
- Monitor verification errors, booking failures, AI errors, and moderation actions after release.

