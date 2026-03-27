'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { type ExerciseInfo, muscleGroupLabels } from '@/lib/constants/exerciseDB';
import Box from '@/components/ui/Box';

interface Props {
  exercise: ExerciseInfo;
  onClose: () => void;
}

export default function ExerciseDemo({ exercise, onClose }: Props) {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [frame, setFrame] = useState(0);
  const [playing, setPlaying] = useState(true);
  const [imgLoaded, setImgLoaded] = useState<boolean[]>([]);

  const images = exercise.images || [];
  const hasImages = images.length >= 2;

  // Create 4-frame loop from 2 images: img0 → img1 → img0 → img1 (smooth GIF)
  // With crossfade we get: start → end → start → end at 600ms per frame
  const frameCount = hasImages ? 4 : 0;

  useEffect(() => {
    if (!playing || !hasImages) return;
    const iv = setInterval(() => setFrame((f) => (f + 1) % frameCount), 700);
    return () => clearInterval(iv);
  }, [playing, hasImages, frameCount]);

  // Preload images
  useEffect(() => {
    if (!hasImages) return;
    const loaded = new Array(images.length).fill(false);
    images.forEach((src, i) => {
      const img = new Image();
      img.onload = () => { loaded[i] = true; setImgLoaded([...loaded]); };
      img.src = src;
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Current image index: 0,1,0,1 pattern
  const currentImgIdx = hasImages ? (frame % 2) : 0;
  const phaseLabels = hr
    ? ['Početna pozicija', 'Pokret', 'Završna pozicija', 'Povratak']
    : ['Starting position', 'Movement', 'End position', 'Return'];

  const primaryColor = (() => {
    const colors: Record<string, string> = {
      chest: '#ff6b4a', back: '#3ea8ff', shoulders: '#ffc233', biceps: '#ff4d8d',
      triceps: '#ff4d8d', quads: '#00f0b5', hamstrings: '#7c5cfc', glutes: '#ff6b4a',
      core: '#ffc233', calves: '#3ea8ff', traps: '#ffc233', forearms: '#ff4d8d', full_body: '#00f0b5',
    };
    return colors[exercise.primary[0]] || '#00f0b5';
  })();

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3" onClick={onClose}>
      <div className="w-full max-w-[420px] max-h-[92vh] overflow-auto rounded-3xl" onClick={(e) => e.stopPropagation()}>
        <Box glow={primaryColor} className="!rounded-3xl">
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div className="flex-1 min-w-0">
              <div className="text-lg font-black text-fit-text">{exercise.name}</div>
              <div className="flex gap-1.5 mt-1.5 flex-wrap">
                {exercise.primary.map((m) => (
                  <span key={m} className="text-[9px] py-0.5 px-2 rounded-full font-bold" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                    {muscleGroupLabels[m]?.[hr ? 'hr' : 'en'] || m}
                  </span>
                ))}
                {exercise.secondary.map((m) => (
                  <span key={m} className="text-[9px] py-0.5 px-2 rounded-full bg-white/[0.06] text-fit-muted">
                    {muscleGroupLabels[m]?.[hr ? 'hr' : 'en'] || m}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-full bg-white/[0.06] flex items-center justify-center text-fit-muted text-sm cursor-pointer border-none hover:bg-white/[0.12] transition-colors">✕</button>
          </div>

          {/* GIF Animation */}
          {hasImages ? (
            <div className="bg-white rounded-2xl overflow-hidden mb-4 relative" style={{ minHeight: 250 }}>
              {/* Both images stacked, crossfade between them */}
              <div className="relative" style={{ minHeight: 250 }}>
                {images.map((src, i) => (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    key={i}
                    src={src}
                    alt={`${exercise.name} - ${i === 0 ? 'start' : 'end'}`}
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-300"
                    style={{ opacity: currentImgIdx === i ? 1 : 0 }}
                    onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                  />
                ))}
              </div>

              {/* Phase label */}
              <div className="absolute top-3 left-3 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-lg"
                style={{ background: primaryColor, color: '#000' }}>
                {phaseLabels[frame]}
              </div>

              {/* Play/pause */}
              <button onClick={(e) => { e.stopPropagation(); setPlaying(!playing); }}
                className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-xs cursor-pointer border-none shadow-lg"
                style={{ background: 'rgba(0,0,0,0.6)', color: '#fff' }}>
                {playing ? '⏸' : '▶'}
              </button>

              {/* Frame dots */}
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {[0, 1, 2, 3].map((i) => (
                  <div key={i} className="w-2 h-2 rounded-full transition-all cursor-pointer"
                    onClick={(e) => { e.stopPropagation(); setFrame(i); }}
                    style={{
                      background: i === frame ? primaryColor : 'rgba(0,0,0,0.3)',
                      border: '1.5px solid rgba(255,255,255,0.6)',
                      transform: i === frame ? 'scale(1.3)' : 'scale(1)',
                    }} />
                ))}
              </div>

              {/* Rep counter animation */}
              <div className="absolute bottom-3 right-3 text-[9px] font-bold px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(0,0,0,0.5)', color: '#fff' }}>
                {Math.floor(frame / 2) + 1}/2 rep
              </div>
            </div>
          ) : (
            <div className="bg-[#0a0e1a] rounded-2xl p-8 mb-4 text-center">
              <div className="text-5xl mb-3">🏋️</div>
              <div className="text-xs text-fit-muted">{hr ? 'Prati instrukcije ispod' : 'Follow instructions below'}</div>
            </div>
          )}

          {/* Exercise Info */}
          <div className="space-y-4">
            {/* Instructions */}
            <div>
              <div className="text-[10px] text-fit-dim font-bold uppercase tracking-wider mb-1.5">{hr ? 'Kako izvesti' : 'How to perform'}</div>
              <div className="text-[13px] text-fit-text leading-relaxed">{exercise.instructions[hr ? 'hr' : 'en']}</div>
            </div>

            {/* Tips */}
            {exercise.tips?.[hr ? 'hr' : 'en'] && (
              <div className="p-3 rounded-xl" style={{ background: `${primaryColor}08`, border: `1px solid ${primaryColor}22` }}>
                <div className="text-[10px] font-bold mb-1" style={{ color: primaryColor }}>💡 {hr ? 'Savjeti' : 'Tips'}</div>
                <div className="text-xs text-fit-muted leading-relaxed">{exercise.tips[hr ? 'hr' : 'en']}</div>
              </div>
            )}

            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center py-2 rounded-xl bg-white/[0.03]">
                <div className="text-sm font-black text-fit-text">{exercise.defaultSets}×{exercise.defaultReps}</div>
                <div className="text-[8px] text-fit-dim">{hr ? 'Setovi×Rep' : 'Sets×Reps'}</div>
              </div>
              <div className="text-center py-2 rounded-xl bg-white/[0.03]">
                <div className="text-sm font-black text-fit-text">{exercise.defaultRest}s</div>
                <div className="text-[8px] text-fit-dim">{hr ? 'Odmor' : 'Rest'}</div>
              </div>
              <div className="text-center py-2 rounded-xl bg-white/[0.03]">
                <div className="text-sm font-black" style={{ color: exercise.difficulty === 'beginner' ? '#00f0b5' : exercise.difficulty === 'intermediate' ? '#ffc233' : '#ff6b4a' }}>
                  {exercise.difficulty === 'beginner' ? '🌱' : exercise.difficulty === 'intermediate' ? '⚡' : '🔥'}
                </div>
                <div className="text-[8px] text-fit-dim">{exercise.difficulty}</div>
              </div>
            </div>

            {/* Equipment */}
            {exercise.equipment.length > 0 && (
              <div className="flex gap-1.5 flex-wrap">
                {exercise.equipment.map((eq) => (
                  <span key={eq} className="text-[9px] py-1 px-2.5 rounded-full bg-white/[0.06] text-fit-muted font-semibold">{eq}</span>
                ))}
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
