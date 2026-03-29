'use client';

import { useState } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Lbl from '@/components/ui/Lbl';

interface Props {
  muscles: string[];
  onSubmit: (feelings: Record<string, number>, notes: string) => void;
  onSkip: () => void;
}

const FEELINGS = [
  { score: 1, emoji: '😶', hr: 'Ništa ne osjećam', en: 'Feel nothing' },
  { score: 2, emoji: '😌', hr: 'Lagani umor', en: 'Light fatigue' },
  { score: 3, emoji: '💪', hr: 'Dobar pump', en: 'Good pump' },
  { score: 4, emoji: '😮‍💨', hr: 'Jako umoran', en: 'Very tired' },
  { score: 5, emoji: '🤕', hr: 'Boli / pretjerao', en: 'Hurts / overdone' },
];

export default function MuscleJournal({ muscles, onSubmit, onSkip }: Props) {
  const locale = useLocaleStore(s => s.locale);
  const hr = locale === 'hr';
  const [feelings, setFeelings] = useState<Record<string, number>>({});
  const [notes, setNotes] = useState('');

  return (
    <Box glow="#7c5cfc">
      <Lbl icon="📓" text={hr ? 'Mišićni dnevnik' : 'Muscle Journal'} color="#7c5cfc" />
      <div className="text-[10px] text-fit-dim mt-1 mb-3">
        {hr ? 'Kako se osjećaju trenirani mišići?' : 'How do your trained muscles feel?'}
      </div>

      {muscles.map(m => (
        <div key={m} className="mb-3">
          <div className="text-[11px] font-bold text-fit-text mb-1.5 capitalize">{m}</div>
          <div className="flex gap-1">
            {FEELINGS.map(f => (
              <button
                key={f.score}
                onClick={() => setFeelings(p => ({ ...p, [m]: f.score }))}
                className="flex-1 py-1.5 rounded-lg text-center cursor-pointer transition-all border font-outfit"
                style={{
                  background: feelings[m] === f.score ? '#7c5cfc20' : 'rgba(255,255,255,0.02)',
                  borderColor: feelings[m] === f.score ? '#7c5cfc50' : 'rgba(255,255,255,0.04)',
                  transform: feelings[m] === f.score ? 'scale(1.05)' : 'scale(1)',
                }}
              >
                <div className="text-base">{f.emoji}</div>
                <div className="text-[7px] text-fit-dim mt-0.5">{hr ? f.hr : f.en}</div>
              </button>
            ))}
          </div>
        </div>
      ))}

      <textarea
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder={hr ? 'Bilješke (opcionalno)...' : 'Notes (optional)...'}
        className="w-full mt-2 p-2.5 rounded-xl text-[11px] text-fit-text bg-white/[0.02] border border-fit-border resize-none outline-none focus:border-fit-secondary/30 font-outfit"
        rows={2}
      />

      <div className="flex gap-2 mt-3">
        <button
          onClick={() => onSubmit(feelings, notes)}
          className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none"
          style={{ background: 'linear-gradient(135deg, #7c5cfc, #00f0b5)', color: '#fff' }}
        >
          ✅ {hr ? 'Spremi' : 'Save'}
        </button>
        <button
          onClick={onSkip}
          className="py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-dim"
        >
          {hr ? 'Preskoči' : 'Skip'}
        </button>
      </div>
    </Box>
  );
}
