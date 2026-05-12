import { createFileRoute } from "@tanstack/react-router";
import { Apple, Coffee, Moon, Sun } from "lucide-react";

import { meals } from "@/lib/fitness-data";

export const Route = createFileRoute("/dieta")({
  component: Dieta,
});

const mealIcons = {
  cafe: Coffee,
  almoco: Sun,
  "pre-treino": Apple,
  jantar: Moon,
};

function Dieta() {
  const totalItems = meals.reduce((a, m) => a + m.items.length, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dieta</h1>
          <p className="text-muted-foreground mt-2">Suas refeições de hoje.</p>
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

      <div className="grid lg:grid-cols-2 gap-4">
        {meals.map((m) => {
          const Icon = mealIcons[m.id as keyof typeof mealIcons];
          return (
            <div key={m.id} className="card-elevated rounded-2xl p-6">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-neon/15 text-neon flex items-center justify-center">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="font-semibold">{m.name}</h2>
                    <p className="text-xs text-muted-foreground">{m.time}</p>
                  </div>
                </div>
                <div className="text-right text-xs">
                  <div className="font-bold text-neon">{m.items.length} itens</div>
                  <div className="text-muted-foreground">plano diário</div>
                </div>
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
