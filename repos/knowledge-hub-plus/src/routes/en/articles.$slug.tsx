import { createFileRoute, notFound } from "@tanstack/react-router";
import { ArticleBody, articleHead } from "@/components/ArticleViews";
import { findArticle } from "@/lib/articles";

export const Route = createFileRoute("/en/articles/$slug")({
  loader: ({ params }) => {
    const a = findArticle("en", params.slug);
    if (!a) throw notFound();
    return a;
  },
  head: ({ loaderData }) => articleHead(loaderData),
  component: () => <ArticleBody a={Route.useLoaderData()} />,
});
