export type Exercise = {
  name: string;
  prescription: string;
};

export type WorkoutCategory = {
  name: string;
  exercises: Exercise[];
};

export type WorkoutDay = {
  day: string;
  focus: string;
  cardio?: string;
  categories: WorkoutCategory[];
};

export type Meal = {
  id: string;
  name: string;
  time: string;
  items: {
    food: string;
    qty: string;
    obs: string;
  }[];
};

export type Habit = {
  id: string;
  label: string;
  goal: string;
  description: string;
  items: string[];
};

export type WeightEntry = {
  week: string;
  weight: number;
};

export type BodyMeasure = {
  label: string;
  value: string;
  delta: string;
};

export const workoutWeek: WorkoutDay[] = [
  {
    day: "Segunda",
    focus: "Peito / Ombro / Tríceps",
    cardio: "30min",
    categories: [
      {
        name: "Peito",
        exercises: [
          { name: "Supino reto máquina ou halter", prescription: "4x6-8" },
          { name: "Supino inclinado halter", prescription: "3x8-10" },
          { name: "Crucifixo máquina/crossover", prescription: "2x12-15" },
        ],
      },
      {
        name: "Ombro",
        exercises: [
          { name: "Desenvolvimento halter", prescription: "3x8-10" },
          { name: "Elevação lateral", prescription: "3x12-15" },
        ],
      },
      {
        name: "Tríceps",
        exercises: [
          { name: "Tríceps corda", prescription: "3x10-12" },
          { name: "Tríceps francês unilateral", prescription: "2x12" },
        ],
      },
    ],
  },
  {
    day: "Terça",
    focus: "Quadríceps / Posterior",
    categories: [
      {
        name: "Quadríceps",
        exercises: [
          { name: "Agachamento livre", prescription: "4x6-8" },
          { name: "Leg press", prescription: "3x10" },
          { name: "Cadeira extensora", prescription: "3x12-15" },
          { name: "Afundo búlgaro", prescription: "2x10 cada perna" },
        ],
      },
      {
        name: "Posterior",
        exercises: [
          { name: "Stiff", prescription: "4x8-10" },
          { name: "Mesa flexora", prescription: "3x10-12" },
          { name: "Cadeira flexora unilateral", prescription: "3x12" },
        ],
      },
      {
        name: "Panturrilha",
        exercises: [{ name: "Panturrilha em pé", prescription: "4x12-15" }],
      },
    ],
  },
  {
    day: "Quarta",
    focus: "Costas / Bíceps / Trapézio",
    categories: [
      {
        name: "Costas",
        exercises: [
          { name: "Puxada alta aberta", prescription: "4x8-10" },
          { name: "Remada curvada", prescription: "4x8-10" },
          { name: "Remada baixa triângulo", prescription: "3x10-12" },
          { name: "Pulldown", prescription: "2x12-15" },
        ],
      },
      {
        name: "Bíceps",
        exercises: [
          { name: "Rosca inclinada", prescription: "4x10-12" },
          { name: "Rosca direta W", prescription: "4x8-10" },
          { name: "Rosca martelo", prescription: "3x10-12" },
          { name: "Rosca unilateral polia", prescription: "3x12-15" },
        ],
      },
      {
        name: "Trapézio",
        exercises: [{ name: "Encolhimento halter", prescription: "4x12" }],
      },
    ],
  },
  {
    day: "Quinta",
    focus: "Peito / Ombro / Tríceps",
    cardio: "30min",
    categories: [
      {
        name: "Peito",
        exercises: [
          { name: "Supino inclinado máquina", prescription: "4x8-10" },
          { name: "Supino reto halter", prescription: "3x8-10" },
          { name: "Crossover polia alta", prescription: "2x12-15" },
        ],
      },
      {
        name: "Ombro",
        exercises: [
          { name: "Elevação lateral", prescription: "4x12-15" },
          { name: "Desenvolvimento máquina", prescription: "3x8-10" },
          { name: "Crucifixo inverso", prescription: "3x12-15" },
        ],
      },
      {
        name: "Tríceps",
        exercises: [
          { name: "Tríceps testa", prescription: "3x10-12" },
          { name: "Tríceps corda", prescription: "3x12" },
        ],
      },
    ],
  },
  {
    day: "Sexta",
    focus: "Quadríceps / Posterior / Glúteo",
    categories: [
      {
        name: "Posterior",
        exercises: [
          { name: "Stiff", prescription: "4x8-10" },
          { name: "Mesa flexora", prescription: "3x10-12" },
        ],
      },
      {
        name: "Quadríceps",
        exercises: [
          { name: "Leg press pés baixos", prescription: "3x10" },
          { name: "Cadeira extensora", prescription: "3x12-15" },
        ],
      },
      {
        name: "Glúteo",
        exercises: [
          { name: "Elevação pélvica", prescription: "4x8-10" },
          { name: "Abdutora", prescription: "3x15" },
          { name: "Coice polia", prescription: "3x12 cada perna" },
        ],
      },
      {
        name: "Panturrilha",
        exercises: [{ name: "Panturrilha sentado", prescription: "4x15" }],
      },
    ],
  },
  {
    day: "Sábado",
    focus: "Costas / Bíceps / Trapézio",
    cardio: "30min",
    categories: [
      {
        name: "Costas",
        exercises: [
          { name: "Barra assistida ou puxada neutra", prescription: "4x8-10" },
          { name: "Remada cavalinho", prescription: "4x8-10" },
          { name: "Remada unilateral halter", prescription: "3x10" },
          { name: "Pullover polia", prescription: "2x12-15" },
        ],
      },
      {
        name: "Bíceps",
        exercises: [
          { name: "Rosca direta W", prescription: "4x8-10" },
          { name: "Rosca martelo corda", prescription: "3x10-12" },
          { name: "Rosca concentrada", prescription: "3x12" },
        ],
      },
      {
        name: "Trapézio",
        exercises: [
          { name: "Encolhimento barra", prescription: "4x12" },
          { name: "Face pull", prescription: "3x15" },
        ],
      },
    ],
  },
];

export const meals: Meal[] = [
  {
    id: "cafe",
    name: "Café da manhã",
    time: "Manhã",
    items: [
      { food: "Pão sem miolo", qty: "1 unid", obs: "" },
      { food: "Ovos mexidos", qty: "2 ovos", obs: "" },
    ],
  },
  {
    id: "almoco",
    name: "Almoço",
    time: "Meio do dia",
    items: [
      { food: "Arroz", qty: "100g", obs: "" },
      { food: "Proteína", qty: "150g", obs: "" },
      { food: "Legumes", qty: "130g", obs: "" },
    ],
  },
  {
    id: "pre-treino",
    name: "Pré-treino",
    time: "Antes do treino",
    items: [
      { food: "Panqueca de banana", qty: "1 unid", obs: "" },
      { food: "Fruta", qty: "100g", obs: "" },
    ],
  },
  {
    id: "jantar",
    name: "Jantar",
    time: "Noite",
    items: [
      { food: "Cuscuz", qty: "100g", obs: "" },
      { food: "Proteína", qty: "150g", obs: "" },
    ],
  },
];

export const habits: Habit[] = [
  {
    id: "agua",
    label: "Água",
    goal: "3 L",
    description: "5 garrafas de 600ml",
    items: ["Garrafa 1", "Garrafa 2", "Garrafa 3", "Garrafa 4", "Garrafa 5"],
  },
  {
    id: "cardio",
    label: "Cardio",
    goal: "30 min",
    description: "Dias obrigatórios da semana",
    items: ["Segunda - 30min", "Quinta - 30min", "Sábado - 30min"],
  },
  {
    id: "supl",
    label: "Suplementação",
    goal: "Diária",
    description: "Checklist de suplementos",
    items: ["Whey", "Creatina"],
  },
];

export const weightHistory: WeightEntry[] = [
  { week: "S1", weight: 82.0 },
  { week: "S2", weight: 81.4 },
  { week: "S3", weight: 80.6 },
  { week: "S4", weight: 80.1 },
  { week: "S5", weight: 79.5 },
  { week: "S6", weight: 79.0 },
  { week: "S7", weight: 78.6 },
  { week: "S8", weight: 78.4 },
];

export const bodyMeasures: BodyMeasure[] = [
  { label: "Peito", value: "104 cm", delta: "+1" },
  { label: "Cintura", value: "82 cm", delta: "-3" },
  { label: "Quadril", value: "98 cm", delta: "-1" },
  { label: "Braço", value: "37 cm", delta: "+1" },
  { label: "Coxa", value: "58 cm", delta: "0" },
];

export const targetWeight = 75.0;

export function getExerciseCount(day: WorkoutDay) {
  return day.categories.reduce((total, category) => total + category.exercises.length, 0);
}

export function getExercises(day: WorkoutDay) {
  return day.categories.flatMap((category) => category.exercises);
}

export function getTodayKey(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

export function getWeekdayName(date = new Date()) {
  const days = ["Domingo", "Segunda", "Terça", "Quarta", "Quinta", "Sexta", "Sábado"];

  return days[date.getDay()];
}

export function getTodayWorkout(date = new Date()) {
  const weekday = getWeekdayName(date);

  return workoutWeek.find((day) => day.day === weekday);
}
