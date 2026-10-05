import React from "react";
import { Atom, Mail, MessageSquare, Phone, Send, ShieldCheck } from "lucide-react";

interface FooterProps {
  onTabChange: (tab: string) => void;
  language: "ar" | "en";
}

export function Footer({ onTabChange, language }: FooterProps) {
  const isEn = language === "en";

  return (
    <footer className="border-t border-slate-800/80 bg-[#03060f] text-slate-400 py-14 px-6 lg:px-10">
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">
        {/* Brand */}
        <div className="space-y-4 md:col-span-2">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-xl bg-cyan-950 border border-cyan-500/40 text-cyan-300">
              <Atom className="size-6 text-[#00f0ff] animate-spin-slow" />
            </div>
            <div>
              <div className="text-base font-extrabold text-white">المهندس محمود شلتوت</div>
              <div className="text-xs text-cyan-400 font-medium">منصة الكيمياء النووية والمفاعلات</div>
            </div>
          </div>

          <p className="text-xs text-slate-400 max-w-sm leading-relaxed">
            {isEn
              ? "Bridging fundamental isotope chemistry with applied nuclear engineering. Specialized tutoring for university and gifted students across Saudi Arabia and the Arabian Gulf."
              : "منصة رائدة متخصصة في تدريس الكيمياء النووية والمفاعلات وتطبيقات الطاقة الإشعاعية والسلامة لطلاب الجامعات والمرحلة الثانوية في السعودية والخليج."}
          </p>

          <div className="flex items-center gap-3 pt-1">
            <a
              href="https://wa.me/966594756878"
              target="_blank"
              rel="noreferrer"
              className="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-emerald-400 hover:border-emerald-500/40 transition-all"
              title="واتساب مباشر"
            >
              <MessageSquare className="size-4" />
            </a>
            <a
              href="mailto:Mahmoudshaltoot.cemc@gmail.com"
              className="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-cyan-400 hover:border-cyan-500/40 transition-all"
              title="البريد الإلكتروني"
            >
              <Mail className="size-4" />
            </a>
            <a
              href="tel:+966594756878"
              className="flex size-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-slate-300 hover:text-pink-400 hover:border-pink-500/40 transition-all"
              title="اتصال هاتفي"
            >
              <Phone className="size-4" />
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {isEn ? "Quick Navigation" : "روابط سريعة"}
          </h4>
          <ul className="space-y-2 text-xs">
            <li>
              <button onClick={() => onTabChange("home")} className="hover:text-cyan-400 transition-colors">
                {isEn ? "Home Page" : "الرئيسية"}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("courses")} className="hover:text-cyan-400 transition-colors">
                {isEn ? "Courses & Syllabi" : "الدورات المتاحة والتسجيل"}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("simulator")} className="hover:text-cyan-400 transition-colors">
                {isEn ? "Reactor Simulator" : "محاكي قلب المفاعل الحي"}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("instructor")} className="hover:text-cyan-400 transition-colors">
                {isEn ? "Instructor Credentials" : "صفحة المهندس محمود شلتوت"}
              </button>
            </li>
            <li>
              <button onClick={() => onTabChange("portal")} className="hover:text-cyan-400 transition-colors">
                {isEn ? "Student Portal" : "بوابة الطالب والدروس"}
              </button>
            </li>
          </ul>
        </div>

        {/* Official Contact Info */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-white">
            {isEn ? "Official Contact" : "التواصل المعتمد"}
          </h4>
          <div className="space-y-2 text-xs">
            <div>
              <span className="text-slate-500 block text-[10px]">الهاتف والواتساب المعتمد:</span>
              <a href="tel:+966594756878" className="text-white font-mono hover:text-cyan-400 dir-ltr inline-block">
                +966 59 475 6878
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">البريد الإلكتروني:</span>
              <a href="mailto:Mahmoudshaltoot.cemc@gmail.com" className="text-white font-mono hover:text-cyan-400 text-[11px]">
                Mahmoudshaltoot.cemc@gmail.com
              </a>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">النطاق الجغرافي:</span>
              <span className="text-slate-300">المملكة العربية السعودية ودول الخليج العربي</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto mt-12 pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
        <div>
          جميع الحقوق محفوظة © {new Date().getFullYear()} للمهندس محمود إسماعيل شلتوت — منصة الكيمياء النووية.
        </div>
        <div className="flex items-center gap-4">
          <span>الرياض • جدة • الظهران • دبي • الكويت</span>
          <span className="text-cyan-400/80">AI Gateway Integrated</span>
        </div>
      </div>
    </footer>
  );
}
