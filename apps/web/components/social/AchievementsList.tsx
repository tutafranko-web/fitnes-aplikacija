'use client';

import { useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { useAchievements, ACHIEVEMENTS } from '@/lib/achievements';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';

export default function AchievementsList() {
  const locale = useLocaleStore(s => s.locale);
  const hr = locale === 'hr';
  const ach = useAchievements();

  useEffect(() => { ach.init(); }, []);

  const unlockedCount = Object.keys(ach.unlocked).length;

  return (
    <Box>
      <div className="flex items-center justify-between">
        <Lbl icon="🏅" text={hr ? 'Postignuća' : 'Achievements'} />
        <span className="text-[10px] text-fit-accent font-bold">{unlockedCount}/{ACHIEVEMENTS.length}</span>
      </div>

      <div className="relative h-2 rounded-full overflow-hidden mt-2 mb-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-700"
          style={{
            width: `${(unlockedCount / ACHIEVEMENTS.length) * 100}%`,
            background: 'linear-gradient(90deg, #ffd700, #ff4d8d)',
          }}
        />
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        {ACHIEVEMENTS.map(a => {
          const isUnlocked = !!ach.unlocked[a.id];
          return (
            <div
              key={a.id}
              className="flex items-center gap-2 p-2 rounded-xl transition-all"
              style={{
                background: isUnlocked ? '#ffd70008' : 'rgba(255,255,255,0.01)',
                border: `1px solid ${isUnlocked ? '#ffd70025' : 'rgba(255,255,255,0.03)'}`,
                opacity: isUnlocked ? 1 : 0.4,
              }}
            >
              <span className="text-lg">{isUnlocked ? a.icon : '🔒'}</span>
              <div>
                <div className="text-[10px] font-bold" style={{ color: isUnlocked ? '#ffd700' : '#445' }}>
                  {hr ? a.nameHr : a.nameEn}
                </div>
                <div className="text-[8px] text-fit-dim">{hr ? a.descHr : a.descEn}</div>
                {isUnlocked && a.coinReward > 0 && (
                  <div className="text-[7px] text-[#ffd700]/60 mt-0.5">+{a.coinReward} 🪙</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Box>
  );
}
