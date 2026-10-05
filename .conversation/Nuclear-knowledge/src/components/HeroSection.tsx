import React from "react";
import reactorNeonImg from "../assets/reactor-core-neon.png";
import { useStudentCounter } from "../hooks/useStudentCounter";
import { Sparkles, ArrowLeft, ShieldCheck, Atom } from "lucide-react";

interface HeroSectionProps {
  onStartJourney: () => void;
  onBrowseCourses: () => void;
  onOpenSimulator: () => void;
  language: "ar" | "en";
}

export function HeroSection({
  onStartJourney,
  onBrowseCourses,
  onOpenSimulator,
  language,
}: HeroSectionProps) {
  const { count, isPulsing, notification } = useStudentCounter();
  const isEn = language === "en";

  return (
    <div className="relative overflow-hidden bg-[#030712] pt-8 pb-16 lg:pt-14 lg:pb-24">
      {/* Subtle blueprint grid overlay */}
      <div className="absolute inset-0 bg-grid-nuclear pointer-events-none opacity-80" />

      {/* Atmospheric ambient glows */}
      <div className="absolute top-1/4 -right-40 w-[600px] h-[600px] bg-cyan-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/3 -left-40 w-[550px] h-[550px] bg-pink-500/10 rounded-full blur-[140px] pointer-events-none" />

      {/* Live enrollment toast banner */}
      {notification && (
        <div className="relative z-30 mx-auto max-w-xl px-4 mb-6 transition-all duration-500 animate-bounce">
          <div className="flex items-center gap-3 rounded-full border border-cyan-500/40 bg-[#071322]/90 backdrop-blur-md px-4 py-2 text-xs text-cyan-300 shadow-[0_0_20px_rgba(0,240,255,0.25)]">
            <span className="size-2 rounded-full bg-cyan-400 pulse-dot" />
            <span className="font-medium">{notification}</span>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-[1240px] px-6 lg:px-10">
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-14">
          {/* Left Column: Glowing Reactor Core Card (Exact layout & styling from user image) */}
          <div className="lg:col-span-5 order-2 lg:order-1">
            <div className="relative rounded-2xl border border-cyan-500/25 bg-[#080d19]/90 shadow-[0_0_60px_-15px_rgba(0,240,255,0.28)] overflow-hidden transition-all duration-300 hover:border-cyan-400/50">
              {/* Card Header matching screenshot */}
              <div
                className="flex items-center justify-between border-b border-white/10 bg-[#060b16]/95 px-5 py-3.5 font-mono text-[11px] tracking-wider uppercase text-slate-300"
                dir="ltr"
              >
                <div className="flex items-center gap-2">
                  <span className="text-slate-400 font-semibold tracking-widest">REACTOR CORE</span>
                </div>
                <div className="flex items-center gap-2 text-[#00f0ff] font-bold">
                  <span className="size-2 rounded-full bg-[#00f0ff] pulse-dot inline-block" />
                  <span>ONLINE</span>
                </div>
              </div>

              {/* Reactor Core Visual Container */}
              <div className="relative group cursor-pointer" onClick={onOpenSimulator}>
                {/* U 235 Badge inside image at top right */}
                <div
                  className="absolute top-3 right-4 z-20 rounded border border-cyan-400/40 bg-black/60 px-2.5 py-0.5 font-mono text-[11px] font-bold text-[#00f0ff] backdrop-blur-md"
                  dir="ltr"
                >
                  U 235
                </div>

                {/* Neon Reactor Core Image cropped directly from user attachment */}
                <img
                  src={reactorNeonImg}
                  alt="قلب المفاعل النووي المضاء بالأزرق والوردي"
                  className="aspect-[4/4.8] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />

                {/* Interactive Simulator Prompt Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#050914] via-transparent to-transparent opacity-80" />
                <div className="absolute bottom-3 inset-x-3 flex items-center justify-between rounded-lg border border-white/10 bg-[#060b16]/80 px-3.5 py-2 text-xs backdrop-blur-md">
                  <div className="flex items-center gap-2 text-slate-300">
                    <Atom className="size-4 text-cyan-400 animate-spin-slow" />
                    <span>{isEn ? "Virtual Core Reactor" : "محاكي قلب المفاعل الحي"}</span>
                  </div>
                  <span className="text-[11px] text-cyan-400 font-medium hover:underline">
                    {isEn ? "Open Lab →" : "افتح المختبر ←"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Title, Headline, Description, CTAs matching screenshot */}
          <div className="lg:col-span-7 order-1 lg:order-2">
            {/* Top Pill Badge - Luxury Precision */}
            <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-[#071322]/90 via-[#0a1a30]/80 to-[#071322]/90 px-4 py-1.5 text-xs text-slate-200 shadow-[0_0_20px_rgba(0,240,255,0.2),inset_0_1px_0_rgba(255,255,255,0.1)] backdrop-blur-xl">
              <span className="size-2 rounded-full bg-cyan-400 pulse-dot shadow-[0_0_8px_#00f0ff]" />
              <span className="font-semibold tracking-wide">
                {isEn
                  ? "Available Now • Registration Open for New Cohort"
                  : "متاحة الآن • التسجيل مفتوح للدفعة الجديدة"}
              </span>
            </div>

            {/* Giant Arabic Headline matching the screenshot fonts and colors */}
            <h1 className="text-4xl sm:text-5xl lg:text-[68px] font-extrabold leading-[1.15] tracking-tight text-white mb-6">
              <span>{isEn ? "Nuclear Chemistry " : "الكيمياء النووية "}</span>
              <span className="text-[#00f0ff] drop-shadow-[0_0_30px_rgba(0,240,255,0.75)] font-black">
                {isEn ? "Clearly" : "بوضوح"}
              </span>
              <br />
              <span className="text-[#ec4899] drop-shadow-[0_0_30px_rgba(236,72,153,0.75)] font-black not-italic inline-block">
                {isEn ? "& with Real Depth." : "وبعمق"}
              </span>
              <span className="text-white">{isEn ? "" : " حقيقي."}</span>
            </h1>

            {/* Description Text */}
            <p className="max-w-xl text-base sm:text-lg leading-relaxed text-slate-300 mb-9 font-normal">
              {isEn ? (
                <>
                  Specialized courses and private 1-on-1 tutoring by{" "}
                  <strong className="text-white font-semibold">Eng. Mahmoud Ismail Shaltoot</strong> —
                  Nuclear Chemical Engineer and certified instructor. Building deep conceptual mastery
                  from reactions and isotopes to full reactor engineering.
                </>
              ) : (
                <>
                  دورات ودروس خاصة يقدّمها{" "}
                  <strong className="text-white font-semibold">المهندس/ محمود إسماعيل شلتوت</strong> — مهندس
                  كيمياء نووية ومدرب. نبني الفهم من الجذر: من التفاعلات والنظائر إلى المفاعلات، بلغة بسيطة
                  ودقيقة مصمّمة لطلاب المملكة والخليج.
                </>
              )}
            </p>

            {/* Action Buttons - Refined with High-End Luxury Aesthetics */}
            <div className="flex flex-wrap items-center gap-4 mb-9">
              {/* Vibrant Cyan Filled Pill Button with Luminous Glow & Sheen */}
              <button
                onClick={onStartJourney}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-3 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#1ae9ff] to-[#00c8e0] px-9 py-4 text-base font-extrabold text-slate-950 shadow-[0_0_40px_rgba(0,240,255,0.55),0_6px_22px_rgba(0,0,0,0.4)] border border-cyan-100/70 transition-all duration-300 hover:scale-[1.04] hover:shadow-[0_0_55px_rgba(0,240,255,0.85)] active:scale-95 cursor-pointer"
              >
                {/* Subtle light sweep reflection */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out pointer-events-none" />
                <span className="relative z-10">{isEn ? "Start Your Journey" : "ابدأ رحلتك الآن"}</span>
                <Sparkles className="relative z-10 size-4 text-slate-950 transition-transform group-hover:rotate-12" />
              </button>

              {/* Sophisticated Dark Crystal Outlined Pill Button */}
              <button
                onClick={onBrowseCourses}
                className="group inline-flex items-center justify-center gap-3 rounded-full border border-cyan-500/30 bg-gradient-to-r from-[#060c18]/90 via-[#09152b]/80 to-[#060c18]/90 px-8 py-4 text-base font-bold text-white backdrop-blur-2xl transition-all duration-300 hover:border-cyan-400 hover:text-cyan-300 hover:shadow-[0_0_35px_rgba(0,240,255,0.3),inset_0_1px_0_rgba(255,255,255,0.15)] hover:scale-[1.03] active:scale-95 cursor-pointer shadow-[0_4px_16px_rgba(0,0,0,0.5)]"
              >
                <span>{isEn ? "Explore Courses" : "استعرض الدورات"}</span>
                <ArrowLeft className={`size-4 transition-transform group-hover:-translate-x-1.5 text-cyan-400 ${isEn ? "rotate-180" : ""}`} />
              </button>
            </div>

            {/* Sub-stats row below buttons */}
            <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-xs sm:text-sm text-slate-400 font-medium">
              <span className={`inline-flex items-center gap-2 transition-all duration-500 ${isPulsing ? "scale-105 text-white font-bold" : ""}`}>
                <span className={`size-2 rounded-full transition-transform duration-500 ${isPulsing ? "scale-150 shadow-[0_0_16px_#00f0ff] bg-cyan-400" : "bg-[#ec4899] shadow-[0_0_8px_#ec4899]"}`} />
                <span className="font-mono inline-flex items-center gap-1.5" dir="ltr">
                  <span className={`font-bold transition-all duration-300 ${isPulsing ? "text-[#00f0ff] drop-shadow-[0_0_12px_#00f0ff] scale-110" : "text-slate-200"}`}>
                    +{count}
                  </span>
                  <span className="font-sans font-normal text-slate-300" dir="rtl">{isEn ? "Students" : "طالب"}</span>
                </span>
                {isPulsing && (
                  <span className="text-[10px] font-mono text-cyan-300 font-bold animate-pulse" dir="ltr">+1</span>
                )}
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-[#00f0ff] shadow-[0_0_8px_#00f0ff]" />
                <span>12 {isEn ? "Specialized Courses" : "دورة متخصصة"}</span>
              </span>
              <span className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-cyan-400/60" />
                <span>{isEn ? "Live 1-on-1 Online Tutoring" : "دروس فردية أونلاين"}</span>
              </span>
            </div>
          </div>
        </div>

        {/* Stats Section exactly matching the bottom of user image */}
        <div className="mt-16 lg:mt-20 border-t border-slate-800/80 pt-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center sm:text-right">
            {/* +5 سنوات خبرة */}
            <div className="p-3">
              <div className="text-4xl lg:text-5xl font-black text-[#ec4899] drop-shadow-[0_0_20px_rgba(236,72,153,0.5)] font-mono" dir="ltr">
                +5
              </div>
              <div className="mt-2 text-sm text-slate-400 font-medium">
                {isEn ? "Years Experience" : "سنوات خبرة"}
              </div>
            </div>

            {/* 98% نسبة الرضا */}
            <div className="p-3">
              <div className="text-4xl lg:text-5xl font-black text-white font-mono" dir="ltr">
                98%
              </div>
              <div className="mt-2 text-sm text-slate-400 font-medium">
                {isEn ? "Satisfaction Rate" : "نسبة الرضا"}
              </div>
            </div>

            {/* 12 دورة متخصصة */}
            <div className="p-3">
              <div className="text-4xl lg:text-5xl font-black text-white font-mono" dir="ltr">
                12
              </div>
              <div className="mt-2 text-sm text-slate-400 font-medium">
                {isEn ? "Specialized Courses" : "دورة متخصصة"}
              </div>
            </div>

            {/* +500 طالب وطالبة (with realistic synchronized incremental timer!) */}
            <div className="p-3 relative group">
              <div
                className={`text-4xl lg:text-5xl font-black font-mono transition-all duration-500 ${
                  isPulsing
                    ? "scale-110 text-white drop-shadow-[0_0_35px_rgba(0,240,255,1)]"
                    : "text-[#00f0ff] drop-shadow-[0_0_20px_rgba(0,240,255,0.6)]"
                }`}
                dir="ltr"
              >
                +{count}
              </div>
              <div className="mt-2 flex items-center justify-center sm:justify-start gap-1.5 text-sm text-slate-400 font-medium">
                <span>{isEn ? "Students Enrolled" : "طالب وطالبة"}</span>
                <span className="size-2 rounded-full bg-cyan-400 pulse-dot inline-block" title="عداد الطلاب الفعلي المباشر المتزامن" />
                {isPulsing && (
                  <span className="text-xs font-mono font-bold text-cyan-300 animate-bounce" dir="ltr">+1</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
