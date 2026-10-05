import React from "react";
import { Course } from "../types";
import { Check, Clock } from "lucide-react";

interface CoursesSectionProps {
  courses: Course[];
  onEnroll: (course: Course) => void;
  language: "ar" | "en";
}

export function CoursesSection({ courses, onEnroll, language }: CoursesSectionProps) {
  const isEn = language === "en";

  return (
    <section className="py-16 px-6 lg:px-10 max-w-[1240px] mx-auto space-y-10">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-cyan-400 font-bold mb-3">
            <span className="size-2 rounded-full bg-cyan-400" />
            <span>{isEn ? "ACADEMIC PROGRAMS & COURSES" : "البرامج والدورات الأكاديمية التخصصية"}</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            {isEn ? "Flagship Nuclear Courses" : "المقررات المتاحة للتسجيل الفوري"}
          </h2>
          <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
            {isEn
              ? "Comprehensive curricula combining theoretical physics with applied reactor engineering, designed for university and gifted pre-college students."
              : "مناهج مكثفة تجمع بين النظريات الفيزيائية والتطبيق العملي للمفاعلات، مصمّمة خصيصاً لطلاب الجامعات والموهوبين بالمملكة والخليج."}
          </p>
        </div>

        <div className="rounded-xl border border-slate-800 bg-slate-900/50 px-4 py-3 text-xs text-slate-400">
            <span className="block font-semibold text-emerald-400">{isEn ? "Clear program information" : "معلومات أكاديمية واضحة"}</span>
            <span className="mt-1 block">{isEn ? "Syllabus, duration and tuition shown before enrolment." : "المحاور والمدة والرسوم موضحة قبل التسجيل."}</span>
        </div>
      </div>

      {/* Courses Cards Grid */}
      {courses.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/40 px-6 py-14 text-center">
          <h3 className="text-lg font-bold text-white">{isEn ? "Courses are being prepared" : "يجري إعداد المقررات"}</h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-slate-400">
            {isEn ? "Please check back soon for the available academic programs." : "يرجى العودة قريباً للاطلاع على البرامج الأكاديمية المتاحة."}
          </p>
        </div>
      ) : <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-7" aria-label={isEn ? "Available courses" : "المقررات المتاحة"}>
        {courses.map((course) => (
          <div
            key={course.id}
            className="group relative rounded-2xl border border-slate-800 bg-[#080d1a] overflow-hidden flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:border-cyan-500/50 hover:shadow-[0_0_50px_rgba(0,240,255,0.18)]"
          >
            {/* Course Artwork */}
            <div className="relative aspect-[16/10] overflow-hidden bg-black">
              <img
                src={course.image}
                alt={isEn ? course.titleEn : course.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#080d1a] via-transparent to-transparent opacity-90" />

              {/* Level & Mode Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="rounded-full bg-black/75 px-3 py-1 text-[11px] font-mono font-bold text-cyan-300 border border-cyan-500/40 backdrop-blur-md">
                  {course.level}
                </span>
                <span className="rounded-full bg-pink-950/80 px-2.5 py-0.5 text-[10px] font-bold text-pink-300 border border-pink-500/30 backdrop-blur-md">
                  {isEn ? (course.id === "fundamentals" ? "Live" : course.id === "reactors" ? "Intensive" : "Advanced") : course.tag}
                </span>
              </div>
            </div>

            {/* Content Body */}
            <div className="p-5 sm:p-6 flex-1 flex flex-col justify-between space-y-5">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <Clock className="size-3.5 text-cyan-400" />
                    <span>{isEn ? course.durationEn : course.duration}</span>
                  </span>
                  <span className="text-[11px] text-slate-400">{isEn ? "Instructor-led course" : "مقرر بإشراف المدرّب"}</span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {isEn ? course.titleEn : course.title}
                </h3>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {isEn ? course.descEn : course.desc}
                </p>

                {/* Topics list */}
                <div className="space-y-1.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                    {isEn ? "Core Syllabus Topics:" : "أبرز محاور المنهج:"}
                  </span>
                  {(isEn ? (course.topicsEn ?? course.topics) : course.topics).slice(0, 4).map((topic, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs text-slate-300">
                      <Check className="size-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{topic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price & CTA */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase text-slate-400 block font-mono">
                    {isEn ? "Tuition (Full Course)" : "رسوم المقرر الشامل"}
                  </span>
                  <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1">
                    <span>{course.price}</span>
                    <span className="text-xs font-normal text-slate-400">{isEn ? "SAR" : "ريال سعودي"}</span>
                  </div>
                </div>

                <button
                  onClick={() => onEnroll(course)}
                  className="rounded-full bg-gradient-to-r from-[#00f0ff] via-[#10e9ff] to-[#00d4f0] px-7 py-3 text-xs font-extrabold text-slate-950 shadow-[0_0_25px_rgba(0,240,255,0.45)] border border-cyan-100/60 transition-all hover:scale-105 hover:shadow-[0_0_35px_rgba(0,240,255,0.7)] active:scale-95 cursor-pointer"
                >
                  {isEn ? "Enroll & Pay" : "سجّل الآن"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>}
    </section>
  );
}
