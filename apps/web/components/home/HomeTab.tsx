'use client';

import { useState, useEffect } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Ring from '@/components/ui/Ring';
import Lbl from '@/components/ui/Lbl';
import { logWater, logMood, logSteps, logSleep, getToday, getWeekData, getTotalAiCost } from '@/lib/dataStore';
import { trainers } from '@/lib/constants/trainers';

export default function HomeTab() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [water, setWater] = useState(0);
  const [mood, setMood] = useState<number>(0);
  const [steps, setSteps] = useState(0);
  const [reminder, setReminder] = useState<{ i: string; t: string; c: string } | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [trainer, setTrainer] = useState<any>(null);
  const [weekData, setWeekData] = useState<any[]>([]);
  const [sleepHours, setSleepHours] = useState(0);
  const [sleepQuality, setSleepQuality] = useState('');
  const [showSleep, setShowSleep] = useState(false);
  const [aiCost, setAiCost] = useState(0);

  // Load everything
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fit-profile') || '{}');
      setProfile(p);
      if (p.trainerId) setTrainer(trainers.find((t) => t.id === p.trainerId));
    } catch {}
    const today = getToday();
    setWater(today.water);
    setMood(today.mood);
    setSteps(today.steps);
    setSleepHours(today.sleepHours);
    setSleepQuality(today.sleepQuality);
    setWeekData(getWeekData());
    setAiCost(getTotalAiCost());
  }, []);

  const [showStepInput, setShowStepInput] = useState(false);
  const [stepInput, setStepInput] = useState('');

  // Step counter — DeviceMotionEvent on mobile, manual input on desktop
  useEffect(() => {
    let stepCount = steps;
    let lastAccel = 0;
    let lastTime = Date.now();
    let hasMotion = false;

    const handleMotion = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x === null) return;
      hasMotion = true;
      const total = Math.sqrt((acc.x || 0) ** 2 + (acc.y || 0) ** 2 + (acc.z || 0) ** 2);
      const now = Date.now();
      if (now - lastTime < 300) return;
      const diff = Math.abs(total - lastAccel);
      if (diff > 3 && diff < 20) {
        stepCount++;
        setSteps(stepCount);
        logSteps(stepCount);
      }
      lastAccel = total;
      lastTime = now;
    };

    if (typeof window !== 'undefined' && 'DeviceMotionEvent' in window) {
      window.addEventListener('devicemotion', handleMotion);
      // Check after 2s if motion events are firing
      setTimeout(() => { if (!hasMotion) setShowStepInput(true); }, 2000);
    } else {
      setShowStepInput(true);
    }
    return () => window.removeEventListener('devicemotion', handleMotion);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleManualSteps = () => {
    const s = parseInt(stepInput);
    if (s > 0) { setSteps(s); logSteps(s); setStepInput(''); }
  };

  // Reminders
  useEffect(() => {
    const msgs = [
      { i: '💧', t: t.home.reminders.water, c: '#3ea8ff' },
      { i: '🧘', t: t.home.reminders.stretch, c: '#00f0b5' },
      { i: '👀', t: t.home.reminders.eyes, c: '#7c5cfc' },
    ];
    const iv = setInterval(() => { setReminder(msgs[Math.floor(Math.random() * msgs.length)]); setTimeout(() => setReminder(null), 4000); }, 30000);
    const to = setTimeout(() => { setReminder(msgs[0]); setTimeout(() => setReminder(null), 4000); }, 3000);
    return () => { clearInterval(iv); clearTimeout(to); };
  }, [t]);

  const handleWater = (n: number) => { setWater(n); logWater(n); };
  const handleMood = (n: number) => { setMood(n); logMood(n); };
  const handleSleep = () => {
    logSleep(sleepHours, sleepQuality);
    setShowSleep(false);
  };

  // Weekly stats
  const weekWorkouts = weekData.filter((d) => d.workoutsCompleted > 0).length;
  const weekCalDays = weekData.filter((d) => d.calories > 0).length;
  const weekSleepAvg = weekData.filter((d) => d.sleepHours > 0).length > 0
    ? (weekData.reduce((s, d) => s + d.sleepHours, 0) / weekData.filter((d) => d.sleepHours > 0).length).toFixed(1)
    : '-';
  const weekWaterAvg = weekData.filter((d) => d.water > 0).length > 0
    ? (weekData.reduce((s, d) => s + d.water, 0) / weekData.filter((d) => d.water > 0).length).toFixed(1)
    : '0';

  const userName = profile?.name || 'Champion';
  const todayCals = Math.round(steps * 0.04);

  return (
    <div className="flex flex-col gap-3.5">
      {reminder && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-[100] rounded-2xl py-3 px-5 flex items-center gap-2.5 backdrop-blur-[20px] max-w-[340px] animate-[slideIn_0.4s_ease]"
          style={{ background: `${reminder.c}18`, border: `1px solid ${reminder.c}44`, boxShadow: `0 8px 30px ${reminder.c}22` }}>
          <span className="text-[22px]">{reminder.i}</span>
          <span className="text-[13px] font-bold" style={{ color: reminder.c }}>{reminder.t}</span>
        </div>
      )}

      {/* Greeting */}
      <div>
        <div className="text-[10px] text-fit-dim tracking-[1.5px] font-bold">
          {new Date().toLocaleDateString(hr ? 'hr-HR' : 'en-US', { weekday: 'long', day: 'numeric', month: 'long' }).toUpperCase()}
        </div>
        <div className="text-2xl font-black text-fit-text">{hr ? `Bok, ${userName}!` : `Hey, ${userName}!`} 💪</div>
        {trainer && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-lg">{trainer.emoji}</span>
            <span className="text-xs text-fit-muted">{trainer.name} — {hr ? trainer.title.hr : trainer.title.en}</span>
          </div>
        )}
      </div>

      {/* Activity Rings */}
      <Box glow="#00f0b5">
        <div className="flex justify-around">
          <Ring pct={todayCals / 500} r={30} sw={6} color="#00f0b5" label={t.home.movement} val={`${todayCals}`} sub="kcal" />
          <Ring pct={0} r={30} sw={6} color="#3ea8ff" label={t.home.exercise} val="0m" sub="/60m" />
          <Ring pct={sleepHours / 8} r={30} sw={6} color="#7c5cfc" label={t.home.sleep} val={sleepHours ? `${sleepHours}h` : '-'} sub="/8h" />
        </div>
      </Box>

      {/* Steps & Calories */}
      <div className="grid grid-cols-2 gap-2.5">
        <Box>
          <div className="text-[9px] text-fit-dim font-bold">👣 {t.home.steps}</div>
          <div className="text-[22px] font-black text-fit-accent">{steps.toLocaleString()}</div>
          <Bar pct={(steps / 10000) * 100} color="#00f0b5" />
          {showStepInput && (
            <div className="flex gap-1 mt-1.5">
              <input type="number" value={stepInput} onChange={(e) => setStepInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleManualSteps()}
                placeholder={hr ? 'Unesi korake' : 'Enter steps'}
                className="flex-1 bg-white/[0.04] border border-fit-border rounded-lg py-1 px-2 text-fit-text text-[10px] outline-none" />
              <button onClick={handleManualSteps} className="text-[10px] px-2 py-1 rounded-lg bg-fit-accent/20 text-fit-accent font-bold cursor-pointer border-none">+</button>
            </div>
          )}
        </Box>
        <Box>
          <div className="text-[9px] text-fit-dim font-bold">🔥 {t.home.calories}</div>
          <div className="text-[22px] font-black text-fit-warn">{todayCals}</div>
          <Bar pct={(todayCals / 2000) * 100} color="#ff6b4a" />
        </Box>
      </div>

      {/* Mood */}
      <Box>
        <Lbl icon="😊" text={t.home.mood.title} />
        <div className="flex gap-2 mt-2">
          {[
            { emoji: '😴', label: t.home.mood.tired, value: 1 },
            { emoji: '😐', label: t.home.mood.ok, value: 2 },
            { emoji: '💪', label: t.home.mood.ready, value: 3 },
            { emoji: '🔥', label: t.home.mood.fire, value: 4 },
          ].map((m) => (
            <button key={m.value} onClick={() => handleMood(m.value)}
              className="flex-1 flex flex-col items-center gap-1 py-2 rounded-xl transition-all cursor-pointer border"
              style={{ background: mood === m.value ? '#00f0b508' : 'rgba(255,255,255,0.02)', borderColor: mood === m.value ? '#00f0b533' : 'transparent' }}>
              <span className="text-xl">{m.emoji}</span>
              <span className="text-[9px] text-fit-muted font-semibold">{m.label}</span>
            </button>
          ))}
        </div>
      </Box>

      {/* Sleep Tracker */}
      <Box>
        <Lbl icon="😴" text={hr ? 'San prošle noći' : 'Last night sleep'} color="#7c5cfc" />
        {sleepHours > 0 && !showSleep ? (
          <div className="flex items-center gap-3 mt-2">
            <div className="text-2xl font-black text-fit-secondary">{sleepHours}h</div>
            <div className="flex-1">
              <div className="text-xs text-fit-muted">{hr ? 'Kvaliteta' : 'Quality'}: <span className="text-fit-text font-bold">{sleepQuality || '-'}</span></div>
              <Bar pct={(sleepHours / 8) * 100} color="#7c5cfc" h={4} />
            </div>
            <button onClick={() => setShowSleep(true)} className="text-[10px] text-fit-dim cursor-pointer bg-transparent border-none">✏️</button>
          </div>
        ) : (
          <div className="mt-2">
            <div className="flex gap-2 mb-2">
              {[5, 6, 7, 8, 9].map((h) => (
                <button key={h} onClick={() => setSleepHours(h)}
                  className="flex-1 py-2 rounded-xl text-xs font-bold cursor-pointer border"
                  style={{ background: sleepHours === h ? '#7c5cfc20' : 'rgba(255,255,255,0.03)', borderColor: sleepHours === h ? '#7c5cfc55' : 'rgba(255,255,255,0.06)', color: sleepHours === h ? '#7c5cfc' : '#8b8fa3' }}>
                  {h}h
                </button>
              ))}
            </div>
            <div className="flex gap-1 mb-2">
              {[
                { id: 'poor', l: hr ? '😵 Loše' : '😵 Poor' },
                { id: 'ok', l: hr ? '😐 OK' : '😐 OK' },
                { id: 'good', l: hr ? '😊 Dobro' : '😊 Good' },
                { id: 'excellent', l: hr ? '😴 Odlično' : '😴 Excellent' },
              ].map((q) => (
                <button key={q.id} onClick={() => setSleepQuality(q.id)}
                  className="flex-1 py-1.5 rounded-xl text-[10px] font-bold cursor-pointer border"
                  style={{ background: sleepQuality === q.id ? '#7c5cfc20' : 'rgba(255,255,255,0.03)', borderColor: sleepQuality === q.id ? '#7c5cfc55' : 'rgba(255,255,255,0.06)', color: sleepQuality === q.id ? '#7c5cfc' : '#8b8fa3' }}>
                  {q.l}
                </button>
              ))}
            </div>
            <button onClick={handleSleep} disabled={!sleepHours}
              className="w-full py-2 rounded-xl text-xs font-bold cursor-pointer border-none"
              style={{ background: sleepHours ? '#7c5cfc' : 'rgba(255,255,255,0.04)', color: sleepHours ? '#fff' : '#4a4e62' }}>
              ✅ {hr ? 'Spremi' : 'Save'}
            </button>
          </div>
        )}
      </Box>

      {/* Hydration */}
      <Box>
        <Lbl icon="💧" text={t.home.hydration} color="#3ea8ff" />
        <div className="flex gap-[5px] mt-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} onClick={() => handleWater(i + 1)}
              className="flex-1 h-9 rounded-lg cursor-pointer flex items-center justify-center transition-all duration-300"
              style={{ background: i < water ? 'linear-gradient(180deg, #3ea8ff, #0284c7)' : 'rgba(255,255,255,0.04)', boxShadow: i < water ? '0 2px 8px #3ea8ff33' : 'none' }}>
              {i < water && <span className="text-[10px]">💧</span>}
            </div>
          ))}
        </div>
        <div className="text-[10px] text-fit-muted mt-1">{water}/8 {t.home.glasses} · {water * 250}ml</div>
      </Box>

      {/* Weekly Briefing — REAL DATA */}
      <Box glow="#ffc233">
        <Lbl icon="📋" text={t.home.weeklyBriefing} color="#ffc233" />
        <div className="grid grid-cols-2 gap-2 mt-2">
          {[
            { l: t.home.workouts, v: `${weekWorkouts}/7`, p: (weekWorkouts / 7) * 100, c: '#00f0b5' },
            { l: t.home.calories, v: `${weekCalDays}/7 ${hr ? 'dana' : 'days'}`, p: (weekCalDays / 7) * 100, c: '#ff6b4a' },
            { l: t.home.sleep, v: `${weekSleepAvg}h ${hr ? 'prosj.' : 'avg'}`, p: weekSleepAvg !== '-' ? (parseFloat(weekSleepAvg) / 8) * 100 : 0, c: '#7c5cfc' },
            { l: t.home.water, v: `${weekWaterAvg} ${t.home.glasses}`, p: (parseFloat(weekWaterAvg) / 8) * 100, c: '#3ea8ff' },
          ].map((x) => (
            <div key={x.l}>
              <div className="text-[9px] text-fit-dim">{x.l}</div>
              <div className="text-base font-black" style={{ color: x.c }}>{x.v}</div>
              <Bar pct={x.p} color={x.c} h={3} />
            </div>
          ))}
        </div>
      </Box>

      {/* AI Cost Tracker */}
      {aiCost > 0 && (
        <Box>
          <Lbl icon="💰" text={hr ? 'AI troškovi' : 'AI costs'} />
          <div className="text-xs text-fit-muted">{hr ? 'Ukupno potrošeno' : 'Total spent'}: <span className="text-fit-accent font-bold">${aiCost.toFixed(4)}</span></div>
        </Box>
      )}
    </div>
  );
}
