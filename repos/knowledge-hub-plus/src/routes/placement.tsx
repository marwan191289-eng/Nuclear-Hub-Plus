import { createFileRoute } from "@tanstack/react-router";
import { PlacementQuiz } from "@/components/PlacementQuiz";

export const Route = createFileRoute("/placement")({
  head: () => ({
    meta: [
      { title: "اختبار تحديد المستوى المجاني | الكيمياء النووية" },
      { name: "description", content: "اختبر مستواك في الكيمياء النووية مجانًا، واحصل على تقييم فوري بالذكاء الاصطناعي واقتراح الدورة المناسبة لك." },
      { property: "og:title", content: "اختبار تحديد المستوى | محمود شلتوت" },
      { property: "og:description", content: "٨ أسئلة وتقييم فوري بالذكاء الاصطناعي يقترح لك الدورة المناسبة." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlacementQuiz lang="ar" />,
});
