import { Link } from "@tanstack/react-router";
import { CourseArtwork } from "@/components/CourseArtwork";
import { getCoursePrice, type Course } from "@/lib/site";

export function CourseCard({ c, lang = "ar" }: { c: Course; lang?: "ar" | "en" }) {
  const en = lang === "en";
  return (
    <article className="course-card group flex flex-col overflow-hidden rounded-2xl border border-border bg-panel/60">
      <CourseArtwork courseId={c.id} lang={lang} className="aspect-[16/10] w-full" />
      <div className="flex flex-1 flex-col p-6">
        <div className="mb-5 flex items-center justify-between">
          <span className="font-display text-[11px] uppercase tracking-[0.18em] text-dim">
            {c.level}
          </span>
          <span
            className={
              c.tagTone === "accent"
                ? "rounded-full bg-accent/10 px-3 py-1 text-[11px] font-medium text-accent"
                : "rounded-full bg-primary/10 px-3 py-1 text-[11px] font-medium text-primary"
            }
          >
            {c.tag}
          </span>
        </div>
        <h3 className="mb-2 text-xl font-semibold">{c.title}</h3>
        <p className="mb-6 flex-1 text-[14px] leading-relaxed text-muted-foreground">{c.desc}</p>
        <div className="mb-4 flex items-end justify-between gap-3">
          <span className="text-[12px] text-dim">{en ? "Course fee" : "رسوم الدورة"}</span>
          <span className="font-display text-xl font-semibold text-foreground">
            {getCoursePrice(c.id)}{" "}
            <span className="text-[11px] font-medium text-primary">{en ? "SAR" : "ر.س"}</span>
          </span>
        </div>
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-4 text-[12px] text-dim">
          <span>
            {c.duration} · {c.mode}
          </span>
          {en ? (
            <Link
              to="/en/booking"
              search={{ course: c.id }}
              className="shrink-0 font-semibold text-primary transition hover:text-foreground"
            >
              Enroll <span aria-hidden="true">→</span>
            </Link>
          ) : (
            <Link
              to="/booking"
              search={{ course: c.id }}
              className="shrink-0 font-semibold text-primary transition hover:text-foreground"
            >
              سجّل الآن <span aria-hidden="true">←</span>
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
