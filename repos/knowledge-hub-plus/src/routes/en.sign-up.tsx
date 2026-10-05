import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/en/sign-up")({
  head: () => ({
    meta: [
      { title: "Create a student account | Nuclear Knowledge Hub" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="sign-up" lang="en" />,
});
