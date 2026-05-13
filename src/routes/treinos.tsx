import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, HeartPulse, Pause, Play, RotateCcw, Sparkles, Timer } from "lucide-react";
import { useState } from "react";

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

      <RestTimerCard timer={restTimer} />

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {workoutWeek.map((d, i) => {
          const isToday = todayWorkout?.day === d.day;
          const isActiveToday = isToday && isTodayWorkoutInProgress;
          const isCompletedToday = isToday && isTodayWorkoutCompleted;

          return (
            <button
              key={d.day}
              onClick={() => setSelected(i)}
              className={`shrink-0 px-4 py-3 rounded-xl text-left transition ${
                selected === i
                  ? "bg-neon text-primary-foreground glow-neon"
                  : isActiveToday || isCompletedToday
                    ? "card-elevated border-neon/40"
                    : "card-elevated hover:border-neon/30"
              }`}
            >
              <div className="text-[10px] uppercase tracking-wider opacity-70">{d.day}</div>
              <div className="text-sm font-semibold mt-0.5">{d.focus}</div>
              {isActiveToday ? <div className="text-[10px] mt-1 opacity-80">em andamento</div> : null}
              {isCompletedToday ? <div className="text-[10px] mt-1 opacity-80">concluído</div> : null}
            </button>
          );
        })}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {workoutWeek.map((day, dayIndex) => {
          const exerciseCount = getExerciseCount(day);
          const isToday = todayWorkout?.day === day.day;
          const canTrack = Boolean(isToday && !isTodayWorkoutCompleted);
          const isCurrentWorkout = isToday && isTodayWorkoutInProgress;
          const isCompleted = isToday && isTodayWorkoutCompleted;

          return (
            <section
              key={day.day}
              className={`card-elevated rounded-2xl p-5 md:p-6 transition ${
                selected === dayIndex ? "border-neon/50" : ""
              } ${isCurrentWorkout ? "ring-1 ring-neon/40" : ""}`}
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
