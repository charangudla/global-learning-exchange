# Global Learning Exchange

Global Learning Exchange is an MVP for a nonprofit-first global learning marketplace. Students can get immediate AI help, request one-on-one sessions, book verified speakers, chat before sessions, complete talks, review each other, and build a public library of approved learning content.

## Project Structure

```text
app/   Next.js MVP application
docs/  Product, architecture, setup, and engineering documents
```

## Current Foundation

- Next.js, React, TypeScript, and Tailwind
- Drizzle schema and initial PostgreSQL migration
- Domain placeholders for verification, bookings, and moderation
- MVP workspace page and admin preview page

## Local Development

```powershell
docker compose up -d postgres
cd app
npm install
npm run db:migrate
npm run dev
```

Open:

```text
http://localhost:3000
```

## Documentation

- `docs/mvp-prd.md`
- `docs/tech-stack.md`
- `docs/open-source-first.md`
- `docs/local-open-source-dev.md`
- `docs/development-plan.md`
- `docs/engineering-principles.md`
- `docs/database-schema.md`
- `docs/windows-local-setup.md`
