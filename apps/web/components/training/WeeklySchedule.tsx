'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';
import ExerciseDemo from './ExerciseDemo';
import { getAllExercises, filterExercises, getExerciseById, muscleGroupLabels, equipmentLabels, type ExerciseInfo, type MuscleGroup, type Equipment, type Difficulty } from '@/lib/constants/exerciseDB';

interface ScheduleExercise {
  exerciseId: string;
  name: string;
  sets: number;
  reps: string;
  weight?: string;
  rest: number;
  done: boolean;
}

interface DayPlan {
  name: string;
  exercises: ScheduleExercise[];
  restDay: boolean;
}

type WeekPlan = Record<string, DayPlan>;

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;
const DAY_LABELS: Record<string, { hr: string; en: string }> = {
  mon: { hr: 'Pon', en: 'Mon' }, tue: { hr: 'Uto', en: 'Tue' }, wed: { hr: 'Sri', en: 'Wed' },
  thu: { hr: 'Čet', en: 'Thu' }, fri: { hr: 'Pet', en: 'Fri' }, sat: { hr: 'Sub', en: 'Sat' }, sun: { hr: 'Ned', en: 'Sun' },
};

const STORE_KEY = 'fit-weekly-plan';

function loadPlan(): WeekPlan {
  try {
    const saved = localStorage.getItem(STORE_KEY);
    if (saved) return JSON.parse(saved);
  } catch {}
  // Default empty plan
  const plan: WeekPlan = {};
  for (const d of DAYS) plan[d] = { name: '', exercises: [], restDay: d === 'sun' };
  return plan;
}

function savePlan(plan: WeekPlan) {
  localStorage.setItem(STORE_KEY, JSON.stringify(plan));
}

export default function WeeklySchedule() {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [plan, setPlan] = useState<WeekPlan>(loadPlan);
  const [selectedDay, setSelectedDay] = useState<string>('mon');
  const [showBrowser, setShowBrowser] = useState(false);
  const [showDemo, setShowDemo] = useState<ExerciseInfo | null>(null);
  const [generating, setGenerating] = useState(false);

  // Filters
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup[]>([]);
  const [filterEquip, setFilterEquip] = useState<Equipment[]>([]);
  const [filterDiff, setFilterDiff] = useState<Difficulty[]>([]);
  const [filterSearch, setFilterSearch] = useState('');

  // Save on change
  useEffect(() => { savePlan(plan); }, [plan]);

  const updateDay = (day: string, update: Partial<DayPlan>) => {
    setPlan((p) => ({ ...p, [day]: { ...p[day], ...update } }));
  };

  const addExerciseToPlan = (ex: ExerciseInfo) => {
    const entry: ScheduleExercise = {
      exerciseId: ex.id, name: hr ? ex.nameHr : ex.name,
      sets: ex.defaultSets, reps: ex.defaultReps, rest: ex.defaultRest, done: false,
    };
    updateDay(selectedDay, { exercises: [...plan[selectedDay].exercises, entry] });
    setShowBrowser(false);
  };

  const removeExercise = (day: string, idx: number) => {
    updateDay(day, { exercises: plan[day].exercises.filter((_, i) => i !== idx) });
  };

  const filteredExercises = filterExercises({
    muscles: filterMuscle.length > 0 ? filterMuscle : undefined,
    equipment: filterEquip.length > 0 ? filterEquip : undefined,
    difficulty: filterDiff.length > 0 ? filterDiff : undefined,
    search: filterSearch || undefined,
    avoidInjuries: (() => { try { return JSON.parse(localStorage.getItem('fit-profile') || '{}').injuries; } catch { return []; } })(),
  });

  // AI Generate Full Week
  const generateWeekPlan = async () => {
    setGenerating(true);
    let profile: any = {};
    try { profile = JSON.parse(localStorage.getItem('fit-profile') || '{}'); } catch {}

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: `Napravi tjedni plan treninga. Podaci: cilj=${profile.goal || 'gain'}, razina=${profile.level || 'mid'}, ozljede=${(profile.injuries || []).join(',')}, oprema=${(profile.equipment || []).join(',')}, dana=${profile.trainingDays || '5'}, vrijeme=${profile.trainingTime || '45'}min.

ODGOVORI U JSON FORMATU:
{"mon":{"name":"Push","exercises":["bench_press","incline_db_press","cable_fly","lateral_raise","tricep_pushdown"]},"tue":{"name":"Pull","exercises":["pullup","barbell_row","face_pull","barbell_curl","hammer_curl"]},"wed":{"name":"Legs","exercises":["squat","rdl","leg_press","leg_curl","calf_raise"]},"thu":{"name":"Rest","exercises":[]},"fri":{"name":"Upper","exercises":["bench_press","barbell_row","ohp","barbell_curl","tricep_pushdown"]},"sat":{"name":"Lower+Core","exercises":["squat","hip_thrust","lunge","plank","russian_twist"]},"sun":{"name":"Rest","exercises":[]}}

Koristi ISKLJUČIVO ove exercise ID-ove: ${getAllExercises().slice(0, 200).map(e => e.id).join(',')}`,
          history: [], locale, trainerPrompt: 'Ti si fitness AI. Odgovori SAMO JSON.',
        }),
      });
      const data = await res.json();
      const jsonMatch = data.text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        const newPlan: WeekPlan = {};
        for (const d of DAYS) {
          const dayData = parsed[d];
          if (dayData && dayData.exercises) {
            const exs: ScheduleExercise[] = dayData.exercises
              .map((id: string) => {
                const ex = getExerciseById(id);
                if (!ex) return null;
                return { exerciseId: ex.id, name: hr ? ex.nameHr : ex.name, sets: ex.defaultSets, reps: ex.defaultReps, rest: ex.defaultRest, done: false };
              })
              .filter(Boolean);
            newPlan[d] = { name: dayData.name || '', exercises: exs, restDay: exs.length === 0 };
          } else {
            newPlan[d] = { name: hr ? 'Odmor' : 'Rest', exercises: [], restDay: true };
          }
        }
        setPlan(newPlan);
      }
    } catch {}
    // Fallback — use preset plan
    if (!plan.mon.exercises.length) {
      const preset: WeekPlan = {
        mon: { name: 'Push', restDay: false, exercises: ['Barbell_Bench_Press_-_Medium_Grip', 'Barbell_Incline_Bench_Press_-_Medium_Grip', 'Dumbbell_Flyes', 'Side_Lateral_Raise', 'Triceps_Pushdown'].map((id) => { const e = getExerciseById(id) || { nameHr: id, name: id, defaultSets: 3, defaultReps: '10', defaultRest: 60 } as any; return { exerciseId: id, name: e.name, sets: e.defaultSets, reps: e.defaultReps, rest: e.defaultRest, done: false }; }) },
        tue: { name: 'Pull', restDay: false, exercises: ['Pullups', 'Bent_Over_Barbell_Row', 'Wide-Grip_Lat_Pulldown', 'Face_Pull', 'Barbell_Curl', 'Alternate_Hammer_Curl'].map((id) => { const e = getExerciseById(id) || { nameHr: id, name: id, defaultSets: 3, defaultReps: '10', defaultRest: 60 } as any; return { exerciseId: id, name: e.name, sets: e.defaultSets, reps: e.defaultReps, rest: e.defaultRest, done: false }; }) },
        wed: { name: hr ? 'Noge' : 'Legs', restDay: false, exercises: ['Barbell_Squat', 'Romanian_Deadlift_With_Dumbbells', 'Leg_Press', 'Lying_Leg_Curls', 'Standing_Calf_Raises', 'Barbell_Hip_Thrust'].map((id) => { const e = getExerciseById(id) || { nameHr: id, name: id, defaultSets: 3, defaultReps: '10', defaultRest: 60 } as any; return { exerciseId: id, name: e.name, sets: e.defaultSets, reps: e.defaultReps, rest: e.defaultRest, done: false }; }) },
        thu: { name: hr ? 'Odmor' : 'Rest', restDay: true, exercises: [] },
        fri: { name: 'Upper', restDay: false, exercises: ['Standing_Military_Press', 'One-Arm_Dumbbell_Row', 'Arnold_Dumbbell_Press', 'Lying_Triceps_Press', 'Preacher_Curl'].map((id) => { const e = getExerciseById(id) || { nameHr: id, name: id, defaultSets: 3, defaultReps: '10', defaultRest: 60 } as any; return { exerciseId: id, name: e.name, sets: e.defaultSets, reps: e.defaultReps, rest: e.defaultRest, done: false }; }) },
        sat: { name: 'HIIT + Core', restDay: false, exercises: ['Burpee', 'Kettlebell_Sumo_Deadlift_High_Pull', 'Mountain_Climbers', 'Plank', 'Spell_Caster'].map((id) => { const e = getExerciseById(id) || { nameHr: id, name: id, defaultSets: 3, defaultReps: '10', defaultRest: 60 } as any; return { exerciseId: id, name: e.name, sets: e.defaultSets, reps: e.defaultReps, rest: e.defaultRest, done: false }; }) },
        sun: { name: hr ? 'Odmor' : 'Rest', restDay: true, exercises: [] },
      };
      setPlan(preset);
    }
    setGenerating(false);
  };

  const dayPlan = plan[selectedDay];

  return (
    <>
      {showDemo && <ExerciseDemo exercise={showDemo} onClose={() => setShowDemo(null)} />}

      {/* Week Day Selector */}
      <Box glow="#7c5cfc">
        <div className="flex justify-between items-center mb-2">
          <Lbl icon="📅" text={hr ? 'Tjedni raspored' : 'Weekly schedule'} color="#7c5cfc" />
          <button onClick={generateWeekPlan} disabled={generating}
            className="text-[9px] py-1 px-2.5 rounded-lg font-bold cursor-pointer border-none"
            style={{ background: 'linear-gradient(135deg, #7c5cfc, #ff4d8d)', color: '#fff', opacity: generating ? 0.5 : 1 }}>
            {generating ? '🤖 ...' : `🤖 AI ${hr ? 'generiraj' : 'generate'}`}
          </button>
        </div>

        <div className="flex gap-1">
          {DAYS.map((d) => {
            const dp = plan[d];
            const active = selectedDay === d;
            const hasExercises = dp.exercises.length > 0;
            return (
              <button key={d} onClick={() => setSelectedDay(d)}
                className="flex-1 py-2 rounded-xl flex flex-col items-center gap-0.5 cursor-pointer border transition-all"
                style={{
                  background: active ? '#7c5cfc20' : dp.restDay ? 'rgba(255,255,255,0.01)' : hasExercises ? '#00f0b508' : 'rgba(255,255,255,0.03)',
                  borderColor: active ? '#7c5cfc55' : 'rgba(255,255,255,0.06)',
                }}>
                <span className="text-[9px] font-bold" style={{ color: active ? '#7c5cfc' : '#8b8fa3' }}>
                  {hr ? DAY_LABELS[d].hr : DAY_LABELS[d].en}
                </span>
                {dp.restDay ? (
                  <span className="text-[8px] text-fit-dim">😴</span>
                ) : hasExercises ? (
                  <span className="text-[8px]" style={{ color: '#00f0b5' }}>{dp.exercises.length}💪</span>
                ) : (
                  <span className="text-[8px] text-fit-dim">-</span>
                )}
              </button>
            );
          })}
        </div>
      </Box>

      {/* Selected Day Detail */}
      <Box>
        <div className="flex justify-between items-center mb-2">
          <div>
            <input value={dayPlan.name} onChange={(e) => updateDay(selectedDay, { name: e.target.value })}
              placeholder={hr ? 'Naziv treninga...' : 'Workout name...'}
              className="bg-transparent border-none text-sm font-bold text-fit-text outline-none font-outfit w-40" />
            <div className="text-[10px] text-fit-muted">{dayPlan.exercises.length} {hr ? 'vježbi' : 'exercises'}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={() => updateDay(selectedDay, { restDay: !dayPlan.restDay })}
              className="text-[9px] py-1 px-2 rounded-lg cursor-pointer border border-fit-border text-fit-muted"
              style={{ background: dayPlan.restDay ? '#ffc23320' : 'transparent', color: dayPlan.restDay ? '#ffc233' : '#8b8fa3' }}>
              😴 {hr ? (dayPlan.restDay ? 'Aktivan' : 'Odmor') : (dayPlan.restDay ? 'Active' : 'Rest')}
            </button>
          </div>
        </div>

        {dayPlan.restDay ? (
          <div className="text-center py-6 text-fit-dim">
            <div className="text-3xl mb-2">😴</div>
            <div className="text-sm">{hr ? 'Dan odmora — oporavak' : 'Rest day — recovery'}</div>
          </div>
        ) : (
          <>
            {/* Exercise list */}
            {dayPlan.exercises.map((ex, i) => {
              const exInfo = getExerciseById(ex.exerciseId);
              const exImgs = exInfo?.images;
              return (
                <div key={i} className="flex items-center gap-2 py-2 px-2 rounded-xl mb-1 bg-white/[0.02] border border-fit-border/30 group hover:border-fit-accent/30 transition-colors">
                  {/* Thumbnail — click opens GIF demo */}
                  <div className="shrink-0 cursor-pointer" onClick={() => exInfo && setShowDemo(exInfo)}>
                    {exImgs && exImgs[0] ? (
                      <div className="w-11 h-11 rounded-lg bg-white overflow-hidden relative">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={exImgs[0]} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs">▶</span>
                        </div>
                      </div>
                    ) : (
                      <div className="w-11 h-11 rounded-lg bg-white/[0.04] flex items-center justify-center text-base">🏋️</div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => exInfo && setShowDemo(exInfo)}>
                    <div className="text-xs font-bold text-fit-text truncate">{ex.name}</div>
                    <div className="flex gap-2 items-center">
                      <input value={ex.sets} onChange={(e) => {
                        const exs = [...dayPlan.exercises];
                        exs[i] = { ...exs[i], sets: parseInt(e.target.value) || 0 };
                        updateDay(selectedDay, { exercises: exs });
                      }} className="w-8 bg-white/[0.04] border border-fit-border rounded py-0.5 px-1 text-fit-text text-[10px] text-center outline-none" />
                      <span className="text-[10px] text-fit-dim">×</span>
                      <input value={ex.reps} onChange={(e) => {
                        const exs = [...dayPlan.exercises];
                        exs[i] = { ...exs[i], reps: e.target.value };
                        updateDay(selectedDay, { exercises: exs });
                      }} className="w-12 bg-white/[0.04] border border-fit-border rounded py-0.5 px-1 text-fit-text text-[10px] text-center outline-none" />
                      {ex.weight !== undefined && (
                        <input value={ex.weight} onChange={(e) => {
                          const exs = [...dayPlan.exercises];
                          exs[i] = { ...exs[i], weight: e.target.value };
                          updateDay(selectedDay, { exercises: exs });
                        }} placeholder="kg" className="w-14 bg-white/[0.04] border border-fit-border rounded py-0.5 px-1 text-fit-text text-[10px] text-center outline-none" />
                      )}
                    </div>
                  </div>
                  {exInfo && <button onClick={() => setShowDemo(exInfo)} className="text-[10px] text-fit-blue cursor-pointer bg-transparent border-none">📹</button>}
                  <button onClick={() => removeExercise(selectedDay, i)} className="text-[10px] text-fit-warn cursor-pointer bg-transparent border-none opacity-0 group-hover:opacity-100 transition-opacity">✕</button>
                </div>
              );
            })}

            {/* Add exercise button */}
            <button onClick={() => setShowBrowser(true)}
              className="w-full mt-2 py-3 rounded-xl text-xs font-bold cursor-pointer border-2 border-dashed border-fit-border text-fit-muted hover:border-fit-accent/30 hover:text-fit-accent transition-colors bg-transparent">
              + {hr ? 'Dodaj vježbu' : 'Add exercise'}
            </button>
          </>
        )}
      </Box>

      {/* Exercise Browser Modal */}
      {showBrowser && (
        <div className="fixed inset-0 z-40 bg-black/80 backdrop-blur-sm flex items-end justify-center" onClick={() => setShowBrowser(false)}>
          <div className="w-full max-w-[430px] max-h-[80vh] bg-fit-bg rounded-t-3xl border-t border-fit-border overflow-hidden" onClick={(e) => e.stopPropagation()}>
            <div className="p-4">
              <div className="flex justify-between items-center mb-3">
                <div className="text-sm font-bold text-fit-text">{hr ? 'Baza vježbi' : 'Exercise Library'} ({filteredExercises.length})</div>
                <button onClick={() => setShowBrowser(false)} className="text-fit-muted text-lg cursor-pointer bg-transparent border-none">✕</button>
              </div>

              {/* Search */}
              <input value={filterSearch} onChange={(e) => setFilterSearch(e.target.value)}
                placeholder={hr ? '🔍 Pretraži vježbe...' : '🔍 Search exercises...'}
                className="w-full bg-white/[0.04] border border-fit-border rounded-xl py-2 px-3 text-fit-text text-xs outline-none mb-3" />

              {/* Muscle filter */}
              <div className="flex gap-1 flex-wrap mb-2">
                {(Object.keys(muscleGroupLabels) as MuscleGroup[]).map((m) => (
                  <button key={m} onClick={() => setFilterMuscle((f) => f.includes(m) ? f.filter((x) => x !== m) : [...f, m])}
                    className="text-[8px] py-0.5 px-1.5 rounded-full cursor-pointer border transition-colors"
                    style={{
                      background: filterMuscle.includes(m) ? '#00f0b520' : 'transparent',
                      borderColor: filterMuscle.includes(m) ? '#00f0b555' : 'rgba(255,255,255,0.06)',
                      color: filterMuscle.includes(m) ? '#00f0b5' : '#8b8fa3',
                    }}>{hr ? muscleGroupLabels[m].hr : muscleGroupLabels[m].en}</button>
                ))}
              </div>

              {/* Equipment filter */}
              <div className="flex gap-1 flex-wrap mb-3">
                {(['bodyweight', 'barbell', 'dumbbell', 'cable', 'machine', 'kettlebell', 'band'] as Equipment[]).map((eq) => (
                  <button key={eq} onClick={() => setFilterEquip((f) => f.includes(eq) ? f.filter((x) => x !== eq) : [...f, eq])}
                    className="text-[8px] py-0.5 px-1.5 rounded-full cursor-pointer border transition-colors"
                    style={{
                      background: filterEquip.includes(eq) ? '#3ea8ff20' : 'transparent',
                      borderColor: filterEquip.includes(eq) ? '#3ea8ff55' : 'rgba(255,255,255,0.06)',
                      color: filterEquip.includes(eq) ? '#3ea8ff' : '#8b8fa3',
                    }}>{equipmentLabels[eq].emoji} {hr ? equipmentLabels[eq].hr : equipmentLabels[eq].en}</button>
                ))}
              </div>
            </div>

            {/* Exercise list */}
            <div className="overflow-auto px-4 pb-6" style={{ maxHeight: '50vh' }}>
              {filteredExercises.map((ex) => {
                const imgs = (ex as any).images as string[] | undefined;
                return (
                  <div key={ex.id} className="flex items-center gap-2 py-2 px-2 rounded-xl mb-1 bg-white/[0.02] border border-fit-border/30 cursor-pointer hover:border-fit-accent/30 transition-colors"
                    onClick={() => addExerciseToPlan(ex)}>
                    {/* Thumbnail */}
                    {imgs && imgs[0] ? (
                      <div className="w-12 h-12 rounded-lg bg-white overflow-hidden shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imgs[0]} alt="" className="w-full h-full object-cover" onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                      </div>
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-white/[0.04] flex items-center justify-center text-lg shrink-0">🏋️</div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-[11px] font-bold text-fit-text truncate">{hr ? ex.nameHr : ex.name}</div>
                      <div className="flex gap-1 mt-0.5 flex-wrap">
                        {(ex.primary as string[]).slice(0, 2).map((m) => (
                          <span key={m} className="text-[7px] py-0.5 px-1 rounded-full bg-fit-accent/10 text-fit-accent">{muscleGroupLabels[m as keyof typeof muscleGroupLabels]?.[hr ? 'hr' : 'en'] || m}</span>
                        ))}
                        <span className="text-[7px] text-fit-dim">{ex.defaultSets}×{ex.defaultReps}</span>
                      </div>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); setShowDemo(ex); }} className="text-[10px] text-fit-blue cursor-pointer bg-transparent border-none">📹</button>
                    <span className="text-fit-accent text-lg">+</span>
                  </div>
                );
              })}
              {filteredExercises.length === 0 && (
                <div className="text-center py-6 text-fit-dim text-xs">{hr ? 'Nema rezultata' : 'No results'}</div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
