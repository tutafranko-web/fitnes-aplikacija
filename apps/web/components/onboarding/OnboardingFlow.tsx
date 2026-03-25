'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';

interface UserProfile {
  name: string;
  goal: string;
  level: string;
  sports: string[];
  injuries: string[];
  equipment: string[];
  trainingTime: string;
  weight: string;
  height: string;
  dna: string;
}

const TOTAL_STEPS = 10;

// Avatar moods per step
const stepMoods: Record<number, { emoji: string; color: string }> = {
  0: { emoji: '😄', color: '#00f0b5' },
  1: { emoji: '🔥', color: '#ff6b4a' },
  2: { emoji: '💪', color: '#7c5cfc' },
  3: { emoji: '⚡', color: '#3ea8ff' },
  4: { emoji: '🤕', color: '#ffc233' },
  5: { emoji: '🏋️', color: '#00f0b5' },
  6: { emoji: '⏱️', color: '#7c5cfc' },
  7: { emoji: '⚖️', color: '#3ea8ff' },
  8: { emoji: '📏', color: '#00f0b5' },
  9: { emoji: '🧬', color: '#ff4d8d' },
};

interface Props {
  onComplete: (profile: UserProfile) => void;
}

export default function OnboardingFlow({ onComplete }: Props) {
  const t = useT();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    name: '', goal: '', level: '', sports: [], injuries: [],
    equipment: [], trainingTime: '', weight: '', height: '', dna: '',
  });

  const update = (key: keyof UserProfile, val: string | string[]) => {
    setProfile((p) => ({ ...p, [key]: val }));
  };

  const toggleArray = (key: 'sports' | 'injuries' | 'equipment', val: string) => {
    setProfile((p) => {
      const arr = p[key] as string[];
      return { ...p, [key]: arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val] };
    });
  };

  const canNext = () => {
    switch (step) {
      case 0: return profile.name.trim().length > 0;
      case 1: return !!profile.goal;
      case 2: return !!profile.level;
      case 3: return profile.sports.length > 0;
      case 4: return profile.injuries.length > 0;
      case 5: return profile.equipment.length > 0;
      case 6: return !!profile.trainingTime;
      case 7: return profile.weight.trim().length > 0;
      case 8: return profile.height.trim().length > 0;
      case 9: return !!profile.dna;
      default: return false;
    }
  };

  const next = () => {
    if (step < TOTAL_STEPS - 1) setStep(step + 1);
    else onComplete(profile);
  };

  const mood = stepMoods[step];

  const SingleSelect = ({ options, value, onChange }: { options: Record<string, string>; value: string; onChange: (v: string) => void }) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {Object.entries(options).map(([key, label]) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className="py-3 px-4 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 border text-left"
          style={{
            background: value === key ? `${mood.color}15` : 'rgba(255,255,255,0.03)',
            borderColor: value === key ? `${mood.color}55` : 'rgba(255,255,255,0.06)',
            color: value === key ? mood.color : '#8b8fa3',
            boxShadow: value === key ? `0 0 20px ${mood.color}15` : 'none',
          }}
        >
          {label}
        </button>
      ))}
    </div>
  );

  const MultiSelect = ({ options, values, onToggle }: { options: Record<string, string>; values: string[]; onToggle: (v: string) => void }) => (
    <div className="grid grid-cols-2 gap-2 mt-4">
      {Object.entries(options).map(([key, label]) => {
        const sel = values.includes(key);
        return (
          <button
            key={key}
            onClick={() => onToggle(key)}
            className="py-3 px-4 rounded-2xl text-sm font-bold cursor-pointer transition-all duration-200 border text-left"
            style={{
              background: sel ? `${mood.color}15` : 'rgba(255,255,255,0.03)',
              borderColor: sel ? `${mood.color}55` : 'rgba(255,255,255,0.06)',
              color: sel ? mood.color : '#8b8fa3',
              boxShadow: sel ? `0 0 20px ${mood.color}15` : 'none',
            }}
          >
            {sel ? '✓ ' : ''}{label}
          </button>
        );
      })}
    </div>
  );

  const renderStep = () => {
    const s = t.onboarding.steps;
    switch (step) {
      case 0: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-2">{s.name.title}</h2>
          <input
            value={profile.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder={s.name.placeholder}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-lg outline-none font-outfit focus:border-fit-accent/40 transition-colors mt-4"
            autoFocus
          />
        </div>
      );
      case 1: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.goal.title}</h2>
          <SingleSelect options={s.goal.options} value={profile.goal} onChange={(v) => update('goal', v)} />
        </div>
      );
      case 2: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.level.title}</h2>
          <SingleSelect options={s.level.options} value={profile.level} onChange={(v) => update('level', v)} />
        </div>
      );
      case 3: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.sports.title}</h2>
          <MultiSelect options={s.sports.options} values={profile.sports} onToggle={(v) => toggleArray('sports', v)} />
        </div>
      );
      case 4: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.injuries.title}</h2>
          <MultiSelect options={s.injuries.options} values={profile.injuries} onToggle={(v) => toggleArray('injuries', v)} />
        </div>
      );
      case 5: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.equipment.title}</h2>
          <MultiSelect options={s.equipment.options} values={profile.equipment} onToggle={(v) => toggleArray('equipment', v)} />
        </div>
      );
      case 6: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.time.title}</h2>
          <SingleSelect options={s.time.options} value={profile.trainingTime} onChange={(v) => update('trainingTime', v)} />
        </div>
      );
      case 7: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-2">{s.weight.title}</h2>
          <input
            type="number"
            value={profile.weight}
            onChange={(e) => update('weight', e.target.value)}
            placeholder={s.weight.placeholder}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-3xl font-black outline-none font-outfit text-center focus:border-fit-accent/40 transition-colors mt-4"
          />
        </div>
      );
      case 8: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-2">{s.height.title}</h2>
          <input
            type="number"
            value={profile.height}
            onChange={(e) => update('height', e.target.value)}
            placeholder={s.height.placeholder}
            className="w-full bg-white/[0.04] border border-fit-border rounded-2xl py-4 px-5 text-fit-text text-3xl font-black outline-none font-outfit text-center focus:border-fit-accent/40 transition-colors mt-4"
          />
        </div>
      );
      case 9: return (
        <div>
          <h2 className="text-xl font-black text-fit-text mb-1">{s.dna.title}</h2>
          <SingleSelect options={s.dna.options} value={profile.dna} onChange={(v) => update('dna', v)} />
        </div>
      );
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-fit-bg flex flex-col max-w-[430px] mx-auto px-4 py-6">
      {/* Ambient glow */}
      <div
        className="fixed top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] rounded-full pointer-events-none z-0 transition-all duration-700"
        style={{ background: `radial-gradient(circle, ${mood.color}12, transparent 70%)` }}
      />

      <div className="relative z-10 flex flex-col flex-1">
        {/* Progress */}
        <div className="flex items-center gap-3 mb-6">
          {step > 0 && (
            <button
              onClick={() => setStep(step - 1)}
              className="text-fit-muted text-sm font-bold cursor-pointer hover:text-fit-text transition-colors bg-transparent border-none"
            >
              ← {t.common.back}
            </button>
          )}
          <div className="flex-1">
            <Bar pct={((step + 1) / TOTAL_STEPS) * 100} color={mood.color} h={4} />
          </div>
          <span className="text-[10px] text-fit-dim font-bold">
            {step + 1}/{TOTAL_STEPS}
          </span>
        </div>

        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div
            className="w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-500"
            style={{
              background: `${mood.color}15`,
              border: `3px solid ${mood.color}44`,
              boxShadow: `0 0 30px ${mood.color}22`,
            }}
          >
            {mood.emoji}
          </div>
        </div>

        {/* Step Content */}
        <Box glow={mood.color} className="flex-1 animate-[fadeIn_0.3s_ease]">
          {renderStep()}
        </Box>

        {/* Next Button */}
        <button
          onClick={next}
          disabled={!canNext()}
          className="mt-6 w-full py-4 rounded-2xl text-base font-black cursor-pointer transition-all duration-300 border-none font-outfit"
          style={{
            background: canNext()
              ? `linear-gradient(135deg, ${mood.color}, ${mood.color}cc)`
              : 'rgba(255,255,255,0.04)',
            color: canNext() ? '#000' : '#4a4e62',
            boxShadow: canNext() ? `0 4px 20px ${mood.color}33` : 'none',
            opacity: canNext() ? 1 : 0.5,
          }}
        >
          {step === TOTAL_STEPS - 1 ? t.onboarding.letsGo : t.common.next} →
        </button>
      </div>
    </div>
  );
}
