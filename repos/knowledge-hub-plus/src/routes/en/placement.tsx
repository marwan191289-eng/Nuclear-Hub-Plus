import { createFileRoute } from "@tanstack/react-router";
import { PlacementQuiz } from "@/components/PlacementQuiz";

export const Route = createFileRoute("/en/placement")({
  head: () => ({
    meta: [
      { title: "Free Nuclear Chemistry Placement Test | Mahmoud Shaltoot" },
      { name: "description", content: "Test your nuclear chemistry level for free and get an instant AI evaluation with a course recommendation." },
      { property: "og:title", content: "Free Placement Test | Mahmoud Shaltoot" },
      { property: "og:description", content: "8 questions and an instant AI evaluation that recommends your course." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <PlacementQuiz lang="en" />,
});
