import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, HeartPulse, Pause, Play, RotateCcw, Sparkles, Timer } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { Badge } from "@/components/ui/badge";
import { useRestTimer } from "@/hooks/use-rest-timer";
import { useWorkoutHistory, getWorkoutExerciseKey } from "@/hooks/use-workout-history";
import { getExerciseCount, getTodayWorkout, workoutWeek } from "@/lib/fitness-data";

export const Route = createFileRoute("/treinos")({
  component: Treinos,
});

const restOptions = [60, 90, 120];

function Treinos() {
  const today = new Date();
  const todayWorkout = getTodayWorkout(today);
  const todayIndex = todayWorkout
    ? Math.max(
        0,
        workoutWeek.findIndex((day) => day.day === todayWorkout.day),
      )
    : 0;
  const [selected, setSelected] = useState(todayIndex);
  const [highlightedDay, setHighlightedDay] = useState<string | null>(null);
  const workoutRefs = useRef<Record<string, HTMLElement | null>>({});
  const highlightTimeout = useRef<ReturnType<typeof window.setTimeout> | null>(null);
  const restTimer = useRestTimer();
  const {
    completedExerciseCount,
    finishTodayWorkout,
    isTodayWorkoutCompleted,
    isTodayWorkoutInProgress,
    startTodayWorkout,
    todayEntry,
    todayExerciseCount,
    toggleExercise,
  } = useWorkoutHistory(today);

  useEffect(() => {
    return () => {
      if (highlightTimeout.current) {
        window.clearTimeout(highlightTimeout.current);
      }
    };
  }, []);

  function handleDayNavigation(day: (typeof workoutWeek)[number], index: number) {
    const workoutCard = workoutRefs.current[day.day];

    setSelected(index);
    setHighlightedDay(day.day);
    workoutCard?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (highlightTimeout.current) {
      window.clearTimeout(highlightTimeout.current);
    }

    highlightTimeout.current = window.setTimeout(() => {
      setHighlightedDay(null);
    }, 1400);
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Treinos</h1>
          <p className="text-muted-foreground mt-2">Sua semana de treino organizada.</p>
        </div>
        {todayWorkout ? (
          <Badge className="w-fit gap-1.5 bg-neon/10 text-neon border-neon/30 hover:bg-neon/10">
            <Sparkles className="h-3.5 w-3.5" />
            Hoje: {todayWorkout.day}
          </Badge>
        ) : (
          <Badge variant="outline" className="w-fit border-accent/30 bg-accent/10 text-accent">
            Hoje é dia de descanso.
          </Badge>
        )}
      </header>

      {!todayWorkout ? (
        <div className="card-elevated rounded-2xl p-5 md:p-6 mb-6">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Hoje é dia de descanso.</h2>
              <p className="text-xs text-muted-foreground mt-1">
                Sem treino cadastrado para hoje. Aproveite para recuperar energia.
              </p>
            </div>
          </div>
        </div>
      ) : null}

      <nav
        aria-label="Navegar pelos treinos da semana"
        className="mb-6 -mx-1 overflow-x-auto px-1 pb-2"
      >
        <div className="flex min-w-max gap-2">
          {workoutWeek.map((d, i) => {
            const isToday = todayWorkout?.day === d.day;
            const isSelected = selected === i;

            return (
              <button
                key={d.day}
                type="button"
                aria-controls={`treino-${i}`}
                aria-current={isSelected ? "true" : undefined}
                onClick={() => handleDayNavigation(d, i)}
                className={`shrink-0 rounded-full border px-4 py-2 text-sm font-semibold transition ${
                  isSelected
                    ? "border-accent/70 bg-accent text-accent-foreground shadow-[0_0_28px_-12px_var(--violet-glow)]"
                    : isToday
                      ? "border-neon/40 bg-neon/10 text-neon hover:border-neon/70"
                      : "border-border bg-secondary/50 text-foreground hover:border-accent/50 hover:text-accent"
                }`}
              >
                {d.day}
              </button>
            );
          })}
        </div>
      </nav>

      <RestTimerCard timer={restTimer} />

      <div className="grid gap-5 lg:grid-cols-2">
        {workoutWeek.map((day, dayIndex) => {
          const exerciseCount = getExerciseCount(day);
          const isToday = todayWorkout?.day === day.day;
          const canTrack = Boolean(isToday && !isTodayWorkoutCompleted);
          const isCurrentWorkout = isToday && isTodayWorkoutInProgress;
          const isCompleted = isToday && isTodayWorkoutCompleted;

          return (
            <section
              id={`treino-${dayIndex}`}
              key={day.day}
              ref={(element) => {
                workoutRefs.current[day.day] = element;
              }}
              className={`card-elevated rounded-2xl p-5 md:p-6 transition ${
                selected === dayIndex ? "border-neon/50" : ""
              } ${isCurrentWorkout ? "ring-1 ring-neon/40" : ""} ${
                highlightedDay === day.day
                  ? "ring-2 ring-accent/80 shadow-[0_0_38px_-14px_var(--violet-glow)]"
                  : ""
              } scroll-mt-24 md:scroll-mt-28`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="text-xs uppercase tracking-wider text-muted-foreground">
                      {day.day}
                    </div>
                    {isToday ? (
                      <Badge variant="outline" className="border-neon/30 bg-neon/10 text-neon">
                        treino de hoje
                      </Badge>
                    ) : null}
                  </div>
                  <h2 className="text-xl font-bold mt-1">{day.focus}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {isToday && (isCurrentWorkout || isCompleted)
                      ? `${completedExerciseCount}/${todayExerciseCount} exercícios concluídos`
                      : `${exerciseCount} exercícios`}
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {day.cardio ? (
                    <Badge className="gap-1.5 bg-neon/10 text-neon border-neon/30 hover:bg-neon/10">
                      <HeartPulse className="h-3.5 w-3.5" />
                      Cardio: {day.cardio}
                    </Badge>
                  ) : null}

                  {isToday ? (
                    <WorkoutAction
                      isCompleted={isTodayWorkoutCompleted}
                      isInProgress={isTodayWorkoutInProgress}
                      onFinish={finishTodayWorkout}
                      onStart={startTodayWorkout}
                    />
                  ) : null}
                </div>
              </div>

              <div className="space-y-5">
                {day.categories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-semibold text-neon mb-3">{category.name}</h3>
                    <ul className="space-y-3">
                      {category.exercises.map((ex) => {
                        const key = getWorkoutExerciseKey(day, category.name, ex.name);
                        const isDone = Boolean(todayEntry?.completedExercises[key]);

                        return (
                          <li
                            key={ex.name}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                              isDone ? "bg-neon/5 border-neon/40" : "border-border bg-secondary/30"
                            }`}
                          >
                            <button
                              type="button"
                              disabled={!canTrack}
                              onClick={() => toggleExercise(key)}
                              className={!canTrack ? "cursor-not-allowed opacity-60" : ""}
                              aria-label={
                                isDone
                                  ? `Desmarcar ${ex.name} como concluído`
                                  : `Marcar ${ex.name} como concluído`
                              }
                            >
                              {isDone ? (
                                <CheckCircle2 className="h-6 w-6 text-neon" />
                              ) : (
                                <Circle className="h-6 w-6 text-muted-foreground" />
                              )}
                            </button>
                            <div className="min-w-0 flex-1">
                              <div
                                className={`font-medium leading-snug ${
                                  isDone ? "line-through text-muted-foreground" : ""
                                }`}
                              >
                                {ex.name}
                              </div>
                              <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                                {ex.prescription}
                              </div>
                            </div>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}

type RestTimer = ReturnType<typeof useRestTimer>;

function RestTimerCard({ timer }: { timer: RestTimer }) {
  const isFinished = timer.status === "finished";
  const isRunning = timer.status === "running";
  const isPaused = timer.status === "paused";

  return (
    <section className="card-elevated rounded-2xl p-5 md:p-6 mb-6 overflow-hidden relative">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/70 to-transparent" />
      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div>
          <div className="flex items-center gap-3 mb-3">
            <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
              <Timer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-semibold">Descanso</h2>
              <p className="text-xs text-muted-foreground">Timer entre séries.</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {restOptions.map((seconds) => (
              <button
                key={seconds}
                type="button"
                onClick={() => timer.start(seconds)}
                className="rounded-xl border border-accent/25 bg-accent/10 px-4 py-2 text-sm font-semibold text-accent hover:border-accent/50 transition"
              >
                {seconds}s
              </button>
            ))}
          </div>
        </div>

        <div className={`rounded-2xl border p-5 transition ${isFinished ? "border-neon/40 bg-neon/10" : "border-border bg-secondary/30"}`}>
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="text-xs uppercase tracking-wider text-muted-foreground">
                {isFinished ? "Próxima série" : "Tempo restante"}
              </div>
              <div className={`text-5xl font-bold mt-1 ${isRunning ? "text-accent animate-pulse" : isFinished ? "text-neon" : ""}`}>
                {isFinished ? "00:00" : formatTimer(timer.remaining)}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              {isRunning ? (
                <button
                  type="button"
                  onClick={timer.pause}
                  className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-semibold hover:border-accent/40 transition inline-flex items-center gap-2"
                >
                  <Pause className="h-4 w-4" />
                  Pausar
                </button>
              ) : null}
              {isPaused ? (
                <button
                  type="button"
                  onClick={timer.resume}
                  className="rounded-xl bg-neon px-4 py-2 text-sm font-semibold text-primary-foreground glow-neon hover:opacity-90 transition inline-flex items-center gap-2"
                >
                  <Play className="h-4 w-4" />
                  Continuar
                </button>
              ) : null}
              {timer.status !== "idle" ? (
                <button
                  type="button"
                  onClick={timer.reset}
                  className="rounded-xl border border-border bg-muted/40 px-4 py-2 text-sm font-semibold hover:border-neon/40 transition inline-flex items-center gap-2"
                >
                  <RotateCcw className="h-4 w-4" />
                  Resetar
                </button>
              ) : null}
            </div>
          </div>

          <div className="mt-4 h-2 overflow-hidden rounded-full bg-background/80">
            <div
              className="h-full rounded-full bg-accent transition-all duration-500"
              style={{ width: `${isFinished ? 100 : timer.progress}%` }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function formatTimer(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainder = seconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
}

type WorkoutActionProps = {
  isCompleted: boolean;
  isInProgress: boolean;
  onFinish: () => void;
  onStart: () => boolean;
};

function WorkoutAction({ isCompleted, isInProgress, onFinish, onStart }: WorkoutActionProps) {
  if (isCompleted) {
    return (
      <button
        type="button"
        disabled
        className="bg-neon/20 text-neon border border-neon/30 font-semibold px-4 py-2 rounded-xl text-sm cursor-default"
      >
        Treino concluído
      </button>
    );
  }

  if (isInProgress) {
    return (
      <button
        type="button"
        onClick={onFinish}
        className="bg-neon text-primary-foreground font-semibold px-4 py-2 rounded-xl text-sm glow-neon hover:opacity-90"
      >
        Finalizar treino
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onStart}
      className="bg-neon text-primary-foreground font-semibold px-4 py-2 rounded-xl text-sm glow-neon hover:opacity-90 inline-flex items-center gap-2"
    >
      <Play className="h-4 w-4" />
      Iniciar treino
    </button>
  );
}
