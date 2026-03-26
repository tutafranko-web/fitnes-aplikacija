'use client';

import { useState, useEffect, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Lbl from '@/components/ui/Lbl';
import { logWorkout } from '@/lib/dataStore';
import RunningMap from '@/components/running/RunningMap';

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
  const hr = locale === 'hr';
  const [activeWorkout, setActiveWorkout] = useState<Workout | null>(null);
  const [timer, setTimer] = useState(0);
  const [timerRunning, setTimerRunning] = useState(false);
  const [restTimer, setRestTimer] = useState(0);
  const [generating, setGenerating] = useState(false);
  const [suggestion, setSuggestion] = useState('');
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    try { setProfile(JSON.parse(localStorage.getItem('fit-profile') || '{}')); } catch {}
  }, []);

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

  const [genStep, setGenStep] = useState(0);
  const [genOpts, setGenOpts] = useState({ focus: [] as string[], duration: '30', intensity: 'medium' });
  const [generatedWorkout, setGeneratedWorkout] = useState<Workout | null>(null);
  const [customExercise, setCustomExercise] = useState({ name: '', sets: '3', reps: '10', weight: '' });

  const generateWorkout = async () => {
    if (genStep === 0) { setGenStep(1); return; }
    if (genStep !== 1) return;
    setGenStep(2);
    setGenerating(true);

    // Load profile for context
    let prof: any = {};
    try { prof = JSON.parse(localStorage.getItem('fit-profile') || '{}'); } catch {}

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Generiraj trening. Fokus: ${genOpts.focus.join(', ') || 'full body'}. Trajanje: ${genOpts.duration} min. Intenzitet: ${genOpts.intensity}. Oprema: ${prof.equipment?.join(', ') || 'full gym'}. Ozljede: ${prof.injuries?.join(', ') || 'nema'}. Razina: ${prof.level || 'mid'}. Cilj: ${prof.goal || 'gain'}.

ODGOVORI ISKLJUČIVO U OVOM JSON FORMATU:
{"name":"Naziv treninga","duration":${genOpts.duration},"calories":300,"muscles":["Prsa","Triceps"],"exercises":[{"name":"Bench Press","sets":4,"reps":"8","weight":"80kg","rest":90,"done":false},{"name":"Incline DB Press","sets":3,"reps":"12","weight":"30kg","rest":75,"done":false}]}`,
          history: [],
          locale,
          trainerPrompt: 'Ti si fitness AI. Generiraj trening u ČISTOM JSON formatu. Nikakav tekst izvan JSONa. Prilagodi ozljedama.',
        }),
      });
      const data = await res.json();

      // Try parsing JSON from response
      let workout: Workout | null = null;
      try {
        const jsonMatch = data.text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          const parsed = JSON.parse(jsonMatch[0]);
          workout = {
            id: `gen_${Date.now()}`,
            name: parsed.name || `${genOpts.focus || 'Full Body'} Workout`,
            duration: parsed.duration || parseInt(genOpts.duration),
            calories: parsed.calories || 300,
            muscles: parsed.muscles || [genOpts.focus],
            exercises: (parsed.exercises || []).map((e: any) => ({ ...e, done: false })),
          };
        }
      } catch {}

      // Fallback if JSON parsing failed
      if (!workout || workout.exercises.length === 0) {
        workout = generateFallbackWorkout({ ...genOpts, focus: genOpts.focus[0] || 'full_body' }, prof);
      }

      setGeneratedWorkout(workout);
      setGenerating(false);
      setGenStep(3);
    } catch {
      setGeneratedWorkout(generateFallbackWorkout({ ...genOpts, focus: genOpts.focus[0] || 'full_body' }, prof));
      setGenerating(false);
      setGenStep(3);
    }
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
              onClick={() => {
                // Log workout + auto-calculate soreness
                if (activeWorkout) {
                  const doneExercises = activeWorkout.exercises.filter(e => e.done).map(e => e.name);
                  if (doneExercises.length > 0) logWorkout(doneExercises);
                }
                // Show suggestion for next workout
                setSuggestion(hr ? '💡 Odličan trening! Sutra preporučujem Pull dan (leđa + biceps) za balansiran program.' : "💡 Great workout! Tomorrow I recommend a Pull day (back + biceps) for a balanced program.");
                setActiveWorkout(null); setTimerRunning(false); setTimer(0);
              }}
              className="py-2 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted"
            >
              ✅ {hr ? 'Završi' : 'Finish'}
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

        {/* Add custom exercise */}
        <div className="mt-2 p-3 rounded-xl bg-white/[0.02] border border-dashed border-fit-border">
          <div className="text-[10px] text-fit-dim font-bold mb-2">+ {hr ? 'Dodaj vježbu' : 'Add exercise'}</div>
          <div className="flex gap-1 flex-wrap">
            <input value={customExercise.name} onChange={(e) => setCustomExercise(c => ({ ...c, name: e.target.value }))}
              placeholder={hr ? 'Naziv vježbe' : 'Exercise name'}
              className="flex-1 min-w-[120px] bg-white/[0.04] border border-fit-border rounded-lg py-1.5 px-2 text-fit-text text-[10px] outline-none" />
            <input value={customExercise.sets} onChange={(e) => setCustomExercise(c => ({ ...c, sets: e.target.value }))}
              placeholder="Sets" className="w-12 bg-white/[0.04] border border-fit-border rounded-lg py-1.5 px-2 text-fit-text text-[10px] outline-none text-center" />
            <input value={customExercise.reps} onChange={(e) => setCustomExercise(c => ({ ...c, reps: e.target.value }))}
              placeholder="Reps" className="w-12 bg-white/[0.04] border border-fit-border rounded-lg py-1.5 px-2 text-fit-text text-[10px] outline-none text-center" />
            <input value={customExercise.weight} onChange={(e) => setCustomExercise(c => ({ ...c, weight: e.target.value }))}
              placeholder="kg" className="w-14 bg-white/[0.04] border border-fit-border rounded-lg py-1.5 px-2 text-fit-text text-[10px] outline-none text-center" />
            <button onClick={() => {
              if (!customExercise.name.trim() || !activeWorkout) return;
              setActiveWorkout({
                ...activeWorkout,
                exercises: [...activeWorkout.exercises, {
                  name: customExercise.name, sets: parseInt(customExercise.sets) || 3,
                  reps: customExercise.reps || '10', weight: customExercise.weight || undefined,
                  rest: 60, done: false,
                }]
              });
              setCustomExercise({ name: '', sets: '3', reps: '10', weight: '' });
            }}
              className="py-1.5 px-3 rounded-lg text-[10px] font-bold cursor-pointer border-none bg-fit-accent/20 text-fit-accent">+</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3.5">
      {/* AI Generate */}
      <Box glow="#7c5cfc">
        <Lbl icon="🤖" text={hr ? 'AI generiraj trening' : 'AI generate workout'} color="#7c5cfc" />

        {genStep === 0 && (
          <button onClick={() => setGenStep(1)}
            className="w-full mt-3 py-4 rounded-2xl text-sm font-black cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', color: '#fff' }}>
            ✨ {hr ? 'Generiraj personalizirani trening' : 'Generate personalized workout'}
          </button>
        )}

        {genStep === 1 && (
          <div className="mt-3 flex flex-col gap-3 animate-[fadeIn_0.3s_ease]">
            <div>
              <div className="text-[10px] text-fit-dim font-bold mb-1">{hr ? 'FOKUS TRENINGA (odaberi više)' : 'WORKOUT FOCUS (select multiple)'}</div>
              <div className="grid grid-cols-4 gap-1">
                {[
                  { id: 'chest', l: hr ? 'Prsa' : 'Chest' }, { id: 'back', l: hr ? 'Leđa' : 'Back' },
                  { id: 'legs', l: hr ? 'Noge' : 'Legs' }, { id: 'shoulders', l: hr ? 'Ramena' : 'Shoulders' },
                  { id: 'arms', l: hr ? 'Ruke' : 'Arms' }, { id: 'core', l: 'Core' },
                  { id: 'full_body', l: 'Full Body' }, { id: 'hiit', l: 'HIIT' },
                ].map((f) => {
                  const selected = genOpts.focus.includes(f.id);
                  return (
                    <button key={f.id} onClick={() => setGenOpts((o) => ({
                      ...o,
                      focus: selected ? o.focus.filter((x) => x !== f.id) : [...o.focus.filter((x) => x !== 'full_body'), f.id]
                    }))}
                      className="py-2 rounded-xl text-[10px] font-bold cursor-pointer border transition-colors"
                      style={{
                        background: selected ? '#7c5cfc20' : 'rgba(255,255,255,0.03)',
                        borderColor: selected ? '#7c5cfc55' : 'rgba(255,255,255,0.06)',
                        color: selected ? '#7c5cfc' : '#8b8fa3',
                      }}>{selected ? '✓ ' : ''}{f.l}</button>
                  );
                })}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-fit-dim font-bold mb-1">{hr ? 'TRAJANJE' : 'DURATION'}</div>
              <div className="flex gap-1">
                {['15', '20', '30', '45', '60'].map((d) => (
                  <button key={d} onClick={() => setGenOpts((o) => ({ ...o, duration: d }))}
                    className="flex-1 py-2 rounded-xl text-[10px] font-bold cursor-pointer border"
                    style={{
                      background: genOpts.duration === d ? '#00f0b520' : 'rgba(255,255,255,0.03)',
                      borderColor: genOpts.duration === d ? '#00f0b555' : 'rgba(255,255,255,0.06)',
                      color: genOpts.duration === d ? '#00f0b5' : '#8b8fa3',
                    }}>{d} min</button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] text-fit-dim font-bold mb-1">{hr ? 'INTENZITET' : 'INTENSITY'}</div>
              <div className="flex gap-1">
                {[
                  { id: 'light', l: hr ? '🌱 Lagano' : '🌱 Light' },
                  { id: 'medium', l: hr ? '⚡ Srednje' : '⚡ Medium' },
                  { id: 'hard', l: hr ? '🔥 Teško' : '🔥 Hard' },
                ].map((i) => (
                  <button key={i.id} onClick={() => setGenOpts((o) => ({ ...o, intensity: i.id }))}
                    className="flex-1 py-2 rounded-xl text-[10px] font-bold cursor-pointer border"
                    style={{
                      background: genOpts.intensity === i.id ? '#ff6b4a20' : 'rgba(255,255,255,0.03)',
                      borderColor: genOpts.intensity === i.id ? '#ff6b4a55' : 'rgba(255,255,255,0.06)',
                      color: genOpts.intensity === i.id ? '#ff6b4a' : '#8b8fa3',
                    }}>{i.l}</button>
                ))}
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setGenStep(0)} className="py-3 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                ← {hr ? 'Natrag' : 'Back'}
              </button>
              <button onClick={generateWorkout} disabled={genOpts.focus.length === 0}
                className="flex-1 py-3 rounded-xl text-sm font-black cursor-pointer border-none transition-all"
                style={{ background: genOpts.focus.length > 0 ? 'linear-gradient(135deg, #7c5cfc, #ff4d8d)' : 'rgba(255,255,255,0.04)', color: genOpts.focus.length > 0 ? '#fff' : '#4a4e62' }}>
                🤖 {hr ? 'Generiraj!' : 'Generate!'}
              </button>
            </div>
          </div>
        )}

        {genStep === 2 && (
          <div className="flex flex-col items-center gap-3 py-6">
            <div className="w-12 h-12 rounded-full border-[3px] border-fit-secondary border-t-transparent animate-spin-slow" />
            <div className="text-sm text-fit-secondary font-bold">{hr ? 'AI generira trening...' : 'AI generating workout...'}</div>
            <div className="text-[10px] text-fit-muted">{hr ? 'Prilagođavam tvojim ozljedama i ciljevima' : 'Adapting to your injuries and goals'}</div>
          </div>
        )}

        {genStep === 3 && generatedWorkout && (
          <div className="mt-3 animate-[fadeIn_0.3s_ease]">
            <div className="text-sm font-bold text-fit-accent mb-1">✅ {generatedWorkout.name}</div>
            <div className="text-[10px] text-fit-muted mb-2">⏱ {generatedWorkout.duration} min · 🔥 {generatedWorkout.calories} kcal · {generatedWorkout.exercises.length} {hr ? 'vježbi' : 'exercises'}</div>
            {generatedWorkout.exercises.map((ex, i) => (
              <div key={i} className="text-[11px] text-fit-muted py-0.5">
                • {ex.name} {ex.sets}×{ex.reps} {ex.weight ? `@ ${ex.weight}` : ''} {ex.note ? <span className="text-fit-warn">{ex.note}</span> : ''}
              </div>
            ))}
            <div className="flex gap-2 mt-3">
              <button onClick={() => startWorkout(generatedWorkout)}
                className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none"
                style={{ background: 'linear-gradient(135deg, #00f0b5, #3ea8ff)', color: '#000' }}>
                ▶ {hr ? 'Pokreni!' : 'Start!'}
              </button>
              <button onClick={() => { setGenStep(1); setGeneratedWorkout(null); }}
                className="py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                🔄 {hr ? 'Ponovno' : 'Retry'}
              </button>
            </div>
          </div>
        )}
      </Box>

      {/* Workout Suggestion (approve/reject) */}
      {suggestion && (
        <Box glow="#ffc233">
          <div className="flex items-start gap-2">
            <span className="text-xl">🤖</span>
            <div className="flex-1">
              <div className="text-xs text-fit-text leading-relaxed">{suggestion}</div>
              <div className="flex gap-2 mt-2">
                <button onClick={() => { setSuggestion(''); setGenStep(1); }}
                  className="py-2 px-4 rounded-xl text-[10px] font-bold cursor-pointer border-none"
                  style={{ background: 'linear-gradient(135deg, #00f0b5, #3ea8ff)', color: '#000' }}>
                  ✅ {hr ? 'Prihvaćam!' : 'Accept!'}
                </button>
                <button onClick={() => setSuggestion('')}
                  className="py-2 px-3 rounded-xl text-[10px] font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                  ❌ {hr ? 'Ne hvala' : 'No thanks'}
                </button>
                <button onClick={() => { setSuggestion(''); setGenOpts(o => ({ ...o, focus: [] })); setGenStep(1); }}
                  className="py-2 px-3 rounded-xl text-[10px] font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                  🔄 {hr ? 'Drugi prijedlog' : 'Different'}
                </button>
              </div>
            </div>
          </div>
        </Box>
      )}

      {/* GPS Running Map */}
      <RunningMap />

      {/* Sport-Specific Programs */}
      {profile?.sports?.length > 0 && (
        <Box>
          <Lbl icon="⚽" text={hr ? 'Sport-specifični programi' : 'Sport-specific programs'} />
          <div className="grid grid-cols-2 gap-2 mt-2">
            {(profile.sports as string[]).slice(0, 6).map((sport: string) => {
              const sportPrograms: Record<string, { name: string; exercises: string }> = {
                football: { name: hr ? '⚽ Nogomet' : '⚽ Football', exercises: hr ? 'Agilnost, sprint, core stability' : 'Agility, sprint, core stability' },
                basketball: { name: hr ? '🏀 Košarka' : '🏀 Basketball', exercises: hr ? 'Vertikalni skok, lateralni pokreti' : 'Vertical jump, lateral movement' },
                mma: { name: '🥊 MMA', exercises: hr ? 'Udaračka snaga, core, izdržljivost' : 'Striking power, core, endurance' },
                swimming: { name: hr ? '🏊 Plivanje' : '🏊 Swimming', exercises: hr ? 'Ramena, leđa, core rotacija' : 'Shoulders, back, core rotation' },
                running: { name: hr ? '🏃 Trčanje' : '🏃 Running', exercises: hr ? 'Noge, core, mobilnost' : 'Legs, core, mobility' },
                yoga: { name: '🧘 Yoga', exercises: hr ? 'Fleksibilnost, balans, disanje' : 'Flexibility, balance, breathing' },
                cycling: { name: hr ? '🚴 Biciklizam' : '🚴 Cycling', exercises: hr ? 'Quadriceps, hamstrings, core' : 'Quads, hamstrings, core' },
                tennis: { name: '🎾 Tenis', exercises: hr ? 'Rotacija, agilnost, podlaktice' : 'Rotation, agility, forearms' },
                gym: { name: hr ? '🏋️ Teretana' : '🏋️ Gym', exercises: hr ? 'Compound pokreti, izolacija' : 'Compound moves, isolation' },
                crossfit: { name: '🔗 CrossFit', exercises: hr ? 'Funkcionalni, WOD, Olympic lifts' : 'Functional, WOD, Olympic lifts' },
                calisthenics: { name: '🤸 Kalisthenika', exercises: hr ? 'Bodyweight, skills, progresije' : 'Bodyweight, skills, progressions' },
                hiking: { name: hr ? '🥾 Planinarenje' : '🥾 Hiking', exercises: hr ? 'Noge, izdržljivost, core' : 'Legs, endurance, core' },
              };
              const prog = sportPrograms[sport];
              if (!prog) return null;
              return (
                <button key={sport} onClick={() => { setGenOpts(o => ({ ...o, focus: [sport === 'running' ? 'legs' : sport === 'mma' ? 'full_body' : sport] })); setGenStep(1); }}
                  className="py-2.5 px-3 rounded-xl text-left cursor-pointer border border-fit-border/50 bg-white/[0.02] hover:border-fit-accent/30 transition-colors">
                  <div className="text-xs font-bold text-fit-text">{prog.name}</div>
                  <div className="text-[9px] text-fit-muted mt-0.5">{prog.exercises}</div>
                </button>
              );
            })}
          </div>
        </Box>
      )}

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

function generateFallbackWorkout(opts: any, prof: any): Workout {
  const focus = opts.focus || 'full_body';
  const dur = parseInt(opts.duration) || 30;
  const injuries = prof?.injuries || [];
  const hasKnee = injuries.some((i: string) => i.includes('knee'));
  const hasShoulder = injuries.some((i: string) => i.includes('shoulder'));
  const hasBack = injuries.some((i: string) => i.includes('back'));

  const exerciseDB: Record<string, Exercise[]> = {
    chest: [
      { name: 'Bench Press', sets: 4, reps: '8', weight: '70kg', rest: 90, done: false },
      { name: 'Incline DB Press', sets: 3, reps: '12', weight: '26kg', rest: 75, done: false },
      { name: 'Cable Fly', sets: 3, reps: '15', weight: '14kg', rest: 60, done: false },
      { name: 'Push-ups', sets: 3, reps: '15', rest: 45, done: false },
      { name: 'Dips', sets: 3, reps: '10', rest: 60, done: false, note: hasShoulder ? '⚠️ Smanjen ROM' : undefined },
    ],
    back: [
      { name: 'Pull-ups', sets: 4, reps: '8', rest: 90, done: false },
      { name: 'Barbell Row', sets: 3, reps: '10', weight: '60kg', rest: 75, done: false, note: hasBack ? '⚠️ Drži neutralnu kralježnicu' : undefined },
      { name: 'Lat Pulldown', sets: 3, reps: '12', weight: '55kg', rest: 60, done: false },
      { name: 'Face Pull', sets: 3, reps: '15', weight: '16kg', rest: 45, done: false },
      { name: 'Seated Cable Row', sets: 3, reps: '12', weight: '50kg', rest: 60, done: false },
    ],
    legs: [
      { name: hasKnee ? 'Leg Press' : 'Squat', sets: 4, reps: hasKnee ? '12' : '8', weight: hasKnee ? '120kg' : '80kg', rest: 120, done: false, note: hasKnee ? '⚠️ Prilagođeno za koljeno' : undefined },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', weight: '70kg', rest: 90, done: false },
      { name: hasKnee ? 'Leg Extension (lagan)' : 'Walking Lunges', sets: 3, reps: '12', weight: hasKnee ? '30kg' : '20kg', rest: 60, done: false },
      { name: 'Leg Curl', sets: 3, reps: '12', weight: '40kg', rest: 60, done: false },
      { name: 'Calf Raise', sets: 4, reps: '15', weight: '60kg', rest: 45, done: false },
    ],
    shoulders: [
      { name: hasShoulder ? 'Seated DB Press (lagan)' : 'Overhead Press', sets: 4, reps: hasShoulder ? '12' : '8', weight: hasShoulder ? '14kg' : '40kg', rest: 90, done: false },
      { name: 'Lateral Raise', sets: 3, reps: '15', weight: '10kg', rest: 45, done: false },
      { name: 'Face Pull', sets: 3, reps: '15', weight: '16kg', rest: 45, done: false },
      { name: 'Reverse Fly', sets: 3, reps: '15', weight: '8kg', rest: 45, done: false },
    ],
    full_body: [
      { name: hasKnee ? 'Leg Press' : 'Squat', sets: 3, reps: '8', weight: '70kg', rest: 90, done: false },
      { name: 'Bench Press', sets: 3, reps: '8', weight: '60kg', rest: 90, done: false },
      { name: 'Barbell Row', sets: 3, reps: '10', weight: '55kg', rest: 75, done: false },
      { name: 'Overhead Press', sets: 3, reps: '10', weight: '35kg', rest: 75, done: false },
      { name: 'Romanian Deadlift', sets: 3, reps: '10', weight: '60kg', rest: 75, done: false },
      { name: 'Plank', sets: 3, reps: '45s', rest: 45, done: false },
    ],
    hiit: [
      { name: 'Burpees', sets: 4, reps: '12', rest: 30, done: false },
      { name: hasKnee ? 'Mountain Climbers' : 'Jump Squats', sets: 4, reps: '15', rest: 30, done: false },
      { name: 'Kettlebell Swings', sets: 4, reps: '15', weight: '16kg', rest: 30, done: false },
      { name: 'Battle Ropes', sets: 4, reps: '30s', rest: 30, done: false },
      { name: 'Box Jumps', sets: 4, reps: '10', rest: 30, done: false, note: hasKnee ? '⚠️ Zamijeni step-upom' : undefined },
    ],
    arms: [
      { name: 'Barbell Curl', sets: 3, reps: '10', weight: '30kg', rest: 60, done: false },
      { name: 'Tricep Pushdown', sets: 3, reps: '12', weight: '25kg', rest: 60, done: false },
      { name: 'Hammer Curl', sets: 3, reps: '12', weight: '14kg', rest: 45, done: false },
      { name: 'Overhead Tricep Extension', sets: 3, reps: '12', weight: '18kg', rest: 45, done: false },
      { name: 'Preacher Curl', sets: 3, reps: '10', weight: '25kg', rest: 60, done: false },
    ],
    core: [
      { name: 'Plank', sets: 3, reps: '60s', rest: 45, done: false },
      { name: 'Hanging Leg Raise', sets: 3, reps: '12', rest: 60, done: false },
      { name: 'Cable Woodchop', sets: 3, reps: '12/strana', weight: '15kg', rest: 45, done: false },
      { name: 'Ab Wheel Rollout', sets: 3, reps: '10', rest: 60, done: false, note: hasBack ? '⚠️ Smanjen ROM' : undefined },
      { name: 'Pallof Press', sets: 3, reps: '12/strana', weight: '12kg', rest: 45, done: false },
    ],
  };

  const focusNames: Record<string, string> = {
    chest: 'Push — Prsa & Triceps', back: 'Pull — Leđa & Biceps', legs: 'Noge & Gluteus',
    shoulders: 'Ramena & Gornji dio', full_body: 'Full Body', hiit: 'HIIT Circuit',
    arms: 'Ruke — Biceps & Triceps', core: 'Core & Trbuh',
  };

  const exs = (exerciseDB[focus] || exerciseDB.full_body).slice(0, dur <= 20 ? 4 : dur <= 30 ? 5 : 6);

  return {
    id: `gen_${Date.now()}`,
    name: focusNames[focus] || 'Personalizirani trening',
    duration: dur,
    calories: dur * 8,
    muscles: focus === 'full_body' ? ['Sve grupe'] : [focusNames[focus]?.split(' ')[0] || focus],
    exercises: exs,
  };
}
