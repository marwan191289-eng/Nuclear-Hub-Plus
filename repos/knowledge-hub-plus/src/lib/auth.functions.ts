import { createServerFn } from "@tanstack/react-start";
import { auth, clerkClient } from "@clerk/tanstack-react-start/server";

export type AccountAccess =
  | { signedIn: false }
  | {
      signedIn: true;
      displayName: string;
      email: string;
      isEmailVerified: boolean;
      isInstructor: boolean;
    };

let cachedCount: { count: number; expiresAt: number } | undefined;

async function getAccountAccess(): Promise<AccountAccess> {
  const session = await auth();
  if (!session.isAuthenticated || !session.userId) return { signedIn: false };

  const user = await clerkClient().users.getUser(session.userId);
  const primaryEmail = user.primaryEmailAddress;
  const isEmailVerified = primaryEmail?.verification?.status === "verified";

  // Public metadata is writable only with the server-side Clerk secret key.
  // New sign-ups never receive this role automatically.
  const isInstructor =
    isEmailVerified && user.publicMetadata["role"] === "instructor";

  return {
    signedIn: true,
    displayName: user.fullName || user.firstName || "طالب",
    email: primaryEmail?.emailAddress ?? "",
    isEmailVerified,
    isInstructor,
  };
}

export const getCurrentAccount = createServerFn({ method: "GET" }).handler(
  getAccountAccess,
);

export const getRegisteredAccountCount = createServerFn({ method: "GET" }).handler(
  async () => {
    if (cachedCount && cachedCount.expiresAt > Date.now()) return cachedCount.count;

    try {
      const count = await clerkClient().users.getCount();
      cachedCount = { count, expiresAt: Date.now() + 15 * 60 * 1000 };
      return count;
    } catch (error) {
      console.error("Could not read the registered account count", error);
      return null;
    }
  },
);
