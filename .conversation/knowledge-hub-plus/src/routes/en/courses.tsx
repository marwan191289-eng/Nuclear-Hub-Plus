import { createFileRoute, Link } from "@tanstack/react-router";
import { CourseArtwork } from "@/components/CourseArtwork";
import { COURSES_EN, getCoursePrice } from "@/lib/site";

export const Route = createFileRoute("/en/courses")({
  head: () => ({
    meta: [
      { title: "Courses | Eng. Mahmoud Shaltoot" },
      {
        name: "description",
        content:
          "Nuclear chemistry courses: fundamentals, reactions & reactors, and radiation safety — live online with Eng. Mahmoud Shaltoot.",
      },
      { property: "og:title", content: "Nuclear Chemistry Courses | Mahmoud Shaltoot" },
      {
        property: "og:description",
        content: "Three progressive tracks from beginner to advanced, live online.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: CoursesEn,
});

function CoursesEn() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <header className="scroll-reveal relative mb-14 overflow-hidden rounded-3xl border border-border bg-panel/55 px-7 py-10 lg:px-12 lg:py-14">
        <div className="tech-grid pointer-events-none absolute inset-0 opacity-30" />
        <div className="relative z-10">
          <div className="eyebrow mb-3">THE LEARNING PATH / 01—03</div>
          <h1 className="text-4xl font-bold lg:text-6xl">
            Available <span className="text-primary">courses</span>
          </h1>
          <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-muted-foreground">
            Progressive tracks that build your understanding step by step. Every course includes
            live sessions, summaries and worked exercises.
          </p>
          <p className="mt-3 text-[14px] text-muted-foreground">
            Not sure where to start?{" "}
            <Link to="/en/placement" className="text-primary transition hover:text-foreground">
              Take the free placement test →
            </Link>
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 font-display text-[11px] tracking-[0.12em] text-dim">
            <span>THREE SPECIALIZED TRACKS</span>
            <span className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" /> LIVE ONLINE
            </span>
            <span>FEES IN SAUDI RIYALS</span>
          </div>
        </div>
      </header>
      <div className="space-y-6">
        {COURSES_EN.map((c) => (
          <article
            key={c.id}
            className="course-listing scroll-reveal grid overflow-hidden rounded-2xl border border-border bg-panel/55 lg:grid-cols-12"
          >
            <CourseArtwork
              courseId={c.id}
              lang="en"
              className="aspect-[16/9] w-full lg:col-span-4 lg:aspect-auto lg:min-h-[300px]"
            />
            <div className="grid gap-8 p-6 md:p-8 lg:col-span-8 lg:grid-cols-12">
              <div className="lg:col-span-7">
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-display text-[11px] uppercase tracking-[0.18em] text-dim">
                    {c.level}
                  </span>
                  <span
                    className={
                      c.tagTone === "accent"
                        ? "rounded-full bg-accent/10 px-3 py-1 text-[11px] text-accent"
                        : "rounded-full bg-primary/10 px-3 py-1 text-[11px] text-primary"
                    }
                  >
                    {c.tag}
                  </span>
                </div>
                <h2 className="text-2xl font-semibold">{c.title}</h2>
                <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{c.desc}</p>
                <div className="mt-6 flex flex-wrap gap-6 text-[13px] text-dim">
                  <span>
                    Duration: <span className="text-foreground">{c.duration}</span>
                  </span>
                  <span>
                    Format: <span className="text-foreground">{c.mode}</span>
                  </span>
                </div>
                <div className="mt-8 border-t border-border/70 pt-5">
                  <div className="text-[12px] text-dim">Course fee</div>
                  <div className="mt-1 font-display text-3xl font-semibold text-foreground">
                    {getCoursePrice(c.id)}{" "}
                    <span className="text-sm font-medium text-primary">SAR</span>
                  </div>
                </div>
              </div>
              <div className="lg:col-span-5">
                <div className="eyebrow mb-3">TOPICS</div>
                <ul className="space-y-2">
                  {c.topics.map((t) => (
                    <li key={t} className="flex items-center gap-3 text-[14px]">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {t}
                    </li>
                  ))}
                </ul>
                <Link to="/en/booking" search={{ course: c.id }} className="btn-primary mt-6">
                  Reserve your seat
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
