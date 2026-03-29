'use client';

import { create } from 'zustand';

export interface Achievement {
  id: string;
  icon: string;
  nameHr: string;
  nameEn: string;
  descHr: string;
  descEn: string;
  xpReward: number;
  coinReward: number;
  check: (stats: UserStats) => boolean;
}

export interface UserStats {
  totalWorkouts: number;
  streak: number;
  musclesUnlocked: number;
  totalMuscleHeads: number;
  totalCoins: number;
  totalExercisesDone: number;
  journalEntries: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  // Workout milestones
  { id: 'first_workout', icon: '🏋️', nameHr: 'Prvi korak', nameEn: 'First Step', descHr: 'Završi prvi trening', descEn: 'Complete your first workout', xpReward: 20, coinReward: 20, check: s => s.totalWorkouts >= 1 },
  { id: 'workout_10', icon: '🔥', nameHr: 'Na vatri', nameEn: 'On Fire', descHr: 'Završi 10 treninga', descEn: 'Complete 10 workouts', xpReward: 50, coinReward: 50, check: s => s.totalWorkouts >= 10 },
  { id: 'workout_50', icon: '💎', nameHr: 'Dijamant', nameEn: 'Diamond', descHr: 'Završi 50 treninga', descEn: 'Complete 50 workouts', xpReward: 100, coinReward: 100, check: s => s.totalWorkouts >= 50 },
  { id: 'workout_100', icon: '👑', nameHr: 'Centurion', nameEn: 'Centurion', descHr: 'Završi 100 treninga', descEn: 'Complete 100 workouts', xpReward: 200, coinReward: 200, check: s => s.totalWorkouts >= 100 },
  { id: 'workout_365', icon: '🏆', nameHr: 'Legenda', nameEn: 'Legend', descHr: '365 treninga — cijela godina!', descEn: '365 workouts — a whole year!', xpReward: 1000, coinReward: 1000, check: s => s.totalWorkouts >= 365 },

  // Streak milestones
  { id: 'streak_3', icon: '🔗', nameHr: '3 dana zaredom', nameEn: '3 Day Streak', descHr: 'Treniraj 3 dana zaredom', descEn: 'Train 3 days in a row', xpReward: 15, coinReward: 15, check: s => s.streak >= 3 },
  { id: 'streak_7', icon: '⚡', nameHr: 'Tjedan ratnik', nameEn: 'Week Warrior', descHr: 'Treniraj 7 dana zaredom', descEn: 'Train 7 days in a row', xpReward: 50, coinReward: 100, check: s => s.streak >= 7 },
  { id: 'streak_30', icon: '🌋', nameHr: 'Neustavljiv', nameEn: 'Unstoppable', descHr: '30 dana bez pauze!', descEn: '30 days without a break!', xpReward: 150, coinReward: 300, check: s => s.streak >= 30 },
  { id: 'streak_100', icon: '🐉', nameHr: 'Zmaj', nameEn: 'Dragon', descHr: '100 dana zaredom — legendarno', descEn: '100 days straight — legendary', xpReward: 500, coinReward: 1000, check: s => s.streak >= 100 },

  // Passport milestones
  { id: 'passport_10', icon: '🗺️', nameHr: 'Početnik anatom', nameEn: 'Beginner Anatomist', descHr: 'Otključaj 10 mišićnih glava', descEn: 'Unlock 10 muscle heads', xpReward: 30, coinReward: 30, check: s => s.musclesUnlocked >= 10 },
  { id: 'passport_25', icon: '🧬', nameHr: 'Explorer', nameEn: 'Explorer', descHr: 'Otključaj 25 mišićnih glava', descEn: 'Unlock 25 muscle heads', xpReward: 75, coinReward: 75, check: s => s.musclesUnlocked >= 25 },
  { id: 'passport_50', icon: '🔬', nameHr: 'Anatom', nameEn: 'Anatomist', descHr: 'Otključaj 50 mišićnih glava', descEn: 'Unlock 50 muscle heads', xpReward: 150, coinReward: 150, check: s => s.musclesUnlocked >= 50 },
  { id: 'passport_all', icon: '🏛️', nameHr: 'COMPLETIONIST', nameEn: 'COMPLETIONIST', descHr: 'Sve mišićne glave otključane!', descEn: 'All muscle heads unlocked!', xpReward: 500, coinReward: 1000, check: s => s.musclesUnlocked >= s.totalMuscleHeads },

  // Journal
  { id: 'journal_first', icon: '📓', nameHr: 'Samosvjestan', nameEn: 'Self-Aware', descHr: 'Ispuni prvi mišićni dnevnik', descEn: 'Fill your first muscle journal', xpReward: 10, coinReward: 10, check: s => s.journalEntries >= 1 },
  { id: 'journal_10', icon: '📊', nameHr: 'Analitičar', nameEn: 'Analyst', descHr: '10 dnevničkih zapisa', descEn: '10 journal entries', xpReward: 40, coinReward: 40, check: s => s.journalEntries >= 10 },

  // Coins
  { id: 'coins_100', icon: '💰', nameHr: 'Štediša', nameEn: 'Saver', descHr: 'Skupi 100 FIT Coina', descEn: 'Collect 100 FIT Coins', xpReward: 10, coinReward: 0, check: s => s.totalCoins >= 100 },
  { id: 'coins_1000', icon: '🏦', nameHr: 'Bankar', nameEn: 'Banker', descHr: 'Skupi 1000 FIT Coina', descEn: 'Collect 1000 FIT Coins', xpReward: 50, coinReward: 0, check: s => s.totalCoins >= 1000 },
];

// ── Achievements Store ─────────────────────────────────

interface AchievementStore {
  unlocked: Record<string, string>; // achievement id → ISO date
  newUnlocks: string[]; // just-unlocked IDs for animation
  init: () => void;
  checkAll: (stats: UserStats) => string[]; // returns newly unlocked IDs
  dismissNew: () => void;
}

const ACH_KEY = 'fit-achievements';

export const useAchievements = create<AchievementStore>((set, get) => ({
  unlocked: {},
  newUnlocks: [],

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(ACH_KEY);
      if (raw) set({ unlocked: JSON.parse(raw) });
    } catch {}
  },

  checkAll: (stats: UserStats) => {
    const { unlocked } = get();
    const newlyUnlocked: string[] = [];

    for (const ach of ACHIEVEMENTS) {
      if (!unlocked[ach.id] && ach.check(stats)) {
        unlocked[ach.id] = new Date().toISOString();
        newlyUnlocked.push(ach.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      const updated = { ...unlocked };
      set({ unlocked: updated, newUnlocks: newlyUnlocked });
      if (typeof window !== 'undefined') {
        localStorage.setItem(ACH_KEY, JSON.stringify(updated));
      }
    }

    return newlyUnlocked;
  },

  dismissNew: () => set({ newUnlocks: [] }),
}));
