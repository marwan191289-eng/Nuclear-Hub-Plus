import { createFileRoute, Link } from "@tanstack/react-router";
import instructor from "@/assets/mahmoud-lab-coat.png";
import { SITE_EN } from "@/lib/site";

export const Route = createFileRoute("/en/about")({
  head: () => ({
    meta: [
      { title: "About | Eng. Mahmoud Ismail Shaltoot" },
      { name: "description", content: "Meet Eng. Mahmoud Ismail Shaltoot, nuclear chemistry engineer and instructor for university students in Saudi Arabia and the Gulf." },
      { property: "og:title", content: "About | Eng. Mahmoud Shaltoot" },
      { property: "og:description", content: "Nuclear chemistry engineer and instructor — a method built on understanding, not memorization." },
      { property: "og:type", content: "profile" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutEn,
});

const VALUES = [
  { t: "Understanding first", d: "Every equation is tied to a physical idea and a real application." },
  { t: "Personal follow-up", d: "A plan for every student and continuous assessment of progress." },
  { t: "Field experience", d: "Examples drawn from real engineering work in the nuclear sector." },
];

function AboutEn() {
  return (
    <section className="mx-auto max-w-[1240px] px-6 py-16 lg:px-10 lg:py-24">
      <div className="grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-5">
          <div className="glow-accent overflow-hidden rounded-2xl border border-border bg-panel">
            <img src={instructor} alt={SITE_EN.title} width={912} height={1104} className="aspect-[3/4] w-full object-cover" />
          </div>
        </div>
        <div className="lg:col-span-7">
          <div className="eyebrow mb-3">ABOUT</div>
          <h1 className="text-4xl font-bold lg:text-5xl">{SITE_EN.title}</h1>
          <p className="mt-6 text-[17px] leading-relaxed text-muted-foreground">
            An engineer specialized in nuclear chemistry and an instructor offering courses and private lessons to university students and anyone curious about the field. My goal is to turn the subject from a set of hard laws into clear logic you can build on.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {VALUES.map((v) => (
              <div key={v.t} className="rounded-xl border border-border bg-panel/60 p-5">
                <div className="font-semibold text-primary">{v.t}</div>
                <p className="mt-2 text-[13px] leading-relaxed text-muted-foreground">{v.d}</p>
              </div>
            ))}
          </div>
          <Link to="/en/booking" className="btn-primary mt-10">Book a free assessment</Link>
        </div>
      </div>
    </section>
  );
}
