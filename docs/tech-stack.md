# Technology Stack Recommendation

## Stack Strategy

Use a modern full-stack TypeScript application for the MVP. Keep the first version as a modular monolith, not microservices. The platform has many workflows, but the MVP needs speed, consistency, and a clear data model more than distributed infrastructure.

The product should be open-source-first while staying provider-ready. That means the application code should depend on internal provider interfaces for auth, verification, AI, storage, video, and payments. During early development we can use local/open-source providers. After funding, we can swap in managed services for better reliability, scaling, compliance, and operational support.

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

- PostgreSQL
- Drizzle ORM
- SQL migrations committed to the repo

Reason:

Postgres is the right fit for users, sessions, bookings, ratings, reviews, moderation logs, and content. Drizzle gives us typed schema and queries without heavy abstraction. Postgres can run locally, on a VPS, through self-hosted Supabase, or through a managed provider later.

### Authentication And Verification

- Local/custom auth provider for development and MVP workflow testing
- Email verification provider interface
- Phone verification provider interface
- Development verification mode for local testing
- Optional future providers: self-hosted Supabase Auth, managed Supabase Auth, Auth.js, Keycloak, Twilio Verify, other SMS vendors
- Verification status stored in user profile tables
- Speaker-specific verification layer for LinkedIn, Google Scholar, ORCID, university profile, company profile, portfolio, or certification links

Reason:

Every user needs email and phone verification. Speakers need additional credibility checks before they can offer sessions. In local development we can simulate verification to avoid paid services. For production, phone verification still needs a telecom/SMS provider or equivalent identity provider, but the platform should not be hardcoded to one vendor.

### Realtime Chat

- Postgres-backed chat for MVP
- Polling or simple realtime transport first
- Later: Socket.IO, LiveKit data channels, Supabase Realtime, or another realtime provider
- Postgres tables for durable chat history
- Local file storage first, object storage later

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
- Self-hosted models through Ollama or vLLM for cost control.
- Managed providers such as OpenAI can be added after funding when quality, latency, and reliability matter more.

Reason:

AI is a core product feature, so the implementation must stay provider-flexible. Local Ollama support is useful for development and cost control; managed models can be added later when the product needs stronger quality, speed, and availability.

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

- Local development first
- Docker/VPS deployment path
- Managed hosting later when funding allows
- Optional future providers: Vercel, Supabase, Twilio, OpenAI, Stripe
- Stripe later for donations/payments

Reason:

Local/open-source development keeps early cost low. Managed services can reduce operational work later, especially for auth, SMS, AI, payments, uptime, backups, and observability.

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

## Open-Source-First Path

Default early path:

- Keep Next.js frontend.
- Use local or self-hosted Postgres.
- Use custom/auth-provider abstraction for auth.
- Use dev verification locally.
- Use LiveKit or Jitsi for native video.
- Use local disk first and object storage later.
- Use Ollama, vLLM, or another self-hosted model server for some AI tasks.
- Add a separate worker service for transcription, recording, notifications, and AI note generation.

## Future Managed Services Path

After funding, consider:

- Managed Postgres or Supabase for database operations and backups.
- Twilio, MessageBird, Vonage, or another provider for reliable phone OTP.
- Managed email provider for deliverability.
- OpenAI or another managed AI provider for better tutoring quality.
- Stripe for donations, platform payments, and speaker payouts.
- Vercel or managed container hosting for deployment.
- Cloudflare R2, S3, Backblaze B2, or Wasabi for media storage.

## Technology Decisions To Avoid For MVP

- Do not start with microservices.
- Do not build native mobile apps first.
- Do not automate Zoom before proving session workflow.
- Do not build payment processing before trust and booking workflows work.
- Do not store large video files in the main database.
- Do not let AI make irreversible moderation or verification decisions without auditability.
