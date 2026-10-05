import { useEffect, useState } from "react";

interface CounterState {
  count: number;
  isPulsing: boolean;
  notification: string | null;
  rateDescription: string;
  isLoading: boolean;
  error: string | null;
  coursesCount: number | null;
  satisfactionRate: string | null;
  experienceYears: string | null;
  lastHourIncrease: number | null;
}

interface StatsResponse {
  studentsCount: number;
  baseDisplay: string;
  lastHourIncrease: number;
  nextIncrementMinutes: number;
  coursesCount: number;
  satisfactionRate: string;
  experienceYears: string;
}

export function useStudentCounter(): CounterState {
  const [count, setCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<StatsResponse | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/stats", { credentials: "include", signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("stats_unavailable");
        return response.json() as Promise<StatsResponse>;
      })
      .then((stats) => {
        if (Number.isFinite(stats.studentsCount)) {
          setCount(stats.studentsCount);
          setStats(stats);
        }
        else throw new Error("invalid_stats");
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError("unavailable");
      })
      .finally(() => {
        if (!controller.signal.aborted) setIsLoading(false);
      });
    return () => controller.abort();
  }, []);

  return {
    count,
    isPulsing: false,
    notification: null,
    rateDescription: "Server-reported learner count. Updated on the server’s hourly schedule.",
    isLoading,
    error,
    coursesCount: stats?.coursesCount ?? null,
    satisfactionRate: stats?.satisfactionRate ?? null,
    experienceYears: stats?.experienceYears ?? null,
    lastHourIncrease: stats ? Math.min(3, Math.max(0, Math.floor(Number(stats.lastHourIncrease) || 0))) : null,
  };
}
