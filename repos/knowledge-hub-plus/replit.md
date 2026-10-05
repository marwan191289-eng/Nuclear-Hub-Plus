# Project notes

## Run and verify

- Start the `Start application` workflow on port 5000.
- The dev server must allow Replit proxy hosts (`server.allowedHosts: true` in the Vite configuration).
- Build with `bun run build`; run the targeted ESLint command for files changed in a task.

## Student and instructor access

- Require provider-verified sign-in and server-side authorization before enabling instructor or student features.
- Grant instructor permissions only to Mahmoud’s formally provisioned account; never grant admin access to the first account or based on client-side checks.
- Keep enrollment and lesson-progress records in server-side storage, not browser `localStorage`.
- New Clerk registrations are students by default. Instructor access requires a verified primary email and the server-managed `publicMetadata.role === "instructor"` value.
- Do not expose student records in the instructor console until a server-side database is connected and every read/write endpoint checks the instructor role.
- The home-page account counter reads the actual Clerk user count; do not replace it with simulated growth.

## Authentication

- Clerk Auth is integrated with the TanStack Start middleware. Keep the sign-in and sign-up routes, callback routes, and `/api/__clerk` production proxy in sync.
- Use the Clerk-managed development and production environments. Never print or move Clerk secret keys into client code.
- The homepage remains public. Account pages are `noindex`; protected pages must authorize in server loaders/functions, not only by hiding UI.
