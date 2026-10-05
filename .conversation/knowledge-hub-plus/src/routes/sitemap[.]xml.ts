import { createFileRoute } from "@tanstack/react-router";
import { ARTICLES } from "@/lib/articles";

const PAGES = ["/", "/courses", "/placement", "/articles", "/about", "/booking"];

export const Route = createFileRoute("/sitemap.xml")({
  server: {
    handlers: {
      GET: ({ request }) => {
        const origin = new URL(request.url).origin;
        const urls = [
          ...PAGES,
          ...PAGES.map((p) => (p === "/" ? "/en" : `/en${p}`)),
          ...ARTICLES.map((a) => (a.lang === "en" ? `/en/articles/${a.slug}` : `/articles/${a.slug}`)),
        ];
        const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls
          .map((u) => `  <url><loc>${origin}${u}</loc></url>`)
          .join("\n")}\n</urlset>`;
        return new Response(xml, { headers: { "Content-Type": "application/xml" } });
      },
    },
  },
});
