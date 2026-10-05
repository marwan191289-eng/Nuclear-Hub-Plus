import React, { useState, useEffect } from "react";
import { ClickGlowLayer } from "./components/ClickGlowLayer";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { CoursesSection } from "./components/CoursesSection";
import { ReactorSimulator } from "./components/ReactorSimulator";
import { InstructorPage } from "./components/InstructorPage";
import { StudentPortal } from "./components/StudentPortal";
import { BookingAndMeetingRoom } from "./components/BookingAndMeetingRoom";
import { AdminPanel } from "./components/AdminPanel";
import { GamificationSection } from "./components/GamificationSection";
import { PlacementQuizSection } from "./components/PlacementQuizSection";
import { ChatAndResources } from "./components/ChatAndResources";
import { ArticlesSection } from "./components/ArticlesSection";
import { SupportWidget } from "./components/SupportWidget";
import { Footer } from "./components/Footer";

// Modals
import { AIStudyPlanModal } from "./components/AIStudyPlanModal";
import { SpacedRepetitionModal } from "./components/SpacedRepetitionModal";
import { PaymentModal } from "./components/PaymentModal";
import { NotificationsModal } from "./components/NotificationsModal";

import { INITIAL_COURSES } from "./data/coursesData";
import { Course, Role, StudyPlan, UserProfile } from "./types";

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
      name: "سعود بن فيصل العتيبي",
      email: "saud.alotaibi@student.edu.sa",
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
      if (newRole === "admin") name = "المهندس محمود شلتوت (المدير)";
      else if (newRole === "instructor") name = "د. كريم إبراهيم (مدرب مساعد)";
      else if (newRole === "parent") name = "أبو فيصل العتيبي (ولي أمر)";
      else name = "سعود بن فيصل العتيبي (طالب)";
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
    <div className="min-h-screen bg-[#040711] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200">
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
              Replicates the exact colors, typography, layout, reactor core card, and realistic incremental 500+ counter from user image.
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

            {/* Placement Diagnostic */}
            <PlacementQuizSection
              onOpenStudyPlan={() => setIsStudyPlanOpen(true)}
              language={language}
            />

            {/* Courses Catalogue */}
            <div id="courses-anchor">
              <CoursesSection
                courses={courses}
                onEnroll={handleEnrollInitiated}
                language={language}
              />
            </div>

            {/* Virtual Reactor Simulator */}
            <div className="py-8 px-6 lg:px-10 max-w-[1240px] mx-auto">
              <ReactorSimulator language={language} />
            </div>

            {/* Gamification & Leaderboard */}
            <GamificationSection
              currentUser={currentUser}
              language={language}
            />

            {/* Q&A Chat & File Sharing */}
            <ChatAndResources language={language} />

            {/* Educational Articles & Solved Problems */}
            <ArticlesSection language={language} />
          </>
        )}

        {currentTab === "courses" && (
          <div className="py-6">
            <CoursesSection
              courses={courses}
              onEnroll={handleEnrollInitiated}
              language={language}
            />
          </div>
        )}

        {currentTab === "simulator" && (
          <div className="py-12 px-6 lg:px-10 max-w-[1240px] mx-auto">
            <ReactorSimulator language={language} />
          </div>
        )}

        {currentTab === "instructor" && (
          <InstructorPage
            onBookSession={() => setCurrentTab("booking")}
            language={language}
          />
        )}

        {currentTab === "portal" && (
          <StudentPortal
            currentUser={currentUser}
            courses={courses}
            completedLessonIds={completedLessonIds}
            onCompleteLesson={handleLessonCompleted}
            onOpenSpacedRepetition={() => setIsSpacedRepetitionOpen(true)}
            language={language}
          />
        )}

        {currentTab === "booking" && (
          <BookingAndMeetingRoom language={language} />
        )}

        {currentTab === "admin" && (
          <AdminPanel
            currentUser={currentUser}
            onRoleSwitch={handleRoleChange}
            language={language}
          />
        )}
      </main>

      {/* Floating Support & Cloud Sync Widget */}
      <SupportWidget language={language} />

      {/* Footer */}
      <Footer onTabChange={setCurrentTab} language={language} />

      {/* Modals */}
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

      <SpacedRepetitionModal
        isOpen={isSpacedRepetitionOpen}
        onClose={() => setIsSpacedRepetitionOpen(false)}
        onCardReviewed={handleCardReviewed}
        language={language}
      />

      <PaymentModal
        course={selectedPaymentCourse}
        onClose={() => setIsPaymentOpen(false)}
        onSuccess={handlePaymentSuccess}
        language={language}
      />

      <NotificationsModal
        isOpen={isNotificationsOpen}
        onClose={() => setIsNotificationsOpen(false)}
        onNavigateToBooking={() => setCurrentTab("booking")}
        onNavigateToSpacedRepetition={() => setIsSpacedRepetitionOpen(true)}
        language={language}
      />
    </div>
  );
}
