import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Apple,
  Bell,
  CheckCircle2,
  Circle,
  Droplet,
  Dumbbell,
  type LucideIcon,
  Moon,
  Pill,
  Salad,
  Scale,
  TrendingUp,
  Utensils,
} from "lucide-react";

import { BrandLogo } from "@/components/BrandLogo";
import { UserAvatar } from "@/components/UserAvatar";
import { useAuthProfile } from "@/hooks/use-auth-profile";
import { useEvolutionSettings } from "@/hooks/use-evolution-settings";
import { useHabitChecks } from "@/hooks/use-habit-checks";
import { useReminders } from "@/hooks/use-reminders";
import { useWorkoutHistory } from "@/hooks/use-workout-history";
import {
  getExerciseCount,
  getExercises,
  getTodayKey,
  getTodayWorkout,
  habits,
  meals,
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

type ReminderRowProps = {
  description: string;
  detail?: string;
  disabled?: boolean;
  done: boolean;
  icon: LucideIcon;
  onToggle?: () => void;
  status: string;
  title: string;
};

function ReminderRow({
  description,
  detail,
  disabled,
  done,
  icon: Icon,
  onToggle,
  status,
  title,
}: ReminderRowProps) {
  return (
    <div className={`rounded-xl border p-3 transition ${done ? "border-neon/35 bg-neon/10" : "border-border bg-secondary/30"}`}>
      <div className="flex items-start gap-3">
        <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${done ? "bg-neon/15 text-neon" : "bg-accent/15 text-accent"}`}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold">{title}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            </div>
            <span className={`text-[10px] uppercase tracking-wider font-semibold ${done ? "text-neon" : "text-muted-foreground"}`}>
              {status}
            </span>
          </div>
          {detail ? <p className="text-[11px] text-muted-foreground mt-2">{detail}</p> : null}
        </div>
        {onToggle ? (
          <button
            type="button"
            disabled={disabled}
            onClick={onToggle}
            aria-label={`${done ? "Desmarcar" : "Marcar"} ${title}`}
            className={`h-6 w-6 rounded-full border-2 flex items-center justify-center shrink-0 transition ${
              done
                ? "bg-neon border-neon text-primary-foreground"
                : disabled
                  ? "border-border text-muted-foreground opacity-50 cursor-not-allowed"
                  : "border-border text-muted-foreground hover:border-neon/60"
            }`}
          >
            {done ? <CheckCircle2 className="h-4 w-4" /> : null}
          </button>
        ) : null}
      </div>
    </div>
  );
}

function Dashboard() {
  const [checks] = useHabitChecks();
  const [evolutionSettings] = useEvolutionSettings();
  const navigate = useNavigate();
  const { logout, profile } = useAuthProfile();
  const today = new Date();
  const {
    creatineTaken,
    freeMealUsed,
    preWorkoutDone,
    setCreatineTaken,
    setFreeMealUsed,
    setPreWorkoutDone,
  } = useReminders(today);
  const todayWorkout = getTodayWorkout(today);
  const {
    completedExerciseCount,
    history,
    isTodayWorkoutCompleted,
    isTodayWorkoutInProgress,
    startTodayWorkout,
    todayExerciseCount,
  } = useWorkoutHistory(today);
  const todayExercises = todayWorkout ? getExercises(todayWorkout).slice(0, 4) : [];
  const nextMeal = getNextMeal(today);
  const waterHabit = habits.find((habit) => habit.id === "agua");
  const cardioHabit = habits.find((habit) => habit.id === "cardio");
  const supplementHabit = habits.find((habit) => habit.id === "supl");
  const waterTotal = waterHabit?.items.length ?? 5;
  const waterCompleted = waterHabit?.items.filter((item) => checks[`agua-${item}`]).length ?? 0;
  const waterRemaining = Math.max(0, waterTotal - waterCompleted);
  const waterMl = waterCompleted * 600;
  const todayCardioItem = todayWorkout?.cardio
    ? cardioHabit?.items.find((item) => item.startsWith(todayWorkout.day))
    : undefined;
  const cardioDone = todayCardioItem ? Boolean(checks[`cardio-${todayCardioItem}`]) : false;
  const supplementTotal = supplementHabit?.items.length ?? 0;
  const supplementCompleted =
    supplementHabit?.items.filter((item) => checks[`supl-${item}`]).length ?? 0;
  const totalMealItems = meals.reduce((total, meal) => total + meal.items.length, 0);
  const preWorkoutMeal = meals.find((meal) => meal.id === "pre-treino");
  const currentWeight = evolutionSettings.currentWeight;
  const lostWeight = Math.max(0, evolutionSettings.initialWeight - currentWeight);
  const remainingWeight = Math.max(0, currentWeight - evolutionSettings.goalWeight);
  const weeklyWorkoutProgress = getWeeklyWorkoutProgress(today, history);
  const isHeavyTrainingDay = Boolean(
    todayWorkout &&
      ["Quadríceps", "Posterior", "Glúteo"].some((focus) => todayWorkout.focus.includes(focus)),
  );
  const waterMessage =
    waterRemaining > 0
      ? `Faltam ${waterRemaining} garrafas para bater 3L`
      : "Meta de água concluída";
  const preWorkoutMessage = todayWorkout
    ? `Pré-treino programado para hoje${preWorkoutMeal?.calories ? ` • ${preWorkoutMeal.calories}` : ""}`
    : "Hoje é dia de descanso";
  const freeMealMessage = freeMealUsed
    ? "Refeição livre usada nesta semana"
    : isHeavyTrainingDay
      ? "Refeição livre disponível esta semana • bom dia para usar"
      : "Refeição livre disponível esta semana";
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

  function handleStartWorkout() {
    if (!todayWorkout) return;

    startTodayWorkout();
    navigate({ to: "/treinos" });
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
        <Stat
          icon={isTodayWorkoutCompleted ? CheckCircle2 : Dumbbell}
          label="Treino"
          value={isTodayWorkoutCompleted ? "Concluído" : todayWorkout?.day ?? "Descanso"}
          sub={
            todayWorkout
              ? isTodayWorkoutCompleted
                ? `${completedExerciseCount}/${todayExerciseCount} exercícios finalizados`
                : todayWorkout.focus
              : "sem treino obrigatório"
          }
          accent={isTodayWorkoutCompleted ? "bg-neon text-primary-foreground" : "bg-neon/15 text-neon"}
        />
        <Stat icon={Droplet} label="Água" value={`${waterMl} ml`} sub={`${waterCompleted}/${waterTotal} garrafas · meta 3000ml`} accent="bg-accent/15 text-accent" />
        <Stat
          icon={Scale}
          label="Peso atual"
          value={formatKgCompact(currentWeight)}
          sub={`${formatKgAmount(lostWeight)} perdidos • faltam ${formatKgAmount(remainingWeight)}`}
          accent="bg-neon/15 text-neon"
        />
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
                  {todayWorkout
                    ? isTodayWorkoutCompleted
                      ? "Treino de hoje concluído"
                      : `${todayWorkout.focus}${todayWorkout.cardio ? ` · Cardio ${todayWorkout.cardio}` : ""}`
                    : "Hoje é dia de descanso."}
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
              <li className="py-3 text-sm text-muted-foreground">Hoje é dia de descanso.</li>
            )}
          </ul>
          <button
            type="button"
            onClick={handleStartWorkout}
            disabled={!todayWorkout || isTodayWorkoutCompleted}
            className={`mt-5 w-full font-semibold py-3 rounded-xl transition ${
              isTodayWorkoutCompleted
                ? "bg-neon/20 text-neon border border-neon/30 cursor-default"
                : todayWorkout
                  ? "bg-neon text-primary-foreground glow-neon hover:opacity-90"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {isTodayWorkoutCompleted
              ? "Treino concluído"
              : isTodayWorkoutInProgress
                ? "Continuar treino"
                : todayWorkout
                  ? "Iniciar treino"
                  : "Hoje é dia de descanso"}
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

        <div className="card-elevated rounded-2xl p-6">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-xl bg-accent/15 text-accent flex items-center justify-center">
                <Bell className="h-5 w-5" />
              </div>
              <div>
                <h2 className="font-semibold">Lembretes</h2>
                <p className="text-xs text-muted-foreground">Checklist rápido do dia.</p>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <ReminderRow
              icon={Droplet}
              title="Água"
              description={`${waterCompleted}/${waterTotal} garrafas`}
              status={waterRemaining > 0 ? "Pendente" : "Concluído"}
              done={waterRemaining === 0}
              detail={waterMessage}
            />
            <ReminderRow
              icon={Pill}
              title="Creatina"
              description="Creatina tomada?"
              status={creatineTaken ? "Concluído" : "Pendente"}
              done={creatineTaken}
              onToggle={() => setCreatineTaken(!creatineTaken)}
            />
            <ReminderRow
              icon={Apple}
              title="Pré-treino"
              description={preWorkoutMessage}
              status={!todayWorkout ? "Descanso" : preWorkoutDone ? "Concluído" : "Pendente"}
              done={!todayWorkout || preWorkoutDone}
              disabled={!todayWorkout}
              onToggle={() => setPreWorkoutDone(!preWorkoutDone)}
            />
            <ReminderRow
              icon={Utensils}
              title="Refeição livre"
              description={freeMealMessage}
              status={freeMealUsed ? "Usada" : "Disponível"}
              done={freeMealUsed}
              onToggle={() => setFreeMealUsed(!freeMealUsed)}
            />
          </div>
        </div>

        <div className="card-elevated rounded-2xl p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-neon" />
              <h2 className="font-semibold">Progresso semanal</h2>
            </div>
            <span className="text-xs text-muted-foreground">treinos da semana</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
            {weeklyWorkoutProgress.map((day) => (
              <div
                key={day.label}
                className={`rounded-xl border p-3 min-h-28 flex flex-col justify-between transition ${
                  day.status === "completed"
                    ? "border-neon/40 bg-neon/10"
                    : day.status === "rest"
                      ? "border-accent/20 bg-accent/10"
                      : "border-border bg-secondary/30"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-bold">{day.short}</span>
                  <StatusIcon status={day.status} />
                </div>
                <div>
                  <div className="text-lg font-bold">
                    {day.exerciseCount > 0 ? day.exerciseCount : "-"}
                  </div>
                  <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                    {day.exerciseCount > 0 ? "exercícios" : "descanso"}
                  </div>
                </div>
                <div
                  className={`text-[11px] font-semibold ${
                    day.status === "completed"
                      ? "text-neon"
                      : day.status === "rest"
                        ? "text-accent"
                        : "text-muted-foreground"
                  }`}
                >
                  {day.statusLabel}
                </div>
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

type WeeklyWorkoutStatus = "completed" | "pending" | "rest";

type WorkoutHistoryMap = ReturnType<typeof useWorkoutHistory>["history"];

function getWeeklyWorkoutProgress(date: Date, history: WorkoutHistoryMap) {
  const weekStart = getWeekStartMonday(date);
  const trainingDays = workoutWeek.map((day, index) => {
    const dayDate = addDays(weekStart, index);
    const dateKey = getTodayKey(dayDate);
    const status: WeeklyWorkoutStatus =
      history[dateKey]?.status === "completed" ? "completed" : "pending";

    return {
      label: day.day,
      short: day.day.slice(0, 3),
      exerciseCount: getExerciseCount(day),
      status,
      statusLabel: status === "completed" ? "Concluído" : "Pendente",
    };
  });

  return [
    ...trainingDays,
    {
      label: "Domingo",
      short: "Dom",
      exerciseCount: 0,
      status: "rest" as const,
      statusLabel: "Descanso",
    },
  ];
}

function getWeekStartMonday(date: Date) {
  const start = new Date(date);
  const weekday = start.getDay();
  const diff = weekday === 0 ? -6 : 1 - weekday;
  start.setDate(start.getDate() + diff);
  start.setHours(0, 0, 0, 0);

  return start;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);

  return next;
}

function StatusIcon({ status }: { status: WeeklyWorkoutStatus }) {
  if (status === "completed") return <CheckCircle2 className="h-4 w-4 text-neon" />;
  if (status === "rest") return <Moon className="h-4 w-4 text-accent" />;

  return <Circle className="h-4 w-4 text-muted-foreground" />;
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

function formatKgCompact(value: number) {
  return `${formatCompactNumber(value)} kg`;
}

function formatKgAmount(value: number) {
  return `${formatCompactNumber(value)} kg`;
}

function formatCompactNumber(value: number) {
  return value.toLocaleString("pt-BR", {
    maximumFractionDigits: 1,
  });
}
