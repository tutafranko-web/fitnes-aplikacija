'use client';

import { create } from 'zustand';

// Balkanski imena za nemesis generiranje
const MALE_NAMES = ['Dragan', 'Ante', 'Nikola', 'Luka', 'Petar', 'Marko', 'Ivan', 'Stipe', 'Tomislav', 'Goran', 'Damir', 'Zoran', 'Boris', 'Dejan', 'Vlado', 'Mirko', 'Savo', 'Rade', 'Bojan', 'Duško'];
const FEMALE_NAMES = ['Ana', 'Maja', 'Ivana', 'Petra', 'Marija', 'Sara', 'Mia', 'Lucija', 'Valentina', 'Nika', 'Tina', 'Lea', 'Ena', 'Katarina', 'Jelena', 'Tamara', 'Dina', 'Hana', 'Mirna', 'Ines'];
const CITIES = ['Split', 'Zagreb', 'Sarajevo', 'Beograd', 'Ljubljana', 'Rijeka', 'Osijek', 'Mostar', 'Novi Sad', 'Zadar', 'Pula', 'Dubrovnik', 'Niš', 'Podgorica', 'Maribor', 'Banja Luka'];
const AVATARS = ['🧔', '👨‍🦱', '👩‍🦰', '🧑‍🦲', '👨‍🦳', '👩', '🧑', '👨', '👩‍🦱', '🧔‍♀️'];

export interface Nemesis {
  name: string;
  city: string;
  avatar: string;
  level: number;
  weeklyVolume: number; // kg
  weeklyWorkouts: number;
  streak: number;
  benchMax: number;
  squatMax: number;
  deadliftMax: number;
  generatedAt: string;
  defeatedAt: string | null;
}

interface NemesisStore {
  nemesis: Nemesis | null;
  defeatedRivals: Nemesis[];
  init: () => void;
  generate: (userStats: { weeklyVolume: number; weeklyWorkouts: number; streak: number; level: number }) => void;
  simulateDaily: () => void;
  checkDefeat: (userStats: { weeklyVolume: number; weeklyWorkouts: number; streak: number }) => boolean;
  defeat: () => void;
}

const NEM_KEY = 'fit-nemesis';

export const useNemesis = create<NemesisStore>((set, get) => ({
  nemesis: null,
  defeatedRivals: [],

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(NEM_KEY);
      if (raw) {
        const data = JSON.parse(raw);
        set(data);
      }
    } catch {}
  },

  generate: (userStats) => {
    const isFemale = Math.random() > 0.5;
    const names = isFemale ? FEMALE_NAMES : MALE_NAMES;
    const nemesis: Nemesis = {
      name: names[Math.floor(Math.random() * names.length)],
      city: CITIES[Math.floor(Math.random() * CITIES.length)],
      avatar: AVATARS[Math.floor(Math.random() * AVATARS.length)],
      level: userStats.level + Math.ceil(Math.random() * 2),
      weeklyVolume: Math.round(userStats.weeklyVolume * (1.05 + Math.random() * 0.15)),
      weeklyWorkouts: Math.min(7, userStats.weeklyWorkouts + 1),
      streak: userStats.streak + Math.ceil(Math.random() * 5),
      benchMax: Math.round(60 + Math.random() * 80),
      squatMax: Math.round(80 + Math.random() * 100),
      deadliftMax: Math.round(100 + Math.random() * 120),
      generatedAt: new Date().toISOString(),
      defeatedAt: null,
    };

    set(s => {
      const newState = { nemesis, defeatedRivals: s.defeatedRivals };
      if (typeof window !== 'undefined') localStorage.setItem(NEM_KEY, JSON.stringify(newState));
      return newState;
    });
  },

  simulateDaily: () => {
    const { nemesis } = get();
    if (!nemesis) return;

    // Nemesis "trains" — random daily volume increase
    const trainedToday = Math.random() > 0.2; // 80% chance nemesis trains
    if (trainedToday) {
      const dailyVolume = Math.round(2000 + Math.random() * 5000);
      set(s => {
        if (!s.nemesis) return s;
        const updated = {
          ...s.nemesis,
          weeklyVolume: s.nemesis.weeklyVolume + dailyVolume,
          streak: s.nemesis.streak + 1,
        };
        const newState = { ...s, nemesis: updated };
        if (typeof window !== 'undefined') localStorage.setItem(NEM_KEY, JSON.stringify(newState));
        return { nemesis: updated };
      });
    }
  },

  checkDefeat: (userStats) => {
    const { nemesis } = get();
    if (!nemesis) return false;

    let userWins = 0;
    if (userStats.weeklyVolume > nemesis.weeklyVolume) userWins++;
    if (userStats.weeklyWorkouts > nemesis.weeklyWorkouts) userWins++;
    if (userStats.streak > nemesis.streak) userWins++;

    return userWins >= 2; // Win 2 of 3 categories
  },

  defeat: () => {
    const { nemesis } = get();
    if (!nemesis) return;

    const defeated = { ...nemesis, defeatedAt: new Date().toISOString() };
    set(s => {
      const newState = {
        nemesis: null,
        defeatedRivals: [defeated, ...s.defeatedRivals].slice(0, 20),
      };
      if (typeof window !== 'undefined') localStorage.setItem(NEM_KEY, JSON.stringify(newState));
      return newState;
    });
  },
}));
