# Open-Source-First Implementation Strategy

## Decision

Build the MVP open-source-first and provider-ready.

This means:

- We avoid requiring Supabase, Twilio, OpenAI, Stripe, Zoom, or Vercel during early development.
- We keep the code structured so managed providers can be added later without rewriting the product workflows.
- We use internal provider interfaces for external capabilities.
- We use local/dev providers for early testing.

## Provider Areas

### Auth

Early:

- Custom local/session auth or Auth.js with PostgreSQL.

Later:

- Auth.js, Keycloak, self-hosted Supabase Auth, or managed Supabase Auth.

### Email Verification

Early:

- Development verification mode.
- Optional Mailpit/MailHog for local email testing.

Later:

- SMTP provider, Resend, Postmark, SES, or managed Supabase email.

### Phone Verification

Early:

- Development verification mode with a test code.

Later:

- Twilio Verify, MessageBird, Vonage, Firebase phone auth, or another telecom-backed provider.

Important:

Phone verification cannot be fully solved by open-source code alone because real SMS delivery requires telecom infrastructure.

### AI Tutor

Early:

- Ollama local models.
- Provider interface with fallback/mock responses if no model is running.

Later:

- OpenAI, Anthropic, Google, hosted vLLM, or a dedicated GPU server.

### Video

Early:

- Manual meeting links.
- Jitsi public/self-hosted rooms.

Later:

- LiveKit native rooms.
- Jitsi self-hosting.
- Zoom/Google Meet integration if needed.

### Storage

Early:

- Local file storage for development.

Later:

- S3-compatible storage, Cloudflare R2, Backblaze B2, Wasabi, or MinIO-compatible storage.

### Payments

Early:

- Store financial intent only.

Later:

- Stripe, PayPal, bank transfer, sponsorship credits, or grant-funded internal credits.

## Coding Rule

Application workflows should call internal domain services, not vendor SDKs directly from pages.

Example:

- Page calls `sendPhoneCode()`.
- `sendPhoneCode()` chooses local dev, Twilio, or another provider.
- Booking workflow does not care which provider sent the OTP.

This keeps the code aligned with the future vision: free/open-source-first now, paid providers later when funding and scale justify it.
