'use client';

import { useState, useEffect, useRef } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';

type Mood = 'idle' | 'thinking' | 'talking' | 'happy' | 'concerned';

interface Props {
  mood?: Mood;
  isTalking?: boolean;
  message?: string;
}

export default function DrFilip({ mood = 'idle', isTalking = false, message }: Props) {
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [blink, setBlink] = useState(false);
  const [mouthOpen, setMouthOpen] = useState(0);
  const [breathe, setBreathe] = useState(0);
  const [eyeX, setEyeX] = useState(0);
  const [thinkDots, setThinkDots] = useState(0);
  const [handY, setHandY] = useState(0);

  // Blinking
  useEffect(() => {
    const iv = setInterval(() => {
      setBlink(true);
      setTimeout(() => setBlink(false), 150);
    }, 2500 + Math.random() * 2000);
    return () => clearInterval(iv);
  }, []);

  // Breathing
  useEffect(() => {
    const iv = setInterval(() => {
      setBreathe((t) => t + 0.05);
    }, 50);
    return () => clearInterval(iv);
  }, []);

  // Talking mouth animation
  useEffect(() => {
    if (isTalking) {
      const iv = setInterval(() => setMouthOpen(Math.random() * 4 + 1), 120);
      return () => clearInterval(iv);
    }
    setMouthOpen(0);
  }, [isTalking]);

  // Thinking animation
  useEffect(() => {
    if (mood === 'thinking') {
      const iv = setInterval(() => setThinkDots((d) => (d + 1) % 4), 500);
      const ey = setInterval(() => setEyeX(Math.sin(Date.now() / 1000) * 1.5), 100);
      return () => { clearInterval(iv); clearInterval(ey); };
    }
    setEyeX(0);
  }, [mood]);

  // Hand gesture
  useEffect(() => {
    if (mood === 'concerned' || mood === 'thinking') {
      const iv = setInterval(() => setHandY(Math.sin(Date.now() / 600) * 2), 80);
      return () => clearInterval(iv);
    }
    setHandY(0);
  }, [mood]);

  const breathOffset = Math.sin(breathe) * 1.2;
  const eyeHeight = blink ? 0.3 : (mood === 'thinking' ? 1.5 : 2);

  // Eyebrow positions based on mood
  const browL = mood === 'concerned' ? -2 : mood === 'thinking' ? -1.5 : mood === 'happy' ? -1 : 0;
  const browR = mood === 'concerned' ? -1 : mood === 'thinking' ? -2.5 : mood === 'happy' ? -1 : 0;

  // Mouth shape
  const mouthShape = mood === 'happy'
    ? 'M44 62 Q50 66 56 62' // smile
    : mood === 'concerned'
    ? 'M44 64 Q50 61 56 64' // frown
    : mood === 'thinking'
    ? `M46 63 Q50 63 54 63` // flat
    : isTalking
    ? `M45 62 Q50 ${62 + mouthOpen} 55 62` // talking
    : 'M45 63 Q50 64.5 55 63'; // slight smile

  return (
    <div className="relative">
      <svg viewBox="0 0 100 140" className="w-full" style={{ maxHeight: 320 }}>
        <defs>
          {/* Skin gradients */}
          <radialGradient id="drSkin" cx="50%" cy="40%" r="55%">
            <stop offset="0%" stopColor="#f0d0b8" />
            <stop offset="70%" stopColor="#e0b89a" />
            <stop offset="100%" stopColor="#c89878" />
          </radialGradient>
          <linearGradient id="coatG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#ddd" />
          </linearGradient>
          <linearGradient id="shirtG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#c5ddf0" />
            <stop offset="100%" stopColor="#a8c8e0" />
          </linearGradient>
          <filter id="drShadow"><feDropShadow dx="0" dy="1" stdDeviation="1.5" floodColor="#000" floodOpacity=".2" /></filter>
        </defs>

        <g style={{ transform: `translateY(${breathOffset}px)` }}>
          {/* === BODY === */}
          {/* Lab coat */}
          <path d="M28 72 Q25 70 22 74 L18 110 Q18 118 24 120 L38 122 L50 124 L62 122 L76 120 Q82 118 82 110 L78 74 Q75 70 72 72 Q66 68 50 68 Q34 68 28 72 Z"
            fill="url(#coatG)" stroke="#ccc" strokeWidth=".5" filter="url(#drShadow)" />
          {/* Coat lapels */}
          <path d="M38 72 L44 86 L50 72" fill="none" stroke="#bbb" strokeWidth=".8" />
          <path d="M62 72 L56 86 L50 72" fill="none" stroke="#bbb" strokeWidth=".8" />
          {/* Shirt underneath */}
          <path d="M40 72 Q45 70 50 70 Q55 70 60 72 L58 90 Q54 92 50 92 Q46 92 42 90 Z" fill="url(#shirtG)" />
          {/* Coat buttons */}
          <circle cx="50" cy="90" r="1.2" fill="#999" />
          <circle cx="50" cy="98" r="1.2" fill="#999" />
          <circle cx="50" cy="106" r="1.2" fill="#999" />
          {/* Coat pocket */}
          <rect x="56" y="94" width="12" height="8" rx="2" fill="none" stroke="#bbb" strokeWidth=".5" />
          {/* Pen in pocket */}
          <line x1="62" y1="90" x2="62" y2="96" stroke="#3ea8ff" strokeWidth=".8" strokeLinecap="round" />

          {/* === ARMS === */}
          {/* Left arm */}
          <path d="M28 74 Q22 78 20 88 Q18 98 19 108" fill="none" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" />
          {/* Left hand */}
          <circle cx="19" cy="110" r="4" fill="url(#drSkin)" />
          {/* Watch on left wrist */}
          <rect x="15" y="104" width="8" height="5" rx="1.5" fill="#333" stroke="#555" strokeWidth=".5" />
          <rect x="16.5" y="105" width="5" height="3" rx="1" fill="#00f0b5" opacity=".6" />

          {/* Right arm - gestures based on mood */}
          <path d={mood === 'thinking' || mood === 'concerned'
            ? `M72 74 Q78 76 80 82 Q82 88 78 ${92 + handY}`
            : 'M72 74 Q78 78 80 88 Q82 98 81 108'}
            fill="none" stroke="#e8e8e8" strokeWidth="8" strokeLinecap="round" />
          {/* Right hand */}
          {mood === 'thinking' ? (
            // Hand on chin thinking
            <circle cx={78} cy={88 + handY} r="4" fill="url(#drSkin)" />
          ) : (
            <circle cx="81" cy="110" r="4" fill="url(#drSkin)" />
          )}

          {/* Stethoscope */}
          <path d="M42 68 Q40 72 42 80 Q44 86 46 88" fill="none" stroke="#444" strokeWidth="1.2" />
          <path d="M58 68 Q60 72 58 80 Q56 86 54 88" fill="none" stroke="#444" strokeWidth="1.2" />
          <circle cx="50" cy="90" r="3" fill="#555" stroke="#444" strokeWidth=".5" />
          <circle cx="50" cy="90" r="1.5" fill="#777" />

          {/* === HEAD === */}
          {/* Neck */}
          <rect x="44" y="60" width="12" height="12" rx="3" fill="url(#drSkin)" />

          {/* Head shape - round, stocky */}
          <ellipse cx="50" cy="42" rx="18" ry="20" fill="url(#drSkin)" filter="url(#drShadow)" />

          {/* Hair - balding, dark on sides */}
          <path d="M32 38 Q32 22 50 20 Q68 22 68 38 Q66 34 62 32 Q58 30 50 30 Q42 30 38 32 Q34 34 32 38"
            fill="#2a1a0a" />
          {/* Side hair */}
          <path d="M32 38 Q32 42 33 48" fill="none" stroke="#2a1a0a" strokeWidth="3" strokeLinecap="round" />
          <path d="M68 38 Q68 42 67 48" fill="none" stroke="#2a1a0a" strokeWidth="3" strokeLinecap="round" />

          {/* Ears */}
          <ellipse cx="32" cy="44" rx="3" ry="4.5" fill="#d4a088" />
          <ellipse cx="68" cy="44" rx="3" ry="4.5" fill="#d4a088" />

          {/* === FACE === */}
          {/* Eyes */}
          <ellipse cx={43 + eyeX} cy="40" rx="3.5" ry={eyeHeight} fill="white" />
          <ellipse cx={57 + eyeX} cy="40" rx="3.5" ry={eyeHeight} fill="white" />
          {!blink && (
            <>
              <circle cx={43.5 + eyeX} cy="40" r="1.8" fill="#2c1810" />
              <circle cx={57.5 + eyeX} cy="40" r="1.8" fill="#2c1810" />
              <circle cx={43 + eyeX} cy="39.2" r=".6" fill="white" />
              <circle cx={57 + eyeX} cy="39.2" r=".6" fill="white" />
            </>
          )}

          {/* Eyebrows */}
          <path d={`M38 ${35 + browL} Q43 ${33 + browL} 47 ${35 + browL}`}
            fill="none" stroke="#2a1a0a" strokeWidth="1.5" strokeLinecap="round" />
          <path d={`M53 ${35 + browR} Q57 ${33 + browR} 62 ${35 + browR}`}
            fill="none" stroke="#2a1a0a" strokeWidth="1.5" strokeLinecap="round" />

          {/* Nose */}
          <path d="M49 44 Q50 50 51 44" fill="none" stroke="#c08060" strokeWidth=".8" />
          <path d="M46 50 Q50 52 54 50" fill="none" stroke="#c08060" strokeWidth=".6" />

          {/* Mouth */}
          <path d={mouthShape} fill={isTalking ? '#a05040' : 'none'} stroke="#a05040" strokeWidth={isTalking ? '.5' : '.9'} strokeLinecap="round" />
          {isTalking && mouthOpen > 2 && (
            <path d={`M47 62 Q50 ${62 + mouthOpen * 0.6} 53 62`} fill="#801010" />
          )}

          {/* 5 o'clock shadow */}
          <path d="M38 56 Q42 60 50 61 Q58 60 62 56 Q60 58 50 59 Q40 58 38 56"
            fill="#2a1a0a" opacity=".06" />

          {/* Slight double chin */}
          <path d="M40 58 Q50 62 60 58" fill="none" stroke="#c89878" strokeWidth=".5" opacity=".4" />

          {/* Glasses - would add if specified, but image shows no glasses on character */}

          {/* === LEGS === */}
          <path d="M38 120 L36 136" fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round" />
          <path d="M62 120 L64 136" fill="none" stroke="#333" strokeWidth="6" strokeLinecap="round" />
          {/* Shoes */}
          <ellipse cx="34" cy="138" rx="6" ry="2.5" fill="#5a3520" />
          <ellipse cx="66" cy="138" rx="6" ry="2.5" fill="#5a3520" />
        </g>

        {/* Thinking dots */}
        {mood === 'thinking' && (
          <g>
            {[0, 1, 2].map((i) => (
              <circle key={i} cx={72 + i * 6} cy={30 - i * 4} r={i <= thinkDots ? 2 : 1}
                fill={i <= thinkDots ? '#3ea8ff' : '#3ea8ff44'}
                style={{ transition: 'all .3s' }} />
            ))}
          </g>
        )}

        {/* Happy sparkles */}
        {mood === 'happy' && (
          <g>
            <text x="24" y="30" fontSize="6" opacity=".7">✨</text>
            <text x="70" y="26" fontSize="5" opacity=".5">⭐</text>
          </g>
        )}
      </svg>

      {/* Speech bubble */}
      {message && (
        <div className="absolute top-2 right-0 max-w-[200px] py-2 px-3 rounded-xl bg-white/[0.08] border border-fit-border backdrop-blur-sm animate-[fadeIn_0.3s_ease]">
          <div className="text-[10px] text-fit-text leading-relaxed">{message}</div>
          <div className="absolute bottom-[-6px] left-8 w-3 h-3 bg-white/[0.08] border-b border-r border-fit-border rotate-45" />
        </div>
      )}
    </div>
  );
}
