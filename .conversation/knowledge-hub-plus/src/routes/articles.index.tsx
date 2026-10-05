import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/components/ArticleViews";
import { articlesFor } from "@/lib/articles";

export const Route = createFileRoute("/articles/")({
  head: () => ({
    meta: [
      { title: "مقالات وملخصات مجانية في الكيمياء النووية | محمود شلتوت" },
      { name: "description", content: "ملخصات ومقالات مجانية في الكيمياء النووية: عمر النصف، أنواع الإشعاع، المفاعلات النووية وأكثر — لطلاب الجامعات في السعودية والخليج." },
      { property: "og:title", content: "مقالات وملخصات الكيمياء النووية" },
      { property: "og:description", content: "شروحات مجانية مختصرة لأهم موضوعات الكيمياء النووية." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ArticleList lang="ar" items={articlesFor("ar")} />,
});
