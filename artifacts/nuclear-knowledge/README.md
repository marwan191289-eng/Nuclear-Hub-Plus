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

The app needs `ADMIN_PASSWORD` and `SESSION_SECRET` for administrator sign-in.
The admin endpoints fail closed if either value is missing or the session key
is shorter than 32 bytes. `GEMINI_API_KEY` is optional; the study-plan feature
has a built-in curriculum fallback.

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
- `GEMINI_API_KEY` — optional; omit it to use the built-in study-plan fallback.

Replit Secrets are not automatically copied to Vercel. Add the variables in the
Vercel project's Environment Variables settings before deploying.

## Checks

```sh
pnpm --filter @workspace/nuclear-knowledge run typecheck
pnpm --filter @workspace/nuclear-knowledge run test
pnpm --filter @workspace/nuclear-knowledge run build
```

The public enrollment counter follows a server-generated hourly schedule capped
at three increments per hour; it is not connected to an enrollment database.
The administrator roster and parent report are clearly marked as sample
records, not live student data.
