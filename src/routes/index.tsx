import { createFileRoute, Link } from "@tanstack/react-router";
import { Dumbbell, Salad, Droplet, Scale, Flame, TrendingUp, Activity, Moon } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Dashboard,
});

function Stat({ icon: Icon, label, value, sub, accent }: any) {
  return (
    <div className="card-elevated rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wider text-muted-foreground">{label}</span>
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${accent}`}>
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {sub && <div className="text-xs text-muted-foreground mt-1">{sub}</div>}
    </div>
  );
}

function Dashboard() {
  const exercises = [
    { name: "Agachamento livre", sets: "4 x 10" },
    { name: "Leg press 45°", sets: "4 x 12" },
    { name: "Cadeira extensora", sets: "3 x 15" },
    { name: "Stiff", sets: "3 x 12" },
  ];

  const weekProgress = [60, 80, 45, 90, 70, 100, 30];

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8">
        <p className="text-sm text-muted-foreground">Terça, 12 de maio</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-1">
          Bem-vindo de volta, <span className="text-neon">atleta</span>.
        </h1>
        <p className="text-muted-foreground mt-2">Aqui está o resumo do seu dia.</p>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Flame} label="Calorias" value="1.840 kcal" sub="meta 2.200" accent="bg-neon/15 text-neon" />
        <Stat icon={Droplet} label="Água" value="1,8 L" sub="de 3 L" accent="bg-accent/15 text-accent" />
        <Stat icon={Scale} label="Peso atual" value="78,4 kg" sub="-1,6 kg no mês" accent="bg-neon/15 text-neon" />
        <Stat icon={Activity} label="Passos" value="6.420" sub="meta 10k" accent="bg-accent/15 text-accent" />
      </section>

      <section className="grid lg:grid-cols-3 gap-4">
        <div className="card-elevated rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Dumbbell className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Treino de hoje</h2>
                <p className="text-xs text-muted-foreground">Pernas · 60 min</p>
              </div>
            </div>
            <Link to="/treinos" className="text-xs text-neon hover:underline">Ver tudo</Link>
          </div>
          <ul className="divide-y divide-border">
            {exercises.map((e) => (
              <li key={e.name} className="flex items-center justify-between py-3">
                <span className="text-sm">{e.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{e.sets}</span>
              </li>
            ))}
          </ul>
          <button className="mt-5 w-full bg-neon text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition glow-neon">
            Iniciar treino
          </button>
        </div>

        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="h-10 w-10 rounded-xl gradient-violet flex items-center justify-center">
              <Salad className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold">Próxima refeição</h2>
              <p className="text-xs text-muted-foreground">Almoço · 12:30</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            <li className="flex justify-between"><span>Frango grelhado</span><span className="text-muted-foreground">180g</span></li>
            <li className="flex justify-between"><span>Arroz integral</span><span className="text-muted-foreground">120g</span></li>
            <li className="flex justify-between"><span>Brócolis</span><span className="text-muted-foreground">100g</span></li>
            <li className="flex justify-between"><span>Azeite</span><span className="text-muted-foreground">10ml</span></li>
          </ul>
          <div className="mt-5 pt-4 border-t border-border flex justify-between text-xs">
            <span className="text-muted-foreground">620 kcal</span>
            <span className="text-neon font-medium">52g proteína</span>
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-neon" />
              <h2 className="font-semibold">Progresso semanal</h2>
            </div>
            <span className="text-xs text-muted-foreground">treinos concluídos</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekProgress.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg gradient-primary" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-muted-foreground">{["S","T","Q","Q","S","S","D"][i]}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <Moon className="h-5 w-5 text-accent" />
            <h2 className="font-semibold">Hábitos hoje</h2>
          </div>
          <ul className="space-y-3 text-sm">
            {[
              ["Água 3L", false],
              ["Cardio 20min", true],
              ["Sono 8h", true],
              ["Suplementos", false],
            ].map(([label, done]) => (
              <li key={label as string} className="flex items-center justify-between">
                <span className={done ? "line-through text-muted-foreground" : ""}>{label}</span>
                <span className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${done ? "bg-neon border-neon" : "border-border"}`}>
                  {done && <span className="text-[10px] text-primary-foreground font-bold">✓</span>}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}
