import { Link } from "@tanstack/react-router";
import type { Article } from "@/lib/articles";
import { coursesFor } from "@/lib/site";

export function ArticleList({ lang, items }: { lang: "ar" | "en"; items: Article[] }) {
  const en = lang === "en";
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="eyebrow mb-3">{en ? "FREE RESOURCES" : "مصادر مجانية"}</div>
      <h1 className="text-4xl font-bold lg:text-5xl">{en ? <>Articles & <span className="text-primary">summaries</span></> : <>مقالات <span className="text-primary">وملخصات</span></>}</h1>
      <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
        {en ? "Free, concise explanations of core nuclear chemistry topics — written for university students." : "شروحات مجانية مختصرة لأهم موضوعات الكيمياء النووية، مكتوبة لطلاب الجامعات."}
      </p>
      <div className="mt-12 grid gap-6 md:grid-cols-3">
        {items.map((a) => (
          <article key={a.slug} className="flex flex-col rounded-2xl border border-border bg-panel/60 p-6 transition hover:border-primary/50">
            <div className="mb-4 flex items-center justify-between text-[12px] text-dim">
              <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{a.category}</span>
              <span>{a.readMinutes} {en ? "min read" : "دقائق قراءة"}</span>
            </div>
            <h2 className="mb-3 text-lg font-semibold leading-snug">
              {en ? <Link to="/en/articles/$slug" params={{ slug: a.slug }} className="hover:text-primary">{a.title}</Link> : <Link to="/articles/$slug" params={{ slug: a.slug }} className="hover:text-primary">{a.title}</Link>}
            </h2>
            <p className="flex-1 text-[14px] leading-relaxed text-muted-foreground">{a.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

export function ArticleBody({ a }: { a: Article }) {
  const en = a.lang === "en";
  const course = coursesFor(a.lang).find((c) => c.id === a.relatedCourse);
  return (
    <article className="mx-auto max-w-[760px] px-6 py-16 lg:py-24">
      {en ? <Link to="/en/articles" className="text-[13px] text-muted-foreground hover:text-primary">← All articles</Link> : <Link to="/articles" className="text-[13px] text-muted-foreground hover:text-primary">→ كل المقالات</Link>}
      <div className="mt-6 flex items-center gap-3 text-[12px] text-dim">
        <span className="rounded-full bg-primary/10 px-3 py-1 text-primary">{a.category}</span>
        <time dateTime={a.date}>{a.date}</time>
        <span>· {a.readMinutes} {en ? "min read" : "دقائق قراءة"}</span>
      </div>
      <h1 className="mt-4 text-3xl font-bold leading-tight lg:text-4xl">{a.title}</h1>
      <p className="mt-4 text-[17px] leading-relaxed text-muted-foreground">{a.description}</p>
      <div className="mt-10 space-y-8">
        {a.sections.map((s) => (
          <section key={s.h}>
            <h2 className="mb-3 text-xl font-semibold text-primary">{s.h}</h2>
            {s.p.map((p) => <p key={p} className="mb-3 text-[16px] leading-loose">{p}</p>)}
          </section>
        ))}
      </div>
      {course && (
        <div className="glow-primary mt-14 rounded-2xl border border-border bg-panel/70 p-8">
          <div className="eyebrow mb-2">{en ? "GO DEEPER" : "تعمّق أكثر"}</div>
          <div className="text-xl font-semibold">{course.title}</div>
          <p className="mt-2 text-[14px] text-muted-foreground">{course.desc}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            {en ? (
              <>
                <Link to="/en/booking" search={{ course: course.id }} className="btn-primary">Book this course</Link>
                <Link to="/en/placement" className="btn-ghost">Free placement test</Link>
              </>
            ) : (
              <>
                <Link to="/booking" search={{ course: course.id }} className="btn-primary">احجز الدورة</Link>
                <Link to="/placement" className="btn-ghost">اختبار تحديد المستوى</Link>
              </>
            )}
          </div>
        </div>
      )}
    </article>
  );
}

export function articleHead(a: Article | undefined) {
  if (!a) return { meta: [{ title: "Not found" }] };
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: a.title,
    description: a.description,
    datePublished: a.date,
    inLanguage: a.lang,
    author: { "@type": "Person", name: a.lang === "en" ? "Eng. Mahmoud Ismail Shaltoot" : "المهندس محمود إسماعيل شلتوت" },
  };
  return {
    meta: [
      { title: `${a.title} | ${a.lang === "en" ? "Mahmoud Shaltoot" : "محمود شلتوت"}` },
      { name: "description", content: a.description },
      { property: "og:title", content: a.title },
      { property: "og:description", content: a.description },
      { property: "og:type", content: "article" },
      { property: "article:published_time", content: a.date },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    scripts: [{ type: "application/ld+json", children: JSON.stringify(jsonLd) }],
  };
}
