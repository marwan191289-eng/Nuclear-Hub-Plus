import { useEffect, useState, type FormEvent } from "react";
import { AlertCircle, Atom, X } from "lucide-react";
import { appPath } from "../lib/app-path";

export interface AuthenticatedAccount {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student" | "parent";
}

interface AuthModalProps {
  language: "ar" | "en";
  onClose: () => void;
  onAuthenticated: (user: AuthenticatedAccount) => void;
}

export function AuthModal({ language, onClose, onAuthenticated }: AuthModalProps) {
  const isEn = language === "en";
  const [mode, setMode] = useState<"login" | "register">("register");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !busy) onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [busy, onClose]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch(
        appPath(mode === "register" ? "/api/auth/register" : "/api/auth/login"),
        {
          method: "POST",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...(mode === "register" ? { name } : {}), email, password }),
        },
      );
      const data = (await response.json().catch(() => ({}))) as {
        user?: AuthenticatedAccount;
      };
      if (!response.ok || !data.user) {
        if (response.status === 409) {
          setError(isEn ? "An account with this email already exists." : "يوجد حساب مسجل بهذا البريد الإلكتروني.");
        } else if (response.status === 503) {
          setError(isEn ? "Accounts are temporarily unavailable. Please try again shortly." : "خدمة الحسابات غير متاحة مؤقتاً. حاول مرة أخرى بعد قليل.");
        } else if (mode === "register" && password.length < 12) {
          setError(isEn ? "Use a password with at least 12 characters." : "استخدم كلمة مرور لا تقل عن 12 حرفاً.");
        } else {
          setError(isEn ? "We could not verify those details. Please check them and try again." : "تعذر التحقق من البيانات. راجعها وحاول مرة أخرى.");
        }
        return;
      }
      onAuthenticated(data.user);
      onClose();
    } catch {
      setError(isEn ? "Connection failed. Check your internet and retry." : "تعذر الاتصال. تحقق من الإنترنت وحاول مجدداً.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[120] grid place-items-center bg-black/55 p-4 backdrop-blur-sm"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !busy) onClose();
      }}
    >
      <section
        aria-labelledby="account-dialog-title"
        aria-modal="true"
        className="w-full max-w-md overflow-hidden rounded-[28px] border border-[var(--border-color)] bg-[var(--card-bg)] text-[var(--ink)] shadow-2xl"
        dir={isEn ? "ltr" : "rtl"}
        role="dialog"
      >
        <header className="relative border-b border-[var(--border-color)] px-7 pb-6 pt-7 sm:px-8">
          <button
            type="button"
            onClick={onClose}
            aria-label={isEn ? "Close" : "إغلاق"}
            className="absolute end-5 top-5 rounded-xl p-2 text-[var(--muted)] transition hover:bg-black/5"
            data-testid="button-close-auth"
          >
            <X size={18} />
          </button>
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--primary)]">
            <Atom size={23} />
          </div>
          <p className="text-xs font-bold uppercase tracking-[.16em] text-[var(--accent)]">
            {isEn ? "Nuclear Knowledge Hub" : "مركز المعرفة النووية"}
          </p>
          <h2 id="account-dialog-title" className="mt-2 text-2xl font-bold">
            {mode === "register"
              ? isEn ? "Create your learner account" : "أنشئ حسابك الدراسي"
              : isEn ? "Welcome back" : "مرحباً بعودتك"}
          </h2>
          <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
            {mode === "register"
              ? isEn ? "Save your place and continue learning at your own pace." : "احفظ تقدمك وتابع التعلم بالسرعة التي تناسبك."
              : isEn ? "Sign in to continue to your courses and lessons." : "سجّل الدخول للمتابعة إلى مقرراتك ودروسك."}
          </p>
        </header>

        <form onSubmit={submit} className="space-y-4 px-7 py-6 sm:px-8">
          {error && (
            <div role="alert" className="flex gap-2 rounded-xl border border-rose-300/60 bg-rose-50 p-3 text-sm text-rose-800">
              <AlertCircle className="mt-0.5 shrink-0" size={17} />
              <span>{error}</span>
            </div>
          )}
          {mode === "register" && (
            <label className="block space-y-1.5 text-sm font-semibold">
              <span>{isEn ? "Full name" : "الاسم الكامل"}</span>
              <input
                autoComplete="name"
                className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm font-normal"
                data-testid="input-account-name"
                maxLength={100}
                minLength={2}
                onChange={(event) => setName(event.target.value)}
                required
                value={name}
              />
            </label>
          )}
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>{isEn ? "Email" : "البريد الإلكتروني"}</span>
            <input
              autoComplete="email"
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm font-normal"
              data-testid="input-account-email"
              onChange={(event) => setEmail(event.target.value)}
              required
              type="email"
              value={email}
            />
          </label>
          <label className="block space-y-1.5 text-sm font-semibold">
            <span>{isEn ? "Password" : "كلمة المرور"}</span>
            <input
              autoComplete={mode === "register" ? "new-password" : "current-password"}
              className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--bg-main)] px-4 py-3 text-sm font-normal"
              data-testid="input-account-password"
              minLength={mode === "register" ? 12 : 1}
              onChange={(event) => setPassword(event.target.value)}
              required
              type="password"
              value={password}
            />
            {mode === "register" && (
              <span className="block text-xs font-normal text-[var(--muted)]">
                {isEn ? "Use at least 12 characters." : "استخدم 12 حرفاً على الأقل."}
              </span>
            )}
          </label>
          <button
            className="w-full rounded-xl bg-[var(--primary)] px-5 py-3.5 text-sm font-bold text-[var(--button-ink)] transition hover:brightness-95 disabled:cursor-wait disabled:opacity-60"
            data-testid="button-submit-auth"
            disabled={busy}
            type="submit"
          >
            {busy
              ? isEn ? "Please wait…" : "يرجى الانتظار…"
              : mode === "register"
                ? isEn ? "Create student account" : "إنشاء حساب طالب"
                : isEn ? "Sign in" : "تسجيل الدخول"}
          </button>
          <p className="text-center text-sm text-[var(--muted)]">
            {mode === "register"
              ? isEn ? "Already have an account?" : "لديك حساب بالفعل؟"
              : isEn ? "New to the platform?" : "جديد في المنصة؟"}{" "}
            <button
              className="font-bold text-[var(--primary)] underline-offset-4 hover:underline"
              data-testid="button-switch-auth-mode"
              onClick={() => {
                setMode(mode === "register" ? "login" : "register");
                setError("");
              }}
              type="button"
            >
              {mode === "register"
                ? isEn ? "Sign in" : "تسجيل الدخول"
                : isEn ? "Create an account" : "إنشاء حساب"}
            </button>
          </p>
        </form>
      </section>
    </div>
  );
}
