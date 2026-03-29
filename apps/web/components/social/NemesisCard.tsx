'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { useNemesis } from '@/lib/nemesisEngine';
import { useCoinStore } from '@/lib/gamificationStore';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';

export default function NemesisCard() {
  const locale = useLocaleStore(s => s.locale);
  const hr = locale === 'hr';
  const nemesis = useNemesis();
  const coins = useCoinStore();

  useEffect(() => {
    nemesis.init();
    // Auto-generate nemesis if none exists
    if (!nemesis.nemesis) {
      nemesis.generate({
        weeklyVolume: 8000,
        weeklyWorkouts: 3,
        streak: coins.streak || 1,
        level: 5,
      });
    }
  }, []);

  const n = nemesis.nemesis;
  if (!n) return null;

  return (
    <Box glow="#ff4d8d">
      <Lbl icon="👹" text={hr ? 'Tvoj rival' : 'Your Nemesis'} color="#ff4d8d" />

      <div className="flex items-center gap-3 mt-2.5">
        <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{ background: '#ff4d8d15', border: '2px solid #ff4d8d30' }}>
          {n.avatar}
        </div>
        <div className="flex-1">
          <div className="text-sm font-black text-fit-text">{n.name}</div>
          <div className="text-[10px] text-fit-dim">{n.city} · Level {n.level}</div>
        </div>
        <div className="text-right">
          <div className="text-xs font-bold text-[#ff4d8d]">🔥 {n.streak}d</div>
          <div className="text-[9px] text-fit-dim">streak</div>
        </div>
      </div>

      {/* VS Comparison */}
      <div className="grid grid-cols-3 gap-1.5 mt-3">
        {[
          { label: hr ? 'Volumen/tj' : 'Vol/week', rival: `${(n.weeklyVolume / 1000).toFixed(1)}t`, you: '-', icon: '🏋️' },
          { label: hr ? 'Treninzi/tj' : 'Workouts/wk', rival: n.weeklyWorkouts.toString(), you: '-', icon: '📅' },
          { label: 'Streak', rival: `${n.streak}d`, you: `${coins.streak}d`, icon: '🔥' },
        ].map(s => (
          <div key={s.label} className="text-center p-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div className="text-[8px] text-fit-dim mb-1">{s.icon} {s.label}</div>
            <div className="text-[10px] text-[#ff4d8d] font-bold">{s.rival}</div>
            <div className="text-[8px] text-fit-dim my-0.5">vs</div>
            <div className="text-[10px] text-fit-accent font-bold">{s.you}</div>
          </div>
        ))}
      </div>

      <div className="mt-2.5 text-[10px] text-fit-dim text-center italic">
        {hr
          ? `"${n.name} je danas odradio trening. A ti?"`
          : `"${n.name} trained today. Did you?"`}
      </div>

      {/* Defeated Rivals */}
      {nemesis.defeatedRivals.length > 0 && (
        <div className="mt-3 pt-2 border-t border-fit-border">
          <div className="text-[9px] text-fit-dim font-bold mb-1">
            {hr ? `Poraženi rivali (${nemesis.defeatedRivals.length})` : `Defeated Rivals (${nemesis.defeatedRivals.length})`}
          </div>
          <div className="flex gap-1 flex-wrap">
            {nemesis.defeatedRivals.slice(0, 5).map((r, i) => (
              <span key={i} className="text-[9px] px-1.5 py-0.5 rounded bg-fit-accent/10 text-fit-accent font-semibold">
                {r.avatar} {r.name}
              </span>
            ))}
          </div>
        </div>
      )}
    </Box>
  );
}
