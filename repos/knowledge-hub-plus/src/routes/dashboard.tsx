import { createFileRoute, redirect } from "@tanstack/react-router";
import { DashboardPage } from "@/components/AccountPages";
import { getCurrentAccount } from "@/lib/auth.functions";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "حساب الطالب | مركز المعرفة النووية" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  beforeLoad: async () => {
    const account = await getCurrentAccount();
    if (!account.signedIn) throw redirect({ to: "/sign-in" });
    return { account };
  },
  component: Dashboard,
});

function Dashboard() {
  const { account } = Route.useRouteContext();
  return <DashboardPage account={account} />;
}
