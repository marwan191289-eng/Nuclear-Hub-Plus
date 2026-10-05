import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/sign-in")({
  head: () => ({
    meta: [
      { title: "تسجيل الدخول | مركز المعرفة النووية" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="sign-in" lang="ar" />,
});
