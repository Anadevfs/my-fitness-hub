import { useEffect, useState } from "react";

import { getTodayKey } from "@/lib/fitness-data";

export const REMINDERS_STORAGE_KEY = "valkyrfit-reminders";
export const FREE_MEAL_WEEK_STORAGE_KEY = "valkyrfit-free-meal-week";

type DailyReminderState = {
  creatineTaken?: boolean;
  preWorkoutDone?: boolean;
};

type DailyReminders = Record<string, DailyReminderState>;
type FreeMealWeeks = Record<string, boolean>;

function readJson<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(key, JSON.stringify(value));
}

export function getWeekKey(date = new Date()) {
  const start = new Date(date);
  const weekday = start.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  start.setDate(start.getDate() + diff);

  return getTodayKey(start);
}

export function useReminders(date = new Date()) {
  const dateKey = getTodayKey(date);
  const weekKey = getWeekKey(date);
  const [dailyReminders, setDailyReminders] = useState<DailyReminders>(() =>
    readJson(REMINDERS_STORAGE_KEY, {}),
  );
  const [freeMealWeeks, setFreeMealWeeks] = useState<FreeMealWeeks>(() =>
    readJson(FREE_MEAL_WEEK_STORAGE_KEY, {}),
  );

  useEffect(() => {
    setDailyReminders(readJson(REMINDERS_STORAGE_KEY, {}));
    setFreeMealWeeks(readJson(FREE_MEAL_WEEK_STORAGE_KEY, {}));
  }, []);

  function updateDailyReminder(key: keyof DailyReminderState, value: boolean) {
    setDailyReminders((current) => {
      const next = {
        ...current,
        [dateKey]: {
          ...current[dateKey],
          [key]: value,
        },
      };
      writeJson(REMINDERS_STORAGE_KEY, next);
      return next;
    });
  }

  function setFreeMealUsed(value: boolean) {
    setFreeMealWeeks((current) => {
      const next = {
        ...current,
        [weekKey]: value,
      };
      writeJson(FREE_MEAL_WEEK_STORAGE_KEY, next);
      return next;
    });
  }

  return {
    creatineTaken: Boolean(dailyReminders[dateKey]?.creatineTaken),
    dateKey,
    freeMealUsed: Boolean(freeMealWeeks[weekKey]),
    preWorkoutDone: Boolean(dailyReminders[dateKey]?.preWorkoutDone),
    setCreatineTaken: (value: boolean) => updateDailyReminder("creatineTaken", value),
    setFreeMealUsed,
    setPreWorkoutDone: (value: boolean) => updateDailyReminder("preWorkoutDone", value),
    weekKey,
  };
}
