import React, { useState } from "react";
import { BookOpen, ChevronLeft, Clock, FileText, Share2, X } from "lucide-react";

interface ArticlesSectionProps {
  language: "ar" | "en";
}

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  readTime: string;
  summary: string;
  content: { heading: string; text: string }[];
}

const ARTICLES: ArticleItem[] = [
  {
    id: "half-life",
    title: "عمر النصف ببساطة: الشرح والقانون ومسائل نموذجية محلولة",
    category: "ملخصات",
    readTime: "6 دقائق قراءة",
    summary: "ملخص شامل يشرح مفهوم عمر النصف (Half-life) في الكيمياء والفيزياء النووية، مع القانون الرياضي وطريقة حل المسائل خطوة بخطوة لطلاب التحصيلي والجامعات.",
    content: [
      {
        heading: "ما هو عمر النصف؟",
        text: "عمر النصف هو الزمن اللازم لاضمحلال نصف عدد الأنوية المشعة في عينة نقية. وهو ثابت فيزيائي مميز لكل نظير لا يتأثر بالحرارة أو الضغط أو الحالة الكيميائية للعنصر.",
      },
      {
        heading: "القانون الأساسي",
        text: "الكمية المتبقية = الكمية الابتدائية × (1/2)^n، حيث n عدد أعمار النصف التي مرّت (أي n = الزمن الكلي ÷ عمر النصف). وبالصيغة الأسية: N = N₀ · e^(−λt)، حيث ثابت الاضمحلال λ = 0.693 ÷ عمر النصف.",
      },
      {
        heading: "تطبيق محلول",
        text: "عينة كتلتها 80 جراماً وعمر نصفها 5 أيام. كم يتبقى منها بعد 15 يوماً؟ الحل: n = 15 ÷ 5 = 3 أعمار نصف. إذن المتبقي = 80 × (1/2)³ = 80 ÷ 8 = 10 جرامات.",
      },
    ],
  },
  {
    id: "decay-types",
    title: "الفرق الجوهري بين إشعاعات ألفا وبيتا وجاما والتدريع المناسب",
    category: "فيزياء النواة",
    readTime: "5 دقائق قراءة",
    summary: "مقارنة دقيقة وشاملة بين أنواع الإشعاع النووي الثلاثة: الطبيعة، الشحنة، طاقة التأيين، والقدرة على الاختراق ومواد التدريع.",
    content: [
      {
        heading: "إشعاع ألفا (α)",
        text: "نواة ذرة هيليوم مكونة من بروتونين ونيوترونين (شحنة +2 وكتلة 4). قدرتها على التأيين عالية جداً ولكن اختراقها ضعيف للغاية ويمكن إيقافها بورقة عادية أو بطبقة الجلد الميت.",
      },
      {
        heading: "إشعاع بيتا (β)",
        text: "إلكترونات أو بوزيترونات عالية الطاقة ناتجة عن تحول نيوترون إلى بروتون أو العكس داخل النواة. اختراقها متوسط وتحتاج إلى صفيحة من الألومنيوم أو البلاستيك السميك لإيقافها.",
      },
      {
        heading: "أشعة جاما (γ)",
        text: "فوتونات كهرومغناطيسية فائقة الطاقة ليس لها كتلة ولا شحنة. اختراقها هائل جداً وتتطلب ألواحاً سميكة من الرصاص أو جدراناً خرسانية كثيفة لتقليل شدتها.",
      },
    ],
  },
  {
    id: "reactor-components",
    title: "كيف يعمل المفاعل النووي لتوليد الكهرباء؟ دليل مبسط للطلاب",
    category: "هندسة المفاعلات",
    readTime: "7 دقائق قراءة",
    summary: "شرح لمكوّنات محطة الطاقة النووية: قضبان الوقود المخصب، مهدئات السرعة، قضبان التحكم، والمبادلات الحرارية والتوربينات البخارية.",
    content: [
      {
        heading: "الانشطار المتسلسل المنضبط",
        text: "عندما تمتص نواة اليورانيوم-235 نيوتروناً حرارياً، تنشطر إلى نواتين أخف وتطلق طاقة هائلة مصحوبة بنيوترونات جديدة تستمر في إشعال التفاعل ضمن بيئة مسيطر عليها تماماً.",
      },
      {
        heading: "قضبان التحكم والمهدئ",
        text: "المهدئ (كالماء الخفيف أو الجرافيت) يبطئ النيوترونات لتسهيل امتصاصها، بينما قضبان التحكم (البورون والكادميوم) تمتص النيوترونات الزائدة لضبط عامل التكاثر عند k = 1 تماماً.",
      },
      {
        heading: "توليد البخار والكهرباء",
        text: "الحرارة الناتجة من قلب المفاعل تنقل عبر حلقة تبريد أولية عالية الضغط إلى مولد البخار، حيث يُنتج بخار يدير التوربينات الكبرى المتصلة بالمولدات الكهربائية دون أي انبعاثات كربونية.",
      },
    ],
  },
];

export function ArticlesSection({ language }: ArticlesSectionProps) {
  const isEn = language === "en";
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);

  return (
    <section className="py-16 px-6 lg:px-10 max-w-[1240px] mx-auto space-y-10">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <span className="text-[11px] font-mono text-cyan-400 font-bold uppercase tracking-widest block mb-1">
            {isEn ? "FREE KNOWLEDGE HUB" : "بنك المعرفة والملخصات المجانية"}
          </span>
          <h2 className="text-3xl font-black text-white">
            {isEn ? "Articles & Solved Exam Guides" : "مقالات وملخصات علمية مركزة"}
          </h2>
        </div>
        <div className="text-xs text-slate-400">
          إعداد وإشراف المهندس/ محمود إسماعيل شلتوت
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {ARTICLES.map((article) => (
          <div
            key={article.id}
            className="rounded-3xl border border-slate-800 bg-[#070d19] p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all hover:shadow-[0_0_40px_rgba(0,240,255,0.12)] group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="rounded-full bg-cyan-950/80 px-2.5 py-0.5 text-cyan-300 font-semibold border border-cyan-500/30 text-[10px]">
                  {article.category}
                </span>
                <span className="flex items-center gap-1 font-mono text-[11px]">
                  <Clock className="size-3 text-cyan-400" />
                  <span>{article.readTime}</span>
                </span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-cyan-300 transition-colors leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-3">
                {article.summary}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <button
                onClick={() => setSelectedArticle(article)}
                className="text-xs font-bold text-[#00f0ff] hover:underline flex items-center gap-1 cursor-pointer"
              >
                <span>{isEn ? "Read Full Guide" : "قراءة الملخص بالكامل"}</span>
                <ChevronLeft className="size-4" />
              </button>

              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, text: article.summary, url: window.location.href });
                  } else {
                    alert("تم نسخ رابط المقال!");
                  }
                }}
                className="p-1.5 rounded-lg border border-slate-800 text-slate-400 hover:text-white cursor-pointer"
                title="مشاركة المقال"
              >
                <Share2 className="size-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Article Detail Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
          <div className="relative w-full max-w-2xl max-h-[90vh] flex flex-col rounded-3xl border border-cyan-500/30 bg-[#070d1a] shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-800 bg-[#081022] px-6 py-4">
              <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                <BookOpen className="size-4" />
                <span>{selectedArticle.category} • {selectedArticle.readTime}</span>
              </div>
              <button
                onClick={() => setSelectedArticle(null)}
                className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer"
              >
                <X className="size-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-6">
              <h2 className="text-2xl font-black text-white leading-tight">
                {selectedArticle.title}
              </h2>

              <p className="text-xs text-slate-300 bg-slate-900/60 p-4 rounded-xl border border-slate-800 leading-relaxed">
                {selectedArticle.summary}
              </p>

              <div className="space-y-5">
                {selectedArticle.content.map((sec, i) => (
                  <div key={i} className="space-y-2">
                    <h3 className="text-base font-bold text-[#00f0ff]">{sec.heading}</h3>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">{sec.text}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-[#081022] flex justify-end">
              <button
                onClick={() => setSelectedArticle(null)}
                className="rounded-xl bg-cyan-500 px-6 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-400 cursor-pointer"
              >
                إغلاق المقال
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
