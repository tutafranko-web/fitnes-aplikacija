/**
 * Exercise Database — unified interface
 * Sources: free-exercise-db (873 exercises, MIT license)
 */

export type MuscleGroup = 'chest' | 'back' | 'shoulders' | 'biceps' | 'triceps' | 'forearms' | 'quads' | 'hamstrings' | 'glutes' | 'calves' | 'core' | 'traps' | 'full_body';
export type Equipment = 'barbell' | 'dumbbell' | 'cable' | 'machine' | 'bodyweight' | 'kettlebell' | 'band' | 'trx' | 'pullup_bar' | 'bench' | 'none';
export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ExerciseInfo {
  id: string;
  name: string;
  nameHr: string;
  primary: string[];
  secondary: string[];
  equipment: string[];
  difficulty: string;
  category: string;
  defaultSets: number;
  defaultReps: string;
  defaultRest: number;
  injuryCaution?: string[];
  injuryAvoid?: string[];
  instructions: { hr: string; en: string };
  tips: { hr: string; en: string };
  images?: string[];
}

// Cache
let _cache: ExerciseInfo[] | null = null;

export function getAllExercises(): ExerciseInfo[] {
  if (_cache) return _cache;
  try {
    const { freeExercises } = require('./freeExerciseDB');
    _cache = freeExercises;
  } catch {
    _cache = [];
  }
  return _cache!;
}

export function filterExercises(opts: {
  muscles?: MuscleGroup[];
  equipment?: Equipment[];
  difficulty?: Difficulty[];
  category?: string[];
  avoidInjuries?: string[];
  search?: string;
}): ExerciseInfo[] {
  let result = [...getAllExercises()];

  if (opts.muscles && opts.muscles.length > 0) {
    result = result.filter((e) => e.primary.some((m) => (opts.muscles as string[]).includes(m)));
  }
  if (opts.equipment && opts.equipment.length > 0) {
    result = result.filter((e) => e.equipment.some((eq) => (opts.equipment as string[]).includes(eq)));
  }
  if (opts.difficulty && opts.difficulty.length > 0) {
    result = result.filter((e) => (opts.difficulty as string[]).includes(e.difficulty));
  }
  if (opts.category && opts.category.length > 0) {
    result = result.filter((e) => (opts.category as string[]).includes(e.category));
  }
  if (opts.avoidInjuries && opts.avoidInjuries.length > 0) {
    result = result.filter((e) => !e.injuryAvoid?.some((inj) => opts.avoidInjuries!.includes(inj)));
  }
  if (opts.search) {
    const s = opts.search.toLowerCase();
    result = result.filter((e) => e.name.toLowerCase().includes(s) || e.nameHr.toLowerCase().includes(s));
  }

  return result;
}

export function getExerciseById(id: string): ExerciseInfo | undefined {
  return getAllExercises().find((e) => e.id === id);
}

export const muscleGroupLabels: Record<string, { hr: string; en: string }> = {
  chest: { hr: 'Prsa', en: 'Chest' },
  back: { hr: 'Leđa', en: 'Back' },
  shoulders: { hr: 'Ramena', en: 'Shoulders' },
  biceps: { hr: 'Biceps', en: 'Biceps' },
  triceps: { hr: 'Triceps', en: 'Triceps' },
  forearms: { hr: 'Podlaktice', en: 'Forearms' },
  quads: { hr: 'Quadriceps', en: 'Quads' },
  hamstrings: { hr: 'Hamstrings', en: 'Hamstrings' },
  glutes: { hr: 'Gluteus', en: 'Glutes' },
  calves: { hr: 'Listovi', en: 'Calves' },
  core: { hr: 'Core/Trbuh', en: 'Core/Abs' },
  traps: { hr: 'Trapez', en: 'Traps' },
  full_body: { hr: 'Cijelo tijelo', en: 'Full Body' },
};

export const equipmentLabels: Record<string, { hr: string; en: string; emoji: string }> = {
  barbell: { hr: 'Šipka', en: 'Barbell', emoji: '🏋️' },
  dumbbell: { hr: 'Bučice', en: 'Dumbbells', emoji: '🔩' },
  cable: { hr: 'Kabel', en: 'Cable', emoji: '🔗' },
  machine: { hr: 'Sprava', en: 'Machine', emoji: '🏗️' },
  bodyweight: { hr: 'Samo tijelo', en: 'Bodyweight', emoji: '🤸' },
  kettlebell: { hr: 'Kettlebell', en: 'Kettlebell', emoji: '🔔' },
  band: { hr: 'Elastika', en: 'Band', emoji: '🟡' },
  trx: { hr: 'TRX', en: 'TRX', emoji: '🪢' },
  pullup_bar: { hr: 'Šipka za zgibove', en: 'Pull-up Bar', emoji: '🔧' },
  bench: { hr: 'Klupa', en: 'Bench', emoji: '🪑' },
  none: { hr: 'Ništa', en: 'None', emoji: '👐' },
};
