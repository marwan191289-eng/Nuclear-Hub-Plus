const APP_BASE_PATH = import.meta.env.BASE_URL;
const API_BASE_PATH = import.meta.env.DEV
  ? "_nuclear-knowledge-api"
  : "api";

export function appPath(path: string): string {
  if (/^(?:https?:|data:|blob:)/i.test(path)) return path;
  const normalizedPath = path.replace(/^\/+/, "");
  const resolvedPath = normalizedPath.startsWith("api/")
    ? `${API_BASE_PATH}/${normalizedPath.slice("api/".length)}`
    : normalizedPath;
  return `${APP_BASE_PATH}${resolvedPath}`;
}
