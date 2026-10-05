import React, { useEffect, useState } from "react";
import { UserProfile } from "../types";
import {
  Bell,
  Globe,
  Wifi,
  WifiOff,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  Lock,
  Sun,
  Moon,
} from "lucide-react";
import { appPath } from "../lib/app-path";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  isAuthenticated: boolean;
  onOpenAuth: () => void;
  onSignOut: () => void;
  language: "ar" | "en";
  onLanguageToggle: () => void;
  isOnline: boolean;
  onOpenStudyPlan: () => void;
  unreadNotificationsCount: number;
  onOpenNotifications: () => void;
}

export function Navbar({
  currentTab,
  onTabChange,
  currentUser,
  isAuthenticated,
  onOpenAuth,
  onSignOut,
  language,
  onLanguageToggle,
  isOnline,
  onOpenStudyPlan,
  unreadNotificationsCount,
  onOpenNotifications,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    try {
      return localStorage.getItem("nuclear_hub_theme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });
  const isEn = language === "en";

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.style.colorScheme = theme;
    try {
      localStorage.setItem("nuclear_hub_theme", theme);
    } catch {
      // Theme remains available for the current session when storage is unavailable.
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#030612]/85 backdrop-blur-2xl shadow-[0_12px_45px_-12px_rgba(0,0,0,0.9),0_1px_0_0_rgba(0,240,255,0.15)] transition-all">
      <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <button
          type="button"
          aria-label={isEn ? "Go to home" : "الانتقال إلى الرئيسية"}
          className="flex items-center gap-3.5 text-start group"
          onClick={() => onTabChange("home")}
        >
          <img
            src={appPath("/logo.svg")}
            alt={isEn ? "Nuclear Knowledge Hub" : "مركز المعرفة النووية"}
            width="340"
            height="76"
            className="h-10 w-auto max-w-[min(58vw,220px)] object-contain transition-opacity group-hover:opacity-90 sm:h-12"
          />
        </button>

        {/* Desktop Navigation Links in a Luxury Segmented Floating Dock */}
        <nav className="hidden xl:flex items-center gap-1.5 bg-[#060b19]/90 p-1.5 rounded-full border border-cyan-500/20 shadow-[inset_0_1px_3px_rgba(255,255,255,0.06),0_6px_25px_rgba(0,0,0,0.6)] backdrop-blur-2xl">
          <button
            onClick={() => onTabChange("home")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "home"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "Home" : "الرئيسية"}
          </button>
          <button
            onClick={() => onTabChange("courses")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "courses"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "Courses" : "الدورات المتاحة"}
          </button>
          <button
            onClick={onOpenStudyPlan}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-extrabold text-amber-200 bg-gradient-to-r from-amber-500/25 via-amber-400/30 to-yellow-500/20 border border-amber-400/60 hover:border-amber-300 hover:shadow-[0_0_24px_rgba(245,158,11,0.45)] hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-[0_0_14px_rgba(245,158,11,0.25)]"
          >
            <Sparkles className="size-3.5 text-amber-300 animate-pulse" />
            <span>{isEn ? "AI Study Plan" : "خطة المذاكرة الذكية"}</span>
          </button>
          <button
            onClick={() => onTabChange("simulator")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "simulator"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "Reactor Simulator" : "محاكي المفاعل"}
          </button>
          <button
            onClick={() => onTabChange("instructor")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "instructor"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "Eng. Mahmoud" : "صفحة المهندس محمود"}
          </button>
          <button
            onClick={() => onTabChange("portal")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "portal"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "Student Portal" : "بوابة الطالب"}
          </button>
          <button
            onClick={() => onTabChange("booking")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
              currentTab === "booking"
                ? "bg-gradient-to-r from-cyan-500/25 via-cyan-400/20 to-blue-500/20 text-[#00f0ff] border border-cyan-400/60 shadow-[0_0_18px_rgba(0,240,255,0.3)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            {isEn ? "1-on-1 Sessions" : "حجز جلسة خاصة"}
          </button>
          <button
            onClick={() => onTabChange("admin")}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer flex items-center gap-1.5 ${
              currentTab === "admin"
                ? "bg-gradient-to-r from-pink-500/30 via-pink-500/25 to-purple-500/20 text-[#ec4899] border border-pink-500/60 shadow-[0_0_18px_rgba(236,72,153,0.35)]"
                : "text-slate-300 hover:text-white hover:bg-slate-800/60"
            }`}
          >
            <Lock className="size-3 text-pink-400" />
            <span>{isEn ? "Admin (Protected)" : "لوحة الإدارة (محمية)"}</span>
          </button>
        </nav>

        {/* Right Action Icons: Online indicator, Role Switcher, Language, Notifications */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Online / Offline Sync status */}
          <div
            className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-mono border backdrop-blur-md shadow-sm ${
              isOnline
                ? "bg-emerald-950/60 border-emerald-500/40 text-emerald-300 shadow-[0_0_10px_rgba(16,185,129,0.2)]"
                : "bg-amber-950/60 border-amber-500/40 text-amber-300 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
            }`}
            title={isOnline ? "متصل - تتم المزامنة التلقائية مع السحابة" : "وضع عدم الاتصال - البيانات محفوظة محلياً"}
          >
            {isOnline ? <Wifi className="size-3" /> : <WifiOff className="size-3" />}
            <span className="hidden sm:inline font-bold">{isOnline ? (isEn ? "Synced" : "مُزامن") : (isEn ? "Offline" : "محلي")}</span>
          </div>

          {isAuthenticated ? (
            <button
              type="button"
              onClick={() => onTabChange(currentUser.role === "admin" ? "admin" : "portal")}
              className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-slate-900/90 px-3 py-1.5 text-xs text-slate-100 transition-all hover:border-cyan-400"
              aria-label={isEn ? `Open ${currentUser.name}'s account` : `فتح حساب ${currentUser.name}`}
            >
              <User className="size-3.5 text-cyan-400" />
              <span className="hidden max-w-28 truncate font-bold md:inline">{currentUser.name}</span>
            </button>
            <button
              type="button"
              onClick={onSignOut}
              className="rounded-xl border border-slate-700/80 bg-slate-900/90 p-2 text-slate-300 transition hover:border-rose-400/50 hover:text-rose-700"
              aria-label={isEn ? "Sign out" : "تسجيل الخروج"}
              title={isEn ? "Sign out" : "تسجيل الخروج"}
            >
              <LogOut className="size-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex items-center gap-1.5 rounded-xl border border-cyan-500/40 bg-cyan-900/20 px-3 py-2 text-xs font-bold text-cyan-100 transition hover:border-cyan-300 hover:bg-cyan-900/30"
              data-testid="button-open-auth"
            >
              <User className="size-3.5" />
              {isEn ? "Sign in / Join" : "دخول / إنشاء حساب"}
            </button>
          )}

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 hover:text-cyan-300 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="size-3.5 text-cyan-400" />
            <span className="font-mono font-bold uppercase">{isEn ? "عربي" : "EN"}</span>
          </button>

          {/* Persisted appearance preference */}
          <button
            type="button"
            onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
            aria-label={theme === "light" ? (isEn ? "Switch to dark theme" : "التبديل إلى المظهر الداكن") : (isEn ? "Switch to light theme" : "التبديل إلى المظهر الفاتح")}
            aria-pressed={theme === "dark"}
            title={theme === "light" ? (isEn ? "Dark theme" : "المظهر الداكن") : (isEn ? "Light theme" : "المظهر الفاتح")}
            className="flex items-center gap-1.5 rounded-xl border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 transition-all hover:border-cyan-400/60 hover:text-cyan-300 cursor-pointer"
          >
            {theme === "light" ? <Moon className="size-3.5" /> : <Sun className="size-3.5" />}
            <span className="hidden lg:inline">{theme === "light" ? (isEn ? "Dark" : "داكن") : (isEn ? "Light" : "فاتح")}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative rounded-xl border border-slate-700/80 bg-slate-900/90 p-2 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
            title="التنبيهات الذكية وجدولة المراجعات"
          >
            <Bell className="size-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -start-1 flex size-4 items-center justify-center rounded-full bg-[#ec4899] text-[9px] font-bold text-white shadow-[0_0_10px_#ec4899] animate-pulse">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {/* User XP Badge */}
          <div
            onClick={() => onTabChange("portal")}
            className="hidden sm:flex items-center gap-2 rounded-full border border-cyan-500/35 bg-gradient-to-r from-cyan-950/80 to-[#071324] px-3 py-1 text-xs cursor-pointer hover:border-cyan-400 hover:shadow-[0_0_18px_rgba(0,240,255,0.3)] transition-all shadow-sm"
            title="نقاط الخبرة XP والمستوى الدراسي"
          >
            <span className="size-2 rounded-full bg-cyan-400 pulse-dot" />
            <span className="font-extrabold text-cyan-300 font-mono">{currentUser.xp} XP</span>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? (isEn ? "Close navigation" : "إغلاق قائمة التنقل") : (isEn ? "Open navigation" : "فتح قائمة التنقل")}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="xl:hidden rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <nav id="mobile-navigation" aria-label={isEn ? "Mobile navigation" : "التنقل"} className="xl:hidden border-t border-slate-800 bg-[#060a16] px-4 py-4 space-y-2">
          <button
            onClick={() => { onTabChange("home"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Home" : "الرئيسية"}
          </button>
          <button
            onClick={() => { onTabChange("courses"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Courses" : "الدورات المتاحة"}
          </button>
          <button
            onClick={() => { onOpenStudyPlan(); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-amber-300"
          >
            {isEn ? "AI Study Plan" : "خطة المذاكرة الذكية بالذكاء الاصطناعي"}
          </button>
          <button
            onClick={() => { onTabChange("simulator"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-cyan-300"
          >
            {isEn ? "Reactor Simulator" : "محاكي المفاعل"}
          </button>
          <button
            onClick={() => { onTabChange("instructor"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Eng. Mahmoud Page" : "صفحة المهندس محمود"}
          </button>
          <button
            onClick={() => {
              if (isAuthenticated) onTabChange("portal");
              else onOpenAuth();
              setMobileMenuOpen(false);
            }}
            className="block w-full text-start py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? (isAuthenticated ? "Student Portal & Lessons" : "Sign in or create an account") : (isAuthenticated ? "بوابة الطالب والدروس" : "تسجيل الدخول أو إنشاء حساب")}
          </button>
          <button
            onClick={() => { onTabChange("booking"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Book Live Session" : "حجز جلسة مباشرة وفيديو"}
          </button>
          <button
            onClick={() => { onTabChange("admin"); setMobileMenuOpen(false); }}
            className="block w-full text-start py-2 text-sm font-medium text-pink-400"
          >
            {isEn ? "Admin (Protected)" : "لوحة الإدارة"}
          </button>
        </nav>
      )}
    </header>
  );
}
