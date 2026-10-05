export const SITE = {
  name: "محمود إسماعيل شلتوت",
  title: "المهندس/ محمود إسماعيل شلتوت",
  phone: "+966594756878",
  phoneDisplay: "+966 59 475 6878",
  whatsapp: "966594756878",
  email: "Mahmoudshaltoot.cemc@gmail.com",
};

export function waLink(text: string) {
  return `https://wa.me/${SITE.whatsapp}?text=${encodeURIComponent(text)}`;
}

export type Course = {
  id: string;
  level: string;
  tag: string;
  tagTone: "primary" | "accent";
  title: string;
  desc: string;
  duration: string;
  mode: string;
  topics: string[];
};

export type CourseId = "fundamentals" | "reactors" | "safety";

// Public prices are managed here so every Arabic and English surface stays in sync.
export const COURSE_PRICES: Record<CourseId, number> = {
  fundamentals: 99,
  reactors: 149,
  safety: 199,
};

export function getCoursePrice(id: string) {
  return COURSE_PRICES[id as CourseId];
}

export const COURSES: Course[] = [
  {
    id: "fundamentals",
    level: "LEVEL 01",
    tag: "مباشر",
    tagTone: "primary",
    title: "أساسيات الكيمياء النووية",
    desc: "من الذرة والنظائر إلى أنواع الاضمحلال — نقطة البداية لأي طالب يدخل المجال.",
    duration: "٨ أسابيع",
    mode: "أونلاين مباشر",
    topics: [
      "بنية النواة وطاقة الربط",
      "النظائر واستقرارها",
      "اضمحلال ألفا وبيتا وجاما",
      "عمر النصف وحسابات النشاط",
    ],
  },
  {
    id: "reactors",
    level: "LEVEL 02",
    tag: "مكثّف",
    tagTone: "accent",
    title: "التفاعلات النووية والمفاعلات",
    desc: "الانشطار والاندماج، تصميم المفاعلات، ودورة الوقود — مع تمارين تطبيقية.",
    duration: "٦ أسابيع",
    mode: "أونلاين مباشر",
    topics: ["الانشطار والاندماج", "أنواع المفاعلات", "دورة الوقود النووي", "مسائل تطبيقية"],
  },
  {
    id: "safety",
    level: "LEVEL 03",
    tag: "متقدم",
    tagTone: "primary",
    title: "السلامة الإشعاعية والنظائر",
    desc: "إدارة المخاطر الإشعاعية، قياس النشاط، والتطبيقات الطبية والصناعية.",
    duration: "٤ أسابيع",
    mode: "أونلاين / حضوري",
    topics: [
      "وحدات الجرعة والقياس",
      "مبادئ الحماية الإشعاعية",
      "النظائر في الطب والصناعة",
      "إدارة النفايات المشعة",
    ],
  },
];

export const SITE_EN = {
  name: "Mahmoud Ismail Shaltoot",
  title: "Eng. Mahmoud Ismail Shaltoot",
};

export const COURSES_EN: Course[] = [
  {
    id: "fundamentals",
    level: "LEVEL 01",
    tag: "Live",
    tagTone: "primary",
    title: "Nuclear Chemistry Fundamentals",
    desc: "From atoms and isotopes to decay modes — the starting point for anyone entering the field.",
    duration: "8 weeks",
    mode: "Live online",
    topics: [
      "Nuclear structure & binding energy",
      "Isotopes and stability",
      "Alpha, beta & gamma decay",
      "Half-life and activity calculations",
    ],
  },
  {
    id: "reactors",
    level: "LEVEL 02",
    tag: "Intensive",
    tagTone: "accent",
    title: "Nuclear Reactions & Reactors",
    desc: "Fission and fusion, reactor design and the fuel cycle — with applied problem sets.",
    duration: "6 weeks",
    mode: "Live online",
    topics: ["Fission and fusion", "Reactor types", "The nuclear fuel cycle", "Applied problems"],
  },
  {
    id: "safety",
    level: "LEVEL 03",
    tag: "Advanced",
    tagTone: "primary",
    title: "Radiation Safety & Isotopes",
    desc: "Radiological risk management, activity measurement, and medical & industrial applications.",
    duration: "4 weeks",
    mode: "Online / in person",
    topics: [
      "Dose units and measurement",
      "Radiation protection principles",
      "Isotopes in medicine & industry",
      "Radioactive waste management",
    ],
  },
];

export function coursesFor(lang: "ar" | "en") {
  return lang === "en" ? COURSES_EN : COURSES;
}
