import { lazy, Suspense, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ClickGlowLayer } from "./components/ClickGlowLayer";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { SupportWidget } from "./components/SupportWidget";
import { Footer } from "./components/Footer";

const CoursesSection = lazy(() =>
  import("./components/CoursesSection").then((module) => ({ default: module.CoursesSection })),
);
const ReactorSimulator = lazy(() =>
  import("./components/ReactorSimulator").then((module) => ({ default: module.ReactorSimulator })),
);
const InstructorPage = lazy(() =>
  import("./components/InstructorPage").then((module) => ({ default: module.InstructorPage })),
);
const StudentPortal = lazy(() =>
  import("./components/StudentPortal").then((module) => ({ default: module.StudentPortal })),
);
const BookingAndMeetingRoom = lazy(() =>
  import("./components/BookingAndMeetingRoom").then((module) => ({ default: module.BookingAndMeetingRoom })),
);
const AdminPanel = lazy(() =>
  import("./components/AdminPanel").then((module) => ({ default: module.AdminPanel })),
);
const AuthModal = lazy(() =>
  import("./components/AuthModal").then((module) => ({ default: module.AuthModal })),
);
const GamificationSection = lazy(() =>
  import("./components/GamificationSection").then((module) => ({ default: module.GamificationSection })),
);
const PlacementQuizSection = lazy(() =>
  import("./components/PlacementQuizSection").then((module) => ({ default: module.PlacementQuizSection })),
);
const ChatAndResources = lazy(() =>
  import("./components/ChatAndResources").then((module) => ({ default: module.ChatAndResources })),
);
const ArticlesSection = lazy(() =>
  import("./components/ArticlesSection").then((module) => ({ default: module.ArticlesSection })),
);
const AIStudyPlanModal = lazy(() =>
  import("./components/AIStudyPlanModal").then((module) => ({ default: module.AIStudyPlanModal })),
);
const SpacedRepetitionModal = lazy(() =>
  import("./components/SpacedRepetitionModal").then((module) => ({ default: module.SpacedRepetitionModal })),
);
const PaymentModal = lazy(() =>
  import("./components/PaymentModal").then((module) => ({ default: module.PaymentModal })),
);
const NotificationsModal = lazy(() =>
  import("./components/NotificationsModal").then((module) => ({ default: module.NotificationsModal })),
);

import { INITIAL_COURSES } from "./data/coursesData";
import { Course, Role, StudyPlan, UserProfile } from "./types";
import { appPath } from "./lib/app-path";

const TAB_ROUTES: Record<string, string> = {
  home: "",
  courses: "courses",
  simulator: "simulator",
  instructor: "instructor",
  portal: "student-portal",
  booking: "booking",
  admin: "admin",
};

const TAB_SEO: Record<string, { ar: string; en: string; descriptionAr: string; descriptionEn: string }> = {
  home: {
    ar: "الكيمياء النووية وهندسة المفاعلات | مركز المعرفة",
    en: "Nuclear Chemistry & Reactor Engineering | Knowledge Hub",
    descriptionAr: "تعلم الكيمياء النووية وهندسة المفاعلات والسلامة الإشعاعية مع المهندس محمود شلتوت عبر مقررات ودروس عربية وإنجليزية.",
    descriptionEn: "Learn nuclear chemistry, reactor engineering, and radiation safety with Eng. Mahmoud Shaltoot through bilingual courses and lessons.",
  },
  courses: {
    ar: "دورات الكيمياء النووية وهندسة المفاعلات",
    en: "Nuclear Chemistry & Reactor Engineering Courses",
    descriptionAr: "استكشف دورات الكيمياء النووية والمفاعلات والسلامة الإشعاعية لطلاب الجامعات في السعودية والخليج.",
    descriptionEn: "Explore nuclear chemistry, reactor engineering, and radiation safety courses for university learners across Saudi Arabia and the Gulf.",
  },
  simulator: {
    ar: "محاكاة المفاعل النووي التعليمية",
    en: "Interactive Nuclear Reactor Simulator",
    descriptionAr: "جرّب محاكاة تعليمية مبسطة للمفاعل النووي وعوامل التحكم والتفاعلات المتسلسلة.",
    descriptionEn: "Explore an educational reactor simulation covering control systems and nuclear chain reactions.",
  },
  instructor: {
    ar: "المهندس محمود شلتوت | مدرب الكيمياء النووية",
    en: "Eng. Mahmoud Shaltoot | Nuclear Chemistry Instructor",
    descriptionAr: "تعرّف على خبرة المهندس محمود شلتوت ومجالات تدريسه في الكيمياء النووية والمفاعلات والسلامة الإشعاعية.",
    descriptionEn: "Meet Eng. Mahmoud Shaltoot and learn about his teaching in nuclear chemistry, reactor engineering, and radiation safety.",
  },
  portal: {
    ar: "بوابة الطالب والدروس النووية",
    en: "Student Portal & Nuclear Science Lessons",
    descriptionAr: "تابع الدروس والمقررات والتقدم الدراسي في بوابة مركز المعرفة النووية.",
    descriptionEn: "Continue lessons, courses, and study progress in the Nuclear Knowledge Hub student portal.",
  },
  booking: {
    ar: "حجز جلسة تعليمية في الكيمياء النووية",
    en: "Book a Nuclear Chemistry Learning Session",
    descriptionAr: "احجز جلسة تعليمية فردية في الكيمياء النووية وهندسة المفاعلات والسلامة الإشعاعية.",
    descriptionEn: "Book an individual learning session in nuclear chemistry, reactor engineering, and radiation safety.",
  },
  admin: {
    ar: "دخول الإدارة | مركز المعرفة النووية",
    en: "Administration Sign In | Nuclear Knowledge Hub",
    descriptionAr: "دخول آمن لإدارة مركز المعرفة النووية.",
    descriptionEn: "Secure sign in for Nuclear Knowledge Hub administrators.",
  },
};

function getInitialTab(): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, "");
  const pathname = window.location.pathname.startsWith(base)
    ? window.location.pathname.slice(base.length)
    : window.location.pathname;
  const slug = pathname.replace(/^\/+|\/+$/g, "");
  return Object.entries(TAB_ROUTES).find(([, route]) => route === slug)?.[0] ?? "home";
}

function SectionPlaceholder({ minHeight }: { minHeight: number }) {
  return (
    <div
      aria-hidden="true"
      className="mx-auto w-full max-w-[1240px] px-6 py-10 lg:px-10"
      style={{ minHeight }}
    >
      <div
        className="animate-pulse rounded-2xl bg-[#e7ebe4]"
        style={{ height: Math.min(minHeight, 220) }}
      />
    </div>
  );
}

function DeferredSection({
  children,
  minHeight = 280,
}: {
  children: ReactNode;
  minHeight?: number;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") {
      setShouldLoad(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setShouldLoad(true);
          observer.disconnect();
        }
      },
      { rootMargin: "420px 0px" },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} style={{ minHeight }}>
      {shouldLoad ? (
        <Suspense fallback={<SectionPlaceholder minHeight={minHeight} />}>
          {children}
        </Suspense>
      ) : (
        <SectionPlaceholder minHeight={minHeight} />
      )}
    </div>
  );
}

function PageLoading({ language }: { language: "ar" | "en" }) {
  return (
    <div
      className="mx-auto flex min-h-[48vh] max-w-[1240px] items-center justify-center gap-3 px-6 text-sm text-[#60736a]"
      role="status"
      aria-live="polite"
    >
      <span className="size-7 animate-pulse rounded-full bg-[#dbe5dc]" />
      <span>{language === "ar" ? "جارٍ تجهيز الصفحة…" : "Loading this page…"}</span>
    </div>
  );
}

function ModalLoading({ language }: { language: "ar" | "en" }) {
  return (
    <div
      className="fixed inset-0 z-[100] grid place-items-center bg-[#1b302b]/20 p-4 backdrop-blur-sm"
      role="status"
      aria-live="polite"
    >
      <span className="rounded-xl bg-[#fffefa] px-5 py-3 text-sm font-medium text-[#304c43] shadow-xl">
        {language === "ar" ? "جارٍ فتح النافذة…" : "Opening…"}
      </span>
    </div>
  );
}

export default function App() {
  const [currentTab, setCurrentTab] = useState<string>(getInitialTab);
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const navigateTab = (tab: string) => {
    const route = TAB_ROUTES[tab] ?? "";
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const nextPath = `${base}${route}`;
    setCurrentTab(tab);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: "anonymous",
    name: "طالب",
    email: "",
    role: "student",
    xp: 0,
    level: "المستوى التمهيدي",
    badges: [],
    enrolledCourseIds: [],
    attendanceRate: 0,
    avgQuizScore: 0,
  });

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>([]);
  const [progressOwnerId, setProgressOwnerId] = useState<string | null>(null);

  // Modal open states
  const [isStudyPlanOpen, setIsStudyPlanOpen] = useState(false);
  const [isSpacedRepetitionOpen, setIsSpacedRepetitionOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<Course | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);
  const [isAuthStateLoading, setIsAuthStateLoading] = useState(true);

  // Track online/offline status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  // Sync RTL / LTR based on language
  useEffect(() => {
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.lang = language;
  }, [language]);

  useEffect(() => {
    const handlePopState = () => setCurrentTab(getInitialTab());
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const content = TAB_SEO[currentTab] ?? TAB_SEO.home;
    const title = language === "en" ? content.en : content.ar;
    const description = language === "en" ? content.descriptionEn : content.descriptionAr;
    document.title = title;
    const setMeta = (selector: string, attribute: string, value: string) => {
      let element = document.head.querySelector<HTMLMetaElement>(selector);
      if (!element) {
        element = document.createElement("meta");
        const [key, val] = selector.match(/\[(name|property)="([^"]+)"\]/)?.slice(1) ?? [];
        if (key && val) element.setAttribute(key, val);
        document.head.appendChild(element);
      }
      element.setAttribute(attribute, value);
    };
    setMeta('meta[name="description"]', "content", description);
    setMeta('meta[name="keywords"]', "content", language === "ar"
      ? "الكيمياء النووية، هندسة المفاعلات، السلامة الإشعاعية، دورات نووية، تعليم جامعي، السعودية، الخليج"
      : "nuclear chemistry, reactor engineering, radiation safety, nuclear courses, university learning, Saudi Arabia, Gulf");
    setMeta('meta[property="og:title"]', "content", title);
    setMeta('meta[property="og:description"]', "content", description);
    setMeta('meta[property="og:url"]', "content", window.location.href);
    setMeta('meta[property="og:image"]', "content", new URL(appPath("/og-image.png"), window.location.origin).href);
    setMeta('meta[name="twitter:image"]', "content", new URL(appPath("/og-image.png"), window.location.origin).href);
    setMeta('meta[name="twitter:title"]', "content", title);
    setMeta('meta[name="twitter:description"]', "content", description);
    setMeta('meta[name="robots"]', "content", currentTab === "admin" || currentTab === "portal" ? "noindex, nofollow" : "index, follow");
    const base = import.meta.env.BASE_URL.endsWith("/")
      ? import.meta.env.BASE_URL
      : `${import.meta.env.BASE_URL}/`;
    const route = TAB_ROUTES[currentTab] ?? "";
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = `${window.location.origin}${base}${route}`;
  }, [currentTab, language]);

  // The signed server session is the only source of account identity and role.
  useEffect(() => {
    const controller = new AbortController();
    fetch(appPath("/api/auth/me"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) return;
        const data = (await response.json()) as {
          user?: { id: string; name: string; email: string; role: Role } | null;
        };
        const user = data.user;
        if (!user || controller.signal.aborted) {
          if (!controller.signal.aborted) setIsAuthStateLoading(false);
          return;
        }
        setCurrentUser((previous) => ({
          ...previous,
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        }));
        setIsAuthenticated(true);
        setIsAuthStateLoading(false);
      })
      .catch(() => {
        // A missing account session is the normal signed-out state.
        if (!controller.signal.aborted) setIsAuthStateLoading(false);
      });
    return () => controller.abort();
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setCompletedLessonIds([]);
      setProgressOwnerId(null);
      return;
    }
    const key = `nuclear_hub_completed_lessons:${currentUser.id}`;
    let completed: string[] = [];
    try {
      const saved = localStorage.getItem(key);
      const parsed: unknown = saved ? JSON.parse(saved) : [];
      if (Array.isArray(parsed)) {
        completed = parsed.filter((lessonId): lessonId is string => typeof lessonId === "string");
      }
    } catch {
      // A malformed progress record is ignored without affecting the account session.
    }
    setCompletedLessonIds(completed);
    setProgressOwnerId(currentUser.id);
  }, [currentUser.id, isAuthenticated]);

  useEffect(() => {
    if (!isAuthenticated || progressOwnerId !== currentUser.id) return;
    try {
      localStorage.setItem(
        `nuclear_hub_completed_lessons:${currentUser.id}`,
        JSON.stringify(completedLessonIds),
      );
    } catch {
      // Progress remains available in memory for this session if storage is unavailable.
    }
  }, [completedLessonIds, currentUser.id, isAuthenticated, progressOwnerId]);

  const handleRoleChange = (
    newRole: Role,
    identity?: Partial<Pick<UserProfile, "id" | "name" | "email">>,
  ) => {
    setCurrentUser((prev) => {
      let name = identity?.name ?? prev.name;
      if (!identity?.name && newRole === "admin") name = language === "en" ? "Administrator" : "مشرف";
      else if (!identity?.name && newRole === "instructor") name = language === "en" ? "Instructor" : "مدرّب";
      else if (!identity?.name && newRole === "parent") name = language === "en" ? "Parent" : "ولي أمر";
      else if (!identity?.name && newRole === "student") name = language === "en" ? "Student" : "طالب";
      return {
        ...prev,
        id: identity?.id ?? prev.id,
        email: identity?.email ?? prev.email,
        role: newRole,
        name,
      };
    });
    setIsAuthenticated(newRole === "admin");
  };

  const handleAccountAuthenticated = (user: {
    id: string;
    name: string;
    email: string;
    role: Role;
  }) => {
    setCurrentUser((previous) => ({
      ...previous,
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    }));
    setIsAuthenticated(true);
    setIsAuthModalOpen(false);
    navigateTab(user.role === "admin" ? "admin" : "portal");
  };

  const handleSignOut = async () => {
    try {
      await fetch(appPath("/api/auth/logout"), {
        method: "POST",
        credentials: "include",
      });
    } finally {
      setIsAuthenticated(false);
      setIsAuthStateLoading(false);
      navigateTab("home");
      setCurrentUser({
        id: "anonymous",
        name: language === "en" ? "Student" : "طالب",
        email: "",
        role: "student",
        xp: 0,
        level: "المستوى التمهيدي",
        badges: [],
        enrolledCourseIds: [],
        attendanceRate: 0,
        avgQuizScore: 0,
      });
    }
  };

  const handleLessonCompleted = (lessonId: string, earnedXp: number) => {
    if (!completedLessonIds.includes(lessonId)) {
      setCompletedLessonIds((prev) => [...prev, lessonId]);
      setCurrentUser((prev) => ({
        ...prev,
        xp: prev.xp + earnedXp,
      }));
    }
  };

  const handleCardReviewed = (earnedXp: number) => {
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + earnedXp,
    }));
  };

  const handleEnrollInitiated = (course: Course) => {
    setSelectedPaymentCourse(course);
    setIsPaymentOpen(true);
  };

  const handlePaymentSuccess = (courseId: string) => {
    setCurrentUser((prev) => ({
      ...prev,
      enrolledCourseIds: Array.from(new Set([...prev.enrolledCourseIds, courseId])),
      xp: prev.xp + 100, // enrollment bonus
    }));
    setTimeout(() => {
      setIsPaymentOpen(false);
      navigateTab("portal");
    }, 1500);
  };

  const handleSaveStudyPlan = (plan: StudyPlan) => {
    localStorage.setItem(`nuclear_hub_active_plan:${currentUser.id}`, JSON.stringify(plan));
    setCurrentUser((prev) => ({
      ...prev,
      xp: prev.xp + 75,
    }));
  };

  return (
    <div className="min-h-[100dvh] bg-[#f4f2eb] text-[#20352f] flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* 
        Click & Touch Neon Glow Effect Layer:
        Fulfills: "عايز بقى لما المستخدمين يدوسوا بالماوس أو في التليفونات على أي منطقة تتوهج كده بشكل أنيق يهطق الابصار"
      */}
      <ClickGlowLayer />

      {/* Navigation Header */}
      <Navbar
        currentTab={currentTab}
        onTabChange={navigateTab}
        currentUser={currentUser}
        isAuthenticated={isAuthenticated}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={() => void handleSignOut()}
        language={language}
        onLanguageToggle={() => setLanguage(language === "ar" ? "en" : "ar")}
        isOnline={isOnline}
        onOpenStudyPlan={() => setIsStudyPlanOpen(true)}
        unreadNotificationsCount={unreadNotificationsCount}
        onOpenNotifications={() => {
          setIsNotificationsOpen(true);
          setUnreadNotificationsCount(0);
        }}
      />

      {/* Main Pages Container */}
      <main className="flex-1">
        {currentTab === "home" && (
          <>
            {/* 
              First Hero Section:
              Keeps the main navigation, hero, and primary actions ready immediately.
            */}
            <HeroSection
              onStartJourney={() => {
                if (!isAuthenticated) setIsAuthModalOpen(true);
                else setIsStudyPlanOpen(true);
              }}
              onBrowseCourses={() => {
                const el = document.getElementById("courses-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else navigateTab("courses");
              }}
              onOpenSimulator={() => navigateTab("simulator")}
              language={language}
            />

            <DeferredSection minHeight={340}>
              <PlacementQuizSection
                onOpenStudyPlan={() => setIsStudyPlanOpen(true)}
                language={language}
              />
            </DeferredSection>

            {/* Courses Catalogue */}
            <div id="courses-anchor" className="scroll-mt-24">
              <DeferredSection minHeight={560}>
                <CoursesSection
                  courses={courses}
                  onEnroll={handleEnrollInitiated}
                  language={language}
                />
              </DeferredSection>
            </div>

            {/* Virtual Reactor Simulator */}
            <div className="py-8 px-6 lg:px-10 max-w-[1240px] mx-auto">
              <DeferredSection minHeight={520}>
                <ReactorSimulator language={language} />
              </DeferredSection>
            </div>

            {/* Gamification & Leaderboard */}
            <DeferredSection minHeight={360}>
              <GamificationSection
                currentUser={currentUser}
                language={language}
              />
            </DeferredSection>

            {/* Q&A Chat & File Sharing */}
            <DeferredSection minHeight={360}>
              <ChatAndResources language={language} />
            </DeferredSection>

            {/* Educational Articles & Solved Problems */}
            <DeferredSection minHeight={420}>
              <ArticlesSection language={language} />
            </DeferredSection>
          </>
        )}

        {currentTab === "courses" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <div className="py-6">
              <h1 className="sr-only">{language === "en" ? "Nuclear chemistry and reactor engineering courses" : "دورات الكيمياء النووية وهندسة المفاعلات"}</h1>
              <CoursesSection
                courses={courses}
                onEnroll={handleEnrollInitiated}
                language={language}
              />
            </div>
          </Suspense>
        )}

        {currentTab === "simulator" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <div className="py-12 px-6 lg:px-10 max-w-[1240px] mx-auto">
              <h1 className="sr-only">{language === "en" ? "Interactive nuclear reactor simulator" : "محاكاة المفاعل النووي التعليمية"}</h1>
              <ReactorSimulator language={language} />
            </div>
          </Suspense>
        )}

        {currentTab === "instructor" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <InstructorPage
              onBookSession={() => navigateTab("booking")}
              language={language}
            />
          </Suspense>
        )}

        {currentTab === "portal" && !isAuthenticated && (
          <section className="mx-auto flex min-h-[52vh] max-w-3xl flex-col items-center justify-center px-6 py-16 text-center">
            <h1 className="text-3xl font-bold">
              {language === "en" ? "Sign in to open your student portal" : "سجّل الدخول لفتح بوابة الطالب"}
            </h1>
            <p className="mt-4 max-w-xl leading-7 text-[var(--muted)]">
              {language === "en" ? "Your courses and learning progress are available after you sign in." : "تظهر مقرراتك وتقدمك الدراسي بعد تسجيل الدخول."}
            </p>
            {isAuthStateLoading ? (
              <p role="status" className="mt-6 text-sm text-[var(--muted)]">{language === "en" ? "Checking your session…" : "جارٍ التحقق من جلستك…"}</p>
            ) : (
              <button
                className="mt-6 rounded-xl bg-[var(--primary)] px-6 py-3 font-semibold text-[var(--button-ink)]"
                onClick={() => setIsAuthModalOpen(true)}
                type="button"
              >
                {language === "en" ? "Sign in or create an account" : "تسجيل الدخول أو إنشاء حساب"}
              </button>
            )}
          </section>
        )}
        {currentTab === "portal" && isAuthenticated && (
          <Suspense fallback={<PageLoading language={language} />}>
            <StudentPortal
              currentUser={currentUser}
              courses={courses}
              completedLessonIds={completedLessonIds}
              onCompleteLesson={handleLessonCompleted}
              onOpenSpacedRepetition={() => setIsSpacedRepetitionOpen(true)}
              language={language}
            />
          </Suspense>
        )}

        {currentTab === "booking" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <h1 className="sr-only">{language === "en" ? "Book a nuclear chemistry learning session" : "حجز جلسة تعليمية في الكيمياء النووية"}</h1>
            <BookingAndMeetingRoom language={language} />
          </Suspense>
        )}

        {currentTab === "admin" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <AdminPanel
              currentUser={currentUser}
              onRoleSwitch={handleRoleChange}
              language={language}
            />
          </Suspense>
        )}
      </main>

      {/* Floating Support & Cloud Sync Widget */}
      <SupportWidget language={language} />

      {/* Footer */}
      <Footer onTabChange={navigateTab} language={language} />

      {/* Modals */}
      {isStudyPlanOpen && (
        <Suspense fallback={<ModalLoading language={language} />}>
          <AIStudyPlanModal
            isOpen={isStudyPlanOpen}
            onClose={() => setIsStudyPlanOpen(false)}
            onSavePlan={handleSaveStudyPlan}
            onEnrollCourse={(courseId) => {
              setIsStudyPlanOpen(false);
              const found = courses.find((c) => c.id === courseId);
              if (found) handleEnrollInitiated(found);
            }}
            language={language}
          />
        </Suspense>
      )}

      {isSpacedRepetitionOpen && (
        <Suspense fallback={<ModalLoading language={language} />}>
          <SpacedRepetitionModal
            isOpen={isSpacedRepetitionOpen}
            onClose={() => setIsSpacedRepetitionOpen(false)}
            onCardReviewed={handleCardReviewed}
            language={language}
          />
        </Suspense>
      )}

      {selectedPaymentCourse && (
        <Suspense fallback={<ModalLoading language={language} />}>
          <PaymentModal
            course={selectedPaymentCourse}
            onClose={() => setIsPaymentOpen(false)}
            onSuccess={handlePaymentSuccess}
            language={language}
          />
        </Suspense>
      )}

      {isNotificationsOpen && (
        <Suspense fallback={<ModalLoading language={language} />}>
          <NotificationsModal
            isOpen={isNotificationsOpen}
            onClose={() => setIsNotificationsOpen(false)}
            onNavigateToBooking={() => navigateTab("booking")}
            onNavigateToSpacedRepetition={() => setIsSpacedRepetitionOpen(true)}
            language={language}
          />
        </Suspense>
      )}
      {isAuthModalOpen && (
        <Suspense fallback={<ModalLoading language={language} />}>
          <AuthModal
            language={language}
            onClose={() => setIsAuthModalOpen(false)}
            onAuthenticated={handleAccountAuthenticated}
          />
        </Suspense>
      )}
    </div>
  );
}
