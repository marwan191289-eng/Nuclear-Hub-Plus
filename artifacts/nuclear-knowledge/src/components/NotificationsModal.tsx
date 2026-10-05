import React from "react";
import { Bell, Calendar, CheckCircle2, Clock, Sparkles, X } from "lucide-react";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateToBooking: () => void;
  onNavigateToSpacedRepetition: () => void;
  language: "ar" | "en";
}

export function NotificationsModal({
  isOpen,
  onClose,
  onNavigateToBooking,
  onNavigateToSpacedRepetition,
  language,
}: NotificationsModalProps) {
  const isEn = language === "en";
  if (!isOpen) return null;

  const notifications = [
    {
      id: "n-1",
      title: "تنبيه ذكي: موعد جلسة تدريب المفاعلات المباشرة",
      text: "جلسة المراجعة الفردية مع المهندس محمود تبدأ قريباً. يرجى الدخول إلى القاعة الافتراضية للتأكد من الميكروفون والكاميرا.",
      time: "قبل 10 دقائق",
      type: "session",
      action: () => {
        onClose();
        onNavigateToBooking();
      },
      actionText: "دخول القاعة الافتراضية ←",
    },
    {
      id: "n-2",
      title: "مراجعة متباعدة مستحقة (Spaced Repetition)",
      text: "لديك 5 بطاقات جديدة جاهزة للمراجعة في قوانين عمر النصف وحزام الاستقرار النووي لترسيخها في الذاكرة طويلة المدى.",
      time: "اليوم",
      type: "flashcards",
      action: () => {
        onClose();
        onNavigateToSpacedRepetition();
      },
      actionText: "بدء مراجعة البطاقات (+15 XP) ←",
    },
    {
      id: "n-3",
      title: "تحديث أكاديمي: إضافة ورقة عمل مفاعل الماء المضغوط",
      text: "تم رفع مخطط جديد ثلاثي الأبعاد لديناميكا التبريد في قسم الموارد التعليمية المتاحة للتحميل.",
      time: "أمس",
      type: "resource",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div className="relative w-full max-w-md rounded-3xl border border-cyan-500/40 bg-[#070d1a] p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <span className="flex size-8 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
              <Bell className="size-4" />
            </span>
            <h3 className="text-sm font-bold text-white">
              {isEn ? "Smart Notifications & Reminders" : "التنبيهات الذكية وجدولة المراجعات"}
            </h3>
          </div>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white cursor-pointer">
            <X className="size-5" />
          </button>
        </div>

        <div className="space-y-3">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="rounded-2xl border border-slate-800 bg-[#081122] p-3.5 space-y-2 hover:border-cyan-500/30 transition-all"
            >
              <div className="flex items-center justify-between text-[11px]">
                <strong className="text-cyan-300">{n.title}</strong>
                <span className="text-slate-400 font-mono text-[10px]">{n.time}</span>
              </div>
              <p className="text-xs text-slate-300 leading-relaxed">{n.text}</p>
              {n.action && (
                <button
                  onClick={n.action}
                  className="text-[11px] font-bold text-[#ec4899] hover:underline block pt-1 cursor-pointer"
                >
                  {n.actionText}
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
