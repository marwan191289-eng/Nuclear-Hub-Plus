---
name: Instructor access provisioning
description: Security boundary for Mahmoud's instructor dashboard and student records.
---

Require a provider-verified identity and a server-side instructor role before exposing management features. Student records and progress belong in server-side storage, never browser `localStorage`. The site is being developed by someone other than Mahmoud, so a request from the developer does not itself prove or provision Mahmoud's account.

**Why:** Student records and instructor permissions are sensitive, and the current development account is not the instructor's verified identity.

**How to apply:** Keep the dashboard unavailable until an authorized identity-provider flow formally provisions Mahmoud; enforce the role on server requests as well as in the UI.
