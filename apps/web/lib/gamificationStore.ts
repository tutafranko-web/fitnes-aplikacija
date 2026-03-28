'use client';

import { create } from 'zustand';
import { TOTAL_HEADS, allHeads, getUnlockedHeads, musclesDatabase } from './constants/musclesDatabase';

// ═══════════════════════════════════════════════════════════
// MUSCLE PASSPORT — track which muscle heads are unlocked
// ═══════════════════════════════════════════════════════════

interface PassportEntry {
  headId: string;
  unlockedAt: string; // ISO date
  firstExercise: string;
}

interface PassportStore {
  unlocked: Record<string, PassportEntry>; // headId → entry
  totalUnlocked: number;
  totalHeads: number;

  // Actions
  unlockFromExercise: (exerciseName: string) => string[]; // returns newly unlocked head IDs
  isHeadUnlocked: (headId: string) => boolean;
  getGroupProgress: (groupId: string) => { unlocked: number; total: number };
  getBadge: () => { key: string; nameHr: string; nameEn: string } | null;
  init: () => void;
}

const PASSPORT_KEY = 'fit-passport';

const BADGES = [
  { min: 10, key: 'beginner', nameHr: 'Početnik', nameEn: 'Beginner' },
  { min: 25, key: 'explorer', nameHr: 'Explorer', nameEn: 'Explorer' },
  { min: 50, key: 'anatomist', nameHr: 'Anatom', nameEn: 'Anatomist' },
  { min: 75, key: 'master', nameHr: 'Majstor', nameEn: 'Master' },
  { min: TOTAL_HEADS, key: 'completionist', nameHr: 'COMPLETIONIST', nameEn: 'COMPLETIONIST' },
];

export const usePassport = create<PassportStore>((set, get) => ({
  unlocked: {},
  totalUnlocked: 0,
  totalHeads: TOTAL_HEADS,

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(PASSPORT_KEY);
      if (raw) {
        const unlocked = JSON.parse(raw) as Record<string, PassportEntry>;
        set({ unlocked, totalUnlocked: Object.keys(unlocked).length });
      }
    } catch {}
  },

  unlockFromExercise: (exerciseName: string) => {
    const heads = getUnlockedHeads(exerciseName);
    if (heads.length === 0) return [];

    const { unlocked } = get();
    const newlyUnlocked: string[] = [];
    const updated = { ...unlocked };

    for (const head of heads) {
      if (!updated[head.id]) {
        updated[head.id] = {
          headId: head.id,
          unlockedAt: new Date().toISOString(),
          firstExercise: exerciseName,
        };
        newlyUnlocked.push(head.id);
      }
    }

    if (newlyUnlocked.length > 0) {
      set({ unlocked: updated, totalUnlocked: Object.keys(updated).length });
      if (typeof window !== 'undefined') {
        localStorage.setItem(PASSPORT_KEY, JSON.stringify(updated));
      }
    }

    return newlyUnlocked;
  },

  isHeadUnlocked: (headId: string) => !!get().unlocked[headId],

  getGroupProgress: (groupId: string) => {
    const group = musclesDatabase.find(g => g.id === groupId);
    if (!group) return { unlocked: 0, total: 0 };
    const { unlocked } = get();
    const unlockedCount = group.heads.filter(h => unlocked[h.id]).length;
    return { unlocked: unlockedCount, total: group.heads.length };
  },

  getBadge: () => {
    const count = get().totalUnlocked;
    let best = null;
    for (const b of BADGES) {
      if (count >= b.min) best = b;
    }
    return best;
  },
}));

// ═══════════════════════════════════════════════════════════
// FIT COIN ECONOMY — earn, spend, track
// ═══════════════════════════════════════════════════════════

interface CoinTransaction {
  id: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  timestamp: string;
}

interface CoinStore {
  balance: number;
  totalEarned: number;
  totalSpent: number;
  history: CoinTransaction[];
  streak: number;
  lastWorkoutDate: string | null;

  // Actions
  earn: (amount: number, reason: string) => void;
  spend: (amount: number, reason: string) => boolean; // false if insufficient
  updateStreak: () => void;
  getMultiplier: () => number;
  init: () => void;
}

const COIN_KEY = 'fit-coins';

// Earn amounts
export const COIN_REWARDS = {
  WORKOUT_COMPLETE: 10,
  MUSCLE_UNLOCK: 10,
  ACHIEVEMENT: 20,
  STREAK_7: 100,
  STREAK_30: 300,
  STREAK_100: 1000,
  DUEL_WIN: 50,
  GHOST_BEAT: 30,
  CLAN_CHALLENGE: 50,
  SPOT_ADDED: 20,
  FORM_CHECK_9: 15,
} as const;

export const useCoinStore = create<CoinStore>((set, get) => ({
  balance: 0,
  totalEarned: 0,
  totalSpent: 0,
  history: [],
  streak: 0,
  lastWorkoutDate: null,

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(COIN_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set(data);
      }
    } catch {}
  },

  earn: (amount: number, reason: string) => {
    const multiplier = get().getMultiplier();
    const finalAmount = Math.round(amount * multiplier);
    const tx: CoinTransaction = {
      id: Date.now().toString(36),
      amount: finalAmount,
      type: 'earn',
      reason,
      timestamp: new Date().toISOString(),
    };
    set(s => {
      const updated = {
        balance: s.balance + finalAmount,
        totalEarned: s.totalEarned + finalAmount,
        history: [tx, ...s.history].slice(0, 100),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(COIN_KEY, JSON.stringify({ ...s, ...updated }));
      }
      return updated;
    });
  },

  spend: (amount: number, reason: string) => {
    if (get().balance < amount) return false;
    const tx: CoinTransaction = {
      id: Date.now().toString(36),
      amount,
      type: 'spend',
      reason,
      timestamp: new Date().toISOString(),
    };
    set(s => {
      const updated = {
        balance: s.balance - amount,
        totalSpent: s.totalSpent + amount,
        history: [tx, ...s.history].slice(0, 100),
      };
      if (typeof window !== 'undefined') {
        localStorage.setItem(COIN_KEY, JSON.stringify({ ...s, ...updated }));
      }
      return updated;
    });
    return true;
  },

  updateStreak: () => {
    const today = new Date().toISOString().split('T')[0];
    const { lastWorkoutDate, streak } = get();

    if (lastWorkoutDate === today) return; // already counted today

    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const newStreak = lastWorkoutDate === yesterday ? streak + 1 : 1;

    set(s => {
      const updated = { streak: newStreak, lastWorkoutDate: today };
      if (typeof window !== 'undefined') {
        localStorage.setItem(COIN_KEY, JSON.stringify({ ...s, ...updated }));
      }
      return updated;
    });
  },

  getMultiplier: () => {
    const { streak } = get();
    if (streak >= 100) return 3;
    if (streak >= 30) return 2;
    if (streak >= 7) return 1.5;
    return 1;
  },
}));

// ═══════════════════════════════════════════════════════════
// TAMAGOTCHI — muscle vitality based on training recency
// ═══════════════════════════════════════════════════════════

interface MuscleTrainingRecord {
  lastTrained: string; // ISO date
  trainCount: number;
}

interface TamagotchiStore {
  muscleHistory: Record<string, MuscleTrainingRecord>; // bodyMapGroup → record
  mood: 'beast' | 'happy' | 'meh' | 'neglected' | 'critical';
  xp: number;
  level: number;

  // Actions
  recordTraining: (muscleGroups: string[]) => void;
  getVitality: (muscleGroup: string) => number; // 0-100 opacity %
  getDaysSinceTraining: (muscleGroup: string) => number;
  getMood: () => 'beast' | 'happy' | 'meh' | 'neglected' | 'critical';
  addXP: (amount: number) => void;
  init: () => void;
}

const TAMA_KEY = 'fit-tamagotchi';

export const useTamagotchi = create<TamagotchiStore>((set, get) => ({
  muscleHistory: {},
  mood: 'meh',
  xp: 0,
  level: 1,

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(TAMA_KEY);
      if (raw) set(JSON.parse(raw));
    } catch {}
  },

  recordTraining: (muscleGroups: string[]) => {
    const today = new Date().toISOString().split('T')[0];
    set(s => {
      const updated = { ...s.muscleHistory };
      for (const group of muscleGroups) {
        const prev = updated[group];
        updated[group] = {
          lastTrained: today,
          trainCount: (prev?.trainCount || 0) + 1,
        };
      }
      const newState = { ...s, muscleHistory: updated, mood: get().getMood() };
      if (typeof window !== 'undefined') {
        localStorage.setItem(TAMA_KEY, JSON.stringify(newState));
      }
      return { muscleHistory: updated };
    });
  },

  getVitality: (muscleGroup: string) => {
    const days = get().getDaysSinceTraining(muscleGroup);
    if (days === 0) return 100; // trained today — full glow
    if (days === 1) return 85;
    if (days <= 3) return 65;
    if (days <= 5) return 40;
    if (days <= 10) return 20;
    return 8; // nearly invisible
  },

  getDaysSinceTraining: (muscleGroup: string) => {
    const record = get().muscleHistory[muscleGroup];
    if (!record) return 999; // never trained
    const last = new Date(record.lastTrained);
    const now = new Date();
    return Math.floor((now.getTime() - last.getTime()) / 86400000);
  },

  getMood: () => {
    const { muscleHistory } = get();
    const groups = Object.keys(muscleHistory);
    if (groups.length === 0) return 'critical';

    const today = new Date().toISOString().split('T')[0];
    const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
    const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

    const trainedRecently = groups.filter(g => {
      const d = muscleHistory[g].lastTrained;
      return d === today || d === yesterday || d === twoDaysAgo;
    });

    const recentRatio = trainedRecently.length / Math.max(groups.length, 1);
    const trainedToday = groups.some(g => muscleHistory[g].lastTrained === today);
    const trainedYesterday = groups.some(g => muscleHistory[g].lastTrained === yesterday);
    const trainedTwoDaysAgo = groups.some(g => muscleHistory[g].lastTrained === twoDaysAgo);

    if (trainedToday && trainedYesterday && trainedTwoDaysAgo) return 'beast';
    if (recentRatio > 0.5) return 'happy';
    if (recentRatio > 0.2) return 'meh';

    const maxDays = Math.max(...groups.map(g => get().getDaysSinceTraining(g)));
    if (maxDays > 10) return 'critical';
    if (maxDays > 5) return 'neglected';
    return 'meh';
  },

  addXP: (amount: number) => {
    set(s => {
      const newXP = s.xp + amount;
      const newLevel = Math.floor(newXP / 100) + 1;
      const updated = { xp: newXP, level: newLevel };
      if (typeof window !== 'undefined') {
        localStorage.setItem(TAMA_KEY, JSON.stringify({ ...s, ...updated }));
      }
      return updated;
    });
  },
}));
