---
name: Vite workspace cache
description: Large generated Replit workspace caches can break Vite's development file watcher.
---

Keep generated and hidden Replit cache trees excluded from Vite's development watcher; do not make its watched scope broader than the application source.

**Why:** In this workspace, the Bun package cache under `.cache` triggered `EMFILE` directory-scan errors during Vite startup and prevented the app from opening port 5000.

**How to apply:** Preserve watcher ignores for `.cache`, `.local`, `.agents`, `.wrangler`, and `.output` when adjusting Vite's `server.watch` settings. After changes, restart once and confirm the dev server responds on port 5000.
