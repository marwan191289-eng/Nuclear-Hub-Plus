import { createFileRoute, Link } from "@tanstack/react-router";
import instructor from "@/assets/mahmoud-lab-coat.png";
import { SITE } from "@/lib/site";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "من أنا | المهندس محمود إسماعيل شلتوت" },
      { name: "description", content: "تعرّف على المهندس محمود إسماعيل شلتوت، مهندس كيمياء نووية ومدرّب لطلاب الجامعات في السعودية والخليج." },
      { property: "og:title", content: "من أنا | المهندس محمود شلتوت" },
      { property: "og:description", content: "مهندس كيمياء نووية ومدرّب — منهج يبني الفهم لا الحفظ." },
    ],
  }),
  component: AboutPage,
});

const VALUES = [
  { t: "الفهم قبل الحفظ", d: "كل معادلة مربوطة بفكرة فيزيائية وتطبيق حقيقي." },
  { t: "متابعة فردية", d: "خطة لكل طالب، وتقييم مستمر لمستواه." },
  { t: "خبرة ميدانية", d: "أمثلة من واقع العمل الهندسي في المجال النووي." },
];

function AboutPage() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="glow-accent overflow-hidden rounded-2xl border border-border bg-panel">
            <img src={instructor} alt={SITE.title} width={912} height={1104} className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="eyebrow mb-3">ABOUT</div>
          <h1 className="text-4xl font-bold lg:text-5xl">{SITE.title}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground">
            مهندس متخصص في الكيمياء النووية، ومدرّب يقدّم دورات ودروسًا خاصة لطلاب الجامعات والمهتمين بالمجال. هدفي أن تتحول المادة من مجموعة قوانين صعبة إلى منطق واضح تقدر تبني عليه.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.t} className="rounded-xl border border-border bg-panel/60 p-5">
                <div className="font-semibold text-primary">{v.t}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
          <Link to="/booking" className="btn-primary mt-10">احجز جلسة تقييم مجانية</Link>
        </div>
      </div>
    </section>
  );
}
