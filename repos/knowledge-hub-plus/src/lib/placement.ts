// Client-safe placement questions (answer key lives server-side).
export type PlacementQuestion = {
  id: string;
  q: { ar: string; en: string };
  options: { ar: string[]; en: string[] };
};

export const PLACEMENT_QUESTIONS: PlacementQuestion[] = [
  {
    id: "q1",
    q: { ar: "ما الذي يحدد العدد الذري للعنصر؟", en: "What determines an element's atomic number?" },
    options: {
      ar: ["عدد النيوترونات", "عدد البروتونات", "عدد البروتونات + النيوترونات", "عدد الإلكترونات التكافؤ"],
      en: ["Number of neutrons", "Number of protons", "Protons + neutrons", "Valence electrons"],
    },
  },
  {
    id: "q2",
    q: { ar: "النظائر هي ذرات لنفس العنصر تختلف في:", en: "Isotopes of the same element differ in:" },
    options: {
      ar: ["عدد البروتونات", "عدد الإلكترونات", "عدد النيوترونات", "الشحنة الكلية"],
      en: ["Number of protons", "Number of electrons", "Number of neutrons", "Total charge"],
    },
  },
  {
    id: "q3",
    q: { ar: "في اضمحلال ألفا، ينقص العدد الكتلي بمقدار:", en: "In alpha decay, the mass number decreases by:" },
    options: { ar: ["1", "2", "4", "0"], en: ["1", "2", "4", "0"] },
  },
  {
    id: "q4",
    q: { ar: "عينة عمر النصف لها ٥ أيام. كم يتبقى منها بعد ١٥ يومًا؟", en: "A sample has a 5-day half-life. What fraction remains after 15 days?" },
    options: { ar: ["1/2", "1/4", "1/8", "1/16"], en: ["1/2", "1/4", "1/8", "1/16"] },
  },
  {
    id: "q5",
    q: { ar: "أي نوع من الإشعاع له أعلى قدرة اختراق؟", en: "Which radiation has the highest penetrating power?" },
    options: { ar: ["ألفا", "بيتا", "جاما", "كلها متساوية"], en: ["Alpha", "Beta", "Gamma", "All equal"] },
  },
  {
    id: "q6",
    q: { ar: "ما وظيفة المهدّئ (Moderator) في المفاعل الحراري؟", en: "What is the role of the moderator in a thermal reactor?" },
    options: {
      ar: ["امتصاص كل النيوترونات", "إبطاء النيوترونات السريعة", "تبريد قلب المفاعل فقط", "زيادة كتلة الوقود"],
      en: ["Absorb all neutrons", "Slow down fast neutrons", "Only cool the core", "Increase fuel mass"],
    },
  },
  {
    id: "q7",
    q: { ar: "وحدة السيفرت (Sv) تقيس:", en: "The sievert (Sv) measures:" },
    options: {
      ar: ["النشاط الإشعاعي", "الجرعة المكافئة/الفعالة", "طاقة الجسيم", "عمر النصف"],
      en: ["Radioactivity", "Equivalent/effective dose", "Particle energy", "Half-life"],
    },
  },
  {
    id: "q8",
    q: { ar: "مبدأ ALARA في الحماية الإشعاعية يعني:", en: "The ALARA principle in radiation protection means:" },
    options: {
      ar: ["أقل جرعة ممكنة بشكل معقول", "منع أي تعرض نهائيًا", "أعلى جرعة مسموحة", "قياس الجرعة سنويًا"],
      en: ["As low as reasonably achievable", "Zero exposure always", "Maximum allowed dose", "Measure dose yearly"],
    },
  },
];

export type PlacementResult =
  | {
      ok: true;
      score: number;
      total: number;
      level: string;
      courseId: "fundamentals" | "reactors" | "safety" | "private";
      summary: string;
      tips: string[];
    }
  | { ok: false; error: string };
