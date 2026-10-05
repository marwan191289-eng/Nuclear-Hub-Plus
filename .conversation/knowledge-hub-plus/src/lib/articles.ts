export type Article = {
  slug: string;
  lang: "ar" | "en";
  title: string;
  description: string;
  category: string;
  date: string; // ISO
  readMinutes: number;
  relatedCourse: "fundamentals" | "reactors" | "safety";
  sections: { h: string; p: string[] }[];
};

export const ARTICLES: Article[] = [
  {
    slug: "half-life-explained",
    lang: "ar",
    title: "عمر النصف ببساطة: الشرح والقانون ومسائل محلولة",
    description: "ملخص مجاني يشرح مفهوم عمر النصف في الكيمياء النووية، مع القانون وطريقة حل المسائل خطوة بخطوة.",
    category: "ملخصات",
    date: "2026-09-20",
    readMinutes: 6,
    relatedCourse: "fundamentals",
    sections: [
      { h: "ما هو عمر النصف؟", p: ["عمر النصف هو الزمن اللازم لاضمحلال نصف عدد الأنوية المشعة في عينة ما. هو ثابت لكل نظير ولا يتأثر بالحرارة أو الضغط أو الحالة الكيميائية."] },
      { h: "القانون الأساسي", p: ["الكمية المتبقية = الكمية الابتدائية × (1/2)^n، حيث n عدد أعمار النصف التي مرّت، أي n = الزمن ÷ عمر النصف.", "ويمكن كتابته أيضًا بالصيغة الأُسّية N = N₀ e^(−λt)، حيث λ = 0.693 ÷ عمر النصف."] },
      { h: "مثال محلول", p: ["عينة كتلتها 80 جرامًا وعمر نصفها 5 أيام. بعد 15 يومًا: n = 15 ÷ 5 = 3، إذن المتبقي = 80 × (1/2)³ = 10 جرامات."] },
      { h: "أخطاء شائعة", p: ["الخلط بين الكمية المتبقية والكمية المضمحلة، ونسيان توحيد وحدات الزمن قبل القسمة."] },
    ],
  },
  {
    slug: "alpha-beta-gamma",
    lang: "ar",
    title: "الفرق بين إشعاع ألفا وبيتا وجاما",
    description: "مقارنة واضحة بين أنواع الإشعاع النووي الثلاثة: الطبيعة والشحنة والقدرة على الاختراق ومعادلات الاضمحلال.",
    category: "مقالات",
    date: "2026-09-12",
    readMinutes: 5,
    relatedCourse: "fundamentals",
    sections: [
      { h: "إشعاع ألفا", p: ["نواة هيليوم (بروتونان ونيوترونان). عند انبعاثها ينقص العدد الذري 2 والعدد الكتلي 4. اختراقها ضعيف وتوقفها ورقة."] },
      { h: "إشعاع بيتا", p: ["إلكترون ينتج عن تحول نيوترون إلى بروتون داخل النواة. يزيد العدد الذري 1 ويبقى العدد الكتلي ثابتًا. يوقفه لوح ألومنيوم رقيق."] },
      { h: "إشعاع جاما", p: ["موجات كهرومغناطيسية عالية الطاقة بدون كتلة أو شحنة، لا تغيّر العدد الذري ولا الكتلي. اختراقها عالٍ وتحتاج رصاصًا أو خرسانة سميكة."] },
    ],
  },
  {
    slug: "how-nuclear-reactor-works",
    lang: "ar",
    title: "كيف يعمل المفاعل النووي؟ ملخص للطلاب",
    description: "ملخص مبسّط لمكوّنات المفاعل النووي: الوقود، المهدّئ، قضبان التحكم، والمبرّد، وكيف يُستخدم الانشطار لإنتاج الكهرباء.",
    category: "ملخصات",
    date: "2026-09-01",
    readMinutes: 7,
    relatedCourse: "reactors",
    sections: [
      { h: "الانشطار المتسلسل", p: ["عندما يمتص اليورانيوم-235 نيوترونًا ينشطر إلى نواتين أصغر ويطلق طاقة ونيوترونين أو ثلاثة، تُكمل التفاعل مع أنوية أخرى."] },
      { h: "المكوّنات الأساسية", p: ["الوقود: قضبان يورانيوم مخصّب. المهدّئ: يبطئ النيوترونات (ماء أو جرافيت). قضبان التحكم: تمتص النيوترونات للتحكم في معدل التفاعل. المبرّد: ينقل الحرارة إلى المولد البخاري."] },
      { h: "من الحرارة إلى الكهرباء", p: ["الحرارة تولّد بخارًا يدير توربينًا متصلًا بمولد كهربائي — تمامًا كمحطة حرارية لكن بمصدر حرارة نووي."] },
    ],
  },
  {
    slug: "half-life-explained-en",
    lang: "en",
    title: "Half-Life Explained: Formula and Worked Problems",
    description: "A free summary of half-life in nuclear chemistry, with the formula and a step-by-step method for solving problems.",
    category: "Summaries",
    date: "2026-09-20",
    readMinutes: 6,
    relatedCourse: "fundamentals",
    sections: [
      { h: "What is half-life?", p: ["Half-life is the time it takes for half of the radioactive nuclei in a sample to decay. It is constant for each isotope and unaffected by temperature, pressure or chemical state."] },
      { h: "The core formula", p: ["Remaining amount = initial amount × (1/2)^n, where n = elapsed time ÷ half-life.", "Equivalently, N = N₀ e^(−λt) with λ = 0.693 ÷ half-life."] },
      { h: "Worked example", p: ["An 80 g sample has a 5-day half-life. After 15 days: n = 3, so 80 × (1/2)³ = 10 g remain."] },
      { h: "Common mistakes", p: ["Confusing the amount remaining with the amount decayed, and not converting time units before dividing."] },
    ],
  },
  {
    slug: "alpha-beta-gamma-en",
    lang: "en",
    title: "Alpha vs Beta vs Gamma Radiation",
    description: "A clear comparison of the three types of nuclear radiation: nature, charge, penetrating power and decay equations.",
    category: "Articles",
    date: "2026-09-12",
    readMinutes: 5,
    relatedCourse: "fundamentals",
    sections: [
      { h: "Alpha radiation", p: ["A helium nucleus (2 protons, 2 neutrons). Atomic number drops by 2 and mass number by 4. Weak penetration — stopped by paper."] },
      { h: "Beta radiation", p: ["An electron produced when a neutron turns into a proton. Atomic number rises by 1, mass number unchanged. Stopped by thin aluminium."] },
      { h: "Gamma radiation", p: ["High-energy electromagnetic waves with no mass or charge. Highly penetrating — needs lead or thick concrete."] },
    ],
  },
  {
    slug: "how-nuclear-reactor-works-en",
    lang: "en",
    title: "How Does a Nuclear Reactor Work? A Student Summary",
    description: "A simple summary of reactor components — fuel, moderator, control rods and coolant — and how fission produces electricity.",
    category: "Summaries",
    date: "2026-09-01",
    readMinutes: 7,
    relatedCourse: "reactors",
    sections: [
      { h: "The chain reaction", p: ["When uranium-235 absorbs a neutron it splits into two smaller nuclei, releasing energy and 2–3 neutrons that continue the reaction."] },
      { h: "Key components", p: ["Fuel: enriched uranium rods. Moderator: slows neutrons (water or graphite). Control rods: absorb neutrons to regulate the rate. Coolant: carries heat to the steam generator."] },
      { h: "From heat to electricity", p: ["Heat makes steam that spins a turbine connected to a generator — like a thermal plant, but with a nuclear heat source."] },
    ],
  },
];

export const articlesFor = (lang: "ar" | "en") => ARTICLES.filter((a) => a.lang === lang);
export const findArticle = (lang: "ar" | "en", slug: string) => ARTICLES.find((a) => a.lang === lang && a.slug === slug);
