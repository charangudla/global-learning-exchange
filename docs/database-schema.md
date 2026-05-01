# Database Schema

The MVP database is defined in:

```text
app/src/db/schema.ts
```

The initial generated migration is:

```text
app/drizzle/0000_initial_schema.sql
```

## Core Areas

- Users, roles, student profiles, and speaker profiles
- Email and phone verification events
- Speaker credentials and automated verification status
- Subjects and user subject interests
- Student requests and speaker responses
- Availability windows, calendar holds, and bookings
- Chat threads, messages, and attachments
- Session reviews and reliability inputs
- Public/private content library items
- Reports and moderation action audit logs
- AI conversations and AI messages

## Important Design Choices

- Every user has email and phone verification fields.
- Speakers have an additional verification status.
- Time values should be stored in UTC.
- User time zones are stored separately.
- Moderation-sensitive records use status fields instead of hard deletes.
- Admin actions are stored in `moderation_actions`.
- Booking, content, user, speaker, and moderation workflows use explicit enums.
- Database checks reject invalid ratings, negative prices, impossible availability windows, invalid attachment sizes, and sessions where end time is before start time.

## Migration Commands

From the app folder:

```powershell
npm run db:generate
npm run db:migrate
npm run db:studio
```

`db:migrate` and `db:studio` require `DATABASE_URL` in `.env.local`.
