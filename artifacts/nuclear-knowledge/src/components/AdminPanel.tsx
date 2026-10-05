import React, { useEffect, useState } from "react";
import { Role, UserProfile } from "../types";
import { appPath } from "../lib/app-path";
import { AlertCircle, BookOpen, Eye, EyeOff, GraduationCap, Languages, LockKeyhole, LogOut, RefreshCw, Search, ShieldCheck, Users } from "lucide-react";

interface AdminPanelProps {
  currentUser: UserProfile;
  onRoleSwitch: (role: Role, identity?: Partial<Pick<UserProfile, "id" | "name" | "email">>) => void;
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
  status: string;
}
interface StatsResponse {
  studentsCount: number;
  baseDisplay: string;
  lastHourIncrease: number;
  nextIncrementMinutes: number;
  coursesCount: number;
  experienceYears: string;
}
interface ParentReport {
  studentName: string;
  attendance: number;
  quizAvg: number;
  week: number;
  remarks: string;
  recommendations: string[];
}
interface ManagedAccount {
  id: string;
  name: string;
  email: string;
  role: Role;
  disabled: boolean;
  createdAt?: string;
}

const copy = {
  ar: {
    title: "إدارة المنصة", eyebrow: "إدارة أكاديمية آمنة", intro: "مساحة تشغيلية للمشرفين المعتمدين. بيانات الإدارة والصلاحيات محمية بجلسة موثقة من الخادم.",
    loginTitle: "تسجيل دخول المشرف", login: "كلمة المرور", unlock: "متابعة آمنة", locked: "التحقق من حالة الجلسة…", checking: "جارٍ التحقق من جلسة الإدارة",
    loginError: "تعذر تسجيل الدخول. تحقق من كلمة المرور وحاول مجدداً.", sessionError: "تعذر التحقق من جلسة الإدارة. أعد المحاولة.",
    signout: "تسجيل الخروج", overview: "نظرة عامة", students: "سجل الطلاب", future: "هذه المساحة غير متاحة حالياً",
    futureNote: "لا توجد واجهة خادم لهذه الميزة حتى الآن؛ لن يتم عرض بيانات تجريبية أو الإيحاء بإرسالها.",
    search: "ابحث بالاسم أو البريد أو المقرر", name: "الطالب", course: "المقرر", progress: "التقدم", attendance: "الحضور", score: "متوسط الاختبارات", status: "الحالة",
    empty: "لا توجد سجلات طلاب لعرضها.", statsError: "تعذر تحميل الإحصاءات.", studentsError: "تعذر تحميل سجل الطلاب.",
    studentsCount: "تقدير عدد المتعلمين", coursesCount: "المقررات المتاحة", languages: "لغات المنصة", experience: "سنوات الخبرة",
    roleNotice: "التسجيل العام ينشئ حساب طالب فقط. يمنح المهندس صلاحية الإدارة، ويمكن للمشرفين إدارة أدوار الفريق من سجل الحسابات.", retry: "إعادة المحاولة", show: "إظهار كلمة المرور", hide: "إخفاء كلمة المرور",
    loading: "جارٍ تحميل بيانات الطلاب…", noMatch: "لا توجد نتائج مطابقة.",
    accounts: "الحسابات والصلاحيات", accountIntro: "حسابات مسجلة فعلياً في المنصة. يراجع المهندس والمشرف صلاحيات الفريق هنا.",
    role: "الدور", created: "تاريخ التسجيل", roleSaved: "تم تحديث الصلاحية.", roleError: "تعذر تحديث الصلاحية.", accountEmpty: "لا توجد حسابات مسجلة بعد.",
    accountsError: "تعذر تحميل الحسابات المسجلة.",
    roles: { admin: "مشرف", instructor: "مدرّب", student: "طالب", parent: "ولي أمر" }
  },
  en: {
    title: "Platform administration", eyebrow: "Secure academic operations", intro: "A working space for authorized supervisors. Student records stay hidden until the server confirms an authenticated session.",
    loginTitle: "Administrator sign in", login: "Password", unlock: "Continue securely", locked: "Checking session…", checking: "Verifying administrator session",
    loginError: "Sign-in failed. Check the password and try again.", sessionError: "Could not verify the administrator session. Please retry.",
    signout: "Sign out", overview: "Overview", students: "Student roster", future: "This workspace is not available yet",
    futureNote: "There is no server interface for this feature yet; no sample data will be shown and no delivery will be implied.",
    search: "Search name, email, or course", name: "Student", course: "Course", progress: "Progress", attendance: "Attendance", score: "Quiz average", status: "Status",
    empty: "There are no student records to display.", statsError: "Could not load platform statistics.", studentsError: "Could not load the student roster.",
    studentsCount: "Estimated learners", coursesCount: "Available courses", languages: "Interface languages", experience: "Years of experience",
    roleNotice: "Public sign-ups create student accounts only. The system engineer grants administrator access; administrators can manage team roles from the accounts list.", retry: "Try again", show: "Show password", hide: "Hide password",
    loading: "Loading student records…", noMatch: "No matching records.",
    accounts: "Accounts & permissions", accountIntro: "Real registered accounts. The system engineer and administrators can manage team permissions here.",
    role: "Role", created: "Joined", roleSaved: "Role updated.", roleError: "Could not update the role.", accountEmpty: "No registered accounts yet.",
    accountsError: "Could not load registered accounts.",
    roles: { admin: "Administrator", instructor: "Instructor", student: "Student", parent: "Parent" }
  }
} as const;

export function AdminPanel({ onRoleSwitch, language }: AdminPanelProps) {
  const t = copy[language];
  const [auth, setAuth] = useState<"checking" | "locked" | "authenticated" | "error">("checking");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [active, setActive] = useState<"overview" | "students" | "accounts" | "parent" | "announcements">("overview");
  const [stats, setStats] = useState<StatsResponse | null>(null);
  const [statsError, setStatsError] = useState(false);
  const [parentReport, setParentReport] = useState<ParentReport | null>(null);
  const [parentReportState, setParentReportState] = useState<"loading" | "ready" | "error">("loading");
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [studentsState, setStudentsState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [query, setQuery] = useState("");
  const [studentsRefresh, setStudentsRefresh] = useState(0);
  const [statsRefresh, setStatsRefresh] = useState(0);
  const [parentRefresh, setParentRefresh] = useState(0);
  const [accounts, setAccounts] = useState<ManagedAccount[]>([]);
  const [accountsState, setAccountsState] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [accountsRefresh, setAccountsRefresh] = useState(0);
  const [updatingAccountId, setUpdatingAccountId] = useState<string | null>(null);

  const verifySession = async () => {
    setAuth("checking");
    setMessage("");
    try {
      const response = await fetch(appPath("/api/admin/session"), { credentials: "include" });
      if (!response.ok) throw new Error("session");
      const data = await response.json() as {
        authenticated: boolean;
        user?: { id: string; name: string; email: string; role: Role };
      };
      onRoleSwitch(data.authenticated ? "admin" : "student", data.user);
      setAuth(data.authenticated ? "authenticated" : "locked");
    } catch {
      setAuth("error");
      setMessage(t.sessionError);
    }
  };
  useEffect(() => { void verifySession(); }, []);

  useEffect(() => {
    if (auth !== "authenticated") {
      setStudents([]);
      setStudentsState("idle");
      return;
    }
    const controller = new AbortController();
    setStudentsState("loading");
    fetch(appPath("/api/admin/students"), { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          setStudents([]);
          void verifySession();
          throw new Error("unauthorized");
        }
        if (!response.ok) throw new Error("students");
        return response.json() as Promise<StudentRecord[]>;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setStudents(Array.isArray(data) ? data : []);
          setStudentsState("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setStudentsState("error");
      });
    return () => controller.abort();
  }, [auth, studentsRefresh]);

  useEffect(() => {
    if (auth !== "authenticated") return;
    const controller = new AbortController();
    fetch(appPath("/api/stats"), { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("stats");
        return response.json() as Promise<StatsResponse>;
      })
      .then(setStats)
      .catch(() => { if (!controller.signal.aborted) setStatsError(true); });
    return () => controller.abort();
  }, [auth, statsRefresh]);

  useEffect(() => {
    if (auth !== "authenticated") {
      setParentReport(null);
      return;
    }
    const controller = new AbortController();
    setParentReportState("loading");
    fetch(appPath("/api/admin/parent-report"), { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (response.status === 401 || response.status === 403) {
          setParentReport(null);
          void verifySession();
          throw new Error("unauthorized");
        }
        if (!response.ok) throw new Error("parent_report");
        return response.json() as Promise<ParentReport>;
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setParentReport(data);
          setParentReportState("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setParentReportState("error");
      });
    return () => controller.abort();
  }, [auth, parentRefresh]);

  useEffect(() => {
    if (auth !== "authenticated" || active !== "accounts") return;
    const controller = new AbortController();
    setAccountsState("loading");
    fetch(appPath("/api/admin/users"), {
      credentials: "include",
      signal: controller.signal,
    })
      .then(async (response) => {
        if (!response.ok) throw new Error("accounts");
        return (await response.json()) as ManagedAccount[];
      })
      .then((data) => {
        if (!controller.signal.aborted) {
          setAccounts(Array.isArray(data) ? data : []);
          setAccountsState("ready");
        }
      })
      .catch(() => {
        if (!controller.signal.aborted) setAccountsState("error");
      });
    return () => controller.abort();
  }, [auth, active, accountsRefresh]);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!password.trim() || busy) return;
    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(appPath("/api/admin/login"), {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password })
      });
      if (!response.ok) throw new Error("login");
      const data = await response.json() as {
        authenticated: boolean;
        user?: { id: string; name: string; email: string; role: Role };
      };
      if (!data.authenticated) throw new Error("login");
      onRoleSwitch("admin", data.user);
      setPassword("");
      setAuth("authenticated");
    } catch {
      setMessage(t.loginError);
    } finally {
      setBusy(false);
    }
  };
  const handleSignOut = async () => {
    setAuth("locked");
    setStudents([]);
    setStats(null);
    onRoleSwitch("student");
    setPassword("");
    setMessage("");
    try {
      const response = await fetch(appPath("/api/admin/logout"), { method: "POST", credentials: "include" });
      if (!response.ok) await verifySession();
    } catch {
      await verifySession();
    }
  };
  const handleAccountRoleChange = async (accountId: string, role: Role) => {
    setUpdatingAccountId(accountId);
    try {
      const response = await fetch(appPath(`/api/admin/users/${encodeURIComponent(accountId)}/role`), {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role }),
      });
      if (!response.ok) throw new Error("role_update");
      const data = (await response.json()) as { user: ManagedAccount };
      setAccounts((existing) => existing.map((account) =>
        account.id === accountId ? { ...account, ...data.user } : account
      ));
      setMessage(t.roleSaved);
    } catch {
      setMessage(t.roleError);
    } finally {
      setUpdatingAccountId(null);
    }
  };
  const filteredStudents = students.filter((student) =>
    [student.name, student.email, student.course].some((value) => String(value ?? "").toLocaleLowerCase().includes(query.toLocaleLowerCase()))
  );

  if (auth === "checking") return (
    <section className="mx-auto max-w-5xl px-5 py-20" aria-live="polite">
      <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white/70 p-6">
        <div className="size-8 animate-pulse rounded-full bg-emerald-100" />
        <p className="text-sm text-slate-600">{t.checking}</p>
      </div>
    </section>
  );

  if (auth !== "authenticated") return (
    <section className="mx-auto max-w-5xl px-5 py-14" dir={language === "ar" ? "rtl" : "ltr"}>
      <div className="mx-auto max-w-lg overflow-hidden rounded-[28px] border border-[#d8ded6] bg-[#fffefa] shadow-[0_24px_80px_rgba(28,52,46,.10)]">
        <div className="border-b border-[#e5e8e1] px-8 py-7">
          <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#e8f0e9] text-[#3c756a]"><LockKeyhole size={22} /></div>
          <p className="text-xs font-bold uppercase tracking-[.18em] text-[#a4694f]">{t.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold text-[#1b302b]">{t.loginTitle}</h1>
          <p className="mt-3 text-sm leading-7 text-[#65746e]">{t.intro}</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-5 px-8 py-7">
          {auth === "error" && <div role="alert" className="flex items-start gap-2 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertCircle size={18} />{message}</div>}
          <label htmlFor="admin-password" className="block text-sm font-semibold text-[#30443e]">{t.login}</label>
          <div className="relative">
            <input id="admin-password" type={passwordVisible ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" required className="w-full rounded-xl border border-[#d9ded6] bg-[#fbfaf6] px-4 py-3 pe-12 text-sm text-[#20352f] placeholder:text-[#9aa59d] focus:border-[#6c9b8d] focus:outline-none focus:ring-2 focus:ring-[#6c9b8d]/20" />
            <button type="button" aria-label={passwordVisible ? t.hide : t.show} onClick={() => setPasswordVisible(!passwordVisible)} className="absolute inset-y-0 end-0 flex items-center px-4 text-[#60716d] hover:text-[#234e43]">
              {passwordVisible ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {message && auth !== "error" && <p role="alert" className="text-sm text-rose-700">{message}</p>}
          {auth === "error" && <button type="button" onClick={verifySession} className="w-full text-sm font-semibold text-[#397265] underline underline-offset-4">{t.retry}</button>}
          <button type="submit" disabled={busy} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#275b50] px-5 py-3.5 text-sm font-bold text-white transition hover:bg-[#1f4c43] disabled:cursor-wait disabled:opacity-60">
            {busy ? <span>{t.locked}</span> : <><ShieldCheck size={17} />{t.unlock}</>}
          </button>
        </form>
      </div>
    </section>
  );

  return (
    <section className="mx-auto max-w-[1240px] space-y-8 px-5 py-12 lg:px-8" dir={language === "ar" ? "rtl" : "ltr"}>
      <header className="flex flex-wrap items-start justify-between gap-5 border-b border-[#d8ded6] pb-7">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-[.18em] text-[#a4694f]"><ShieldCheck size={15} />{t.eyebrow}</p>
          <h1 className="text-3xl font-bold tracking-tight text-[#1b302b] sm:text-4xl">{t.title}</h1>
          <p className="mt-3 max-w-2xl text-sm leading-7 text-[#65746e]">{t.intro}</p>
        </div>
        <button onClick={handleSignOut} className="inline-flex items-center gap-2 rounded-xl border border-[#d8ded6] bg-white px-4 py-2.5 text-sm font-semibold text-[#425c53] transition hover:border-[#ad7358] hover:text-[#9b5c44]">
          <LogOut size={16} />{t.signout}
        </button>
      </header>
      <div className="flex flex-wrap gap-2 border-b border-[#d8ded6]" role="tablist" aria-label={t.title}>
        {(["overview", "students", "accounts", "parent", "announcements"] as const).map((tab) => (
          <button key={tab} role="tab" aria-selected={active === tab} onClick={() => setActive(tab)} className={`border-b-2 px-4 py-3 text-sm font-semibold transition ${active === tab ? "border-[#347b70] text-[#285e53]" : "border-transparent text-[#77847e] hover:text-[#304c43]"}`}>
            {tab === "overview" ? t.overview : tab === "students" ? t.students : tab === "accounts" ? t.accounts : tab === "parent" ? (language === "ar" ? "تقارير أولياء الأمور" : "Parent reports") : (language === "ar" ? "الإعلانات" : "Announcements")}
          </button>
        ))}
      </div>
      {active === "overview" && (
        <div>
          {statsError ? <div role="alert" className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900"><AlertCircle size={18} />{t.statsError}<button onClick={() => { setStatsError(false); setStatsRefresh((value) => value + 1); }} className="ms-auto underline">{t.retry}</button></div> : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {[
                { label: t.studentsCount, value: stats?.studentsCount, icon: Users },
                { label: t.coursesCount, value: stats?.coursesCount, icon: BookOpen },
                { label: t.languages, value: "AR + EN", icon: Languages },
                { label: t.experience, value: stats?.experienceYears, icon: GraduationCap }
              ].map(({ label, value, icon: Icon }) => (
                <article key={label} className="rounded-2xl border border-[#dce1d9] bg-[#fffefa] p-5 shadow-[0_8px_24px_rgba(34,59,49,.04)]">
                  <div className="flex items-center justify-between text-sm text-[#6b7b73]"><span>{label}</span><Icon size={17} className="text-[#668e7f]" /></div>
                  {value === undefined ? <div className="mt-4 h-8 w-24 animate-pulse rounded bg-[#e8ece5]" /> : <div className="mt-3 font-mono text-3xl font-bold tracking-tight text-[#203b33]" dir="auto">{value}</div>}
                </article>
              ))}
            </div>
          )}
          <p className="mt-6 rounded-xl bg-[#e9eee7] px-4 py-3 text-xs leading-6 text-[#61726a]">{t.roleNotice}</p>
        </div>
      )}
      {active === "students" && (
        <div className="overflow-hidden rounded-2xl border border-[#dce1d9] bg-[#fffefa]">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#e7e9e3] p-5">
            <div><h2 className="text-lg font-bold text-[#203b33]">{t.students}</h2><p className="mt-1 text-xs text-[#728078]">{language === "ar" ? "سجلات عيّنة للمعاينة — غير محفوظة ولا تمثل بيانات مباشرة." : "Sample records for preview — not persisted or live data."}</p></div>
            <label className="relative w-full sm:max-w-sm"><Search size={16} className="absolute start-3 top-3 text-[#85928a]" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder={t.search} className="w-full rounded-xl border border-[#d9ded6] bg-[#fbfaf6] py-2.5 ps-9 pe-3 text-sm text-[#263d35] placeholder:text-[#99a49d]" /></label>
          </div>
          {studentsState === "loading" ? <div aria-live="polite" className="space-y-3 p-6"><div className="h-4 w-44 animate-pulse rounded bg-[#e8ece5]" /><div className="h-20 animate-pulse rounded-xl bg-[#f0f1eb]" /><p className="text-sm text-[#718078]">{t.loading}</p></div>
            : studentsState === "error" ? <div role="alert" className="flex items-center gap-3 p-6 text-sm text-rose-800"><AlertCircle size={18} />{t.studentsError}<button onClick={() => setStudentsRefresh((value) => value + 1)} className="ms-auto underline">{t.retry}</button></div>
              : filteredStudents.length === 0 ? <div className="px-6 py-14 text-center text-sm text-[#718078]">{students.length ? t.noMatch : t.empty}</div>
                : <div className="overflow-x-auto"><table className="w-full min-w-[760px] text-start text-sm"><thead className="bg-[#f3f4ee] text-xs text-[#65766e]"><tr>{[t.name,t.course,t.progress,t.attendance,t.score,t.status].map((heading) => <th key={heading} className="px-4 py-3 text-start font-semibold">{heading}</th>)}</tr></thead>
                  <tbody className="divide-y divide-[#eceee8]">{filteredStudents.map((student) => <tr key={student.id} className="hover:bg-[#fbfaf6]"><td className="px-4 py-4"><div className="font-semibold text-[#243d34]">{student.name}</div><div className="mt-1 font-mono text-xs text-[#829087]" dir="ltr">{student.email}</div></td><td className="px-4 py-4 text-[#4e6e62]">{student.course}</td><td className="px-4 py-4 font-mono">{student.progress}%</td><td className="px-4 py-4 font-mono">{student.attendance}%</td><td className="px-4 py-4 font-mono">{student.quizAvg}%</td><td className="px-4 py-4">{student.status}</td></tr>)}</tbody>
                </table></div>}
        </div>
      )}
      {active === "accounts" && (
        <section className="overflow-hidden rounded-2xl border border-[#dce1d9] bg-[#fffefa]">
          <header className="border-b border-[#e7e9e3] p-5">
            <h2 className="text-lg font-bold text-[#203b33]">{t.accounts}</h2>
            <p className="mt-1 text-xs leading-6 text-[#728078]">{t.accountIntro}</p>
            {message && <p role="status" className="mt-3 text-sm text-[#347b70]">{message}</p>}
          </header>
          {accountsState === "loading" ? (
            <p className="p-6 text-sm text-[#718078]" role="status">{t.loading}</p>
          ) : accountsState === "error" ? (
            <div className="flex items-center gap-3 p-6 text-sm text-rose-800" role="alert">
              <AlertCircle size={18} />{t.accountsError}
              <button type="button" onClick={() => setAccountsRefresh((value) => value + 1)} className="ms-auto underline">{t.retry}</button>
            </div>
          ) : accounts.length === 0 ? (
            <p className="px-6 py-14 text-center text-sm text-[#718078]">{t.accountEmpty}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] text-start text-sm">
                <thead className="bg-[#f3f4ee] text-xs text-[#65766e]">
                  <tr>
                    {[t.name, t.role, t.created].map((heading) => <th key={heading} className="px-4 py-3 text-start font-semibold">{heading}</th>)}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eceee8]">
                  {accounts.map((account) => (
                    <tr key={account.id} className="hover:bg-[#fbfaf6]">
                      <td className="px-4 py-4">
                        <div className="font-semibold text-[#243d34]">{account.name}</div>
                        <div className="mt-1 font-mono text-xs text-[#829087]" dir="ltr">{account.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <select
                          aria-label={`${t.role}: ${account.name}`}
                          className="min-w-36 rounded-lg border border-[#d9ded6] bg-[#fbfaf6] px-3 py-2 text-sm"
                          disabled={updatingAccountId === account.id}
                          onChange={(event) => void handleAccountRoleChange(account.id, event.target.value as Role)}
                          value={account.role}
                        >
                          {(currentUser.id === "root-admin" || account.role === "admin"
                            ? (["student", "instructor", "parent", "admin"] as Role[])
                            : (["student", "instructor", "parent"] as Role[])
                          ).map((role) => (
                            <option key={role} value={role} disabled={role === "admin" && currentUser.id !== "root-admin"}>
                              {t.roles[role]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-4 text-[#4e6e62]">
                        {account.createdAt ? new Date(account.createdAt).toLocaleDateString(language === "ar" ? "ar-SA" : "en-US") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      {active === "parent" && (
        <div className="rounded-2xl border border-[#dce1d9] bg-[#fffefa] p-6 sm:p-8">
          <div className="mb-5 flex flex-wrap items-start justify-between gap-3">
            <div><h2 className="text-xl font-bold text-[#203b33]">{language === "ar" ? "تقرير ولي الأمر" : "Parent report"}</h2><p className="mt-1 text-xs text-[#748179]">{language === "ar" ? "سجل عيّنة للمعاينة — غير محفوظ ولا يمثل بيانات مباشرة." : "Sample record for preview — not persisted or live data."}</p></div>
            <span className="rounded-full border border-[#ead9ca] bg-[#f8f0e8] px-3 py-1 text-xs font-semibold text-[#956348]">{language === "ar" ? `الأسبوع ${parentReport?.week ?? "—"}` : `Week ${parentReport?.week ?? "—"}`}</span>
          </div>
          {parentReportState === "loading" ? <div aria-live="polite" className="h-24 animate-pulse rounded-xl bg-[#f0f1eb]" />
            : parentReportState === "error" ? <div role="alert" className="text-sm text-rose-800">{language === "ar" ? "تعذر تحميل تقرير ولي الأمر." : "Could not load the parent report."}<button onClick={() => setParentRefresh((value) => value + 1)} className="ms-3 underline">{t.retry}</button></div>
              : parentReport && <div className="space-y-5">
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded-xl bg-[#f5f5ef] p-4"><p className="text-xs text-[#718078]">{t.name}</p><p className="mt-2 font-semibold text-[#29463b]">{parentReport.studentName}</p></div>
                  <div className="rounded-xl bg-[#f5f5ef] p-4"><p className="text-xs text-[#718078]">{t.attendance}</p><p className="mt-2 font-mono text-xl font-bold text-[#29463b]">{parentReport.attendance}%</p></div>
                  <div className="rounded-xl bg-[#f5f5ef] p-4"><p className="text-xs text-[#718078]">{t.score}</p><p className="mt-2 font-mono text-xl font-bold text-[#29463b]">{parentReport.quizAvg}%</p></div>
                </div>
                <div className="rounded-xl border border-[#e5e8e1] p-4"><h3 className="text-sm font-bold text-[#29463b]">{language === "ar" ? "ملاحظات" : "Remarks"}</h3><p className="mt-2 text-sm leading-7 text-[#586c61]">{parentReport.remarks}</p></div>
                {parentReport.recommendations.length > 0 && <div><h3 className="mb-2 text-sm font-bold text-[#29463b]">{language === "ar" ? "التوصيات" : "Recommendations"}</h3><ul className="list-inside list-disc space-y-2 text-sm text-[#586c61]">{parentReport.recommendations.map((recommendation, index) => <li key={`${index}-${recommendation}`}>{recommendation}</li>)}</ul></div>}
              </div>}
        </div>
      )}
      {active === "announcements" && (
        <div className="rounded-2xl border border-[#dce1d9] bg-[#fffefa] p-8 sm:p-10">
          <div className="mb-5 flex size-11 items-center justify-center rounded-xl bg-[#f4e9df] text-[#a4694f]"><RefreshCw size={19} /></div>
          <h2 className="text-xl font-bold text-[#203b33]">{t.future}</h2>
          <p className="mt-2 max-w-xl text-sm leading-7 text-[#65746e]">{t.futureNote}</p>
        </div>
      )}
    </section>
  );
}
