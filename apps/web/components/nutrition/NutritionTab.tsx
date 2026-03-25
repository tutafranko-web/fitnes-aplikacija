'use client';

import { useState, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Ring from '@/components/ui/Ring';
import Lbl from '@/components/ui/Lbl';

interface Meal {
  id: string;
  name: string;
  time: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  photo?: string;
  aiScanned: boolean;
}

export default function NutritionTab() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);

  const [meals] = useState<Meal[]>([
    { id: '1', name: locale === 'hr' ? 'Zobene + whey' : 'Oats + whey', time: '07:30', calories: 480, protein: 35, carbs: 52, fat: 12, aiScanned: false },
    { id: '2', name: locale === 'hr' ? 'Piletina + riža' : 'Chicken + rice', time: '12:30', calories: 620, protein: 45, carbs: 65, fat: 14, aiScanned: false },
    { id: '3', name: locale === 'hr' ? 'Protein shake' : 'Protein shake', time: '15:00', calories: 220, protein: 30, carbs: 8, fat: 5, aiScanned: false },
  ]);

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const goals = { calories: 2280, protein: 185, carbs: 240, fat: 65 };

  const handleScan = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setScanning(true);
      setScanResult(null);
      // Mock AI scan (will use Gemini Vision)
      setTimeout(() => {
        setScanning(false);
        setScanResult({
          name: locale === 'hr' ? 'Losos sa povrćem' : 'Salmon with vegetables',
          calories: 540,
          protein: 38,
          carbs: 22,
          fat: 28,
          fiber: 6,
          confidence: 87,
          ingredients: locale === 'hr'
            ? ['Losos', 'Brokula', 'Batat', 'Maslinovo ulje']
            : ['Salmon', 'Broccoli', 'Sweet potato', 'Olive oil'],
        });
      }, 2500);
    }
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Macro Rings */}
      <Box glow="#00f0b5">
        <Lbl icon="🎯" text={locale === 'hr' ? 'Dnevni makroi' : 'Daily macros'} color="#00f0b5" />
        <div className="flex justify-around mt-3">
          <Ring pct={totals.protein / goals.protein} r={28} sw={6} color="#ff6b4a" label="Protein" val={`${totals.protein}g`} sub={`/${goals.protein}g`} />
          <Ring pct={totals.carbs / goals.carbs} r={28} sw={6} color="#ffc233" label={locale === 'hr' ? 'Ugljikoh.' : 'Carbs'} val={`${totals.carbs}g`} sub={`/${goals.carbs}g`} />
          <Ring pct={totals.fat / goals.fat} r={28} sw={6} color="#3ea8ff" label={locale === 'hr' ? 'Masti' : 'Fat'} val={`${totals.fat}g`} sub={`/${goals.fat}g`} />
        </div>
        <div className="mt-3 text-center">
          <span className="text-2xl font-black text-fit-text">{totals.calories}</span>
          <span className="text-xs text-fit-muted ml-1">/ {goals.calories} kcal</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] mt-2">
          <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, (totals.calories / goals.calories) * 100)}%`, background: 'linear-gradient(90deg, #00f0b5, #3ea8ff)' }} />
        </div>
      </Box>

      {/* Scan Meal */}
      <Box glow="#7c5cfc">
        <Lbl icon="📸" text={locale === 'hr' ? 'Slikaj obrok — AI kalorije' : 'Scan meal — AI calories'} color="#7c5cfc" />
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleScan} className="hidden" />

        {scanning ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-12 h-12 rounded-full border-[3px] border-fit-secondary border-t-transparent animate-spin-slow" />
            <div className="text-sm text-fit-secondary font-bold">{locale === 'hr' ? 'AI skenira obrok...' : 'AI scanning meal...'}</div>
          </div>
        ) : scanResult ? (
          <div className="mt-3">
            <div className="text-base font-bold text-fit-text mb-2">{scanResult.name}</div>
            <div className="grid grid-cols-4 gap-2 mb-3">
              {[
                { l: 'kcal', v: scanResult.calories, c: '#00f0b5' },
                { l: 'P', v: `${scanResult.protein}g`, c: '#ff6b4a' },
                { l: 'C', v: `${scanResult.carbs}g`, c: '#ffc233' },
                { l: 'F', v: `${scanResult.fat}g`, c: '#3ea8ff' },
              ].map((x) => (
                <div key={x.l} className="text-center py-2 rounded-xl" style={{ background: `${x.c}08` }}>
                  <div className="text-[9px] text-fit-dim">{x.l}</div>
                  <div className="text-sm font-black" style={{ color: x.c }}>{x.v}</div>
                </div>
              ))}
            </div>
            <div className="text-[10px] text-fit-muted mb-2">
              {locale === 'hr' ? 'Sastojci' : 'Ingredients'}: {scanResult.ingredients.join(', ')}
            </div>
            <div className="flex items-center gap-2 text-[10px] text-fit-dim">
              <span>🎯 {locale === 'hr' ? 'Preciznost' : 'Confidence'}: {scanResult.confidence}%</span>
            </div>
            <div className="flex gap-2 mt-3">
              <button className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none" style={{ background: 'linear-gradient(135deg,#00f0b5,#3ea8ff)', color: '#000' }}>
                ✅ {locale === 'hr' ? 'Dodaj' : 'Add'}
              </button>
              <button onClick={() => setScanResult(null)} className="py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                ✏️ {locale === 'hr' ? 'Ispravi' : 'Edit'}
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} className="w-full mt-3 py-6 rounded-2xl border-2 border-dashed border-fit-border bg-white/[0.02] flex flex-col items-center gap-2 cursor-pointer hover:border-fit-secondary/30 transition-colors">
            <span className="text-4xl">📸</span>
            <span className="text-sm text-fit-muted font-bold">{locale === 'hr' ? 'Slikaj obrok' : 'Scan your meal'}</span>
            <span className="text-[10px] text-fit-dim">{locale === 'hr' ? 'AI prepoznaje hranu i računa kalorije' : 'AI recognizes food and calculates calories'}</span>
          </button>
        )}
      </Box>

      {/* Meals Today */}
      <Box>
        <Lbl icon="🍽️" text={locale === 'hr' ? 'Današnji obroci' : "Today's meals"} />
        <div className="flex flex-col gap-2 mt-2">
          {meals.map((m) => (
            <div key={m.id} className="flex items-center gap-3 py-2.5 px-3 rounded-xl bg-white/[0.02] border border-fit-border/50">
              <div className="text-[10px] text-fit-dim font-bold w-10">{m.time}</div>
              <div className="flex-1">
                <div className="text-xs font-bold text-fit-text">{m.name}</div>
                <div className="text-[10px] text-fit-muted">
                  P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g
                </div>
              </div>
              <div className="text-sm font-black text-fit-accent">{m.calories}</div>
              <div className="text-[9px] text-fit-dim">kcal</div>
            </div>
          ))}
        </div>
        <button className="w-full mt-3 py-2.5 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted hover:text-fit-accent transition-colors">
          + {locale === 'hr' ? 'Dodaj obrok ručno' : 'Add meal manually'}
        </button>
      </Box>
    </div>
  );
}
