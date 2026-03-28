'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useLocale';
import { getInflammationStyle } from '@/lib/constants/soreness';

interface Props {
  soreness: Record<string, number>;
  onMuscleClick: (group: string) => void;
  selected: string | null;
  zoom: number;
  isFront: boolean;
}

// ═══════════════════════════════════════════════════════════
// HYPERREALISTIC SVG ANATOMICAL BODY
// No background image — pure SVG with medical-illustration quality:
// - Multi-layer radial/linear gradients for 3D muscle depth
// - Muscle fiber direction hints
// - Separation lines between muscle groups
// - Vein patterns on arms
// - Anatomically accurate shapes (serratus, V-lines, obliques)
// - feSpecularLighting for wet/shiny muscle surface
// - 32 interactive zones (front 17 + back 15)
// ═══════════════════════════════════════════════════════════

interface MuscleZone {
  id: string;
  group: string;
  d: string; // SVG path
  label: string;
  cx: number;
  cy: number;
}

// ── FRONT VIEW MUSCLES ──────────────────────────────────────

const frontMuscles: MuscleZone[] = [
  // NECK (sternocleidomastoid)
  { id: 'f_neck_l', group: 'neck', label: 'Vrat',
    d: 'M53,22 C51,22 49,24 48,27 L48,30 C49,30 51,29 53,28 L55,26 C55,24 54,22 53,22Z', cx: 51, cy: 25 },
  { id: 'f_neck_r', group: 'neck', label: 'Vrat',
    d: 'M67,22 C69,22 71,24 72,27 L72,30 C71,30 69,29 67,28 L65,26 C65,24 66,22 67,22Z', cx: 69, cy: 25 },

  // LEFT DELTOID (anterior) — round cap shape
  { id: 'f_delt_l', group: 'shoulders', label: 'Ramena',
    d: 'M44,28 C40,27 36,28 33,30 C30,33 29,36 30,39 L33,40 C34,38 36,34 40,31 C42,30 44,29 44,28Z', cx: 37, cy: 33 },
  // RIGHT DELTOID
  { id: 'f_delt_r', group: 'shoulders', label: 'Ramena',
    d: 'M76,28 C80,27 84,28 87,30 C90,33 91,36 90,39 L87,40 C86,38 84,34 80,31 C78,30 76,29 76,28Z', cx: 83, cy: 33 },

  // LEFT PECTORAL — fan shape with separation
  { id: 'f_pec_l', group: 'chest', label: 'Prsa',
    d: 'M48,30 C46,30 44,31 42,33 L35,38 C34,40 35,43 37,44 L44,46 C48,47 52,46 54,44 L58,42 C59,40 59,37 58,35 L56,32 C54,30 51,29 48,30Z', cx: 47, cy: 38 },
  // RIGHT PECTORAL
  { id: 'f_pec_r', group: 'chest', label: 'Prsa',
    d: 'M72,30 C74,30 76,31 78,33 L85,38 C86,40 85,43 83,44 L76,46 C72,47 68,46 66,44 L62,42 C61,40 61,37 62,35 L64,32 C66,30 69,29 72,30Z', cx: 73, cy: 38 },

  // LEFT BICEP — bulging oval
  { id: 'f_bi_l', group: 'biceps', label: 'Biceps',
    d: 'M30,40 C28,42 26,46 25,50 C24,54 25,58 27,61 L30,62 C32,60 33,56 33,52 C33,48 32,44 30,40Z', cx: 29, cy: 51 },
  // RIGHT BICEP
  { id: 'f_bi_r', group: 'biceps', label: 'Biceps',
    d: 'M90,40 C92,42 94,46 95,50 C96,54 95,58 93,61 L90,62 C88,60 87,56 87,52 C87,48 88,44 90,40Z', cx: 91, cy: 51 },

  // LEFT FOREARM
  { id: 'f_fore_l', group: 'forearms', label: 'Podlaktice',
    d: 'M27,62 C25,65 23,70 22,75 C21,80 22,84 24,87 L27,88 C28,85 29,80 29,75 C29,70 28,66 27,62Z', cx: 25, cy: 75 },
  // RIGHT FOREARM
  { id: 'f_fore_r', group: 'forearms', label: 'Podlaktice',
    d: 'M93,62 C95,65 97,70 98,75 C99,80 98,84 96,87 L93,88 C92,85 91,80 91,75 C91,70 92,66 93,62Z', cx: 95, cy: 75 },

  // UPPER ABS (rectus abdominis top 4 blocks)
  { id: 'f_abs_u', group: 'core', label: 'Gornji trbuh',
    d: 'M54,44 L56,44 C58,44 59,46 59,48 L59,56 C59,58 58,59 56,59 L54,59 L54,44Z M66,44 L64,44 C62,44 61,46 61,48 L61,56 C61,58 62,59 64,59 L66,59 L66,44Z', cx: 60, cy: 51 },

  // LOWER ABS (rectus abdominis bottom 2 blocks + V-lines)
  { id: 'f_abs_l', group: 'core', label: 'Donji trbuh',
    d: 'M54,59 L56,59 C58,59 59,61 59,63 L59,70 C59,72 58,74 56,75 L54,76 C53,74 52,72 52,70 L53,63 C53,61 53,60 54,59Z M66,59 L64,59 C62,59 61,61 61,63 L61,70 C61,72 62,74 64,75 L66,76 C67,74 68,72 68,70 L67,63 C67,61 67,60 66,59Z', cx: 60, cy: 67 },

  // LEFT OBLIQUE (external oblique — diagonal fiber pattern)
  { id: 'f_obl_l', group: 'core', label: 'Kosi mišići',
    d: 'M44,46 C46,47 48,48 50,50 L52,54 L52,70 C52,72 50,75 48,77 L44,78 C42,76 40,72 39,68 L38,60 C38,54 40,50 44,46Z', cx: 45, cy: 62 },
  // RIGHT OBLIQUE
  { id: 'f_obl_r', group: 'core', label: 'Kosi mišići',
    d: 'M76,46 C74,47 72,48 70,50 L68,54 L68,70 C68,72 70,75 72,77 L76,78 C78,76 80,72 81,68 L82,60 C82,54 80,50 76,46Z', cx: 75, cy: 62 },

  // SERRATUS ANTERIOR (left) — finger-like protrusions
  { id: 'f_serr_l', group: 'core', label: 'Serratus',
    d: 'M38,44 L42,46 L40,49 L43,50 L41,53 L44,54 L42,56 L38,55 C36,52 36,48 38,44Z', cx: 40, cy: 50 },
  // SERRATUS ANTERIOR (right)
  { id: 'f_serr_r', group: 'core', label: 'Serratus',
    d: 'M82,44 L78,46 L80,49 L77,50 L79,53 L76,54 L78,56 L82,55 C84,52 84,48 82,44Z', cx: 80, cy: 50 },

  // LEFT QUAD (rectus femoris + vastus lateralis/medialis — teardrop)
  { id: 'f_q_l', group: 'quads', label: 'Kvadricepsi',
    d: 'M44,78 C42,80 40,84 39,88 C38,94 39,100 40,106 C41,110 43,114 46,116 L50,117 C52,115 54,112 55,108 C56,104 56,98 55,92 C54,86 52,81 50,78 L44,78Z', cx: 47, cy: 97 },
  // RIGHT QUAD
  { id: 'f_q_r', group: 'quads', label: 'Kvadricepsi',
    d: 'M76,78 C78,80 80,84 81,88 C82,94 81,100 80,106 C79,110 77,114 74,116 L70,117 C68,115 66,112 65,108 C64,104 64,98 65,92 C66,86 68,81 70,78 L76,78Z', cx: 73, cy: 97 },

  // ADDUCTORS (inner thigh)
  { id: 'f_add_l', group: 'quads', label: 'Aduktori',
    d: 'M50,78 L55,82 C56,86 57,92 57,98 C57,102 56,106 54,108 L50,110 L50,78Z', cx: 53, cy: 94 },
  { id: 'f_add_r', group: 'quads', label: 'Aduktori',
    d: 'M70,78 L65,82 C64,86 63,92 63,98 C63,102 64,106 66,108 L70,110 L70,78Z', cx: 67, cy: 94 },

  // LEFT TIBIALIS (shin front)
  { id: 'f_shin_l', group: 'calves', label: 'Potkoljenice',
    d: 'M42,118 C41,122 40,128 40,134 C40,140 41,146 42,150 L46,152 C47,148 48,142 48,136 C48,130 47,124 46,118 L42,118Z', cx: 44, cy: 135 },
  // RIGHT TIBIALIS
  { id: 'f_shin_r', group: 'calves', label: 'Potkoljenice',
    d: 'M78,118 C79,122 80,128 80,134 C80,140 79,146 78,150 L74,152 C73,148 72,142 72,136 C72,130 73,124 74,118 L78,118Z', cx: 76, cy: 135 },
];

// ── BACK VIEW MUSCLES ───────────────────────────────────────

const backMuscles: MuscleZone[] = [
  // TRAPS (upper + mid)
  { id: 'b_trap', group: 'traps', label: 'Trapez',
    d: 'M52,20 C48,20 44,22 42,24 L38,28 C36,30 36,33 38,34 L44,32 C48,30 52,28 56,27 L60,27 C64,28 68,30 72,32 L78,34 C80,33 80,30 78,28 L74,24 C72,22 68,20 64,20 L60,19 L56,19 L52,20Z', cx: 58, cy: 26 },

  // LEFT REAR DELTOID
  { id: 'b_rd_l', group: 'shoulders', label: 'Stražnje rame',
    d: 'M38,28 C34,28 30,30 28,33 C26,36 27,39 29,40 L33,41 C35,38 37,34 39,31 L38,28Z', cx: 33, cy: 34 },
  // RIGHT REAR DELTOID
  { id: 'b_rd_r', group: 'shoulders', label: 'Stražnje rame',
    d: 'M78,28 C82,28 86,30 88,33 C90,36 89,39 87,40 L83,41 C81,38 79,34 77,31 L78,28Z', cx: 83, cy: 34 },

  // LEFT TRICEP (horseshoe shape)
  { id: 'b_tri_l', group: 'triceps', label: 'Triceps',
    d: 'M29,41 C27,44 25,48 24,52 C23,56 24,60 26,63 L30,64 C31,60 32,56 32,52 C32,48 31,44 29,41Z', cx: 28, cy: 52 },
  // RIGHT TRICEP
  { id: 'b_tri_r', group: 'triceps', label: 'Triceps',
    d: 'M87,41 C89,44 91,48 92,52 C93,56 92,60 90,63 L86,64 C85,60 84,56 84,52 C84,48 85,44 87,41Z', cx: 88, cy: 52 },

  // RHOMBOIDS / MID BACK
  { id: 'b_rhomb', group: 'back', label: 'Gornja leđa',
    d: 'M48,32 C50,31 54,30 58,30 L64,31 L68,32 C68,36 66,40 64,42 L58,44 L54,44 L48,42 C46,40 44,36 44,34 L48,32Z', cx: 56, cy: 37 },

  // LEFT LAT (large wing shape)
  { id: 'b_lat_l', group: 'back', label: 'Leđa',
    d: 'M38,34 C36,36 34,40 33,44 C32,48 33,52 35,56 L38,58 C40,56 42,52 44,48 L46,44 L44,40 L42,36 L38,34Z', cx: 38, cy: 46 },
  // RIGHT LAT
  { id: 'b_lat_r', group: 'back', label: 'Leđa',
    d: 'M78,34 C80,36 82,40 83,44 C84,48 83,52 81,56 L78,58 C76,56 74,52 72,48 L70,44 L72,40 L74,36 L78,34Z', cx: 78, cy: 46 },

  // LOWER BACK (erector spinae)
  { id: 'b_lb', group: 'back', label: 'Donja leđa',
    d: 'M48,48 C46,50 44,54 44,58 L44,64 C46,68 50,72 54,74 L58,75 L62,74 C66,72 70,68 72,64 L72,58 C72,54 70,50 68,48 L64,46 L58,44 L52,46 L48,48Z', cx: 58, cy: 60 },

  // LEFT GLUTE (rounded mass)
  { id: 'b_gl_l', group: 'glutes', label: 'Gluteus',
    d: 'M44,68 C42,70 40,74 39,78 C38,82 40,86 43,88 L48,89 C52,89 55,87 56,84 L58,80 C58,76 56,72 54,70 L50,68 L44,68Z', cx: 48, cy: 78 },
  // RIGHT GLUTE
  { id: 'b_gl_r', group: 'glutes', label: 'Gluteus',
    d: 'M72,68 C74,70 76,74 77,78 C78,82 76,86 73,88 L68,89 C64,89 61,87 60,84 L58,80 C58,76 60,72 62,70 L66,68 L72,68Z', cx: 68, cy: 78 },

  // LEFT HAMSTRING (3 heads visible)
  { id: 'b_ham_l', group: 'hamstrings', label: 'Zadnja loža',
    d: 'M42,89 C40,93 38,98 37,104 C36,110 38,115 40,118 L46,120 C48,116 50,110 50,104 C50,98 49,93 48,89 L42,89Z', cx: 44, cy: 104 },
  // RIGHT HAMSTRING
  { id: 'b_ham_r', group: 'hamstrings', label: 'Zadnja loža',
    d: 'M74,89 C76,93 78,98 79,104 C80,110 78,115 76,118 L70,120 C68,116 66,110 66,104 C66,98 67,93 68,89 L74,89Z', cx: 72, cy: 104 },

  // LEFT CALF (gastrocnemius — diamond)
  { id: 'b_calf_l', group: 'calves', label: 'Listovi',
    d: 'M40,120 C38,124 37,130 37,136 C37,142 38,147 40,150 L44,152 C46,148 47,142 47,136 C47,130 46,124 44,120 L40,120Z', cx: 42, cy: 136 },
  // RIGHT CALF
  { id: 'b_calf_r', group: 'calves', label: 'Listovi',
    d: 'M76,120 C78,124 79,130 79,136 C79,142 78,147 76,150 L72,152 C70,148 69,142 69,136 C69,130 70,124 72,120 L76,120Z', cx: 74, cy: 136 },
];

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useT();
  const muscles = isFront ? frontMuscles : backMuscles;

  const getSoreVal = (id: string) => {
    const m = muscles.find(m => m.id === id);
    return m ? (soreness[m.group] || 0) : 0;
  };

  const getMuscleLabel = (m: MuscleZone) => {
    const key = m.group as keyof typeof t.body.muscles;
    return t.body.muscles[key] || m.label;
  };

  // Muscle color based on state (anatomy-illustration style)
  const getMuscleColor = (group: string, val: number) => {
    if (val >= 4) return '#ff2060';
    if (val >= 3) return '#ff4444';
    if (val >= 2) return '#e8a030';
    if (val >= 1) return '#5588cc';
    // Healthy — deep red/brown anatomy color
    return isFront ? '#c4564a' : '#b84a3e';
  };

  const getMuscleHighlight = (group: string) => {
    return isFront ? '#d87068' : '#cc6058';
  };

  const getMuscleShadow = (group: string) => {
    return isFront ? '#8a3028' : '#7a2820';
  };

  return (
    <div className="transition-transform duration-300" style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>
      <svg viewBox="20 8 80 155" className="w-full" style={{ maxHeight: 520 }}>
        <defs>
          {/* ── GRADIENTS ────────────────────────────── */}

          {/* Skin gradient for exposed areas */}
          <radialGradient id="skinG" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#e8c4b0" />
            <stop offset="50%" stopColor="#d4a088" />
            <stop offset="100%" stopColor="#b8846e" />
          </radialGradient>

          {/* Muscle base gradient — anatomy red */}
          <linearGradient id="muscleBase" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#d45a4a" />
            <stop offset="40%" stopColor="#c0483c" />
            <stop offset="100%" stopColor="#982820" />
          </linearGradient>

          {/* Tendon/fascia white */}
          <linearGradient id="tendonG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f0e8e0" />
            <stop offset="100%" stopColor="#d8ccc0" />
          </linearGradient>

          {/* Vein pattern */}
          <pattern id="veins" patternUnits="userSpaceOnUse" width="6" height="8" patternTransform="rotate(15)">
            <path d="M1,0 Q2,4 1,8" fill="none" stroke="#4466aa44" strokeWidth=".3" />
            <path d="M4,0 Q3,3 4.5,6 Q5,8 4,8" fill="none" stroke="#4466aa33" strokeWidth=".2" />
          </pattern>

          {/* 3D lighting filter */}
          <filter id="muscle3d" x="-5%" y="-5%" width="110%" height="110%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="0.8" result="blur" />
            <feSpecularLighting in="blur" surfaceScale="3" specularConstant=".4" specularExponent="20" result="spec">
              <fePointLight x="60" y="20" z="40" />
            </feSpecularLighting>
            <feComposite in="spec" in2="SourceAlpha" operator="in" result="specOut" />
            <feComposite in="SourceGraphic" in2="specOut" operator="arithmetic" k1="0" k2="1" k3=".3" k4="0" />
          </filter>

          {/* Glow filters for inflammation */}
          <filter id="glow2">
            <feGaussianBlur stdDeviation="2" />
            <feColorMatrix values="1 0 0 0 0.2  0 0.8 0 0 0.1  0 0 0.2 0 0  0 0 0 0.6 0" />
          </filter>
          <filter id="glow3">
            <feGaussianBlur stdDeviation="3" />
            <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.7 0" />
          </filter>
          <filter id="glow4">
            <feGaussianBlur stdDeviation="4" />
            <feColorMatrix values="1 0 0 0 0  0 0 0 0 0  0 0 0.3 0 0  0 0 0 0.8 0" />
          </filter>

          {/* Drop shadow for body outline */}
          <filter id="bodyShadow">
            <feDropShadow dx="0" dy="1" stdDeviation="2" floodColor="#000" floodOpacity=".4" />
          </filter>

          {/* Muscle-specific gradients generated per-zone */}
          {muscles.map(m => {
            const val = soreness[m.group] || 0;
            const base = getMuscleColor(m.group, val);
            const hi = val > 0 ? base : getMuscleHighlight(m.group);
            const sh = val > 0 ? base : getMuscleShadow(m.group);
            return (
              <radialGradient key={`mg_${m.id}`} id={`mg_${m.id}`} cx="40%" cy="30%" r="70%">
                <stop offset="0%" stopColor={hi} stopOpacity=".95" />
                <stop offset="60%" stopColor={base} stopOpacity=".9" />
                <stop offset="100%" stopColor={sh} stopOpacity=".95" />
              </radialGradient>
            );
          })}
        </defs>

        {/* ── BODY SILHOUETTE (skin base) ──────────────── */}
        <g filter="url(#bodyShadow)">
          {/* Head */}
          <ellipse cx="60" cy="14" rx="8" ry="9" fill="url(#skinG)" />
          {/* Ears */}
          <ellipse cx="51.5" cy="14" rx="1.5" ry="2.5" fill="#c9a088" />
          <ellipse cx="68.5" cy="14" rx="1.5" ry="2.5" fill="#c9a088" />
          {/* Hair buzz cut */}
          <path d="M52,10 C54,6 58,4 60,4 C62,4 66,6 68,10 C68,8 66,6 60,5 C54,6 52,8 52,10Z" fill="#3a2a1a" opacity=".7" />

          {/* Neck */}
          <rect x="55" y="20" width="10" height="8" rx="2" fill="url(#skinG)" />

          {/* Torso base shape */}
          <path d={isFront
            ? 'M44,28 C40,28 35,30 33,34 L30,40 L28,48 C26,54 28,58 30,62 L33,64 L38,66 L42,72 L44,78 L50,80 L60,82 L70,80 L76,78 L78,72 L82,66 L87,64 L90,62 C92,58 94,54 92,48 L90,40 L87,34 C85,30 80,28 76,28 L60,27 L44,28Z'
            : 'M44,28 C40,28 35,30 33,34 L30,40 L28,48 C26,54 28,58 30,62 L33,64 L38,66 L42,72 L44,78 L50,80 L60,82 L70,80 L76,78 L78,72 L82,66 L87,64 L90,62 C92,58 94,54 92,48 L90,40 L87,34 C85,30 80,28 76,28 L60,27 L44,28Z'
          } fill="url(#skinG)" />

          {/* Arms skin base */}
          <path d="M30,40 C28,44 25,50 24,56 C22,64 22,72 23,80 L26,88 L28,90 L30,88 C30,82 30,74 30,66 L32,58 L33,50 L30,40Z" fill="url(#skinG)" />
          <path d="M90,40 C92,44 95,50 96,56 C98,64 98,72 97,80 L94,88 L92,90 L90,88 C90,82 90,74 90,66 L88,58 L87,50 L90,40Z" fill="url(#skinG)" />

          {/* Legs skin base */}
          <path d="M44,78 C42,82 39,90 38,98 C36,108 37,118 38,128 L38,140 L40,152 L42,158 L48,158 L50,152 L52,140 C54,130 55,118 55,108 L56,98 C56,90 54,82 52,78 L44,78Z" fill="url(#skinG)" />
          <path d="M76,78 C78,82 81,90 82,98 C84,108 83,118 82,128 L82,140 L80,152 L78,158 L72,158 L70,152 L68,140 C66,130 65,118 65,108 L64,98 C64,90 66,82 68,78 L76,78Z" fill="url(#skinG)" />

          {/* Hands */}
          <ellipse cx="26" cy="91" rx="3" ry="4" fill="url(#skinG)" />
          <ellipse cx="94" cy="91" rx="3" ry="4" fill="url(#skinG)" />

          {/* Feet */}
          <ellipse cx="45" cy="160" rx="5" ry="2.5" fill="url(#skinG)" />
          <ellipse cx="75" cy="160" rx="5" ry="2.5" fill="url(#skinG)" />
        </g>

        {/* ── LINEA ALBA (center line for front) ─────── */}
        {isFront && (
          <line x1="60" y1="30" x2="60" y2="78" stroke="#8a3028" strokeWidth=".4" opacity=".5" />
        )}

        {/* ── SPINE (back view) ──────────────────────── */}
        {!isFront && (
          <g opacity=".3">
            <line x1="58" y1="22" x2="58" y2="74" stroke="#6a4a3a" strokeWidth=".6" />
            {[26,30,34,38,42,46,50,54,58,62,66,70].map(y => (
              <ellipse key={y} cx="58" cy={y} rx="2" ry="1" fill="none" stroke="#6a4a3a" strokeWidth=".3" />
            ))}
          </g>
        )}

        {/* ── MUSCLE ZONES (interactive) ─────────────── */}
        {muscles.map((m) => {
          const val = soreness[m.group] || 0;
          const inf = getInflammationStyle(val);
          const isHov = hovered === m.id;
          const isSel = selected === m.group;
          const active = isHov || isSel;

          return (
            <g key={m.id}
              onClick={() => onMuscleClick(m.group)}
              onMouseEnter={() => setHovered(m.id)}
              onMouseLeave={() => setHovered(null)}
              className="cursor-pointer">

              {/* Inflammation glow behind muscle */}
              {val >= 2 && (
                <path d={m.d} fill={inf.fill}
                  filter={val >= 4 ? 'url(#glow4)' : val >= 3 ? 'url(#glow3)' : 'url(#glow2)'}
                  opacity=".5" />
              )}

              {/* Muscle body with 3D gradient */}
              <path
                d={m.d}
                fill={`url(#mg_${m.id})`}
                stroke={active ? '#fff' : val >= 2 ? inf.stroke : '#8a302866'}
                strokeWidth={active ? '.8' : '.3'}
                filter="url(#muscle3d)"
                opacity={active ? 1 : .92}
                className="transition-all duration-200"
              />

              {/* Vein overlay on arms */}
              {(m.group === 'biceps' || m.group === 'forearms' || m.group === 'triceps') && val === 0 && (
                <path d={m.d} fill="url(#veins)" opacity=".3" />
              )}

              {/* Hover highlight shimmer */}
              {active && (
                <path d={m.d} fill="rgba(255,255,255,.12)" />
              )}

              {/* Pulsing pain indicator */}
              {val >= 2 && (
                <circle cx={m.cx} cy={m.cy} r="1.5" fill={inf.stroke} opacity=".7">
                  <animate attributeName="r" values="1.5;4;1.5"
                    dur={val >= 4 ? '0.6s' : val >= 3 ? '1s' : '1.8s'} repeatCount="indefinite" />
                  <animate attributeName="opacity" values=".7;.1;.7"
                    dur={val >= 4 ? '0.6s' : val >= 3 ? '1s' : '1.8s'} repeatCount="indefinite" />
                </circle>
              )}

              {/* Tooltip */}
              {active && (
                <g>
                  {/* Tooltip connector line */}
                  <line x1={m.cx} y1={m.cy} x2={m.cx} y2={m.cy - 6} stroke={inf.stroke} strokeWidth=".3" opacity=".5" />
                  {/* Background */}
                  <rect x={m.cx - 14} y={m.cy - 13} width="28" height="7" rx="2"
                    fill="rgba(6,8,16,.95)" stroke={inf.stroke} strokeWidth=".4" />
                  {/* Label */}
                  <text x={m.cx} y={m.cy - 8} textAnchor="middle" fill={val > 0 ? inf.stroke : '#00f0b5'}
                    fontSize="3.2" fontWeight="700" fontFamily="Outfit, sans-serif">
                    {getMuscleLabel(m)}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* ── TENDON HIGHLIGHTS ────────────────────────── */}
        {isFront && (
          <g opacity=".25">
            {/* Clavicle line */}
            <path d="M44,28 C48,27 52,27 60,27 C68,27 72,27 76,28" fill="none" stroke="#f0e8e0" strokeWidth=".5" />
            {/* Pec separation */}
            <path d="M60,30 L60,46" stroke="#f0e8e0" strokeWidth=".3" />
            {/* Ab tendinous inscriptions */}
            <line x1="54" y1="48" x2="66" y2="48" stroke="#f0e8e0" strokeWidth=".3" />
            <line x1="54" y1="54" x2="66" y2="54" stroke="#f0e8e0" strokeWidth=".3" />
            <line x1="55" y1="60" x2="65" y2="60" stroke="#f0e8e0" strokeWidth=".3" />
            <line x1="55" y1="66" x2="65" y2="66" stroke="#f0e8e0" strokeWidth=".3" />
            {/* Iliac crest (V-lines) */}
            <path d="M48,68 L54,76" stroke="#f0e8e0" strokeWidth=".3" />
            <path d="M72,68 L66,76" stroke="#f0e8e0" strokeWidth=".3" />
            {/* Knee cap outlines */}
            <ellipse cx="47" cy="117" rx="3" ry="2.5" fill="none" stroke="#d8ccc0" strokeWidth=".3" />
            <ellipse cx="73" cy="117" rx="3" ry="2.5" fill="none" stroke="#d8ccc0" strokeWidth=".3" />
          </g>
        )}

        {/* ── NAVEL ──────────────────────────────────── */}
        {isFront && (
          <ellipse cx="60" cy="70" rx="1" ry="1.2" fill="#8a3028" opacity=".4" />
        )}

        {/* ── NIPPLES ────────────────────────────────── */}
        {isFront && (
          <>
            <circle cx="49" cy="40" r=".7" fill="#a06050" opacity=".5" />
            <circle cx="71" cy="40" r=".7" fill="#a06050" opacity=".5" />
          </>
        )}

      </svg>

      {/* Side label */}
      <div className="text-center mt-1 text-[10px] text-fit-dim font-semibold tracking-wider">
        {isFront ? (t.body?.front || 'Prednja strana') : (t.body?.back || 'Stražnja strana')} · {t.body?.ratePain || 'Klikni na mišić'}
      </div>
    </div>
  );
}
