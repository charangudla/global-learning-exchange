# Local Open-Source Development

This setup avoids paid/managed services for early MVP development.

## Requirements

- Node.js
- npm
- Docker Desktop

## Start Local Postgres

From the project root:

```powershell
docker compose up -d postgres
```

## Configure Local Environment

Create:

```text
app/.env.local
```

Use:

```env
APP_MODE=local
AUTH_PROVIDER=local
EMAIL_VERIFICATION_PROVIDER=dev
PHONE_VERIFICATION_PROVIDER=dev
DEV_VERIFICATION_CODE=000000
DATABASE_URL=postgres://gle:gle_dev_password@localhost:5432/global_learning_exchange
```

## Run Migrations

```powershell
cd app
npm run db:migrate
```

## Run The App

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## Local Verification

In local mode, email and phone verification are simulated.

Use this code for both email and phone:

```text
000000
```

## Future Provider Switches

Later, after funding, these local providers can be replaced:

- Auth: managed Supabase, self-hosted Supabase, Auth.js, or Keycloak
- Phone: Twilio Verify or another telecom-backed provider
- AI: OpenAI or hosted models
- Video: LiveKit, Jitsi, Zoom
- Storage: S3-compatible object storage
