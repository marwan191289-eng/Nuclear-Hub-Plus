import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.use(express.json());

// Initialize GoogleGenAI client server-side with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = new GoogleGenAI({
  apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Realistic Student Counter Generator
// User requested: "الجزء الي فيه 500+ زي تايمر بيزيد بس بشكل مصدق مش غير معقول يعني خليه بيزيد 1:2 في الساعة مثلاً ومرة 1 بس في الساعة ومرة 3 ساعة ومأوقات لأ بحيث يبقى مصدق"
function calculateRealisticStudentCount(): { count: number; lastHourIncrease: number; nextIncrementMinutes: number } {
  // Base anchor: 2026-09-01T00:00:00Z
  const anchorTime = new Date("2026-09-01T00:00:00Z").getTime();
  const now = Date.now();
  const hoursElapsed = Math.max(0, Math.floor((now - anchorTime) / (1000 * 60 * 60)));

  let count = 500;
  let lastHourIncrease = 1;

  // Pseudo-random deterministic walk based on hour hashes
  for (let h = 0; h < hoursElapsed; h++) {
    const pseudoSeed = (h * 9301 + 49297) % 233280;
    const rand = pseudoSeed / 233280;
    let add = 1;
    if (rand < 0.18) {
      add = 0; // quiet hour / night
    } else if (rand < 0.62) {
      add = 1; // standard
    } else if (rand < 0.90) {
      add = 2; // active
    } else {
      add = 3; // rush hour peak
    }
    count += add;
    if (h === hoursElapsed - 1) {
      lastHourIncrease = add;
    }
  }

  // Minutes into current hour
  const minutesIntoHour = Math.floor((now % (1000 * 60 * 60)) / (1000 * 60));
  const nextIncrementMinutes = 60 - minutesIntoHour;

  return {
    count,
    lastHourIncrease,
    nextIncrementMinutes,
  };
}

// API: Realistic live stats
app.get("/api/stats", (_req, res) => {
  const stats = calculateRealisticStudentCount();
  res.json({
    studentsCount: stats.count,
    baseDisplay: "500+",
    lastHourIncrease: stats.lastHourIncrease,
    nextIncrementMinutes: stats.nextIncrementMinutes,
    coursesCount: 12,
    satisfactionRate: "98%",
    experienceYears: "+5",
  });
});

// API: AI Study Plan Generator using Gemini 3.8 Flash
app.post("/api/ai/study-plan", async (req, res) => {
  try {
    const { goal, level, availableHours, interests, durationWeeks, language } = req.body;

    const lang = language === "en" ? "en" : "ar";
    const prompt = lang === "en"
      ? `Generate a highly structured, realistic, and inspiring Nuclear Chemistry & Reactor Engineering Study Plan for a student.
Student Profile:
- Primary Goal: ${goal || "Master Nuclear Chemistry & Reactor Physics"}
- Current Level: ${level || "Intermediate"}
- Weekly Available Study Hours: ${availableHours || "6-8 hours"}
- Key Focus Areas: ${interests || "Nuclear Reactions, Half-life calculations, Reactor types and radiation protection"}
- Target Timeline: ${durationWeeks || 6} weeks

Provide a complete personalized study schedule.
Include:
1. "planTitle": Catchy academic title for the plan
2. "overview": Brief summary and motivational tip from Instructor Eng. Mahmoud Shaltoot
3. "weeklyRoadmap": Array of ${durationWeeks || 6} weeks, each with:
   - "weekNumber": number
   - "title": week topic
   - "objectives": string array
   - "suggestedHours": number
   - "spacedRepetitionCards": 2-3 flashcard review terms
4. "recommendedCourses": List of 2 courses from: "Nuclear Chemistry Fundamentals", "Nuclear Reactions & Reactors", "Radiation Safety & Isotopes"
5. "practicalChecklist": 3 key milestones (e.g., Reactor Core simulation exercise, decay formula calculation mastery, safety shielding quiz)
6. "instructorAdvice": Quote with pedagogical advice from Eng. Mahmoud Shaltoot.

Return strictly valid JSON without markdown quotes.`
      : `قم بإنشاء خطة مذاكرة ذكية ومفصلة وشخصية لمادة الكيمياء النووية وهندسة المفاعلات بإشراف المدرب المهندس محمود إسماعيل شلتوت.
بيانات الطالب:
- الهدف الدراسي: ${goal || "إتقان الكيمياء النووية والاستعداد للاختبارات الجامعية والتحصيلي"}
- المستوى الحالي: ${level || "متوسط"}
- ساعات المذاكرة الأسبوعية المتاحة: ${availableHours || "6-8 ساعات"}
- مجالات التركيز والاهتمام: ${interests || "حسابات عمر النصف، معادلات الانشطار، تصميم قلب المفاعل، السلامة الإشعاعية"}
- المدة المستهدفة: ${durationWeeks || 6} أسابيع

أخرج الناتج بصيغة JSON نقية ومباشرة بدون علامات تفافية markdown، تحتوي على:
1. "planTitle": عنوان جذاب وشخصي للخطة
2. "overview": نبذة محفزة توضح استراتيجية المذاكرة ونصيحة مخصصة
3. "weeklyRoadmap": مصفوفة تحتوي تفاصيل كل أسبوع (من 1 إلى ${durationWeeks || 6}):
   - "weekNumber": رقم الأسبوع
   - "title": موضوع الأسبوع
   - "objectives": مصفوفة بالأهداف المحددة
   - "suggestedHours": عدد الساعات المقترحة
   - "spacedRepetitionCards": بطاقات المراجعة المتباعدة الموصى بها (مصطلحات وقوانين)
4. "recommendedCourses": أسماء الدورات المناسبة من المنصة ("أساسيات الكيمياء النووية", "التفاعلات النووية والمفاعلات", "السلامة الإشعاعية والنظائر")
5. "practicalChecklist": أهم 3 إنجازات وتطبيقات عملية (مثل: محاكاة قلب المفاعل، مسائل طاقة الربط النووي، حسابات التدريع الإشعاعي)
6. "instructorAdvice": نصيحة وتوجيه ذهبي من المهندس محمود شلتوت للالتزام بالخطة`;

    if (process.env.GEMINI_API_KEY) {
      try {
        const response = await ai.models.generateContent({
          model: "gemini-3.8-flash",
          contents: prompt,
          config: {
            systemInstruction: "You are an expert Nuclear Chemical Engineer and Academic Mentor for Eng. Mahmoud Shaltoot's Nuclear Academy. Always output clean, valid, professional JSON without markdown wrapping.",
            responseMimeType: "application/json",
            temperature: 0.7,
          },
        });

        const text = response.text || "";
        try {
          const parsed = JSON.parse(text);
          return res.json({ success: true, plan: parsed });
        } catch {
          const cleanText = text.replace(/```json/g, "").replace(/```/g, "").trim();
          const parsed = JSON.parse(cleanText);
          return res.json({ success: true, plan: parsed });
        }
      } catch (geminiErr) {
        console.warn("Gemini upstream transient issue, using intelligent curriculum generator:", geminiErr);
        // Seamlessly continue to fallback generator below
      }
    }

    // High-quality resilient curriculum generator
    return res.json({
      success: true,
      isFallback: true,
      plan: {
        planTitle: lang === "en" ? "Nuclear Chemistry Mastery Blueprint" : "خطة الإتقان الشامل في الكيمياء النووية والمفاعلات",
        overview: lang === "en" 
          ? "A structured roadmap combining fundamental isotope chemistry with practical reactor simulation."
          : `خطة دراسية شخصية مخصصة لهدف: (${goal || "الكيمياء النووية"}) بمعدل (${availableHours || "6 ساعات أسبوعياً"})، تم إعدادها بإشراف المهندس محمود شلتوت.`,
        weeklyRoadmap: [
          {
            weekNumber: 1,
            title: lang === "en" ? "Nuclear Structure & Binding Energy" : "بنية النواة وطاقة الربط النووي",
            objectives: [
              lang === "en" ? "Calculate mass defect and nuclear binding energy (E=mc²)" : "حساب نقص الكتلة وطاقة الربط النووي لمعادلة أينشتاين",
              lang === "en" ? "Understand proton-to-neutron ratio and stability curve" : "دراسة نسبة النيوترونات إلى البروتونات وحزام الاستقرار"
            ],
            suggestedHours: 6,
            spacedRepetitionCards: ["طاقة الربط النووي", "حزام الاستقرار", "نقص الكتلة"]
          },
          {
            weekNumber: 2,
            title: lang === "en" ? "Radioactive Decay Modes (Alpha, Beta, Gamma)" : "أنماط الاضمحلال الإشعاعي (ألفا، بيتا، جاما)",
            objectives: [
              lang === "en" ? "Write and balance nuclear equations" : "كتابة وموازنة المعادلات النووية بدقة",
              lang === "en" ? "Understand penetration power and shielding materials" : "التمييز بين قدرة الاختراق والتدريع المناسب لكل إشعاع"
            ],
            suggestedHours: 7,
            spacedRepetitionCards: ["اضمحلال بيتا الموجب والسالب", "جسيمات ألفا", "أشعة جاما"]
          },
          {
            weekNumber: 3,
            title: lang === "en" ? "Half-life & Radioactive Dating Calculations" : "حسابات عمر النصف والتأريخ الإشعاعي",
            objectives: [
              lang === "en" ? "Master continuous decay formula N = N0 * e^(-λt)" : "إتقان قانون عمر النصف بالصيغة الأسية والتطبيقية",
              lang === "en" ? "Solve real-world carbon-14 and medical isotope problems" : "حل مسائل عملية على الكربون-14 والنظائر الطبية"
            ],
            suggestedHours: 8,
            spacedRepetitionCards: ["ثابت الاضمحلال λ", "عمر النصف T_1/2", "النشاطية الإشعاعية (Becquerel)"]
          },
          {
            weekNumber: 4,
            title: lang === "en" ? "Nuclear Fission & Reactor Core Dynamics" : "الانشطار النووي وديناميكا قلب المفاعل",
            objectives: [
              lang === "en" ? "Chain reaction kinetics and critical mass" : "آلية التفاعل المتسلسل والكتلة الحرجة",
              lang === "en" ? "Function of fuel rods (U-235), control rods, and moderators" : "دور قضبان الوقود والتحكم والمهدئ في المفاعل"
            ],
            suggestedHours: 8,
            spacedRepetitionCards: ["اليورانيوم 235", "عامل التكاثر k", "قضبان التحكم من الكادميوم والبورون"]
          },
          {
            weekNumber: 5,
            title: lang === "en" ? "Radiation Protection & Safety Principles" : "مبادئ الوقاية الإشعاعية والسلامة النووية",
            objectives: [
              lang === "en" ? "ALARA principle (Time, Distance, Shielding)" : "تطبيق مبدأ ALARA (الوقت، المسافة، التدريع)",
              lang === "en" ? "Absorbed dose vs. equivalent dose (Gy & Sv)" : "التمييز بين الجرعة الممتصة والمكافئة (جراي وسيفيرت)"
            ],
            suggestedHours: 6,
            spacedRepetitionCards: ["مبدأ ALARA", "وحدة السيفيرت Sievert", "حدود الجرعة المهنية"]
          },
          {
            weekNumber: 6,
            title: lang === "en" ? "Comprehensive Exam & Practical Simulation" : "المراجعة النهائية والمحاكاة العملية",
            objectives: [
              lang === "en" ? "Simulate reactor startup and emergency shutdown (SCRAM)" : "محاكاة تشغيل المفاعل والإيقاف الطارئ (SCRAM)",
              lang === "en" ? "Complete placement milestone assessment with 90%+ accuracy" : "اجتياز الاختبار الشامل بنسبة 90% فما فوق"
            ],
            suggestedHours: 8,
            spacedRepetitionCards: ["إيقاف الطوارئ SCRAM", "السموم النيوترونية (الزينون 135)"]
          }
        ],
        recommendedCourses: [
          "أساسيات الكيمياء النووية",
          "التفاعلات النووية والمفاعلات"
        ],
        practicalChecklist: [
          "حل 50 مسألة نموذجية في عمر النصف وطاقة الربط",
          "إجراء محاكاة ضبط قلب المفاعل وقضبان التحكم",
          "اجتياز اختبار السلامة الإشعاعية والتحصيلي"
        ],
        instructorAdvice: "الكيمياء النووية ليست مجرد حفظ معادلات، بل هي فهم عميق لأسرار الطاقة الكامنة في أدق جسيمات الكون. التزم بجدولك وراجع البطاقات يومياً، وأنا معك خطوة بخطوة."
      }
    });
  } catch (error: any) {
    console.error("AI Study Plan Error:", error);
    res.status(500).json({ error: error.message || "Failed to generate study plan" });
  }
});

// Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, "dist")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

startServer();
