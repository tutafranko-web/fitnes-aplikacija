'use client';

import { useState, useEffect } from 'react';

type Mood = 'idle' | 'talking' | 'thinking' | 'excited' | 'listening';

interface Props {
  trainerId: string;
  mood?: Mood;
  size?: number;
}

export default function TrainerAvatar({ trainerId, mood = 'idle', size = 200 }: Props) {
  const [blink, setBlink] = useState(false);
  const [breathe, setBreathe] = useState(0);
  const [mouth, setMouth] = useState(0);
  const [gesture, setGesture] = useState(0);

  // Blink
  useEffect(() => {
    const iv = setInterval(() => { setBlink(true); setTimeout(() => setBlink(false), 150); }, 2800 + Math.random() * 2000);
    return () => clearInterval(iv);
  }, []);

  // Breathe
  useEffect(() => {
    const iv = setInterval(() => setBreathe((t) => t + 0.04), 50);
    return () => clearInterval(iv);
  }, []);

  // Talking mouth
  useEffect(() => {
    if (mood === 'talking' || mood === 'excited') {
      const iv = setInterval(() => setMouth(Math.random() * 5 + 1), 100);
      return () => clearInterval(iv);
    }
    setMouth(0);
  }, [mood]);

  // Gesture animation
  useEffect(() => {
    const iv = setInterval(() => setGesture(Date.now()), 80);
    return () => clearInterval(iv);
  }, []);

  const br = Math.sin(breathe) * 1.5;
  const eyeH = blink ? 0.4 : 2.2;
  const g = Math.sin(gesture / 500);
  const g2 = Math.sin(gesture / 700);

  const renderTrainer = () => {
    switch (trainerId) {
      case 'mate': return <MateSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} />;
      case 'iva': return <IvaSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} />;
      case 'tomo': return <TomoSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} />;
      case 'sara': return <SaraSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} g2={g2} />;
      case 'ante': return <AnteSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} />;
      case 'maja': return <MajaSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} />;
      case 'dino': return <DinoSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} g2={g2} />;
      case 'lana': return <LanaSVG br={br} eyeH={eyeH} mouth={mouth} mood={mood} g={g} g2={g2} />;
      default: return null;
    }
  };

  return (
    <svg viewBox="0 0 120 170" width={size} height={size * 1.42}>
      {renderTrainer()}
    </svg>
  );
}

interface SvgProps { br: number; eyeH: number; mouth: number; mood: Mood; g: number; g2?: number }

// ═══════════════════════════════════════
// MATE BULJAN — Massive, shouting, stringer
// ═══════════════════════════════════════
function MateSVG({ br, eyeH, mouth, mood, g }: SvgProps) {
  const armSwing = mood === 'excited' ? g * 12 : mood === 'talking' ? g * 5 : g * 2;
  return (
    <g transform={`translate(0,${br})`}>
      {/* Legs */}
      <rect x="38" y="118" width="14" height="32" rx="5" fill="#1a1a1a" />
      <rect x="68" y="118" width="14" height="32" rx="5" fill="#1a1a1a" />
      <ellipse cx="45" cy="152" rx="9" ry="3" fill="#333" />
      <ellipse cx="75" cy="152" rx="9" ry="3" fill="#333" />
      {/* Body — massive V-taper */}
      <path d="M30 72 Q28 68 24 72 L20 116 Q22 122 30 122 L90 122 Q98 122 100 116 L96 72 Q92 68 90 72 Q82 66 60 66 Q38 66 30 72 Z" fill="#ff6b4a" />
      {/* Stringer cutout */}
      <path d="M40 66 L46 80 L60 82 L74 80 L80 66" fill="#d4a088" />
      {/* Pec definition */}
      <path d="M46 78 Q53 82 60 80 Q67 82 74 78" fill="none" stroke="#c08868" strokeWidth=".6" opacity=".5" />
      {/* Arms — huge */}
      <path d={`M24 74 Q${16 + armSwing} 82 ${14 + armSwing} 98 Q${12 + armSwing} 106 ${16 + armSwing} 112`} fill="none" stroke="#d4a088" strokeWidth="14" strokeLinecap="round" />
      <path d={`M96 74 Q${104 - armSwing} 82 ${106 - armSwing} 98 Q${108 - armSwing} 106 ${104 - armSwing} 112`} fill="none" stroke="#d4a088" strokeWidth="14" strokeLinecap="round" />
      {/* Veins on arms */}
      <path d={`M20 82 Q18 90 19 100`} fill="none" stroke="#c08060" strokeWidth=".6" opacity=".3" />
      <path d={`M100 82 Q102 90 101 100`} fill="none" stroke="#c08060" strokeWidth=".6" opacity=".3" />
      {/* Hands */}
      <circle cx={16 + armSwing} cy="114" r="5" fill="#d4a088" />
      <circle cx={104 - armSwing} cy="114" r="5" fill="#d4a088" />
      {/* Neck — thick */}
      <rect x="48" y="55" width="24" height="14" rx="6" fill="#d4a088" />
      {/* Head */}
      <ellipse cx="60" cy="40" rx="18" ry="20" fill="#d4a088" />
      {/* Buzzcut */}
      <path d="M42 32 Q42 18 60 16 Q78 18 78 32 Q76 28 70 24 Q64 22 60 22 Q56 22 50 24 Q44 28 42 32" fill="#2a1808" opacity=".7" />
      {/* Stubble */}
      <path d="M46 48 Q52 54 60 55 Q68 54 74 48" fill="#2a1808" opacity=".08" />
      {/* Eyes — angry/intense */}
      <ellipse cx="52" cy="38" rx="3.5" ry={eyeH} fill="white" />
      <ellipse cx="68" cy="38" rx="3.5" ry={eyeH} fill="white" />
      {eyeH > 1 && <>
        <circle cx="52" cy="38" r="2" fill="#1a1008" />
        <circle cx="68" cy="38" r="2" fill="#1a1008" />
      </>}
      {/* Angry brows */}
      <path d={`M46 ${mood === 'excited' ? 32 : 34} L56 ${mood === 'excited' ? 34 : 33}`} stroke="#2a1808" strokeWidth="2.5" strokeLinecap="round" />
      <path d={`M74 ${mood === 'excited' ? 32 : 34} L64 ${mood === 'excited' ? 34 : 33}`} stroke="#2a1808" strokeWidth="2.5" strokeLinecap="round" />
      {/* Broken nose */}
      <path d="M59 42 Q60.5 46 59.5 42" fill="none" stroke="#b87858" strokeWidth="1" />
      {/* Mouth — SHOUTING */}
      {mood === 'talking' || mood === 'excited' ? (
        <ellipse cx="60" cy={50 + mouth * 0.3} rx={6 + mouth} ry={2 + mouth * 0.8} fill="#8b2020" stroke="#a05040" strokeWidth=".5" />
      ) : (
        <path d="M52 50 Q60 54 68 50" fill="none" stroke="#a05040" strokeWidth="1.2" />
      )}
      {/* Sweat drops when excited */}
      {mood === 'excited' && <>
        <circle cx="78" cy="36" r="1.5" fill="#3ea8ff" opacity=".6" />
        <circle cx="42" cy="42" r="1" fill="#3ea8ff" opacity=".4" />
      </>}
    </g>
  );
}

// ═══════════════════════════════════════
// IVA NOVAK — Glasses, ponytail, clipboard
// ═══════════════════════════════════════
function IvaSVG({ br, eyeH, mouth, mood, g }: SvgProps) {
  return (
    <g transform={`translate(0,${br})`}>
      <rect x="42" y="118" width="12" height="30" rx="4" fill="#1a1a1a" />
      <rect x="66" y="118" width="12" height="30" rx="4" fill="#1a1a1a" />
      <ellipse cx="48" cy="150" rx="7" ry="2.5" fill="#333" />
      <ellipse cx="72" cy="150" rx="7" ry="2.5" fill="#333" />
      {/* Body — zip jacket */}
      <path d="M34 72 L28 118 Q30 124 38 124 L82 124 Q90 124 92 118 L86 72 Q78 66 60 66 Q42 66 34 72 Z" fill="#2d8a6e" />
      {/* Zip line */}
      <line x1="60" y1="68" x2="60" y2="122" stroke="#1a5a3e" strokeWidth="1.5" />
      <circle cx="60" cy="80" r="2" fill="#888" />
      {/* Arms */}
      <path d="M30 76 Q24 84 22 98 Q20 108 24 114" fill="none" stroke="#2d8a6e" strokeWidth="10" strokeLinecap="round" />
      <path d="M90 76 Q96 84 98 98 Q100 108 96 114" fill="none" stroke="#2d8a6e" strokeWidth="10" strokeLinecap="round" />
      {/* Hands */}
      <circle cx="24" cy="116" r="4.5" fill="#e8c4b0" />
      <circle cx="96" cy="116" r="4.5" fill="#e8c4b0" />
      {/* Clipboard in left hand */}
      <rect x="14" y="104" width="16" height="20" rx="2" fill="#f5f0e0" stroke="#ccc" strokeWidth=".5" />
      <line x1="17" y1="108" x2="27" y2="108" stroke="#aaa" strokeWidth=".5" />
      <line x1="17" y1="111" x2="27" y2="111" stroke="#aaa" strokeWidth=".5" />
      <line x1="17" y1="114" x2="24" y2="114" stroke="#aaa" strokeWidth=".5" />
      <rect x="17" y="116" width="6" height="4" rx="1" fill="#00f0b5" opacity=".5" />
      {/* Watch on right wrist */}
      <rect x="92" y="108" width="8" height="5" rx="1.5" fill="#333" />
      <rect x="93.5" y="109" width="5" height="3" rx="1" fill="#00f0b5" opacity=".5" />
      {/* Neck */}
      <rect x="50" y="55" width="20" height="14" rx="5" fill="#e8c4b0" />
      {/* Head */}
      <ellipse cx="60" cy="38" rx="17" ry="19" fill="#e8c4b0" />
      {/* Hair — brown ponytail */}
      <path d="M43 30 Q44 18 60 16 Q76 18 77 30 Q76 26 70 22 Q60 20 50 22 Q44 26 43 30" fill="#3d2b1f" />
      <path d="M75 28 Q80 32 84 40 Q86 46 84 52" fill="none" stroke="#3d2b1f" strokeWidth="5" strokeLinecap="round" />
      {/* Glasses — rectangular */}
      <rect x="44" y="34" rx="2" width="14" height="10" fill="none" stroke="#444" strokeWidth="1.5" />
      <rect x="62" y="34" rx="2" width="14" height="10" fill="none" stroke="#444" strokeWidth="1.5" />
      <line x1="58" y1="38" x2="62" y2="38" stroke="#444" strokeWidth="1" />
      <line x1="44" y1="38" x2="40" y2="36" stroke="#444" strokeWidth="1" />
      <line x1="76" y1="38" x2="80" y2="36" stroke="#444" strokeWidth="1" />
      {/* Eyes behind glasses */}
      <ellipse cx="51" cy="38" rx="2.5" ry={eyeH * 0.9} fill="white" />
      <ellipse cx="69" cy="38" rx="2.5" ry={eyeH * 0.9} fill="white" />
      {eyeH > 1 && <>
        <circle cx="51" cy="38" r="1.5" fill="#2c1810" />
        <circle cx="69" cy="38" r="1.5" fill="#2c1810" />
      </>}
      {/* Brows — focused */}
      <path d="M45 32 Q51 30 56 32" fill="none" stroke="#3d2b1f" strokeWidth="1.2" />
      <path d="M64 32 Q69 30 75 32" fill="none" stroke="#3d2b1f" strokeWidth="1.2" />
      {/* Mouth — slight professional smile */}
      {mouth > 0 ? (
        <path d={`M52 48 Q60 ${50 + mouth * 0.5} 68 48`} fill="#a05040" stroke="#a05040" strokeWidth=".5" />
      ) : (
        <path d="M53 48 Q60 50 67 48" fill="none" stroke="#a05040" strokeWidth=".8" />
      )}
      {/* Thinking dots */}
      {mood === 'thinking' && <>
        <circle cx="82" cy="24" r="2" fill="#3ea8ff" opacity=".6"><animate attributeName="opacity" values=".3;.8;.3" dur="1.5s" repeatCount="indefinite" /></circle>
        <circle cx="88" cy="18" r="1.5" fill="#3ea8ff" opacity=".4"><animate attributeName="opacity" values=".2;.6;.2" dur="1.5s" begin=".3s" repeatCount="indefinite" /></circle>
      </>}
    </g>
  );
}

// ═══════════════════════════════════════
// TOMO — Crossed arms, beard, stern
// ═══════════════════════════════════════
function TomoSVG({ br, eyeH, mouth, mood, g }: SvgProps) {
  return (
    <g transform={`translate(0,${br})`}>
      <rect x="40" y="118" width="13" height="32" rx="5" fill="#1a1a1a" />
      <rect x="67" y="118" width="13" height="32" rx="5" fill="#1a1a1a" />
      <ellipse cx="46" cy="152" rx="8" ry="3" fill="#222" />
      <ellipse cx="74" cy="152" rx="8" ry="3" fill="#222" />
      {/* Body — blue tshirt, stocky */}
      <path d="M32 72 L26 120 Q28 126 36 126 L84 126 Q92 126 94 120 L88 72 Q80 66 60 66 Q40 66 32 72 Z" fill="#3074a0" />
      {/* Crossed arms */}
      <path d="M32 76 Q28 82 34 92 Q40 100 52 100 L60 96" fill="none" stroke="#d4a088" strokeWidth="11" strokeLinecap="round" />
      <path d="M88 76 Q92 82 86 92 Q80 100 68 100 L60 96" fill="none" stroke="#d4a088" strokeWidth="11" strokeLinecap="round" />
      {/* Hands (crossed) */}
      <circle cx="34" cy="94" r="4.5" fill="#d4a088" />
      <circle cx="86" cy="94" r="4.5" fill="#d4a088" />
      {/* Neck thick */}
      <rect x="46" y="54" width="28" height="15" rx="7" fill="#d4a088" />
      {/* Head */}
      <ellipse cx="60" cy="36" rx="18" ry="20" fill="#d4a088" />
      {/* Short grey-ish hair */}
      <path d="M42 28 Q44 16 60 14 Q76 16 78 28 Q76 24 68 20 Q60 18 52 20 Q44 24 42 28" fill="#666" opacity=".6" />
      {/* Full beard */}
      <path d="M44 42 Q44 56 52 60 Q56 62 60 62 Q64 62 68 60 Q76 56 76 42" fill="#555" opacity=".7" />
      <path d="M46 44 Q50 48 60 48 Q70 48 74 44" fill="none" stroke="#444" strokeWidth=".5" />
      {/* Eyes — stern, half-closed */}
      <ellipse cx="52" cy="36" rx="3" ry={eyeH * 0.7} fill="white" />
      <ellipse cx="68" cy="36" rx="3" ry={eyeH * 0.7} fill="white" />
      {eyeH > 1 && <>
        <circle cx="52" cy="36" r="1.8" fill="#2a1a0a" />
        <circle cx="68" cy="36" r="1.8" fill="#2a1a0a" />
      </>}
      {/* Flat stern brows */}
      <line x1="46" y1="31" x2="57" y2="31" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <line x1="63" y1="31" x2="74" y2="31" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      {/* Mouth hidden in beard — barely visible */}
      {mouth > 0 ? (
        <path d={`M54 48 Q60 ${48 + mouth * 0.3} 66 48`} fill="#6b3a2a" />
      ) : (
        <line x1="54" y1="48" x2="66" y2="48" stroke="#6b3a2a" strokeWidth=".8" />
      )}
    </g>
  );
}

// ═══════════════════════════════════════
// SARA — Yoga, bun, peaceful, slim
// ═══════════════════════════════════════
function SaraSVG({ br, eyeH, mouth, mood, g, g2 = 0 }: SvgProps) {
  const sway = mood === 'idle' ? g * 2 : 0;
  return (
    <g transform={`translate(${sway},${br})`}>
      <rect x="44" y="118" width="10" height="30" rx="4" fill="#2a1a3a" />
      <rect x="66" y="118" width="10" height="30" rx="4" fill="#2a1a3a" />
      <ellipse cx="49" cy="150" rx="6" ry="2" fill="#443" />
      <ellipse cx="71" cy="150" rx="6" ry="2" fill="#443" />
      {/* Body — slim, purple crop top */}
      <path d="M38 72 L34 118 Q36 124 42 124 L78 124 Q84 124 86 118 L82 72 Q74 66 60 66 Q46 66 38 72 Z" fill="#5b3dc4" />
      {/* Arms — graceful */}
      <path d={`M36 76 Q${28 + g2 * 4} 84 ${26 + g2 * 6} 100 Q${24 + g2 * 6} 110 ${28 + g2 * 4} 116`} fill="none" stroke="#e8c4b0" strokeWidth="8" strokeLinecap="round" />
      <path d={`M84 76 Q${92 - g2 * 4} 84 ${94 - g2 * 6} 100 Q${96 - g2 * 6} 110 ${92 - g2 * 4} 116`} fill="none" stroke="#e8c4b0" strokeWidth="8" strokeLinecap="round" />
      <circle cx={28 + g2 * 4} cy="118" r="4" fill="#e8c4b0" />
      <circle cx={92 - g2 * 4} cy="118" r="4" fill="#e8c4b0" />
      {/* Lotus tattoo on wrist */}
      <text x="24" y="112" fontSize="5" fill="#7c5cfc" opacity=".6">❀</text>
      {/* Neck */}
      <rect x="52" y="55" width="16" height="13" rx="4" fill="#e8c4b0" />
      {/* Head — softer */}
      <ellipse cx="60" cy="38" rx="16" ry="18" fill="#e8c4b0" />
      {/* Hair bun on top */}
      <circle cx="60" cy="18" r="8" fill="#2a1a0a" />
      <path d="M44 30 Q46 22 52 20" fill="none" stroke="#2a1a0a" strokeWidth="3" />
      <path d="M76 30 Q74 22 68 20" fill="none" stroke="#2a1a0a" strokeWidth="3" />
      {/* Ears */}
      <ellipse cx="44" cy="38" rx="3" ry="4" fill="#dbb098" />
      <ellipse cx="76" cy="38" rx="3" ry="4" fill="#dbb098" />
      {/* Eyes — peaceful, slightly closed */}
      <ellipse cx="53" cy="38" rx="3" ry={mood === 'idle' ? eyeH * 0.6 : eyeH} fill="white" />
      <ellipse cx="67" cy="38" rx="3" ry={mood === 'idle' ? eyeH * 0.6 : eyeH} fill="white" />
      {eyeH > 1 && <>
        <circle cx="53" cy="38" r="1.5" fill="#2c1810" />
        <circle cx="67" cy="38" r="1.5" fill="#2c1810" />
      </>}
      {/* Soft brows */}
      <path d="M48 33 Q53 31 57 33" fill="none" stroke="#2a1a0a" strokeWidth="1" />
      <path d="M63 33 Q67 31 72 33" fill="none" stroke="#2a1a0a" strokeWidth="1" />
      {/* Gentle smile */}
      {mouth > 0 ? (
        <path d={`M53 48 Q60 ${50 + mouth * 0.4} 67 48`} fill="#c07060" />
      ) : (
        <path d="M54 48 Q60 51 66 48" fill="none" stroke="#c07060" strokeWidth=".8" />
      )}
      {/* Namaste sparkle when idle */}
      {mood === 'idle' && <text x="38" y="14" fontSize="6" opacity=".4">🙏</text>}
    </g>
  );
}

// ═══════════════════════════════════════
// ANTE — MMA, shaved, bandaged hands, scar
// ═══════════════════════════════════════
function AnteSVG({ br, eyeH, mouth, mood, g }: SvgProps) {
  const punch = mood === 'excited' ? g * 8 : mood === 'talking' ? g * 3 : 0;
  return (
    <g transform={`translate(0,${br})`}>
      <rect x="40" y="118" width="13" height="30" rx="5" fill="#1a1a1a" />
      <rect x="67" y="118" width="13" height="30" rx="5" fill="#1a1a1a" />
      <ellipse cx="46" cy="150" rx="7" ry="2.5" fill="#222" />
      <ellipse cx="74" cy="150" rx="7" ry="2.5" fill="#222" />
      {/* Body — rashguard dark red */}
      <path d="M33 72 L28 120 Q30 126 38 126 L82 126 Q90 126 92 120 L87 72 Q80 66 60 66 Q40 66 33 72 Z" fill="#8b3020" />
      {/* Arms — guard position */}
      <path d={`M30 76 Q24 80 ${22 - punch} ${86 - Math.abs(punch)} Q${20 - punch} 94 ${24 - punch} 98`} fill="none" stroke="#c4907a" strokeWidth="11" strokeLinecap="round" />
      <path d={`M90 76 Q96 80 ${98 + punch} ${82 + Math.abs(punch)} Q${100 + punch} 88 ${96 + punch} 92`} fill="none" stroke="#c4907a" strokeWidth="11" strokeLinecap="round" />
      {/* Bandaged hands */}
      <circle cx={24 - punch} cy="100" r="5.5" fill="#eee" stroke="#ddd" strokeWidth=".5" />
      <circle cx={96 + punch} cy="94" r="5.5" fill="#eee" stroke="#ddd" strokeWidth=".5" />
      <path d={`M${21 - punch} 98 L${27 - punch} 102`} stroke="#ccc" strokeWidth=".6" />
      <path d={`M${93 + punch} 92 L${99 + punch} 96`} stroke="#ccc" strokeWidth=".6" />
      {/* Neck */}
      <rect x="48" y="54" width="24" height="14" rx="6" fill="#c4907a" />
      {/* Head — shaved */}
      <ellipse cx="60" cy="36" rx="17" ry="19" fill="#c4907a" />
      <path d="M43 28 Q45 16 60 14 Q75 16 77 28" fill="#c4907a" />
      {/* Cauliflower ear right */}
      <ellipse cx="77" cy="38" rx="4" ry="5" fill="#b07860" />
      <ellipse cx="77" cy="38" rx="2.5" ry="3.5" fill="#c08868" />
      <ellipse cx="43" cy="38" rx="3" ry="4.5" fill="#b8846e" />
      {/* Scar over left eyebrow */}
      <line x1="48" y1="29" x2="56" y2="32" stroke="#e8b8a0" strokeWidth="1.5" opacity=".7" />
      {/* Eyes — intense */}
      <ellipse cx="52" cy="36" rx="3" ry={eyeH} fill="white" />
      <ellipse cx="68" cy="36" rx="3" ry={eyeH} fill="white" />
      {eyeH > 1 && <>
        <circle cx="52" cy="36" r="2" fill="#1a0a00" />
        <circle cx="68" cy="36" r="2" fill="#1a0a00" />
      </>}
      {/* V-brows — intense */}
      <path d="M46 30 L55 32" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
      <path d="M74 30 L65 32" stroke="#6b4a2a" strokeWidth="2" strokeLinecap="round" />
      {/* Tight mouth */}
      {mouth > 0 ? (
        <path d={`M54 48 Q60 ${48 + mouth * 0.3} 66 48`} fill="#8b4030" />
      ) : (
        <line x1="54" y1="48" x2="66" y2="48" stroke="#8b4030" strokeWidth="1" />
      )}
    </g>
  );
}

// ═══════════════════════════════════════
// MAJA — Ponytail, scrunchie, warm smile, green
// ═══════════════════════════════════════
function MajaSVG({ br, eyeH, mouth, mood, g }: SvgProps) {
  const hipHand = mood === 'idle' || mood === 'talking';
  return (
    <g transform={`translate(0,${br})`}>
      <rect x="44" y="118" width="11" height="28" rx="4" fill="#c4907a" />
      <rect x="65" y="118" width="11" height="28" rx="4" fill="#c4907a" />
      <ellipse cx="49" cy="148" rx="7" ry="2.5" fill="#555" />
      <ellipse cx="71" cy="148" rx="7" ry="2.5" fill="#555" />
      {/* Body — green tshirt */}
      <path d="M36 72 L32 118 Q34 124 40 124 L80 124 Q86 124 88 118 L84 72 Q76 66 60 66 Q44 66 36 72 Z" fill="#6b8e23" />
      {/* Arms */}
      <path d={`M34 76 Q28 82 ${hipHand ? 32 : 26} ${hipHand ? 104 : 100} Q${hipHand ? 34 : 24} 110 ${hipHand ? 36 : 28} 114`} fill="none" stroke="#e8c4b0" strokeWidth="9" strokeLinecap="round" />
      <path d="M86 76 Q92 82 94 100 Q96 110 92 114" fill="none" stroke="#e8c4b0" strokeWidth="9" strokeLinecap="round" />
      {/* Hands */}
      <circle cx={hipHand ? 36 : 28} cy="116" r="4" fill="#e8c4b0" />
      <circle cx="92" cy="116" r="4" fill="#e8c4b0" />
      {/* Hair ties on wrist */}
      <circle cx="92" cy="110" r="2.5" fill="#ff69b4" opacity=".7" />
      {/* Neck */}
      <rect x="52" y="55" width="16" height="13" rx="4" fill="#e8c4b0" />
      {/* Head */}
      <ellipse cx="60" cy="38" rx="16" ry="18" fill="#e8c4b0" />
      {/* Hair — ponytail with pink scrunchie */}
      <path d="M44 30 Q46 20 60 18 Q74 20 76 30 Q74 26 66 22 Q56 22 48 26 Q44 28 44 30" fill="#6b3a2a" />
      <path d="M74 26 Q80 30 82 38 Q84 46 80 54" fill="none" stroke="#6b3a2a" strokeWidth="5" strokeLinecap="round" />
      <circle cx="76" cy="28" r="3" fill="#ff69b4" />
      {/* Blush */}
      <ellipse cx="46" cy="44" rx="4" ry="2" fill="#ff9999" opacity=".3" />
      <ellipse cx="74" cy="44" rx="4" ry="2" fill="#ff9999" opacity=".3" />
      {/* Eyes — warm */}
      <ellipse cx="53" cy="38" rx="3" ry={eyeH} fill="white" />
      <ellipse cx="67" cy="38" rx="3" ry={eyeH} fill="white" />
      {eyeH > 1 && <>
        <circle cx="53" cy="38" r="1.5" fill="#3a2010" />
        <circle cx="67" cy="38" r="1.5" fill="#3a2010" />
        <circle cx="52.5" cy="37.3" r=".5" fill="white" />
        <circle cx="66.5" cy="37.3" r=".5" fill="white" />
      </>}
      {/* Happy brows */}
      <path d="M48 33 Q53 31 56 33" fill="none" stroke="#6b3a2a" strokeWidth="1" />
      <path d="M64 33 Q67 31 72 33" fill="none" stroke="#6b3a2a" strokeWidth="1" />
      {/* Big warm smile */}
      {mouth > 0 ? (
        <path d={`M50 48 Q60 ${54 + mouth * 0.5} 70 48`} fill="#c06050" stroke="#a05040" strokeWidth=".3" />
      ) : (
        <path d="M50 48 Q60 54 70 48" fill="none" stroke="#c06050" strokeWidth="1" />
      )}
    </g>
  );
}

// ═══════════════════════════════════════
// DINO — Surfer hair, tan, shorts, sandals, squinting
// ═══════════════════════════════════════
function DinoSVG({ br, eyeH, mouth, mood, g, g2 = 0 }: SvgProps) {
  return (
    <g transform={`translate(0,${br})`}>
      {/* Legs — shorts, tan */}
      <rect x="42" y="112" width="12" height="20" rx="4" fill="#c4907a" />
      <rect x="66" y="112" width="12" height="20" rx="4" fill="#c4907a" />
      {/* Shorts */}
      <path d="M38 108 L36 118 Q40 120 48 120 L52 118 L60 120 L68 118 L72 120 Q80 120 84 118 L82 108 Q74 104 60 104 Q46 104 38 108 Z" fill="#3a5a3a" />
      {/* Sandals */}
      <ellipse cx="48" cy="134" rx="8" ry="2.5" fill="#a07040" />
      <line x1="48" y1="132" x2="48" y2="130" stroke="#806030" strokeWidth="1" />
      <ellipse cx="72" cy="134" rx="8" ry="2.5" fill="#a07040" />
      <line x1="72" y1="132" x2="72" y2="130" stroke="#806030" strokeWidth="1" />
      {/* Body — green tshirt, tan */}
      <path d="M36 72 L34 108 Q36 112 42 112 L78 112 Q84 112 86 108 L84 72 Q76 66 60 66 Q44 66 36 72 Z" fill="#2d6b4e" />
      {/* Arms — relaxed */}
      <path d={`M34 76 Q${26 + g2 * 3} 84 ${24 + g2 * 4} 98 Q${22 + g2 * 4} 106 ${26 + g2 * 3} 110`} fill="none" stroke="#c4907a" strokeWidth="9" strokeLinecap="round" />
      <path d={`M86 76 Q${94 - g2 * 3} 84 ${96 - g2 * 4} 98 Q${98 - g2 * 4} 106 ${94 - g2 * 3} 110`} fill="none" stroke="#c4907a" strokeWidth="9" strokeLinecap="round" />
      <circle cx={26 + g2 * 3} cy="112" r="4" fill="#c4907a" />
      <circle cx={94 - g2 * 3} cy="112" r="4" fill="#c4907a" />
      {/* Neck */}
      <rect x="50" y="55" width="20" height="13" rx="5" fill="#c4907a" />
      {/* Head — tan */}
      <ellipse cx="60" cy="38" rx="16" ry="18" fill="#c4907a" />
      {/* Messy surfer hair with highlights */}
      <path d="M44 28 Q42 18 52 14 Q60 12 68 14 Q78 18 76 28" fill="#6b4a2a" />
      <path d="M44 28 Q40 24 42 32" fill="none" stroke="#6b4a2a" strokeWidth="4" strokeLinecap="round" />
      <path d="M76 28 Q80 24 78 32" fill="none" stroke="#6b4a2a" strokeWidth="4" strokeLinecap="round" />
      <path d="M50 16 Q56 12 62 16" fill="none" stroke="#8b6a3a" strokeWidth="2" />
      <path d="M56 14 Q62 10 68 14" fill="none" stroke="#9b7a4a" strokeWidth="1.5" />
      {/* Scruff/light beard */}
      <path d="M48 46 Q54 52 60 52 Q66 52 72 46" fill="#6b4a2a" opacity=".12" />
      {/* Eyes — squinting from sun, wrinkles */}
      <ellipse cx="53" cy="38" rx="2.5" ry={eyeH * 0.5} fill="white" />
      <ellipse cx="67" cy="38" rx="2.5" ry={eyeH * 0.5} fill="white" />
      {eyeH > 1 && <>
        <circle cx="53" cy="38" r="1.2" fill="#3a2010" />
        <circle cx="67" cy="38" r="1.2" fill="#3a2010" />
      </>}
      {/* Sun wrinkles */}
      <path d="M46 36 Q48 35 46 34" fill="none" stroke="#b07858" strokeWidth=".5" opacity=".4" />
      <path d="M74 36 Q72 35 74 34" fill="none" stroke="#b07858" strokeWidth=".5" opacity=".4" />
      {/* Relaxed brows */}
      <path d="M48 33 Q53 32 56 33" fill="none" stroke="#6b4a2a" strokeWidth="1" />
      <path d="M64 33 Q67 32 72 33" fill="none" stroke="#6b4a2a" strokeWidth="1" />
      {/* Big wide smile */}
      {mouth > 0 ? (
        <path d={`M48 48 Q60 ${56 + mouth * 0.5} 72 48`} fill="#c06050" stroke="#a05040" strokeWidth=".3" />
      ) : (
        <path d="M48 48 Q60 56 72 48" fill="#c06050" stroke="#a05040" strokeWidth=".3" />
      )}
      {/* Teeth showing in smile */}
      <path d="M52 49 L68 49" stroke="white" strokeWidth="1.5" />
    </g>
  );
}

// ═══════════════════════════════════════
// LANA — Dancing, flowing hair, colorful, music notes
// ═══════════════════════════════════════
function LanaSVG({ br, eyeH, mouth, mood, g, g2 = 0 }: SvgProps) {
  const dance = mood === 'excited' || mood === 'talking' ? g * 6 : g * 2;
  const danceSway = Math.sin((g2 || 0) * 2) * 3;
  return (
    <g transform={`translate(${danceSway},${br})`}>
      {/* Legs — pink leggings */}
      <rect x="44" y="116" width="10" height="28" rx="4" fill="#d4628a" />
      <rect x="66" y="116" width="10" height="28" rx="4" fill="#d4628a" />
      <ellipse cx="49" cy="146" rx="6" ry="2" fill="#c05078" />
      <ellipse cx="71" cy="146" rx="6" ry="2" fill="#c05078" />
      {/* Body — dark pink crop top */}
      <path d="M38 72 L36 116 Q38 120 44 120 L76 120 Q82 120 84 116 L82 72 Q74 66 60 66 Q46 66 38 72 Z" fill="#8b2252" />
      {/* Arms — dancing! */}
      <path d={`M36 76 Q${24 - dance} ${72 - Math.abs(dance)} ${20 - dance} ${64 - Math.abs(dance) * 1.5}`} fill="none" stroke="#e8c4b0" strokeWidth="8" strokeLinecap="round" />
      <path d={`M84 76 Q${96 + dance} ${72 - Math.abs(dance)} ${100 + dance} ${64 - Math.abs(dance) * 1.5}`} fill="none" stroke="#e8c4b0" strokeWidth="8" strokeLinecap="round" />
      <circle cx={20 - dance} cy={62 - Math.abs(dance) * 1.5} r="3.5" fill="#e8c4b0" />
      <circle cx={100 + dance} cy={62 - Math.abs(dance) * 1.5} r="3.5" fill="#e8c4b0" />
      {/* Neck */}
      <rect x="52" y="56" width="16" height="12" rx="4" fill="#e8c4b0" />
      {/* Head */}
      <ellipse cx="60" cy="38" rx="15" ry="18" fill="#e8c4b0" />
      {/* Flowing dark hair */}
      <path d="M45 28 Q44 16 60 14 Q76 16 75 28" fill="#1a1008" />
      <path d={`M45 28 Q${40 - dance * 0.5} 36 ${38 - dance * 0.7} 50 Q${36 - dance * 0.8} 58 ${40 - dance * 0.5} 64`} fill="none" stroke="#1a1008" strokeWidth="6" strokeLinecap="round" />
      <path d={`M75 28 Q${80 + dance * 0.5} 36 ${82 + dance * 0.7} 50 Q${84 + dance * 0.8} 58 ${80 + dance * 0.5} 64`} fill="none" stroke="#1a1008" strokeWidth="6" strokeLinecap="round" />
      {/* Big expressive eyes */}
      <ellipse cx="53" cy="38" rx="3.5" ry={eyeH * 1.1} fill="white" />
      <ellipse cx="67" cy="38" rx="3.5" ry={eyeH * 1.1} fill="white" />
      {eyeH > 1 && <>
        <circle cx="53" cy="38" r="2" fill="#1a1008" />
        <circle cx="67" cy="38" r="2" fill="#1a1008" />
        <circle cx="52.3" cy="37" r=".7" fill="white" />
        <circle cx="66.3" cy="37" r=".7" fill="white" />
      </>}
      {/* Happy brows */}
      <path d="M48 32 Q53 30 56 32" fill="none" stroke="#1a1008" strokeWidth="1" />
      <path d="M64 32 Q67 30 72 32" fill="none" stroke="#1a1008" strokeWidth="1" />
      {/* Big smile */}
      {mouth > 0 ? (
        <path d={`M50 48 Q60 ${55 + mouth * 0.6} 70 48`} fill="#d06050" stroke="#a05040" strokeWidth=".3" />
      ) : (
        <path d="M50 48 Q60 54 70 48" fill="#d06050" stroke="#a05040" strokeWidth=".3" />
      )}
      {/* Music notes floating */}
      <text x={16 - dance} y={56 - Math.abs(dance)} fontSize="7" opacity=".6" fill="#ff4d8d">♪</text>
      <text x={96 + dance} y={58 - Math.abs(dance)} fontSize="5" opacity=".4" fill="#ff4d8d">♫</text>
      {mood === 'excited' && <text x="58" y="10" fontSize="6" opacity=".5" fill="#ff4d8d">🎵</text>}
    </g>
  );
}

