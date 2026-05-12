import { createFileRoute } from "@tanstack/react-router";
import { Pencil, Scale, Target, TrendingDown } from "lucide-react";
import { type FormEvent, useState } from "react";

import {
  type EvolutionSettings,
  useEvolutionSettings,
} from "@/hooks/use-evolution-settings";
import { bodyMeasures } from "@/lib/fitness-data";

export const Route = createFileRoute("/evolucao")({
  component: Evolucao,
});

function Evolucao() {
  const [settings, saveSettings] = useEvolutionSettings();
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState<EvolutionSettings>(settings);
  const weightHistory = buildWeightHistory(settings.initialWeight, settings.currentWeight);
  const currentWeight = settings.currentWeight;
  const initialWeight = settings.initialWeight;
  const goalWeight = settings.goalWeight;
  const lostWeight = initialWeight - currentWeight;
  const remainingWeight = currentWeight - goalWeight;
  const min = Math.min(...weightHistory.map((h) => h.weight)) - 0.5;
  const max = Math.max(...weightHistory.map((h) => h.weight)) + 0.5;
  const range = max - min;
  const points = weightHistory.map((h, i) => {
    const x = (i / (weightHistory.length - 1)) * 100;
    const y = 100 - ((h.weight - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  function openEditor() {
    setDraft(settings);
    setIsEditing(true);
  }

  function saveEditor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    saveSettings({
      initialWeight: Number(draft.initialWeight),
      currentWeight: Number(draft.currentWeight),
      goalWeight: Number(draft.goalWeight),
    });
    setIsEditing(false);
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Evolução</h1>
          <p className="text-muted-foreground mt-2">Acompanhe seu progresso ao longo do tempo.</p>
        </div>
        <button
          onClick={openEditor}
          className="card-elevated rounded-xl px-4 py-2.5 text-sm font-semibold text-neon hover:border-neon/40 transition flex items-center gap-2"
        >
          <Pencil className="h-4 w-4" />
          Editar
        </button>
      </header>

      {isEditing && (
        <form onSubmit={saveEditor} className="card-elevated rounded-2xl p-6 mb-6">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Peso inicial
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draft.initialWeight}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    initialWeight: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-neon"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Peso atual
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draft.currentWeight}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    currentWeight: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-neon"
              />
            </label>
            <label className="space-y-2">
              <span className="text-xs uppercase tracking-wider text-muted-foreground">
                Meta de peso
              </span>
              <input
                type="number"
                min="0"
                step="0.1"
                value={draft.goalWeight}
                onChange={(event) =>
                  setDraft((current) => ({
                    ...current,
                    goalWeight: Number(event.target.value),
                  }))
                }
                className="w-full rounded-xl border border-border bg-secondary/40 px-3 py-2.5 text-sm outline-none focus:border-neon"
              />
            </label>
          </div>
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="px-4 py-2 rounded-xl text-sm font-semibold card-elevated hover:border-neon/30 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-neon text-primary-foreground font-semibold px-5 py-2 rounded-xl text-sm glow-neon hover:opacity-90"
            >
              Salvar
            </button>
          </div>
        </form>
      )}

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Peso atual</span>
          </div>
          <div className="text-3xl font-bold text-neon">{formatKg(currentWeight)}</div>
        </div>
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Peso inicial</span>
          </div>
          <div className="text-3xl font-bold">{formatKg(initialWeight)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            {formatNumber(lostWeight)} kg perdidos
          </div>
        </div>
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Meta</span>
          </div>
          <div className="text-3xl font-bold text-accent">{formatKg(goalWeight)}</div>
          <div className="text-xs text-muted-foreground mt-1">
            faltam {formatNumber(remainingWeight)} kg
          </div>
        </div>
      </section>

      <section className="card-elevated rounded-2xl p-6 mb-6">
        <h2 className="font-semibold mb-1">Evolução do peso</h2>
        <p className="text-xs text-muted-foreground mb-6">Últimas 8 semanas</p>
        <div className="relative h-56">
          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="oklch(0.86 0.22 148)" stopOpacity="0.4" />
                <stop offset="100%" stopColor="oklch(0.86 0.22 148)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon points={`0,100 ${points} 100,100`} fill="url(#g)" />
            <polyline points={points} fill="none" stroke="oklch(0.86 0.22 148)" strokeWidth="0.6" vectorEffect="non-scaling-stroke" />
            {weightHistory.map((h, i) => {
              const x = (i / (weightHistory.length - 1)) * 100;
              const y = 100 - ((h.weight - min) / range) * 100;
              return <circle key={i} cx={x} cy={y} r="0.8" fill="oklch(0.86 0.22 148)" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
          {weightHistory.map((h) => <span key={h.week}>{h.week}</span>)}
        </div>
      </section>

      <section className="card-elevated rounded-2xl p-6">
        <h2 className="font-semibold mb-5">Medidas corporais</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {bodyMeasures.map((m) => (
            <div key={m.label} className="bg-secondary/40 rounded-xl p-4 border border-border">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{m.label}</div>
              <div className="text-xl font-bold mt-1">{m.value}</div>
              <div className={`text-xs mt-1 ${m.delta.startsWith("-") ? "text-neon" : m.delta === "0" ? "text-muted-foreground" : "text-accent"}`}>
                {m.delta} cm
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}

function formatKg(value: number) {
  return `${formatNumber(value)} kg`;
}

function buildWeightHistory(initialWeight: number, currentWeight: number) {
  const steps = 8;

  return Array.from({ length: steps }, (_, index) => {
    const progress = index / (steps - 1);
    const weight = initialWeight + (currentWeight - initialWeight) * progress;

    return {
      week: `S${index + 1}`,
      weight,
    };
  });
}
