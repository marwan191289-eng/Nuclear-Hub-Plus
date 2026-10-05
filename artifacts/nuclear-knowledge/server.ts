import express from "express";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));

const ADMIN_SESSION_COOKIE = "nuclear_admin_session";
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const STUDENT_COUNTER_EPOCH = Date.UTC(2026, 9, 5, 0, 0, 0);
const HOUR_MS = 60 * 60 * 1000;

type StudentRecord = {
  id: string;
  name: string;
  email: string;
  course: string;
  progress: number;
  attendance: number;
  quizAvg: number;
  status: "نشط" | "معلق";
};

const ADMIN_STUDENTS: StudentRecord[] = [
  { id: "st-1", name: "أحمد بن خالد السعدون", email: "ahmed.k@kfupm.edu.sa", course: "التفاعلات والمفاعلات النووية", progress: 85, attendance: 96, quizAvg: 94, status: "نشط" },
  { id: "st-2", name: "نورة بنت عبد العزيز الدوسري", email: "noura.d@ksu.edu.sa", course: "أساسيات الكيمياء النووية", progress: 100, attendance: 100, quizAvg: 98, status: "نشط" },
  { id: "st-3", name: "عمر فهد المطيري", email: "omar.f@iau.edu.sa", course: "السلامة الإشعاعية والوقاية", progress: 70, attendance: 88, quizAvg: 89, status: "نشط" },
  { id: "st-4", name: "ريم بنت سلطان العتيبي", email: "reem.s@kau.edu.sa", course: "التفاعلات والمفاعلات النووية", progress: 45, attendance: 92, quizAvg: 85, status: "نشط" },
  { id: "st-5", name: "سعود بن فيصل الشمري", email: "saud.sh@qu.edu.sa", course: "أساسيات الكيمياء النووية", progress: 60, attendance: 84, quizAvg: 79, status: "نشط" },
];

const ADMIN_PARENT_REPORT = {
  studentName: "أحمد بن خالد السعدون",
  attendance: 96,
  quizAvg: 94,
  week: 4,
  remarks:
    "يُظهر الطالب فهماً جيداً لموضوعات المقرر ويشارك بفاعلية في الأنشطة التعليمية.",
  recommendations: [
    "الاستمرار في مراجعة البطاقات التعليمية.",
    "حل مزيد من المسائل قبل الاختبار النهائي.",
  ],
};

// Initialize GoogleGenAI client server-side with required User-Agent
const apiKey = process.env.GEMINI_API_KEY || "";
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    })
  : null;

function hourlyStudentGrowth(hourIndex: number): number {
  // A stable, varied hourly pattern: some quiet hours, mostly 1–2 students,
  // occasional 3-student hours, and never more than three in one hour.
  const seed = (hourIndex * 9301 + 49297) % 233280;
  const value = seed / 233280;
  if (value < 0.18) return 0;
  if (value < 0.62) return 1;
  if (value < 0.9) return 2;
  return 3;
}

export function calculateRealisticStudentCount(now = Date.now()): {
  count: number;
  lastHourIncrease: number;
  nextIncrementMinutes: number;
} {
  const elapsedMs = Math.max(0, now - STUDENT_COUNTER_EPOCH);
  const completedHours = Math.floor(elapsedMs / HOUR_MS);
  const elapsedInCurrentHour = elapsedMs % HOUR_MS;

  let count = 542;
  for (let hour = 0; hour < completedHours; hour += 1) {
    count += hourlyStudentGrowth(hour);
  }

  return {
    count,
    lastHourIncrease:
      completedHours > 0 ? hourlyStudentGrowth(completedHours - 1) : 0,
    nextIncrementMinutes: Math.ceil(
      (HOUR_MS - elapsedInCurrentHour) / (60 * 1000),
    ),
  };
}

// API: Realistic live stats
app.get("/api/stats", (_req, res) => {
  const stats = calculateRealisticStudentCount();
  res.setHeader("Cache-Control", "public, max-age=30, s-maxage=30");
  res.json({
    studentsCount: stats.count,
    baseDisplay: "500+",
    lastHourIncrease: stats.lastHourIncrease,
    nextIncrementMinutes: stats.nextIncrementMinutes,
    coursesCount: 12,
    satisfactionRate: "98%",
    experienceYears: "+12",
  });
});

function getRequestCookie(req: Request, name: string): string | undefined {
  const cookieHeader = req.headers.cookie;
  if (!cookieHeader) return undefined;
  const cookie = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  return cookie?.slice(name.length + 1);
}

function getAuthConfig() {
  const password = process.env.ADMIN_PANEL_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!password || !sessionSecret || Buffer.byteLength(sessionSecret) < 32) {
    return null;
  }
  return { password, sessionSecret };
}

function isAdminSessionValid(req: Request): boolean {
  const config = getAuthConfig();
  const token = getRequestCookie(req, ADMIN_SESSION_COOKIE);
  if (!config || !token) return false;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expectedSignature = createHmac("sha256", config.sessionSecret)
    .update(payload)
    .digest("base64url");
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return false;
  }

  try {
    const session = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    return typeof session.exp === "number" && session.exp > Date.now();
  } catch {
    return false;
  }
}

function setAdminSessionCookie(res: Response): void {
  const config = getAuthConfig();
  if (!config) return;

  const payload = Buffer.from(
    JSON.stringify({ exp: Date.now() + ADMIN_SESSION_TTL_MS }),
  ).toString("base64url");
  const signature = createHmac("sha256", config.sessionSecret)
    .update(payload)
    .digest("base64url");
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(ADMIN_SESSION_TTL_MS / 1000)}${secure ? "; Secure" : ""}`,
  );
}

function clearAdminSessionCookie(res: Response): void {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`,
  );
}

const failedLoginAttempts = new Map<
  string,
  { count: number; resetAt: number }
>();

function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const current = failedLoginAttempts.get(ip);
  if (current && current.resetAt <= Date.now()) {
    failedLoginAttempts.delete(ip);
  } else if (current && current.count >= 5) {
    res.setHeader(
      "Retry-After",
      Math.max(1, Math.ceil((current.resetAt - Date.now()) / 1000)),
    );
    res.status(429).json({ error: "Too many login attempts. Try again later." });
    return;
  }
  next();
}

function recordFailedLogin(ip: string) {
  if (failedLoginAttempts.size >= 10000) {
    for (const [address, entry] of failedLoginAttempts) {
      if (entry.resetAt <= Date.now()) failedLoginAttempts.delete(address);
    }
  }
  const current = failedLoginAttempts.get(ip);
  if (!current || current.resetAt <= Date.now()) {
    failedLoginAttempts.set(ip, { count: 1, resetAt: Date.now() + 15 * 60 * 1000 });
    return;
  }
  current.count += 1;
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!getAuthConfig()) {
    res.status(503).json({ error: "Admin authentication is not configured." });
    return;
  }
  if (!isAdminSessionValid(req)) {
    res.status(401).json({ error: "Admin authentication required." });
    return;
  }
  res.setHeader("Cache-Control", "private, no-store");
  next();
}

app.get("/api/admin/session", (req, res) => {
  if (!getAuthConfig()) {
    res.status(503).json({ error: "Admin authentication is not configured." });
    return;
  }
  res.setHeader("Cache-Control", "private, no-store");
  res.json({ authenticated: isAdminSessionValid(req) });
});

app.post("/api/admin/login", loginRateLimit, (req, res) => {
  const config = getAuthConfig();
  if (!config) {
    res.status(503).json({ error: "Admin authentication is not configured." });
    return;
  }
  const candidate =
    typeof req.body?.password === "string" ? req.body.password : "";
  if (candidate.length < 1 || candidate.length > 256) {
    res.status(400).json({ error: "A valid password is required." });
    return;
  }

  const suppliedDigest = createHash("sha256").update(candidate).digest();
  const expectedDigest = createHash("sha256").update(config.password).digest();
  if (!timingSafeEqual(suppliedDigest, expectedDigest)) {
    recordFailedLogin(req.ip || req.socket.remoteAddress || "unknown");
    res.status(401).json({ error: "Invalid administrator password." });
    return;
  }

  failedLoginAttempts.delete(req.ip || req.socket.remoteAddress || "unknown");
  setAdminSessionCookie(res);
  res.setHeader("Cache-Control", "private, no-store");
  res.json({ authenticated: true });
});

app.post("/api/admin/logout", (_req, res) => {
  clearAdminSessionCookie(res);
  res.status(204).end();
});

app.get("/api/admin/students", requireAdmin, (_req, res) => {
  res.json(ADMIN_STUDENTS);
});

app.get("/api/admin/parent-report", requireAdmin, (_req, res) => {
  res.json(ADMIN_PARENT_REPORT);
});

// API: AI Study Plan Generator using Gemini 3.8 Flash
app.post("/api/ai/study-plan", async (req, res) => {
  try {
    const body = req.body && typeof req.body === "object" ? req.body : {};
    const readText = (value: unknown, fallback: string, maxLength: number) =>
      typeof value === "string" && value.trim()
        ? value.trim().slice(0, maxLength)
        : fallback;
    const goal = readText(body.goal, "إتقان الكيمياء النووية والاستعداد للاختبارات الجامعية والتحصيلي", 240);
    const level = readText(body.level, "متوسط", 80);
    const availableHours = readText(body.availableHours, "6-8 ساعات", 80);
    const interests = readText(body.interests, "حسابات عمر النصف، معادلات الانشطار، تصميم قلب المفاعل، السلامة الإشعاعية", 240);
    const durationValue = Number(body.durationWeeks);
    const durationWeeks =
      Number.isInteger(durationValue) && durationValue >= 1 && durationValue <= 12
        ? durationValue
        : 6;

    const lang = body.language === "en" ? "en" : "ar";
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

    if (ai) {
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
  } catch (error) {
    console.error("AI Study Plan Error:", error);
    res.status(500).json({ error: "Failed to generate study plan." });
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
    app.use(express.static(path.resolve(__dirname, "dist", "public")));
    app.get("*", (_req, res) => {
      res.sendFile(path.resolve(__dirname, "dist", "public", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

if (process.env.VERCEL !== "1") {
  void startServer();
}
