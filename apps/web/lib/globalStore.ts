'use client';

import { create } from 'zustand';

// ============ TRAINER CHAT STORE ============
interface ChatMsg { role: string; text: string }

interface TrainerChatStore {
  msgs: ChatMsg[];
  addMsg: (msg: ChatMsg) => void;
  setMsgs: (msgs: ChatMsg[]) => void;
}

export const useTrainerChat = create<TrainerChatStore>((set) => ({
  msgs: [],
  addMsg: (msg) => set((s) => ({ msgs: [...s.msgs, msg] })),
  setMsgs: (msgs) => set({ msgs }),
}));

// ============ DR FILIP CHAT STORE ============
interface DrFilipStore {
  msgs: ChatMsg[];
  addMsg: (msg: ChatMsg) => void;
  setMsgs: (msgs: ChatMsg[]) => void;
}

export const useDrFilipChat = create<DrFilipStore>((set) => ({
  msgs: [],
  addMsg: (msg) => set((s) => ({ msgs: [...s.msgs, msg] })),
  setMsgs: (msgs) => set({ msgs }),
}));

// ============ WORKOUT GENERATOR STORE ============
interface WorkoutGenStore {
  genStep: number;
  genOpts: { focus: string[]; duration: string; intensity: string };
  generatedWorkout: any | null;
  generating: boolean;
  suggestion: string;
  setGenStep: (s: number) => void;
  setGenOpts: (o: any) => void;
  setGeneratedWorkout: (w: any) => void;
  setGenerating: (g: boolean) => void;
  setSuggestion: (s: string) => void;
}

export const useWorkoutGen = create<WorkoutGenStore>((set) => ({
  genStep: 0,
  genOpts: { focus: [], duration: '30', intensity: 'medium' },
  generatedWorkout: null,
  generating: false,
  suggestion: '',
  setGenStep: (genStep) => set({ genStep }),
  setGenOpts: (genOpts) => set({ genOpts }),
  setGeneratedWorkout: (generatedWorkout) => set({ generatedWorkout }),
  setGenerating: (generating) => set({ generating }),
  setSuggestion: (suggestion) => set({ suggestion }),
}));

// ============ STEP COUNTER STORE ============
interface StepStore {
  steps: number;
  calories: number;
  setSteps: (s: number) => void;
}

export const useStepCounter = create<StepStore>((set) => ({
  steps: 0,
  calories: 0,
  setSteps: (steps) => set({ steps, calories: Math.round(steps * 0.04) }),
}));

// ============ SOCIAL POSTS STORE ============
export interface SocialPost {
  id: string;
  name: string;
  avatar: string;
  type: 'text' | 'image' | 'video' | 'story';
  text: string;
  media?: string; // data URL or URL
  sport?: string;
  stats?: string;
  likes: number;
  comments: number;
  time: string;
  liked: boolean;
  isStory?: boolean;
}

interface SocialStore {
  posts: SocialPost[];
  stories: SocialPost[];
  addPost: (post: SocialPost) => void;
  toggleLike: (id: string) => void;
}

export const useSocialStore = create<SocialStore>((set) => ({
  posts: [],
  stories: [],
  addPost: (post) => set((s) => ({
    posts: post.isStory ? s.posts : [post, ...s.posts],
    stories: post.isStory ? [post, ...s.stories] : s.stories,
  })),
  toggleLike: (id) => set((s) => ({
    ...s,
    posts: s.posts.map((p) => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p),
  })),
}));
