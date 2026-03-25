'use client';

interface BarProps {
  pct: number;
  color: string;
  h?: number;
}

export default function Bar({ pct, color, h = 6 }: BarProps) {
  return (
    <div className="w-full rounded-full bg-white/[0.06]" style={{ height: h }}>
      <div
        className="h-full rounded-full transition-[width] duration-[800ms] ease-out"
        style={{ width: `${Math.min(100, pct)}%`, background: color }}
      />
    </div>
  );
}
