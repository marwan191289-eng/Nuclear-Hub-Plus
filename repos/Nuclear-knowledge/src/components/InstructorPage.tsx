import React from "react";
import mahmoudImg from "../assets/mahmoud-lab-coat.png";
import { Award, BookOpen, CheckCircle, GraduationCap, Mail, MessageSquare, Phone, ShieldCheck, Sparkles, Star } from "lucide-react";

interface InstructorPageProps {
  onBookSession: () => void;
  language: "ar" | "en";
}

export function InstructorPage({ onBookSession, language }: InstructorPageProps) {
  const isEn = language === "en";

  const credentials = isEn
    ? [
        "B.Sc. Chemical & Nuclear Engineering with Honors",
        "Certified Radiation Protection Officer (RSO) - IAEA Standards",
        "Specialist in Nuclear Reactor Thermal-Hydraulics & Fuel Cycle Analysis",
        "Over 5+ years of specialized university tutoring across Saudi Arabia & GCC",
        "Trained 500+ engineering & science students to exam and research excellence",
      ]
    : [
        "بكالوريوس هندسة كيميائية ونووية مع مرتبة الشرف",
        "مسؤول حماية إشعاعية معتمد (RSO) وفق معايير الوكالة الدولية للطاقة الذرية",
        "متخصص في ديناميكا قلب المفاعلات وحسابات دورة الوقود والنفايات النووية",
        "أكثر من 5 سنوات في التدريس التخصصي لطلاب جامعات المملكة والخليج",
        "خرّج أكثر من 500 طالب وطالبة بتفوق استثنائي في مقررات الكيمياء والفيزياء النووية",
      ];

  const testimonials = [
    {
      name: isEn ? "Fahad Al-Otaibi (KFUPM)" : "فهد العتيبي (جامعة الملك فهد للبترول والمعادن)",
      text: isEn
        ? "Eng. Mahmoud breaks down complex reactor kinetics like no one else. His real-world simulations and half-life problem-solving methods made me ace my final exam with an A+!"
        : "المهندس محمود يمتلك أسلوباً فريداً جداً في تبسيط أعقد معادلات الانشطار وعمر النصف. الدورة حولت المادة من كابوس نظري إلى متعة عقلية ملموسة وحصلت على A+ بفضله.",
      rating: 5,
      course: "التفاعلات والمفاعلات النووية",
    },
    {
      name: isEn ? "Sarah Al-Ghamdi (KSU)" : "سارة الغامدي (جامعة الملك سعود)",
      text: isEn
        ? "The AI study plan and Eng. Mahmoud's weekly live sessions were the best academic investment I made this year. High scientific precision combined with friendly mentorship."
        : "خطة المذاكرة الذكية وجلسات المراجعة المباشرة مع المهندس محمود كانت أفضل استثمار أكاديمي قمت به. دقة علمية متناهية وصبر واهتمام بكل استفسار.",
      rating: 5,
      course: "أساسيات الكيمياء النووية",
    },
    {
      name: isEn ? "Abdullah Al-Dosari (Kuwait University)" : "عبدالله الدوسري (جامعة الكويت)",
      text: isEn
        ? "Clear, direct, and zero fluff. The radiation safety and shielding course gave me the confidence to excel in my research internship."
        : "شرح مباشر وعميق بدون حشو. دورة السلامة الإشعاعية والتدريع جهزتني بشكل كامل للاختبارات المهنية ومشاريع التخرج.",
      rating: 5,
      course: "السلامة الإشعاعية والنظائر",
    },
  ];

  return (
    <div className="py-12 px-6 lg:px-10 max-w-[1240px] mx-auto space-y-16">
      {/* Hero Bio Banner */}
      <div className="relative overflow-hidden rounded-3xl border border-cyan-500/30 bg-gradient-to-br from-[#060c18] via-[#081224] to-[#040812] p-8 lg:p-12 shadow-[0_0_80px_rgba(0,240,255,0.15)]">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Portrait Photo */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-cyan-500 to-pink-500 opacity-60 blur-lg transition duration-700 group-hover:opacity-100" />
              <div className="relative rounded-2xl border border-cyan-400/40 bg-black overflow-hidden shadow-2xl">
                <img
                  src={mahmoudImg}
                  alt="المهندس محمود إسماعيل شلتوت"
                  className="w-full max-w-[340px] aspect-[4/5] object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/60 to-transparent p-4 text-center">
                  <div className="text-white font-bold text-sm">المهندس/ محمود إسماعيل شلتوت</div>
                  <div className="text-cyan-400 text-xs font-medium">مهندس كيمياء نووية ومدرّب معتمد</div>
                </div>
              </div>
            </div>
          </div>

          {/* Bio text & credentials */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-950/60 px-4 py-1 text-xs text-cyan-300">
              <Sparkles className="size-3.5" />
              <span>{isEn ? "Lead Instructor & Academic Director" : "المشرف الأكاديمي والمدرب العام"}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl font-black text-white leading-tight">
              {isEn ? "Eng. Mahmoud Ismail Shaltoot" : "المهندس/ محمود إسماعيل شلتوت"}
            </h1>

            <p className="text-base text-slate-300 leading-relaxed font-normal">
              {isEn ? (
                <>
                  Nuclear Chemical Engineer and dedicated mentor passionately bridging fundamental atomic science
                  with advanced reactor technologies. Specializing in curriculum design, university exam prep,
                  and radiological safety training for students across the Kingdom of Saudi Arabia and the Arabian Gulf.
                </>
              ) : (
                <>
                  مهندس كيمياء نووية ومدرّب شغوف بنقل علوم الذرة والطاقة النووية من أفق النظريات الجافة إلى الفهم
                  الواقعي التطبيقي الممتع. نؤسس الطلاب في جميع مفردات الكيمياء والفيزياء الإشعاعية، ونعدّهم
                  للتفوق الدراسي في الجامعات والمؤسسات البحثية والصناعية الكبرى.
                </>
              )}
            </p>

            {/* Checklist of Credentials */}
            <div className="space-y-2.5 pt-2">
              {credentials.map((cred, i) => (
                <div key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-200">
                  <CheckCircle className="size-4 text-cyan-400 shrink-0 mt-0.5" />
                  <span>{cred}</span>
                </div>
              ))}
            </div>

            {/* Contact & Booking Actions */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <button
                onClick={onBookSession}
                className="group relative overflow-hidden inline-flex items-center justify-center gap-2.5 rounded-full bg-gradient-to-r from-[#00f0ff] via-[#10e9ff] to-[#00d4f0] px-8 py-3.5 text-sm font-extrabold text-slate-950 shadow-[0_0_35px_rgba(0,240,255,0.45),0_4px_16px_rgba(0,0,0,0.35)] border border-cyan-100/60 transition-all duration-300 hover:scale-[1.03] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] active:scale-95 cursor-pointer"
              >
                <span className="relative z-10">{isEn ? "Book 1-on-1 Mentorship Session" : "احجز جلسة تقييم وتدريب خاصة"}</span>
              </button>

              <a
                href="https://wa.me/966594756878"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2.5 rounded-full border border-emerald-500/40 bg-gradient-to-r from-emerald-950/70 via-teal-950/60 to-emerald-950/70 px-6 py-3.5 text-sm font-bold text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.25)] hover:border-emerald-400 hover:scale-105 transition-all cursor-pointer"
              >
                <MessageSquare className="size-4" />
                <span>{isEn ? "WhatsApp Direct (GCC & Arab)" : "تواصل واتساب مباشر (السعودية والخليج)"}</span>
                <span className="text-xs">🇸🇦 🇰🇼 🇦🇪 🇶🇦</span>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Philosophy & Methodology */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-500/20 text-cyan-300">
            <GraduationCap className="size-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isEn ? "From Ground Up" : "الفهم من الجذر"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? "We don't just memorize formulas. We trace the physical origin of mass defect, binding forces, and isotopic stability so you solve any unfamiliar question effortlessly."
              : "لا نعتمد على الحفظ العشوائي للمعادلات، بل نبني الاستيعاب الفيزيائي لأصل نقص الكتلة وطاقة الربط وقوى النواة، لتتمكن من حل أصعب المسائل ببديهة حاضرة."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
            <Sparkles className="size-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isEn ? "AI-Powered Adaptive Learning" : "تخصيص مدعوم بالذكاء الاصطناعي"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? "Personalized study schedules, spaced-repetition flashcards, and level progression tailored to your speed and university curriculum."
              : "خطط دراسية شخصية، بطاقات مراجعة متباعدة، وتدريبات تدرجية تتناغم مع جدولك الجامعي والتزاماتك واختباراتك الدورية."}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-[#080d19] p-6 space-y-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-300">
            <ShieldCheck className="size-5" />
          </div>
          <h3 className="text-base font-bold text-white">
            {isEn ? "Verified Accreditation" : "شهادات معتمدة وتدريب عملي"}
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            {isEn
              ? "Receive digitally verifiable certificates with QR codes upon course completion, backed by rigorous assessments."
              : "يحصل الطالب بعد اجتياز الدورة على شهادة إتمام رقمية معتمدة برمز تحقق QR تؤكد تمكنه العملي من المعايير المطلوبة."}
          </p>
        </div>
      </div>

      {/* Verified Student Testimonials */}
      <div className="space-y-6">
        <div className="text-center">
          <span className="text-xs font-mono uppercase font-bold text-cyan-400 tracking-wider">
            {isEn ? "STUDENT VOICES & MUTUAL RATINGS" : "آراء وتقييمات الطلاب المعتمدة"}
          </span>
          <h2 className="text-2xl font-bold text-white mt-1">
            {isEn ? "Real Experiences from Our Learners" : "تجارب طلابنا في جامعات المملكة والخليج"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-800 bg-[#070e1c] p-6 flex flex-col justify-between space-y-4 hover:border-cyan-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center gap-1 text-amber-400">
                  {[...Array(t.rating)].map((_, i) => (
                    <Star key={i} className="size-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">"{t.text}"</p>
              </div>

              <div className="pt-3 border-t border-slate-800">
                <div className="font-bold text-xs text-white">{t.name}</div>
                <div className="text-[11px] text-cyan-400">{t.course}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
