import { useEffect, useState } from "react";

import { getTodayKey } from "@/lib/fitness-data";

export const HABITS_STORAGE_KEY = "my-fitness-hub-habits";

export type HabitChecks = Record<string, boolean>;
type HabitsByDate = Record<string, HabitChecks>;

function readHabitsByDate(): HabitsByDate {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const raw = window.localStorage.getItem(HABITS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function writeHabitChecks(dateKey: string, checks: HabitChecks) {
  if (typeof window === "undefined") {
    return;
  }

  const habitsByDate = readHabitsByDate();
  habitsByDate[dateKey] = checks;
  window.localStorage.setItem(HABITS_STORAGE_KEY, JSON.stringify(habitsByDate));
}

export function getStoredHabitChecks(dateKey = getTodayKey()) {
  return readHabitsByDate()[dateKey] ?? {};
}

export function useHabitChecks(dateKey = getTodayKey()) {
  const [checks, setChecks] = useState<HabitChecks>({});
  const [loadedDateKey, setLoadedDateKey] = useState<string | null>(null);

  useEffect(() => {
    setChecks(getStoredHabitChecks(dateKey));
    setLoadedDateKey(dateKey);
  }, [dateKey]);

  useEffect(() => {
    if (loadedDateKey !== dateKey) {
      return;
    }

    writeHabitChecks(dateKey, checks);
  }, [checks, dateKey, loadedDateKey]);

  return [checks, setChecks] as const;
}
