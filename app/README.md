# Global Learning Exchange

MVP web application for a nonprofit-first global learning marketplace.

## Getting Started

Install dependencies:

```powershell
npm install
```

Run the development server:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

## Environment

Copy `.env.example` to `.env.local` and fill in the values when Supabase, Twilio, and OpenAI are configured.

## Database

The Drizzle schema lives in:

```text
src/db/schema.ts
```

Generate migrations:

```powershell
npm run db:generate
```

Run migrations after `DATABASE_URL` is configured:

```powershell
npm run db:migrate
```

Open Drizzle Studio after `DATABASE_URL` is configured:

```powershell
npm run db:studio
```
