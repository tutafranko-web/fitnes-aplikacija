'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import { type ExerciseInfo } from '@/lib/constants/exerciseDB';
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

  const defaultFrames = [{ torsoAngle: 0, armAngle: 0, legAngle: 0, label: 'Start' }, { torsoAngle: 20, armAngle: 60, legAngle: 30, label: 'Move' }, { torsoAngle: 0, armAngle: 0, legAngle: 0, label: 'Return' }];
  const frames = exercise.animation?.frames || defaultFrames;
  const numFrames = frames.length;

  useEffect(() => {
    if (!playing || numFrames <= 1) return;
    const tempo = exercise.animation?.tempo || '2-0-2-0';
    const speed = tempo === 'explosive' || tempo === 'fast' ? 400 : 800;
    const iv = setInterval(() => setFrame((f) => (f + 1) % numFrames), speed);
    return () => clearInterval(iv);
  }, [playing, numFrames, exercise.animation?.tempo]);

  const f = frames[frame] || frames[0];

  // Stick figure renderer
  const headY = 25;
  const shoulderY = 40;
  const hipY = 70;
  const torsoLen = hipY - shoulderY;

  // Calculate positions based on frame data
  const rad = (deg: number) => (deg * Math.PI) / 180;
  const torsoEndX = 60 + Math.sin(rad(f.torsoAngle)) * torsoLen;
  const torsoEndY = shoulderY + Math.cos(rad(f.torsoAngle)) * torsoLen;

  // Arms
  const armLen = 22;
  const armAngleRad = rad(f.armAngle);
  const lArmX = 60 - 12 + Math.sin(armAngleRad) * armLen * -0.7;
  const lArmY = shoulderY + Math.cos(armAngleRad) * armLen * 0.5;
  const rArmX = 60 + 12 + Math.sin(armAngleRad) * armLen * 0.7;
  const rArmY = shoulderY + Math.cos(armAngleRad) * armLen * 0.5;

  // Legs
  const legLen = 28;
  const legAngleRad = rad(f.legAngle);
  const kneeY = torsoEndY + Math.cos(legAngleRad) * legLen * 0.6;
  const footY = kneeY + legLen * 0.5;
  const lKneeX = torsoEndX - 8 - Math.sin(legAngleRad) * 6;
  const rKneeX = torsoEndX + 8 + Math.sin(legAngleRad) * 6;

  const muscleColors: Record<string, string> = {
    chest: '#ff6b4a', back: '#3ea8ff', shoulders: '#ffc233', biceps: '#ff4d8d',
    triceps: '#ff4d8d', quads: '#00f0b5', hamstrings: '#7c5cfc', glutes: '#ff6b4a',
    core: '#ffc233', calves: '#3ea8ff', traps: '#ffc233', forearms: '#ff4d8d',
    full_body: '#00f0b5',
  };
  const primaryColor = muscleColors[exercise.primary[0]] || '#00f0b5';

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4" onClick={onClose}>
      <div className="w-full max-w-[400px] max-h-[90vh] overflow-auto" onClick={(e) => e.stopPropagation()}>
        <Box glow={primaryColor}>
          {/* Header */}
          <div className="flex justify-between items-start mb-3">
            <div>
              <div className="text-base font-bold text-fit-text">{hr ? exercise.nameHr : exercise.name}</div>
              <div className="flex gap-1 mt-1 flex-wrap">
                {exercise.primary.map((m) => (
                  <span key={m} className="text-[8px] py-0.5 px-1.5 rounded-full font-bold" style={{ background: `${primaryColor}20`, color: primaryColor }}>
                    {m}
                  </span>
                ))}
                {exercise.secondary.map((m) => (
                  <span key={m} className="text-[8px] py-0.5 px-1.5 rounded-full bg-white/[0.06] text-fit-muted">{m}</span>
                ))}
              </div>
            </div>
            <button onClick={onClose} className="text-fit-muted text-lg cursor-pointer bg-transparent border-none">✕</button>
          </div>

          {/* Animation */}
          <div className="bg-[#0a0e1a] rounded-xl p-2 mb-3 relative">
            <svg viewBox="0 0 120 130" className="w-full" style={{ maxHeight: 200 }}>
              {/* Grid background */}
              {[0, 20, 40, 60, 80, 100, 120].map((x) => (
                <line key={`gx${x}`} x1={x} y1="0" x2={x} y2="130" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              ))}
              {[0, 20, 40, 60, 80, 100, 120].map((y) => (
                <line key={`gy${y}`} x1="0" y1={y} x2="120" y2={y} stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
              ))}

              {/* Stick figure */}
              {/* Head */}
              <circle cx="60" cy={headY} r="8" fill="none" stroke={primaryColor} strokeWidth="2" />
              <circle cx="57" cy={headY - 1} r="1.5" fill={primaryColor} opacity=".6" />
              <circle cx="63" cy={headY - 1} r="1.5" fill={primaryColor} opacity=".6" />

              {/* Torso */}
              <line x1="60" y1={shoulderY - 3} x2={torsoEndX} y2={torsoEndY} stroke={primaryColor} strokeWidth="3" strokeLinecap="round" />

              {/* Shoulders */}
              <line x1={60 - 12} y1={shoulderY} x2={60 + 12} y2={shoulderY} stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />

              {/* Left arm */}
              <line x1={60 - 12} y1={shoulderY} x2={lArmX} y2={lArmY + 10} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".8" />
              <circle cx={lArmX} cy={lArmY + 12} r="3" fill={primaryColor} opacity=".5" />

              {/* Right arm */}
              <line x1={60 + 12} y1={shoulderY} x2={rArmX} y2={rArmY + 10} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".8" />
              <circle cx={rArmX} cy={rArmY + 12} r="3" fill={primaryColor} opacity=".5" />

              {/* Hips */}
              <line x1={torsoEndX - 8} y1={torsoEndY} x2={torsoEndX + 8} y2={torsoEndY} stroke={primaryColor} strokeWidth="2.5" strokeLinecap="round" />

              {/* Left leg */}
              <line x1={torsoEndX - 8} y1={torsoEndY} x2={lKneeX} y2={kneeY} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".8" />
              <line x1={lKneeX} y1={kneeY} x2={lKneeX - 2} y2={footY} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".6" />

              {/* Right leg */}
              <line x1={torsoEndX + 8} y1={torsoEndY} x2={rKneeX} y2={kneeY} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".8" />
              <line x1={rKneeX} y1={kneeY} x2={rKneeX + 2} y2={footY} stroke={primaryColor} strokeWidth="2" strokeLinecap="round" opacity=".6" />

              {/* Highlighted primary muscles */}
              {exercise.primary.includes('chest') && <ellipse cx="60" cy={shoulderY + 6} rx="10" ry="5" fill={primaryColor} opacity=".15" />}
              {exercise.primary.includes('back') && <ellipse cx="60" cy={shoulderY + 12} rx="9" ry="8" fill={primaryColor} opacity=".12" />}
              {exercise.primary.includes('quads') && <><ellipse cx={lKneeX} cy={(torsoEndY + kneeY) / 2} rx="4" ry="8" fill={primaryColor} opacity=".15" /><ellipse cx={rKneeX} cy={(torsoEndY + kneeY) / 2} rx="4" ry="8" fill={primaryColor} opacity=".15" /></>}
              {exercise.primary.includes('core') && <ellipse cx={torsoEndX} cy={(shoulderY + torsoEndY) / 2 + 8} rx="8" ry="6" fill={primaryColor} opacity=".15" />}

              {/* Frame label */}
              {frames[frame]?.label && (
                <text x="60" y="125" textAnchor="middle" fill={primaryColor} fontSize="7" fontWeight="700">{frames[frame].label}</text>
              )}
            </svg>

            {/* Frame indicator */}
            <div className="flex justify-center gap-1 mt-1">
              {frames.map((_, i) => (
                <div key={i} className="w-2 h-2 rounded-full transition-all" style={{ background: i === frame ? primaryColor : 'rgba(255,255,255,0.1)' }} />
              ))}
            </div>

            {/* Play/pause */}
            <button onClick={() => setPlaying(!playing)}
              className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-xs cursor-pointer border-none"
              style={{ background: `${primaryColor}30`, color: primaryColor }}>
              {playing ? '⏸' : '▶'}
            </button>
          </div>

          {/* Info */}
          <div className="space-y-3">
            <div>
              <div className="text-[10px] text-fit-dim font-bold uppercase mb-1">{hr ? 'Kako izvesti' : 'How to perform'}</div>
              <div className="text-xs text-fit-text leading-relaxed">{hr ? exercise.instructions.hr : exercise.instructions.en}</div>
            </div>

            <div>
              <div className="text-[10px] text-fit-dim font-bold uppercase mb-1">{hr ? 'Savjeti' : 'Tips'}</div>
              <div className="text-xs text-fit-muted leading-relaxed">💡 {hr ? exercise.tips.hr : exercise.tips.en}</div>
            </div>

            <div className="flex gap-2 flex-wrap">
              <div className="text-[10px] text-fit-dim">{hr ? 'Preporučeno' : 'Recommended'}: <span className="text-fit-text font-bold">{exercise.defaultSets}×{exercise.defaultReps}</span></div>
              <div className="text-[10px] text-fit-dim">{hr ? 'Odmor' : 'Rest'}: <span className="text-fit-text font-bold">{exercise.defaultRest}s</span></div>
              <div className="text-[10px] text-fit-dim">Tempo: <span className="text-fit-text font-bold">{exercise.animation?.tempo || '2-0-2-0'}</span></div>
              <div className="text-[10px] text-fit-dim">{hr ? 'Težina' : 'Difficulty'}: <span className="font-bold" style={{ color: exercise.difficulty === 'beginner' ? '#00f0b5' : exercise.difficulty === 'intermediate' ? '#ffc233' : '#ff6b4a' }}>{exercise.difficulty}</span></div>
            </div>

            {exercise.equipment.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {exercise.equipment.map((eq) => (
                  <span key={eq} className="text-[9px] py-0.5 px-2 rounded-full bg-white/[0.06] text-fit-muted">{eq}</span>
                ))}
              </div>
            )}

            {(exercise.injuryCaution || exercise.injuryAvoid) && (
              <div className="p-2 rounded-xl bg-fit-warn/10 border border-fit-warn/20">
                <div className="text-[10px] text-fit-warn font-bold">⚠️ {hr ? 'Pažnja pri ozljedama' : 'Injury caution'}</div>
                {exercise.injuryAvoid && <div className="text-[9px] text-fit-warn mt-0.5">🚫 {hr ? 'Izbjegavaj' : 'Avoid'}: {exercise.injuryAvoid.join(', ')}</div>}
                {exercise.injuryCaution && <div className="text-[9px] text-fit-muted mt-0.5">⚠️ {hr ? 'Prilagodi' : 'Adapt'}: {exercise.injuryCaution.join(', ')}</div>}
              </div>
            )}
          </div>
        </Box>
      </div>
    </div>
  );
}
