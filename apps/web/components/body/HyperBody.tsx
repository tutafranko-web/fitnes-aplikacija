'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { getInflammationStyle } from '@/lib/constants/soreness';

interface Props {
  soreness: Record<string, number>;
  onMuscleClick: (group: string) => void;
  selected: string | null;
  zoom: number;
  isFront: boolean;
}

// Clickable muscle zones mapped over the anatomy image
// Coordinates are percentages of image dimensions
interface MuscleZone {
  id: string;
  group: string; // soreness key
  x: number; y: number; w: number; h: number; // % of half-image
}

// FRONT body zones (left half of image)
const frontZones: MuscleZone[] = [
  // Neck
  { id: 'neck_f', group: 'neck', x: 40, y: 10, w: 20, h: 5 },
  // Shoulders
  { id: 'shoulders_l_f', group: 'shoulders', x: 15, y: 14, w: 18, h: 8 },
  { id: 'shoulders_r_f', group: 'shoulders', x: 67, y: 14, w: 18, h: 8 },
  // Chest
  { id: 'chest_l_f', group: 'chest', x: 25, y: 18, w: 22, h: 12 },
  { id: 'chest_r_f', group: 'chest', x: 53, y: 18, w: 22, h: 12 },
  // Biceps
  { id: 'biceps_l_f', group: 'biceps', x: 10, y: 24, w: 14, h: 14 },
  { id: 'biceps_r_f', group: 'biceps', x: 76, y: 24, w: 14, h: 14 },
  // Core / Abs
  { id: 'abs_upper_f', group: 'core', x: 35, y: 30, w: 30, h: 10 },
  { id: 'abs_lower_f', group: 'core', x: 35, y: 40, w: 30, h: 10 },
  // Obliques
  { id: 'obliques_l_f', group: 'core', x: 22, y: 32, w: 13, h: 16 },
  { id: 'obliques_r_f', group: 'core', x: 65, y: 32, w: 13, h: 16 },
  // Forearms
  { id: 'forearms_l_f', group: 'forearms', x: 4, y: 38, w: 14, h: 16 },
  { id: 'forearms_r_f', group: 'forearms', x: 82, y: 38, w: 14, h: 16 },
  // Quads
  { id: 'quads_l_f', group: 'quads', x: 26, y: 52, w: 18, h: 22 },
  { id: 'quads_r_f', group: 'quads', x: 56, y: 52, w: 18, h: 22 },
  // Adductors
  { id: 'adductors_f', group: 'quads', x: 40, y: 54, w: 20, h: 16 },
  // Calves / Shins
  { id: 'shins_l_f', group: 'calves', x: 27, y: 76, w: 15, h: 18 },
  { id: 'shins_r_f', group: 'calves', x: 58, y: 76, w: 15, h: 18 },
];

// BACK body zones (right half of image)
const backZones: MuscleZone[] = [
  // Traps
  { id: 'traps_b', group: 'traps', x: 30, y: 10, w: 40, h: 10 },
  // Rear Delts
  { id: 'rear_delts_l_b', group: 'shoulders', x: 14, y: 14, w: 18, h: 8 },
  { id: 'rear_delts_r_b', group: 'shoulders', x: 68, y: 14, w: 18, h: 8 },
  // Upper Back / Rhomboids
  { id: 'upper_back_b', group: 'back', x: 28, y: 18, w: 44, h: 14 },
  // Lats
  { id: 'lats_l_b', group: 'back', x: 18, y: 24, w: 18, h: 16 },
  { id: 'lats_r_b', group: 'back', x: 64, y: 24, w: 18, h: 16 },
  // Triceps
  { id: 'triceps_l_b', group: 'triceps', x: 8, y: 24, w: 12, h: 14 },
  { id: 'triceps_r_b', group: 'triceps', x: 80, y: 24, w: 12, h: 14 },
  // Lower Back
  { id: 'lower_back_b', group: 'back', x: 32, y: 34, w: 36, h: 12 },
  // Forearms back
  { id: 'forearms_l_b', group: 'forearms', x: 4, y: 38, w: 12, h: 14 },
  { id: 'forearms_r_b', group: 'forearms', x: 84, y: 38, w: 12, h: 14 },
  // Glutes
  { id: 'glutes_l_b', group: 'glutes', x: 28, y: 46, w: 20, h: 12 },
  { id: 'glutes_r_b', group: 'glutes', x: 52, y: 46, w: 20, h: 12 },
  // Hamstrings
  { id: 'hamstrings_l_b', group: 'hamstrings', x: 26, y: 58, w: 18, h: 18 },
  { id: 'hamstrings_r_b', group: 'hamstrings', x: 56, y: 58, w: 18, h: 18 },
  // Calves
  { id: 'calves_l_b', group: 'calves', x: 28, y: 78, w: 16, h: 16 },
  { id: 'calves_r_b', group: 'calves', x: 56, y: 78, w: 16, h: 16 },
];

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const zones = isFront ? frontZones : backZones;

  const getMuscleLabel = (group: string) => {
    const key = group as keyof typeof t.body.muscles;
    return t.body.muscles[key] || group;
  };

  return (
    <div
      className="relative w-full overflow-hidden rounded-xl transition-transform duration-300"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center top', maxHeight: 500 }}
    >
      {/* Anatomy image — show left half (front) or right half (back) */}
      <div className="relative w-full" style={{ aspectRatio: '1/2' }}>
        <div
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{
            backgroundImage: 'url(/body-anatomy.webp)',
            backgroundSize: '200% 100%',
            backgroundPosition: isFront ? '0% center' : '100% center',
          }}
        />

        {/* Muscle zone overlays */}
        {zones.map((zone) => {
          const val = soreness[zone.group] || 0;
          const inf = getInflammationStyle(val);
          const isHov = hovered === zone.id;
          const isSel = selected === zone.group;
          const active = isHov || isSel;

          return (
            <div
              key={zone.id}
              className="absolute cursor-pointer transition-all duration-200"
              style={{
                left: `${zone.x}%`,
                top: `${zone.y}%`,
                width: `${zone.w}%`,
                height: `${zone.h}%`,
                background: active ? `${inf.stroke}40` : val > 0 ? inf.fill : 'transparent',
                border: active ? `2px solid ${inf.stroke}` : val >= 2 ? `1px solid ${inf.stroke}66` : '1px solid transparent',
                borderRadius: 8,
                boxShadow: val >= 2 ? inf.glow : active ? `0 0 12px ${inf.stroke}44` : 'none',
              }}
              onClick={() => onMuscleClick(zone.group)}
              onMouseEnter={() => setHovered(zone.id)}
              onMouseLeave={() => setHovered(null)}
            >
              {/* Pulsing dot for painful muscles */}
              {val >= 2 && (
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                  <div
                    className="rounded-full"
                    style={{
                      width: 8, height: 8,
                      background: inf.stroke,
                      animation: `pulse3 ${val >= 4 ? '0.8s' : val >= 3 ? '1.2s' : '2s'} infinite`,
                    }}
                  />
                </div>
              )}

              {/* Tooltip on hover */}
              {active && (
                <div
                  className="absolute z-20 px-2 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap pointer-events-none"
                  style={{
                    bottom: '105%',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'rgba(0,0,0,0.9)',
                    color: inf.stroke,
                    border: `1px solid ${inf.stroke}44`,
                  }}
                >
                  {getMuscleLabel(zone.group)}
                  {val > 0 && (
                    <span className="ml-1 opacity-70">
                      {t.body.soreness[val as keyof typeof t.body.soreness]}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Side label */}
      <div className="text-center mt-2 text-[10px] text-fit-dim font-semibold">
        {isFront ? t.body.front : t.body.back} · {t.body.ratePain}
      </div>
    </div>
  );
}
