import { Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useState } from "react";
import { PLACEMENT_QUESTIONS, type PlacementResult } from "@/lib/placement";
import { submitPlacement } from "@/lib/placement.functions";
import { coursesFor } from "@/lib/site";

const T = {
  ar: {
    eyebrow: "PLACEMENT TEST",
    title: "اختبار تحديد المستوى",
    hl: "المجاني",
    intro: "٨ أسئلة سريعة + سؤالين عنك. يقيّم الذكاء الاصطناعي إجاباتك ويقترح الدورة المناسبة لك خلال ثوانٍ.",
    background: "خلفيتك الدراسية (مثال: طالب كيمياء سنة ثالثة)",
    goal: "هدفك (اختبار، بحث تخرج، عمل...)",
    submit: "قيّم مستواي",
    loading: "جارٍ التقييم...",
    unanswered: "أجب عن جميع الأسئلة أولًا",
    score: "النتيجة",
    level: "المستوى",
    recommended: "الدورة المقترحة لك",
    tips: "نصائح للمذاكرة",
    book: "احجز هذه الدورة",
    retry: "إعادة الاختبار",
    private: "دروس خاصة فردية",
  },
  en: {
    eyebrow: "PLACEMENT TEST",
    title: "Free placement",
    hl: "test",
    intro: "8 quick questions plus two about you. AI evaluates your answers and recommends the right course in seconds.",
    background: "Your background (e.g. 3rd-year chemistry student)",
    goal: "Your goal (exam, graduation project, career...)",
    submit: "Evaluate my level",
    loading: "Evaluating...",
    unanswered: "Please answer all questions first",
    score: "Score",
    level: "Level",
    recommended: "Recommended course",
    tips: "Study tips",
    book: "Book this course",
    retry: "Retake the test",
    private: "One-to-one private lessons",
  },
};

export function PlacementQuiz({ lang }: { lang: "ar" | "en" }) {
  const t = T[lang];
  const en = lang === "en";
  const submit = useServerFn(submitPlacement);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [background, setBackground] = useState("");
  const [goal, setGoal] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Extract<PlacementResult, { ok: true }> | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (Object.keys(answers).length < PLACEMENT_QUESTIONS.length) return setError(t.unanswered);
    setError("");
    setLoading(true);
    try {
      const r = await submit({ data: { lang, answers, background, goal } });
      if (r.ok) setResult(r);
      else setError(r.error);
    } catch {
      setError(en ? "Something went wrong. Please try again." : "حدث خطأ، حاول مرة أخرى.");
    } finally {
      setLoading(false);
    }
  }

  const course = result ? coursesFor(lang).find((c) => c.id === result.courseId) : undefined;

  return (
    <section className="mx-auto max-w-[900px] px-6 py-16 lg:py-24">
      <div className="eyebrow mb-3">{t.eyebrow}</div>
      <h1 className="text-4xl font-bold lg:text-5xl">{t.title} <span className="text-primary">{t.hl}</span></h1>
      <p className="mt-4 text-[16px] leading-relaxed text-muted-foreground">{t.intro}</p>

      {result ? (
        <div className="glow-primary mt-12 rounded-2xl border border-border bg-panel/70 p-8">
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <div className="text-[13px] text-muted-foreground">{t.score}</div>
              <div className="font-display text-5xl font-bold text-primary">{result.score}/{result.total}</div>
            </div>
            <div>
              <div className="text-[13px] text-muted-foreground">{t.level}</div>
              <div className="mt-2 text-2xl font-semibold text-accent">{result.level}</div>
            </div>
          </div>
          <div className="mt-8 rounded-xl border border-primary/40 bg-primary/5 p-6">
            <div className="eyebrow mb-2">{t.recommended}</div>
            <div className="text-xl font-semibold">{course?.title ?? t.private}</div>
            {result.summary && <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">{result.summary}</p>}
          </div>
          {result.tips.length > 0 && (
            <div className="mt-6">
              <div className="mb-3 font-semibold">{t.tips}</div>
              <ul className="space-y-2">
                {result.tips.map((tip) => (
                  <li key={tip} className="flex items-start gap-3 text-[14px]"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />{tip}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="mt-8 flex flex-wrap gap-4">
            {en ? (
              <Link to="/en/booking" search={{ course: result.courseId }} className="btn-primary">{t.book}</Link>
            ) : (
              <Link to="/booking" search={{ course: result.courseId }} className="btn-primary">{t.book}</Link>
            )}
            <button type="button" className="btn-ghost" onClick={() => { setResult(null); setAnswers({}); }}>{t.retry}</button>
          </div>
        </div>
      ) : (
        <form onSubmit={onSubmit} className="mt-12 space-y-6">
          {PLACEMENT_QUESTIONS.map((q, i) => (
            <fieldset key={q.id} className="rounded-2xl border border-border bg-panel/60 p-6">
              <legend className="sr-only">{q.q[lang]}</legend>
              <div className="mb-4 flex gap-3 text-[16px] font-medium">
                <span className="font-display text-primary">0{i + 1}</span>
                <span>{q.q[lang]}</span>
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                {q.options[lang].map((opt, idx) => {
                  const active = answers[q.id] === idx;
                  return (
                    <label key={opt} className={active ? "cursor-pointer rounded-xl border border-primary bg-primary/10 px-4 py-3 text-[14px] text-primary" : "cursor-pointer rounded-xl border border-border px-4 py-3 text-[14px] text-muted-foreground transition hover:border-primary/50"}>
                      <input type="radio" name={q.id} className="sr-only" checked={active} onChange={() => setAnswers((a) => ({ ...a, [q.id]: idx }))} />
                      {opt}
                    </label>
                  );
                })}
              </div>
            </fieldset>
          ))}
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-[13px] text-muted-foreground">{t.background}</span>
              <input className="field" value={background} onChange={(e) => setBackground(e.target.value)} maxLength={500} />
            </label>
            <label className="block">
              <span className="mb-2 block text-[13px] text-muted-foreground">{t.goal}</span>
              <input className="field" value={goal} onChange={(e) => setGoal(e.target.value)} maxLength={500} />
            </label>
          </div>
          {error && <p className="text-[14px] text-destructive">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full justify-center disabled:opacity-60">{loading ? t.loading : t.submit}</button>
        </form>
      )}
    </section>
  );
}
