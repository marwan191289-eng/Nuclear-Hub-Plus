import fundamentals from "@/assets/nuclear-fundamentals.jpg";
import reactors from "@/assets/nuclear-reactors.jpg";
import safety from "@/assets/nuclear-safety.jpg";
import type { CourseId } from "@/lib/site";

const COURSE_ART: Record<
  CourseId,
  { src: string; alt: { ar: string; en: string }; label: string }
> = {
  fundamentals: {
    src: fundamentals,
    alt: {
      ar: "تصوير علمي لنواة ذرية مكوّنة من بروتونات ونيوترونات تحيط بها مدارات إلكترونية مضيئة",
      en: "Scientific visualization of an atomic nucleus with orbiting electrons",
    },
    label: "NUCLEAR STRUCTURE",
  },
  reactors: {
    src: reactors,
    alt: {
      ar: "حوض مفاعل بحثي مضاء بالضوء الأزرق داخل منشأة نووية",
      en: "Blue-lit research reactor pool inside a nuclear facility",
    },
    label: "REACTOR SYSTEMS",
  },
  safety: {
    src: safety,
    alt: {
      ar: "جهاز قياس إشعاعي وقارورة عينة داخل مختبر علمي",
      en: "Radiation survey meter and sample vial in a scientific laboratory",
    },
    label: "RADIATION SAFETY",
  },
};

export function CourseArtwork({
  courseId,
  lang = "ar",
  className = "",
}: {
  courseId: string;
  lang?: "ar" | "en";
  className?: string;
}) {
  const art = COURSE_ART[courseId as CourseId];

  if (!art) return null;

  return (
    <div className={`course-art nuclear-visual relative isolate overflow-hidden ${className}`}>
      <img
        src={art.src}
        alt={art.alt[lang]}
        className="absolute inset-0 h-full w-full object-cover"
        loading="lazy"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#07111e]/90 via-[#07111e]/8 to-transparent" />
      <span
        className="absolute bottom-4 left-4 z-10 font-display text-[10px] tracking-[0.2em] text-white/90"
        dir="ltr"
      >
        {art.label}
      </span>
      <span
        className="absolute top-4 right-4 z-10 rounded-full border border-white/20 bg-[#091522]/55 px-2.5 py-1 font-display text-[9px] tracking-[0.16em] text-white/80 backdrop-blur-sm"
        dir="ltr"
      >
        NKH / 0{Object.keys(COURSE_ART).indexOf(courseId) + 1}
      </span>
    </div>
  );
}
