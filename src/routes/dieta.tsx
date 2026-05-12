import { createFileRoute } from "@tanstack/react-router";
import { Coffee, Sun, Apple, Moon, Cookie } from "lucide-react";

export const Route = createFileRoute("/dieta")({
  component: Dieta,
});

const meals = [
  { id: "cafe", name: "Café da manhã", time: "07:00", icon: Coffee, kcal: 480, protein: 32, items: [
    { food: "Ovos mexidos", qty: "3 unid", obs: "" },
    { food: "Pão integral", qty: "2 fatias", obs: "" },
    { food: "Whey protein", qty: "30g", obs: "com água" },
    { food: "Banana", qty: "1 unid", obs: "" },
  ]},
  { id: "almoco", name: "Almoço", time: "12:30", icon: Sun, kcal: 620, protein: 52, items: [
    { food: "Frango grelhado", qty: "180g", obs: "tempero light" },
    { food: "Arroz integral", qty: "120g", obs: "" },
    { food: "Brócolis", qty: "100g", obs: "vapor" },
    { food: "Azeite", qty: "10ml", obs: "" },
  ]},
  { id: "lanche", name: "Lanche", time: "16:00", icon: Apple, kcal: 280, protein: 22, items: [
    { food: "Iogurte natural", qty: "200g", obs: "" },
    { food: "Granola", qty: "30g", obs: "" },
    { food: "Mel", qty: "1 colher", obs: "opcional" },
  ]},
  { id: "jantar", name: "Jantar", time: "20:00", icon: Moon, kcal: 540, protein: 45, items: [
    { food: "Tilápia", qty: "150g", obs: "no forno" },
    { food: "Batata doce", qty: "150g", obs: "" },
    { food: "Salada verde", qty: "à vontade", obs: "" },
  ]},
  { id: "ceia", name: "Ceia", time: "22:30", icon: Cookie, kcal: 180, protein: 24, items: [
    { food: "Caseína", qty: "30g", obs: "antes de dormir" },
    { food: "Pasta de amendoim", qty: "1 colher", obs: "" },
  ]},
];

function Dieta() {
  const totalKcal = meals.reduce((a, m) => a + m.kcal, 0);
  const totalProtein = meals.reduce((a, m) => a + m.protein, 0);

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold">Dieta</h1>
          <p className="text-muted-foreground mt-2">Suas refeições de hoje.</p>
        </div>
        <div className="flex gap-3">
          <div className="card-elevated rounded-xl px-5 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Calorias</div>
            <div className="text-xl font-bold text-neon">{totalKcal} kcal</div>
          </div>
          <div className="card-elevated rounded-xl px-5 py-3">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Proteínas</div>
            <div className="text-xl font-bold text-accent">{totalProtein} g</div>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-2 gap-4">
        {meals.map((m) => {
          const Icon = m.icon;
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
                  <div className="font-bold text-neon">{m.kcal} kcal</div>
                  <div className="text-muted-foreground">{m.protein}g prot</div>
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
