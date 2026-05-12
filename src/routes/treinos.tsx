import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, HeartPulse } from "lucide-react";
import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { getExerciseCount, workoutWeek } from "@/lib/fitness-data";

export const Route = createFileRoute("/treinos")({
  component: Treinos,
});

function Treinos() {
  const [selected, setSelected] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Treinos</h1>
        <p className="text-muted-foreground mt-2">Sua semana de treino organizada.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {workoutWeek.map((d, i) => (
          <button
            key={d.day}
            onClick={() => setSelected(i)}
            className={`shrink-0 px-4 py-3 rounded-xl text-left transition ${
              selected === i
                ? "bg-neon text-primary-foreground glow-neon"
                : "card-elevated hover:border-neon/30"
            }`}
          >
            <div className="text-[10px] uppercase tracking-wider opacity-70">{d.day}</div>
            <div className="text-sm font-semibold mt-0.5">{d.focus}</div>
          </button>
        ))}
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {workoutWeek.map((day, dayIndex) => {
          const exerciseCount = getExerciseCount(day);

          return (
            <section
              key={day.day}
              className={`card-elevated rounded-2xl p-5 md:p-6 transition ${
                selected === dayIndex ? "border-neon/50" : ""
              }`}
            >
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
                <div>
                  <div className="text-xs uppercase tracking-wider text-muted-foreground">
                    {day.day}
                  </div>
                  <h2 className="text-xl font-bold mt-1">{day.focus}</h2>
                  <p className="text-xs text-muted-foreground mt-1">
                    {exerciseCount} exercícios
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {day.cardio ? (
                    <Badge className="gap-1.5 bg-neon/10 text-neon border-neon/30 hover:bg-neon/10">
                      <HeartPulse className="h-3.5 w-3.5" />
                      Cardio: {day.cardio}
                    </Badge>
                  ) : null}
                  <button className="bg-neon text-primary-foreground font-semibold px-4 py-2 rounded-xl text-sm glow-neon hover:opacity-90">
                    Concluir treino
                  </button>
                </div>
              </div>

              <div className="space-y-5">
                {day.categories.map((category) => (
                  <div key={category.name}>
                    <h3 className="text-sm font-semibold text-neon mb-3">{category.name}</h3>
                    <ul className="space-y-3">
                      {category.exercises.map((ex) => {
                        const key = `${day.day}-${category.name}-${ex.name}`;
                        const isDone = done[key];

                        return (
                          <li
                            key={ex.name}
                            className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                              isDone ? "bg-neon/5 border-neon/40" : "border-border bg-secondary/30"
                            }`}
                          >
                            <button
                              onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}
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
