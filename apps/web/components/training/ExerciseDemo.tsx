'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { type ExerciseInfo } from '@/lib/constants/exerciseDB';
import Box from '@/components/ui/Box';

interface Props {
  exercise: ExerciseInfo & { images?: string[] };
  onClose: () => void;
}

export default function ExerciseDemo({ exercise, onClose }: Props) {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [imgFrame, setImgFrame] = useState(0);
  const [playing, setPlaying] = useState(true);

  const images = (exercise as any).images as string[] | undefined;
  const hasImages = images && images.length > 0;

  // Animate between images (creates GIF-like effect)
  useEffect(() => {
    if (!playing || !hasImages || images.length <= 1) return;
    const iv = setInterval(() => setImgFrame((f) => (f + 1) % images.length), 800);
    return () => clearInterval(iv);
  }, [playing, hasImages, images]);

  const muscleColors: Record<string, string> = {
    chest: '#ff6b4a', back: '#3ea8ff', shoulders: '#ffc233', biceps: '#ff4d8d',
    triceps: '#ff4d8d', quads: '#00f0b5', hamstrings: '#7c5cfc', glutes: '#ff6b4a',
    core: '#ffc233', calves: '#3ea8ff', traps: '#ffc233', forearms: '#ff4d8d',
    full_body: '#00f0b5',
  };
  const primaryColor = muscleColors[(exercise.primary as string[])[0]] || '#00f0b5';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-[400px] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <Box glow={primaryColor}>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-base font-bold text-fit-text">{hr ? exercise.nameHr : exercise.name}</div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {(exercise.primary as string[]).map((m) => (
                  <span key={m} className="text-[8px] py-0.5 px-1.5 rounded-full font-bold" style={{ background: `${primaryColor}20`, color: primaryColor }}>{m}</span>
                ))}
                {(exercise.secondary as string[]).map((m) => (
                  <span key={m} className="text-[8px] py-0.5 px-1.5 rounded-full bg-white/[0.06] text-fit-muted">{m}</span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="text-fit-muted text-lg cursor-pointer bg-transparent border-none">✕</button>
          </div>

          {/* Image Animation (real exercise photos) */}
          {hasImages ? (
            <div className="bg-white rounded-xl overflow-hidden mb-3 relative" style={{ minHeight: 220 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={images[imgFrame]}
                alt={exercise.name}
                className="w-full object-contain"
                style={{ maxHeight: 280 }}
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />

              {/* Frame indicator */}
              {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5">
                  {images.map((_, i) => (
                    <div key={i} className="w-2.5 h-2.5 rounded-full transition-all cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); setImgFrame(i); }}
                      style={{ background: i === imgFrame ? primaryColor : 'rgba(0,0,0,0.3)', border: '1px solid rgba(255,255,255,0.5)' }} />
                  ))}
                </div>
              )}

              {/* Play/pause */}
              {images.length > 1 && (
                <button onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer border-none"
                  style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                  {playing ? '⏸' : '▶'}
                </button>
              )}

              {/* Phase label */}
              {images.length === 2 && (
                <div className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full"
                  style={{ background: primaryColor, color: '#000' }}>
                  {imgFrame === 0 ? (hr ? 'Početna pozicija' : 'Starting position') : (hr ? 'Završna pozicija' : 'End position')}
                </div>
              )}
            </div>
          ) : (
            /* Fallback: simple text description */
            <div className="bg-[#0a0e1a] rounded-xl p-6 mb-3 text-center">
              <div className="text-4xl mb-2">🏋️</div>
              <div className="text-xs text-fit-muted">{hr ? 'Prati instrukcije ispod' : 'Follow instructions below'}</div>
            </div>
          )}

          {/* Info */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-fit-dim font-bold uppercase mb-1">{hr ? 'Kako izvesti' : 'How to perform'}</div>
              <div className="text-xs text-fit-text leading-relaxed">{hr ? exercise.instructions.hr : exercise.instructions.en}</div>
            </div>

            {exercise.tips?.hr && (
              <div>
                <div className="text-[10px] text-fit-dim font-bold uppercase mb-1">{hr ? 'Savjeti' : 'Tips'}</div>
                <div className="text-xs text-fit-muted leading-relaxed">💡 {hr ? exercise.tips.hr : exercise.tips.en}</div>
              </div>
            )}

            <div className="flex gap-2 flex-wrap">
              <div className="text-[10px] text-fit-dim">{hr ? 'Preporučeno' : 'Recommended'}: <span className="text-fit-text font-bold">{exercise.defaultSets}×{exercise.defaultReps}</span></div>
              <div className="text-[10px] text-fit-dim">{hr ? 'Odmor' : 'Rest'}: <span className="text-fit-text font-bold">{exercise.defaultRest}s</span></div>
              <div className="text-[10px] text-fit-dim">{hr ? 'Težina' : 'Difficulty'}: <span className="font-bold" style={{ color: exercise.difficulty === 'beginner' ? '#00f0b5' : exercise.difficulty === 'intermediate' ? '#ffc233' : '#ff6b4a' }}>{exercise.difficulty}</span></div>
            </div>

            {(exercise.equipment as string[]).length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {(exercise.equipment as string[]).map((eq) => (
                  <span key={eq} className="text-[9px] py-0.5 px-2 rounded-full bg-white/[0.06] text-fit-muted">{eq}</span>
                ))}
              </div>
            )}

            {(exercise.injuryCaution || exercise.injuryAvoid) && (
              <div className="p-2 rounded-xl bg-fit-warn/10 border border-fit-warn/20">
                <div className="text-[10px] text-fit-warn font-bold">⚠️ {hr ? 'Pažnja pri ozljedama' : 'Injury caution'}</div>
                {exercise.injuryAvoid && <div className="text-[9px] text-fit-warn mt-0.5">🚫 {exercise.injuryAvoid.join(', ')}</div>}
                {exercise.injuryCaution && <div className="text-[9px] text-fit-muted mt-0.5">⚠️ {exercise.injuryCaution.join(', ')}</div>}
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
