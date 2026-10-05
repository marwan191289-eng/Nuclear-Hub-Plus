import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { COURSES, SITE, waLink } from "@/lib/site";

const searchSchema = z.object({ course: z.string().optional() });

export const Route = createFileRoute("/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "الحجز والاستعلام | المهندس محمود شلتوت" },
      { name: "description", content: "احجز دورة أو درسًا خاصًا في الكيمياء النووية، أو أرسل استفسارك مباشرة للمهندس محمود شلتوت عبر واتساب." },
      { property: "og:title", content: "احجز جلستك | محمود شلتوت" },
      { property: "og:description", content: "حجز الدورات والدروس الخاصة والاستعلام — رد سريع عبر واتساب." },
    ],
  }),
  component: BookingPage,
});

const formSchema = z.object({
  name: z.string().trim().min(2, "اكتب اسمك").max(100),
  phone: z.string().trim().min(7, "رقم غير صحيح").max(20).regex(/^[+\d\s-]+$/, "رقم غير صحيح"),
  country: z.string().trim().max(50),
  type: z.enum(["booking", "inquiry"]),
  course: z.string().max(50),
  message: z.string().trim().max(1000),
});

const OPTIONS = [...COURSES.map((c) => ({ id: c.id, label: c.title })), { id: "private", label: "درس خاص فردي" }];

function BookingPage() {
  const { course } = Route.useSearch();
  const [type, setType] = useState<"booking" | "inquiry">("booking");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = Object.fromEntries(new FormData(e.currentTarget));
    const r = formSchema.safeParse({ ...fd, type });
    if (!r.success) {
      const errs: Record<string, string> = {};
      r.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
      setErrors(errs);
      return;
    }
    setErrors({});
    const d = r.data;
    const courseLabel = OPTIONS.find((o) => o.id === d.course)?.label ?? "";
    const text = [
      d.type === "booking" ? "📌 طلب حجز جديد" : "❓ استفسار جديد",
      `الاسم: ${d.name}`,
      `الجوال: ${d.phone}`,
      d.country && `الدولة: ${d.country}`,
      courseLabel && `الدورة: ${courseLabel}`,
      d.message && `الرسالة: ${d.message}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank");
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-3">BOOKING</div>
          <h1 className="text-4xl font-bold lg:text-5xl">الحجز <span className="text-primary">والاستعلام</span></h1>
          <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">املأ البيانات وسيتم إرسال طلبك مباشرة للمهندس محمود عبر واتساب، والرد عادة خلال ساعات.</p>
          <div className="mt-10 space-y-4">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-panel/60 p-5 transition hover:border-primary/50">
              <span className="text-muted-foreground">واتساب / اتصال</span><span dir="ltr" className="font-display text-primary">{SITE.phoneDisplay}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-panel/60 p-5 transition hover:border-primary/50">
              <span className="text-muted-foreground">البريد</span><span className="truncate font-display text-[14px] text-primary">{SITE.email}</span>
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glow-primary rounded-2xl border border-border bg-panel/70 p-8 lg:col-span-7" noValidate>
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-full border border-border p-1">
            {(["booking", "inquiry"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={type === t ? "rounded-full bg-primary py-2 text-[14px] font-semibold text-primary-foreground" : "rounded-full py-2 text-[14px] text-muted-foreground"}>
                {t === "booking" ? "حجز" : "استفسار"}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="الاسم" error={errors["name"]}><input name="name" className="field" maxLength={100} /></Field>
            <Field label="رقم الجوال" error={errors["phone"]}><input name="phone" dir="ltr" className="field text-right" placeholder="+966" maxLength={20} /></Field>
            <Field label="الدولة"><input name="country" className="field" defaultValue="السعودية" maxLength={50} /></Field>
            <Field label="الدورة">
              <select name="course" defaultValue={course ?? ""} className="field">
                <option value="">— اختر —</option>
                {OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label={type === "booking" ? "ملاحظات (المواعيد المناسبة، المستوى...)" : "استفسارك"}>
              <textarea name="message" rows={5} className="field" maxLength={1000} />
            </Field>
          </div>
          <button type="submit" className="btn-primary mt-7 w-full justify-center">إرسال عبر واتساب</button>
        </form>
      </div>
    </section>
  );
}

function Field({ label, error, children }: { label: string; error?: string | undefined; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-2 block text-[13px] text-muted-foreground">{label}</span>
      {children}
      {error && <span className="mt-1 block text-[12px] text-destructive">{error}</span>}
    </label>
  );
}
