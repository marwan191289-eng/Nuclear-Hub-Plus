# Nuclear Knowledge Hub

Arabic-first bilingual learning platform for nuclear chemistry, reactor engineering, and radiation safety, serving university students in Saudi Arabia and the Gulf.

## Run & Operate

- `pnpm install --frozen-lockfile` — install the workspace dependencies
- `pnpm --filter @workspace/nuclear-knowledge run dev` — run the app in the managed workflow
- `pnpm --filter @workspace/nuclear-knowledge run typecheck` — check frontend, Express API, and Vercel handler types
- `pnpm --filter @workspace/nuclear-knowledge run test` — run server/auth and hourly-counter tests
- `pnpm --filter @workspace/nuclear-knowledge run build` — build the production Vite bundle
- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from the OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- Required secrets: `ADMIN_PASSWORD` and `SESSION_SECRET` (at least 32 bytes)
- Optional secret: `GEMINI_API_KEY` — enables Gemini study-plan generation; a built-in fallback works without it

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- API: Express 5
- DB: PostgreSQL + Drizzle ORM
- Validation: Zod (`zod/v4`), `drizzle-zod`
- API codegen: Orval (from OpenAPI spec)
- Build: esbuild (CJS bundle)

## Where things live

- `artifacts/nuclear-knowledge/src/` — React UI, courses, lesson tools, and styles
- `artifacts/nuclear-knowledge/server.ts` — Express API, signed admin sessions, and hourly stats
- `artifacts/nuclear-knowledge/api/` — Vercel serverless API entry point
- `artifacts/nuclear-knowledge/vercel.json` — Vercel build and SPA routing configuration
- `repos/Nuclear-knowledge` and `repos/knowledge-hub-plus` — preserved imported repository snapshots

## Architecture decisions

- Admin credentials are checked on the server using the `ADMIN_PASSWORD` secret; signed, HTTP-only sessions use `SESSION_SECRET`.
- The public student counter is a transparent deterministic estimate, not live enrollment data; each hourly change is capped at three.
- The admin roster and parent report are preview samples, not persistent student records.
- The Vercel-ready app is `artifacts/nuclear-knowledge` within this pnpm workspace.

## Product

The app provides bilingual courses, lessons, educational articles, study planning, learning simulators, booking/contact flows, and an authenticated administration preview.

## User preferences

- Keep the displayed instructor experience at 12+ years.
- Limit student-counter growth to at most three per hour, including quiet hours with no increase.

## Gotchas

- Run package commands through pnpm; package dependencies resolve from the workspace lockfile/catalog.
- The Vercel project root is `artifacts/nuclear-knowledge`, and shared workspace files must be included in its build.
- Add `ADMIN_PASSWORD` and a strong `SESSION_SECRET` separately to Vercel; Replit Secrets do not transfer automatically.

## Pointers

- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details
- See `artifacts/nuclear-knowledge/README.md` for Vercel setup and required environment variables
