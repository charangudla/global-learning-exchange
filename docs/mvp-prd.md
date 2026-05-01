# MVP Product Requirements Document

## Working Name

Global Learning Exchange

## Product Summary

Global Learning Exchange is a nonprofit-first education marketplace where individual students can get help from verified volunteer or paid speakers, tutors, professors, teachers, industry professionals, and AI tutors. The MVP proves the complete one-on-one learning workflow from request to booking to session completion, while keeping AI help available immediately.

The product should feel like a trusted education-focused version of Upwork, Fiverr, and Freelancer: searchable profiles, posted requests, booking, reviews, dashboards, and history, but with a mission-first emphasis on free global education access.

## MVP Goal

Create a testable platform that demonstrates the full lifecycle of a one-on-one learning session:

1. Student signs up.
2. Student can ask an AI tutor immediately.
3. Student searches verified speakers or posts a help request.
4. Speaker accepts or responds.
5. Student and speaker chat before booking.
6. Session is scheduled using calendar availability.
7. Video meeting details are shared.
8. Session is completed.
9. Notes, recording metadata, ratings, reviews, and history are saved.
10. Admin can moderate users, verification exceptions, sessions, disputes, and content.

## Primary MVP Audience

The first version should serve individual students first.

Secondary audiences:

- Verified speakers and tutors
- Volunteer educators
- Industry professionals and SMEs
- Admin/moderation team

Schools, colleges, universities, and learning communities should be supported later as organization accounts.

## Core Principles

- Education access comes first.
- Free and volunteer sessions should be easy to discover.
- Paid or donation-supported sessions are allowed but must be clearly labeled.
- Speakers must pass automated verification before offering sessions.
- Preferred language should be used across onboarding, search, matching, chat, sessions, AI tutoring, and content discovery.
- AI help should be immediate, but human help should remain central.
- Students should be able to learn globally across time zones and subjects.
- Safety, credibility, and moderation must be built into the foundation.

## User Roles

### Student

Students can:

- Create an account.
- Select subjects, majors, goals, language, country, and time zone.
- Select preferred platform language and preferred learning/session language.
- Ask the AI tutor questions immediately.
- Search for speakers/tutors.
- Post a request for help.
- Request a one-on-one session.
- Chat with speakers before booking.
- Attend sessions.
- View session history, notes, recordings, and reviews.
- Rate and review speakers.
- Report issues.

### Speaker/Tutor

Speakers can:

- Apply to become a speaker.
- Submit profile details, credentials, subjects, languages, availability, and payment preferences.
- Verify email and phone number using one-time codes.
- Add LinkedIn, Google Scholar, ORCID, university profile, company profile, portfolio, or certifications.
- Mark sessions as free, free with optional donation, paid requested, or sponsored.
- Browse student requests after verification.
- Accept, decline, or propose alternate details.
- Chat before confirming a booking.
- Provide meeting links.
- View session history.
- Rate and review students.
- Approve or reject publication of notes/recordings.

### Admin

Admins can:

- Review speaker verification exceptions.
- View AI-generated profile summaries, verification results, and credibility signals.
- Approve, reject, suspend, or request more information only when automated verification requires escalation.
- Review reports and disputes.
- View users, sessions, bookings, chats, ratings, reviews, and content metadata.
- Block, unblock, suspend, or restore any user account, including students, speakers, tutors, and admins with lower privileges.
- Block, cancel, hide, restore, or mark as disputed any request, booking, session, public lecture, event, review, note, recording, or content item.
- Approve public notes and recordings.
- Moderate suspicious or abusive activity.

### AI Tutor

AI tutor can:

- Answer student questions immediately.
- Explain concepts by subject and level.
- Suggest learning plans.
- Recommend relevant speakers.
- Help students draft better session requests.
- Summarize speaker applications for admin review.
- Generate notes, summaries, quizzes, and flashcards from approved lecture transcripts or uploaded notes.

## MVP Feature Scope

### 1. Authentication And Onboarding

Required:

- Email/password signup and login.
- Email verification with a one-time code.
- Phone verification with a one-time code for every user.
- Users cannot request sessions, accept bookings, chat, or publish profiles until both email and phone are verified.
- Role selection: student or speaker.
- Student onboarding fields:
  - Name
  - Email verification status
  - Phone verification status
  - Age range
  - Country
  - Time zone
  - Preferred platform language
  - Preferred learning/session language
  - Subjects/majors of interest
  - Learning goals
- Speaker application fields:
  - Name
  - Bio
  - Country
  - Time zone
  - Languages
  - Subjects/majors
  - Credentials
  - Links for verification
  - Email verification status
  - Phone verification status
  - Free/paid/donation preference
  - Availability

Deferred:

- Organization accounts
- School/university dashboards
- Full identity verification vendor integration
- Social login

### 2. Automated Speaker Verification Workflow

Required:

- New speaker accounts start as `verification_pending`.
- Speakers cannot accept bookings until account verification and speaker verification are complete.
- Speaker must already have verified email with a one-time code.
- Speaker must already have verified phone number with a one-time code.
- Speaker should provide at least one credibility link, such as LinkedIn, Google Scholar, ORCID, university profile, company profile, portfolio, publication page, or professional certification.
- AI reviews the public profile links and application text to generate:
  - Claimed expertise
  - Credential links
  - Possible credibility signals
  - Missing information
  - Suggested verification risk level
  - Summary of what students will see
- Low-risk applications can be automatically marked `verified`.
- Medium-risk applications can be marked `limited_verified`, allowing lower booking limits until trust improves.
- High-risk, incomplete, suspicious, or reported applications go to admin review.

Admins handle exceptions, appeals, reports, and suspicious cases. The default path should be automated so the platform can scale.

### 3. Student AI Tutor

Required:

- AI tutor chat available from student dashboard.
- Subject and education-level aware prompts.
- AI can suggest whether the student should request a human session.
- AI can help turn a rough question into a well-structured tutoring request.

Deferred:

- Voice tutoring
- Video tutoring
- Agent joining live meetings
- Long-term personalized memory

### 4. Marketplace Discovery

Required:

- Speaker search and listing page.
- Filters:
  - Subject
  - Language
  - Availability
  - Free
  - Donation accepted
  - Paid
  - Rating
  - Time zone compatibility
- Speaker profile page:
  - Bio
  - Subjects
  - Languages
  - Preferred teaching/session language
  - Availability
  - Session type
  - Free/paid/donation preference
  - Rating/reviews
  - Completed sessions
  - Verification status

### 5. Student Requests

Required:

- Student can post a request for help.
- Request fields:
  - Topic
  - Subject/major
  - Description
  - Education level
  - Preferred language
  - Urgency
  - Preferred time windows
  - Free request, donation possible, or payment offer
  - Attachments
- Verified speakers can browse and respond to requests.

### 6. Booking And Calendar

Required:

- Speaker availability calendar.
- Student can request a time.
- Speaker can accept, decline, or propose alternate time.
- Booking status:
  - Draft
  - Requested
  - Pending speaker response
  - Confirmed
  - Cancelled
  - Cancelled by admin
  - Completed
  - No-show
  - Disputed
  - Blocked
- Calendar holds expire if not confirmed.

Recommended MVP abuse control:

- New students can hold only a small number of pending bookings at once.
- Repeated no-shows reduce booking limits.
- Confirmed bookings require both sides to acknowledge.

### 7. Pre-Session Chat And Files

Required:

- Chat thread attached to each request or booking.
- Students and speakers can clarify topic, level, goals, and expectations.
- File attachments for slides, PDFs, assignments, or reference material.
- Safety notices around sharing personal contact information.

Deferred:

- Real-time moderation
- AI chat safety scanning
- Rich collaborative whiteboard

### 8. Video Session

MVP approach:

- Speaker can paste a Zoom, Google Meet, Webex, Jitsi, or LiveKit meeting link.
- Platform stores meeting link in confirmed booking.
- Automated Zoom integration is deferred until after workflow validation.

Reason:

Manual links are faster to test and avoid early complexity with provider APIs, OAuth, meeting bots, recording permissions, and platform-specific rules.

Future:

- Zoom API integration
- Jitsi native rooms
- LiveKit rooms
- AI note-taker integration

### 9. Notes And Recordings

MVP policy:

- Recording is optional.
- Record lecture content only, not student webcams.
- Do not record student microphones by default.
- Public posting requires instructor approval.
- Notes/recordings can become searchable by all users only when approved by the instructor/admin.

Required:

- Store session notes manually or from uploaded transcript.
- Admin/instructor can mark notes as public or private.
- Public content appears in content library.

Deferred:

- Automatic recording
- Automatic YouTube upload
- AI meeting bot
- Live transcription

### 10. Ratings, Reviews, Points, And Reliability

Required:

- Student rates speaker after completed session.
- Speaker rates student after completed session.
- Written reviews.
- Reliability score based on:
  - Completed sessions
  - No-shows
  - Late cancellations
  - Disputes
  - Average rating

Initial no-show policy:

- First no-show: warning.
- Second no-show within 30 days: lower priority and reduced booking limits.
- Third no-show within 60 days: temporary booking restriction.
- Repeated speaker no-shows: admin review and possible loss of approved status.

Points examples:

- Completed free session given: +20 speaker points
- Completed paid session: +10 speaker points
- Student attends confirmed session: +5 student points
- No-show: negative reliability impact
- Public approved notes/recording: +10 contribution points

### 11. Donations And Payments

Required for MVP:

- Session financial intent is visible:
  - Free
  - Free, donations accepted
  - Paid requested
  - Student offers payment
  - Sponsored
- No expectation of payment when a session is marked free or donation optional.
- Speaker profile must clearly state preference.

Recommended MVP implementation:

- Display payment/donation intent only.
- Defer payment processing until trust and scheduling workflow is validated.

Future:

- Stripe
- PayPal
- Sponsored session credits
- Platform donations
- Speaker gifts
- Receipts and tax handling

### 12. Content Library

Required:

- Public library for approved notes and recordings.
- Search by subject, topic, speaker, language, and level.
- Each content item has:
  - Title
  - Description
  - Speaker
  - Subject
  - Language
  - Session date
  - Visibility
  - Approval status
  - Optional video URL
  - Notes

Deferred:

- YouTube auto-upload
- Automatic transcript generation
- Recommendation engine based on watch history

### 13. Admin Dashboard

Required:

- Speaker verification exception queue.
- User list.
- Session list.
- Requests/bookings/events list.
- Reports/disputes list.
- Content approval queue.
- Moderation action log.
- Block/unblock controls for users, speakers, requests, bookings, sessions, public lectures/events, reviews, notes, recordings, and content.
- Basic analytics:
  - Registered students
  - Pending speakers
  - Verified speakers
  - Limited verified speakers
  - Verification exceptions
  - Requested sessions
  - Confirmed sessions
  - Completed sessions
  - No-shows
  - Public content count

### 14. Admin Moderation Controls

Required:

- Admin can block or unblock any account.
- Admin can suspend or restore speaker privileges without deleting the user account.
- Admin can cancel, block, hide, restore, or dispute any request, booking, session, lecture, or event.
- Admin can hide or restore reviews, public notes, recordings, and content library items.
- Admin can add an internal moderation reason for every action.
- Admin actions should be logged with admin ID, target type, target ID, action, reason, timestamp, and previous status.
- Blocking should preserve history for accountability instead of deleting records.

Recommended status model:

- User status: `active`, `blocked`, `suspended`, `deleted_by_user`.
- Speaker status: `verification_pending`, `verified`, `limited_verified`, `needs_review`, `suspended`, `blocked`.
- Request/session/event status: `active`, `cancelled`, `cancelled_by_admin`, `blocked`, `disputed`, `completed`.
- Content status: `draft`, `private`, `pending_review`, `public`, `hidden`, `blocked`.

## Main MVP Workflows

### Student Gets Help From AI

1. Student signs in.
2. Student opens AI tutor.
3. Student asks a question.
4. AI answers and suggests follow-up.
5. AI offers to help create a human session request.

### Student Books Speaker From Marketplace

1. Student searches speakers.
2. Student opens speaker profile.
3. Student starts chat or requests session.
4. Student selects topic, details, and preferred time.
5. Speaker accepts or proposes alternate time.
6. Booking is confirmed.
7. Meeting link is shared.
8. Session happens.
9. Both sides review.
10. History is updated.

### Student Posts Request And Speaker Applies

1. Student posts request.
2. Verified speakers browse matching requests.
3. Speaker responds with availability and session terms.
4. Student selects speaker.
5. Booking is confirmed.
6. Session happens.
7. Both sides review.

### Speaker Verification

1. User signs up as speaker.
2. Speaker completes application.
3. Speaker verifies email with one-time code.
4. Speaker verifies phone number with one-time code.
5. Speaker provides credibility links.
6. AI summarizes profile and credibility signals.
7. Automated rules decide verified, limited verified, or needs review.
8. Admin reviews only exceptions, appeals, suspicious cases, and reports.
9. Verified speaker becomes discoverable.

### Public Content Publication

1. Session completes.
2. Notes or recording metadata is uploaded.
3. Speaker approves public sharing.
4. Admin optionally reviews.
5. Content appears in public library.

## Safety And Moderation Requirements

Even without requiring guardian or school approval for minors, the MVP should include basic safety controls:

- Collect age range.
- Keep speaker verification mandatory.
- Report and block tools.
- Admin moderation queue.
- Admin block/unblock controls for accounts, speakers, requests, bookings, sessions, events, reviews, notes, recordings, and public content.
- No recording student webcams by default.
- No recording student audio by default.
- Warn against sharing private contact details.
- Allow admins to review reported chats and sessions.
- Require public content approval before publication.
- Keep session metadata and history for accountability.

## Success Metrics

The MVP should be considered successful if it can demonstrate:

- Students can get immediate AI help.
- Students can request and schedule one-on-one sessions.
- Verified speakers can complete sessions.
- Admins can review verification exceptions and moderate content.
- Ratings, reviews, history, and reliability scores work.
- Free, donation-optional, and paid-intent sessions can be represented clearly.
- Approved content can be published into a learning library.

Initial metrics:

- Number of registered students
- Number of speaker applications
- Number of verified speakers
- Number of posted requests
- Number of confirmed sessions
- Number of completed sessions
- Session completion rate
- No-show rate
- Average student rating
- Average speaker rating
- AI tutor usage
- Public notes/recordings published

## Explicitly Out Of Scope For MVP

- Full organization/school accounts
- Automated payment processing
- Automated Zoom meeting creation
- AI meeting bot joining calls
- Live voice AI tutor
- Video AI tutor
- Full third-party credential verification service
- Automated YouTube upload
- Native mobile apps
- Advanced recommendation engine
- International tax and nonprofit compliance workflows

## Recommended Build Order

1. Data model and authentication.
2. Student onboarding and dashboard.
3. Speaker application and automated verification.
4. AI tutor chat.
5. Speaker marketplace and profiles.
6. Student help requests.
7. Booking/calendar workflow.
8. Pre-session chat and files.
9. Session completion, history, ratings, and reviews.
10. Content library.
11. Admin moderation and analytics.
