'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { trainers } from '@/lib/constants/trainers';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';

interface Settings {
  notifications: boolean;
  waterReminders: boolean;
  stretchReminders: boolean;
  eyeReminders: boolean;
  workoutReminders: boolean;
  voiceEnabled: boolean;
  darkMode: boolean;
  units: 'metric' | 'imperial';
  calorieGoal: number;
  stepGoal: number;
  waterGoal: number;
}

export default function SettingsTab({ onResetOnboarding }: { onResetOnboarding: () => void }) {
  const { locale, setLocale } = useLocaleStore();
  const hr = locale === 'hr';
  const [profile, setProfile] = useState<any>(null);
  const [trainer, setTrainer] = useState<any>(null);
  const [settings, setSettings] = useState<Settings>({
    notifications: true, waterReminders: true, stretchReminders: true,
    eyeReminders: true, workoutReminders: true, voiceEnabled: true,
    darkMode: true, units: 'metric', calorieGoal: 2000, stepGoal: 10000, waterGoal: 8,
  });

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fit-profile') || '{}');
      setProfile(p);
      if (p.trainerId) setTrainer(trainers.find((t) => t.id === p.trainerId));
      const s = localStorage.getItem('fit-settings');
      if (s) setSettings(JSON.parse(s));
    } catch {}
  }, []);

  const updateSetting = (key: keyof Settings, val: any) => {
    const next = { ...settings, [key]: val };
    setSettings(next);
    localStorage.setItem('fit-settings', JSON.stringify(next));
  };

  const Toggle = ({ value, onChange, label }: { value: boolean; onChange: (v: boolean) => void; label: string }) => (
    <div className="flex items-center justify-between py-2.5">
      <span className="text-xs text-fit-text font-semibold">{label}</span>
      <button onClick={() => onChange(!value)}
        className="w-11 h-6 rounded-full transition-all duration-200 cursor-pointer border-none relative"
        style={{ background: value ? '#00f0b5' : 'rgba(255,255,255,0.1)' }}>
        <div className="w-5 h-5 rounded-full bg-white absolute top-0.5 transition-all duration-200"
          style={{ left: value ? 22 : 2 }} />
      </button>
    </div>
  );

  return (
    <div className="flex flex-col gap-3.5">
      <h1 className="text-xl font-black text-fit-text">{hr ? '⚙️ Postavke' : '⚙️ Settings'}</h1>

      {/* Profile Summary */}
      {profile && (
        <Box glow="#7c5cfc">
          <Lbl icon="👤" text={hr ? 'Profil' : 'Profile'} color="#7c5cfc" />
          <div className="flex items-center gap-3 mt-2">
            {profile.bodyPhoto ? (
              <div className="w-14 h-14 rounded-full border-2 border-fit-secondary/30 overflow-hidden shrink-0"
                style={{ background: `url(${profile.bodyPhoto}) center/cover` }} />
            ) : (
              <div className="w-14 h-14 rounded-full bg-white/[0.06] flex items-center justify-center text-2xl">👤</div>
            )}
            <div>
              <div className="text-sm font-bold text-fit-text">{profile.name}</div>
              <div className="text-[10px] text-fit-muted">{profile.weight}kg · {profile.height}cm · {profile.age} {hr ? 'god' : 'yrs'}</div>
              {trainer && (
                <div className="flex items-center gap-1 mt-0.5">
                  <span className="text-sm">{trainer.emoji}</span>
                  <span className="text-[10px]" style={{ color: trainer.color }}>{trainer.name}</span>
                </div>
              )}
            </div>
          </div>
        </Box>
      )}

      {/* Language */}
      <Box>
        <Lbl icon="🌐" text={hr ? 'Jezik' : 'Language'} />
        <div className="flex gap-2 mt-2">
          {[{ id: 'hr', label: '🇭🇷 Hrvatski' }, { id: 'en', label: '🇬🇧 English' }].map((l) => (
            <button key={l.id} onClick={() => setLocale(l.id as any)}
              className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border transition-colors"
              style={{
                background: locale === l.id ? '#00f0b515' : 'rgba(255,255,255,0.03)',
                borderColor: locale === l.id ? '#00f0b555' : 'rgba(255,255,255,0.06)',
                color: locale === l.id ? '#00f0b5' : '#8b8fa3',
              }}>{l.label}</button>
          ))}
        </div>
      </Box>

      {/* Notifications */}
      <Box>
        <Lbl icon="🔔" text={hr ? 'Obavijesti' : 'Notifications'} />
        <div className="mt-1">
          <Toggle value={settings.notifications} onChange={(v) => updateSetting('notifications', v)} label={hr ? 'Sve obavijesti' : 'All notifications'} />
          <Toggle value={settings.waterReminders} onChange={(v) => updateSetting('waterReminders', v)} label={hr ? '💧 Podsjetnik za vodu (svaka 2h)' : '💧 Water reminder (every 2h)'} />
          <Toggle value={settings.stretchReminders} onChange={(v) => updateSetting('stretchReminders', v)} label={hr ? '🧘 Podsjetnik za istezanje (45 min)' : '🧘 Stretch reminder (45 min)'} />
          <Toggle value={settings.eyeReminders} onChange={(v) => updateSetting('eyeReminders', v)} label={hr ? '👀 Odmor za oči (svaki sat)' : '👀 Eye rest (every hour)'} />
          <Toggle value={settings.workoutReminders} onChange={(v) => updateSetting('workoutReminders', v)} label={hr ? '🏋️ Podsjetnik za trening' : '🏋️ Workout reminder'} />
        </div>
      </Box>

      {/* Voice & AI */}
      <Box>
        <Lbl icon="🤖" text={hr ? 'Glas i AI' : 'Voice & AI'} />
        <Toggle value={settings.voiceEnabled} onChange={(v) => updateSetting('voiceEnabled', v)} label={hr ? '🔊 Glasovni odgovori trenera' : '🔊 Trainer voice responses'} />
      </Box>

      {/* Goals */}
      <Box>
        <Lbl icon="🎯" text={hr ? 'Ciljevi' : 'Goals'} />
        <div className="flex flex-col gap-3 mt-2">
          {[
            { label: hr ? 'Dnevne kalorije (kcal)' : 'Daily calories (kcal)', key: 'calorieGoal' as const, val: settings.calorieGoal },
            { label: hr ? 'Dnevni koraci' : 'Daily steps', key: 'stepGoal' as const, val: settings.stepGoal },
            { label: hr ? 'Čaše vode' : 'Glasses of water', key: 'waterGoal' as const, val: settings.waterGoal },
          ].map((g) => (
            <div key={g.key} className="flex items-center justify-between">
              <span className="text-xs text-fit-text font-semibold">{g.label}</span>
              <input type="number" value={g.val}
                onChange={(e) => updateSetting(g.key, parseInt(e.target.value) || 0)}
                className="w-24 bg-white/[0.04] border border-fit-border rounded-xl py-1.5 px-3 text-fit-text text-sm font-bold text-center outline-none font-outfit" />
            </div>
          ))}
        </div>
      </Box>

      {/* Danger Zone */}
      <Box>
        <Lbl icon="⚠️" text={hr ? 'Zona opasnosti' : 'Danger zone'} color="#ff6b4a" />
        <button onClick={onResetOnboarding}
          className="w-full mt-2 py-3 rounded-xl text-xs font-bold cursor-pointer border border-fit-warn/30 bg-fit-warn/10 text-fit-warn hover:bg-fit-warn/20 transition-colors">
          🔄 {hr ? 'Ponovi onboarding kviz' : 'Redo onboarding quiz'}
        </button>
        <button className="w-full mt-2 py-3 rounded-xl text-xs font-bold cursor-pointer border border-fit-border bg-white/[0.03] text-fit-muted">
          🗑️ {hr ? 'Obriši sve podatke' : 'Delete all data'}
        </button>
      </Box>

      <div className="text-center text-[10px] text-fit-dim py-4">FIT v1.0 — Phase 1 MVP</div>
    </div>
  );
}
