'use client';

import { useState, useEffect } from 'react';
import { useT } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Ring from '@/components/ui/Ring';
import Lbl from '@/components/ui/Lbl';

export default function HomeTab() {
  const t = useT();
  const [water, setWater] = useState(5);
  const [mood, setMood] = useState<number | null>(null);
  const [reminder, setReminder] = useState<{ i: string; t: string; c: string } | null>(null);

  useEffect(() => {
    const msgs = [
      { i: '💧', t: t.home.reminders.water, c: '#3ea8ff' },
      { i: '🧘', t: t.home.reminders.stretch, c: '#00f0b5' },
      { i: '👀', t: t.home.reminders.eyes, c: '#7c5cfc' },
    ];
    const iv = setInterval(() => {
      setReminder(msgs[Math.floor(Math.random() * msgs.length)]);
      setTimeout(() => setReminder(null), 4000);
    }, 20000);
    // Show first reminder after 2s
    const to = setTimeout(() => {
      setReminder(msgs[0]);
      setTimeout(() => setReminder(null), 4000);
    }, 2000);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, [t]);

  const moods = [
    { emoji: '😴', label: t.home.mood.tired, value: 1 },
    { emoji: '😐', label: t.home.mood.ok, value: 2 },
    { emoji: '💪', label: t.home.mood.ready, value: 3 },
    { emoji: '🔥', label: t.home.mood.fire, value: 4 },
  ];

  return (
    <div className="flex flex-col gap-3.5">
      {/* Smart Reminder Toast */}
      {reminder && (
        <div
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-2xl py-3 px-5 flex items-center gap-2.5 backdrop-blur-[20px] max-w-[340px] animate-[slideIn_0.4s_ease]"
          style={{
            background: `${reminder.c}18`,
            border: `1px solid ${reminder.c}44`,
            boxShadow: `0 8px 30px ${reminder.c}22`,
          }}
        >
          <span className="text-[22px]">{reminder.i}</span>
          <span className="text-[13px] font-bold" style={{ color: reminder.c }}>{reminder.t}</span>
        </div>
      )}

      {/* Greeting */}
      <div>
        <div className="text-[10px] text-fit-dim tracking-[1.5px] font-bold">{t.home.date}</div>
        <div className="text-2xl font-black text-fit-text">{t.home.greeting} 💪</div>
      </div>

      {/* Activity Rings */}
      <Box glow="#00f0b5">
        <div className="flex justify-around">
          <Ring pct={0.72} r={30} sw={6} color="#00f0b5" label={t.home.movement} val="540" sub="kcal" />
          <Ring pct={0.85} r={30} sw={6} color="#3ea8ff" label={t.home.exercise} val="52m" sub="/60m" />
          <Ring pct={0.60} r={30} sw={6} color="#ff6b4a" label={t.home.standing} val="8" sub="/12h" />
        </div>
      </Box>

      {/* Steps & Calories */}
      <div className="grid grid-cols-2 gap-2.5">
        <Box>
          <div className="text-[9px] text-fit-dim font-bold">👣 {t.home.steps}</div>
          <div className="text-[22px] font-black text-fit-accent">8,432</div>
          <Bar pct={84} color="#00f0b5" />
        </Box>
        <Box>
          <div className="text-[9px] text-fit-dim font-bold">🔥 {t.home.calories}</div>
          <div className="text-[22px] font-black text-fit-warn">2,340</div>
          <Bar pct={83} color="#ff6b4a" />
        </Box>
      </div>

      {/* Mood */}
      <Box>
        <Lbl icon="😊" text={t.home.mood.title} />
        <div className="flex gap-2 mt-2">
          {moods.map((m) => (
            <button
              key={m.value}
              onClick={() => setMood(m.value)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all duration-200 cursor-pointer border"
              style={{
                background: mood === m.value ? '#00f0b508' : 'rgba(255,255,255,0.02)',
                borderColor: mood === m.value ? '#00f0b533' : 'transparent',
              }}
            >
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[9px] text-fit-muted font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </Box>

      {/* Hydration */}
      <Box>
        <Lbl icon="💧" text={t.home.hydration} color="#3ea8ff" />
        <div className="flex gap-[5px] mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              onClick={() => setWater(i + 1)}
              className="flex-1 h-9 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-300"
              style={{
                background: i < water
                  ? 'linear-gradient(180deg, #3ea8ff, #0284c7)'
                  : 'rgba(255,255,255,0.04)',
                boxShadow: i < water ? '0 2px 8px #3ea8ff33' : 'none',
              }}
            >
              {i < water && <span className="text-[10px]">💧</span>}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-fit-muted mt-1">
          {water}/8 {t.home.glasses} · {water * 250}ml
        </div>
      </Box>

      {/* Weekly Briefing */}
      <Box glow="#ffc233">
        <Lbl icon="📋" text={t.home.weeklyBriefing} color="#ffc233" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { l: t.home.workouts, v: '5/6', p: 83, c: '#00f0b5' },
            { l: t.home.calories, v: '6/7', p: 85, c: '#ff6b4a' },
            { l: t.home.sleep, v: '7h 20m', p: 91, c: '#7c5cfc' },
            { l: t.home.water, v: `6.5 ${t.home.glasses}`, p: 81, c: '#3ea8ff' },
          ].map((x) => (
            <div key={x.l}>
              <div className="text-[9px] text-fit-dim">{x.l}</div>
              <div className="text-base font-black" style={{ color: x.c }}>{x.v}</div>
              <Bar pct={x.p} color={x.c} h={3} />
            </div>
          ))}
        </div>
      </Box>
    </div>
  );
}
