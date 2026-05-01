# Provider Strategy

The app should be open-source-first and provider-ready.

Product workflows should call domain actions and provider interfaces, not vendor SDKs directly from pages.

Early/default providers:

- `AUTH_PROVIDER=local`
- `EMAIL_VERIFICATION_PROVIDER=dev`
- `PHONE_VERIFICATION_PROVIDER=dev`

Future provider swaps:

- Auth: Auth.js, Keycloak, self-hosted Supabase, managed Supabase
- Phone verification: Twilio, MessageBird, Vonage, Firebase phone auth
- AI: Ollama, vLLM, OpenAI, other managed LLMs
- Video: Jitsi, LiveKit, Zoom
- Storage: local disk, S3-compatible object storage, Cloudflare R2, Backblaze B2, Wasabi

Keep each provider behind a small internal API so the marketplace workflows stay stable.
