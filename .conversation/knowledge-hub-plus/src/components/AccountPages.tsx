import { Link } from "@tanstack/react-router";
import type { AccountAccess } from "@/lib/auth.functions";

type SignedInAccount = Extract<AccountAccess, { signedIn: true }>;

export function DashboardPage({
  account,
  english = false,
}: {
  account: SignedInAccount;
  english?: boolean;
}) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="dashboard-panel rounded-3xl p-7 sm:p-10">
        <div className="eyebrow mb-4">{english ? "STUDENT ACCOUNT" : "حساب الطالب"}</div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {english ? `Welcome, ${account.displayName}` : `أهلاً ${account.displayName}`}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground" dir="ltr">
          {account.email || (english ? "No email address" : "لا يوجد بريد إلكتروني")}
        </p>
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-primary/25 bg-primary/5 px-3 py-1.5 text-xs text-primary">
          <span className="size-1.5 rounded-full bg-primary" />
          {account.isEmailVerified
            ? english
              ? "Email verified"
              : "تم التحقق من البريد"
            : english
              ? "Verify your email to secure your account"
              : "تحقق من بريدك الإلكتروني لحماية حسابك"}
        </div>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <Link
          to={english ? "/en/courses" : "/courses"}
          className="dashboard-card rounded-2xl p-6"
        >
          <div className="eyebrow mb-3">{english ? "LEARNING" : "التعلّم"}</div>
          <h2 className="text-xl font-semibold">
            {english ? "Explore the courses" : "استكشف الدورات"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {english
              ? "Review course topics and choose the right starting point."
              : "تعرّف على محاور الدورات واختر نقطة البداية المناسبة."}
          </p>
        </Link>
        <Link
          to={english ? "/en/placement" : "/placement"}
          className="dashboard-card rounded-2xl p-6"
        >
          <div className="eyebrow mb-3">{english ? "NEXT STEP" : "الخطوة التالية"}</div>
          <h2 className="text-xl font-semibold">
            {english ? "Take the placement quiz" : "ابدأ اختبار تحديد المستوى"}
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {english
              ? "Get a course recommendation based on your current knowledge."
              : "احصل على توصية بدورة تناسب مستواك الحالي."}
          </p>
        </Link>
      </div>
      {account.isInstructor && (
        <Link
          to={english ? "/en/instructor" : "/instructor"}
          className="dashboard-card mt-4 block rounded-2xl p-6"
        >
          <div className="eyebrow mb-3">{english ? "INSTRUCTOR" : "للمدرّب"}</div>
          <h2 className="text-xl font-semibold">
            {english ? "Open instructor console" : "فتح لوحة المهندس"}
          </h2>
        </Link>
      )}

      <p className="mt-7 text-xs leading-relaxed text-dim">
        {english
          ? "Course enrollments and lesson progress will appear here once student records are connected."
          : "ستظهر الدورات المسجل بها وتقدم الدروس هنا بعد ربط سجل الطلاب."}
      </p>
    </section>
  );
}

export function InstructorPage({
  account,
  english = false,
}: {
  account: SignedInAccount;
  english?: boolean;
}) {
  return (
    <section className="mx-auto max-w-5xl px-5 py-12 sm:px-8 lg:py-16">
      <div className="dashboard-panel rounded-3xl p-7 sm:p-10">
        <div className="eyebrow mb-4">
          {english ? "INSTRUCTOR CONSOLE" : "لوحة المهندس محمود"}
        </div>
        <h1 className="text-3xl font-bold sm:text-4xl">
          {english ? `Welcome, ${account.displayName}` : `أهلاً ${account.displayName}`}
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          {english
            ? "Instructor access is verified by the server. Student records are not stored until a secure database is connected."
            : "تم التحقق من صلاحية المدرّب من الخادم. لن تُحفظ بيانات الطلاب قبل ربط قاعدة بيانات آمنة."}
        </p>
      </div>
      <div className="mt-6 rounded-2xl border border-accent/25 bg-accent/5 p-5 text-sm leading-relaxed text-muted-foreground">
        {english
          ? "The instructor account is protected, but student management, bookings, and lesson-progress tools remain unavailable until server-side storage is configured."
          : "حساب المهندس محمي، لكن إدارة الطلاب والحجوزات وتقدم الدروس غير مفعّلة إلى أن تُجهّز مساحة تخزين آمنة على الخادم."}
      </div>
      <Link to={english ? "/en" : "/"} className="btn-ghost mt-7">
        {english ? "Return to site" : "العودة إلى الموقع"}
      </Link>
    </section>
  );
}
