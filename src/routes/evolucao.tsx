import { createFileRoute } from "@tanstack/react-router";
import { Scale, Target, TrendingDown } from "lucide-react";

export const Route = createFileRoute("/evolucao")({
  component: Evolucao,
});

const history = [
  { week: "S1", weight: 82.0 },
  { week: "S2", weight: 81.4 },
  { week: "S3", weight: 80.6 },
  { week: "S4", weight: 80.1 },
  { week: "S5", weight: 79.5 },
  { week: "S6", weight: 79.0 },
  { week: "S7", weight: 78.6 },
  { week: "S8", weight: 78.4 },
];

const measures = [
  { label: "Peito", value: "104 cm", delta: "+1" },
  { label: "Cintura", value: "82 cm", delta: "-3" },
  { label: "Quadril", value: "98 cm", delta: "-1" },
  { label: "Braço", value: "37 cm", delta: "+1" },
  { label: "Coxa", value: "58 cm", delta: "0" },
];

function Evolucao() {
  const min = Math.min(...history.map((h) => h.weight)) - 0.5;
  const max = Math.max(...history.map((h) => h.weight)) + 0.5;
  const range = max - min;
  const points = history.map((h, i) => {
    const x = (i / (history.length - 1)) * 100;
    const y = 100 - ((h.weight - min) / range) * 100;
    return `${x},${y}`;
  }).join(" ");

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <h1 className="text-3xl md:text-4xl font-bold">Evolução</h1>
        <p className="text-muted-foreground mt-2">Acompanhe seu progresso ao longo do tempo.</p>
      </header>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Scale className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Peso atual</span>
          </div>
          <div className="text-3xl font-bold text-neon">78,4 kg</div>
        </div>
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <TrendingDown className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Peso inicial</span>
          </div>
          <div className="text-3xl font-bold">82,0 kg</div>
          <div className="text-xs text-muted-foreground mt-1">-3,6 kg em 8 semanas</div>
        </div>
        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-2">
            <Target className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs uppercase tracking-wider text-muted-foreground">Meta</span>
          </div>
          <div className="text-3xl font-bold text-accent">75,0 kg</div>
          <div className="text-xs text-muted-foreground mt-1">faltam 3,4 kg</div>
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
            {history.map((h, i) => {
              const x = (i / (history.length - 1)) * 100;
              const y = 100 - ((h.weight - min) / range) * 100;
              return <circle key={i} cx={x} cy={y} r="0.8" fill="oklch(0.86 0.22 148)" vectorEffect="non-scaling-stroke" />;
            })}
          </svg>
        </div>
        <div className="flex justify-between mt-3 text-[10px] text-muted-foreground">
          {history.map((h) => <span key={h.week}>{h.week}</span>)}
        </div>
      </section>

      <section className="card-elevated rounded-2xl p-6">
        <h2 className="font-semibold mb-5">Medidas corporais</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {measures.map((m) => (
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
