import { useRouterState } from "@tanstack/react-router";

export type Lang = "ar" | "en";

export function langFromPath(pathname: string): Lang {
  return pathname === "/en" || pathname.startsWith("/en/") ? "en" : "ar";
}

export function useLang(): Lang {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return langFromPath(pathname);
}

/** Path of the same page in the other language. */
export function switchPath(pathname: string): string {
  if (langFromPath(pathname) === "en") {
    const rest = pathname.replace(/^\/en/, "");
    return rest || "/";
  }
  return pathname === "/" ? "/en" : `/en${pathname}`;
}
