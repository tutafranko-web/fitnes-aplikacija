'use client';

import { useState, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { defaultSoreness, sorenessLevels } from '@/lib/constants/soreness';
import { stretchMap } from '@/lib/constants/muscleMap';
import Box from '@/components/ui/Box';
import Bar from '@/components/ui/Bar';
import Lbl from '@/components/ui/Lbl';
import HyperBody from './HyperBody';

const sorenessColors = ['#00f0b5', '#3ea8ff', '#ffc233', '#ff6b4a', '#ff4d8d'];

export default function BodyTab() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const [side, setSide] = useState<'front' | 'back'>('front');
  const [zoom, setZoom] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const [soreness, setSoreness] = useState<Record<string, number>>({ ...defaultSoreness, shoulders: 2, back: 2, traps: 3 });
  const [bodyPhoto, setBodyPhoto] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [bodyStats, setBodyStats] = useState<{
    bodyFat: number; muscleMass: number; fitLevel: string; score: number; bmi: number;
    weak: string[]; strong: string[];
  } | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) {
      setBodyPhoto(URL.createObjectURL(f));
      setAnalyzing(true);
      // Mock AI analysis (will be replaced with Gemini Vision)
      setTimeout(() => {
        setAnalyzing(false);
        setBodyStats({
          bodyFat: 14.8, muscleMass: 39.2, fitLevel: locale === 'hr' ? 'Napredni' : 'Advanced',
          score: 82, bmi: 24.1,
          weak: locale === 'hr'
            ? ['Ramena — asimetrija', 'Leđa — gornji dio slabiji']
            : ['Shoulders — asymmetry', 'Back — upper part weaker'],
          strong: locale === 'hr'
            ? ['Noge — odlična definicija', 'Prsa — dobra proporcija', 'Trbuh — vidljivi abs']
            : ['Legs — excellent definition', 'Chest — good proportion', 'Abs — visible'],
        });
      }, 3000);
    }
  };

  const cycleS = (id: string) => {
    setSoreness((p) => ({ ...p, [id]: ((p[id] || 0) + 1) % 5 }));
    setSelected(id);
  };

  const sColor = (v: number) => sorenessColors[v];
  const sLabel = (v: number) => {
    const key = v as keyof typeof t.body.soreness;
    return t.body.soreness[key] || '';
  };

  const muscleLabels: Record<string, string> = {
    neck: t.body.muscles.neck,
    shoulders: t.body.muscles.shoulders,
    chest: t.body.muscles.chest,
    biceps: t.body.muscles.biceps,
    forearms: t.body.muscles.forearms,
    triceps: t.body.muscles.triceps,
    core: t.body.muscles.core,
    quads: t.body.muscles.quads,
    hamstrings: t.body.muscles.hamstrings,
    glutes: t.body.muscles.glutes,
    calves: t.body.muscles.calves,
    back: t.body.muscles.back,
    traps: t.body.muscles.traps,
  };

  const painfulMuscles = Object.entries(soreness).filter(([, v]) => v >= 2);

  return (
    <div className="flex flex-col gap-3.5">
      {/* Body Photo Upload */}
      <Box glow="#7c5cfc">
        <Lbl icon="📸" text={t.body.scanBody} color="#7c5cfc" />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="user"
          onChange={handlePhoto}
          className="hidden"
        />

        {!bodyStats ? (
          <div
            onClick={() => fileRef.current?.click()}
            className="w-full rounded-2xl mt-3 cursor-pointer border-2 border-dashed flex flex-col items-center justify-center gap-2 relative overflow-hidden transition-colors"
            style={{
              height: bodyPhoto ? 200 : 120,
              background: bodyPhoto ? `url(${bodyPhoto}) center/cover` : 'rgba(255,255,255,0.02)',
              borderColor: analyzing ? '#7c5cfc' : 'rgba(255,255,255,0.06)',
            }}
          >
            {analyzing ? (
              <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center gap-2.5">
                <div className="w-12 h-12 rounded-full border-[3px] border-fit-secondary border-t-transparent animate-spin-slow" />
                <div className="text-sm text-fit-secondary font-extrabold">{t.body.analyzing}</div>
                <div className="text-[10px] text-fit-muted">{t.body.analyzingDesc}</div>
              </div>
            ) : (
              <>
                <div className="text-[44px]">🤳</div>
                <div className="text-sm text-fit-muted font-bold">{t.body.takePhoto}</div>
                <div className="text-[10px] text-fit-dim">{t.body.photoDesc}</div>
              </>
            )}
          </div>
        ) : (
          <div className="mt-3">
            <div className="flex gap-3 mb-3.5">
              {bodyPhoto && (
                <div
                  className="w-20 h-[100px] rounded-[14px] border-2 border-fit-secondary/20 shrink-0"
                  style={{ background: `url(${bodyPhoto}) center/cover` }}
                />
              )}
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5 mb-2">
                  <span className="text-4xl font-black text-fit-accent">{bodyStats.score}</span>
                  <span className="text-xs text-fit-muted">/100 {t.body.fitScore}</span>
                </div>
                <div className="text-xs text-fit-accent font-extrabold mb-1">{bodyStats.fitLevel}</div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2 mb-3">
              {[
                { l: t.body.bodyFat, v: `${bodyStats.bodyFat}%`, c: '#ff6b4a' },
                { l: t.body.muscle, v: `${bodyStats.muscleMass}kg`, c: '#00f0b5' },
                { l: 'BMI', v: bodyStats.bmi.toString(), c: '#3ea8ff' },
              ].map((s) => (
                <div key={s.l} className="text-center py-2 px-1 rounded-xl" style={{ background: `${s.c}08` }}>
                  <div className="text-[9px] text-fit-dim">{s.l}</div>
                  <div className="text-lg font-black" style={{ color: s.c }}>{s.v}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="p-2.5 rounded-xl bg-fit-accent/[0.04] border border-fit-accent/10">
                <div className="text-[10px] text-fit-accent font-bold mb-1.5">💪 {t.body.strong}</div>
                {bodyStats.strong.map((s, i) => (
                  <div key={i} className="text-[10px] text-fit-muted py-0.5">✅ {s}</div>
                ))}
              </div>
              <div className="p-2.5 rounded-xl bg-fit-warn/[0.04] border border-fit-warn/10">
                <div className="text-[10px] text-fit-warn font-bold mb-1.5">⚠️ {t.body.weak}</div>
                {bodyStats.weak.map((s, i) => (
                  <div key={i} className="text-[10px] text-fit-muted py-0.5">🔸 {s}</div>
                ))}
              </div>
            </div>

            <button
              onClick={() => { setBodyStats(null); setBodyPhoto(null); }}
              className="mt-2.5 w-full bg-white/[0.04] border border-fit-border rounded-xl py-2 px-4 text-fit-muted text-[11px] cursor-pointer font-outfit hover:text-fit-accent transition-colors"
            >
              📸 {t.body.retakePhoto}
            </button>
          </div>
        )}
      </Box>

      {/* BODY MODEL */}
      <Box glow="#7c5cfc">
        <div className="flex justify-between items-center mb-1.5">
          <Lbl icon="🫀" text={side === 'front' ? t.body.front : t.body.back} color="#7c5cfc" />
          <div className="flex gap-1">
            <button
              onClick={() => setSide((s) => (s === 'front' ? 'back' : 'front'))}
              className="bg-fit-secondary/10 border border-fit-secondary/20 rounded-lg py-1 px-2.5 text-fit-secondary cursor-pointer text-[10px] font-extrabold font-outfit"
            >
              🔄 {t.body.flip}
            </button>
            <button
              onClick={() => setZoom((z) => Math.min(1.8, z + 0.2))}
              className="bg-fit-accent/10 border border-fit-accent/20 rounded-lg w-7 h-7 text-fit-accent cursor-pointer text-sm font-black"
            >
              +
            </button>
            <button
              onClick={() => setZoom((z) => Math.max(0.6, z - 0.2))}
              className="bg-fit-accent/10 border border-fit-accent/20 rounded-lg w-7 h-7 text-fit-accent cursor-pointer text-sm font-black"
            >
              −
            </button>
          </div>
        </div>
        <HyperBody soreness={soreness} onMuscleClick={cycleS} selected={selected} zoom={zoom} isFront={side === 'front'} />
      </Box>

      {/* Inflammation Legend */}
      <div className="flex justify-center gap-1.5 flex-wrap">
        {[0, 1, 2, 3, 4].map((v) => (
          <div key={v} className="flex items-center gap-1 py-[3px] px-2 rounded-lg" style={{ background: `${sColor(v)}08` }}>
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: sColor(v), boxShadow: v >= 2 ? `0 0 6px ${sColor(v)}55` : 'none' }}
            />
            <span className="text-[9px] font-semibold" style={{ color: sColor(v) }}>{sLabel(v)}</span>
          </div>
        ))}
      </div>

      {/* Soreness Grid */}
      <Box>
        <Lbl icon="💢" text={t.body.ratePain} />
        <div className="grid grid-cols-2 gap-1.5 mt-2.5">
          {Object.entries(soreness).map(([id, val]) => (
            <div
              key={id}
              onClick={() => cycleS(id)}
              className="flex items-center gap-2 py-2 px-2.5 rounded-xl cursor-pointer transition-all duration-200"
              style={{
                background: `${sColor(val)}08`,
                border: `1px solid ${selected === id ? sColor(val) + '55' : sColor(val) + '22'}`,
                boxShadow: val >= 3 ? `0 0 10px ${sColor(val)}15` : 'none',
              }}
            >
              <div
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: sColor(val), boxShadow: val >= 2 ? `0 0 6px ${sColor(val)}55` : 'none' }}
              />
              <div>
                <div className="text-[11px] font-bold text-fit-text">{muscleLabels[id] || id}</div>
                <div className="text-[9px]" style={{ color: sColor(val) }}>{sLabel(val)}</div>
              </div>
            </div>
          ))}
        </div>
      </Box>

      {/* Stretching / Physio */}
      {painfulMuscles.length > 0 && (
        <Box glow="#ffc233">
          <Lbl icon="🧘" text={t.body.physio} color="#ffc233" />
          <div className="text-[10px] text-fit-dim mb-2.5">{t.body.physioDesc}</div>
          {painfulMuscles.map(([id, val]) => (
            <div
              key={id}
              className="mb-2.5 p-3 rounded-[14px]"
              style={{
                background: `${sColor(val)}06`,
                border: `1px solid ${sColor(val)}18`,
              }}
            >
              <div className="flex items-center gap-1.5 mb-1.5">
                <div
                  className="w-2 h-2 rounded-full"
                  style={{ background: sColor(val), boxShadow: `0 0 6px ${sColor(val)}55` }}
                />
                <span className="text-xs font-extrabold" style={{ color: sColor(val) }}>
                  {muscleLabels[id]} — {sLabel(val)}
                </span>
              </div>
              {(stretchMap[id] || []).map((s, i) => (
                <div key={i} className="text-[11px] text-fit-muted py-[3px] pl-3.5">• {s}</div>
              ))}
            </div>
          ))}
        </Box>
      )}

      {/* Weight */}
      <Box>
        <Lbl icon="⚖️" text={t.body.weight} />
        <div className="flex items-baseline gap-1.5 my-2">
          <span className="text-[28px] font-black text-fit-text">84.3</span>
          <span className="text-fit-muted">kg</span>
          <span className="text-xs text-fit-accent font-bold ml-auto">↓ 3.9 kg</span>
        </div>
        <Bar pct={0} color="#7c5cfc" h={0} />
      </Box>
    </div>
  );
}
