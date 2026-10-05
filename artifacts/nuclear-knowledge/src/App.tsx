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
  const [currentTab, setCurrentTab] = useState<string>("home");
  const [language, setLanguage] = useState<"ar" | "en">("ar");
  const [isOnline, setIsOnline] = useState<boolean>(true);

  // User Profile & RBAC
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem("nuclear_hub_user");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return {
      id: "usr-student-01",
      name: "طالب",
      email: "",
      role: "student",
      xp: 350,
      level: "مستوى البروتون (Level 2)",
      badges: ["نواة المعرفة", "درع الرصاص"],
      enrolledCourseIds: ["fundamentals"],
      attendanceRate: 95,
      avgQuizScore: 92,
    };
  });

  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("nuclear_hub_completed_lessons");
    if (saved) {
      try { return JSON.parse(saved); } catch {}
    }
    return ["fund-1", "fund-2"];
  });

  // Modal open states
  const [isStudyPlanOpen, setIsStudyPlanOpen] = useState(false);
  const [isSpacedRepetitionOpen, setIsSpacedRepetitionOpen] = useState(false);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [selectedPaymentCourse, setSelectedPaymentCourse] = useState<Course | null>(null);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [unreadNotificationsCount, setUnreadNotificationsCount] = useState(3);

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

  // Persist user and completed lessons
  useEffect(() => {
    localStorage.setItem("nuclear_hub_user", JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem("nuclear_hub_completed_lessons", JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  const handleRoleChange = (newRole: Role) => {
    setCurrentUser((prev) => {
      let name = prev.name;
      if (newRole === "admin") name = language === "en" ? "Administrator" : "مشرف";
      else if (newRole === "instructor") name = language === "en" ? "Instructor" : "مدرّب";
      else if (newRole === "parent") name = language === "en" ? "Parent" : "ولي أمر";
      else name = language === "en" ? "Student" : "طالب";
      return { ...prev, role: newRole, name };
    });
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
      setCurrentTab("portal");
    }, 1500);
  };

  const handleSaveStudyPlan = (plan: StudyPlan) => {
    localStorage.setItem("nuclear_hub_active_plan", JSON.stringify(plan));
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
        onTabChange={(tab) => {
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: "smooth" });
        }}
        currentUser={currentUser}
        onRoleChange={handleRoleChange}
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
              onStartJourney={() => setIsStudyPlanOpen(true)}
              onBrowseCourses={() => {
                const el = document.getElementById("courses-anchor");
                if (el) el.scrollIntoView({ behavior: "smooth" });
                else setCurrentTab("courses");
              }}
              onOpenSimulator={() => setCurrentTab("simulator")}
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
              <ReactorSimulator language={language} />
            </div>
          </Suspense>
        )}

        {currentTab === "instructor" && (
          <Suspense fallback={<PageLoading language={language} />}>
            <InstructorPage
              onBookSession={() => setCurrentTab("booking")}
              language={language}
            />
          </Suspense>
        )}

        {currentTab === "portal" && (
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
      <Footer onTabChange={setCurrentTab} language={language} />

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
            onNavigateToBooking={() => setCurrentTab("booking")}
            onNavigateToSpacedRepetition={() => setIsSpacedRepetitionOpen(true)}
            language={language}
          />
        </Suspense>
      )}
    </div>
  );
}
