import { createFileRoute, redirect } from "@tanstack/react-router";
import { InstructorPage } from "@/components/AccountPages";
import { getCurrentAccount } from "@/lib/auth.functions";

export const Route = createFileRoute("/instructor")({
  head: () => ({
    meta: [
      { title: "لوحة المهندس محمود | مركز المعرفة النووية" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const account = await getCurrentAccount();
    if (!account.signedIn) throw redirect({ to: "/sign-in" });
    if (!account.isInstructor) throw redirect({ to: "/dashboard" });
    return { account };
  },
  component: Instructor,
});

function Instructor() {
  const { account } = Route.useRouteContext();
  return <InstructorPage account={account} />;
}
