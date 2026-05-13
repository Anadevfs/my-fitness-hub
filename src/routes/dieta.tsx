import { createFileRoute } from "@tanstack/react-router";
import {
  Apple,
  CalendarDays,
  CheckCircle2,
  Clock,
  Coffee,
  Flame,
  Leaf,
  type LucideIcon,
  Moon,
  Sparkles,
  Sun,
  Target,
  Utensils,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { meals, nutritionSummary } from "@/lib/fitness-data";

export const Route = createFileRoute("/dieta")({
  component: Dieta,
});

const mealIcons = {
  cafe: Coffee,
  almoco: Sun,
  "pre-treino": Apple,
  jantar: Moon,
};

const freeMealHighlights = [
  "1x por semana",
  "Uma refeição, não o dia todo",
  "Preferir dia de treino pesado",
  "Melhor no pós-treino ou à noite",
  "Sem exageros",
];

const freeMealDetails = [
  { label: "Frequência", value: "1 refeição livre por semana", icon: CalendarDays },
  { label: "Melhor momento", value: "Dia de treino pesado, como pernas", icon: Flame },
  { label: "Melhor horário", value: "Pós-treino ou à noite", icon: Clock },
  { label: "Meta do dia", value: "2.200 a 2.500 kcal", icon: Target },
];

function Dieta() {
  const totalItems = meals.reduce((a, m) => a + m.items.length, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dieta</h1>
          <p className="text-muted-foreground mt-2">
            Estratégia alimentar para secar, performar e construir massa.
          </p>
        </div>
        <div className="flex gap-3">
          <div className="card-elevated rounded-xl px-5 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Refeições</div>
            <div className="text-xl font-bold text-neon">{meals.length}</div>
          </div>
          <div className="card-elevated rounded-xl px-5 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Alimentos</div>
            <div className="text-xl font-bold text-accent">{totalItems}</div>
          </div>
        </div>
      </header>

      <section className="card-elevated rounded-2xl p-5 md:p-6 mb-6 overflow-hidden relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-neon/70 to-transparent" />
        <div className="flex flex-col lg:flex-row gap-6 lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center">
                <Target className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h2 className="font-semibold">Card nutricional</h2>
                <p className="text-xs text-muted-foreground">{nutritionSummary.goal}</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              {nutritionSummary.strategy.map((item) => (
                <Badge
                  key={item}
                  variant="outline"
                  className="border-neon/25 bg-neon/10 text-neon"
                >
                  {item}
                </Badge>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full lg:max-w-3xl">
            <NutritionStat icon={Flame} label="Gasto estimado" value={nutritionSummary.estimatedBurn} />
            <NutritionStat icon={Target} label="Meta" value={nutritionSummary.targetRange} />
            <NutritionStat icon={Sparkles} label="Objetivo" value="Recomp." />
            <NutritionStat icon={Utensils} label="Consumo aprox." value={nutritionSummary.mainTarget} />
          </div>
        </div>

        <div className="mt-6">
          <div className="mb-2 flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Consumo aproximado vs gasto estimado</span>
            <span className="font-semibold text-neon">{nutritionSummary.mainTarget}</span>
          </div>
          <Progress value={nutritionSummary.progressPercent} className="h-2.5 bg-muted" />
        </div>
      </section>

      <section className="card-elevated rounded-2xl p-5 md:p-6 mb-6">
        <div className="flex flex-col lg:flex-row gap-6 lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Utensils className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Refeição Livre</h2>
                <p className="text-xs text-muted-foreground">Energia, performance e equilíbrio no déficit.</p>
              </div>
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              Ajuda na recuperação de energia, melhora o psicológico, mantém a performance nos treinos
              e pode evitar queda de rendimento durante o déficit.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Badge variant="outline" className="border-neon/25 bg-neon/10 text-neon">
                Uma refeição, não um dia livre
              </Badge>
              <Badge variant="outline" className="border-accent/25 bg-accent/10 text-accent">
                Atenção à pressão
              </Badge>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3 w-full lg:max-w-xl">
            {freeMealDetails.map((item) => (
              <NutritionStat key={item.label} icon={item.icon} label={item.label} value={item.value} />
            ))}
          </div>
        </div>

        <div className="mt-5 grid lg:grid-cols-[1.1fr_0.9fr] gap-4">
          <div className="rounded-xl border border-border bg-muted/35 p-4">
            <div className="grid sm:grid-cols-2 gap-3">
              {freeMealHighlights.map((item) => (
                <div key={item} className="flex items-start gap-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 text-neon mt-0.5 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-accent/20 bg-accent/10 p-4">
            <div className="flex items-start gap-3">
              <Leaf className="h-4 w-4 text-accent mt-0.5 shrink-0" />
              <div className="space-y-2 text-xs leading-relaxed text-muted-foreground">
                <p>Evitar transformar em dia do lixo, exagerar ao ponto de passar mal ou perder o controle da semana.</p>
                <p>Com histórico de queda de pressão, pode ajudar por aumentar energia disponível, carboidrato e sódio.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="grid lg:grid-cols-2 gap-4">
        {meals.map((m) => {
          const Icon = mealIcons[m.id as keyof typeof mealIcons];

          return (
            <div
              key={m.id}
              className="card-elevated rounded-2xl p-6 transition duration-300 hover:-translate-y-0.5 hover:border-neon/35"
            >
              <div className="flex items-center justify-between mb-5 gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neon/15 text-neon flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{m.name}</h2>
                    <p className="text-xs text-muted-foreground">{m.time}</p>
                  </div>
                </div>
                <div className="text-right text-xs shrink-0">
                  <div className="font-bold text-neon">{m.calories}</div>
                  <div className="text-muted-foreground">estimado</div>
                </div>
              </div>

              <div className="mb-4 flex flex-wrap gap-2">
                {m.badges.map((badge) => (
                  <Badge
                    key={badge}
                    variant="secondary"
                    className="border border-accent/20 bg-accent/10 text-accent"
                  >
                    {badge}
                  </Badge>
                ))}
              </div>

              <ul className="divide-y divide-border">
                {m.items.map((it) => (
                  <li key={it.food} className="py-2.5 flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm">{it.food}</div>
                      {it.obs && <div className="text-[11px] text-muted-foreground italic mt-0.5">{it.obs}</div>}
                    </div>
                    <span className="text-xs text-muted-foreground font-mono shrink-0">{it.qty}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-xl border border-border bg-muted/35 p-4">
                <div className="flex items-start gap-3">
                  <Leaf className="h-4 w-4 text-neon mt-0.5 shrink-0" />
                  <p className="text-xs leading-relaxed text-muted-foreground">{m.note}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type NutritionStatProps = {
  icon: LucideIcon;
  label: string;
  value: string;
};

function NutritionStat({ icon: Icon, label, value }: NutritionStatProps) {
  return (
    <div className="rounded-xl border border-border bg-muted/35 px-4 py-3">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-wider text-muted-foreground">
        <Icon className="h-3.5 w-3.5 text-accent" />
        <span>{label}</span>
      </div>
      <div className="text-lg font-bold">{value}</div>
    </div>
  );
}
