import React, { useState } from "react";
import { Role, UserProfile } from "../types";
import {
  Atom,
  Bell,
  Globe,
  Wifi,
  WifiOff,
  User,
  Shield,
  GraduationCap,
  Users,
  Award,
  BookOpen,
  Calendar,
  Sparkles,
  Menu,
  X,
  Lock,
} from "lucide-react";

interface NavbarProps {
  currentTab: string;
  onTabChange: (tab: string) => void;
  currentUser: UserProfile;
  onRoleChange: (role: Role) => void;
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
  onRoleChange,
  language,
  onLanguageToggle,
  isOnline,
  onOpenStudyPlan,
  unreadNotificationsCount,
  onOpenNotifications,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [roleMenuOpen, setRoleMenuOpen] = useState(false);
  const isEn = language === "en";

  const roleLabels: Record<Role, { ar: string; en: string; icon: React.ReactNode }> = {
    admin: { ar: "المهندس محمود (المدير العام)", en: "Eng. Mahmoud (Super Admin)", icon: <Shield className="size-3.5 text-pink-400" /> },
    instructor: { ar: "معلم مساعد / مدرب", en: "Assistant Instructor", icon: <Award className="size-3.5 text-cyan-400" /> },
    student: { ar: "طالب أكاديمي", en: "Enrolled Student", icon: <GraduationCap className="size-3.5 text-emerald-400" /> },
    parent: { ar: "بوابة ولي الأمر", en: "Parent Portal", icon: <Users className="size-3.5 text-amber-400" /> },
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-500/20 bg-[#030612]/85 backdrop-blur-2xl shadow-[0_12px_45px_-12px_rgba(0,0,0,0.9),0_1px_0_0_rgba(0,240,255,0.15)] transition-all">
      <div className="mx-auto flex max-w-[1340px] items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand & Logo */}
        <div
          className="flex items-center gap-3.5 cursor-pointer group"
          onClick={() => onTabChange("home")}
        >
          <div className="relative flex items-center justify-center size-11 rounded-2xl bg-gradient-to-br from-cyan-950/90 via-[#071328] to-[#02050e] border border-cyan-400/50 shadow-[0_0_25px_rgba(0,240,255,0.4)] transition-all duration-300 group-hover:scale-105 group-hover:border-cyan-300 group-hover:shadow-[0_0_35px_rgba(0,240,255,0.7)]">
            <Atom className="size-6 text-[#00f0ff] animate-spin-slow transition-transform group-hover:rotate-45 drop-shadow-[0_0_8px_#00f0ff]" />
            <span className="absolute inset-0 rounded-2xl bg-cyan-400/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </div>
          <div>
            <div className="font-extrabold text-sm sm:text-base tracking-tight text-white flex items-center gap-2">
              <span className="group-hover:text-cyan-300 transition-colors">
                {isEn ? "Eng. Mahmoud Shaltoot" : "المهندس محمود شلتوت"}
              </span>
              <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest bg-gradient-to-r from-cyan-950/90 to-blue-950/90 text-cyan-300 border border-cyan-400/50 shadow-[0_0_12px_rgba(0,240,255,0.25)]">
                NUCLEAR
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-medium">
              {isEn ? "Nuclear Chemistry & Reactor Hub" : "منصة الكيمياء النووية والمفاعلات"}
            </div>
          </div>
        </div>

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

          {/* Quick Role Switcher Dropdown - Refined Metallic Capsule */}
          <div className="relative">
            <button
              onClick={() => setRoleMenuOpen(!roleMenuOpen)}
              className="flex items-center gap-2 rounded-xl border border-slate-700/80 bg-gradient-to-b from-slate-800/80 to-slate-900/90 px-3.5 py-1.5 text-xs text-slate-100 hover:border-cyan-400 hover:shadow-[0_0_20px_rgba(0,240,255,0.3)] transition-all cursor-pointer shadow-sm active:scale-95"
              title="تبديل الصلاحيات والأدوار للمعاينة الفورية"
            >
              {roleLabels[currentUser.role].icon}
              <span className="hidden md:inline font-bold">
                {isEn ? roleLabels[currentUser.role].en.split(" ")[0] : roleLabels[currentUser.role].ar.split(" ")[0]}
              </span>
            </button>

            {roleMenuOpen && (
              <div
                className="absolute left-0 sm:right-0 mt-2.5 w-60 rounded-2xl border border-slate-700/90 bg-[#090f20]/95 p-2 shadow-[0_15px_50px_rgba(0,0,0,0.9)] z-50 backdrop-blur-xl animate-in fade-in zoom-in-95"
                onMouseLeave={() => setRoleMenuOpen(false)}
              >
                <div className="px-3 py-1.5 text-[10px] uppercase font-bold tracking-wider text-slate-400 border-b border-slate-800">
                  {isEn ? "Select Role & Permissions" : "اختر الدور والصلاحيات"}
                </div>
                {(["admin", "instructor", "student", "parent"] as Role[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      onRoleChange(r);
                      setRoleMenuOpen(false);
                      if (r === "admin") onTabChange("admin");
                      if (r === "student") onTabChange("portal");
                    }}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-right transition-all cursor-pointer ${
                      currentUser.role === r ? "bg-cyan-500/20 text-[#00f0ff] font-bold border border-cyan-500/30" : "text-slate-300 hover:bg-slate-800/60"
                    }`}
                  >
                    {roleLabels[r].icon}
                    <span>{isEn ? roleLabels[r].en : roleLabels[r].ar}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Language Toggle */}
          <button
            onClick={onLanguageToggle}
            className="flex items-center gap-1 rounded-xl border border-slate-700/80 bg-slate-900/90 px-2.5 py-1.5 text-xs text-slate-200 hover:text-cyan-300 hover:border-cyan-400/60 hover:shadow-[0_0_12px_rgba(0,240,255,0.2)] transition-all cursor-pointer"
            title="تبديل اللغة / Toggle Language"
          >
            <Globe className="size-3.5 text-cyan-400" />
            <span className="font-mono font-bold uppercase">{isEn ? "عربي" : "EN"}</span>
          </button>

          {/* Notifications Bell */}
          <button
            onClick={onOpenNotifications}
            className="relative rounded-xl border border-slate-700/80 bg-slate-900/90 p-2 text-slate-300 hover:text-cyan-400 hover:border-cyan-400/60 hover:shadow-[0_0_15px_rgba(0,240,255,0.25)] transition-all cursor-pointer"
            title="التنبيهات الذكية وجدولة المراجعات"
          >
            <Bell className="size-4" />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-[#ec4899] text-[9px] font-bold text-white shadow-[0_0_10px_#ec4899] animate-pulse">
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
            className="xl:hidden rounded-xl border border-slate-700 bg-slate-900 p-2 text-slate-300 hover:text-white cursor-pointer"
          >
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-[#060a16] px-4 py-4 space-y-2">
          <button
            onClick={() => { onTabChange("home"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Home" : "الرئيسية"}
          </button>
          <button
            onClick={() => { onTabChange("courses"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Courses" : "الدورات المتاحة"}
          </button>
          <button
            onClick={() => { onOpenStudyPlan(); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-amber-300"
          >
            ✨ {isEn ? "AI Study Plan" : "خطة المذاكرة الذكية بالذكاء الاصطناعي"}
          </button>
          <button
            onClick={() => { onTabChange("simulator"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-cyan-300"
          >
            ⚛️ {isEn ? "Reactor Simulator" : "محاكي قلب المفاعل الحي"}
          </button>
          <button
            onClick={() => { onTabChange("instructor"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Eng. Mahmoud Page" : "صفحة المهندس محمود"}
          </button>
          <button
            onClick={() => { onTabChange("portal"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Student Portal & Lessons" : "بوابة الطالب والدروس"}
          </button>
          <button
            onClick={() => { onTabChange("booking"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-slate-200"
          >
            {isEn ? "Book Live Session" : "حجز جلسة مباشرة وفيديو"}
          </button>
          <button
            onClick={() => { onTabChange("admin"); setMobileMenuOpen(false); }}
            className="block w-full text-right py-2 text-sm font-medium text-pink-400"
          >
            🔒 {isEn ? "Admin & Permissions (Protected)" : "لوحة الإدارة والصلاحيات (محمية بكلمة سر)"}
          </button>
        </div>
      )}
    </header>
  );
}
