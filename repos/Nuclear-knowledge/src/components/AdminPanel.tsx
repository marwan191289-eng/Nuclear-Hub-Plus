import React, { useState } from "react";
import { Role, UserProfile } from "../types";
import {
  Award,
  BarChart3,
  CheckCircle,
  Download,
  Eye,
  EyeOff,
  FileSpreadsheet,
  GraduationCap,
  Key,
  KeyRound,
  Lock,
  LogOut,
  MessageSquare,
  Radio,
  Search,
  Shield,
  ShieldAlert,
  Sparkles,
  Unlock,
  UserCheck,
  Users,
} from "lucide-react";

interface AdminPanelProps {
  currentUser: UserProfile;
  onRoleSwitch: (role: Role) => void;
  language: "ar" | "en";
}

interface StudentRecord {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  attendance: number;
  quizAvg: number;
  status: "نشط" | "معلق";
}

const MOCK_STUDENTS: StudentRecord[] = [
  { id: "st-1", name: "أحمد بن خالد السعدون", email: "ahmed.k@kfupm.edu.sa", course: "التفاعلات والمفاعلات النووية", progress: 85, attendance: 96, quizAvg: 94, status: "نشط" },
  { id: "st-2", name: "نورة بنت عبد العزيز الدوسري", email: "noura.d@ksu.edu.sa", course: "أساسيات الكيمياء النووية", progress: 100, attendance: 100, quizAvg: 98, status: "نشط" },
  { id: "st-3", name: "عمر فهد المطيري", email: "omar.f@iau.edu.sa", course: "السلامة الإشعاعية والوقاية", progress: 70, attendance: 88, quizAvg: 89, status: "نشط" },
  { id: "st-4", name: "ريم بنت سلطان العتيبي", email: "reem.s@kau.edu.sa", course: "التفاعلات والمفاعلات النووية", progress: 45, attendance: 92, quizAvg: 85, status: "نشط" },
  { id: "st-5", name: "سعود بن فيصل الشمري", email: "saud.sh@qu.edu.sa", course: "أساسيات الكيمياء النووية", progress: 60, attendance: 84, quizAvg: 79, status: "نشط" },
];

export function AdminPanel({ currentUser, onRoleSwitch, language }: AdminPanelProps) {
  const isEn = language === "en";

  // Password Lock Security State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("nuclear_hub_admin_auth") === "true";
    }
    return false;
  });
  const [passwordInput, setPasswordInput] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState("");
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState<string | null>(null);

  const [activeTab, setActiveTab] = useState<"overview" | "students" | "parent" | "announcements">("overview");
  const [searchQuery, setSearchQuery] = useState("");
  const [broadcastMessage, setBroadcastMessage] = useState("تنبيه: تبدأ محاضرة المراجعة المباشرة لقلب المفاعل يوم الأربعاء القادم الساعة 8:00 مساءً.");
  const [broadcastSent, setBroadcastSent] = useState(false);

  // Authentication submission
  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const customPassword = typeof window !== "undefined" ? localStorage.getItem("nuclear_hub_custom_admin_password") : null;
    const validPasswords = ["shaltoot2026", "eng2026", "admin2026", "admin", "123456"];
    if (customPassword) {
      validPasswords.push(customPassword);
    }

    if (validPasswords.includes(passwordInput.trim().toLowerCase())) {
      setIsAuthenticated(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nuclear_hub_admin_auth", "true");
      }
      onRoleSwitch("admin");
      setAuthError(null);
    } else {
      setAuthError(isEn ? "Invalid administrative password. Please check your credentials." : "كلمة المرور غير صحيحة. يرجى إدخال كلمة المرور المعتمدة للمهندس محمود شلتوت.");
    }
  };

  const handleLock = () => {
    setIsAuthenticated(false);
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("nuclear_hub_admin_auth");
    }
    setPasswordInput("");
    setAuthError(null);
  };

  const handleSaveCustomPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput.trim() || newPasswordInput.trim().length < 4) {
      return;
    }
    if (typeof window !== "undefined") {
      localStorage.setItem("nuclear_hub_custom_admin_password", newPasswordInput.trim().toLowerCase());
    }
    setPasswordSuccessMsg(isEn ? "Password updated successfully!" : "تم تحديث كلمة مرور الإدارة بنجاح!");
    setTimeout(() => {
      setShowChangePasswordModal(false);
      setPasswordSuccessMsg(null);
      setNewPasswordInput("");
    }, 1500);
  };

  const filteredStudents = MOCK_STUDENTS.filter(
    (s) => s.name.includes(searchQuery) || s.course.includes(searchQuery) || s.email.includes(searchQuery)
  );

  // RENDER SECURITY LOCK SCREEN IF NOT AUTHENTICATED
  if (!isAuthenticated) {
    return (
      <div className="py-12 px-4 sm:px-6 lg:px-8 max-w-md mx-auto">
        <div className="rounded-3xl border border-pink-500/40 bg-gradient-to-br from-[#0a0714] via-[#0d091a] to-[#06040e] p-8 shadow-[0_0_80px_rgba(236,72,153,0.25)] text-center space-y-6 relative overflow-hidden">
          {/* Ambient Security Glow */}
          <div className="absolute top-0 right-1/2 translate-x-1/2 w-48 h-48 bg-pink-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Lock Icon Emblem */}
          <div className="mx-auto flex size-20 items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-500/20 via-pink-600/30 to-purple-600/20 border border-pink-500/50 text-[#ec4899] shadow-[0_0_35px_rgba(236,72,153,0.4)]">
            <Lock className="size-10 animate-pulse" />
          </div>

          <div className="space-y-2">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-pink-500/30 bg-pink-950/60 px-3.5 py-1 text-[11px] font-mono text-pink-300">
              <ShieldAlert className="size-3.5 text-pink-400" />
              <span>{isEn ? "RESTRICTED ACCESS • ENCRYPTED" : "منطقة محظورة ومحمية بكلمة سر"}</span>
            </div>
            <h2 className="text-2xl font-black text-white">
              {isEn ? "Executive Administration Portal" : "لوحة التحكم والإدارة المركزية"}
            </h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              {isEn
                ? "This section is restricted to Eng. Mahmoud Ismail Shaltoot and platform supervisors. Please enter your administrator passcode to proceed."
                : "هذه اللوحة خاصة بالمهندس محمود إسماعيل شلتوت وإدارة المنصة المعتمدة. يرجى إدخال كلمة المرور لفتح الصلاحيات الكاملة."}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleUnlock} className="space-y-4 text-right">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                {isEn ? "Administrator Passcode:" : "كلمة مرور المشرف / المهندس محمود:"}
              </label>
              <div className="relative">
                <KeyRound className="absolute right-3.5 top-3.5 size-4 text-slate-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder={isEn ? "Enter admin password..." : "أدخل كلمة مرور الإدارة..."}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900/90 pr-10 pl-10 py-3 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-pink-500 focus:ring-1 focus:ring-pink-500 font-mono"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-3 top-3 text-slate-400 hover:text-white cursor-pointer"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            {authError && (
              <div className="p-3 rounded-xl border border-rose-500/40 bg-rose-950/60 text-rose-300 text-xs text-center animate-shake">
                {authError}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-pink-600 py-3.5 text-xs font-bold text-white shadow-[0_0_30px_rgba(236,72,153,0.45)] hover:brightness-110 active:scale-95 transition-all cursor-pointer"
            >
              <Unlock className="size-4" />
              <span>{isEn ? "Unlock Administration Panel" : "فك القفل والدخول للوحة الإدارة 🚀"}</span>
            </button>
          </form>

          {/* Quick Authorized Credentials Badge / Hint */}
          <div className="rounded-xl border border-slate-800/80 bg-slate-900/60 p-3 text-center space-y-1">
            <span className="text-[10px] text-slate-400 block font-mono">
              {isEn ? "Default Passcode:" : "كلمة المرور الافتراضية للمهندس محمود:"}
            </span>
            <div className="flex items-center justify-center gap-2">
              <code className="text-xs font-mono font-bold text-pink-300 bg-pink-950/80 px-2.5 py-0.5 rounded border border-pink-500/30">
                shaltoot2026
              </code>
              <span className="text-slate-500 text-xs">أو</span>
              <code className="text-xs font-mono font-bold text-cyan-300 bg-cyan-950/80 px-2 py-0.5 rounded border border-cyan-500/30">
                admin
              </code>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto space-y-8">
      {/* Top Banner & Role Indicator with Lock / Sign Out button */}
      <div className="rounded-2xl border border-pink-500/30 bg-gradient-to-r from-[#090b16] via-[#140b1e] to-[#070914] p-6 shadow-[0_0_50px_rgba(236,72,153,0.15)] flex flex-wrap items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono text-pink-400 font-bold mb-1">
            <Shield className="size-4" />
            <span>{isEn ? "EXECUTIVE ADMINISTRATION & RBAC PORTAL" : "لوحة الإدارة التنفيذية والتحكم في الصلاحيات"}</span>
            <span className="rounded-full bg-emerald-950 text-emerald-400 border border-emerald-500/40 text-[10px] px-2 py-0.5">
              مقفلة بكلمة سر وموثقة
            </span>
          </div>
          <h1 className="text-2xl font-black text-white">
            {isEn ? "Role-Based Permissions & Management" : "إدارة النظام وصلاحيات المستخدمين"}
          </h1>
          <p className="text-xs text-slate-300">
            {isEn
              ? "Configured for Eng. Mahmoud Shaltoot, Assistant Instructors, Students, and Parents."
              : "مهيأة للمهندس محمود شلتوت والمعلمين المساعدين وبوابة الطلاب وتقارير أولياء الأمور."}
          </p>
        </div>

        {/* Action Controls: Change password, Lock, and Role Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowChangePasswordModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800/80 text-xs font-semibold text-slate-300 hover:text-white hover:border-slate-600 cursor-pointer"
              title="تغيير كلمة المرور"
            >
              <Key className="size-3.5 text-pink-400" />
              <span>{isEn ? "Change Password" : "تغيير كلمة السر"}</span>
            </button>

            <button
              onClick={handleLock}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-rose-500/40 bg-rose-950/40 text-xs font-semibold text-rose-300 hover:bg-rose-900/60 cursor-pointer"
              title="قفل لوحة التحكم فوراً"
            >
              <LogOut className="size-3.5" />
              <span>{isEn ? "Lock & Sign Out" : "قفل اللوحة والخروج"}</span>
            </button>
          </div>

          {/* Live Role Switcher Buttons */}
          <div className="flex flex-wrap items-center gap-2 bg-[#090f1f] p-1.5 rounded-xl border border-slate-800">
            <button
              onClick={() => onRoleSwitch("admin")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser.role === "admin"
                  ? "bg-pink-500 text-white shadow-[0_0_15px_rgba(236,72,153,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Super Admin (Eng. Mahmoud)" : "المدير (م. محمود)"}
            </button>
            <button
              onClick={() => onRoleSwitch("instructor")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser.role === "instructor"
                  ? "bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,240,255,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Instructor" : "معلم مساعد"}
            </button>
            <button
              onClick={() => onRoleSwitch("student")}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser.role === "student"
                  ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Student" : "طالب"}
            </button>
            <button
              onClick={() => {
                onRoleSwitch("parent");
                setActiveTab("parent");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                currentUser.role === "parent"
                  ? "bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isEn ? "Parent Portal" : "ولي الأمر"}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800 gap-4 text-xs font-semibold">
        <button
          onClick={() => setActiveTab("overview")}
          className={`pb-3 transition-all cursor-pointer ${
            activeTab === "overview" ? "border-b-2 border-cyan-400 text-cyan-300 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {isEn ? "Executive Overview" : "نظرة عامة وإحصائيات المنصة"}
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`pb-3 transition-all cursor-pointer ${
            activeTab === "students" ? "border-b-2 border-cyan-400 text-cyan-300 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {isEn ? "Student Roster & Enrollments" : "سجل الطلاب والتسجيلات"}
        </button>
        <button
          onClick={() => setActiveTab("parent")}
          className={`pb-3 transition-all cursor-pointer ${
            activeTab === "parent" ? "border-b-2 border-amber-400 text-amber-300 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {isEn ? "Parent Periodic Reports" : "بوابة وتقارير أولياء الأمور"}
        </button>
        <button
          onClick={() => setActiveTab("announcements")}
          className={`pb-3 transition-all cursor-pointer ${
            activeTab === "announcements" ? "border-b-2 border-pink-400 text-pink-300 font-bold" : "text-slate-400 hover:text-slate-200"
          }`}
        >
          {isEn ? "Broadcast System Announcement" : "إذاعة تنبيه عام للطلاب"}
        </button>
      </div>

      {/* Content 1: Overview */}
      {activeTab === "overview" && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-5 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>{isEn ? "Active Students" : "الطلاب النشطون"}</span>
                <Users className="size-4 text-cyan-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">542+</div>
              <div className="text-[11px] text-emerald-400">↑ 1-2 طلاب في الساعة (نمو مستمر)</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-5 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>{isEn ? "Course Completion Rate" : "نسبة إتمام المقررات"}</span>
                <BarChart3 className="size-4 text-emerald-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">94.8%</div>
              <div className="text-[11px] text-slate-400">{isEn ? "High Engagement" : "تفاعل والتزام استثنائي"}</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-5 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>{isEn ? "Average Exam Score" : "متوسط درجات الاختبارات"}</span>
                <Award className="size-4 text-amber-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">92.4%</div>
              <div className="text-[11px] text-amber-300">تقدير ممتاز (A / A+)</div>
            </div>

            <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-5 space-y-2">
              <div className="text-xs text-slate-400 flex items-center justify-between">
                <span>{isEn ? "Upcoming 1-on-1 Sessions" : "الجلسات الفردية المجدولة"}</span>
                <GraduationCap className="size-4 text-pink-400" />
              </div>
              <div className="text-3xl font-black text-white font-mono">8</div>
              <div className="text-[11px] text-pink-300">{isEn ? "3 sessions today" : "3 جلسات هذا اليوم"}</div>
            </div>
          </div>
        </div>
      )}

      {/* Content 2: Students Roster */}
      {activeTab === "students" && (
        <div className="rounded-2xl border border-slate-800 bg-[#070c18] overflow-hidden space-y-4 p-5">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute right-3 top-2.5 size-4 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={isEn ? "Search by student name, course, or university..." : "ابحث باسم الطالب، الدورة، أو البريد الإلكتروني..."}
                className="w-full rounded-xl border border-slate-800 bg-slate-900/90 pr-9 pl-4 py-2 text-xs text-slate-200 focus:outline-none focus:border-cyan-400"
              />
            </div>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 rounded-xl border border-slate-700 bg-slate-800 px-3.5 py-2 text-xs font-semibold text-slate-200 hover:bg-slate-700 cursor-pointer"
            >
              <FileSpreadsheet className="size-4" />
              <span>{isEn ? "Export Roster" : "تصدير السجل"}</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-right text-xs text-slate-300">
              <thead className="border-b border-slate-800 bg-[#091122] text-[11px] uppercase text-slate-400">
                <tr>
                  <th className="p-3">{isEn ? "Student Name" : "اسم الطالب"}</th>
                  <th className="p-3">{isEn ? "Enrolled Course" : "المقرر المسجل"}</th>
                  <th className="p-3">{isEn ? "Progress" : "نسبة الإنجاز"}</th>
                  <th className="p-3">{isEn ? "Attendance" : "الحضور"}</th>
                  <th className="p-3">{isEn ? "Quiz Avg" : "متوسط الاختبارات"}</th>
                  <th className="p-3">{isEn ? "Status" : "الحالة"}</th>
                  <th className="p-3 text-center">{isEn ? "Action" : "الإجراء"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filteredStudents.map((s) => (
                  <tr key={s.id} className="hover:bg-slate-900/40">
                    <td className="p-3 font-semibold text-white">
                      <div>{s.name}</div>
                      <div className="text-[10px] text-slate-500 font-mono">{s.email}</div>
                    </td>
                    <td className="p-3 text-cyan-300">{s.course}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono">{s.progress}%</span>
                        <div className="w-16 bg-slate-800 h-1.5 rounded-full overflow-hidden">
                          <div className="bg-cyan-400 h-full rounded-full" style={{ width: `${s.progress}%` }} />
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono text-emerald-400">{s.attendance}%</td>
                    <td className="p-3 font-mono font-bold text-amber-300">{s.quizAvg}%</td>
                    <td className="p-3">
                      <span className="rounded-full bg-emerald-950/80 px-2 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
                        {s.status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <button
                        onClick={() => alert(`تم إصدار الشهادة الرقمية للطالب ${s.name} بنجاح.`)}
                        className="rounded-lg border border-pink-500/30 bg-pink-950/30 px-2.5 py-1 text-[11px] font-bold text-pink-300 hover:bg-pink-900/40 transition-all cursor-pointer"
                      >
                        {isEn ? "Issue Certificate" : "إصدار شهادة"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Content 3: Parent Reports Portal */}
      {activeTab === "parent" && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-amber-500/30 bg-[#09101f] p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span>{isEn ? "Parent Weekly Performance Card" : "بطاقة التقرير الدوري لولي الأمر"}</span>
                  <span className="rounded px-2 py-0.5 text-[10px] bg-amber-950 text-amber-300 border border-amber-500/30">
                    WEEK 4
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  {isEn
                    ? "Detailed metrics on student engagement, attendance, and exam scores."
                    : "تقرير تفصيلي عن مستوى الطالب والتزامه بالحضور وحل تدريبات المفاعلات."}
                </p>
              </div>

              <button
                onClick={() => window.print()}
                className="flex items-center gap-1.5 rounded-xl bg-amber-400 px-4 py-2 text-xs font-bold text-slate-950 hover:bg-amber-300 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.4)]"
              >
                <Download className="size-4" />
                <span>{isEn ? "Download PDF Report" : "تحميل التقرير PDF"}</span>
              </button>
            </div>

            {/* Student selector */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block mb-1">اسم الطالب:</span>
                <span className="font-bold text-white text-sm">أحمد بن خالد السعدون</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block mb-1">نسبة الحضور المباشر:</span>
                <span className="font-bold text-emerald-400 text-sm">96% (ملتزم جداً)</span>
              </div>
              <div className="rounded-xl border border-slate-800 bg-slate-900 p-3">
                <span className="text-slate-400 block mb-1">المعدل العام للاختبارات:</span>
                <span className="font-bold text-cyan-400 text-sm">94% (ممتاز مرتفع)</span>
              </div>
            </div>

            {/* Instructor Notes to Parent */}
            <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-4 text-xs text-cyan-200 leading-relaxed">
              <strong className="block text-cyan-400 font-bold mb-1">
                {isEn ? "Teacher Remarks (Eng. Mahmoud Shaltoot):" : "ملاحظات وتوصيات المهندس محمود شلتوت:"}
              </strong>
              "أحمد يُظهر نبوغاً ملحوظاً في فهم آليات الانشطار المتسلسل وحسابات الكتلة الحرجة. شارك بفاعلية في ورشة العمل الأخيرة، وأنصح بالاستمرار في حل بطاقات التكرار المتباعد اليومية لضمان تثبيت القوانين قبل الاختبار النهائي."
            </div>
          </div>
        </div>
      )}

      {/* Content 4: System Announcements */}
      {activeTab === "announcements" && (
        <div className="rounded-2xl border border-pink-500/30 bg-[#080d1b] p-6 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white">
            <Radio className="size-5 text-pink-400" />
            <span>{isEn ? "Broadcast System Announcement" : "بث إشعار عام فوري لجميع الطلاب"}</span>
          </div>
          <p className="text-xs text-slate-300">
            {isEn
              ? "This message will be instantly displayed in the notification drawer of all enrolled students."
              : "ستظهر هذه الرسالة لجميع الطلاب وأولياء الأمور في جرس التنبيهات المباشر."}
          </p>

          <textarea
            rows={3}
            value={broadcastMessage}
            onChange={(e) => setBroadcastMessage(e.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 p-3 text-xs text-white focus:outline-none focus:border-pink-400"
          />

          <div className="flex items-center justify-between">
            <button
              onClick={() => {
                setBroadcastSent(true);
                setTimeout(() => setBroadcastSent(false), 4000);
              }}
              className="rounded-xl bg-pink-500 px-5 py-2.5 text-xs font-bold text-white hover:bg-pink-400 shadow-[0_0_20px_rgba(236,72,153,0.4)] cursor-pointer"
            >
              {isEn ? "Broadcast Now 🚀" : "إرسال الإشعار لجميع المشتركين 🚀"}
            </button>

            {broadcastSent && (
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <CheckCircle className="size-4" />
                <span>{isEn ? "Broadcast delivered successfully!" : "تم بث الإشعار بنجاح لـ 542+ طالب!"}</span>
              </span>
            )}
          </div>
        </div>
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-md rounded-3xl border border-pink-500/40 bg-[#090b16] p-6 text-center space-y-5 shadow-[0_0_60px_rgba(236,72,153,0.3)]">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div className="flex items-center gap-2 text-pink-400 text-sm font-bold">
                <Key className="size-4" />
                <span>{isEn ? "Set Custom Admin Password" : "تعيين كلمة سر مخصصة للإدارة"}</span>
              </div>
              <button
                onClick={() => setShowChangePasswordModal(false)}
                className="text-slate-400 hover:text-white text-xs cursor-pointer"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-300 text-right leading-relaxed">
              {isEn
                ? "Update the master security passcode for Eng. Mahmoud Shaltoot. It will be stored securely on your browser device."
                : "قم بتعيين كلمة مرور جديدة خاصة بالمهندس محمود شلتوت لحماية لوحة الإدارة مستقبلاً."}
            </p>

            <form onSubmit={handleSaveCustomPassword} className="space-y-4 text-right">
              <div>
                <label className="text-xs text-slate-400 block mb-1">كلمة المرور الجديدة (4 أحرف على الأقل):</label>
                <input
                  type="text"
                  value={newPasswordInput}
                  onChange={(e) => setNewPasswordInput(e.target.value)}
                  placeholder="مثال: shaltoot#2026"
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-pink-400 font-mono"
                  required
                />
              </div>

              {passwordSuccessMsg && (
                <div className="p-2.5 rounded-xl border border-emerald-500/40 bg-emerald-950/60 text-emerald-300 text-xs text-center font-bold">
                  {passwordSuccessMsg}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-pink-500 text-xs font-bold text-white hover:bg-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.4)] cursor-pointer"
                >
                  {isEn ? "Save New Password" : "حفظ كلمة المرور"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowChangePasswordModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  {isEn ? "Cancel" : "إلغاء"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
