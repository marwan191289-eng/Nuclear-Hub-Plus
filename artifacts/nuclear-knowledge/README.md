# Nuclear Knowledge Hub

Arabic-first learning platform for nuclear chemistry, reactor engineering and
radiation safety, with English-language support for students in Saudi Arabia
and the Gulf.

## Run in Replit

From the workspace root, install the lockfile-pinned dependencies and start the
managed `artifacts/nuclear-knowledge: web` workflow:

```sh
pnpm install --frozen-lockfile
pnpm --filter @workspace/nuclear-knowledge run dev
```

The app uses the Replit PostgreSQL database for accounts. Add `ADMIN_PASSWORD`
as a Replit Secret to enable the system-engineer administrator login; the admin
endpoints fail closed if it or `SESSION_SECRET` is missing. The session key must
be at least 32 bytes. Public registration always assigns the student role;
administrators manage account roles in the protected Accounts & Permissions tab.
`GEMINI_API_KEY` is optional; the study-plan feature has a built-in curriculum
fallback.

## Account schema

The development database schema is defined in `lib/db/src/schema/users.ts`.
When developing locally, apply it to the Replit development database with
`pnpm --filter @workspace/db run push`. The application does not run DDL during
startup.

## Deploy to Vercel

This app lives inside the Replit pnpm monorepo. Create a Vercel project from the
same repository and set its **Root Directory** to `artifacts/nuclear-knowledge`.
Enable **Include source files outside the Root Directory in the Build Step** so
the pnpm workspace and shared client package can be resolved.

The included `vercel.json` uses Vite, builds with `pnpm run build`, and serves
the static output from `dist/public`. The `/api` function uses the Node.js
runtime. Configure these variables in the Vercel project for both Preview and
Production environments:

- `ADMIN_PASSWORD` — the administrator password; do not commit it or expose it
  as a `VITE_` variable.
- `SESSION_SECRET` — a strong random signing key of at least 32 bytes. Use the
  same value across Vercel instances so signed sessions remain valid.
- `DATABASE_URL` — a persistent PostgreSQL database URL for the Vercel
  environment. Replit's managed database URL is not automatically available to
  Vercel. Apply the account schema to this database before enabling sign-ups.
- `VITE_PUBLIC_SITE_URL` — the final HTTPS site origin (for example, the
  custom domain selected in Vercel). Set this at build time to generate
  `sitemap.xml`, an absolute canonical URL, and absolute social-image URLs.
- `GEMINI_API_KEY` — optional; omit it to use the built-in study-plan fallback.

Replit Secrets are not automatically copied to Vercel. Add the variables in the
Vercel project's Environment Variables settings before deploying. Never add
`ADMIN_PASSWORD`, `SESSION_SECRET`, or `DATABASE_URL` with a `VITE_` prefix.

## Checks

```sh
pnpm --filter @workspace/nuclear-knowledge run typecheck
pnpm --filter @workspace/nuclear-knowledge run test
pnpm --filter @workspace/nuclear-knowledge run build
```

The public learner counter follows a server-generated hourly schedule capped at
three increments per hour; it is an estimate, not a live enrollment total. The
administrator roster and parent report are clearly marked as sample records.
Real registered accounts appear separately in the Accounts & Permissions tab.
