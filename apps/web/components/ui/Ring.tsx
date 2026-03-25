'use client';

interface RingProps {
  pct: number;
  r: number;
  sw: number;
  color: string;
  label?: string;
  val: string;
  sub?: string;
}

export default function Ring({ pct, r, sw, color, label, val, sub }: RingProps) {
  const c = 2 * Math.PI * r;
  const size = r * 2 + sw + 4;

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle
            cx={r + sw / 2 + 2} cy={r + sw / 2 + 2} r={r}
            fill="none" stroke={`${color}15`} strokeWidth={sw}
          />
          <circle
            cx={r + sw / 2 + 2} cy={r + sw / 2 + 2} r={r}
            fill="none" stroke={color} strokeWidth={sw}
            strokeDasharray={c}
            strokeDashoffset={c * (1 - Math.min(1, pct))}
            strokeLinecap="round"
            className="transition-[stroke-dashoffset] duration-[1200ms] ease-out"
            style={{ filter: `drop-shadow(0 0 8px ${color}55)` }}
          />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center">
          <div className="text-[15px] font-black" style={{ color }}>{val}</div>
          {sub && <div className="text-[9px] text-fit-dim">{sub}</div>}
        </div>
      </div>
      {label && <div className="text-[10px] text-fit-muted mt-1.5 font-semibold">{label}</div>}
    </div>
  );
}
