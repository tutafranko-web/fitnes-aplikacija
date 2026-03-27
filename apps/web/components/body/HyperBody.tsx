'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { getMuscleGroup } from '@/lib/constants/muscleMap';
import { getInflammationStyle } from '@/lib/constants/soreness';

interface Props {
  soreness: Record<string, number>;
  onMuscleClick: (group: string) => void;
  selected: string | null;
  zoom: number;
  isFront: boolean;
}

// ═══════════════════════════════════════════════════════════
// ANATOMICALLY ACCURATE MUSCLE ZONE DEFINITIONS
// Each zone has precise SVG paths tracing real muscle shapes
// ═══════════════════════════════════════════════════════════

interface MZone {
  id: string;
  group: string;
  paths: string[];
  cx: number;
  cy: number;
}

const FRONT: MZone[] = [
  // NECK — sternocleidomastoid
  { id: 'neck', group: 'neck', paths: ['M54 60 Q57 58 60 57.5 Q63 58 66 60 L65.5 67 Q63 68.5 60 69 Q57 68.5 54.5 67 Z'], cx: 60, cy: 63 },
  // SHOULDERS — anterior deltoid
  { id: 'delt_l', group: 'shoulders', paths: ['M42 68 Q37 64 34 68 Q31 73 31 79 Q32 83 35 83 L42 79 Q44 75 44 71 Z', 'M40 71 Q38 69 36 72 Q34 76 35 80'], cx: 37, cy: 75 },
  { id: 'delt_r', group: 'shoulders', paths: ['M78 68 Q83 64 86 68 Q89 73 89 79 Q88 83 85 83 L78 79 Q76 75 76 71 Z'], cx: 83, cy: 75 },
  // PECTORALS — pectoralis major
  { id: 'pec_l', group: 'chest', paths: ['M43 72 Q48 70 56.5 72 Q58.5 73.5 59 76 L59 85 Q55.5 89 47 87 Q43 85 41 80 Z'], cx: 50, cy: 79 },
  { id: 'pec_r', group: 'chest', paths: ['M77 72 Q72 70 63.5 72 Q61.5 73.5 61 76 L61 85 Q64.5 89 73 87 Q77 85 79 80 Z'], cx: 70, cy: 79 },
  // BICEPS — biceps brachii
  { id: 'bi_l', group: 'biceps', paths: ['M31 83 Q29 86 27 92 Q25 100 26 108 Q27 110 29.5 110 L33.5 108 Q35.5 100 35.5 92 Q34.5 86 33 83 Z'], cx: 30, cy: 96 },
  { id: 'bi_r', group: 'biceps', paths: ['M89 83 Q91 86 93 92 Q95 100 94 108 Q93 110 90.5 110 L86.5 108 Q84.5 100 84.5 92 Q85.5 86 87 83 Z'], cx: 90, cy: 96 },
  // FOREARMS — brachioradialis, flexors
  { id: 'fore_l', group: 'forearms', paths: ['M26 110 Q24 118 23 128 Q22 135 23 140 L27.5 140 Q29.5 135 29.5 128 Q30.5 118 29.5 110 Z'], cx: 26, cy: 125 },
  { id: 'fore_r', group: 'forearms', paths: ['M94 110 Q96 118 97 128 Q98 135 97 140 L92.5 140 Q90.5 135 90.5 128 Q89.5 118 90.5 110 Z'], cx: 94, cy: 125 },
  // ABS — rectus abdominis upper
  { id: 'abs_u', group: 'core', paths: ['M51.5 87 Q56 85 60 85 Q64 85 68.5 87 L67.5 99 Q64 100 60 100 Q56 100 52.5 99 Z'], cx: 60, cy: 93 },
  // ABS — rectus abdominis lower
  { id: 'abs_l', group: 'core', paths: ['M52.5 101 Q56 100 60 100 Q64 100 67.5 101 L66.5 115 Q64 117 60 117 Q56 117 53.5 115 Z'], cx: 60, cy: 108 },
  // OBLIQUES — external oblique
  { id: 'obl_l', group: 'core', paths: ['M43 85 Q45.5 83 50 85 L51.5 87 L52.5 113 Q49.5 115 45.5 113 Q42.5 109 41.5 99 Q41.5 91 43 85 Z'], cx: 47, cy: 99 },
  { id: 'obl_r', group: 'core', paths: ['M77 85 Q74.5 83 70 85 L68.5 87 L67.5 113 Q70.5 115 74.5 113 Q77.5 109 78.5 99 Q78.5 91 77 85 Z'], cx: 73, cy: 99 },
  // QUADS — rectus femoris, vastus lateralis/medialis
  { id: 'q_l', group: 'quads', paths: ['M47.5 119 Q50 117 56 119 L58 121 L57 152 Q55 156 51.5 157 Q47.5 156 45.5 152 L44.5 132 Q45.5 123 47.5 119 Z'], cx: 51, cy: 138 },
  { id: 'q_r', group: 'quads', paths: ['M72.5 119 Q70 117 64 119 L62 121 L63 152 Q65 156 68.5 157 Q72.5 156 74.5 152 L75.5 132 Q74.5 123 72.5 119 Z'], cx: 69, cy: 138 },
  // ADDUCTORS — inner thigh
  { id: 'add', group: 'quads', paths: ['M56 119 Q58 118 60 118 Q62 118 64 119 L63 147 Q62 149 60 149 Q58 149 57 147 Z'], cx: 60, cy: 134 },
  // SHINS — tibialis anterior
  { id: 'sh_l', group: 'calves', paths: ['M46 160 Q48.5 158 52 159 L53 160 L52 182 Q50 184 47.5 182 L46.5 172 Z'], cx: 49, cy: 171 },
  { id: 'sh_r', group: 'calves', paths: ['M74 160 Q71.5 158 68 159 L67 160 L68 182 Q70 184 72.5 182 L73.5 172 Z'], cx: 71, cy: 171 },
];

const BACK: MZone[] = [
  // TRAPS — trapezius
  { id: 'trap', group: 'traps', paths: ['M47 66 Q54 62 60 61 Q66 62 73 66 L71 75 Q66 71 60 70 Q54 71 49 75 Z'], cx: 60, cy: 68 },
  // REAR DELTS
  { id: 'rd_l', group: 'shoulders', paths: ['M42 68 Q37 66 34 71 Q32 75 32 79 L35 81 Q39 77 42 73 Z'], cx: 37, cy: 75 },
  { id: 'rd_r', group: 'shoulders', paths: ['M78 68 Q83 66 86 71 Q88 75 88 79 L85 81 Q81 77 78 73 Z'], cx: 83, cy: 75 },
  // UPPER BACK — rhomboids, mid traps
  { id: 'ub', group: 'back', paths: ['M46 75 Q52 73 60 72 Q68 73 74 75 L72 93 Q66 95 60 95 Q54 95 48 93 Z'], cx: 60, cy: 84 },
  // LATS — latissimus dorsi
  { id: 'lat_l', group: 'back', paths: ['M41 79 Q43 77 46 79 L48 95 Q46 101 44 105 Q42 107 39.5 105 L37.5 93 Q37.5 85 41 79 Z'], cx: 43, cy: 92 },
  { id: 'lat_r', group: 'back', paths: ['M79 79 Q77 77 74 79 L72 95 Q74 101 76 105 Q78 107 80.5 105 L82.5 93 Q82.5 85 79 79 Z'], cx: 77, cy: 92 },
  // LOWER BACK — erector spinae
  { id: 'lb', group: 'back', paths: ['M50 97 Q54 95 60 95 Q66 95 70 97 L68 115 Q64 117 60 117 Q56 117 52 115 Z'], cx: 60, cy: 106 },
  // TRICEPS
  { id: 'tri_l', group: 'triceps', paths: ['M31 81 Q29 83 27 92 Q25 100 26 108 L30.5 108 Q32.5 100 33.5 92 Q33.5 85 32.5 81 Z'], cx: 30, cy: 94 },
  { id: 'tri_r', group: 'triceps', paths: ['M89 81 Q91 83 93 92 Q95 100 94 108 L89.5 108 Q87.5 100 86.5 92 Q86.5 85 87.5 81 Z'], cx: 90, cy: 94 },
  // GLUTES — gluteus maximus
  { id: 'gl_l', group: 'glutes', paths: ['M50 117 Q54 115 58 117 L59 132 Q56 136 52 135 Q48 134 46.5 130 L47.5 121 Z'], cx: 53, cy: 126 },
  { id: 'gl_r', group: 'glutes', paths: ['M70 117 Q66 115 62 117 L61 132 Q64 136 68 135 Q72 134 73.5 130 L72.5 121 Z'], cx: 67, cy: 126 },
  // HAMSTRINGS
  { id: 'ham_l', group: 'hamstrings', paths: ['M46.5 136 Q50 134 54 136 L55 138 L54 164 Q52 166 49.5 166 Q46.5 165 45.5 162 L44.5 147 Z'], cx: 50, cy: 150 },
  { id: 'ham_r', group: 'hamstrings', paths: ['M73.5 136 Q70 134 66 136 L65 138 L66 164 Q68 166 70.5 166 Q73.5 165 74.5 162 L75.5 147 Z'], cx: 70, cy: 150 },
  // CALVES — gastrocnemius
  { id: 'calf_l', group: 'calves', paths: ['M45.5 168 Q48 166 52 167 L53 169 Q54 176 53 184 Q51 188 48 187 Q45.5 186 44.5 182 Q43.5 176 45.5 168 Z'], cx: 49, cy: 178 },
  { id: 'calf_r', group: 'calves', paths: ['M74.5 168 Q72 166 68 167 L67 169 Q66 176 67 184 Q69 188 72 187 Q74.5 186 75.5 182 Q76.5 176 74.5 168 Z'], cx: 71, cy: 178 },
];

// ═══════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const zones = isFront ? FRONT : BACK;

  const getSoreVal = (group: string) => soreness[group] || 0;

  const getMuscleLabel = (group: string) => {
    const key = group as keyof typeof t.body.muscles;
    return t.body.muscles[key] || group;
  };

  return (
    <svg viewBox="0 0 120 200" className="w-full transition-transform duration-300"
      style={{ maxHeight: 460, transform: `scale(${zoom})`, transformOrigin: 'center center' }}>
      <defs>
        {/* Muscle tissue gradients */}
        <radialGradient id="muscG" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor="#d49088" />
          <stop offset="40%" stopColor="#c47068" />
          <stop offset="80%" stopColor="#a85850" />
          <stop offset="100%" stopColor="#884038" />
        </radialGradient>
        <radialGradient id="muscG2" cx="50%" cy="40%" r="55%">
          <stop offset="0%" stopColor="#d08878" />
          <stop offset="60%" stopColor="#b86058" />
          <stop offset="100%" stopColor="#904040" />
        </radialGradient>
        <linearGradient id="muscV" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d09080" />
          <stop offset="100%" stopColor="#904040" />
        </linearGradient>
        <linearGradient id="tendon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#e8c8b8" />
          <stop offset="100%" stopColor="#c8a898" />
        </linearGradient>

        {/* 3D depth filter */}
        <filter id="depth3d">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.2" result="b" />
          <feSpecularLighting in="b" surfaceScale="5" specularConstant=".6" specularExponent="30" result="s">
            <fePointLight x="55" y="15" z="60" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="s" operator="arithmetic" k1="0" k2="1" k3=".35" k4="0" />
        </filter>
        <filter id="shadow"><feDropShadow dx="0" dy="1.5" stdDeviation="2.5" floodColor="#2a0a0a" floodOpacity=".35" /></filter>
        <filter id="heatGlow"><feGaussianBlur stdDeviation="4" /></filter>
        <filter id="innerShadow">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1.5" />
          <feOffset dx="0" dy="1" />
          <feComposite in2="SourceAlpha" operator="arithmetic" k2="-1" k3="1" />
          <feFlood floodColor="#3a0a0a" floodOpacity=".4" />
          <feComposite in2="SourceGraphic" operator="in" />
          <feComposite in="SourceGraphic" />
        </filter>

        {/* Muscle fiber texture */}
        <pattern id="fibers" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
          <line x1="0" y1="0" x2="8" y2="8" stroke="rgba(160,50,40,.08)" strokeWidth=".4" />
          <line x1="4" y1="0" x2="12" y2="8" stroke="rgba(180,60,50,.05)" strokeWidth=".3" />
          <line x1="-4" y1="0" x2="4" y2="8" stroke="rgba(140,40,30,.04)" strokeWidth=".2" />
        </pattern>
        <pattern id="veinP" x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
          <path d="M2 0 Q4 4 3 8 Q2 12 4 14" fill="none" stroke="rgba(120,30,30,.1)" strokeWidth=".5" />
          <path d="M9 0 Q7 6 8 12" fill="none" stroke="rgba(100,25,25,.06)" strokeWidth=".3" />
        </pattern>
      </defs>

      {/* Subtle background radial */}
      <radialGradient id="bgR" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#c06050" stopOpacity=".06" />
        <stop offset="100%" stopColor="#c06050" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="60" cy="100" rx="50" ry="90" fill="url(#bgR)" />

      {/* ═══ BODY STRUCTURE ═══ */}
      <g filter="url(#shadow)">
        {/* HEAD — skin tone, not muscle */}
        <ellipse cx="60" cy="38" rx="14" ry="17" fill="#d4a088" />
        <path d="M48 42 Q50 50 54 54 Q57 56 60 56.5 Q63 56 66 54 Q70 50 72 42" fill="#d4a088" />
        {/* Ears */}
        <ellipse cx={isFront ? 46 : 74} cy="38" rx="2.8" ry="4.5" fill="#c89878" />
        <ellipse cx={isFront ? 74 : 46} cy="38" rx="2.8" ry="4.5" fill="#c89878" />
        {/* Hair */}
        <path d="M46 32 Q46 20 60 18 Q74 20 74 32 Q74 26 68 22 Q64 20 60 20 Q56 20 52 22 Q46 26 46 32" fill="#1a1008" />

        {isFront && <>
          {/* Eyes */}
          <ellipse cx="54" cy="35" rx="3" ry="2" fill="white" />
          <ellipse cx="66" cy="35" rx="3" ry="2" fill="white" />
          <circle cx="54" cy="35" r="1.2" fill="#2c1810" />
          <circle cx="66" cy="35" r="1.2" fill="#2c1810" />
          {/* Eyebrows */}
          <path d="M50 31 Q54 29.5 57 31" fill="none" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round" />
          <path d="M63 31 Q66 29.5 70 31" fill="none" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round" />
          {/* Nose & Mouth */}
          <path d="M59 38 Q60 42 61 38" fill="none" stroke="#a07060" strokeWidth=".7" />
          <path d="M56 46 Q60 48.5 64 46" fill="none" stroke="#a06050" strokeWidth=".9" strokeLinecap="round" />
        </>}

        {/* NECK */}
        <path d="M53 54 L53 65 Q56 67 60 67.5 Q64 67 67 65 L67 54" fill="url(#muscV)" />

        {/* TORSO — main body mass */}
        <path d="M42 68 Q36 66 33 72 Q32 76 33 80 L36 83 Q38 85 40 87 L42 99 Q42 107 44 115 L46 119 Q52 121 60 121 Q68 121 74 119 L76 115 Q78 107 78 99 L80 87 Q82 85 84 83 L87 80 Q88 76 87 72 Q84 66 78 68 Q72 66 60 66 Q48 66 42 68 Z"
          fill="url(#muscG)" filter="url(#depth3d)" />
        {/* Fiber overlay on torso */}
        <path d="M42 68 Q36 66 33 72 Q32 76 33 80 L36 83 Q38 85 40 87 L42 99 Q42 107 44 115 L46 119 Q52 121 60 121 Q68 121 74 119 L76 115 Q78 107 78 99 L80 87 Q82 85 84 83 L87 80 Q88 76 87 72 Q84 66 78 68 Q72 66 60 66 Q48 66 42 68 Z"
          fill="url(#fibers)" opacity=".7" />
        {/* Vein overlay */}
        <path d="M42 68 Q36 66 33 72 Q32 76 33 80 L36 83 Q38 85 40 87 L42 99 Q42 107 44 115 L46 119 Q52 121 60 121 Q68 121 74 119 L76 115 Q78 107 78 99 L80 87 Q82 85 84 83 L87 80 Q88 76 87 72 Q84 66 78 68 Q72 66 60 66 Q48 66 42 68 Z"
          fill="url(#veinP)" opacity=".5" />

        {/* ═══ MUSCLE DEFINITION LINES ═══ */}
        {isFront ? <>
          {/* Pec separation */}
          <line x1="60" y1="72" x2="60" y2="87" stroke="#6b2828" strokeWidth=".8" opacity=".5" />
          {/* Pec shapes */}
          <path d="M44 74 Q50 72 58 74 Q59 77 58 83 Q54 87 48 85 Q44 83 42 79" fill="none" stroke="#7a3030" strokeWidth=".7" opacity=".45" />
          <path d="M76 74 Q70 72 62 74 Q61 77 62 83 Q66 87 72 85 Q76 83 78 79" fill="none" stroke="#7a3030" strokeWidth=".7" opacity=".45" />
          {/* Pec striations */}
          <path d="M46 76 Q52 75 57 77" fill="none" stroke="#8a3838" strokeWidth=".3" opacity=".3" />
          <path d="M47 79 Q52 78 57 80" fill="none" stroke="#8a3838" strokeWidth=".3" opacity=".25" />
          <path d="M74 76 Q68 75 63 77" fill="none" stroke="#8a3838" strokeWidth=".3" opacity=".3" />
          {/* Abs inscriptions */}
          <path d="M54 89 Q60 88 66 89" fill="none" stroke="#6b2828" strokeWidth=".7" opacity=".5" />
          <path d="M54 95 Q60 94 66 95" fill="none" stroke="#6b2828" strokeWidth=".7" opacity=".5" />
          <path d="M54 101 Q60 100 66 101" fill="none" stroke="#6b2828" strokeWidth=".7" opacity=".5" />
          <path d="M55 107 Q60 106 65 107" fill="none" stroke="#6b2828" strokeWidth=".6" opacity=".4" />
          <line x1="60" y1="87" x2="60" y2="115" stroke="#6b2828" strokeWidth=".7" opacity=".45" />
          {/* Serratus */}
          {[85, 88, 91].map(y => <><path key={`sl${y}`} d={`M43 ${y} Q45 ${y-2} 47 ${y}`} fill="none" stroke="#7a3030" strokeWidth=".5" opacity=".35" /><path key={`sr${y}`} d={`M77 ${y} Q75 ${y-2} 73 ${y}`} fill="none" stroke="#7a3030" strokeWidth=".5" opacity=".35" /></>)}
          {/* V-lines */}
          <path d="M54 113 Q56 117 58 119" fill="none" stroke="#7a3030" strokeWidth=".6" opacity=".4" />
          <path d="M66 113 Q64 117 62 119" fill="none" stroke="#7a3030" strokeWidth=".6" opacity=".4" />
        </> : <>
          {/* Back: spine */}
          <line x1="60" y1="66" x2="60" y2="117" stroke="#5a2020" strokeWidth=".6" opacity=".35" />
          {[70,76,82,88,94,100,106,112].map(y => <circle key={y} cx="60" cy={y} r=".9" fill="#6b2828" opacity=".3" />)}
          {/* Trap fibers */}
          <path d="M48 68 Q54 66 60 65 Q66 66 72 68" fill="none" stroke="#7a3030" strokeWidth=".6" opacity=".4" />
          {/* Lat edges */}
          <path d="M46 79 Q44 86 42 96 Q42 102 44 107" fill="none" stroke="#7a3030" strokeWidth=".6" opacity=".35" />
          <path d="M74 79 Q76 86 78 96 Q78 102 76 107" fill="none" stroke="#7a3030" strokeWidth=".6" opacity=".35" />
          {/* Rhomboid fibers */}
          <path d="M52 78 L57 82" fill="none" stroke="#7a3030" strokeWidth=".3" opacity=".25" />
          <path d="M52 82 L57 86" fill="none" stroke="#7a3030" strokeWidth=".3" opacity=".25" />
          <path d="M68 78 L63 82" fill="none" stroke="#7a3030" strokeWidth=".3" opacity=".25" />
          <path d="M68 82 L63 86" fill="none" stroke="#7a3030" strokeWidth=".3" opacity=".25" />
          {/* Erector spinae */}
          <path d="M56 88 Q57 100 56 112" fill="none" stroke="#6b2828" strokeWidth=".4" opacity=".25" />
          <path d="M64 88 Q63 100 64 112" fill="none" stroke="#6b2828" strokeWidth=".4" opacity=".25" />
          {/* Sacral dimples */}
          <circle cx="55" cy="113" r="1.5" fill="none" stroke="#7a3030" strokeWidth=".4" opacity=".25" />
          <circle cx="65" cy="113" r="1.5" fill="none" stroke="#7a3030" strokeWidth=".4" opacity=".25" />
          {/* Glute separation */}
          <path d="M50 121 Q55 126 60 124 Q65 126 70 121" fill="none" stroke="#7a3030" strokeWidth=".5" opacity=".35" />
        </>}

        {/* ═══ ARMS — muscular, anatomical tone ═══ */}
        <path d="M33 81 Q30 83 28 92 Q26 102 26.5 110 Q26 114 27 118" fill="none" stroke="#b86058" strokeWidth="9.5" strokeLinecap="round" />
        <path d="M27 120 Q25 128 24 136 Q23 140 24 142" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="24" cy="144" rx="3.5" ry="4.5" fill="#d4a088" />
        <path d="M87 81 Q90 83 92 92 Q94 102 93.5 110 Q94 114 93 118" fill="none" stroke="#b86058" strokeWidth="9.5" strokeLinecap="round" />
        <path d="M93 120 Q95 128 96 136 Q97 140 96 142" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="96" cy="144" rx="3.5" ry="4.5" fill="#d4a088" />
        {/* Arm veins */}
        <path d="M28 90 Q27 98 26 108" fill="none" stroke="rgba(100,30,30,.15)" strokeWidth=".5" />
        <path d="M92 90 Q93 98 94 108" fill="none" stroke="rgba(100,30,30,.15)" strokeWidth=".5" />
        {/* Arm muscle separations */}
        <path d="M30 86 Q29 94 28 104" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />
        <path d="M90 86 Q91 94 92 104" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />

        {/* ═══ LEGS — anatomical ═══ */}
        <path d="M46 119 Q44 121 43 130 Q42 142 43 154 Q43 160 44 164 Q44 170 45 174" fill="none" stroke="#b86058" strokeWidth="10.5" strokeLinecap="round" />
        <path d="M56 119 Q58 121 58 130 Q58 142 57 154 Q56 160 55 164 Q55 170 54 174" fill="none" stroke="#b86058" strokeWidth="10.5" strokeLinecap="round" />
        <path d="M44 170 Q44 176 45 182 Q46 188 48 190" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M55 170 Q55 176 54 182 Q52 188 50 190" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="49" cy="192" rx="6" ry="2.5" fill="#555" />
        {/* Knee definition */}
        <ellipse cx="50" cy="162" rx="5.5" ry="3" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />
        {/* Quad separation */}
        <path d="M50 124 Q50 138 50 152" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />

        <path d="M64 119 Q62 121 62 130 Q62 142 63 154 Q63 160 64 164 Q64 170 65 174" fill="none" stroke="#b86058" strokeWidth="10.5" strokeLinecap="round" />
        <path d="M74 119 Q76 121 77 130 Q78 142 77 154 Q77 160 76 164 Q76 170 75 174" fill="none" stroke="#b86058" strokeWidth="10.5" strokeLinecap="round" />
        <path d="M65 170 Q65 176 66 182 Q67 188 68 190" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <path d="M76 170 Q76 176 75 182 Q73 188 71 190" fill="none" stroke="#b06050" strokeWidth="7.5" strokeLinecap="round" />
        <ellipse cx="69" cy="192" rx="6" ry="2.5" fill="#555" />
        <ellipse cx="70" cy="162" rx="5.5" ry="3" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />
        <path d="M70 124 Q70 138 70 152" fill="none" stroke="#8a3838" strokeWidth=".5" opacity=".3" />
      </g>

      {/* ═══ CLICKABLE MUSCLE OVERLAYS WITH INFLAMMATION ═══ */}
      {zones.map((z) => {
        const val = getSoreVal(z.group);
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
            {val >= 2 && z.paths.map((p, i) => (
              <path key={`g${i}`} d={p} fill={inf.fill} filter="url(#heatGlow)" opacity=".6" />
            ))}

            {/* Muscle zone shape */}
            {z.paths.map((p, i) => (
              <path key={i} d={p}
                fill={active ? `${inf.stroke}35` : val > 0 ? inf.fill : 'rgba(255,255,255,.04)'}
                stroke={active ? inf.stroke : val > 0 ? `${inf.stroke}88` : 'rgba(255,255,255,.08)'}
                strokeWidth={active ? 1.2 : .5}
                opacity={active ? .9 : .7}
                className="transition-all duration-200"
                style={{ filter: val >= 3 ? `drop-shadow(${inf.glow})` : 'none' }}
              />
            ))}

            {/* Pulsing hotspot */}
            {val >= 2 && (
              <circle cx={z.cx} cy={z.cy} r="2.5" fill={inf.stroke} opacity=".5">
                <animate attributeName="r" values="2;4.5;2" dur={val >= 4 ? '0.8s' : val >= 3 ? '1.3s' : '2s'} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".5;.1;.5" dur={val >= 4 ? '0.8s' : val >= 3 ? '1.3s' : '2s'} repeatCount="indefinite" />
              </circle>
            )}

            {/* Tooltip */}
            {active && (
              <g>
                <rect x={z.cx - 26} y={z.cy - 19} width="52" height="17" rx="4" fill="rgba(0,0,0,.9)" stroke={inf.stroke} strokeWidth=".6" />
                <text x={z.cx} y={z.cy - 8.5} textAnchor="middle" fill={inf.stroke} fontSize="5.5" fontWeight="700" fontFamily="Outfit,sans-serif">
                  {getMuscleLabel(z.group)}
                </text>
              </g>
            )}
          </g>
        );
      })}

      {/* Side label */}
      <text x="60" y="198" textAnchor="middle" fill="#4a4e62" fontSize="4.5" fontFamily="Outfit,sans-serif">
        {isFront ? t.body.front : t.body.back} · {t.body.ratePain}
      </text>
    </svg>
  );
}
