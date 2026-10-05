import React, { useState, useRef, useEffect } from "react";
import mahmoudImg from "../assets/mahmoud-lab-coat.png";
import { CountryCode } from "../types";
import {
  Calendar as CalendarIcon,
  Clock,
  Video,
  Mic,
  MicOff,
  VideoOff,
  Monitor,
  MessageSquare,
  PenTool,
  Eraser,
  RotateCcw,
  Sparkles,
  CheckCircle,
  Copy,
  Users,
  Globe,
  ChevronDown,
} from "lucide-react";

export const GCC_COUNTRIES: CountryCode[] = [
  { id: "sa", name: "المملكة العربية السعودية", nameEn: "Saudi Arabia", code: "+966", flag: "🇸🇦", sample: "5X XXX XXXX" },
  { id: "kw", name: "دولة الكويت", nameEn: "Kuwait", code: "+965", flag: "🇰🇼", sample: "9XX XXXX" },
  { id: "ae", name: "الإمارات العربية المتحدة", nameEn: "United Arab Emirates", code: "+971", flag: "🇦🇪", sample: "5X XXX XXXX" },
  { id: "qa", name: "دولة قطر", nameEn: "Qatar", code: "+974", flag: "🇶🇦", sample: "5XX XXXX" },
  { id: "bh", name: "مملكة البحرين", nameEn: "Bahrain", code: "+973", flag: "🇧🇭", sample: "3XX XXXX" },
  { id: "om", name: "سلطنة عُمان", nameEn: "Oman", code: "+968", flag: "🇴🇲", sample: "9XX XXXX" },
  { id: "eg", name: "جمهورية مصر العربية", nameEn: "Egypt", code: "+20", flag: "🇪🇬", sample: "1X XXXX XXXX" },
  { id: "jo", name: "المملكة الأردنية الهاشمية", nameEn: "Jordan", code: "+962", flag: "🇯🇴", sample: "7X XXX XXXX" },
  { id: "iq", name: "جمهورية العراق", nameEn: "Iraq", code: "+964", flag: "🇮🇶", sample: "7X XXX XXXX" },
];

interface BookingAndMeetingRoomProps {
  language: "ar" | "en";
}

export function BookingAndMeetingRoom({ language }: BookingAndMeetingRoomProps) {
  const isEn = language === "en";

  const [selectedDate, setSelectedDate] = useState("2026-10-08");
  const [selectedTime, setSelectedTime] = useState("08:00 PM (توقيت مكة المكرمة)");
  const [topic, setTopic] = useState("جلسة تقييم وتحديد مستوى في الكيمياء النووية والمفاعلات");
  const [studentName, setStudentName] = useState("طالب جديد");
  const [selectedCountry, setSelectedCountry] = useState<CountryCode>(GCC_COUNTRIES[0]);
  const [localPhone, setLocalPhone] = useState("594756878");

  // Booking states
  const [isBooked, setIsBooked] = useState(false);
  const [meetingId, setMeetingId] = useState("");
  const [isInsideRoom, setIsInsideRoom] = useState(false);

  // Classroom controls
  const [micOn, setMicOn] = useState(true);
  const [cameraOn, setCameraOn] = useState(true);
  const [isSharingScreen, setIsSharingScreen] = useState(false);
  const [whiteboardMode, setWhiteboardMode] = useState(true);
  const [penColor, setPenColor] = useState("#00f0ff");
  const [copiedLink, setCopiedLink] = useState(false);

  // Whiteboard canvas
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const isDrawing = useRef(false);

  const timeSlots = [
    "04:00 PM (KSA)",
    "05:30 PM (KSA)",
    "07:00 PM (KSA)",
    "08:30 PM (KSA)",
    "10:00 PM (KSA)",
  ];

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `room-nuclear-${Math.floor(1000 + Math.random() * 9000)}`;
    setMeetingId(id);
    setIsBooked(true);
  };

  const copyMeetingLink = () => {
    const link = `https://knowledge-hub-nuclear.app/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const fullPhoneFormatted = `${selectedCountry.code} ${localPhone}`;
  const fullPhoneDigits = `${selectedCountry.code.replace("+", "")}${localPhone.replace(/^0+/, "")}`;
  const whatsappConfirmUrl = `https://wa.me/966594756878?text=${encodeURIComponent(
    `السلام عليكم يا بشمهندس محمود، أنا الطالب ${studentName} من ${selectedCountry.name} (${selectedCountry.flag}).\nحجزت جلسة تدريبية بتاريخ ${selectedDate} بتوقيت ${selectedTime}.\nالموضوع: ${topic}.\nرقم الواتساب للتواصل: ${fullPhoneFormatted}.\nمعرف قاعة الاجتماع: ${meetingId}`
  )}`;

  // Canvas drawing handlers
  useEffect(() => {
    if (!isInsideRoom || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear and draw subtle nuclear reaction placeholder
    ctx.fillStyle = "#050a14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "rgba(0, 240, 255, 0.4)";
    ctx.font = "14px monospace";
    ctx.strokeText("²³⁵U + ¹n → ¹⁴¹Ba + ⁹²Kr + 3¹n + ~200 MeV", 20, 40);
    ctx.strokeText("N(t) = N₀ · e^(-λt)", 20, 70);
  }, [isInsideRoom]);

  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    isDrawing.current = true;
    draw(e);
  };

  const stopDraw = () => {
    isDrawing.current = false;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing.current || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.strokeStyle = penColor;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!ctx || !canvas) return;
    ctx.fillStyle = "#050a14";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1240px] mx-auto space-y-8">
      {!isInsideRoom ? (
        /* Booking & Appointment Configuration */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left: Info & Instructor Presence */}
          <div className="lg:col-span-5 space-y-6">
            <div className="rounded-2xl border border-cyan-500/30 bg-[#070e1c] p-6 space-y-4 shadow-[0_0_50px_rgba(0,240,255,0.15)]">
              <div className="flex items-center gap-3">
                <img
                  src={mahmoudImg}
                  alt="Eng Mahmoud Shaltoot"
                  className="size-16 rounded-xl object-cover border border-cyan-400/50 shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                />
                <div>
                  <div className="text-sm font-bold text-white">المهندس/ محمود إسماعيل شلتوت</div>
                  <div className="text-xs text-cyan-400">جلسات فردية مباشرة وجهاً لوجه 1-on-1</div>
                  <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 mt-1 font-medium">
                    <span className="size-2 rounded-full bg-emerald-400 pulse-dot" />
                    <span>{isEn ? "Online & Accepting Bookings" : "متاح للحجز الآن"}</span>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {isEn
                  ? "Book a 45-minute live interactive session on Google Meet/WebRTC classroom. Get direct answers to your nuclear questions, review coursework, or solve reactor simulation exercises."
                  : "احجز جلسة تفاعلية مباشرة لمدة 45 دقيقة عبر الغرفة الافتراضية المدمجة. استفسر عن أي مسألة معقدة في الكيمياء النووية والمفاعلات، وتلقَّ إرشاداً مخصصاً."}
              </p>

              {/* Pre-session reminders note */}
              <div className="rounded-xl border border-amber-500/30 bg-amber-950/20 p-3 text-[11px] text-amber-200">
                ⚡ <strong>نظام التنبيهات الذكي:</strong> سيصلك إشعار تذكيري تلقائي قبل الموعد بـ 15 دقيقة عبر الواتساب والمنصة مع رابط الدخول الفوري.
              </div>
            </div>

            {/* If booked, show meeting card */}
            {isBooked && (
              <div className="rounded-2xl border border-emerald-500/40 bg-[#06141d] p-6 space-y-4 shadow-[0_0_40px_rgba(16,185,129,0.2)]">
                <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                  <CheckCircle className="size-5" />
                  <span>{isEn ? "Session Confirmed & Room Ready!" : "تم تأكيد الحجز وتجهيز قاعة الاجتماع!"}</span>
                </div>

                <div className="space-y-1 text-xs text-slate-300">
                  <div>الدولة: <strong className="text-white">{selectedCountry.flag} {selectedCountry.name}</strong></div>
                  <div>رقم الواتساب: <strong className="text-cyan-300 font-mono" dir="ltr">{fullPhoneFormatted}</strong></div>
                  <div>التاريخ: <strong className="text-white">{selectedDate}</strong></div>
                  <div>التوقيت: <strong className="text-white">{selectedTime}</strong></div>
                  <div>معرف الغرفة: <code className="text-cyan-300 font-mono">{meetingId}</code></div>
                </div>

                <div className="space-y-2 pt-1">
                  <div className="flex gap-2">
                    <button
                      onClick={() => setIsInsideRoom(true)}
                      className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-cyan-500 py-3 text-xs font-bold text-slate-950 hover:bg-cyan-400 shadow-[0_0_20px_rgba(0,240,255,0.4)] cursor-pointer"
                    >
                      <Video className="size-4" />
                      <span>{isEn ? "Enter Live Classroom Now" : "دخول الغرفة الافتراضية الآن 🎥"}</span>
                    </button>
                    <button
                      onClick={copyMeetingLink}
                      className="p-3 rounded-xl border border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700 cursor-pointer"
                      title="نسخ رابط الاجتماع"
                    >
                      <Copy className="size-4" />
                    </button>
                  </div>

                  {/* Direct WhatsApp Confirmation Button */}
                  <a
                    href={whatsappConfirmUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-emerald-500/50 bg-gradient-to-r from-emerald-950/80 to-teal-950/80 py-2.5 text-xs font-bold text-emerald-300 hover:bg-emerald-900/60 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all cursor-pointer"
                  >
                    <MessageSquare className="size-4" />
                    <span>تأكيد الحجز فوراً عبر واتساب المهندس محمود 📲</span>
                  </a>

                  {/* Send details to Student's own WhatsApp */}
                  <a
                    href={`https://wa.me/${fullPhoneDigits}?text=${encodeURIComponent(
                      `مرحباً ${studentName}، تم تأكيد موعد جلستك الخاصة في الكيمياء النووية مع المهندس محمود شلتوت.\nالتاريخ: ${selectedDate}\nالتوقيت: ${selectedTime}\nالدولة: ${selectedCountry.name} (${selectedCountry.flag})\nرابط قاعة الاجتماع: https://knowledge-hub-nuclear.app/meeting/${meetingId}`
                    )}`}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full flex items-center justify-center gap-2 rounded-xl border border-cyan-500/40 bg-cyan-950/40 py-2 text-xs font-bold text-cyan-300 hover:bg-cyan-900/50 transition-all cursor-pointer"
                  >
                    <span>إرسال تفاصيل الموعد إلى رقمي ({selectedCountry.flag} {selectedCountry.code}) 📩</span>
                  </a>
                </div>

                {copiedLink && (
                  <div className="text-[10px] text-emerald-300 text-center font-bold">تم نسخ الرابط إلى الحافظة!</div>
                )}
              </div>
            )}
          </div>

          {/* Right: Booking Form */}
          <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#080d19] p-6 sm:p-8 space-y-6">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <CalendarIcon className="size-5 text-cyan-400" />
                <span>{isEn ? "Book Live Tutoring Session" : "حجز موعد جلسة تدريب مباشر أونلاين"}</span>
              </h2>
              <p className="text-xs text-slate-400">
                {isEn ? "Select your Gulf/Arab country code, date, preferred time slot, and topic." : "اختر كود دولتك الخليجية أو العربية، والتاريخ والتوقيت المناسب والموضوع الذي ترغب في مراجعته."}
              </p>
            </div>

            <form onSubmit={handleBook} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isEn ? "Your Full Name" : "اسمك بالكامل"}
                  </label>
                  <input
                    type="text"
                    required
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                  />
                </div>

                {/* Country Code & Phone Input */}
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                    {isEn ? "Gulf / Arab Country" : "الدولة الخليجية / العربية"}
                  </label>
                  <select
                    value={selectedCountry.id}
                    onChange={(e) => {
                      const found = GCC_COUNTRIES.find((c) => c.id === e.target.value);
                      if (found) setSelectedCountry(found);
                    }}
                    className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none cursor-pointer"
                  >
                    <optgroup label="دول مجلس التعاون الخليجي (GCC)">
                      {GCC_COUNTRIES.slice(0, 6).map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="دول عربية أخرى">
                      {GCC_COUNTRIES.slice(6).map((c) => (
                        <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                          {c.flag} {c.name} ({c.code})
                        </option>
                      ))}
                    </optgroup>
                  </select>
                </div>
              </div>

              {/* Quick GCC Country Selector Chips */}
              <div className="space-y-1.5 pt-1">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-300">
                    {isEn ? "Quick GCC Country Choice:" : "اختيار سريع لدول الخليج العربي:"}
                  </span>
                  <span className="text-[10px] text-cyan-400 font-mono font-bold" dir="ltr">
                    Active: {selectedCountry.flag} {selectedCountry.code}
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {GCC_COUNTRIES.slice(0, 6).map((c) => {
                    const isSelected = selectedCountry.id === c.id;
                    const shortName = c.name.replace("المملكة العربية ", "").replace("دولة ", "").replace("مملكة ", "").replace("سلطنة ", "");
                    return (
                      <button
                        key={c.id}
                        type="button"
                        onClick={() => setSelectedCountry(c)}
                        className={`flex flex-col items-center justify-center p-2 rounded-xl border text-[11px] transition-all cursor-pointer ${
                          isSelected
                            ? "border-cyan-400 bg-cyan-950/70 text-[#00f0ff] font-extrabold shadow-[0_0_16px_rgba(0,240,255,0.35)] scale-[1.02]"
                            : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700 hover:bg-slate-800/60"
                        }`}
                      >
                        <span className="text-xl mb-0.5">{c.flag}</span>
                        <span className="truncate max-w-full font-bold">{shortName}</span>
                        <span className="text-[10px] font-mono text-cyan-300 font-bold mt-0.5" dir="ltr">
                          {c.code}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Phone with selected dial code */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isEn ? "WhatsApp / Phone Number" : "رقم الواتساب للتنبيه الذكي قبل الموعد"}
                </label>
                <div className="flex rounded-xl border border-slate-700 bg-slate-900 overflow-hidden focus-within:border-cyan-400 shadow-inner">
                  <div className="flex items-center gap-2 bg-slate-800/90 px-3.5 py-2.5 text-xs font-mono text-cyan-300 border-l border-slate-700 font-bold" dir="ltr">
                    <span className="text-base">{selectedCountry.flag}</span>
                    <span>{selectedCountry.code}</span>
                  </div>
                  <input
                    type="tel"
                    required
                    value={localPhone}
                    onChange={(e) => setLocalPhone(e.target.value)}
                    placeholder={selectedCountry.sample}
                    className="flex-1 bg-transparent px-3 py-2 text-xs text-white focus:outline-none font-mono tracking-wider"
                    dir="ltr"
                  />
                </div>
                <span className="text-[10px] text-slate-400 mt-1 block">
                  كود الدولة الحالي: <strong>{selectedCountry.flag} {selectedCountry.name} ({selectedCountry.code})</strong> — سيصلك تذكير ذكي ورابط الدخول قبل الموعد بـ 15 دقيقة.
                </span>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isEn ? "Select Date" : "تاريخ الجلسة"}
                </label>
                <input
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:border-cyan-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isEn ? "Available Time Slots (KSA Time)" : "المواعيد المتاحة (بتوقيت مكة المكرمة)"}
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {timeSlots.map((slot) => (
                    <button
                      type="button"
                      key={slot}
                      onClick={() => setSelectedTime(slot)}
                      className={`p-2.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        selectedTime === slot
                          ? "border-cyan-400 bg-cyan-950/50 text-[#00f0ff] shadow-[0_0_12px_rgba(0,240,255,0.2)]"
                          : "border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700"
                      }`}
                    >
                      {slot}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  {isEn ? "Consultation Focus / Topic" : "موضوع الجلسة والأسئلة المطلوبة"}
                </label>
                <select
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2.5 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="جلسة تقييم وتحديد مستوى في الكيمياء النووية والمفاعلات">
                    جلسة تقييم وتحديد مستوى في الكيمياء النووية والمفاعلات (مجانية)
                  </option>
                  <option value="حل مسائل عمر النصف والنشاطية الإشعاعية">
                    حل مسائل عمر النصف والنشاطية الإشعاعية
                  </option>
                  <option value="شرح تصميم قلب المفاعل والتحكم في الانشطار">
                    شرح تصميم قلب المفاعل والتحكم في الانشطار
                  </option>
                  <option value="مراجعة مكثفة لاختبارات التحصيلي أو المقررات الجامعية">
                    مراجعة مكثفة لاختبارات التحصيلي أو المقررات الجامعية
                  </option>
                </select>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-3 text-xs font-bold text-slate-950 hover:brightness-110 active:scale-95 shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all cursor-pointer"
                >
                  {isEn ? "Confirm Booking & Generate Live Link" : "تأكيد الموعد وإنشاء رابط الغرفة الافتراضية تلقائياً ⚡"}
                </button>
              </div>
            </form>
          </div>
        </div>
      ) : (
        /* Live Virtual Classroom Interface */
        <div className="rounded-3xl border border-cyan-500/40 bg-[#040813] overflow-hidden shadow-[0_0_90px_rgba(0,240,255,0.2)] space-y-4 p-4 sm:p-6">
          {/* Meeting Room Top Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-3">
            <div className="flex items-center gap-3">
              <span className="size-3 rounded-full bg-rose-500 animate-pulse" />
              <div>
                <div className="text-sm font-bold text-white flex items-center gap-2">
                  <span>قاعة الاجتماع المباشر: {meetingId}</span>
                  <span className="text-[10px] font-mono rounded bg-cyan-950 px-2 py-0.5 text-cyan-300 border border-cyan-500/40">
                    LIVE WEBRTC
                  </span>
                </div>
                <div className="text-[11px] text-slate-400">المهندس محمود شلتوت • {studentName}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setWhiteboardMode(!whiteboardMode)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                  whiteboardMode ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-300 hover:bg-slate-700"
                }`}
              >
                <PenTool className="size-3.5" />
                <span>{whiteboardMode ? (isEn ? "Whiteboard ON" : "السبورة التفاعلية مفعّلة") : (isEn ? "Show Whiteboard" : "إظهار السبورة")}</span>
              </button>

              <button
                onClick={() => setIsInsideRoom(false)}
                className="rounded-lg bg-rose-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-rose-500 transition-all cursor-pointer"
              >
                {isEn ? "Leave Room" : "مغادرة الجلسة"}
              </button>
            </div>
          </div>

          {/* Video Streams Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Instructor Feed */}
            <div className="relative aspect-video rounded-2xl border border-cyan-500/30 bg-black overflow-hidden shadow-lg flex items-center justify-center">
              <img
                src={mahmoudImg}
                alt="Eng Mahmoud"
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                المهندس/ محمود شلتوت (المدرّب) 🎙️
              </div>
              <div className="absolute top-3 right-3 flex items-center gap-1.5 rounded-full bg-cyan-950/80 border border-cyan-500/40 px-2 py-0.5 text-[10px] text-cyan-300 font-mono">
                HD 1080p
              </div>
            </div>

            {/* Student Feed */}
            <div className="relative aspect-video rounded-2xl border border-slate-800 bg-[#081020] overflow-hidden shadow-lg flex flex-col items-center justify-center text-slate-400">
              {cameraOn ? (
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="size-16 rounded-full bg-cyan-950 border border-cyan-500/40 flex items-center justify-center text-cyan-300 font-bold text-xl">
                    {studentName[0] || "ط"}
                  </div>
                  <div className="text-xs text-slate-300 font-medium">كاميرا الطالب متصلة</div>
                </div>
              ) : (
                <div className="text-xs">الكاميرا معطلة</div>
              )}
              <div className="absolute bottom-3 left-3 rounded-lg bg-black/70 px-2.5 py-1 text-[11px] font-bold text-white backdrop-blur-md">
                {studentName} (أنت)
              </div>
            </div>
          </div>

          {/* Interactive Collaborative Whiteboard */}
          {whiteboardMode && (
            <div className="rounded-2xl border border-cyan-500/30 bg-[#050a14] p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-white">السبورة التفاعلية لمعادلات الكيمياء النووية:</span>
                  <div className="flex items-center gap-1">
                    {["#00f0ff", "#ec4899", "#10b981", "#f59e0b", "#ffffff"].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPenColor(color)}
                        style={{ backgroundColor: color }}
                        className={`size-5 rounded-full border cursor-pointer ${
                          penColor === color ? "scale-125 border-white shadow-lg" : "border-transparent"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <button
                  onClick={clearCanvas}
                  className="flex items-center gap-1 rounded-lg border border-slate-700 bg-slate-800 px-2.5 py-1 text-[11px] text-slate-300 hover:bg-slate-700 cursor-pointer"
                >
                  <Eraser className="size-3.5" />
                  <span>مسح السبورة</span>
                </button>
              </div>

              <canvas
                ref={canvasRef}
                width={800}
                height={260}
                onMouseDown={startDraw}
                onMouseUp={stopDraw}
                onMouseMove={draw}
                onMouseLeave={stopDraw}
                className="w-full h-[220px] rounded-xl border border-slate-800 bg-[#050a14] cursor-crosshair touch-none"
              />
            </div>
          )}

          {/* Classroom Controls Toolbar */}
          <div className="flex items-center justify-center gap-3 pt-2">
            <button
              onClick={() => setMicOn(!micOn)}
              className={`flex size-11 items-center justify-center rounded-full transition-all cursor-pointer ${
                micOn ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-rose-600 text-white"
              }`}
            >
              {micOn ? <Mic className="size-5" /> : <MicOff className="size-5" />}
            </button>

            <button
              onClick={() => setCameraOn(!cameraOn)}
              className={`flex size-11 items-center justify-center rounded-full transition-all cursor-pointer ${
                cameraOn ? "bg-slate-800 text-slate-200 hover:bg-slate-700" : "bg-rose-600 text-white"
              }`}
            >
              {cameraOn ? <Video className="size-5" /> : <VideoOff className="size-5" />}
            </button>

            <button
              onClick={() => setIsSharingScreen(!isSharingScreen)}
              className={`flex size-11 items-center justify-center rounded-full transition-all cursor-pointer ${
                isSharingScreen ? "bg-cyan-500 text-slate-950" : "bg-slate-800 text-slate-200 hover:bg-slate-700"
              }`}
              title="مشاركة الشاشة"
            >
              <Monitor className="size-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
