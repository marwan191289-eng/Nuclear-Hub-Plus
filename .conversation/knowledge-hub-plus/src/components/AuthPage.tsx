import { Link } from "@tanstack/react-router";
import { SignIn, SignUp } from "@clerk/tanstack-react-start";

type AuthPageProps = {
  mode: "sign-in" | "sign-up";
  lang: "ar" | "en";
};

export function AuthPage({ mode, lang }: AuthPageProps) {
  const en = lang === "en";
  const signInPath = en ? "/en/sign-in" : "/sign-in";
  const signUpPath = en ? "/en/sign-up" : "/sign-up";
  const dashboardPath = en ? "/en/dashboard" : "/dashboard";

  return (
    <section
      className="mx-auto flex min-h-[calc(100dvh-2rem)] max-w-6xl flex-col items-center justify-center gap-8 px-5 py-12 sm:px-8"
      dir={en ? "ltr" : "rtl"}
    >
      <div className="max-w-md text-center">
        <Link to={en ? "/en" : "/"} className="mb-5 inline-flex items-center gap-3">
          <img src="/logo.svg" alt="" width={44} height={44} />
          <span className="font-display text-sm font-semibold tracking-wide text-foreground">
            {en ? "NUCLEAR KNOWLEDGE HUB" : "مركز المعرفة النووية"}
          </span>
        </Link>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
          {mode === "sign-in"
            ? en
              ? "Sign in to view your learning account."
              : "سجّل الدخول لمتابعة حسابك التعليمي."
            : en
              ? "Create a student account to get started."
              : "أنشئ حساب طالب للبدء ومتابعة تعلمك."}
        </p>
      </div>

      <div className="w-full max-w-[440px]">
        {mode === "sign-in" ? (
          <SignIn
            routing="path"
            path={signInPath}
            signUpUrl={signUpPath}
            fallbackRedirectUrl={dashboardPath}
          />
        ) : (
          <SignUp
            routing="path"
            path={signUpPath}
            signInUrl={signInPath}
            fallbackRedirectUrl={dashboardPath}
          />
        )}
      </div>
    </section>
  );
}
