import { createFileRoute, redirect } from "@tanstack/react-router";
import { InstructorPage } from "@/components/AccountPages";
import { getCurrentAccount } from "@/lib/auth.functions";

export const Route = createFileRoute("/en/instructor")({
  head: () => ({
    meta: [
      { title: "Instructor console | Nuclear Knowledge Hub" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const account = await getCurrentAccount();
    if (!account.signedIn) throw redirect({ to: "/en/sign-in" });
    if (!account.isInstructor) throw redirect({ to: "/en/dashboard" });
    return { account };
  },
  component: Instructor,
});

function Instructor() {
  const { account } = Route.useRouteContext();
  return <InstructorPage account={account} english />;
}
