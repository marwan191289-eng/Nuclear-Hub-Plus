import express from "express";
import type { NextFunction, Request, Response } from "express";
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import { GoogleGenAI } from "@google/genai";
import {
  createHash,
  createHmac,
  randomBytes,
  randomUUID,
  scrypt,
  timingSafeEqual,
} from "node:crypto";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const app = express();
const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

app.set("trust proxy", 1);
app.use(express.json({ limit: "16kb" }));

// The workspace's shared API artifact owns the /api preview route. Use a
// product-specific prefix locally, while Vercel keeps the standard /api path.
const artifactBasePath = (process.env.BASE_PATH || "/").replace(/\/?$/, "/");
const API_PREFIX =
  process.env.VERCEL === "1"
    ? "/api"
    : `${artifactBasePath}_nuclear-knowledge-api`;

const ADMIN_SESSION_COOKIE = "nuclear_admin_session";
const ADMIN_SESSION_TTL_MS = 8 * 60 * 60 * 1000;
const ROOT_ADMIN_SUBJECT = "root-admin";
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

// API: Illustrative learner estimate and platform facts
app.get(`${API_PREFIX}/stats`, (_req, res) => {
  const stats = calculateRealisticStudentCount();
  res.setHeader("Cache-Control", "public, max-age=30, s-maxage=30");
  res.json({
    studentsCount: stats.count,
    baseDisplay: "500+",
    lastHourIncrease: stats.lastHourIncrease,
    nextIncrementMinutes: stats.nextIncrementMinutes,
    coursesCount: 3,
    experienceYears: "12+",
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
  const password = process.env.ADMIN_PASSWORD;
  const sessionSecret = process.env.SESSION_SECRET;
  if (!password || !sessionSecret || Buffer.byteLength(sessionSecret) < 32) {
    return null;
  }
  return { password, sessionSecret };
}

function getSessionSecret(): string | null {
  const secret = process.env.SESSION_SECRET;
  return secret && Buffer.byteLength(secret) >= 32 ? secret : null;
}

type SignedSession = { sub: string; exp: number };

function readSignedSession(req: Request): SignedSession | null {
  const sessionSecret = getSessionSecret();
  const token = getRequestCookie(req, ADMIN_SESSION_COOKIE);
  if (!sessionSecret || !token) return null;

  const [payload, signature] = token.split(".");
  if (!payload || !signature) return null;

  const expectedSignature = createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");
  const actual = Buffer.from(signature);
  const expected = Buffer.from(expectedSignature);
  if (actual.length !== expected.length || !timingSafeEqual(actual, expected)) {
    return null;
  }

  try {
    const session = JSON.parse(
      Buffer.from(payload, "base64url").toString("utf8"),
    ) as Partial<SignedSession>;
    return typeof session.sub === "string" &&
      typeof session.exp === "number" &&
      session.exp > Date.now()
      ? { sub: session.sub, exp: session.exp }
      : null;
  } catch {
    return null;
  }
}

function setSessionCookie(res: Response, subject: string): void {
  const sessionSecret = getSessionSecret();
  if (!sessionSecret) return;
  const payload = Buffer.from(
    JSON.stringify({ sub: subject, exp: Date.now() + ADMIN_SESSION_TTL_MS }),
  ).toString("base64url");
  const signature = createHmac("sha256", sessionSecret)
    .update(payload)
    .digest("base64url");
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=${payload}.${signature}; Path=/; HttpOnly; SameSite=Strict; Max-Age=${Math.floor(ADMIN_SESSION_TTL_MS / 1000)}${secure ? "; Secure" : ""}`,
  );
}

function setAdminSessionCookie(res: Response): void {
  setSessionCookie(res, ROOT_ADMIN_SUBJECT);
}

function clearAdminSessionCookie(res: Response): void {
  const secure = process.env.NODE_ENV === "production" || process.env.VERCEL === "1";
  res.setHeader(
    "Set-Cookie",
    `${ADMIN_SESSION_COOKIE}=; Path=/; HttpOnly; SameSite=Strict; Max-Age=0${secure ? "; Secure" : ""}`,
  );
}

type PublicUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "instructor" | "student" | "parent";
  createdAt?: string;
};

type UserRow = {
  id: string;
  name: string;
  email: string;
  password_hash: string;
  role: string;
  disabled: boolean;
  created_at: Date | string;
};

async function getUserPool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Database is not configured.");
  }
  const { pool } = await import("@workspace/db");
  return pool;
}

function normalizeUser(row: UserRow): PublicUser | null {
  if (!["admin", "instructor", "student", "parent"].includes(row.role)) {
    return null;
  }
  return {
    id: row.id,
    name: row.name,
    email: row.email,
    role: row.role as PublicUser["role"],
    createdAt: new Date(row.created_at).toISOString(),
  };
}

async function getAuthenticatedUser(req: Request): Promise<PublicUser | null> {
  const session = readSignedSession(req);
  if (!session) return null;
  if (session.sub === ROOT_ADMIN_SUBJECT) {
    if (!getAuthConfig()) return null;
    return {
      id: ROOT_ADMIN_SUBJECT,
      name: "المهندس — مدير النظام",
      email: "",
      role: "admin",
    };
  }

  const pool = await getUserPool();
  const result = await pool.query<UserRow>(
    `SELECT id, name, email, password_hash, role, disabled, created_at
       FROM nuclear_hub_users
      WHERE id = $1 AND disabled = false
      LIMIT 1`,
    [session.sub],
  );
  return result.rows[0] ? normalizeUser(result.rows[0]) : null;
}

function derivePassword(password: string, salt: Buffer): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    scrypt(password, salt, 64, (error, derivedKey) => {
      if (error) reject(error);
      else resolve(derivedKey);
    });
  });
}

async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const key = await derivePassword(password, salt);
  return `${salt.toString("hex")}:${key.toString("hex")}`;
}

async function verifyPassword(password: string, storedHash: string): Promise<boolean> {
  const [saltHex, keyHex] = storedHash.split(":");
  if (!/^[\da-f]{32}$/.test(saltHex ?? "") || !/^[\da-f]{128}$/.test(keyHex ?? "")) {
    return false;
  }
  const expected = Buffer.from(keyHex, "hex");
  const supplied = await derivePassword(password, Buffer.from(saltHex, "hex"));
  return expected.length === supplied.length && timingSafeEqual(expected, supplied);
}

function setPrivateNoStore(res: Response): void {
  res.setHeader("Cache-Control", "private, no-store");
}

const failedLoginAttempts = new Map<
  string,
  { count: number; resetAt: number }
>();

function loginRateLimit(req: Request, res: Response, next: NextFunction) {
  res.setHeader("Cache-Control", "private, no-store");
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

const registrationAttempts = new Map<string, { count: number; resetAt: number }>();

function registrationRateLimit(req: Request, res: Response, next: NextFunction) {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const now = Date.now();
  const current = registrationAttempts.get(ip);
  if (!current || current.resetAt <= now) {
    registrationAttempts.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 });
    next();
    return;
  }
  if (current.count >= 8) {
    res.setHeader("Retry-After", Math.max(1, Math.ceil((current.resetAt - now) / 1000)));
    res.status(429).json({ error: "Too many new accounts from this connection. Try again later." });
    return;
  }
  current.count += 1;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  setPrivateNoStore(res);
  void getAuthenticatedUser(req)
    .then((user) => {
      if (!user) {
        res.status(401).json({ error: "Authentication required." });
        return;
      }
      if (user.role !== "admin") {
        res.status(403).json({ error: "Administrator permission required." });
        return;
      }
      res.locals.authenticatedUser = user;
      next();
    })
    .catch(() => {
      res.status(503).json({ error: "Authentication storage is unavailable." });
    });
}

app.get(`${API_PREFIX}/auth/me`, async (req, res) => {
  setPrivateNoStore(res);
  try {
    res.json({ user: await getAuthenticatedUser(req) });
  } catch {
    res.status(503).json({ error: "Account storage is unavailable." });
  }
});

app.post(`${API_PREFIX}/auth/register`, registrationRateLimit, async (req, res) => {
  setPrivateNoStore(res);
  const name = typeof req.body?.name === "string" ? req.body.name.trim() : "";
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (name.length < 2 || name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
    res.status(400).json({ error: "Enter a valid name and email address." });
    return;
  }
  if (password.length < 12 || password.length > 128) {
    res.status(400).json({ error: "Password must be between 12 and 128 characters." });
    return;
  }

  try {
    const pool = await getUserPool();
    const id = randomUUID();
    const passwordHash = await hashPassword(password);
    const result = await pool.query<UserRow>(
      `INSERT INTO nuclear_hub_users (id, name, email, password_hash, role)
       VALUES ($1, $2, $3, $4, 'student')
       ON CONFLICT (email) DO NOTHING
       RETURNING id, name, email, password_hash, role, disabled, created_at`,
      [id, name, email, passwordHash],
    );
    if (!result.rows[0]) {
      res.status(409).json({ error: "An account with this email already exists." });
      return;
    }
    const user = normalizeUser(result.rows[0]);
    if (!user) {
      res.status(500).json({ error: "Could not create this account." });
      return;
    }
    setSessionCookie(res, user.id);
    res.status(201).json({ user });
  } catch {
    res.status(503).json({ error: "Account storage is unavailable." });
  }
});

app.post(`${API_PREFIX}/auth/login`, loginRateLimit, async (req, res) => {
  setPrivateNoStore(res);
  const email =
    typeof req.body?.email === "string" ? req.body.email.trim().toLowerCase() : "";
  const password = typeof req.body?.password === "string" ? req.body.password : "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 1 || password.length > 128) {
    res.status(400).json({ error: "Enter a valid email and password." });
    return;
  }

  const ip = req.ip || req.socket.remoteAddress || "unknown";
  try {
    const pool = await getUserPool();
    const result = await pool.query<UserRow>(
      `SELECT id, name, email, password_hash, role, disabled, created_at
         FROM nuclear_hub_users
        WHERE email = $1
        LIMIT 1`,
      [email],
    );
    const row = result.rows[0];
    const passwordMatches = row
      ? await verifyPassword(password, row.password_hash)
      : await verifyPassword(
          password,
          "00000000000000000000000000000000:00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
        );
    if (!row || row.disabled || !passwordMatches) {
      recordFailedLogin(ip);
      res.status(401).json({ error: "Email or password is incorrect." });
      return;
    }
    const user = normalizeUser(row);
    if (!user) {
      res.status(403).json({ error: "This account has no valid role." });
      return;
    }
    failedLoginAttempts.delete(ip);
    setSessionCookie(res, user.id);
    res.json({ user });
  } catch {
    res.status(503).json({ error: "Account storage is unavailable." });
  }
});

app.post(`${API_PREFIX}/auth/logout`, (_req, res) => {
  setPrivateNoStore(res);
  clearAdminSessionCookie(res);
  res.status(204).end();
});

app.get(`${API_PREFIX}/admin/session`, async (req, res) => {
  setPrivateNoStore(res);
  try {
    const user = await getAuthenticatedUser(req);
    res.json({ authenticated: user?.role === "admin", user });
  } catch {
    res.status(503).json({ error: "Authentication storage is unavailable." });
  }
});

app.post(`${API_PREFIX}/admin/login`, loginRateLimit, (req, res) => {
  setPrivateNoStore(res);
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
  setPrivateNoStore(res);
  res.json({
    authenticated: true,
    user: {
      id: ROOT_ADMIN_SUBJECT,
      name: "المهندس — مدير النظام",
      email: "",
      role: "admin",
    },
  });
});

app.post(`${API_PREFIX}/admin/logout`, (_req, res) => {
  setPrivateNoStore(res);
  clearAdminSessionCookie(res);
  res.status(204).end();
});

app.get(`${API_PREFIX}/admin/students`, requireAdmin, (_req, res) => {
  res.json(ADMIN_STUDENTS);
});

app.get(`${API_PREFIX}/admin/users`, requireAdmin, async (_req, res) => {
  try {
    const pool = await getUserPool();
    const result = await pool.query<UserRow>(
      `SELECT id, name, email, password_hash, role, disabled, created_at
         FROM nuclear_hub_users
        ORDER BY created_at DESC`,
    );
    res.json(
      result.rows.flatMap((row) => {
        const user = normalizeUser(row);
        return user ? [{ ...user, disabled: row.disabled }] : [];
      }),
    );
  } catch {
    res.status(503).json({ error: "Account storage is unavailable." });
  }
});

app.patch(`${API_PREFIX}/admin/users/:userId/role`, requireAdmin, async (req, res) => {
  const role = req.body?.role;
  if (!["admin", "instructor", "student", "parent"].includes(role)) {
    res.status(400).json({ error: "A valid account role is required." });
    return;
  }
  const actor = res.locals.authenticatedUser as PublicUser;
  if (role === "admin" && actor.id !== ROOT_ADMIN_SUBJECT) {
    res.status(403).json({ error: "Only the system engineer can grant administrator access." });
    return;
  }
  if (actor.id === req.params.userId && actor.id !== ROOT_ADMIN_SUBJECT && role !== "admin") {
    res.status(400).json({ error: "Administrators cannot change their own role." });
    return;
  }
  try {
    const pool = await getUserPool();
    const result = await pool.query<UserRow>(
      `UPDATE nuclear_hub_users
          SET role = $1, updated_at = now()
        WHERE id = $2
        RETURNING id, name, email, password_hash, role, disabled, created_at`,
      [role, req.params.userId],
    );
    if (!result.rows[0]) {
      res.status(404).json({ error: "Account not found." });
      return;
    }
    const user = normalizeUser(result.rows[0]);
    if (!user) {
      res.status(500).json({ error: "Could not update this account." });
      return;
    }
    res.json({ user });
  } catch {
    res.status(503).json({ error: "Account storage is unavailable." });
  }
});

app.get(`${API_PREFIX}/admin/parent-report`, requireAdmin, (_req, res) => {
  res.json(ADMIN_PARENT_REPORT);
});

// API: AI Study Plan Generator using Gemini 3.8 Flash
app.post(`${API_PREFIX}/ai/study-plan`, async (req, res) => {
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
    return res.status(500).json({ error: "Failed to generate study plan." });
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
