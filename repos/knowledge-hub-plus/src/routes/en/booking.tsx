import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { z } from "zod";
import { COURSES_EN, SITE, waLink } from "@/lib/site";

const searchSchema = z.object({ course: z.string().optional() });

export const Route = createFileRoute("/en/booking")({
  validateSearch: (s) => searchSchema.parse(s),
  head: () => ({
    meta: [
      { title: "Booking & Inquiries | Eng. Mahmoud Shaltoot" },
      { name: "description", content: "Book a nuclear chemistry course or private lesson, or send your question directly to Eng. Mahmoud Shaltoot on WhatsApp." },
      { property: "og:title", content: "Book your session | Mahmoud Shaltoot" },
      { property: "og:description", content: "Course and private lesson booking — fast replies on WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BookingEn,
});

const formSchema = z.object({
  name: z.string().trim().min(2, "Enter your name").max(100),
  phone: z.string().trim().min(7, "Invalid number").max(20).regex(/^[+\d\s-]+$/, "Invalid number"),
  country: z.string().trim().max(50),
  type: z.enum(["booking", "inquiry"]),
  course: z.string().max(50),
  message: z.string().trim().max(1000),
});

const OPTIONS = [...COURSES_EN.map((c) => ({ id: c.id, label: c.title })), { id: "private", label: "One-to-one private lesson" }];

function BookingEn() {
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
      d.type === "booking" ? "📌 New booking request (English site)" : "❓ New inquiry (English site)",
      `Name: ${d.name}`,
      `Phone: ${d.phone}`,
      d.country && `Country: ${d.country}`,
      courseLabel && `Course: ${courseLabel}`,
      d.message && `Message: ${d.message}`,
    ].filter(Boolean).join("\n");
    window.open(waLink(text), "_blank");
  }

  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="eyebrow mb-3">BOOKING</div>
          <h1 className="text-4xl font-bold lg:text-5xl">Booking <span className="text-primary">& inquiries</span></h1>
          <p className="mt-5 text-[16px] leading-relaxed text-muted-foreground">Fill in your details and your request goes straight to Eng. Mahmoud on WhatsApp. Replies usually arrive within hours.</p>
          <div className="mt-10 space-y-4">
            <a href={`https://wa.me/${SITE.whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center justify-between rounded-xl border border-border bg-panel/60 p-5 transition hover:border-primary/50">
              <span className="text-muted-foreground">WhatsApp / call</span><span className="font-display text-primary">{SITE.phoneDisplay}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="flex items-center justify-between gap-4 rounded-xl border border-border bg-panel/60 p-5 transition hover:border-primary/50">
              <span className="text-muted-foreground">Email</span><span className="truncate font-display text-[14px] text-primary">{SITE.email}</span>
            </a>
          </div>
        </div>

        <form onSubmit={onSubmit} className="glow-primary rounded-2xl border border-border bg-panel/70 p-8 lg:col-span-7" noValidate>
          <div className="mb-6 grid grid-cols-2 gap-2 rounded-full border border-border p-1">
            {(["booking", "inquiry"] as const).map((t) => (
              <button key={t} type="button" onClick={() => setType(t)} className={type === t ? "rounded-full bg-primary py-2 text-[14px] font-semibold text-primary-foreground" : "rounded-full py-2 text-[14px] text-muted-foreground"}>
                {t === "booking" ? "Booking" : "Inquiry"}
              </button>
            ))}
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Name" error={errors["name"]}><input name="name" className="field" maxLength={100} /></Field>
            <Field label="Mobile number" error={errors["phone"]}><input name="phone" className="field" placeholder="+966" maxLength={20} /></Field>
            <Field label="Country"><input name="country" className="field" defaultValue="Saudi Arabia" maxLength={50} /></Field>
            <Field label="Course">
              <select name="course" defaultValue={course ?? ""} className="field">
                <option value="">— Select —</option>
                {OPTIONS.map((o) => <option key={o.id} value={o.id}>{o.label}</option>)}
              </select>
            </Field>
          </div>
          <div className="mt-5">
            <Field label={type === "booking" ? "Notes (preferred times, level...)" : "Your question"}>
              <textarea name="message" rows={5} className="field" maxLength={1000} />
            </Field>
          </div>
          <button type="submit" className="btn-primary mt-7 w-full justify-center">Send via WhatsApp</button>
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
