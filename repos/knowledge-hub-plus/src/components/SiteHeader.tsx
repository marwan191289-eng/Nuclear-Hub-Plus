import { Link, useRouterState } from "@tanstack/react-router";
import { SITE, SITE_EN } from "@/lib/site";
import { langFromPath, switchPath } from "@/lib/i18n";
import { useClerk, useUser } from "@clerk/tanstack-react-start";

const NAV = {
  ar: [
    { to: "/", label: "الرئيسية" },
    { to: "/courses", label: "الدورات" },
    { to: "/placement", label: "اختبار المستوى" },
    { to: "/articles", label: "المقالات" },
    { to: "/about", label: "من أنا" },
    { to: "/booking", label: "الحجز" },
  ],
  en: [
    { to: "/en", label: "Home" },
    { to: "/en/courses", label: "Courses" },
    { to: "/en/placement", label: "Placement test" },
    { to: "/en/articles", label: "Articles" },
    { to: "/en/about", label: "About" },
    { to: "/en/booking", label: "Booking" },
  ],
} as const;

function usePath() {
  return useRouterState({ select: (s) => s.location.pathname });
}

export function SiteHeader() {
  const path = usePath();
  const lang = langFromPath(path);
  const nav = NAV[lang];
  const en = lang === "en";
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  return (
    <header className="relative z-10 border-b border-border/70">
      <div className="mx-auto flex h-20 max-w-[1240px] items-center justify-between gap-4 px-6 lg:px-10">
        <Link to={en ? "/en" : "/"} className="flex items-center gap-3">
          <img src="/logo.svg" alt="" width={42} height={42} className="size-10" />
          <div className="leading-tight">
            <div className="text-[15px] font-semibold">{en ? SITE_EN.name : SITE.name}</div>
            <div className="font-display text-[10px] uppercase tracking-[0.22em] text-primary/80">NUCLEAR CHEMISTRY</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-7 text-[14px] text-muted-foreground lg:flex">
          {nav.map((n) => (
            <Link key={n.to} to={n.to} className="transition hover:text-primary" activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" || n.to === "/en" }}>
              {n.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a href={switchPath(path)} hrefLang={en ? "ar" : "en"} className="rounded-full border border-border px-3 py-2 font-display text-[12px] text-muted-foreground transition hover:border-primary/50 hover:text-primary">
            {en ? "العربية" : "EN"}
          </a>
          <Link to={en ? "/en/booking" : "/booking"} className="hidden items-center rounded-full border border-primary/50 bg-primary/5 px-5 py-2 text-[13px] font-medium text-primary transition hover:bg-primary/10 sm:inline-flex">
            {en ? "Book a session" : "احجز جلسة"}
          </Link>
          {isLoaded && isSignedIn ? (
            <div className="flex items-center gap-2">
              <Link
                to={en ? "/en/dashboard" : "/dashboard"}
                className="hidden items-center rounded-full border border-border px-4 py-2 text-[13px] text-foreground transition hover:border-primary/60 hover:text-primary sm:inline-flex"
              >
                {en ? "My account" : "حسابي"}
              </Link>
              <span
                aria-label={user?.fullName ?? (en ? "Signed-in user" : "مستخدم مسجل")}
                title={user?.fullName ?? ""}
                className="grid size-9 place-items-center rounded-full border border-primary/50 bg-primary/10 text-sm font-semibold text-primary"
              >
                {user?.firstName?.slice(0, 1) ?? (en ? "U" : "ط")}
              </span>
              <button
                type="button"
                onClick={() => void signOut({ redirectUrl: en ? "/en" : "/" })}
                className="rounded-full border border-border px-3 py-2 text-[12px] text-muted-foreground transition hover:border-accent/50 hover:text-accent"
              >
                {en ? "Sign out" : "خروج"}
              </button>
            </div>
          ) : isLoaded ? (
            <div className="flex items-center gap-2">
              <Link
                to={en ? "/en/sign-in" : "/sign-in"}
                className="rounded-full border border-border px-3 py-2 text-[12px] text-muted-foreground transition hover:border-primary/50 hover:text-primary"
              >
                {en ? "Sign in" : "دخول"}
              </Link>
              <Link
                to={en ? "/en/sign-up" : "/sign-up"}
                className="hidden rounded-full bg-primary px-4 py-2 text-[12px] font-semibold text-primary-foreground transition hover:brightness-110 sm:inline-flex"
              >
                {en ? "Create account" : "إنشاء حساب"}
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 border-t border-border/50 px-4 py-3 text-[13px] text-muted-foreground lg:hidden">
        {nav.map((n) => (
          <Link key={n.to} to={n.to} activeProps={{ className: "text-primary" }} activeOptions={{ exact: n.to === "/" || n.to === "/en" }}>{n.label}</Link>
        ))}
        <Link to={en ? "/en/sign-in" : "/sign-in"} className="text-primary">
          {en ? "Account" : "حساب"}
        </Link>
      </nav>
    </header>
  );
}

export function SiteFooter() {
  const en = langFromPath(usePath()) === "en";
  return (
    <footer className="relative z-10 border-t border-border/70">
      <div className="mx-auto flex max-w-[1240px] flex-col items-center justify-between gap-6 px-6 py-12 md:flex-row lg:px-10">
        <div className="flex items-center gap-3">
          <img src="/logo.svg" alt="" width={36} height={36} className="size-9" />
          <div className="text-[14px] text-muted-foreground">{en ? `${SITE_EN.name} · Nuclear chemistry engineer` : `${SITE.name} · مهندس كيمياء نووية`}</div>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-6 text-[13px] text-dim">
          <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="transition hover:text-primary" dir="ltr">{SITE.phoneDisplay}</a>
          <a href={`mailto:${SITE.email}`} className="transition hover:text-primary">{SITE.email}</a>
        </div>
      </div>
    </footer>
  );
}

export function WhatsAppFab() {
  const en = langFromPath(usePath()) === "en";
  return (
    <a
      href={`https://wa.me/${SITE.whatsapp}`}
      target="_blank"
      rel="noreferrer"
      aria-label={en ? "Chat on WhatsApp" : "تواصل عبر واتساب"}
      className={`fixed bottom-6 z-50 grid size-14 place-items-center rounded-full bg-primary text-primary-foreground glow-primary transition hover:scale-105 ${en ? "right-6" : "left-6"}`}
    >
      <svg viewBox="0 0 24 24" className="size-7" fill="currentColor"><path d="M17.5 14.4c-.3-.1-1.7-.8-2-.9-.3-.1-.5-.1-.7.1-.2.3-.8.9-.9 1.1-.2.2-.3.2-.6.1-.3-.1-1.2-.4-2.3-1.4-.9-.8-1.4-1.7-1.6-2-.2-.3 0-.5.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.9-2.2c-.2-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1 2.8 1.2 3c.1.2 2 3.1 4.9 4.3 2.4.9 2.9.8 3.4.7.5-.1 1.7-.7 2-1.4.2-.7.2-1.2.2-1.4-.1-.1-.3-.2-.6-.3zM12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/></svg>
    </a>
  );
}
