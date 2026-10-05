import React, { useState } from "react";
import { ChatMessage } from "../types";
import {
  Download,
  FileText,
  MessageSquare,
  Paperclip,
  Send,
  Sparkles,
  User,
  Users,
} from "lucide-react";

interface ChatAndResourcesProps {
  language: "ar" | "en";
}

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "msg-1",
    sender: "instructor",
    senderName: "المهندس محمود شلتوت",
    text: "أهلاً بكم يا شباب في مجتمع الكيمياء النووية. إذا كان لديكم أي سؤال في مسائل عمر النصف أو تصميم قلب المفاعل، اطرحوه هنا مباشرة وسأجيبكم بنفسي.",
    timestamp: "10:15 AM",
  },
  {
    id: "msg-2",
    sender: "student",
    senderName: "فيصل الشمري (طالب)",
    text: "مهندس محمود، في حسابات الكتلة الحرجة لمفاعل الماء المضغوط (PWR)، هل نعتبر نسبة التخصيب 3.5% كافية لتوليد 1000 ميجاوات حراري؟",
    timestamp: "10:22 AM",
  },
  {
    id: "msg-3",
    sender: "instructor",
    senderName: "المهندس محمود شلتوت",
    text: "نعم يا فيصل، نسبة التخصيب بين 3% إلى 5% من اليورانيوم-235 في مفاعلات PWR كافية جداً لدورة وقود تمتد من 18 إلى 24 شهراً مع استخدام الماء الخفيف كمهدئ ومبرد تحت ضغط 155 بار لمنع الغليان في القلب.",
    timestamp: "10:25 AM",
  },
];

const SHARED_FILES = [
  {
    title: "ملخص قوانين الكيمياء النووية الشامل (طاقة الربط وعمر النصف)",
    category: "ملخصات",
    size: "2.4 MB",
    pages: "14 صفحة",
    downloads: 384,
  },
  {
    title: "مخطط سغري والنظائر المشعة وحزام الاستقرار النووي (Segrè Chart)",
    category: "رسوم توضيحية",
    size: "4.8 MB",
    pages: "ملف عالي الدقة",
    downloads: 512,
  },
  {
    title: "دليل تشغيل المفاعلات النووية وتدريع السلامة الإشعاعية (ALARA)",
    category: "كتب تدريبية",
    size: "6.1 MB",
    pages: "32 صفحة",
    downloads: 420,
  },
  {
    title: "بنك الأسئلة الشامل: 100 مسألة نموذجية محلولة خطوة بخطوة",
    category: "مسائل واختبارات",
    size: "3.2 MB",
    pages: "24 صفحة",
    downloads: 650,
  },
];

export function ChatAndResources({ language }: ChatAndResourcesProps) {
  const isEn = language === "en";
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "student",
      senderName: "أنت (طالب)",
      text: inputText,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    const query = inputText;
    setInputText("");
    setIsTyping(true);

    // Simulated instant pedagogical answer from Eng. Mahmoud / Assistant
    setTimeout(() => {
      let reply = "سؤال ممتاز ومهم! تم تسجيله وسيقوم المهندس محمود بالرد التفصيلي ومراجعة الحسابات معك خلال جلسة المراجعة القادمة.";
      if (query.includes("عمر النصف") || query.includes("half-life")) {
        reply = "تذكر دائماً أن القانون الأسي هو N = N₀ · (1/2)^n، حيث n = الزمن الكلي ÷ عمر النصف. تأكد من توحيد وحدات الزمن (أيام، ساعات، سنوات) قبل إجراء القسمة!";
      } else if (query.includes("انشطار") || query.includes("fission")) {
        reply = "عند انشطار اليورانيوم-235، ينطلق في المتوسط 2.43 نيوترون لكل انشطار، وتتحرر طاقة مقدارها حوالي 200 MeV معظمها على شكل طاقة حركية لشظايا الانشطار.";
      } else if (query.includes("سلامة") || query.includes("جرعة") || query.includes("سيفيرت")) {
        reply = "مبدأ ALARA يقتضي تقليل التعرض الإشعاعي عبر 3 محاور: تقليل وقت التعرض، مضاعفة المسافة (قانون التربيع العكسي)، واستخدام تدريع رصاصي أو خرساني سميك.";
      }

      setMessages((prev) => [
        ...prev,
        {
          id: `msg-rep-${Date.now()}`,
          sender: "instructor",
          senderName: "المهندس محمود شلتوت (رد فوري)",
          text: reply,
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
      setIsTyping(false);
    }, 1400);
  };

  return (
    <section className="py-12 px-6 lg:px-10 max-w-[1240px] mx-auto space-y-12">
      <div className="border-b border-slate-800 pb-5">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
          <MessageSquare className="size-6 text-cyan-400" />
          <span>{isEn ? "Direct Q&A & Resource Sharing Hub" : "مجتمع النقاش المباشر ومكتبة الموارد التعليمية"}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-1">
          {isEn
            ? "Ask Eng. Mahmoud directly, share study resources, and download certified formula guides."
            : "تواصل مع المهندس محمود والمدربين مباشرة، وتشارك الأسئلة والملخصات مع زملائك في المملكة والخليج."}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left: Chat Messenger */}
        <div className="lg:col-span-7 rounded-2xl border border-slate-800 bg-[#070d1a] overflow-hidden flex flex-col h-[520px] shadow-2xl">
          {/* Chat Header */}
          <div className="flex items-center justify-between border-b border-slate-800 bg-[#091122] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="size-2 rounded-full bg-emerald-400 pulse-dot" />
              <span className="text-xs font-bold text-white">
                {isEn ? "Live Instructor Q&A Channel" : "قناة الأسئلة المباشرة مع المدرب"}
              </span>
            </div>
            <span className="text-[11px] font-mono text-cyan-400">12 متصل الآن</span>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#050914]">
            {messages.map((m) => {
              const isMe = m.sender === "student";
              return (
                <div
                  key={m.id}
                  className={`flex flex-col max-w-[80%] rounded-2xl p-3 text-xs leading-relaxed ${
                    isMe
                      ? "mr-auto bg-cyan-950/60 border border-cyan-500/30 text-cyan-100"
                      : "ml-auto bg-slate-900 border border-slate-800 text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1 text-[10px] text-slate-400">
                    <strong className={isMe ? "text-cyan-400" : "text-pink-400"}>{m.senderName}</strong>
                    <span>{m.timestamp}</span>
                  </div>
                  <p>{m.text}</p>
                </div>
              );
            })}
            {isTyping && (
              <div className="text-[11px] text-cyan-400 italic animate-pulse">
                المهندس محمود يكتب رداً علمياً...
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSend} className="p-3 border-t border-slate-800 bg-[#080e1c] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={isEn ? "Ask a chemistry or reactor question..." : "اكتب سؤالك في الكيمياء النووية والمفاعلات..."}
              className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-400"
            />
            <button
              type="submit"
              className="rounded-xl bg-cyan-500 p-2.5 text-slate-950 hover:bg-cyan-400 transition-all cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.4)]"
            >
              <Send className="size-4" />
            </button>
          </form>
        </div>

        {/* Right: Downloadable Resources Library */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-2xl border border-slate-800 bg-[#070c18] p-5 space-y-4 shadow-xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <FileText className="size-4 text-cyan-400" />
                <span>{isEn ? "Downloadable Study Summaries" : "ملخصات وملفات بصيغة PDF"}</span>
              </span>
              <span className="text-[10px] font-mono text-slate-400">تحميل مجاني للمشتركين</span>
            </div>

            <div className="space-y-3">
              {SHARED_FILES.map((file, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-800 bg-[#081020] p-3 flex items-center justify-between hover:border-cyan-500/40 transition-all"
                >
                  <div className="space-y-1 truncate pr-2">
                    <div className="text-xs font-semibold text-slate-200 truncate">{file.title}</div>
                    <div className="text-[10px] text-slate-400 flex items-center gap-2">
                      <span className="text-cyan-400 font-medium">{file.category}</span>
                      <span>• {file.size}</span>
                      <span>• {file.downloads} تنزيل</span>
                    </div>
                  </div>

                  <button
                    onClick={() => alert(`بدأ تحميل ملف: ${file.title}`)}
                    className="flex size-8 items-center justify-center rounded-lg border border-slate-700 bg-slate-800 text-slate-300 hover:text-cyan-300 hover:border-cyan-400 transition-all shrink-0 cursor-pointer"
                    title="تحميل الملف"
                  >
                    <Download className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
