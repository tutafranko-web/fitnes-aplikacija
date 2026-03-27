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

// ═══════════════════════════════════════════════════════════
// HYBRID APPROACH: Real anatomy image + invisible SVG overlay
// The anatomy image provides photorealism
// SVG zones on top provide interactivity (click, hover, glow)
// ═══════════════════════════════════════════════════════════

interface Zone {
  id: string;
  group: string;
  // Polygon points as % of the half-image container
  points: string; // SVG polygon points
  cx: number; // center X %
  cy: number; // center Y %
}

// FRONT muscle zones (mapped precisely over left half of anatomy image)
const frontZones: Zone[] = [
  // Neck
  { id: 'f_neck', group: 'neck', points: '42,13 50,12 58,13 57,16 50,17 43,16', cx: 50, cy: 14 },
  // Left shoulder/deltoid
  { id: 'f_delt_l', group: 'shoulders', points: '22,16 30,14 38,16 40,22 36,24 26,24 20,20', cx: 30, cy: 19 },
  // Right shoulder/deltoid
  { id: 'f_delt_r', group: 'shoulders', points: '62,16 70,14 78,16 80,20 74,24 64,24 60,22', cx: 70, cy: 19 },
  // Left pec
  { id: 'f_pec_l', group: 'chest', points: '32,20 48,19 50,22 50,28 44,30 34,28 30,24', cx: 40, cy: 24 },
  // Right pec
  { id: 'f_pec_r', group: 'chest', points: '50,19 68,20 70,24 66,28 56,30 50,28 50,22', cx: 60, cy: 24 },
  // Left bicep
  { id: 'f_bi_l', group: 'biceps', points: '18,24 26,24 28,30 26,38 22,40 16,38 14,30', cx: 21, cy: 31 },
  // Right bicep
  { id: 'f_bi_r', group: 'biceps', points: '74,24 82,24 86,30 84,38 78,40 74,38 72,30', cx: 79, cy: 31 },
  // Left forearm
  { id: 'f_fore_l', group: 'forearms', points: '14,40 22,40 24,48 22,56 18,58 12,56 10,48', cx: 17, cy: 49 },
  // Right forearm
  { id: 'f_fore_r', group: 'forearms', points: '78,40 86,40 90,48 88,56 82,58 78,56 76,48', cx: 83, cy: 49 },
  // Upper abs
  { id: 'f_abs_u', group: 'core', points: '40,28 60,28 60,38 56,39 44,39 40,38', cx: 50, cy: 33 },
  // Lower abs
  { id: 'f_abs_l', group: 'core', points: '42,39 58,39 58,48 56,50 44,50 42,48', cx: 50, cy: 44 },
  // Left oblique
  { id: 'f_obl_l', group: 'core', points: '30,28 40,28 40,48 38,50 32,48 28,40 28,32', cx: 34, cy: 38 },
  // Right oblique
  { id: 'f_obl_r', group: 'core', points: '60,28 70,28 72,32 72,40 68,48 62,50 60,48', cx: 66, cy: 38 },
  // Left quad
  { id: 'f_q_l', group: 'quads', points: '34,52 48,51 50,54 50,68 46,74 38,74 32,68 32,58', cx: 41, cy: 63 },
  // Right quad
  { id: 'f_q_r', group: 'quads', points: '50,51 66,52 68,58 68,68 62,74 54,74 50,68 50,54', cx: 59, cy: 63 },
  // Left shin/calf front
  { id: 'f_shin_l', group: 'calves', points: '34,76 46,75 48,82 46,92 42,96 36,96 32,90 32,82', cx: 40, cy: 86 },
  // Right shin/calf front
  { id: 'f_shin_r', group: 'calves', points: '54,75 66,76 68,82 68,90 64,96 58,96 54,92 52,82', cx: 60, cy: 86 },
];

// BACK muscle zones (mapped over right half of anatomy image)
const backZones: Zone[] = [
  // Traps
  { id: 'b_trap', group: 'traps', points: '34,12 50,10 66,12 64,20 56,18 50,17 44,18 36,20', cx: 50, cy: 15 },
  // Left rear delt
  { id: 'b_rd_l', group: 'shoulders', points: '20,16 32,15 36,20 32,24 22,24 18,20', cx: 27, cy: 20 },
  // Right rear delt
  { id: 'b_rd_r', group: 'shoulders', points: '68,15 80,16 82,20 78,24 68,24 64,20', cx: 73, cy: 20 },
  // Left tricep
  { id: 'b_tri_l', group: 'triceps', points: '14,24 22,24 24,32 22,40 16,40 12,34', cx: 18, cy: 32 },
  // Right tricep
  { id: 'b_tri_r', group: 'triceps', points: '78,24 86,24 88,34 84,40 78,40 76,32', cx: 82, cy: 32 },
  // Upper back / rhomboids
  { id: 'b_ub', group: 'back', points: '36,20 48,18 52,18 64,20 62,32 56,34 44,34 38,32', cx: 50, cy: 26 },
  // Left lat
  { id: 'b_lat_l', group: 'back', points: '26,24 36,22 38,32 40,40 36,44 28,42 24,36 22,28', cx: 31, cy: 33 },
  // Right lat
  { id: 'b_lat_r', group: 'back', points: '64,22 74,24 78,28 76,36 72,42 64,44 62,40 62,32', cx: 69, cy: 33 },
  // Lower back
  { id: 'b_lb', group: 'back', points: '40,40 50,38 60,40 58,50 52,52 48,52 42,50', cx: 50, cy: 45 },
  // Left glute
  { id: 'b_gl_l', group: 'glutes', points: '34,50 48,50 50,54 50,60 46,64 38,63 32,58 32,54', cx: 41, cy: 57 },
  // Right glute
  { id: 'b_gl_r', group: 'glutes', points: '50,50 66,50 68,54 68,58 62,63 54,64 50,60 50,54', cx: 59, cy: 57 },
  // Left hamstring
  { id: 'b_ham_l', group: 'hamstrings', points: '32,64 46,64 48,72 46,82 40,84 34,82 30,72', cx: 39, cy: 74 },
  // Right hamstring
  { id: 'b_ham_r', group: 'hamstrings', points: '54,64 68,64 70,72 66,82 60,84 54,82 52,72', cx: 61, cy: 74 },
  // Left calf
  { id: 'b_calf_l', group: 'calves', points: '34,84 44,84 46,90 44,97 40,98 36,97 32,90', cx: 39, cy: 91 },
  // Right calf
  { id: 'b_calf_r', group: 'calves', points: '56,84 66,84 68,90 66,97 62,98 58,97 56,90', cx: 61, cy: 91 },
];

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useT();
  const zones = isFront ? frontZones : backZones;

  const getMuscleLabel = (group: string) => {
    const key = group as keyof typeof t.body.muscles;
    return t.body.muscles[key] || group;
  };

  return (
    <div className="relative transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>
      {/* REAL ANATOMY IMAGE as background — provides photorealism */}
      <div className="relative w-full overflow-hidden rounded-xl" style={{ aspectRatio: '0.52' }}>
        {/* The image shows front on left, back on right — we crop to show one half */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: 'url(/body-anatomy.webp)',
            backgroundSize: '200% 100%',
            backgroundPosition: isFront ? 'left center' : 'right center',
            backgroundRepeat: 'no-repeat',
            filter: 'brightness(1.05) contrast(1.1)',
          }}
        />

        {/* SVG overlay for interactive zones — completely transparent until interacted */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
          <defs>
            <filter id="hglow">
              <feGaussianBlur stdDeviation="3" />
            </filter>
          </defs>

          {zones.map((z) => {
            const val = soreness[z.group] || 0;
            const inf = getInflammationStyle(val);
            const isHov = hovered === z.id;
            const isSel = selected === z.group;
            const active = isHov || isSel;

            return (
              <g key={z.id}
                onClick={() => onMuscleClick(z.group)}
                onMouseEnter={() => setHovered(z.id)}
                onMouseLeave={() => setHovered(null)}
                className="cursor-pointer">

                {/* Heat glow for inflamed muscles */}
                {val >= 2 && (
                  <polygon points={z.points} fill={inf.fill} filter="url(#hglow)" opacity=".7" />
                )}

                {/* Interactive zone — transparent when healthy, colored when sore/hovered */}
                <polygon
                  points={z.points}
                  fill={active ? `${inf.stroke}40` : val > 0 ? `${inf.fill}` : 'transparent'}
                  stroke={active ? inf.stroke : val >= 2 ? `${inf.stroke}66` : 'transparent'}
                  strokeWidth={active ? '.8' : '.3'}
                  opacity={active ? .85 : .65}
                  className="transition-all duration-200"
                  style={{ filter: val >= 3 ? `drop-shadow(${inf.glow})` : 'none' }}
                />

                {/* Pulsing indicator for painful muscles */}
                {val >= 2 && (
                  <circle cx={z.cx} cy={z.cy} r="1.5" fill={inf.stroke} opacity=".6">
                    <animate attributeName="r" values="1.5;3.5;1.5" dur={val >= 4 ? '0.7s' : val >= 3 ? '1.2s' : '2s'} repeatCount="indefinite" />
                    <animate attributeName="opacity" values=".6;.1;.6" dur={val >= 4 ? '0.7s' : val >= 3 ? '1.2s' : '2s'} repeatCount="indefinite" />
                  </circle>
                )}

                {/* Tooltip on hover/select */}
                {active && (
                  <g>
                    <rect x={z.cx - 18} y={z.cy - 7} width="36" height="6" rx="1.5"
                      fill="rgba(0,0,0,.92)" stroke={inf.stroke} strokeWidth=".3" />
                    <text x={z.cx} y={z.cy - 2.5} textAnchor="middle" fill={inf.stroke}
                      fontSize="2.8" fontWeight="700" fontFamily="Outfit,sans-serif">
                      {getMuscleLabel(z.group)}
                    </text>
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Side label */}
      <div className="text-center mt-2 text-[10px] text-fit-dim font-semibold">
        {isFront ? t.body.front : t.body.back} · {t.body.ratePain}
      </div>
    </div>
  );
}
