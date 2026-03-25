'use client';

import { useState } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { frontMuscles, backMuscles, getMuscleGroup, type MuscleZone } from '@shared/constants/muscleMap';
import { getInflammationStyle } from '@shared/constants/soreness';

interface Props {
  soreness: Record<string, number>;
  onMuscleClick: (group: string) => void;
  selected: string | null;
  zoom: number;
  isFront: boolean;
}

const skinBase = '#d4a088';
const skinLight = '#e8c4b0';
const skinShadow = '#b8846e';
const skinDeep = '#a07060';

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const muscles = isFront ? frontMuscles : backMuscles;

  const getSoreVal = (id: string) => {
    const group = getMuscleGroup(id);
    return soreness[group] || 0;
  };

  const getMuscleLabel = (m: MuscleZone) => {
    const key = m.label as keyof typeof t.body.muscles;
    return t.body.muscles[key] || m.label;
  };

  return (
    <svg
      viewBox="0 0 120 200"
      className="w-full transition-transform duration-300"
      style={{ maxHeight: 440, transform: `scale(${zoom})`, transformOrigin: 'center center' }}
    >
      <defs>
        <radialGradient id="skinG" cx="50%" cy="35%" r="60%">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="60%" stopColor={skinBase} />
          <stop offset="100%" stopColor={skinShadow} />
        </radialGradient>
        <linearGradient id="skinVert" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={skinLight} />
          <stop offset="100%" stopColor={skinShadow} />
        </linearGradient>
        <filter id="muscleDepth">
          <feGaussianBlur in="SourceAlpha" stdDeviation="1" result="blur" />
          <feSpecularLighting in="blur" surfaceScale="3" specularConstant=".4" specularExponent="20" result="spec">
            <fePointLight x="60" y="20" z="40" />
          </feSpecularLighting>
          <feComposite in="SourceGraphic" in2="spec" operator="arithmetic" k1="0" k2="1" k3=".3" k4="0" />
        </filter>
        <filter id="softS"><feDropShadow dx="0" dy="1.5" stdDeviation="2" floodColor="#000" floodOpacity=".25" /></filter>
        <filter id="heatGlow"><feGaussianBlur stdDeviation="4" /></filter>
        <pattern id="veinPattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
          <path d="M2 0 Q4 5 3 10 Q2 15 4 20" fill="none" stroke="rgba(120,80,100,.08)" strokeWidth=".3" />
          <path d="M12 0 Q10 8 11 16 Q12 18 10 20" fill="none" stroke="rgba(120,80,100,.06)" strokeWidth=".2" />
        </pattern>
      </defs>

      {/* Background glow */}
      <radialGradient id="bgG" cx="50%" cy="40%" r="50%">
        <stop offset="0%" stopColor="#00f0b5" stopOpacity=".04" />
        <stop offset="100%" stopColor="#00f0b5" stopOpacity="0" />
      </radialGradient>
      <ellipse cx="60" cy="100" rx="50" ry="90" fill="url(#bgG)" />

      {/* BODY STRUCTURE */}
      <g filter="url(#softS)">
        {/* Head */}
        <ellipse cx="60" cy="38" rx="14" ry="17" fill="url(#skinG)" />
        <path d="M48 42 Q50 50 54 54 Q57 56 60 56.5 Q63 56 66 54 Q70 50 72 42" fill="url(#skinG)" />
        <ellipse cx={isFront ? 47 : 73} cy="38" rx="2.5" ry="4" fill={skinShadow} />
        <ellipse cx={isFront ? 73 : 47} cy="38" rx="2.5" ry="4" fill={skinShadow} />
        {/* Hair */}
        <path d="M46 32 Q46 20 60 18 Q74 20 74 32 Q74 26 68 22 Q64 20 60 20 Q56 20 52 22 Q46 26 46 32" fill="#1a1008" />

        {isFront && (
          <>
            {/* Eyes */}
            <ellipse cx="54" cy="35" rx="3" ry="2" fill="white" />
            <ellipse cx="66" cy="35" rx="3" ry="2" fill="white" />
            <circle cx="54" cy="35" r="1.2" fill="#2c1810" />
            <circle cx="66" cy="35" r="1.2" fill="#2c1810" />
            <circle cx="53.5" cy="34.5" r=".5" fill="white" />
            <circle cx="65.5" cy="34.5" r=".5" fill="white" />
            {/* Eyebrows */}
            <path d="M50 31 Q54 29.5 57 31" fill="none" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round" />
            <path d="M63 31 Q66 29.5 70 31" fill="none" stroke="#1a1008" strokeWidth="1.2" strokeLinecap="round" />
            {/* Nose & Mouth */}
            <path d="M59 38 Q60 42 61 38" fill="none" stroke={skinDeep} strokeWidth=".7" />
            <path d="M56 46 Q60 48.5 64 46" fill="none" stroke="#b06050" strokeWidth=".9" strokeLinecap="round" />
          </>
        )}

        {/* Neck */}
        <path d="M53 54 L53 64 Q56 66 60 66.5 Q64 66 67 64 L67 54" fill="url(#skinVert)" />
        <path d="M54 56 Q56 62 57 65" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".5" />
        <path d="M66 56 Q64 62 63 65" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".5" />

        {/* Torso */}
        <path d="M42 68 Q36 66 33 72 Q32 76 33 80 L36 82 Q38 84 40 86 L42 98 Q42 106 44 114 L46 118 Q52 120 60 120 Q68 120 74 118 L76 114 Q78 106 78 98 L80 86 Q82 84 84 82 L87 80 Q88 76 87 72 Q84 66 78 68 Q72 66 60 66 Q48 66 42 68 Z" fill="url(#skinG)" />
        <path d="M42 68 Q36 66 33 72 Q32 76 33 80 L36 82 Q38 84 40 86 L42 98 Q42 106 44 114 L46 118 Q52 120 60 120 Q68 120 74 118 L76 114 Q78 106 78 98 L80 86 Q82 84 84 82 L87 80 Q88 76 87 72 Q84 66 78 68 Q72 66 60 66 Q48 66 42 68 Z" fill="url(#veinPattern)" opacity=".6" />

        {/* Front muscle definition */}
        {isFront && (
          <>
            <path d="M60 72 L60 86" stroke={skinDeep} strokeWidth=".6" opacity=".4" />
            <path d="M44 74 Q50 72 58 74 Q59 76 58 82 Q54 86 48 84 Q44 82 42 78" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".35" />
            <path d="M76 74 Q70 72 62 74 Q61 76 62 82 Q66 86 72 84 Q76 82 78 78" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".35" />
            <path d="M54 88 Q60 87 66 88" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".35" />
            <path d="M54 94 Q60 93 66 94" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".35" />
            <path d="M54 100 Q60 99 66 100" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".35" />
            <path d="M55 106 Q60 105 65 106" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".35" />
            <line x1="60" y1="86" x2="60" y2="114" stroke={skinDeep} strokeWidth=".5" opacity=".3" />
            <path d="M44 84 Q46 82 48 84" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".3" />
            <path d="M44 88 Q46 86 48 88" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".3" />
            <path d="M76 84 Q74 82 72 84" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".3" />
            <path d="M76 88 Q74 86 72 88" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".3" />
            <path d="M54 112 Q56 116 58 118" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".3" />
            <path d="M66 112 Q64 116 62 118" fill="none" stroke={skinDeep} strokeWidth=".5" opacity=".3" />
          </>
        )}

        {/* Back muscle definition */}
        {!isFront && (
          <>
            <path d="M48 70 Q54 68 60 67 Q66 68 72 70" fill="none" stroke={skinShadow} strokeWidth=".6" opacity=".35" />
            <path d="M50 76 Q54 74 60 73 Q66 74 70 76" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
            <line x1="60" y1="66" x2="60" y2="116" stroke={skinDeep} strokeWidth=".4" opacity=".25" />
            <path d="M46 80 Q44 86 42 96 Q42 100 44 104" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
            <path d="M74 80 Q76 86 78 96 Q78 100 76 104" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
            <circle cx="55" cy="112" r="1.5" fill="none" stroke={skinDeep} strokeWidth=".4" opacity=".2" />
            <circle cx="65" cy="112" r="1.5" fill="none" stroke={skinDeep} strokeWidth=".4" opacity=".2" />
          </>
        )}

        {/* Arms */}
        <path d="M33 80 Q30 82 28 90 Q26 100 26.5 108 Q26 112 27 116" fill="none" stroke={skinBase} strokeWidth="9" strokeLinecap="round" />
        <path d="M27 118 Q25 126 24 134 Q23 138 24 140" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M30 84 Q29 92 28 100" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
        <path d="M28 94 Q27 100 26 108" fill="none" stroke="rgba(100,70,80,.12)" strokeWidth=".4" />
        <ellipse cx="24" cy="142" rx="3.5" ry="4.5" fill={skinBase} />
        <path d="M87 80 Q90 82 92 90 Q94 100 93.5 108 Q94 112 93 116" fill="none" stroke={skinBase} strokeWidth="9" strokeLinecap="round" />
        <path d="M93 118 Q95 126 96 134 Q97 138 96 140" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M90 84 Q91 92 92 100" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
        <path d="M92 94 Q93 100 94 108" fill="none" stroke="rgba(100,70,80,.12)" strokeWidth=".4" />
        <ellipse cx="96" cy="142" rx="3.5" ry="4.5" fill={skinBase} />

        {/* Legs */}
        <path d="M46 118 Q44 120 43 128 Q42 140 43 152 Q43 158 44 162 Q44 168 45 172" fill="none" stroke={skinBase} strokeWidth="10" strokeLinecap="round" />
        <path d="M56 118 Q58 120 58 128 Q58 140 57 152 Q56 158 55 162 Q55 168 54 172" fill="none" stroke={skinBase} strokeWidth="10" strokeLinecap="round" />
        <path d="M44 168 Q44 174 45 180 Q46 186 48 188" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M55 168 Q55 174 54 180 Q52 186 50 188" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M50 122 Q50 134 50 148" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
        <ellipse cx="50" cy="160" rx="5" ry="3" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".25" />
        <ellipse cx="49" cy="190" rx="5.5" ry="2.5" fill="#666" />
        <path d="M64 118 Q62 120 62 128 Q62 140 63 152 Q63 158 64 162 Q64 168 65 172" fill="none" stroke={skinBase} strokeWidth="10" strokeLinecap="round" />
        <path d="M74 118 Q76 120 77 128 Q78 140 77 152 Q77 158 76 162 Q76 168 75 172" fill="none" stroke={skinBase} strokeWidth="10" strokeLinecap="round" />
        <path d="M65 168 Q65 174 66 180 Q67 186 68 188" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M76 168 Q76 174 75 180 Q73 186 71 188" fill="none" stroke={skinBase} strokeWidth="7" strokeLinecap="round" />
        <path d="M70 122 Q70 134 70 148" fill="none" stroke={skinShadow} strokeWidth=".5" opacity=".3" />
        <ellipse cx="70" cy="160" rx="5" ry="3" fill="none" stroke={skinShadow} strokeWidth=".4" opacity=".25" />
        <ellipse cx="69" cy="190" rx="5.5" ry="2.5" fill="#666" />
      </g>

      {/* MUSCLE OVERLAY WITH INFLAMMATION */}
      {muscles.map((m) => {
        const val = getSoreVal(m.id);
        const inf = getInflammationStyle(val);
        const isHov = hovered === m.id;
        const isSel = selected === m.id;
        const group = getMuscleGroup(m.id);

        return (
          <g
            key={m.id}
            onClick={() => onMuscleClick(group)}
            onMouseEnter={() => setHovered(m.id)}
            onMouseLeave={() => setHovered(null)}
            className="cursor-pointer"
          >
            {val >= 2 && m.paths.map((p, i) => (
              <path key={`glow${i}`} d={p} fill={inf.fill} filter="url(#heatGlow)" opacity=".6" />
            ))}
            {m.paths.map((p, i) => (
              <path
                key={i}
                d={p}
                fill={isHov || isSel ? `${inf.stroke}30` : inf.fill}
                stroke={inf.stroke}
                strokeWidth={isHov || isSel ? 1 : 0.5}
                opacity={isHov || isSel ? 0.9 : 0.7}
                className="transition-all duration-200"
                style={{ filter: val >= 3 ? inf.glow : 'none' }}
              />
            ))}
            {val >= 2 && (
              <circle cx={m.cx} cy={m.cy} r="2" fill={inf.stroke} opacity=".5">
                <animate attributeName="r" values="2;4;2" dur={val >= 4 ? '1s' : '2s'} repeatCount="indefinite" />
                <animate attributeName="opacity" values=".5;.15;.5" dur={val >= 4 ? '1s' : '2s'} repeatCount="indefinite" />
              </circle>
            )}
            {(isHov || isSel) && (
              <g>
                <rect x={m.cx - 24} y={m.cy - 18} width="48" height="16" rx="4" fill="rgba(0,0,0,.85)" stroke={inf.stroke} strokeWidth=".5" />
                <text x={m.cx} y={m.cy - 8} textAnchor="middle" fill={inf.stroke} fontSize="5.5" fontWeight="700" fontFamily="Outfit, sans-serif">
                  {getMuscleLabel(m)}
                </text>
              </g>
            )}
          </g>
        );
      })}

      <text x="60" y="197" textAnchor="middle" fill="#4a4e62" fontSize="4.5" fontFamily="Outfit, sans-serif">
        {isFront ? t.body.front : t.body.back} · {t.body.ratePain}
      </text>
    </svg>
  );
}
