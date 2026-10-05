import { useState, useEffect } from "react";

interface CounterState {
  count: number;
  isPulsing: boolean;
  notification: string | null;
  rateDescription: string;
}

const UNIVERSITY_STUDENTS = [
  { city: "جامعة الملك فهد للبترول والمعادن (KFUPM)", course: "التفاعلات والمفاعلات النووية" },
  { city: "جامعة الملك سعود (KSU) - كلية العلوم", course: "أساسيات الكيمياء النووية" },
  { city: "جامعة الملك عبد العزيز (KAU) - جدة", course: "السلامة الإشعاعية والوقاية" },
  { city: "جامعة الكويت (KU) - قسم الفيزياء والعلوم النووية", course: "حسابات عمر النصف والانحلال" },
  { city: "جامعة الإمام عبد الرحمن بن فيصل - الدمام", course: "كينيتيكا المفاعلات النووية" },
  { city: "جامعة الإمارات العربية المتحدة (UAEU)", course: "أساسيات الكيمياء النووية" },
  { city: "جامعة قطر - كلية الهندسة والعلوم", course: "التفاعلات والمفاعلات النووية" },
  { city: "جامعة البحرين - الصخير", course: "السلامة الإشعاعية والوقاية المتقدمة" },
];

export function useStudentCounter(): CounterState {
  const [count, setCount] = useState<number>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("nuclear_hub_students_count");
      if (saved) {
        const parsed = parseInt(saved, 10);
        if (!isNaN(parsed) && parsed >= 500 && parsed < 700) {
          return parsed;
        }
      }
    }
    // Base 542 for an established, realistic academic cohort
    return 542;
  });

  const [isPulsing, setIsPulsing] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    let timerId: number;

    const scheduleNext = (isFirst = false) => {
      // First synchronized tick after 4 seconds so the user immediately sees both numbers increment together
      // Subsequent ticks every 7-10 seconds
      const delay = isFirst ? 4000 : Math.floor(Math.random() * (10000 - 7000)) + 7000;

      timerId = window.setTimeout(() => {
        if (!isMounted) return;

        const add = 1; // Increment by 1 student consistently

        setCount((prev) => {
          const next = prev + add;
          if (typeof window !== "undefined") {
            localStorage.setItem("nuclear_hub_students_count", next.toString());
          }
          return next;
        });

        // Trigger synchronized pulse animation on BOTH numbers at the exact same millisecond
        setIsPulsing(true);

        const entry = UNIVERSITY_STUDENTS[Math.floor(Math.random() * UNIVERSITY_STUDENTS.length)];
        setNotification(`انضمام طالب جامعي جديد من ${entry.city} إلى «${entry.course}» (+${add})`);

        window.setTimeout(() => {
          if (isMounted) setIsPulsing(false);
        }, 1800);

        window.setTimeout(() => {
          if (isMounted) setNotification(null);
        }, 4500);

        scheduleNext(false);
      }, delay);
    };

    scheduleNext(true);

    return () => {
      isMounted = false;
      window.clearTimeout(timerId);
    };
  }, []);

  return {
    count,
    isPulsing,
    notification,
    rateDescription: "معدل واقعي متزامن: يتم تحديث كلا الرقمين معاً بنظام التايمر المباشر",
  };
}
