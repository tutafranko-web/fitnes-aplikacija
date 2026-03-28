'use client';

import { useState, useRef, useCallback } from 'react';
import { useT } from '@/hooks/useLocale';

interface Props {
  soreness: Record<string, number>;
  onMuscleClick: (group: string) => void;
  selected: string | null;
  zoom: number;
  isFront: boolean;
}

interface TooltipInfo {
  name: string;
  sub: string;
  x: number;
  y: number;
}

// Map detailed muscle IDs → app muscle groups
const GROUP_MAP: Record<string, string> = {
  neck: 'neck', deltoid: 'shoulders', pectoralis: 'chest', serratus: 'core',
  biceps: 'biceps', forearm: 'forearms', abs: 'core', obliques: 'core',
  hip_flexors: 'quads', quadriceps: 'quads', adductors: 'quads', tibialis: 'calves',
  trapezius: 'traps', rhomboids: 'back', latissimus: 'back', rotator_cuff: 'shoulders',
  triceps: 'triceps', erector_spinae: 'back', glutes: 'glutes',
  hamstrings: 'hamstrings', calves: 'calves',
};

const MUSCLE_NAMES: Record<string, string> = {
  neck: 'Vrat', deltoid: 'Ramena', pectoralis: 'Prsa', serratus: 'Serratus',
  biceps: 'Biceps', forearm: 'Podlaktica', abs: 'Trbušni', obliques: 'Kosi trbušni',
  hip_flexors: 'Fleksori kuka', quadriceps: 'Quadriceps', adductors: 'Aduktori',
  tibialis: 'Tibialis', trapezius: 'Trapez', rhomboids: 'Romboidni',
  latissimus: 'Široki leđni', rotator_cuff: 'Rot. manšeta', triceps: 'Triceps',
  erector_spinae: 'Paraspinalni', glutes: 'Stražnjica', hamstrings: 'Hamstringsi',
  calves: 'Listovi',
};

// Inflammation filter styles (hue-rotate trick works on any base color)
const INF_STYLES: Record<number, React.CSSProperties> = {
  0: {},
  1: { filter: 'saturate(.5) hue-rotate(85deg)' },
  2: { filter: 'saturate(.7) hue-rotate(35deg)' },
  3: { filter: 'saturate(1.1) hue-rotate(-8deg) brightness(1.1)' },
  4: { filter: 'saturate(1.4) hue-rotate(-20deg) brightness(1.15)' },
};

export default function HyperBody({ soreness, onMuscleClick, selected, zoom, isFront }: Props) {
  const [tooltip, setTooltip] = useState<TooltipInfo | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const t = useT();

  const getGroup = (muscleId: string) => GROUP_MAP[muscleId] || muscleId;
  const getLevel = (muscleId: string) => soreness[getGroup(muscleId)] || 0;

  const handleEnter = useCallback((e: React.MouseEvent<SVGElement>) => {
    const el = e.currentTarget;
    const m = el.dataset.m || '';
    const h = el.dataset.h || '';
    const sub = h.split('|')[1] || '';
    const name = MUSCLE_NAMES[m] || m;
    if (!wrapRef.current) return;
    const wr = wrapRef.current.getBoundingClientRect();
    const r = el.getBoundingClientRect();
    setTooltip({
      name,
      sub,
      x: r.left - wr.left + r.width / 2,
      y: r.top - wr.top - 10,
    });
  }, []);

  const handleLeave = useCallback(() => setTooltip(null), []);

  const handleClick = useCallback((e: React.MouseEvent<SVGElement>) => {
    const m = e.currentTarget.dataset.m || '';
    onMuscleClick(getGroup(m));
  }, [onMuscleClick]);

  // Build className + style for each muscle path
  const mp = (muscleId: string, extraClass?: string) => {
    const group = getGroup(muscleId);
    const lv = soreness[group] || 0;
    const isSel = selected === group;
    let cls = 'mh';
    if (lv > 0) cls += ` i${lv}`;
    if (isSel) cls += ' sel';
    if (extraClass) cls += ` ${extraClass}`;
    return cls;
  };

  return (
    <div ref={wrapRef} className="relative transition-transform duration-300"
      style={{ transform: `scale(${zoom})`, transformOrigin: 'center top' }}>

      {/* Tooltip */}
      {tooltip && (
        <div className="absolute z-20 flex flex-col items-center pointer-events-none"
          style={{ left: tooltip.x, top: tooltip.y, transform: 'translate(-50%, -100%)' }}>
          <div className="px-3 py-1 rounded-md text-[11px] font-bold whitespace-nowrap"
            style={{ background: 'rgba(10,255,190,.1)', border: '1px solid rgba(10,255,190,.3)', color: '#0affc0', backdropFilter: 'blur(5px)' }}>
            {tooltip.name}
          </div>
          {tooltip.sub && (
            <div className="px-2 py-0.5 rounded text-[9px] font-semibold mt-0.5 whitespace-nowrap"
              style={{ background: 'rgba(255,255,255,.05)', border: '1px solid rgba(255,255,255,.1)', color: '#aaa' }}>
              {tooltip.sub}
            </div>
          )}
        </div>
      )}

      <style>{`
        .mh{cursor:pointer;transition:filter .12s,stroke-width .1s,stroke .1s;stroke:transparent;stroke-width:0}
        .mh:hover{filter:brightness(1.22)!important;stroke:rgba(255,255,255,.45);stroke-width:1.3}
        .mh.sel{filter:brightness(1.15);stroke:rgba(255,255,255,.55);stroke-width:1.5}
        .mh.i1{filter:saturate(.5) hue-rotate(85deg)!important}
        .mh.i2{filter:saturate(.7) hue-rotate(35deg)!important}
        .mh.i3{filter:saturate(1.1) hue-rotate(-8deg) brightness(1.1)!important}
        .mh.i4{filter:saturate(1.4) hue-rotate(-20deg) brightness(1.15)!important}
        .mh.sel:hover{filter:brightness(1.3)!important;stroke:rgba(255,255,255,.7);stroke-width:2}
      `}</style>

      {isFront ? (
        /* ════════════ FRONT VIEW ════════════ */
        <svg ref={svgRef} viewBox="0 0 440 700" className="w-full" style={{ maxHeight: 560 }}>
          <defs>
            <radialGradient id="sk" cx="50%" cy="40%"><stop offset="0%" stopColor="#ecd0b0"/><stop offset="70%" stopColor="#d4aa82"/><stop offset="100%" stopColor="#c09470"/></radialGradient>
            <radialGradient id="skD" cx="50%" cy="50%"><stop offset="0%" stopColor="#dfc0a0"/><stop offset="100%" stopColor="#c09470"/></radialGradient>
            <radialGradient id="rm" cx="45%" cy="35%"><stop offset="0%" stopColor="#e89888"/><stop offset="55%" stopColor="#d07868"/><stop offset="100%" stopColor="#a85448"/></radialGradient>
            <radialGradient id="rmR" cx="55%" cy="35%"><stop offset="0%" stopColor="#e89888"/><stop offset="55%" stopColor="#d07868"/><stop offset="100%" stopColor="#a85448"/></radialGradient>
            <radialGradient id="rm2" cx="50%" cy="30%"><stop offset="0%" stopColor="#e89080"/><stop offset="50%" stopColor="#cc7060"/><stop offset="100%" stopColor="#a04840"/></radialGradient>
            <radialGradient id="rDelt" cx="40%" cy="30%"><stop offset="0%" stopColor="#f8d888"/><stop offset="50%" stopColor="#e4bc60"/><stop offset="100%" stopColor="#c49838"/></radialGradient>
            <radialGradient id="rDeltR" cx="60%" cy="30%"><stop offset="0%" stopColor="#f8d888"/><stop offset="50%" stopColor="#e4bc60"/><stop offset="100%" stopColor="#c49838"/></radialGradient>
            <radialGradient id="rPecU" cx="40%" cy="35%"><stop offset="0%" stopColor="#e89088"/><stop offset="50%" stopColor="#d47468"/><stop offset="100%" stopColor="#b45848"/></radialGradient>
            <radialGradient id="rPecUR" cx="60%" cy="35%"><stop offset="0%" stopColor="#e89088"/><stop offset="50%" stopColor="#d47468"/><stop offset="100%" stopColor="#b45848"/></radialGradient>
            <radialGradient id="rPecL" cx="45%" cy="40%"><stop offset="0%" stopColor="#e08478"/><stop offset="50%" stopColor="#c86858"/><stop offset="100%" stopColor="#a84840"/></radialGradient>
            <radialGradient id="rPecLR" cx="55%" cy="40%"><stop offset="0%" stopColor="#e08478"/><stop offset="50%" stopColor="#c86858"/><stop offset="100%" stopColor="#a84840"/></radialGradient>
            <radialGradient id="rBic" cx="45%" cy="35%"><stop offset="0%" stopColor="#e89080"/><stop offset="50%" stopColor="#d07060"/><stop offset="100%" stopColor="#a84a40"/></radialGradient>
            <radialGradient id="rAbs" cx="50%" cy="35%"><stop offset="0%" stopColor="#e4b898"/><stop offset="50%" stopColor="#d0a080"/><stop offset="100%" stopColor="#b88868"/></radialGradient>
            <radialGradient id="rObl" cx="35%" cy="35%"><stop offset="0%" stopColor="#da9880"/><stop offset="50%" stopColor="#c48068"/><stop offset="100%" stopColor="#a06850"/></radialGradient>
            <radialGradient id="rOblR" cx="65%" cy="35%"><stop offset="0%" stopColor="#da9880"/><stop offset="50%" stopColor="#c48068"/><stop offset="100%" stopColor="#a06850"/></radialGradient>
            <radialGradient id="rQ" cx="45%" cy="30%"><stop offset="0%" stopColor="#e08878"/><stop offset="50%" stopColor="#cc7060"/><stop offset="100%" stopColor="#a85040"/></radialGradient>
            <radialGradient id="rFA" cx="50%" cy="30%"><stop offset="0%" stopColor="#d8b498"/><stop offset="50%" stopColor="#c09878"/><stop offset="100%" stopColor="#a08060"/></radialGradient>
            <radialGradient id="rSer" cx="40%" cy="40%"><stop offset="0%" stopColor="#d88878"/><stop offset="50%" stopColor="#c07060"/><stop offset="100%" stopColor="#985848"/></radialGradient>
            <radialGradient id="rTib" cx="50%" cy="25%"><stop offset="0%" stopColor="#d4aa90"/><stop offset="50%" stopColor="#c09478"/><stop offset="100%" stopColor="#a07858"/></radialGradient>
            <radialGradient id="rHip" cx="50%" cy="40%"><stop offset="0%" stopColor="#d0a488"/><stop offset="50%" stopColor="#b88c70"/><stop offset="100%" stopColor="#987458"/></radialGradient>
            <radialGradient id="rAdd" cx="50%" cy="35%"><stop offset="0%" stopColor="#d09880"/><stop offset="50%" stopColor="#b88068"/><stop offset="100%" stopColor="#986850"/></radialGradient>
            <filter id="s1"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/><feOffset dy="2" result="o"/><feFlood floodColor="#000" floodOpacity=".3"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="s2"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b"/><feOffset dy="1.5" result="o"/><feFlood floodColor="#000" floodOpacity=".2"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* ── BODY SILHOUETTE / SKIN ── */}
          <ellipse cx="220" cy="56" rx="40" ry="46" fill="url(#sk)"/>
          <ellipse cx="211.5" cy="14" rx="1.5" ry="2.5" fill="#c9a088" transform="translate(0,40)"/>
          <ellipse cx="228.5" cy="14" rx="1.5" ry="2.5" fill="#c9a088" transform="translate(0,40)"/>
          <rect x="204" y="98" width="32" height="22" rx="10" fill="url(#skD)"/>
          <path d="M158 120 Q220 108 282 120 L290 170 Q292 220 288 270 L278 310 Q220 325 162 310 L152 270 Q148 220 150 170Z" fill="url(#skD)" opacity=".55"/>
          <path d="M165 300 Q220 315 275 300 L272 340 Q220 355 168 340Z" fill="url(#skD)" opacity=".4"/>
          <ellipse cx="90" cy="365" rx="14" ry="17" fill="url(#sk)" opacity=".7"/>
          <ellipse cx="350" cy="365" rx="14" ry="17" fill="url(#sk)" opacity=".7"/>
          <ellipse cx="158" cy="638" rx="20" ry="8" fill="url(#skD)" opacity=".4"/>
          <ellipse cx="282" cy="638" rx="20" ry="8" fill="url(#skD)" opacity=".4"/>

          {/* ── DELTOIDS ── */}
          <path d="M160 118 Q150 116 138 126 Q122 118 112 140 Q108 155 114 168 L140 164 Q148 144 155 128Z" fill="url(#rDelt)" filter="url(#s1)" className={mp('deltoid')} data-m="deltoid" data-h="Srednja glava|Lateral deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M155 120 L170 118 L168 148 L152 150 Q148 136 155 120Z" fill="url(#rDelt)" filter="url(#s2)" className={mp('deltoid')} data-m="deltoid" data-h="Prednja glava|Anterior deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M280 118 Q290 116 302 126 Q318 118 328 140 Q332 155 326 168 L300 164 Q292 144 285 128Z" fill="url(#rDeltR)" filter="url(#s1)" className={mp('deltoid')} data-m="deltoid" data-h="Srednja glava|Lateral deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M285 120 L270 118 L272 148 L288 150 Q292 136 285 120Z" fill="url(#rDeltR)" filter="url(#s2)" className={mp('deltoid')} data-m="deltoid" data-h="Prednja glava|Anterior deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── PECTORALIS ── */}
          <path d="M162 122 L210 118 L210 148 Q200 158 182 162 L160 160 Q148 150 148 140 Q148 130 162 122Z" fill="url(#rPecU)" filter="url(#s1)" className={mp('pectoralis')} data-m="pectoralis" data-h="Gornja prsa|Pars clavicularis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M158 162 L182 164 Q200 160 210 150 L210 178 Q196 188 172 186 L152 180 Q146 172 158 162Z" fill="url(#rPecL)" filter="url(#s1)" className={mp('pectoralis')} data-m="pectoralis" data-h="Donja prsa|Pars sternocostalis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M278 122 L230 118 L230 148 Q240 158 258 162 L280 160 Q292 150 292 140 Q292 130 278 122Z" fill="url(#rPecUR)" filter="url(#s1)" className={mp('pectoralis')} data-m="pectoralis" data-h="Gornja prsa|Pars clavicularis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M282 162 L258 164 Q240 160 230 150 L230 178 Q244 188 268 186 L288 180 Q294 172 282 162Z" fill="url(#rPecLR)" filter="url(#s1)" className={mp('pectoralis')} data-m="pectoralis" data-h="Donja prsa|Pars sternocostalis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          {/* Pec highlights */}
          <ellipse cx="180" cy="142" rx="14" ry="8" fill="#f0a898" opacity=".18" className="pointer-events-none"/>
          <ellipse cx="260" cy="142" rx="14" ry="8" fill="#f0a898" opacity=".18" className="pointer-events-none"/>
          <line x1="172" y1="126" x2="155" y2="156" stroke="#884040" strokeWidth=".6" opacity=".2" className="pointer-events-none"/>
          <line x1="188" y1="124" x2="165" y2="160" stroke="#884040" strokeWidth=".6" opacity=".18" className="pointer-events-none"/>
          <line x1="268" y1="126" x2="285" y2="156" stroke="#884040" strokeWidth=".6" opacity=".2" className="pointer-events-none"/>

          {/* ── SERRATUS ── */}
          <path d="M142 168 L158 164 L156 210 L140 206Z" fill="url(#rSer)" className={mp('serratus')} data-m="serratus" data-h="Serratus anterior|Serratus anterior" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M298 168 L282 164 L284 210 L300 206Z" fill="url(#rSer)" className={mp('serratus')} data-m="serratus" data-h="Serratus anterior|Serratus anterior" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="142" y1="178" x2="158" y2="175" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>
          <line x1="142" y1="188" x2="158" y2="185" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>
          <line x1="142" y1="198" x2="158" y2="195" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>
          <line x1="298" y1="178" x2="282" y2="175" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>
          <line x1="298" y1="188" x2="282" y2="185" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>
          <line x1="298" y1="198" x2="282" y2="195" stroke="#784030" strokeWidth=".7" opacity=".3" className="pointer-events-none"/>

          {/* ── BICEPS ── */}
          <path d="M114 170 Q110 190 110 214 Q112 232 116 240 L128 240 Q130 225 130 210 Q130 190 128 170Z" fill="url(#rBic)" filter="url(#s1)" className={mp('biceps')} data-m="biceps" data-h="Duga glava|Caput longum" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M130 170 Q134 185 136 210 Q136 228 134 240 L144 240 Q147 222 146 205 Q145 185 142 170Z" fill="url(#rBic)" filter="url(#s2)" className={mp('biceps')} data-m="biceps" data-h="Kratka glava|Caput breve" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M112 242 Q110 252 110 260 L144 260 Q146 252 146 242Z" fill="url(#rm2)" className={mp('biceps')} data-m="biceps" data-h="Brahijalis|Brachialis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="128" cy="206" rx="8" ry="16" fill="#f0a090" opacity=".2" className="pointer-events-none"/>
          <path d="M326 170 Q330 190 330 214 Q328 232 324 240 L312 240 Q310 225 310 210 Q310 190 312 170Z" fill="url(#rBic)" filter="url(#s1)" className={mp('biceps')} data-m="biceps" data-h="Duga glava|Caput longum" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M310 170 Q306 185 304 210 Q304 228 306 240 L296 240 Q293 222 294 205 Q295 185 298 170Z" fill="url(#rBic)" filter="url(#s2)" className={mp('biceps')} data-m="biceps" data-h="Kratka glava|Caput breve" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M328 242 Q330 252 330 260 L296 260 Q294 252 294 242Z" fill="url(#rm2)" className={mp('biceps')} data-m="biceps" data-h="Brahijalis|Brachialis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="312" cy="206" rx="8" ry="16" fill="#f0a090" opacity=".2" className="pointer-events-none"/>

          {/* ── FOREARMS ── */}
          <path d="M110 264 Q104 298 98 338 Q96 352 94 362 L116 365 Q120 332 126 298 Q128 280 130 264Z" fill="url(#rFA)" filter="url(#s2)" className={mp('forearm')} data-m="forearm" data-h="Fleksori|Flexor carpi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M330 264 Q336 298 342 338 Q344 352 346 362 L324 365 Q320 332 314 298 Q312 280 310 264Z" fill="url(#rFA)" filter="url(#s2)" className={mp('forearm')} data-m="forearm" data-h="Fleksori|Flexor carpi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── ABS ── */}
          <rect x="210" y="186" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Gornji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="210" y="209" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Srednji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="210" y="232" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Donji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="210" y="255" width="20" height="17" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Najdonji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="188" y="186" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Gornji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="188" y="209" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Srednji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="188" y="232" width="20" height="19" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Donji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <rect x="188" y="255" width="20" height="17" rx="5" fill="url(#rAbs)" className={mp('abs')} data-m="abs" data-h="Najdonji abs|Rectus abdominis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="220" y1="184" x2="220" y2="275" stroke="#805838" strokeWidth="1.2" opacity=".3" className="pointer-events-none"/>

          {/* ── OBLIQUES ── */}
          <path d="M160 185 L186 187 L186 272 L155 264 Q148 226 160 185Z" fill="url(#rObl)" filter="url(#s2)" className={mp('obliques')} data-m="obliques" data-h="Vanjski kosi|Obliquus externus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M280 185 L254 187 L254 272 L285 264 Q292 226 280 185Z" fill="url(#rOblR)" filter="url(#s2)" className={mp('obliques')} data-m="obliques" data-h="Vanjski kosi|Obliquus externus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="164" y1="200" x2="184" y2="215" stroke="#704030" strokeWidth=".5" opacity=".2" className="pointer-events-none"/>
          <line x1="162" y1="218" x2="184" y2="235" stroke="#704030" strokeWidth=".5" opacity=".2" className="pointer-events-none"/>
          <line x1="160" y1="238" x2="184" y2="255" stroke="#704030" strokeWidth=".5" opacity=".2" className="pointer-events-none"/>

          {/* ── HIP FLEXORS ── */}
          <path d="M162 275 L190 272 L188 300 L158 296Z" fill="url(#rHip)" className={mp('hip_flexors')} data-m="hip_flexors" data-h="Iliopsoas|Psoas + Iliacus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M278 275 L250 272 L252 300 L282 296Z" fill="url(#rHip)" className={mp('hip_flexors')} data-m="hip_flexors" data-h="Iliopsoas|Psoas + Iliacus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── QUADRICEPS ── */}
          <path d="M158 310 Q152 355 148 405 Q146 430 145 455 L168 455 Q170 425 172 395 Q174 350 175 310Z" fill="url(#rQ)" filter="url(#s1)" className={mp('quadriceps')} data-m="quadriceps" data-h="Vastus lateralis|M. vastus lateralis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M177 308 Q175 350 173 400 Q172 425 170 455 L190 455 Q192 425 193 400 Q194 350 195 308Z" fill="url(#rQ)" filter="url(#s1)" className={mp('quadriceps')} data-m="quadriceps" data-h="Rectus femoris|M. rectus femoris" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M195 310 Q196 360 196 410 L196 455 L192 455 Q193 425 193 400 Q194 355 195 310Z" fill="url(#rQ)" className={mp('quadriceps')} data-m="quadriceps" data-h="VMO|M. vastus medialis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="190" cy="440" rx="7" ry="13" fill="#c86858" opacity=".25" className="pointer-events-none"/>
          <path d="M175 312 Q173 360 171 420" stroke="#703828" strokeWidth=".8" fill="none" opacity=".22" className="pointer-events-none"/>
          <path d="M194 312 Q194 360 195 420" stroke="#703828" strokeWidth=".7" fill="none" opacity=".2" className="pointer-events-none"/>
          <ellipse cx="170" cy="370" rx="8" ry="28" fill="#e89080" opacity=".12" className="pointer-events-none"/>

          <path d="M282 310 Q288 355 292 405 Q294 430 295 455 L272 455 Q270 425 268 395 Q266 350 265 310Z" fill="url(#rQ)" filter="url(#s1)" className={mp('quadriceps')} data-m="quadriceps" data-h="Vastus lateralis|M. vastus lateralis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M263 308 Q265 350 267 400 Q268 425 270 455 L250 455 Q248 425 247 400 Q246 350 245 308Z" fill="url(#rQ)" filter="url(#s1)" className={mp('quadriceps')} data-m="quadriceps" data-h="Rectus femoris|M. rectus femoris" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M245 310 Q244 360 244 410 L244 455 L248 455 Q247 425 247 400 Q246 355 245 310Z" fill="url(#rQ)" className={mp('quadriceps')} data-m="quadriceps" data-h="VMO|M. vastus medialis" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="250" cy="440" rx="7" ry="13" fill="#c86858" opacity=".25" className="pointer-events-none"/>
          <path d="M265 312 Q267 360 269 420" stroke="#703828" strokeWidth=".8" fill="none" opacity=".22" className="pointer-events-none"/>
          <path d="M246 312 Q246 360 245 420" stroke="#703828" strokeWidth=".7" fill="none" opacity=".2" className="pointer-events-none"/>
          <ellipse cx="270" cy="370" rx="8" ry="28" fill="#e89080" opacity=".12" className="pointer-events-none"/>

          {/* ── ADDUCTORS ── */}
          <path d="M196 306 L212 304 L208 405 L194 403Z" fill="url(#rAdd)" className={mp('adductors')} data-m="adductors" data-h="Adductor longus|M. adductor longus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M244 306 L228 304 L232 405 L246 403Z" fill="url(#rAdd)" className={mp('adductors')} data-m="adductors" data-h="Adductor longus|M. adductor longus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── TIBIALIS ── */}
          <path d="M146 465 Q144 505 143 560 Q142 590 142 615 L170 615 Q172 590 173 560 Q174 510 176 465Z" fill="url(#rTib)" className={mp('tibialis')} data-m="tibialis" data-h="Tibialis anterior|M. tibialis anterior" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M294 465 Q296 505 297 560 Q298 590 298 615 L270 615 Q268 590 267 560 Q266 510 264 465Z" fill="url(#rTib)" className={mp('tibialis')} data-m="tibialis" data-h="Tibialis anterior|M. tibialis anterior" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── NECK ── */}
          <path d="M204 98 L212 96 L212 120 L204 122 Q200 110 204 98Z" fill="url(#rm)" opacity=".5" className={mp('neck')} data-m="neck" data-h="SCM|Sternocleidomastoideus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M236 98 L228 96 L228 120 L236 122 Q240 110 236 98Z" fill="url(#rmR)" opacity=".5" className={mp('neck')} data-m="neck" data-h="SCM|Sternocleidomastoideus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
        </svg>
      ) : (
        /* ════════════ BACK VIEW ════════════ */
        <svg ref={svgRef} viewBox="0 0 440 700" className="w-full" style={{ maxHeight: 560 }}>
          <defs>
            <radialGradient id="bsk" cx="50%" cy="40%"><stop offset="0%" stopColor="#ecd0b0"/><stop offset="70%" stopColor="#d4aa82"/><stop offset="100%" stopColor="#c09470"/></radialGradient>
            <radialGradient id="bskD" cx="50%" cy="50%"><stop offset="0%" stopColor="#dfc0a0"/><stop offset="100%" stopColor="#c09470"/></radialGradient>
            <radialGradient id="brDelt" cx="40%" cy="30%"><stop offset="0%" stopColor="#f8d888"/><stop offset="50%" stopColor="#e4bc60"/><stop offset="100%" stopColor="#c49838"/></radialGradient>
            <radialGradient id="brDeltR" cx="60%" cy="30%"><stop offset="0%" stopColor="#f8d888"/><stop offset="50%" stopColor="#e4bc60"/><stop offset="100%" stopColor="#c49838"/></radialGradient>
            <radialGradient id="brFA" cx="50%" cy="30%"><stop offset="0%" stopColor="#d8b498"/><stop offset="50%" stopColor="#c09878"/><stop offset="100%" stopColor="#a08060"/></radialGradient>
            <radialGradient id="brTrU" cx="50%" cy="30%"><stop offset="0%" stopColor="#e08878"/><stop offset="50%" stopColor="#cc6e60"/><stop offset="100%" stopColor="#a85040"/></radialGradient>
            <radialGradient id="brTrM" cx="50%" cy="35%"><stop offset="0%" stopColor="#d88070"/><stop offset="50%" stopColor="#c06858"/><stop offset="100%" stopColor="#984838"/></radialGradient>
            <radialGradient id="brTrL" cx="50%" cy="40%"><stop offset="0%" stopColor="#d07868"/><stop offset="50%" stopColor="#b86050"/><stop offset="100%" stopColor="#904038"/></radialGradient>
            <radialGradient id="brRh" cx="50%" cy="35%"><stop offset="0%" stopColor="#d88070"/><stop offset="50%" stopColor="#c06858"/><stop offset="100%" stopColor="#984838"/></radialGradient>
            <radialGradient id="brLat" cx="35%" cy="35%"><stop offset="0%" stopColor="#dc8070"/><stop offset="50%" stopColor="#c06050"/><stop offset="100%" stopColor="#984038"/></radialGradient>
            <radialGradient id="brLatR" cx="65%" cy="35%"><stop offset="0%" stopColor="#dc8070"/><stop offset="50%" stopColor="#c06050"/><stop offset="100%" stopColor="#984038"/></radialGradient>
            <radialGradient id="brTri" cx="45%" cy="35%"><stop offset="0%" stopColor="#e08878"/><stop offset="50%" stopColor="#c86858"/><stop offset="100%" stopColor="#a04838"/></radialGradient>
            <radialGradient id="brRC" cx="50%" cy="40%"><stop offset="0%" stopColor="#d47868"/><stop offset="50%" stopColor="#bc6050"/><stop offset="100%" stopColor="#984838"/></radialGradient>
            <radialGradient id="brEr" cx="50%" cy="30%"><stop offset="0%" stopColor="#d09078"/><stop offset="50%" stopColor="#b87860"/><stop offset="100%" stopColor="#986048"/></radialGradient>
            <radialGradient id="brGMax" cx="45%" cy="35%"><stop offset="0%" stopColor="#e08878"/><stop offset="50%" stopColor="#cc6e60"/><stop offset="100%" stopColor="#a84e42"/></radialGradient>
            <radialGradient id="brGMed" cx="50%" cy="30%"><stop offset="0%" stopColor="#d88070"/><stop offset="50%" stopColor="#c46858"/><stop offset="100%" stopColor="#a04840"/></radialGradient>
            <radialGradient id="brHam" cx="45%" cy="30%"><stop offset="0%" stopColor="#dc8070"/><stop offset="50%" stopColor="#c46858"/><stop offset="100%" stopColor="#a04838"/></radialGradient>
            <radialGradient id="brHamI" cx="55%" cy="30%"><stop offset="0%" stopColor="#d47868"/><stop offset="50%" stopColor="#b86050"/><stop offset="100%" stopColor="#984038"/></radialGradient>
            <radialGradient id="brCM" cx="42%" cy="30%"><stop offset="0%" stopColor="#dc8878"/><stop offset="50%" stopColor="#c86e60"/><stop offset="100%" stopColor="#a85248"/></radialGradient>
            <radialGradient id="brCL" cx="55%" cy="30%"><stop offset="0%" stopColor="#d48070"/><stop offset="50%" stopColor="#c06858"/><stop offset="100%" stopColor="#a04a40"/></radialGradient>
            <radialGradient id="brSol" cx="50%" cy="30%"><stop offset="0%" stopColor="#c87868"/><stop offset="50%" stopColor="#b06050"/><stop offset="100%" stopColor="#904840"/></radialGradient>
            <filter id="bs1"><feGaussianBlur in="SourceAlpha" stdDeviation="3" result="b"/><feOffset dy="2" result="o"/><feFlood floodColor="#000" floodOpacity=".3"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
            <filter id="bs2"><feGaussianBlur in="SourceAlpha" stdDeviation="2" result="b"/><feOffset dy="1.5" result="o"/><feFlood floodColor="#000" floodOpacity=".2"/><feComposite in2="o" operator="in"/><feMerge><feMergeNode/><feMergeNode in="SourceGraphic"/></feMerge></filter>
          </defs>

          {/* ── Skin base ── */}
          <ellipse cx="220" cy="56" rx="40" ry="46" fill="url(#bsk)"/>
          <rect x="204" y="98" width="32" height="22" rx="10" fill="url(#bskD)"/>
          <path d="M170 248 Q220 258 270 248 L272 280 Q220 290 168 280Z" fill="url(#bskD)" opacity=".35"/>
          <ellipse cx="92" cy="375" rx="14" ry="17" fill="url(#bsk)" opacity=".65"/>
          <ellipse cx="348" cy="375" rx="14" ry="17" fill="url(#bsk)" opacity=".65"/>

          {/* ── TRAPEZIUS ── */}
          <path d="M184 100 L220 94 L256 100 L270 115 L220 106 L170 115Z" fill="url(#brTrU)" filter="url(#bs1)" className={mp('trapezius')} data-m="trapezius" data-h="Gornja vlakna|Pars descendens" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M170 117 L220 108 L270 117 L285 138 L220 126 L155 138Z" fill="url(#brTrM)" filter="url(#bs1)" className={mp('trapezius')} data-m="trapezius" data-h="Srednja vlakna|Pars transversa" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M185 155 L220 148 L255 155 L240 180 L220 182 L200 180Z" fill="url(#brTrL)" className={mp('trapezius')} data-m="trapezius" data-h="Donja vlakna|Pars ascendens" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── REAR DELTS ── */}
          <path d="M154 122 Q132 120 118 148 Q114 162 120 174 L150 168 Q156 146 155 126Z" fill="url(#brDelt)" filter="url(#bs1)" className={mp('deltoid')} data-m="deltoid" data-h="Stražnja glava|Posterior deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M286 122 Q308 120 322 148 Q326 162 320 174 L290 168 Q284 146 285 126Z" fill="url(#brDeltR)" filter="url(#bs1)" className={mp('deltoid')} data-m="deltoid" data-h="Stražnja glava|Posterior deltoid" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── ROTATOR CUFF ── */}
          <path d="M156 136 L184 132 L186 168 L154 172Z" fill="url(#brRC)" className={mp('rotator_cuff')} data-m="rotator_cuff" data-h="Infraspinatus|M. infraspinatus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M284 136 L256 132 L254 168 L286 172Z" fill="url(#brRC)" className={mp('rotator_cuff')} data-m="rotator_cuff" data-h="Infraspinatus|M. infraspinatus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── RHOMBOIDS ── */}
          <path d="M188 126 L218 120 L218 165 L188 170Z" fill="url(#brRh)" className={mp('rhomboids')} data-m="rhomboids" data-h="Rhomboid major|Rhomboideus major" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M252 126 L222 120 L222 165 L252 170Z" fill="url(#brRh)" className={mp('rhomboids')} data-m="rhomboids" data-h="Rhomboid major|Rhomboideus major" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── LATS ── */}
          <path d="M148 175 L186 170 L190 242 Q178 255 162 258 L146 252 Q138 215 148 175Z" fill="url(#brLat)" filter="url(#bs1)" className={mp('latissimus')} data-m="latissimus" data-h="Široki leđni|Latissimus dorsi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M292 175 L254 170 L250 242 Q262 255 278 258 L294 252 Q302 215 292 175Z" fill="url(#brLatR)" filter="url(#bs1)" className={mp('latissimus')} data-m="latissimus" data-h="Široki leđni|Latissimus dorsi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="154" y1="188" x2="182" y2="218" stroke="#682820" strokeWidth=".6" opacity=".2" className="pointer-events-none"/>
          <line x1="152" y1="208" x2="180" y2="238" stroke="#682820" strokeWidth=".6" opacity=".2" className="pointer-events-none"/>

          {/* ── TRICEPS ── */}
          <path d="M120 176 Q116 198 116 222 Q118 240 122 248 L134 248 Q136 232 136 218 Q136 198 134 176Z" fill="url(#brTri)" filter="url(#bs1)" className={mp('triceps')} data-m="triceps" data-h="Lateralna glava|Caput laterale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M136 176 Q140 192 142 218 Q142 236 140 248 L152 248 Q155 230 154 212 Q153 192 150 176Z" fill="url(#brTri)" filter="url(#bs2)" className={mp('triceps')} data-m="triceps" data-h="Duga glava|Caput longum" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M126 212 Q132 200 138 212 Q132 224 126 212Z" fill="#e09080" opacity=".2" className="pointer-events-none"/>
          <path d="M320 176 Q324 198 324 222 Q322 240 318 248 L306 248 Q304 232 304 218 Q304 198 306 176Z" fill="url(#brTri)" filter="url(#bs1)" className={mp('triceps')} data-m="triceps" data-h="Lateralna glava|Caput laterale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M304 176 Q300 192 298 218 Q298 236 300 248 L288 248 Q285 230 286 212 Q287 192 290 176Z" fill="url(#brTri)" filter="url(#bs2)" className={mp('triceps')} data-m="triceps" data-h="Duga glava|Caput longum" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M314 212 Q308 200 302 212 Q308 224 314 212Z" fill="#e09080" opacity=".2" className="pointer-events-none"/>

          {/* ── FOREARMS BACK ── */}
          <path d="M118 252 Q112 285 106 325 Q104 342 102 355 L124 358 Q128 325 134 290 Q136 272 138 252Z" fill="url(#brFA)" className={mp('forearm')} data-m="forearm" data-h="Ekstenzori|Extensor carpi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M322 252 Q328 285 334 325 Q336 342 338 355 L316 358 Q312 325 306 290 Q304 272 302 252Z" fill="url(#brFA)" className={mp('forearm')} data-m="forearm" data-h="Ekstenzori|Extensor carpi" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>

          {/* ── ERECTOR SPINAE ── */}
          <path d="M200 172 L218 170 L218 278 L198 274 Q196 225 200 172Z" fill="url(#brEr)" className={mp('erector_spinae')} data-m="erector_spinae" data-h="Erector spinae|Iliocostalis + Longissimus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M240 172 L222 170 L222 278 L242 274 Q244 225 240 172Z" fill="url(#brEr)" className={mp('erector_spinae')} data-m="erector_spinae" data-h="Erector spinae|Iliocostalis + Longissimus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="220" y1="170" x2="220" y2="278" stroke="#604030" strokeWidth=".8" opacity=".25" className="pointer-events-none"/>

          {/* ── GLUTES ── */}
          <path d="M162 278 Q172 270 196 266 L198 290 L168 292 Q160 286 162 278Z" fill="url(#brGMed)" filter="url(#bs2)" className={mp('glutes')} data-m="glutes" data-h="Gluteus medius|M. gluteus medius" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M168 294 L218 288 L218 338 L164 340 Q154 318 168 294Z" fill="url(#brGMax)" filter="url(#bs1)" className={mp('glutes')} data-m="glutes" data-h="Gluteus maximus|M. gluteus maximus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M278 278 Q268 270 244 266 L242 290 L272 292 Q280 286 278 278Z" fill="url(#brGMed)" filter="url(#bs2)" className={mp('glutes')} data-m="glutes" data-h="Gluteus medius|M. gluteus medius" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M272 294 L222 288 L222 338 L276 340 Q286 318 272 294Z" fill="url(#brGMax)" filter="url(#bs1)" className={mp('glutes')} data-m="glutes" data-h="Gluteus maximus|M. gluteus maximus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="220" y1="290" x2="220" y2="338" stroke="#6a2828" strokeWidth="1" opacity=".28" className="pointer-events-none"/>
          <ellipse cx="192" cy="315" rx="12" ry="16" fill="#e89080" opacity=".12" className="pointer-events-none"/>
          <ellipse cx="248" cy="315" rx="12" ry="16" fill="#e89080" opacity=".12" className="pointer-events-none"/>

          {/* ── HAMSTRINGS ── */}
          <path d="M158 346 L182 342 L180 462 L148 462 Q146 402 158 346Z" fill="url(#brHam)" filter="url(#bs1)" className={mp('hamstrings')} data-m="hamstrings" data-h="Biceps femoris|Caput longum + breve" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M184 342 L210 338 L206 462 L182 462Z" fill="url(#brHamI)" filter="url(#bs1)" className={mp('hamstrings')} data-m="hamstrings" data-h="Semi (ten+mem)|Semitendinosus + Semimembranosus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="182" y1="345" x2="181" y2="458" stroke="#6a2820" strokeWidth=".8" opacity=".22" className="pointer-events-none"/>
          <path d="M282 346 L258 342 L260 462 L292 462 Q294 402 282 346Z" fill="url(#brHam)" filter="url(#bs1)" className={mp('hamstrings')} data-m="hamstrings" data-h="Biceps femoris|Caput longum + breve" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M256 342 L230 338 L234 462 L258 462Z" fill="url(#brHamI)" filter="url(#bs1)" className={mp('hamstrings')} data-m="hamstrings" data-h="Semi (ten+mem)|Semitendinosus + Semimembranosus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <line x1="258" y1="345" x2="259" y2="458" stroke="#6a2820" strokeWidth=".8" opacity=".22" className="pointer-events-none"/>

          {/* ── CALVES ── */}
          <path d="M164 468 Q160 492 160 520 Q160 545 162 562 L180 562 Q182 545 182 524 Q182 496 184 468Z" fill="url(#brCM)" filter="url(#bs2)" className={mp('calves')} data-m="calves" data-h="Gastroc medijalna|Caput mediale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M150 468 Q146 488 146 510 Q148 530 150 545 L162 545 Q162 526 162 508 Q162 488 164 468Z" fill="url(#brCL)" filter="url(#bs2)" className={mp('calves')} data-m="calves" data-h="Gastroc lateralna|Caput laterale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M150 548 Q148 572 148 600 L182 600 Q182 572 180 548Z" fill="url(#brSol)" className={mp('calves')} data-m="calves" data-h="Soleus|M. soleus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="166" cy="502" rx="9" ry="20" fill="#d88070" opacity=".18" className="pointer-events-none"/>
          <path d="M276 468 Q280 492 280 520 Q280 545 278 562 L260 562 Q258 545 258 524 Q258 496 256 468Z" fill="url(#brCM)" filter="url(#bs2)" className={mp('calves')} data-m="calves" data-h="Gastroc medijalna|Caput mediale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M290 468 Q294 488 294 510 Q292 530 290 545 L278 545 Q278 526 278 508 Q278 488 276 468Z" fill="url(#brCL)" filter="url(#bs2)" className={mp('calves')} data-m="calves" data-h="Gastroc lateralna|Caput laterale" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <path d="M290 548 Q292 572 292 600 L258 600 Q258 572 260 548Z" fill="url(#brSol)" className={mp('calves')} data-m="calves" data-h="Soleus|M. soleus" onMouseEnter={handleEnter} onMouseLeave={handleLeave} onClick={handleClick}/>
          <ellipse cx="274" cy="502" rx="9" ry="20" fill="#d88070" opacity=".18" className="pointer-events-none"/>
        </svg>
      )}

      {/* Side label */}
      <div className="text-center mt-1 text-[10px] text-fit-dim font-semibold tracking-wider">
        {isFront ? (t.body?.front || 'Prednja strana') : (t.body?.back || 'Stražnja strana')}
      </div>
    </div>
  );
}
