# Technology Stack Recommendation

## Stack Strategy

Use a modern full-stack TypeScript application for the MVP. Keep the first version as a modular monolith, not microservices. The platform has many workflows, but the MVP needs speed, consistency, and a clear data model more than distributed infrastructure.

The stack should support:

- Global students and speakers.
- Email and phone verification for every user.
- Automated speaker verification.
- Marketplace discovery.
- One-on-one booking.
- Chat and file sharing.
- AI tutoring and profile review.
- Admin moderation.
- Future native video rooms, AI note-taking, payments, and content library growth.

## Recommended MVP Stack

### Web App

- Next.js with App Router
- React
- TypeScript
- Tailwind CSS
- shadcn/ui
- lucide-react icons

Reason:

Next.js gives us a single full-stack app for pages, dashboards, server actions, API routes, and deployment. TypeScript keeps the marketplace workflows safer as the data model grows. shadcn/ui gives us a clean, customizable component system that can support an Upwork/Fiverr-like dashboard without starting from a blank canvas.

### Backend

- Next.js Server Actions and Route Handlers for MVP backend logic
- TypeScript service modules for domain logic
- Zod for validation
- Background jobs added later for AI notes, recording processing, and notifications

Reason:

The MVP does not need a separate backend service on day one. We can keep business logic organized inside the app while still separating domains such as users, verification, speakers, requests, bookings, chat, content, payments, and moderation.

### Database

- Supabase Postgres
- Drizzle ORM
- Row Level Security policies for sensitive user/session data
- SQL migrations committed to the repo

Reason:

Postgres is the right fit for users, sessions, bookings, ratings, reviews, moderation logs, and content. Supabase gives us managed Postgres plus useful adjacent services. Drizzle gives us typed schema and queries without heavy abstraction.

### Authentication And Verification

- Supabase Auth for email/password accounts and email verification
- Twilio Verify for phone OTP verification
- Verification status stored in user profile tables
- Speaker-specific verification layer for LinkedIn, Google Scholar, ORCID, university profile, company profile, portfolio, or certification links

Reason:

Every user needs email and phone verification. Speakers need additional credibility checks before they can offer sessions. AI can summarize profile credibility, but automated rules and admin exception review should control the final verification state.

### Realtime Chat

- Supabase Realtime for MVP chat updates
- Postgres tables for durable chat history
- Supabase Storage for attachments

Reason:

The MVP chat is attached to requests and bookings. We do not need a separate chat infrastructure yet, but messages and files need to be stored reliably and reviewable by admins when reported.

### Calendar And Booking

- FullCalendar React component for calendar UI
- Postgres tables for availability, holds, bookings, cancellations, and no-shows
- Store all booking times in UTC
- Store user time zones and render locally

Reason:

Calendar logic is central to the product. We should own booking state in our database instead of depending entirely on external calendars. External calendar sync can come later.

### Video Meetings

MVP:

- Speaker pastes Zoom, Google Meet, Webex, Jitsi, or LiveKit link.
- Platform stores the link on confirmed bookings.

Next phase:

- LiveKit native rooms for in-platform video and AI note-taking.
- Jitsi as a lower-cost/self-hosted meeting option.
- Zoom API integration only after the core workflow is proven.

Reason:

Manual video links validate the workflow fastest. LiveKit is the strongest long-term choice for programmable rooms, realtime audio/video, and AI agents. Jitsi is attractive for open-source/self-hosted conferencing. Zoom is familiar, but full automation adds API and permission complexity.

### AI

MVP:

- OpenAI API for AI tutor chat, profile summaries, matching suggestions, request drafting, and note generation from uploaded transcript/text.
- Keep an internal AI provider interface so models can be changed later.

Later:

- Whisper or faster-whisper for speech-to-text.
- LiveKit Agents for realtime AI note-taking inside native rooms.
- Optional self-hosted models through Ollama or vLLM for cost control.

Reason:

AI is a core product feature, so the MVP should use a high-quality managed model first. The implementation should stay provider-flexible to support open-source models later.

### Search And Recommendations

MVP:

- Postgres full-text search.
- Structured filters by subject, language, time zone, availability, price intent, rating, and verification state.

Later:

- pgvector for semantic topic matching.
- Meilisearch, Typesense, or Algolia if marketplace search becomes complex.

### Payments And Donations

MVP:

- Store financial intent only:
  - Free
  - Free, donations accepted
  - Paid requested
  - Student offers payment
  - Sponsored

Next phase:

- Stripe Payment Links for platform donations.
- Stripe Checkout for simple payments.
- Stripe Connect if speakers receive payouts through the platform.

Reason:

Payment workflows add compliance, disputes, fees, refunds, and trust complexity. The first MVP should prove learning sessions before becoming financially complex.

### Content Library

MVP:

- Store notes, metadata, transcript text, and external video URLs in Postgres.
- Store approved uploaded files in Supabase Storage.
- Public/private/hidden/blocked content statuses.

Later:

- YouTube upload integration.
- Cloudflare R2, S3, Backblaze B2, or Wasabi for larger media storage.
- AI-generated summaries, quizzes, flashcards, and chapter timestamps.

### Admin And Moderation

- Admin dashboard inside the Next.js app
- Role-based permissions
- Moderation action log
- Block/unblock/suspend/restore for users, speakers, sessions, events, reviews, notes, recordings, and public content
- Report and dispute queues

Reason:

Moderation is not optional for this platform. Admin actions should preserve history rather than deleting records.

### Hosting

Recommended MVP hosting:

- Vercel for Next.js
- Supabase hosted project for Postgres, Auth, Storage, and Realtime
- Twilio for phone verification
- OpenAI for AI
- Stripe later for donations/payments

Reason:

This keeps operational work low while the product is being validated.

### Testing And Quality

- Vitest for unit tests
- React Testing Library for components
- Playwright for end-to-end flows
- ESLint and Prettier
- TypeScript strict mode

Critical end-to-end test flows:

- Student signup with email and phone verification.
- Speaker signup and automated verification.
- Student asks AI tutor.
- Student posts request.
- Speaker responds.
- Booking is confirmed.
- Chat message and file upload work.
- Session is completed.
- Both users review each other.
- Admin blocks/unblocks a user or session.

## Future Self-Hosted / Open-Source Path

If the platform later needs a more open-source or self-hosted stack:

- Keep Next.js frontend.
- Move Postgres to a managed or self-hosted Postgres provider.
- Use LiveKit or Jitsi for native video.
- Use MinIO or Cloudflare R2-compatible storage for media.
- Use Ollama, vLLM, or another self-hosted model server for some AI tasks.
- Add a separate worker service for transcription, recording, notifications, and AI note generation.

## Technology Decisions To Avoid For MVP

- Do not start with microservices.
- Do not build native mobile apps first.
- Do not automate Zoom before proving session workflow.
- Do not build payment processing before trust and booking workflows work.
- Do not store large video files in the main database.
- Do not let AI make irreversible moderation or verification decisions without auditability.

