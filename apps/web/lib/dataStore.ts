/**
 * Local data store — tracks all user activity in localStorage
 * Will be replaced with Supabase/PostgreSQL in Phase 2
 */

export interface DayLog {
  date: string; // YYYY-MM-DD
  water: number;
  mood: number; // 1-4
  steps: number;
  calories: number;
  workoutsCompleted: number;
  sleepHours: number;
  sleepQuality: string; // poor/ok/good/excellent
  meals: MealEntry[];
  exercises: string[]; // exercise names done today
  soreness: Record<string, number>;
  aiCost: number; // estimated API cost in $
}

export interface MealEntry {
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  time: string;
  aiScanned: boolean;
}

const STORE_KEY = 'fit-data';

function getStore(): Record<string, DayLog> {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || '{}');
  } catch { return {}; }
}

function saveStore(store: Record<string, DayLog>) {
  localStorage.setItem(STORE_KEY, JSON.stringify(store));
}

function today(): string {
  return new Date().toISOString().split('T')[0];
}

function getDay(date?: string): DayLog {
  const d = date || today();
  const store = getStore();
  return store[d] || {
    date: d, water: 0, mood: 0, steps: 0, calories: 0,
    workoutsCompleted: 0, sleepHours: 0, sleepQuality: '',
    meals: [], exercises: [], soreness: {}, aiCost: 0,
  };
}

function saveDay(log: DayLog) {
  const store = getStore();
  store[log.date] = log;
  saveStore(store);
}

// ============ PUBLIC API ============

export function logWater(glasses: number) {
  const day = getDay();
  day.water = glasses;
  saveDay(day);
}

export function logMood(mood: number) {
  const day = getDay();
  day.mood = mood;
  saveDay(day);
}

export function logSteps(steps: number) {
  const day = getDay();
  day.steps = steps;
  day.calories = Math.round(steps * 0.04);
  saveDay(day);
}

export function logSleep(hours: number, quality: string) {
  const day = getDay();
  day.sleepHours = hours;
  day.sleepQuality = quality;
  saveDay(day);
}

export function logMeal(meal: MealEntry) {
  const day = getDay();
  day.meals.push(meal);
  day.calories = day.meals.reduce((s, m) => s + m.calories, 0);
  saveDay(day);
}

export function logWorkout(exerciseNames: string[]) {
  const day = getDay();
  day.workoutsCompleted += 1;
  day.exercises = [...day.exercises, ...exerciseNames];
  saveDay(day);
  // Auto-calculate soreness from exercises
  autoCalculateSoreness(exerciseNames);
}

export function logSoreness(soreness: Record<string, number>) {
  const day = getDay();
  day.soreness = soreness;
  saveDay(day);
}

export function logAiCost(cost: number) {
  const day = getDay();
  day.aiCost += cost;
  saveDay(day);
}

export function getToday(): DayLog {
  return getDay();
}

export function getWeekData(): DayLog[] {
  const store = getStore();
  const days: DayLog[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    days.push(store[key] || { date: key, water: 0, mood: 0, steps: 0, calories: 0, workoutsCompleted: 0, sleepHours: 0, sleepQuality: '', meals: [], exercises: [], soreness: {}, aiCost: 0 });
  }
  return days;
}

export function getTotalAiCost(): number {
  const store = getStore();
  return Object.values(store).reduce((sum, d) => sum + (d.aiCost || 0), 0);
}

// ============ AUTO SORENESS FROM EXERCISES ============

const exerciseToMuscle: Record<string, string[]> = {
  'bench press': ['chest', 'triceps', 'shoulders'],
  'incline': ['chest', 'shoulders'],
  'cable fly': ['chest'],
  'push-up': ['chest', 'triceps', 'core'],
  'dip': ['chest', 'triceps'],
  'overhead press': ['shoulders', 'triceps'],
  'lateral raise': ['shoulders'],
  'face pull': ['shoulders', 'back'],
  'pull-up': ['back', 'biceps'],
  'barbell row': ['back', 'biceps'],
  'lat pulldown': ['back', 'biceps'],
  'deadlift': ['back', 'hamstrings', 'glutes'],
  'squat': ['quads', 'glutes', 'core'],
  'leg press': ['quads', 'glutes'],
  'lunge': ['quads', 'glutes', 'hamstrings'],
  'leg curl': ['hamstrings'],
  'leg extension': ['quads'],
  'calf raise': ['calves'],
  'barbell curl': ['biceps'],
  'hammer curl': ['biceps', 'forearms'],
  'tricep pushdown': ['triceps'],
  'tricep extension': ['triceps'],
  'plank': ['core'],
  'crunch': ['core'],
  'russian twist': ['core'],
  'burpee': ['quads', 'chest', 'shoulders', 'core'],
  'kettlebell swing': ['hamstrings', 'glutes', 'back', 'shoulders'],
  'box jump': ['quads', 'calves', 'glutes'],
  'mountain climber': ['core', 'shoulders', 'quads'],
  'romanian deadlift': ['hamstrings', 'glutes', 'back'],
  'hip thrust': ['glutes', 'hamstrings'],
  'shrug': ['traps'],
};

function autoCalculateSoreness(exerciseNames: string[]) {
  const muscleHits: Record<string, number> = {};

  for (const name of exerciseNames) {
    const lower = name.toLowerCase();
    for (const [key, muscles] of Object.entries(exerciseToMuscle)) {
      if (lower.includes(key)) {
        for (const m of muscles) {
          muscleHits[m] = (muscleHits[m] || 0) + 1;
        }
      }
    }
  }

  // Convert hits to soreness: 1 hit = 1, 2 hits = 2, 3+ = 3
  const day = getDay();
  const current = day.soreness || {};
  for (const [muscle, hits] of Object.entries(muscleHits)) {
    const newLevel = Math.min(3, hits);
    current[muscle] = Math.max(current[muscle] || 0, newLevel);
  }
  day.soreness = current;
  saveDay(day);
}

// ============ MACRO CALCULATOR ============

export function calculateMacros(profile: {
  weight: string; height: string; age: string; gender: string;
  goal: string; level: string; trainingDays: string;
}): { calories: number; protein: number; carbs: number; fat: number } {
  const w = parseFloat(profile.weight) || 75;
  const h = parseFloat(profile.height) || 175;
  const a = parseFloat(profile.age) || 25;
  const isMale = profile.gender !== 'female';

  // Mifflin-St Jeor BMR
  const bmr = isMale
    ? 10 * w + 6.25 * h - 5 * a + 5
    : 10 * w + 6.25 * h - 5 * a - 161;

  // Activity multiplier
  const days = parseInt(profile.trainingDays) || 3;
  const activityMult = days <= 2 ? 1.375 : days <= 4 ? 1.55 : days <= 5 ? 1.725 : 1.9;
  const tdee = bmr * activityMult;

  // Goal adjustment
  let calories: number;
  switch (profile.goal) {
    case 'lose': calories = tdee - 500; break;
    case 'gain': calories = tdee + 300; break;
    default: calories = tdee;
  }
  calories = Math.round(calories);

  // Macros based on goal
  let proteinPerKg: number, fatPct: number;
  switch (profile.goal) {
    case 'gain': proteinPerKg = 2.2; fatPct = 0.25; break;
    case 'lose': proteinPerKg = 2.4; fatPct = 0.25; break;
    default: proteinPerKg = 1.8; fatPct = 0.3;
  }

  const protein = Math.round(w * proteinPerKg);
  const fat = Math.round((calories * fatPct) / 9);
  const carbs = Math.round((calories - protein * 4 - fat * 9) / 4);

  return { calories, protein: Math.max(protein, 50), carbs: Math.max(carbs, 50), fat: Math.max(fat, 30) };
}
