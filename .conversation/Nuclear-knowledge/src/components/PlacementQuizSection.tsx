import React, { useState } from "react";
import { CheckCircle, HelpCircle, RotateCcw, Sparkles } from "lucide-react";

interface PlacementQuizSectionProps {
  onOpenStudyPlan: () => void;
  language: "ar" | "en";
}

const QUIZ_QUESTIONS = [
  {
    q: "ما نوع الاضمحلال الذي ينتج عنه جسيم يحمل شحنة +2 وكتلة 4 وحدة كتل ذرية؟",
    options: ["اضمحلال بيتا الموجب (β+)", "اضمحلال ألفا (α)", "أشعة جاما (γ)", "انبعاث نيوتروني"],
    correct: 1,
    exp: "جسيم ألفا هو نواة ذرة هيليوم-4 تتكون من بروتونين ونيوترونين، وشحنته +2.",
  },
  {
    q: "إذا كانت كتلة النواة الفعلية أقل من مجموع كتل بروتوناتها ونيوتروناتها الحرة، فأين ذهبت الكتلة المفقودة؟",
    options: ["تبخرت بفعل الحرارة", "تحولت إلى طاقة ربط نووي (E = Δm · c²)", "تسرّبت كإلكترونات حرة", "امتصتها النيوترينوات"],
    correct: 1,
    exp: "وفق معادلة أينشتاين، يتحول نقص الكتلة إلى طاقة هائلة تربط مكونات النواة ببعضها.",
  },
  {
    q: "ما هو الدور الأساسي لقضبان التحكم المصنوعة من البورون أو الكادميوم في المفاعل؟",
    options: ["تبريد قلب المفاعل ومنع انصهاره", "امتصاص النيوترونات الفائضة للتحكم في معدل الانشطار", "تسريع النيوترونات لزيادة إنتاج الطاقة", "تخصيب وقود اليورانيوم داخل القلب"],
    correct: 1,
    exp: "البورون والكادميوم يمتلكان قدرة امتصاص عالية للنيوترونات دون انشطار، مما يتيح ضبط أو إيقاف التفاعل.",
  },
  {
    q: "عينة مشعة عمر نصفها 10 ساعات. ما النسبة المئوية المتبقية منها بعد مرور 30 ساعة؟",
    options: ["50%", "25%", "12.5%", "6.25%"],
    correct: 2,
    exp: "عدد أعمار النصف = 30 / 10 = 3. النسبة المتبقية = (1/2)³ = 1/8 = 12.5%.",
  },
];

export function PlacementQuizSection({ onOpenStudyPlan, language }: PlacementQuizSectionProps) {
  const isEn = language === "en";
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [isFinished, setIsFinished] = useState(false);

  const handleSelect = (optionIdx: number) => {
    const nextAnswers = [...selectedAnswers, optionIdx];
    setSelectedAnswers(nextAnswers);

    if (currentIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setIsFinished(true);
    }
  };

  const calculateScore = () => {
    let score = 0;
    selectedAnswers.forEach((ans, i) => {
      if (ans === QUIZ_QUESTIONS[i].correct) score++;
    });
    return score;
  };

  const handleReset = () => {
    setCurrentIdx(0);
    setSelectedAnswers([]);
    setIsFinished(false);
  };

  const score = calculateScore();

  return (
    <section className="py-12 px-6 lg:px-10 max-w-[1240px] mx-auto">
      <div className="rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#060e1d] to-[#040813] p-8 lg:p-12 shadow-[0_0_60px_rgba(0,240,255,0.12)] space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-wider block mb-1">
              {isEn ? "FREE LEVEL DIAGNOSTIC" : "اختبار تحديد المستوى المجاني"}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">
              {isEn ? "Assess Your Nuclear Chemistry Mastery" : "اكتشف مستواك الأكاديمي في 3 دقائق"}
            </h2>
          </div>
          <span className="rounded-full bg-cyan-950 px-3 py-1 text-xs font-mono font-bold text-cyan-300 border border-cyan-500/40">
            {isFinished ? "تم الاختبار" : `السؤال ${currentIdx + 1} من ${QUIZ_QUESTIONS.length}`}
          </span>
        </div>

        {!isFinished ? (
          <div className="space-y-6">
            <h3 className="text-base sm:text-lg font-bold text-white leading-relaxed">
              {QUIZ_QUESTIONS[currentIdx].q}
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {QUIZ_QUESTIONS[currentIdx].options.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => handleSelect(i)}
                  className="w-full text-right p-4 rounded-2xl border border-slate-800 bg-[#081122] text-xs sm:text-sm text-slate-200 hover:border-cyan-400 hover:bg-[#0c1a33] transition-all cursor-pointer flex items-center justify-between"
                >
                  <span>{opt}</span>
                  <span className="size-5 rounded-full border border-slate-700 flex items-center justify-center text-[10px] text-slate-400">
                    {String.fromCharCode(65 + i)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-4 space-y-5">
            <div className="text-4xl font-black text-[#00f0ff] font-mono">
              {score} / {QUIZ_QUESTIONS.length}
            </div>
            <div className="text-xl font-bold text-white">
              {score >= 3
                ? (isEn ? "Excellent Level: Ready for Nuclear Reactors & Safety!" : "مستوى متقدم ممتاز! أنت مؤهل لدراسة هندسة المفاعلات والسلامة الإشعاعية")
                : (isEn ? "Foundational Level: Recommended to start with Nuclear Fundamentals." : "مستوى تأسيسي واعد: نوصيك بالبدء بدورة أساسيات الكيمياء النووية")}
            </div>
            <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
              بناءً على نتيجتك، قمنا بتهيئة خطة مذاكرة ذكية مناسبة لنقاط قوتك لتبدأ دراستك بثقة.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenStudyPlan}
                className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 px-6 py-3 text-xs font-bold text-slate-950 shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
              >
                <Sparkles className="size-4" />
                <span>إنشاء خطة مذاكرة ذكية مخصصة لنتيجتي عبر AI Gateway ⚡</span>
              </button>

              <button
                onClick={handleReset}
                className="flex items-center gap-1.5 rounded-full border border-slate-700 px-4 py-3 text-xs text-slate-300 hover:bg-slate-800 cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                <span>إعادة الاختبار</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
