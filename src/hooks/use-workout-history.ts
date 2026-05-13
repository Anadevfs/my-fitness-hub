import { useEffect, useMemo, useState } from "react";

import { getExercises, getTodayKey, getTodayWorkout, type WorkoutDay } from "@/lib/fitness-data";

export const WORKOUT_HISTORY_KEY = "valkyrfit-workout-history";

type WorkoutStatus = "in-progress" | "completed";

type WorkoutEntry = {
  date: string;
  day: string;
  focus: string;
  status: WorkoutStatus;
  startedAt: string;
  completedAt?: string;
  completedExercises: Record<string, boolean>;
};

type WorkoutHistory = Record<string, WorkoutEntry>;

function readHistory(): WorkoutHistory {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(WORKOUT_HISTORY_KEY);
    return raw ? (JSON.parse(raw) as WorkoutHistory) : {};
  } catch {
    return {};
  }
}

function saveHistory(history: WorkoutHistory) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(history));
}

export function getWorkoutExerciseKey(day: WorkoutDay, categoryName: string, exerciseName: string) {
  return `${day.day}-${categoryName}-${exerciseName}`;
}

export function useWorkoutHistory(date = new Date()) {
  const todayKey = getTodayKey(date);
  const todayWorkout = getTodayWorkout(date);
  const [history, setHistory] = useState<WorkoutHistory>(() => readHistory());

  useEffect(() => {
    setHistory(readHistory());
  }, []);

  const todayEntry = history[todayKey];
  const isTodayWorkoutCompleted = todayEntry?.status === "completed";
  const isTodayWorkoutInProgress = todayEntry?.status === "in-progress";

  function updateHistory(updater: (current: WorkoutHistory) => WorkoutHistory) {
    setHistory((current) => {
      const next = updater(current);
      saveHistory(next);
      return next;
    });
  }

  function startTodayWorkout() {
    if (!todayWorkout) return false;

    updateHistory((current) => {
      const currentEntry = current[todayKey];

      if (currentEntry?.status === "completed") return current;

      return {
        ...current,
        [todayKey]: {
          date: todayKey,
          day: todayWorkout.day,
          focus: todayWorkout.focus,
          status: "in-progress",
          startedAt: currentEntry?.startedAt ?? new Date().toISOString(),
          completedExercises: currentEntry?.completedExercises ?? {},
        },
      };
    });

    return true;
  }

  function toggleExercise(exerciseKey: string) {
    if (!todayWorkout || isTodayWorkoutCompleted) return;

    updateHistory((current) => {
      const currentEntry = current[todayKey];
      const entry: WorkoutEntry =
        currentEntry ?? {
          date: todayKey,
          day: todayWorkout.day,
          focus: todayWorkout.focus,
          status: "in-progress",
          startedAt: new Date().toISOString(),
          completedExercises: {},
        };

      return {
        ...current,
        [todayKey]: {
          ...entry,
          status: "in-progress",
          completedExercises: {
            ...entry.completedExercises,
            [exerciseKey]: !entry.completedExercises[exerciseKey],
          },
        },
      };
    });
  }

  function finishTodayWorkout() {
    if (!todayWorkout) return;

    updateHistory((current) => {
      const currentEntry = current[todayKey];

      return {
        ...current,
        [todayKey]: {
          date: todayKey,
          day: todayWorkout.day,
          focus: todayWorkout.focus,
          status: "completed",
          startedAt: currentEntry?.startedAt ?? new Date().toISOString(),
          completedAt: new Date().toISOString(),
          completedExercises: currentEntry?.completedExercises ?? {},
        },
      };
    });
  }

  const todayExerciseCount = todayWorkout ? getExercises(todayWorkout).length : 0;
  const completedExerciseCount = useMemo(() => {
    if (!todayWorkout || !todayEntry) return 0;

    return todayWorkout.categories.reduce(
      (total, category) =>
        total +
        category.exercises.filter(
          (exercise) =>
            todayEntry.completedExercises[
              getWorkoutExerciseKey(todayWorkout, category.name, exercise.name)
            ],
        ).length,
      0,
    );
  }, [todayEntry, todayWorkout]);

  return {
    completedExerciseCount,
    finishTodayWorkout,
    history,
    isTodayWorkoutCompleted,
    isTodayWorkoutInProgress,
    startTodayWorkout,
    todayEntry,
    todayExerciseCount,
    todayKey,
    todayWorkout,
    toggleExercise,
  };
}
