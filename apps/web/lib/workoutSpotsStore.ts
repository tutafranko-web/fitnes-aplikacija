'use client';

import { create } from 'zustand';

export interface WorkoutSpot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string;
  city: string;
  country: string;
  equipment: string[];
  photos: string[]; // data URLs
  addedBy: string;
  verified: boolean;
  avgRating: number;
  reviewCount: number;
  reviews: SpotReview[];
  createdAt: string;
}

export interface SpotReview {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
}

export const EQUIPMENT_OPTIONS = [
  { id: 'pull_up_bar', icon: '🔩', hr: 'Šipka za zgibove', en: 'Pull-up Bar' },
  { id: 'parallel_bars', icon: '🫳', hr: 'Paralelne šipke', en: 'Parallel Bars' },
  { id: 'monkey_bars', icon: '🐒', hr: 'Monkey bars', en: 'Monkey Bars' },
  { id: 'rings', icon: '⭕', hr: 'Karike', en: 'Rings' },
  { id: 'bench', icon: '🪑', hr: 'Klupa', en: 'Bench' },
  { id: 'low_bar', icon: '➖', hr: 'Niska šipka', en: 'Low Bar' },
  { id: 'swedish_wall', icon: '🪜', hr: 'Švedske ljestve', en: 'Swedish Wall' },
  { id: 'rope', icon: '🪢', hr: 'Uže za penjanje', en: 'Climbing Rope' },
  { id: 'rubber_floor', icon: '🟫', hr: 'Gumeni pod', en: 'Rubber Floor' },
  { id: 'running_track', icon: '🏃', hr: 'Staza za trčanje', en: 'Running Track' },
  { id: 'outdoor_gym', icon: '🏋️', hr: 'Outdoor sprave', en: 'Outdoor Machines' },
  { id: 'battle_ropes', icon: '〰️', hr: 'Battle ropes', en: 'Battle Ropes' },
  { id: 'tires', icon: '⚫', hr: 'Gume za vježbanje', en: 'Tires' },
  { id: 'sand_pit', icon: '🏖️', hr: 'Pijesak', en: 'Sand Pit' },
  { id: 'shade', icon: '🌳', hr: 'Hladovina', en: 'Shade' },
  { id: 'lights', icon: '💡', hr: 'Rasvjeta', en: 'Lights' },
  { id: 'water', icon: '🚰', hr: 'Voda', en: 'Water Fountain' },
  { id: 'parking', icon: '🅿️', hr: 'Parking', en: 'Parking' },
];

// Pre-seeded spots across the Balkans
const SEED_SPOTS: WorkoutSpot[] = [
  { id: 's1', name: 'Žnjan Workout Park', lat: 43.5015, lng: 16.4770, address: 'Žnjan plaža', city: 'Split', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'monkey_bars', 'bench', 'rubber_floor', 'shade', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.7, reviewCount: 23, reviews: [{ id: 'r1', userId: 'u1', userName: 'Mate', rating: 5, comment: 'Najbolji park u Splitu! Sve sprave nove.', createdAt: '2025-12-01' }], createdAt: '2025-01-15' },
  { id: 's2', name: 'Bundek Calisthenics', lat: 45.7850, lng: 15.9819, address: 'Bundek jezero', city: 'Zagreb', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'rings', 'swedish_wall', 'rubber_floor', 'lights', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.5, reviewCount: 41, reviews: [{ id: 'r2', userId: 'u2', userName: 'Iva', rating: 4, comment: 'Odlično za jutarnji trening.', createdAt: '2025-11-20' }], createdAt: '2025-02-10' },
  { id: 's3', name: 'Kalemegdan Gym', lat: 44.8230, lng: 20.4530, address: 'Kalemegdan park', city: 'Beograd', country: 'RS', equipment: ['pull_up_bar', 'parallel_bars', 'bench', 'low_bar', 'shade'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.3, reviewCount: 56, reviews: [{ id: 'r3', userId: 'u3', userName: 'Nikola', rating: 5, comment: 'Legendarno mesto za trening!', createdAt: '2025-10-15' }], createdAt: '2025-01-20' },
  { id: 's4', name: 'Vilsonovo šetalište', lat: 43.8563, lng: 18.4131, address: 'Vilsonovo šetalište', city: 'Sarajevo', country: 'BA', equipment: ['pull_up_bar', 'parallel_bars', 'running_track', 'shade', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.1, reviewCount: 18, reviews: [], createdAt: '2025-03-05' },
  { id: 's5', name: 'Tivoli Park Gym', lat: 46.0569, lng: 14.4935, address: 'Park Tivoli', city: 'Ljubljana', country: 'SI', equipment: ['pull_up_bar', 'parallel_bars', 'outdoor_gym', 'rubber_floor', 'lights', 'water', 'parking'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.6, reviewCount: 32, reviews: [], createdAt: '2025-02-28' },
  { id: 's6', name: 'Marjan Fitness Trail', lat: 43.5122, lng: 16.4170, address: 'Šuma Marjan', city: 'Split', country: 'HR', equipment: ['pull_up_bar', 'low_bar', 'bench', 'running_track', 'shade'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.8, reviewCount: 67, reviews: [{ id: 'r6', userId: 'u6', userName: 'Stipe', rating: 5, comment: 'Trčanje + calisthenicsi u šumi — savršeno!', createdAt: '2025-09-10' }], createdAt: '2025-01-10' },
  { id: 's7', name: 'Novi Sad Beach Gym', lat: 45.2461, lng: 19.8494, address: 'Štrand plaža', city: 'Novi Sad', country: 'RS', equipment: ['pull_up_bar', 'parallel_bars', 'rings', 'sand_pit', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.4, reviewCount: 29, reviews: [], createdAt: '2025-04-01' },
  { id: 's8', name: 'Kantrida Outdoor', lat: 45.3371, lng: 14.3955, address: 'Kantrida', city: 'Rijeka', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'bench', 'outdoor_gym', 'shade', 'parking'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.2, reviewCount: 14, reviews: [], createdAt: '2025-03-15' },
  { id: 's9', name: 'Morača Park Gym', lat: 42.4304, lng: 19.2594, address: 'Park Morača', city: 'Podgorica', country: 'ME', equipment: ['pull_up_bar', 'parallel_bars', 'bench', 'rubber_floor'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 3.9, reviewCount: 8, reviews: [], createdAt: '2025-05-10' },
  { id: 's10', name: 'Osijek Promenada', lat: 45.5550, lng: 18.6955, address: 'Promenada uz Dravu', city: 'Osijek', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'running_track', 'lights', 'water', 'shade'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.5, reviewCount: 21, reviews: [], createdAt: '2025-02-20' },
  { id: 's11', name: 'Zrinjski Park', lat: 43.3438, lng: 17.8078, address: 'Zrinjski park', city: 'Mostar', country: 'BA', equipment: ['pull_up_bar', 'bench', 'running_track', 'shade'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.0, reviewCount: 11, reviews: [], createdAt: '2025-04-15' },
  { id: 's12', name: 'Pula Arena Park', lat: 44.8693, lng: 13.8481, address: 'Park kod Arene', city: 'Pula', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'monkey_bars', 'rubber_floor', 'lights'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.3, reviewCount: 16, reviews: [], createdAt: '2025-03-01' },
  { id: 's13', name: 'Zadar Riva Calisthenics', lat: 44.1194, lng: 15.2314, address: 'Riva zadar', city: 'Zadar', country: 'HR', equipment: ['pull_up_bar', 'parallel_bars', 'low_bar', 'shade', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.4, reviewCount: 19, reviews: [], createdAt: '2025-02-05' },
  { id: 's14', name: 'Dubrovnik Lapad', lat: 42.6568, lng: 18.0700, address: 'Lapad šetnica', city: 'Dubrovnik', country: 'HR', equipment: ['pull_up_bar', 'bench', 'running_track', 'shade', 'water'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.6, reviewCount: 13, reviews: [], createdAt: '2025-04-20' },
  { id: 's15', name: 'Banja Luka Kastell', lat: 44.7722, lng: 17.1910, address: 'Kastel tvrđava', city: 'Banja Luka', country: 'BA', equipment: ['pull_up_bar', 'parallel_bars', 'running_track', 'shade'], photos: [], addedBy: 'FIT Team', verified: true, avgRating: 4.1, reviewCount: 9, reviews: [], createdAt: '2025-05-01' },
];

interface SpotStore {
  spots: WorkoutSpot[];
  selectedSpot: WorkoutSpot | null;
  filterEquipment: string[];
  filterCity: string;
  searchQuery: string;

  init: () => void;
  addSpot: (spot: Omit<WorkoutSpot, 'id' | 'verified' | 'avgRating' | 'reviewCount' | 'reviews' | 'createdAt'>) => void;
  addReview: (spotId: string, review: Omit<SpotReview, 'id' | 'createdAt'>) => void;
  setSelected: (spot: WorkoutSpot | null) => void;
  setFilterEquipment: (eq: string[]) => void;
  setFilterCity: (city: string) => void;
  setSearch: (q: string) => void;
  getFiltered: () => WorkoutSpot[];
  getCities: () => string[];
}

const SPOTS_KEY = 'fit-workout-spots';

export const useSpotStore = create<SpotStore>((set, get) => ({
  spots: [],
  selectedSpot: null,
  filterEquipment: [],
  filterCity: '',
  searchQuery: '',

  init: () => {
    if (typeof window === 'undefined') return;
    try {
      const raw = localStorage.getItem(SPOTS_KEY);
      if (raw) {
        const userSpots = JSON.parse(raw) as WorkoutSpot[];
        // Merge seed + user spots
        const allIds = new Set(SEED_SPOTS.map(s => s.id));
        const unique = userSpots.filter(s => !allIds.has(s.id));
        set({ spots: [...SEED_SPOTS, ...unique] });
      } else {
        set({ spots: SEED_SPOTS });
      }
    } catch {
      set({ spots: SEED_SPOTS });
    }
  },

  addSpot: (spot) => {
    const newSpot: WorkoutSpot = {
      ...spot,
      id: 'u_' + Date.now().toString(36),
      verified: false,
      avgRating: 0,
      reviewCount: 0,
      reviews: [],
      createdAt: new Date().toISOString(),
    };
    set(s => {
      const updated = [...s.spots, newSpot];
      const userAdded = updated.filter(sp => sp.id.startsWith('u_'));
      if (typeof window !== 'undefined') localStorage.setItem(SPOTS_KEY, JSON.stringify(userAdded));
      return { spots: updated };
    });
  },

  addReview: (spotId, review) => {
    const newReview: SpotReview = {
      ...review,
      id: 'rv_' + Date.now().toString(36),
      createdAt: new Date().toISOString(),
    };
    set(s => {
      const updated = s.spots.map(sp => {
        if (sp.id !== spotId) return sp;
        const reviews = [...sp.reviews, newReview];
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        return { ...sp, reviews, avgRating: Math.round(avgRating * 10) / 10, reviewCount: reviews.length };
      });
      return { spots: updated };
    });
  },

  setSelected: (spot) => set({ selectedSpot: spot }),
  setFilterEquipment: (eq) => set({ filterEquipment: eq }),
  setFilterCity: (city) => set({ filterCity: city }),
  setSearch: (q) => set({ searchQuery: q }),

  getFiltered: () => {
    const { spots, filterEquipment, filterCity, searchQuery } = get();
    return spots.filter(s => {
      if (filterCity && s.city !== filterCity) return false;
      if (filterEquipment.length > 0 && !filterEquipment.every(eq => s.equipment.includes(eq))) return false;
      if (searchQuery && !s.name.toLowerCase().includes(searchQuery.toLowerCase()) && !s.city.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      return true;
    });
  },

  getCities: () => {
    const citySet = new Set(get().spots.map(s => s.city));
    const cities = Array.from(citySet);
    return cities.sort();
  },
}));
