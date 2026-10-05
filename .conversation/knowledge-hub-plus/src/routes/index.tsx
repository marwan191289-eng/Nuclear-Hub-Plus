import { createFileRoute, Link } from "@tanstack/react-router";
import reactor from "@/assets/nuclear-reactors.jpg";
import instructor from "@/assets/mahmoud-lab-coat.png";
import { COURSES, SITE, waLink } from "@/lib/site";
import { CourseCard } from "@/components/CourseCard";
import { getRegisteredAccountCount } from "@/lib/auth.functions";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "المهندس محمود شلتوت | دورات الكيمياء النووية أونلاين" },
      {
        name: "description",
        content:
          "دورات ودروس خاصة في الكيمياء النووية مع المهندس محمود إسماعيل شلتوت. أونلاين لطلاب السعودية والخليج. احجز جلسة تقييم مجانية.",
      },
      { property: "og:title", content: "المهندس محمود شلتوت | دورات الكيمياء النووية" },
      {
        property: "og:description",
        content: "الكيمياء النووية بوضوح وبعمق حقيقي — دورات ودروس خاصة أونلاين.",
      },
      { property: "og:image", content: "/og-image.jpg" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/og-image.jpg" },
    ],
  }),
  loader: () => getRegisteredAccountCount(),
  component: Index,
});

const STATS = [
  { v: "12", l: "دورة متخصصة", tone: "text-foreground" },
  { v: "98%", l: "نسبة الرضا", tone: "text-foreground" },
  { v: "5+", l: "سنوات خبرة", tone: "text-accent" },
];

const STEPS = [
  "جلسة تقييم مجانية لتحديد مستواك وأهدافك",
  "خطة أسبوعية مرنة بجدول يناسب وقتك",
  "ملخصات وتمارين وواجبات بين الجلسات",
];

function Index() {
  const registeredAccountCount = Route.useLoaderData();
  const stats = [
    {
      v:
        registeredAccountCount === null
          ? "—"
          : `+${registeredAccountCount.toLocaleString("ar-SA")}`,
      l: "حساباً مسجلاً",
      tone: "text-primary",
    },
    ...STATS,
  ];

  return (
    <>
      <section className="mx-auto max-w-[1240px] px-6 pt-12 pb-16 lg:px-10 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="enter mb-8 inline-flex items-center gap-2 rounded-full border border-border bg-panel/70 px-4 py-1.5 text-[12px] text-muted-foreground">
              <span className="pulse-dot size-1.5 rounded-full bg-primary" />
              متاحة الآن · التسجيل مفتوح للدفعة الجديدة
            </div>
            <h1 className="enter enter-delay-1 text-[44px] font-bold leading-[1.12] tracking-tight lg:text-[68px]">
              الكيمياء النووية <span className="text-primary">بوضوح</span>
              <br />و<em className="italic text-accent">بعمق</em> حقيقي.
            </h1>
            <p className="enter enter-delay-2 mt-6 max-w-xl text-[17px] leading-relaxed text-muted-foreground">
              دورات ودروس خاصة يقدّمها{" "}
              <span className="font-medium text-foreground">{SITE.title}</span> — مهندس كيمياء نووية
              ومدرّب. نبني الفهم من الجذر: من التفاعلات والنظائر إلى المفاعلات، بلغة بسيطة ودقيقة
              مصمّمة لطلاب المملكة والخليج.
            </p>
            <div className="enter enter-delay-3 mt-9 flex flex-wrap items-center gap-4">
              <Link to="/booking" className="btn-primary">
                ابدأ رحلتك الآن
              </Link>
              <Link to="/courses" className="btn-ghost">
                استعرض الدورات
              </Link>
            </div>
            <div className="enter enter-delay-3 mt-10 flex flex-wrap gap-x-10 gap-y-4 text-[13px] text-dim">
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-accent" /> +٥٠٠ طالب
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary" /> ١٢ دورة متخصصة
              </span>
              <span className="flex items-center gap-2">
                <span className="size-1 rounded-full bg-primary/60" /> دروس فردية أونلاين
              </span>
            </div>
          </div>
          <div className="enter enter-delay-2 lg:col-span-5">
            <div className="glow-primary nuclear-visual relative overflow-hidden rounded-2xl border border-border bg-panel">
              <div
                className="absolute inset-x-0 top-0 z-10 flex items-center justify-between border-b border-white/10 bg-[#08111d]/55 px-5 py-3 font-display text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-sm"
                dir="ltr"
              >
                <span>REACTOR CORE / 01</span>
                <span className="flex items-center gap-2 text-primary">
                  <span className="pulse-dot size-1.5 rounded-full bg-primary" /> FIELD STUDY
                </span>
              </div>
              <img
                src={reactor}
                alt="حوض مفاعل نووي بحثي مضاء بالأزرق في منشأة حديثة"
                width={1024}
                height={1024}
                className="aspect-[4/5] w-full object-cover"
              />
              <div
                className="absolute bottom-5 left-5 z-10 rounded-lg border border-white/15 bg-[#08111d]/60 px-3 py-2 font-display text-[11px] text-white/90 backdrop-blur-sm"
                dir="ltr"
              >
                CORE TEMP <span className="ml-2 text-primary">~300°C</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1240px] border-y border-border/70 px-6 py-10 lg:px-10">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {STATS.map((s) => (
            <div key={s.l}>
              <div className={`font-display text-4xl font-bold lg:text-5xl ${s.tone}`}>{s.v}</div>
              <div className="mt-2 text-[13px] text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1240px] px-6 py-20 lg:px-10">
        <div className="mb-12 flex items-end justify-between">
          <div>
            <div className="eyebrow mb-3">COURSES</div>
            <h2 className="text-3xl font-bold lg:text-4xl">الدورات المتاحة</h2>
          </div>
          <Link
            to="/courses"
            className="hidden text-[13px] text-muted-foreground transition hover:text-primary sm:inline"
          >
            عرض الكل ←
          </Link>
        </div>
        <div className="grid gap-6 md:grid-cols-3">
          {COURSES.map((c) => (
            <CourseCard key={c.id} c={c} />
          ))}
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1240px] px-6 py-20 lg:px-10">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="glow-accent relative overflow-hidden rounded-2xl border border-border bg-panel">
              <img
                src={instructor}
                alt={SITE.title}
                width={1024}
                height={1024}
                loading="lazy"
                className="aspect-[3/4] w-full object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-7">
            <div className="eyebrow mb-3">PRIVATE LESSONS</div>
            <h2 className="mb-6 text-3xl font-bold lg:text-4xl">
              دروس خاصة <span className="text-accent">فردية</span>، مصمّمة لك
            </h2>
            <p className="mb-8 text-[16px] leading-relaxed text-muted-foreground">
              جلسات أونلاين وجهاً لوجه، تُبنى حول مستواك وأهدافك الدراسية. تختار أنت المحور — مراجعة
              للاختبارات، بحث تخرّج، أو إعداد لوظيفة في المجال النووي.
            </p>
            <div className="mb-9 space-y-4">
              {STEPS.map((s, i) => (
                <div
                  key={s}
                  className="flex items-center gap-4 rounded-xl border border-border bg-panel/60 p-4"
                >
                  <span className="font-display text-lg text-primary">0{i + 1}</span>
                  <span className="text-[15px]">{s}</span>
                </div>
              ))}
            </div>
            <Link to="/booking" search={{ course: "private" }} className="btn-accent">
              احجز جلستك الأولى
            </Link>
          </div>
        </div>
      </section>

      <section className="scroll-reveal mx-auto max-w-[1240px] px-6 py-20 lg:px-10">
        <div className="glow-primary rounded-3xl border border-border bg-panel/70 p-10 text-center lg:p-16">
          <div className="eyebrow mb-4">GET STARTED</div>
          <h2 className="mb-5 text-3xl font-bold leading-tight lg:text-5xl">
            جاهز تبني فهمك <span className="text-primary">من الجذر</span>؟
          </h2>
          <p className="mx-auto mb-9 max-w-lg text-[16px] text-muted-foreground">
            انضم إلى الدفعة الجديدة أو احجز جلسة تقييم مجانية. نبدأ من حيث أنت.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/booking" className="btn-primary">
              ابدأ الآن
            </Link>
            <a
              href={waLink("السلام عليكم مهندس محمود، عندي استفسار عن الدورات")}
              target="_blank"
              rel="noreferrer"
              className="btn-ghost"
            >
              تحدّث مع المدرّب
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
