import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Droplet, Dumbbell, Moon, Pill, Salad, Scale, TrendingUp } from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuthProfile } from "@/hooks/use-auth-profile";
import { useHabitChecks } from "@/hooks/use-habit-checks";
import {
  getExerciseCount,
  getExercises,
  getTodayWorkout,
  getWeekdayName,
  habits,
  meals,
  weightHistory,
  workoutWeek,
} from "@/lib/fitness-data";

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
  const [checks] = useHabitChecks();
  const navigate = useNavigate();
  const { logout, profile } = useAuthProfile();
  const today = new Date();
  const todayWorkout = getTodayWorkout(today);
  const todayExercises = todayWorkout ? getExercises(todayWorkout).slice(0, 4) : [];
  const nextMeal = getNextMeal(today);
  const waterHabit = habits.find((habit) => habit.id === "agua");
  const cardioHabit = habits.find((habit) => habit.id === "cardio");
  const supplementHabit = habits.find((habit) => habit.id === "supl");
  const waterTotal = waterHabit?.items.length ?? 5;
  const waterCompleted = waterHabit?.items.filter((item) => checks[`agua-${item}`]).length ?? 0;
  const waterMl = waterCompleted * 600;
  const todayCardioItem = todayWorkout?.cardio
    ? cardioHabit?.items.find((item) => item.startsWith(todayWorkout.day))
    : undefined;
  const cardioDone = todayCardioItem ? Boolean(checks[`cardio-${todayCardioItem}`]) : false;
  const supplementTotal = supplementHabit?.items.length ?? 0;
  const supplementCompleted =
    supplementHabit?.items.filter((item) => checks[`supl-${item}`]).length ?? 0;
  const totalMealItems = meals.reduce((total, meal) => total + meal.items.length, 0);
  const currentWeight = weightHistory.at(-1)?.weight ?? 0;
  const firstMonthWeight = weightHistory.at(-5)?.weight ?? weightHistory[0]?.weight ?? currentWeight;
  const monthlyDelta = currentWeight - firstMonthWeight;
  const maxWorkoutExercises = Math.max(...workoutWeek.map(getExerciseCount));

  const weekProgress = workoutWeek.map((day) => (getExerciseCount(day) / maxWorkoutExercises) * 100);
  const habitRows = [
    [`Água ${waterCompleted}/${waterTotal} garrafas`, waterCompleted === waterTotal],
    [
      todayCardioItem ? `Cardio ${todayWorkout?.cardio}` : "Cardio descanso",
      todayCardioItem ? cardioDone : true,
    ],
    [`Suplementos ${supplementCompleted}/${supplementTotal}`, supplementCompleted === supplementTotal],
  ] as const;

  function handleLogout() {
    logout();
    navigate({ to: "/login" });
  }

  return (
    <div className="p-6 md:p-10 max-w-7xl mx-auto">
      <header className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          <BrandLogo size="md" className="hidden sm:block" />
          <div>
            <p className="text-sm text-muted-foreground">{formatToday(today)}</p>
            <h1 className="text-3xl md:text-4xl font-bold mt-1">
              Bem-vinda de volta, <span className="text-neon">{profile.name}</span>.
            </h1>
            <p className="text-muted-foreground mt-2">Aqui está o resumo do seu dia.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <UserAvatar />
          <button
            type="button"
            onClick={handleLogout}
            className="card-elevated rounded-xl px-4 py-2 text-sm font-semibold text-muted-foreground hover:text-neon hover:border-neon/40 transition"
          >
            Sair
          </button>
        </div>
      </header>

      <section className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Stat icon={Dumbbell} label="Treino" value={todayWorkout?.day ?? "Descanso"} sub={todayWorkout?.focus ?? "sem treino obrigatório"} accent="bg-neon/15 text-neon" />
        <Stat icon={Droplet} label="Água" value={`${waterMl} ml`} sub={`${waterCompleted}/${waterTotal} garrafas · meta 3000ml`} accent="bg-accent/15 text-accent" />
        <Stat icon={Scale} label="Peso atual" value={formatKg(currentWeight)} sub={`${formatSignedKg(monthlyDelta)} no mês`} accent="bg-neon/15 text-neon" />
        <Stat icon={Pill} label="Suplementos" value={`${supplementCompleted}/${supplementTotal}`} sub="Whey e Creatina" accent="bg-accent/15 text-accent" />
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
                <p className="text-xs text-muted-foreground">
                  {todayWorkout ? `${todayWorkout.focus}${todayWorkout.cardio ? ` · Cardio ${todayWorkout.cardio}` : ""}` : "Descanso"}
                </p>
              </div>
            </div>
            <Link to="/treinos" className="text-xs text-neon hover:underline">Ver tudo</Link>
          </div>
          <ul className="divide-y divide-border">
            {todayExercises.map((e) => (
              <li key={e.name} className="flex items-center justify-between py-3">
                <span className="text-sm">{e.name}</span>
                <span className="text-xs text-muted-foreground font-mono">{e.prescription}</span>
              </li>
            ))}
            {!todayWorkout && (
              <li className="py-3 text-sm text-muted-foreground">Sem treino cadastrado para {getWeekdayName(today)}.</li>
            )}
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
              <h2 className="font-semibold">{nextMeal.name}</h2>
              <p className="text-xs text-muted-foreground">{nextMeal.time}</p>
            </div>
          </div>
          <ul className="space-y-2 text-sm">
            {nextMeal.items.map((item) => (
              <li key={item.food} className="flex justify-between">
                <span>{item.food}</span>
                <span className="text-muted-foreground">{item.qty}</span>
              </li>
            ))}
          </ul>
          <div className="mt-5 pt-4 border-t border-border flex justify-between text-xs">
            <span className="text-muted-foreground">{meals.length} refeições no dia</span>
            <span className="text-neon font-medium">{totalMealItems} alimentos</span>
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-neon" />
              <h2 className="font-semibold">Progresso semanal</h2>
            </div>
            <span className="text-xs text-muted-foreground">exercícios por treino</span>
          </div>
          <div className="flex items-end gap-3 h-40">
            {weekProgress.map((v, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full rounded-t-lg gradient-primary" style={{ height: `${v}%` }} />
                <span className="text-[10px] text-muted-foreground">{workoutWeek[i].day.slice(0, 1)}</span>
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
            {habitRows.map(([label, done]) => (
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

function getNextMeal(date: Date) {
  const hour = date.getHours();

  if (hour < 11) return meals[0];
  if (hour < 15) return meals[1];
  if (hour < 19) return meals[2];
  return meals[3];
}

function formatToday(date: Date) {
  return new Intl.DateTimeFormat("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatKg(value: number) {
  return `${formatNumber(value)} kg`;
}

function formatSignedKg(value: number) {
  return `${value > 0 ? "+" : ""}${formatNumber(value)} kg`;
}

function formatNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
}
