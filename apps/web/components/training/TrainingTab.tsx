'use client';

import { useState, useEffect, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Lbl from '@/components/ui/Lbl';

interface Exercise {
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: number;
  note?: string;
  done: boolean;
}

interface Workout {
  id: string;
  name: string;
  duration: number;
  calories: number;
  muscles: string[];
  exercises: Exercise[];
}

export default function TrainingTab() {
  const locale = useLocaleStore((s) => s.locale);
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [generating, setGenerating] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const sampleWorkouts: Workout[] = [
    {
      id: '1',
      name: locale === 'hr' ? 'Push — Prsa & Triceps' : 'Push — Chest & Triceps',
      duration: 45, calories: 380,
      muscles: locale === 'hr' ? ['Prsa', 'Triceps', 'Ramena'] : ['Chest', 'Triceps', 'Shoulders'],
      exercises: [
        { name: 'Bench Press', sets: 4, reps: '8', weight: '80kg', rest: 90, done: false },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '12', weight: '30kg', rest: 75, done: false },
        { name: 'Cable Fly', sets: 3, reps: '15', weight: '16kg', rest: 60, done: false },
        { name: 'Overhead Tricep Extension', sets: 3, reps: '12', weight: '20kg', rest: 60, done: false },
        { name: 'Tricep Pushdown', sets: 3, reps: '15', weight: '25kg', rest: 60, done: false },
        { name: 'Lateral Raise', sets: 3, reps: '15', weight: '10kg', rest: 45, done: false },
      ],
    },
    {
      id: '2',
      name: locale === 'hr' ? 'Pull — Leđa & Biceps' : 'Pull — Back & Biceps',
      duration: 50, calories: 420,
      muscles: locale === 'hr' ? ['Leđa', 'Biceps', 'Podlaktice'] : ['Back', 'Biceps', 'Forearms'],
      exercises: [
        { name: 'Deadlift', sets: 4, reps: '6', weight: '120kg', rest: 120, done: false },
        { name: 'Pull-ups', sets: 4, reps: '8', rest: 90, done: false },
        { name: 'Barbell Row', sets: 3, reps: '10', weight: '70kg', rest: 75, done: false },
        { name: 'Face Pull', sets: 3, reps: '15', weight: '18kg', rest: 60, done: false },
        { name: 'Barbell Curl', sets: 3, reps: '10', weight: '30kg', rest: 60, done: false },
        { name: 'Hammer Curl', sets: 3, reps: '12', weight: '14kg', rest: 45, done: false },
      ],
    },
    {
      id: '3',
      name: locale === 'hr' ? 'Noge & Core' : 'Legs & Core',
      duration: 55, calories: 500,
      muscles: locale === 'hr' ? ['Quadriceps', 'Hamstrings', 'Gluteus', 'Core'] : ['Quads', 'Hamstrings', 'Glutes', 'Core'],
      exercises: [
        { name: 'Squat', sets: 4, reps: '8', weight: '100kg', rest: 120, done: false },
        { name: 'Romanian Deadlift', sets: 3, reps: '10', weight: '80kg', rest: 90, done: false },
        { name: 'Leg Press', sets: 3, reps: '12', weight: '180kg', rest: 75, done: false },
        { name: 'Walking Lunges', sets: 3, reps: '12/leg', weight: '20kg', rest: 60, done: false },
        { name: 'Hanging Leg Raise', sets: 3, reps: '15', rest: 60, done: false },
        { name: 'Plank', sets: 3, reps: '60s', rest: 45, done: false },
      ],
    },
  ];

  // Timer logic
  useEffect(() => {
    if (timerRunning) {
      timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [timerRunning]);

  // Rest timer countdown
  useEffect(() => {
    if (restTimer > 0) {
      const iv = setInterval(() => setRestTimer((t) => Math.max(0, t - 1)), 1000);
      return () => clearInterval(iv);
    }
  }, [restTimer]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    return `${m.toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`;
  };

  const startWorkout = (w: Workout) => {
    setActiveWorkout({ ...w, exercises: w.exercises.map((e) => ({ ...e, done: false })) });
    setTimer(0);
    setTimerRunning(true);
  };

  const toggleExercise = (idx: number) => {
    if (!activeWorkout) return;
    const exs = [...activeWorkout.exercises];
    exs[idx] = { ...exs[idx], done: !exs[idx].done };
    setActiveWorkout({ ...activeWorkout, exercises: exs });
    if (!exs[idx].done) return;
    // Start rest timer
    setRestTimer(exs[idx].rest);
  };

  const generateWorkout = () => {
    setGenerating(true);
    setTimeout(() => {
      setGenerating(false);
      // Would call Gemini API here
    }, 2000);
  };

  const completedCount = activeWorkout?.exercises.filter((e) => e.done).length || 0;
  const totalCount = activeWorkout?.exercises.length || 0;

  if (activeWorkout) {
    return (
      <div className="flex flex-col gap-3.5">
        {/* Active Workout Header */}
        <Box glow="#00f0b5">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-xs text-fit-dim font-bold uppercase tracking-wider">
                {locale === 'hr' ? 'Aktivni trening' : 'Active workout'}
              </div>
              <div className="text-lg font-black text-fit-text">{activeWorkout.name}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-fit-accent tabular-nums">{formatTime(timer)}</div>
              <div className="text-[10px] text-fit-muted">{completedCount}/{totalCount} {locale === 'hr' ? 'vježbi' : 'exercises'}</div>
            </div>
          </div>
          <Bar pct={(completedCount / totalCount) * 100} color="#00f0b5" h={4} />
          <div className="flex gap-2 mt-3">
            <button
              onClick={() => setTimerRunning(!timerRunning)}
              className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border-none"
              style={{ background: timerRunning ? '#ff6b4a20' : '#00f0b520', color: timerRunning ? '#ff6b4a' : '#00f0b5' }}
            >
              {timerRunning ? '⏸ Pause' : '▶ Resume'}
            </button>
            <button
              onClick={() => { setActiveWorkout(null); setTimerRunning(false); setTimer(0); }}
              className="py-2 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted"
            >
              ✕ {locale === 'hr' ? 'Završi' : 'Finish'}
            </button>
          </div>
        </Box>

        {/* Rest Timer */}
        {restTimer > 0 && (
          <Box glow="#ffc233">
            <div className="text-center">
              <div className="text-xs text-fit-gold font-bold">{locale === 'hr' ? 'ODMOR' : 'REST'}</div>
              <div className="text-4xl font-black text-fit-gold tabular-nums my-1">{restTimer}s</div>
              <button onClick={() => setRestTimer(0)} className="text-[10px] text-fit-muted cursor-pointer bg-transparent border-none">
                {locale === 'hr' ? 'Preskoči →' : 'Skip →'}
              </button>
            </div>
          </Box>
        )}

        {/* Exercise List */}
        {activeWorkout.exercises.map((ex, i) => (
          <div
            key={i}
            onClick={() => toggleExercise(i)}
            className="flex items-center gap-3 py-3 px-4 rounded-2xl cursor-pointer transition-all duration-200 border"
            style={{
              background: ex.done ? '#00f0b508' : 'rgba(255,255,255,0.035)',
              borderColor: ex.done ? '#00f0b533' : 'rgba(255,255,255,0.06)',
              opacity: ex.done ? 0.6 : 1,
            }}
          >
            <div className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all"
              style={{ borderColor: ex.done ? '#00f0b5' : '#4a4e62', background: ex.done ? '#00f0b5' : 'transparent' }}>
              {ex.done && <span className="text-xs text-black">✓</span>}
            </div>
            <div className="flex-1">
              <div className="text-sm font-bold" style={{ color: ex.done ? '#00f0b5' : '#e8eaf0', textDecoration: ex.done ? 'line-through' : 'none' }}>
                {ex.name}
              </div>
              <div className="text-[10px] text-fit-muted">
                {ex.sets}×{ex.reps} {ex.weight ? `@ ${ex.weight}` : ''} · {ex.rest}s {locale === 'hr' ? 'odmor' : 'rest'}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* AI Generate */}
      <Box glow="#7c5cfc">
        <Lbl icon="🤖" text={locale === 'hr' ? 'AI generiraj trening' : 'AI generate workout'} color="#7c5cfc" />
        <button
          onClick={generateWorkout}
          disabled={generating}
          className="w-full mt-3 py-4 rounded-2xl text-sm font-black cursor-pointer border-none transition-all"
          style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', color: '#fff', opacity: generating ? 0.6 : 1 }}
        >
          {generating
            ? (locale === 'hr' ? '🤖 Generiram...' : '🤖 Generating...')
            : (locale === 'hr' ? '✨ Generiraj personalizirani trening' : '✨ Generate personalized workout')}
        </button>
      </Box>

      {/* Workout List */}
      <Lbl icon="🏋️" text={locale === 'hr' ? 'Treninzi' : 'Workouts'} />
      {sampleWorkouts.map((w) => (
        <Box key={w.id}>
          <div className="flex justify-between items-start mb-2">
            <div>
              <div className="text-sm font-bold text-fit-text">{w.name}</div>
              <div className="text-[10px] text-fit-muted mt-0.5">
                ⏱ {w.duration} min · 🔥 {w.calories} kcal · {w.exercises.length} {locale === 'hr' ? 'vježbi' : 'exercises'}
              </div>
            </div>
          </div>
          <div className="flex gap-1 flex-wrap mb-3">
            {w.muscles.map((m) => (
              <span key={m} className="text-[9px] font-bold py-0.5 px-2 rounded-full bg-fit-accent/10 text-fit-accent">{m}</span>
            ))}
          </div>
          <div className="flex flex-col gap-1 mb-3">
            {w.exercises.slice(0, 3).map((ex, i) => (
              <div key={i} className="text-[11px] text-fit-muted">
                • {ex.name} {ex.sets}×{ex.reps} {ex.weight ? `@ ${ex.weight}` : ''}
              </div>
            ))}
            {w.exercises.length > 3 && (
              <div className="text-[10px] text-fit-dim">+{w.exercises.length - 3} {locale === 'hr' ? 'više' : 'more'}...</div>
            )}
          </div>
          <button
            onClick={() => startWorkout(w)}
            className="w-full py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #00f0b5, #3ea8ff)', color: '#000' }}
          >
            ▶ {locale === 'hr' ? 'Pokreni trening' : 'Start workout'}
          </button>
        </Box>
      ))}
    </div>
  );
}
