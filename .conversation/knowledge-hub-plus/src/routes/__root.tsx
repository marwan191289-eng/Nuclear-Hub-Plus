import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ComponentProps, type ReactNode } from "react";
import { ClerkProvider } from "@clerk/tanstack-react-start";
import { arSA, enUS } from "@clerk/localizations";
import { shadcn } from "@clerk/ui/themes";
import { publishableKeyFromHost } from "@clerk/react/internal";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { SiteHeader, SiteFooter, WhatsAppFab } from "@/components/SiteHeader";
import { ClickGlowLayer } from "@/components/ClickGlowLayer";
import { useRouterState } from "@tanstack/react-router";
import { langFromPath } from "@/lib/i18n";

function NotFoundComponent() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-bold text-primary">404</h1>
        <h2 className="mt-4 text-xl font-semibold">الصفحة غير موجودة</h2>
        <div className="mt-6">
          <Link to="/" className="btn-primary">العودة للرئيسية</Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4">
      <div className="max-w-md text-center">
        <h1 className="text-xl font-semibold">حدث خطأ في تحميل الصفحة</h1>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button onClick={() => { router.invalidate(); reset(); }} className="btn-primary">حاول مرة أخرى</button>
          <a href="/" className="btn-ghost">الرئيسية</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "المهندس محمود شلتوت | دورات الكيمياء النووية" },
      { name: "description", content: "دورات الكيمياء النووية في السعودية والخليج: شرح التفاعلات والنظائر والمفاعلات والسلامة الإشعاعية مع المهندس محمود إسماعيل شلتوت." },
      { name: "keywords", content: "الكيمياء النووية, دورات كيمياء نووية, دروس خصوصية كيمياء نووية, تعليم الكيمياء النووية في السعودية, المفاعلات النووية, النظائر المشعة, السلامة الإشعاعية, Nuclear chemistry courses, Saudi Arabia" },
      { property: "og:type", content: "website" },
      { property: "og:site_name", content: "Nuclear Knowledge Hub | مركز المعرفة النووية" },
      { property: "og:locale", content: "ar_SA" },
      { property: "og:image", content: "/og-image.jpg" },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { property: "og:image:type", content: "image/jpeg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Person",
          name: "المهندس محمود إسماعيل شلتوت",
          jobTitle: "مدرّب ومهندس كيمياء نووية",
          knowsAbout: [
            "الكيمياء النووية",
            "المفاعلات النووية",
            "النظائر المشعة",
            "السلامة الإشعاعية",
          ],
          image: "/og-image.jpg",
        }),
      },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "manifest", href: "/site.webmanifest" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const lang = langFromPath(pathname);
  const [hostname, setHostname] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setHostname(window.location.hostname);
    setOrigin(window.location.origin);
  }, []);

  const publishableKey = publishableKeyFromHost(
    hostname,
    import.meta.env["VITE_CLERK_PUBLISHABLE_KEY"],
  );
  const proxyUrl = import.meta.env["VITE_CLERK_PROXY_URL"];
  const appearance = {
    ...shadcn,
    cssLayerName: "clerk",
    variables: {
      ...shadcn.variables,
      colorPrimary: "#08d5e4",
      colorForeground: "#f5f7fa",
      colorMutedForeground: "#a5afbd",
      colorDanger: "#ff6681",
      colorBackground: "#0b0e14",
      colorInput: "#080b11",
      colorInputForeground: "#f5f7fa",
      colorNeutral: "#26313d",
      fontFamily: '"IBM Plex Sans Arabic", sans-serif',
      borderRadius: "14px",
    },
    options: {
      ...shadcn.options,
      logoPlacement: "inside" as const,
      logoLinkUrl: lang === "en" ? "/en" : "/",
      logoImageUrl: `${origin}/logo.svg`,
    },
    elements: {
      ...shadcn.elements,
      cardBox: {
        background: "#0b0e14",
        border: "1px solid #202a35",
        borderRadius: "20px",
        boxShadow: "0 24px 80px -44px rgba(0, 213, 228, .35)",
      },
      card: { background: "transparent", boxShadow: "none" },
      footer: { background: "transparent", boxShadow: "none" },
      headerTitle: { color: "#f5f7fa" },
      headerSubtitle: { color: "#a5afbd" },
      formFieldLabel: { color: "#e4e9ef" },
      formFieldInput: {
        backgroundColor: "#080b11",
        color: "#f5f7fa",
        borderColor: "#26313d",
      },
      footerActionLink: { color: "#08d5e4" },
      footerActionText: { color: "#a5afbd" },
      dividerText: { color: "#a5afbd" },
      formButtonPrimary: { backgroundColor: "#08d5e4", color: "#061013" },
    },
  } as NonNullable<ComponentProps<typeof ClerkProvider>["appearance"]>;

  return (
    <html lang={lang} dir={lang === "en" ? "ltr" : "rtl"}>
      <head>
        <HeadContent />
      </head>
      <body>
        <ClerkProvider
          publishableKey={publishableKey}
          proxyUrl={proxyUrl}
          signInUrl={lang === "en" ? "/en/sign-in" : "/sign-in"}
          signUpUrl={lang === "en" ? "/en/sign-up" : "/sign-up"}
          appearance={appearance}
          localization={lang === "en" ? enUS : arSA}
        >
          {children}
        </ClerkProvider>
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isAuthPage = /^\/(en\/)?sign-(in|up)(\/|$)/.test(pathname);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="relative min-h-screen overflow-x-hidden">
        <div className="tech-grid pointer-events-none fixed inset-0 z-0" />
        <div className="top-glow pointer-events-none fixed inset-x-0 top-0 z-0 h-[300px]" />
        <ClickGlowLayer />
        {!isAuthPage && <SiteHeader />}
        <main className="relative z-10">
          <Outlet />
        </main>
        {!isAuthPage && <SiteFooter />}
        {!isAuthPage && <WhatsAppFab />}
      </div>
    </QueryClientProvider>
  );
}
