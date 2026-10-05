import { createFileRoute } from "@tanstack/react-router";
import { AuthPage } from "@/components/AuthPage";

export const Route = createFileRoute("/sign-up")({
  head: () => ({
    meta: [
      { title: "إنشاء حساب طالب | مركز المعرفة النووية" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: () => <AuthPage mode="sign-up" lang="ar" />,
});
