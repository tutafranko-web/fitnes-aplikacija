'use client';

import { useState, useRef, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import Box from '@/components/ui/Box';
import Ring from '@/components/ui/Ring';
import Lbl from '@/components/ui/Lbl';
import { calculateMacros, logMeal, getToday, type MealEntry } from '@/lib/dataStore';

export default function NutritionTab() {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const fileRef = useRef<HTMLInputElement>(null);
  const [scanning, setScanning] = useState(false);
  const [scanResult, setScanResult] = useState<any>(null);
  const [scanError, setScanError] = useState('');
  const [meals, setMeals] = useState<MealEntry[]>([]);
  const [goals, setGoals] = useState({ calories: 2000, protein: 150, carbs: 200, fat: 65 });
  const [dnaRecs, setDnaRecs] = useState<string[]>([]);

  // Load profile + calculate personalized macros + load today's meals
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fit-profile') || '{}');
      if (p.weight && p.height) {
        const macros = calculateMacros(p);
        setGoals(macros);
      }
      // DNA recommendations
      if (p.dna === 'yes') {
        setDnaRecs(hr
          ? ['Laktozna tolerancija: Smanjena — izbjegavaj mliječne proteine', 'Kofein metabolizam: Brz — kava OK prije treninga', 'B12 apsorpcija: Normalna', 'Omega-3 potreba: Povišena — dodaj ribu 3x tjedno', 'Gluten osjetljivost: Niska']
          : ['Lactose tolerance: Reduced — avoid dairy proteins', 'Caffeine metabolism: Fast — coffee OK before training', 'B12 absorption: Normal', 'Omega-3 need: Elevated — add fish 3x/week', 'Gluten sensitivity: Low']
        );
      }
    } catch {}
    const today = getToday();
    setMeals(today.meals || []);
  }, [hr]);

  const totals = meals.reduce((acc, m) => ({
    calories: acc.calories + m.calories,
    protein: acc.protein + m.protein,
    carbs: acc.carbs + m.carbs,
    fat: acc.fat + m.fat,
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // REAL meal scanning with Gemini Vision
  const handleScan = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setScanning(true);
    setScanResult(null);
    setScanError('');

    const formData = new FormData();
    formData.append('photo', f);
    formData.append('locale', locale);

    try {
      const res = await fetch('/api/ai/scan-meal', { method: 'POST', body: formData });
      const data = await res.json();
      if (data.error) {
        setScanError(data.error);
        setScanning(false);
        return;
      }
      setScanResult(data);
      setScanning(false);
    } catch (err: any) {
      setScanError(err?.message || 'Error');
      setScanning(false);
    }
  };

  const addScannedMeal = () => {
    if (!scanResult) return;
    const meal: MealEntry = {
      name: scanResult.name,
      calories: scanResult.calories || 0,
      protein: scanResult.protein || 0,
      carbs: scanResult.carbs || 0,
      fat: scanResult.fat || 0,
      time: new Date().toLocaleTimeString('hr-HR', { hour: '2-digit', minute: '2-digit' }),
      aiScanned: true,
    };
    logMeal(meal);
    setMeals((p) => [...p, meal]);
    setScanResult(null);
  };

  return (
    <div className="flex flex-col gap-3.5">
      {/* Personalized Macro Rings */}
      <Box glow="#00f0b5">
        <Lbl icon="🎯" text={hr ? 'Tvoji makro ciljevi (personalizirano)' : 'Your macro goals (personalized)'} color="#00f0b5" />
        <div className="flex justify-around mt-3">
          <Ring pct={totals.protein / goals.protein} r={28} sw={6} color="#ff6b4a" label="Protein" val={`${totals.protein}g`} sub={`/${goals.protein}g`} />
          <Ring pct={totals.carbs / goals.carbs} r={28} sw={6} color="#ffc233" label={hr ? 'Ugljikoh.' : 'Carbs'} val={`${totals.carbs}g`} sub={`/${goals.carbs}g`} />
          <Ring pct={totals.fat / goals.fat} r={28} sw={6} color="#3ea8ff" label={hr ? 'Masti' : 'Fat'} val={`${totals.fat}g`} sub={`/${goals.fat}g`} />
        </div>
        <div className="mt-3 text-center">
          <span className="text-2xl font-black text-fit-text">{totals.calories}</span>
          <span className="text-xs text-fit-muted ml-1">/ {goals.calories} kcal</span>
        </div>
        <div className="w-full h-1.5 rounded-full bg-white/[0.06] mt-2">
          <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(100, (totals.calories / goals.calories) * 100)}%`, background: 'linear-gradient(90deg, #00f0b5, #3ea8ff)' }} />
        </div>
        <div className="text-[9px] text-fit-dim mt-1 text-center">
          {hr ? `Izračunato: Mifflin-St Jeor BMR × aktivnost × cilj` : `Calculated: Mifflin-St Jeor BMR × activity × goal`}
        </div>
      </Box>

      {/* DNA Recommendations */}
      {dnaRecs.length > 0 && (
        <Box glow="#ff4d8d">
          <Lbl icon="🧬" text={hr ? 'DNK preporuke prehrane' : 'DNA diet recommendations'} color="#ff4d8d" />
          {dnaRecs.map((r, i) => (
            <div key={i} className="text-[11px] text-fit-muted py-1 flex items-start gap-2">
              <span className="text-fit-pink">•</span> {r}
            </div>
          ))}
        </Box>
      )}

      {/* AI Meal Scanner */}
      <Box glow="#7c5cfc">
        <Lbl icon="📸" text={hr ? 'Slikaj obrok — AI kalorije (Gemini Vision)' : 'Scan meal — AI calories (Gemini Vision)'} color="#7c5cfc" />
        <input ref={fileRef} type="file" accept="image/*" capture="environment" onChange={handleScan} className="hidden" />

        {scanning ? (
          <div className="flex flex-col items-center gap-2 py-6">
            <div className="w-12 h-12 rounded-full border-[3px] border-fit-secondary border-t-transparent animate-spin-slow" />
            <div className="text-sm text-fit-secondary font-bold">{hr ? 'Gemini Vision analizira...' : 'Gemini Vision analyzing...'}</div>
            <div className="text-[10px] text-fit-muted">{hr ? 'Prepoznaje hranu, računa kalorije i makroe' : 'Identifying food, calculating calories and macros'}</div>
          </div>
        ) : scanError ? (
          <div className="mt-3 p-3 rounded-xl bg-fit-warn/10 border border-fit-warn/20">
            <div className="text-xs text-fit-warn font-bold">⚠️ {hr ? 'Greška' : 'Error'}</div>
            <div className="text-[10px] text-fit-muted mt-1">{scanError}</div>
            <button onClick={() => { setScanError(''); fileRef.current?.click(); }}
              className="mt-2 text-xs text-fit-accent cursor-pointer bg-transparent border-none font-bold">↻ {hr ? 'Pokušaj ponovno' : 'Try again'}</button>
          </div>
        ) : scanResult ? (
          <div className="mt-3">
            <div className="text-base font-bold text-fit-text mb-1">{scanResult.name}</div>
            {scanResult.portionSize && <div className="text-[10px] text-fit-muted mb-2">{hr ? 'Porcija' : 'Portion'}: {scanResult.portionSize}</div>}
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
            {scanResult.ingredients && (
              <div className="text-[10px] text-fit-muted mb-2">{hr ? 'Sastojci' : 'Ingredients'}: {scanResult.ingredients.join(', ')}</div>
            )}
            <div className="flex items-center gap-3 text-[10px] text-fit-dim mb-3">
              <span>🎯 {hr ? 'Preciznost' : 'Confidence'}: {scanResult.confidence}%</span>
              {scanResult.healthScore && <span>💚 {hr ? 'Zdravlje' : 'Health'}: {scanResult.healthScore}/10</span>}
            </div>
            <div className="flex gap-2">
              <button onClick={addScannedMeal} className="flex-1 py-2.5 rounded-xl text-xs font-bold cursor-pointer border-none" style={{ background: 'linear-gradient(135deg,#00f0b5,#3ea8ff)', color: '#000' }}>
                ✅ {hr ? 'Dodaj u dnevnik' : 'Add to log'}
              </button>
              <button onClick={() => setScanResult(null)} className="py-2.5 px-4 rounded-xl text-xs font-bold cursor-pointer bg-white/[0.04] border border-fit-border text-fit-muted">
                ✕
              </button>
            </div>
          </div>
        ) : (
          <button onClick={() => fileRef.current?.click()} className="w-full mt-3 py-6 rounded-2xl border-2 border-dashed border-fit-border bg-white/[0.02] flex flex-col items-center gap-2 cursor-pointer hover:border-fit-secondary/30 transition-colors">
            <span className="text-4xl">📸</span>
            <span className="text-sm text-fit-muted font-bold">{hr ? 'Slikaj obrok' : 'Scan your meal'}</span>
            <span className="text-[10px] text-fit-dim">{hr ? 'Gemini Vision prepoznaje hranu automatski' : 'Gemini Vision identifies food automatically'}</span>
          </button>
        )}
      </Box>

      {/* Today's Meals */}
      <Box>
        <Lbl icon="🍽️" text={hr ? 'Današnji obroci' : "Today's meals"} />
        {meals.length === 0 ? (
          <div className="text-center py-4 text-[11px] text-fit-dim">{hr ? 'Još nema obroka — skeniraj ili dodaj ručno' : 'No meals yet — scan or add manually'}</div>
        ) : (
          <div className="flex flex-col gap-2 mt-2">
            {meals.map((m, i) => (
              <div key={i} className="flex items-center gap-3 py-2 px-3 rounded-xl bg-white/[0.02] border border-fit-border/50">
                <div className="text-[10px] text-fit-dim font-bold w-10">{m.time}</div>
                <div className="flex-1">
                  <div className="text-xs font-bold text-fit-text">{m.name} {m.aiScanned && <span className="text-[8px] text-fit-secondary">AI</span>}</div>
                  <div className="text-[10px] text-fit-muted">P:{m.protein}g · C:{m.carbs}g · F:{m.fat}g</div>
                </div>
                <div className="text-sm font-black text-fit-accent">{m.calories}</div>
              </div>
            ))}
          </div>
        )}
      </Box>
    </div>
  );
}
