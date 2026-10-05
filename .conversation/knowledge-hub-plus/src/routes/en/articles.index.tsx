import { createFileRoute } from "@tanstack/react-router";
import { ArticleList } from "@/components/ArticleViews";
import { articlesFor } from "@/lib/articles";

export const Route = createFileRoute("/en/articles/")({
  head: () => ({
    meta: [
      { title: "Free Nuclear Chemistry Articles & Summaries | Mahmoud Shaltoot" },
      { name: "description", content: "Free nuclear chemistry summaries and articles: half-life, radiation types, nuclear reactors and more — for university students in the Gulf." },
      { property: "og:title", content: "Nuclear Chemistry Articles & Summaries" },
      { property: "og:description", content: "Free, concise explanations of core nuclear chemistry topics." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <ArticleList lang="en" items={articlesFor("en")} />,
});
