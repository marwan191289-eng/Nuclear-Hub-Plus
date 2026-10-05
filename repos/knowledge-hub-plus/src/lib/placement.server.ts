import { createOpenAI } from "@ai-sdk/openai";
import { APICallError, streamText } from "ai";
import { PLACEMENT_QUESTIONS, type PlacementResult } from "./placement";

const ANSWER_KEY: Record<string, number> = { q1: 1, q2: 2, q3: 2, q4: 2, q5: 2, q6: 1, q7: 1, q8: 0 };
const COURSE_IDS = ["fundamentals", "reactors", "safety", "private"] as const;

export async function evaluatePlacement(input: {
  lang: "ar" | "en";
  answers: Record<string, number>;
  background: string;
  goal: string;
}): Promise<PlacementResult> {
  const en = input.lang === "en";
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { ok: false, error: en ? "The evaluator is not configured." : "خدمة التقييم غير مهيأة." };

  const graded = PLACEMENT_QUESTIONS.map((q) => {
    const chosen = input.answers[q.id];
    const correct = ANSWER_KEY[q.id];
    return {
      question: q.q.en,
      chosen: chosen === undefined ? "(skipped)" : q.options.en[chosen] ?? "(invalid)",
      correctAnswer: q.options.en[correct!],
      isCorrect: chosen === correct,
    };
  });
  const score = graded.filter((g) => g.isCorrect).length;

  const prompt = `You are the placement advisor for a nuclear chemistry tutor (Eng. Mahmoud Shaltoot) teaching university students in Saudi Arabia and the Gulf.
Courses:
- fundamentals: Nuclear Chemistry Fundamentals (structure, isotopes, decay, half-life). For beginners.
- reactors: Nuclear Reactions & Reactors (fission/fusion, reactor types, fuel cycle). For students solid on fundamentals.
- safety: Radiation Safety & Isotopes (dose units, protection, medical/industrial isotopes). Advanced.
- private: One-to-one private lessons. Best when goals are very specific (thesis, exam on a narrow topic) or results are mixed.

Student score: ${score}/${graded.length}.
Graded answers (JSON): ${JSON.stringify(graded)}
Student background: ${input.background.slice(0, 500) || "(not given)"}
Student goal: ${input.goal.slice(0, 500) || "(not given)"}

Evaluate the student's level and recommend exactly one course id.
Reply ONLY with a JSON object, no markdown:
{"level": "short level label", "courseId": "fundamentals|reactors|safety|private", "summary": "2-3 encouraging sentences explaining strengths, gaps and why this course", "tips": ["3 short concrete study tips"]}
Write level, summary and tips in ${en ? "English" : "Arabic (clear Modern Standard Arabic)"}. Keep summary under 70 words and each tip under 20 words.`;

  try {
    const provider = createOpenAI({
      baseURL: "https://ai.gateway.lovable.dev/v1",
      apiKey,
      headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    });
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      prompt,
      providerOptions: {
        openai: {
          store: false,
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const text = await result.text;
    const match = text.match(/\{[\s\S]*\}/);
    const parsed = match ? (JSON.parse(match[0]) as Record<string, unknown>) : {};
    const courseId = COURSE_IDS.includes(parsed["courseId"] as never)
      ? (parsed["courseId"] as (typeof COURSE_IDS)[number])
      : score <= 4 ? "fundamentals" : score <= 6 ? "reactors" : "safety";
    const tips = Array.isArray(parsed["tips"]) ? (parsed["tips"] as unknown[]).map(String).slice(0, 4) : [];
    return {
      ok: true,
      score,
      total: graded.length,
      level: String(parsed["level"] ?? ""),
      courseId,
      summary: String(parsed["summary"] ?? ""),
      tips,
    };
  } catch (err) {
    console.error("placement evaluation failed", err);
    const status = APICallError.isInstance(err) ? err.statusCode : undefined;
    if (status === 429) return { ok: false, error: en ? "Too many requests right now. Please try again in a minute." : "طلبات كثيرة حاليًا، حاول بعد دقيقة." };
    if (status === 402) return { ok: false, error: en ? "The AI evaluator is temporarily unavailable." : "خدمة التقييم بالذكاء الاصطناعي غير متاحة مؤقتًا." };
    return { ok: false, error: en ? "We couldn't evaluate your answers. Please try again." : "تعذّر تقييم إجاباتك، حاول مرة أخرى." };
  }
}
