import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/en/sign-in")({
  head: () => ({
    meta: [
      { title: "Sign in | Nuclear Knowledge Hub" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="sign-in" lang="en" />,
});
