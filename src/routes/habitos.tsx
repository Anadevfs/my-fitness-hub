import { createFileRoute } from "@tanstack/react-router";
import { Droplet, Heart, Pill } from "lucide-react";

import { useHabitChecks } from "@/hooks/use-habit-checks";
import { habits } from "@/lib/fitness-data";

export const Route = createFileRoute("/habitos")({
  component: Habitos,
});

const habitIcons = {
  agua: Droplet,
  cardio: Heart,
  supl: Pill,
};

function Habitos() {
  const [checks, setChecks] = useHabitChecks();

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Hábitos</h1>
        <p className="text-muted-foreground mt-2">Checklists diários para manter a constância.</p>
      </header>

      <div className="grid md:grid-cols-2 gap-4">
        {habits.map((h) => {
          const Icon = habitIcons[h.id as keyof typeof habitIcons];
          const completed = h.items.filter((i) => checks[`${h.id}-${i}`]).length;
          const pct = (completed / h.items.length) * 100;
          const progress =
            h.id === "agua" && completed === h.items.length
              ? "3L concluídos"
              : `${completed}/${h.items.length}`;

          return (
            <div key={h.id} className="card-elevated rounded-2xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{h.label}</h2>
                    <p className="text-xs text-muted-foreground">Meta: {h.goal}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">{h.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-neon">{progress}</div>
                  {h.id === "agua" && (
                    <div className="text-[11px] text-muted-foreground">600ml cada</div>
                  )}
                </div>
              </div>

              <div className="h-1.5 bg-secondary rounded-full mb-4 overflow-hidden">
                <div className="h-full gradient-primary transition-all" style={{ width: `${pct}%` }} />
              </div>

              <ul className="space-y-2">
                {h.items.map((it) => {
                  const key = `${h.id}-${it}`;
                  const done = checks[key];
                  return (
                    <li key={it}>
                      <button
                        onClick={() => setChecks((c) => ({ ...c, [key]: !c[key] }))}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-secondary/50 transition text-left"
                      >
                        <span className={`h-5 w-5 rounded-md border-2 flex items-center justify-center transition ${done ? "bg-neon border-neon" : "border-border"}`}>
                          {done && <span className="text-[10px] text-primary-foreground font-bold">✓</span>}
                        </span>
                        <span className={`text-sm ${done ? "line-through text-muted-foreground" : ""}`}>{it}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
