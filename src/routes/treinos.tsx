import { createFileRoute } from "@tanstack/react-router";
import { CheckCircle2, Circle, Timer } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/treinos")({
  component: Treinos,
});

const week = [
  { day: "Segunda", focus: "Pernas", exercises: [
    { name: "Agachamento livre", sets: 4, reps: 10, rest: "90s" },
    { name: "Leg press 45°", sets: 4, reps: 12, rest: "75s" },
    { name: "Cadeira extensora", sets: 3, reps: 15, rest: "60s" },
    { name: "Stiff", sets: 3, reps: 12, rest: "75s" },
    { name: "Panturrilha em pé", sets: 4, reps: 20, rest: "45s" },
  ]},
  { day: "Terça", focus: "Costas e Bíceps", exercises: [
    { name: "Puxada frontal", sets: 4, reps: 10, rest: "75s" },
    { name: "Remada curvada", sets: 4, reps: 10, rest: "75s" },
    { name: "Remada unilateral", sets: 3, reps: 12, rest: "60s" },
    { name: "Rosca direta", sets: 3, reps: 12, rest: "60s" },
    { name: "Rosca martelo", sets: 3, reps: 12, rest: "60s" },
  ]},
  { day: "Quarta", focus: "Cardio", exercises: [
    { name: "Esteira (incline)", sets: 1, reps: 30, rest: "—" },
    { name: "Bike moderada", sets: 1, reps: 20, rest: "—" },
  ]},
  { day: "Quinta", focus: "Peito e Tríceps", exercises: [
    { name: "Supino reto", sets: 4, reps: 10, rest: "90s" },
    { name: "Supino inclinado halter", sets: 4, reps: 10, rest: "75s" },
    { name: "Crucifixo", sets: 3, reps: 12, rest: "60s" },
    { name: "Tríceps corda", sets: 4, reps: 12, rest: "60s" },
  ]},
  { day: "Sexta", focus: "Ombros e Core", exercises: [
    { name: "Desenvolvimento militar", sets: 4, reps: 10, rest: "75s" },
    { name: "Elevação lateral", sets: 4, reps: 12, rest: "45s" },
    { name: "Prancha", sets: 3, reps: 60, rest: "45s" },
    { name: "Abdominal infra", sets: 3, reps: 15, rest: "45s" },
  ]},
  { day: "Sábado", focus: "Funcional", exercises: [
    { name: "Burpees", sets: 4, reps: 12, rest: "60s" },
    { name: "Kettlebell swing", sets: 4, reps: 15, rest: "60s" },
    { name: "Jump squat", sets: 4, reps: 12, rest: "60s" },
  ]},
  { day: "Domingo", focus: "Descanso ativo", exercises: [
    { name: "Caminhada leve", sets: 1, reps: 45, rest: "—" },
    { name: "Alongamento", sets: 1, reps: 15, rest: "—" },
  ]},
];

function Treinos() {
  const [selected, setSelected] = useState(0);
  const [done, setDone] = useState<Record<string, boolean>>({});
  const current = week[selected];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Treinos</h1>
        <p className="text-muted-foreground mt-2">Sua semana de treino organizada.</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-6 -mx-1 px-1">
        {week.map((d, i) => (
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

      <div className="card-elevated rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold">{current.focus}</h2>
            <p className="text-xs text-muted-foreground mt-1">{current.exercises.length} exercícios</p>
          </div>
          <button className="bg-neon text-primary-foreground font-semibold px-5 py-2.5 rounded-xl text-sm glow-neon hover:opacity-90">
            Concluir treino
          </button>
        </div>

        <ul className="space-y-3">
          {current.exercises.map((ex) => {
            const key = `${selected}-${ex.name}`;
            const isDone = done[key];
            return (
              <li
                key={ex.name}
                className={`flex items-center gap-4 p-4 rounded-xl border transition ${
                  isDone ? "bg-neon/5 border-neon/40" : "border-border bg-secondary/30"
                }`}
              >
                <button onClick={() => setDone((d) => ({ ...d, [key]: !d[key] }))}>
                  {isDone ? <CheckCircle2 className="h-6 w-6 text-neon" /> : <Circle className="h-6 w-6 text-muted-foreground" />}
                </button>
                <div className="flex-1">
                  <div className={`font-medium ${isDone ? "line-through text-muted-foreground" : ""}`}>{ex.name}</div>
                  <div className="text-xs text-muted-foreground mt-0.5 font-mono">
                    {ex.sets} séries × {ex.reps} reps
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Timer className="h-3.5 w-3.5" />{ex.rest}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
