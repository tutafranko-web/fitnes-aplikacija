'use client';

import { useState, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import { trainers, matchTrainer, type Trainer } from '@/lib/constants/trainers';

interface UserProfile {
  name: string;
  age: string;
  gender: string;
  goal: string;
  level: string;
  sports: string[];
  injuries: string[];
  injuryDiagnosis: string;
  equipment: string[];
  trainingTime: string;
  trainingDays: string;
  weight: string;
  height: string;
  targetWeight: string;
  sleepHours: string;
  stressLevel: string;
  dna: string;
  bodyPhoto: string | null;
  trainerId: string;
}

const TOTAL_STEPS = 16;

const stepMoods: Record<number, { emoji: string; color: string }> = {
  0: { emoji: '👋', color: '#00f0b5' },
  1: { emoji: '🎂', color: '#3ea8ff' },
  2: { emoji: '👤', color: '#7c5cfc' },
  3: { emoji: '🎯', color: '#ff6b4a' },
  4: { emoji: '💪', color: '#7c5cfc' },
  5: { emoji: '⚽', color: '#3ea8ff' },
  6: { emoji: '🤕', color: '#ffc233' },
  7: { emoji: '📋', color: '#ff4d8d' },
  8: { emoji: '🏋️', color: '#00f0b5' },
  9: { emoji: '⏱️', color: '#7c5cfc' },
  10: { emoji: '📅', color: '#3ea8ff' },
  11: { emoji: '⚖️', color: '#ff6b4a' },
  12: { emoji: '📏', color: '#00f0b5' },
  13: { emoji: '😴', color: '#7c5cfc' },
  14: { emoji: '📸', color: '#ff4d8d' },
  15: { emoji: '🤖', color: '#00f0b5' },
};

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const [step, setStep] = useState(0);
  const fileRef = useRef<HTMLInputElement>(null);
  const [matchedTrainers, setMatchedTrainers] = useState<Trainer[]>([]);
  const [profile, setProfile] = useState<UserProfile>({
    name: '', age: '', gender: '', goal: '', level: '', sports: [], injuries: [],
    injuryDiagnosis: '', equipment: [], trainingTime: '', trainingDays: '',
    weight: '', height: '', targetWeight: '', sleepHours: '', stressLevel: '',
    dna: '', bodyPhoto: null, trainerId: '',
  });

  const update = (key: keyof UserProfile, val: any) => setProfile((p) => ({ ...p, [key]: val }));
  const toggleArray = (key: 'sports' | 'injuries' | 'equipment', val: string) => {
    setProfile((p) => {
      const arr = p[key] as string[];
      if (key === 'injuries' && val === 'none') return { ...p, [key]: ['none'] };
      const filtered = arr.filter((v) => v !== 'none');
      return { ...p, [key]: filtered.includes(val) ? filtered.filter((v) => v !== val) : [...filtered, val] };
    });
  };

  const canNext = () => {
    switch (step) {
      case 0: return profile.name.trim().length > 0;
      case 1: return profile.age.trim().length > 0;
      case 2: return !!profile.gender;
      case 3: return !!profile.goal;
      case 4: return !!profile.level;
      case 5: return profile.sports.length > 0;
      case 6: return profile.injuries.length > 0;
      case 7: return true; // diagnosis is optional
      case 8: return profile.equipment.length > 0;
      case 9: return !!profile.trainingTime;
      case 10: return !!profile.trainingDays;
      case 11: return profile.weight.trim().length > 0 && profile.height.trim().length > 0;
      case 12: return true; // target weight optional
      case 13: return !!profile.sleepHours;
      case 14: return true; // photo optional
      case 15: return !!profile.trainerId;
      default: return false;
    }
  };

  const next = () => {
    if (step === 13) {
      // Before photo step, calculate matched trainers
      const matched = matchTrainer({
        goal: profile.goal, level: profile.level,
        sports: profile.sports, injuries: profile.injuries,
      });
      setMatchedTrainers(matched);
    }
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else onComplete(profile);
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) update('bodyPhoto', URL.createObjectURL(f));
  };

  const mood = stepMoods[step] || { emoji: '💪', color: '#00f0b5' };

  const SingleSelect = ({ options, value, onChange }: { options: Record<string, string>; value: string; onChange: (v: string) => void }) => (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {Object.entries(options).map(([key, label]) => (
        <button key={key} onClick={() => onChange(key)}
          className="py-3 px-3 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 border text-left"
          style={{
            background: value === key ? `${mood.color}15` : 'rgba(255,255,255,0.03)',
            borderColor: value === key ? `${mood.color}55` : 'rgba(255,255,255,0.06)',
            color: value === key ? mood.color : '#8b8fa3',
            boxShadow: value === key ? `0 0 20px ${mood.color}15` : 'none',
          }}>{label}</button>
      ))}
    </div>
  );

  const MultiSelect = ({ options, values, onToggle }: { options: Record<string, string>; values: string[]; onToggle: (v: string) => void }) => (
    <div className="grid grid-cols-2 gap-2 mt-3">
      {Object.entries(options).map(([key, label]) => {
        const sel = values.includes(key);
        return (
          <button key={key} onClick={() => onToggle(key)}
            className="py-3 px-3 rounded-2xl text-[13px] font-bold cursor-pointer transition-all duration-200 border text-left"
            style={{
              background: sel ? `${mood.color}15` : 'rgba(255,255,255,0.03)',
              borderColor: sel ? `${mood.color}55` : 'rgba(255,255,255,0.06)',
              color: sel ? mood.color : '#8b8fa3',
            }}>{sel ? '✓ ' : ''}{label}</button>
        );
      })}
    </div>
  );

  const hr = locale === 'hr';

  const injuryOptions: Record<string, string> = {
    none: hr ? 'Nemam ozljede ✅' : 'No injuries ✅',
    knee_acl: hr ? 'Koljeno — ACL/meniskus' : 'Knee — ACL/meniscus',
    knee_general: hr ? 'Koljeno — opća bol' : 'Knee — general pain',
    lower_back: hr ? 'Donja leđa — diskus/lumbar' : 'Lower back — disc/lumbar',
    upper_back: hr ? 'Gornja leđa — thorakalni' : 'Upper back — thoracic',
    shoulder_rotator: hr ? 'Rame — rotator cuff' : 'Shoulder — rotator cuff',
    shoulder_impingement: hr ? 'Rame — impingement' : 'Shoulder — impingement',
    wrist: hr ? 'Zapešće — tendinitis' : 'Wrist — tendinitis',
    elbow_tennis: hr ? 'Lakat — teniski lakat' : 'Elbow — tennis elbow',
    elbow_golfer: hr ? 'Lakat — golferski lakat' : 'Elbow — golfer elbow',
    ankle_sprain: hr ? 'Gležanj — uganuće' : 'Ankle — sprain',
    ankle_achilles: hr ? 'Ahilova tetiva' : 'Achilles tendon',
    hip_flexor: hr ? 'Kuk — fleksori' : 'Hip — flexors',
    hip_labrum: hr ? 'Kuk — labrum' : 'Hip — labrum',
    neck_cervical: hr ? 'Vrat — cervikalni' : 'Neck — cervical',
    shin_splints: hr ? 'Potkoljenica — shin splints' : 'Shin splints',
    plantar: hr ? 'Stopalo — plantarni fasciitis' : 'Plantar fasciitis',
    hernia: hr ? 'Hernija' : 'Hernia',
    sciatica: hr ? 'Išijas' : 'Sciatica',
    other: hr ? 'Drugo (upiši dolje)' : 'Other (type below)',
  };

  const renderStep = () => {
    switch (step) {
      case 0: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Kako se zoveš?' : "What's your name?"}</h2>
          <p className="text-xs text-fit-muted mb-3">{hr ? 'Tvoj trener te želi upoznati' : 'Your trainer wants to know you'}</p>
          <input value={profile.name} onChange={(e) => update('name', e.target.value)} placeholder={hr ? 'Tvoje ime' : 'Your name'}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-lg outline-none font-outfit focus:border-fit-accent/40 transition-colors" autoFocus />
        </div>
      );
      case 1: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koliko imaš godina?' : 'How old are you?'}</h2>
          <input type="number" value={profile.age} onChange={(e) => update('age', e.target.value)} placeholder={hr ? 'Godine' : 'Age'}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-3xl font-black outline-none font-outfit text-center mt-3" />
        </div>
      );
      case 2: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Spol' : 'Gender'}</h2>
          <SingleSelect options={{ male: hr ? 'Muško 🙋‍♂️' : 'Male 🙋‍♂️', female: hr ? 'Žensko 🙋‍♀️' : 'Female 🙋‍♀️', other: hr ? 'Drugo 🌈' : 'Other 🌈' }} value={profile.gender} onChange={(v) => update('gender', v)} />
        </div>
      );
      case 3: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koji ti je cilj?' : "What's your goal?"}</h2>
          <SingleSelect options={{
            lose: hr ? 'Mršavljenje 🔥' : 'Lose weight 🔥',
            gain: hr ? 'Dobivanje mišića 💪' : 'Build muscle 💪',
            maintain: hr ? 'Održavanje ⚖️' : 'Maintain ⚖️',
            health: hr ? 'Zdravlje & Oporavak ❤️' : 'Health & Recovery ❤️',
          }} value={profile.goal} onChange={(v) => update('goal', v)} />
        </div>
      );
      case 4: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Tvoja razina iskustva?' : 'Your experience level?'}</h2>
          <SingleSelect options={{
            beginner: hr ? 'Početnik 🌱 (0-6 mj)' : 'Beginner 🌱 (0-6 mo)',
            mid: hr ? 'Srednji ⚡ (6mj-2g)' : 'Intermediate ⚡ (6mo-2y)',
            advanced: hr ? 'Napredni 🏆 (2-5g)' : 'Advanced 🏆 (2-5y)',
            pro: hr ? 'Profesionalac 👑 (5g+)' : 'Professional 👑 (5y+)',
          }} value={profile.level} onChange={(v) => update('level', v)} />
        </div>
      );
      case 5: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koji sportovi te zanimaju?' : 'Which sports interest you?'}</h2>
          <MultiSelect options={{
            gym: hr ? 'Teretana 🏋️' : 'Gym 🏋️', running: hr ? 'Trčanje 🏃' : 'Running 🏃',
            mma: hr ? 'MMA/Boks 🥊' : 'MMA/Boxing 🥊', football: hr ? 'Nogomet ⚽' : 'Football ⚽',
            basketball: hr ? 'Košarka 🏀' : 'Basketball 🏀', swimming: hr ? 'Plivanje 🏊' : 'Swimming 🏊',
            yoga: hr ? 'Yoga 🧘' : 'Yoga 🧘', crossfit: 'CrossFit 🔗',
            cycling: hr ? 'Biciklizam 🚴' : 'Cycling 🚴', tennis: hr ? 'Tenis 🎾' : 'Tennis 🎾',
            calisthenics: hr ? 'Kalisthenika 🤸' : 'Calisthenics 🤸', hiking: hr ? 'Planinarenje 🥾' : 'Hiking 🥾',
          }} values={profile.sports} onToggle={(v) => toggleArray('sports', v)} />
        </div>
      );
      case 6: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Imaš li ozljede ili bolove?' : 'Do you have any injuries or pain?'}</h2>
          <p className="text-xs text-fit-muted mb-1">{hr ? 'Odaberi sve što se odnosi na tebe' : 'Select all that apply'}</p>
          <MultiSelect options={injuryOptions} values={profile.injuries} onToggle={(v) => toggleArray('injuries', v)} />
        </div>
      );
      case 7: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Dijagnoza / Detalji ozljede' : 'Diagnosis / Injury Details'}</h2>
          <p className="text-xs text-fit-muted mb-3">{hr ? 'Upiši točnu dijagnozu ako imaš (opcionalno). AI trener će prilagoditi sve vježbe.' : 'Enter exact diagnosis if you have one (optional). AI trainer will adapt all exercises.'}</p>
          <textarea
            value={profile.injuryDiagnosis}
            onChange={(e) => update('injuryDiagnosis', e.target.value)}
            placeholder={hr ? 'Npr: Ruptura prednjeg križnog ligamenta (ACL) desno koljeno, operiran 2024. Fizioterapija završena.' : 'E.g.: Anterior cruciate ligament (ACL) tear right knee, surgery 2024. Physiotherapy completed.'}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-sm outline-none font-outfit focus:border-fit-accent/40 transition-colors h-32 resize-none"
          />
        </div>
      );
      case 8: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koja oprema ti je dostupna?' : 'What equipment do you have?'}</h2>
          <MultiSelect options={{
            full_gym: hr ? 'Puna teretana 🏢' : 'Full gym 🏢', home: hr ? 'Kuća osnovno 🏠' : 'Home basics 🏠',
            dumbbells: hr ? 'Bučice 🔩' : 'Dumbbells 🔩', bands: hr ? 'Elastike 🟡' : 'Bands 🟡',
            bodyweight: hr ? 'Samo tijelo 🤸' : 'Bodyweight 🤸', kettlebell: 'Kettlebell 🔔',
            barbell: hr ? 'Šipka + utezi 🏋️' : 'Barbell + plates 🏋️', pullup_bar: hr ? 'Šipka za zgibove' : 'Pull-up bar',
            trx: 'TRX / Suspension', machine: hr ? 'Sprave (cable, smith)' : 'Machines (cable, smith)',
          }} values={profile.equipment} onToggle={(v) => toggleArray('equipment', v)} />
        </div>
      );
      case 9: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koliko vremena po treningu?' : 'How much time per workout?'}</h2>
          <SingleSelect options={{
            15: '15 min ⚡', 20: '20 min', 30: '30 min 🔥', 45: '45 min 💪', 60: '60 min 🏆', 90: '90+ min 🔥🔥',
          }} value={profile.trainingTime} onChange={(v) => update('trainingTime', v)} />
        </div>
      );
      case 10: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koliko dana tjedno treniraš?' : 'How many days per week do you train?'}</h2>
          <SingleSelect options={{
            '2': '2 ' + (hr ? 'dana' : 'days'), '3': '3 ' + (hr ? 'dana' : 'days'),
            '4': '4 ' + (hr ? 'dana' : 'days'), '5': '5 ' + (hr ? 'dana' : 'days'),
            '6': '6 ' + (hr ? 'dana' : 'days'), '7': hr ? 'Svaki dan' : 'Every day',
          }} value={profile.trainingDays} onChange={(v) => update('trainingDays', v)} />
        </div>
      );
      case 11: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Težina i visina' : 'Weight and height'}</h2>
          <div className="flex gap-3 mt-3">
            <div className="flex-1">
              <label className="text-[10px] text-fit-dim font-bold">{hr ? 'TEŽINA (kg)' : 'WEIGHT (kg)'}</label>
              <input type="number" value={profile.weight} onChange={(e) => update('weight', e.target.value)} placeholder="kg"
                className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-4 text-fit-text text-2xl font-black outline-none font-outfit text-center mt-1" />
            </div>
            <div className="flex-1">
              <label className="text-[10px] text-fit-dim font-bold">{hr ? 'VISINA (cm)' : 'HEIGHT (cm)'}</label>
              <input type="number" value={profile.height} onChange={(e) => update('height', e.target.value)} placeholder="cm"
                className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-4 text-fit-text text-2xl font-black outline-none font-outfit text-center mt-1" />
            </div>
          </div>
          <div className="mt-3">
            <label className="text-[10px] text-fit-dim font-bold">{hr ? 'CILJNA TEŽINA (kg) — opcionalno' : 'TARGET WEIGHT (kg) — optional'}</label>
            <input type="number" value={profile.targetWeight} onChange={(e) => update('targetWeight', e.target.value)} placeholder={hr ? 'Ciljna kg' : 'Target kg'}
              className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-3 px-4 text-fit-text text-xl font-bold outline-none font-outfit text-center mt-1" />
          </div>
        </div>
      );
      case 12: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Stres i način života' : 'Stress and lifestyle'}</h2>
          <p className="text-xs text-fit-muted mb-2">{hr ? 'Koliko si pod stresom?' : 'How stressed are you?'}</p>
          <SingleSelect options={{
            low: hr ? 'Nizak 😌' : 'Low 😌', medium: hr ? 'Srednji 😐' : 'Medium 😐',
            high: hr ? 'Visok 😰' : 'High 😰', very_high: hr ? 'Jako visok 🤯' : 'Very high 🤯',
          }} value={profile.stressLevel} onChange={(v) => update('stressLevel', v)} />
        </div>
      );
      case 13: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Koliko spavaš?' : 'How much do you sleep?'}</h2>
          <SingleSelect options={{
            '<5': hr ? 'Manje od 5h 😵' : 'Less than 5h 😵',
            '5-6': '5-6h 😴', '6-7': '6-7h 😐', '7-8': '7-8h 😊',
            '8+': '8+h 😴💤',
          }} value={profile.sleepHours} onChange={(v) => update('sleepHours', v)} />
        </div>
      );
      case 14: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Slikaj svoje tijelo' : 'Take a photo of your body'}</h2>
          <p className="text-xs text-fit-muted mb-3">{hr ? 'AI će analizirati tvoj body fat %, proporcije i kreirati tvoj avatar u aplikaciji. Opcionalno.' : 'AI will analyze your body fat %, proportions and create your avatar in the app. Optional.'}</p>
          <input ref={fileRef} type="file" accept="image/*" capture="user" onChange={handlePhoto} className="hidden" />
          {profile.bodyPhoto ? (
            <div className="flex flex-col items-center gap-3">
              <div className="w-40 h-52 rounded-2xl border-2 border-fit-accent/30 overflow-hidden" style={{ background: `url(${profile.bodyPhoto}) center/cover` }} />
              <div className="flex gap-2">
                <button onClick={() => fileRef.current?.click()} className="text-xs text-fit-muted py-2 px-4 rounded-xl bg-white/[0.04] border border-fit-border cursor-pointer">📸 {hr ? 'Promijeni' : 'Change'}</button>
                <button onClick={() => update('bodyPhoto', null)} className="text-xs text-fit-warn py-2 px-4 rounded-xl bg-fit-warn/10 border border-fit-warn/20 cursor-pointer">✕ {hr ? 'Ukloni' : 'Remove'}</button>
              </div>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full py-10 rounded-2xl border-2 border-dashed border-fit-border bg-white/[0.02] flex flex-col items-center gap-3 cursor-pointer hover:border-fit-accent/30 transition-colors">
              <span className="text-5xl">🤳</span>
              <span className="text-sm text-fit-muted font-bold">{hr ? 'Klikni za slikanje' : 'Click to take photo'}</span>
              <span className="text-[10px] text-fit-dim">{hr ? 'Prednja strana, cijelo tijelo' : 'Front side, full body'}</span>
            </button>
          )}
          <p className="text-[10px] text-fit-dim mt-3 text-center">{hr ? 'Možeš preskočiti — dodaj kasnije u postavkama' : 'You can skip — add later in settings'}</p>
        </div>
      );
      case 15: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{hr ? 'Odaberi svog trenera' : 'Choose your trainer'}</h2>
          <p className="text-xs text-fit-muted mb-3">{hr ? 'Na osnovu tvojih odgovora, preporučujemo:' : 'Based on your answers, we recommend:'}</p>
          <div className="flex flex-col gap-2.5">
            {(matchedTrainers.length > 0 ? matchedTrainers : trainers).map((tr, i) => {
              const sel = profile.trainerId === tr.id;
              const recommended = i === 0;
              return (
                <button key={tr.id} onClick={() => update('trainerId', tr.id)}
                  className="w-full py-3 px-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer relative"
                  style={{
                    background: sel ? `${tr.color}15` : 'rgba(255,255,255,0.03)',
                    borderColor: sel ? `${tr.color}55` : 'rgba(255,255,255,0.06)',
                    boxShadow: sel ? `0 0 25px ${tr.color}20` : 'none',
                  }}>
                  {recommended && (
                    <span className="absolute -top-2 right-3 text-[9px] font-bold py-0.5 px-2 rounded-full" style={{ background: tr.color, color: '#000' }}>
                      {hr ? '⭐ PREPORUČEN' : '⭐ RECOMMENDED'}
                    </span>
                  )}
                  <div className="flex items-center gap-3">
                    <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl shrink-0"
                      style={{ background: `${tr.color}20`, border: `2px solid ${tr.color}44` }}>
                      {tr.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-bold" style={{ color: sel ? tr.color : '#e8eaf0' }}>{tr.name}</span>
                        <span className="text-[9px] text-fit-dim">{tr.city}</span>
                      </div>
                      <div className="text-[10px] font-semibold" style={{ color: tr.color }}>{hr ? tr.title.hr : tr.title.en}</div>
                      <div className="flex gap-1 flex-wrap mt-1">
                        {tr.specialty.slice(0, 3).map((s) => (
                          <span key={s} className="text-[8px] py-0.5 px-1.5 rounded-full bg-white/[0.06] text-fit-muted">{s}</span>
                        ))}
                      </div>
                      {sel && (
                        <div className="text-[10px] text-fit-muted mt-1.5 italic">
                          &ldquo;{hr ? tr.quote.hr : tr.quote.en}&rdquo;
                        </div>
                      )}
                    </div>
                    {sel && <span className="text-lg" style={{ color: tr.color }}>✓</span>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-fit-bg flex flex-col max-w-[430px] mx-auto px-4 py-6">
      <div className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${mood.color}12, transparent 70%)` }} />
      <div className="relative z-10 flex flex-col flex-1">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-4">
          {step > 0 && (
            <button onClick={() => setStep(step - 1)} className="text-fit-muted text-sm font-bold cursor-pointer hover:text-fit-text transition-colors bg-transparent border-none">←</button>
          )}
          <div className="flex-1"><Bar pct={((step + 1) / TOTAL_STEPS) * 100} color={mood.color} h={4} /></div>
          <span className="text-[10px] text-fit-dim font-bold">{step + 1}/{TOTAL_STEPS}</span>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-3xl transition-all duration-500"
            style={{ background: `${mood.color}15`, border: `3px solid ${mood.color}44`, boxShadow: `0 0 30px ${mood.color}22` }}>
            {mood.emoji}
          </div>
        </div>

        {/* Step Content */}
        <Box glow={mood.color} className="flex-1 animate-[fadeIn_0.3s_ease] overflow-auto max-h-[60vh]">
          {renderStep()}
        </Box>

        {/* Next Button */}
        <button onClick={next} disabled={!canNext()}
          className="mt-4 w-full py-4 rounded-2xl text-base font-black cursor-pointer transition-all duration-300 border-none font-outfit"
          style={{
            background: canNext() ? `linear-gradient(135deg, ${mood.color}, ${mood.color}cc)` : 'rgba(255,255,255,0.04)',
            color: canNext() ? '#000' : '#4a4e62', opacity: canNext() ? 1 : 0.5,
          }}>
          {step === TOTAL_STEPS - 1 ? (hr ? '🚀 Kreni!' : "🚀 Let's go!") : (hr ? 'Dalje →' : 'Next →')}
        </button>
      </div>
    </div>
  );
}
