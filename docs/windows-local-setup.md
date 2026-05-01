# Windows 11 Local Development Setup

## Goal

Prepare your Windows 11 machine to build and run the MVP locally in Visual Studio Code.

## 1. Install Required Tools

You need:

- Visual Studio Code
- Git
- Node.js LTS
- pnpm

You already have Visual Studio Code installed.

### Install Git

Open PowerShell and run:

```powershell
winget install --id Git.Git -e
```

After installation, close and reopen PowerShell, then check:

```powershell
git --version
```

### Install Node.js LTS

Open PowerShell and run:

```powershell
winget install --id OpenJS.NodeJS.LTS -e
```

After installation, close and reopen PowerShell, then check:

```powershell
node --version
npm --version
```

### Install pnpm

Run:

```powershell
npm install -g pnpm
pnpm --version
```

## 2. Open The Project In VS Code

Open VS Code.

Use:

```text
File > Open Folder
```

Select:

```text
C:\Users\cg1971\Documents\New project
```

Open the VS Code terminal:

```text
Terminal > New Terminal
```

The terminal should open inside the project folder.

## 3. Accounts To Create

For MVP development, create accounts for:

- Supabase
- Twilio
- OpenAI
- Vercel

You do not need to configure everything before the first code scaffold, but these accounts will be needed soon.

## 4. Environment Variables We Will Need

Later, the app will use a `.env.local` file with values like:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
DATABASE_URL=
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_VERIFY_SERVICE_SID=
OPENAI_API_KEY=
```

Do not share these keys publicly or commit them to Git.

## 5. Recommended VS Code Extensions

Install:

- ESLint
- Prettier
- Tailwind CSS IntelliSense
- GitLens
- PostgreSQL or SQLTools

## 6. First Coding Step

Once Git, Node.js, and pnpm are installed, the first coding step is to scaffold the Next.js app:

```powershell
pnpm create next-app@latest app --typescript --tailwind --eslint --app --src-dir --import-alias "@/*"
```

Then enter the app:

```powershell
cd app
pnpm dev
```

The app should run at:

```text
http://localhost:3000
```

## 7. What To Do First

Recommended order:

1. Install Git.
2. Install Node.js LTS.
3. Install pnpm.
4. Open this folder in VS Code.
5. Open the VS Code terminal.
6. Scaffold the Next.js app.
7. Run the app locally.
8. Then we add Supabase, Drizzle, auth, verification, and the first dashboard screens.

