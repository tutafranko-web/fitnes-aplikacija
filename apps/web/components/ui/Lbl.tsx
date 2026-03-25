'use client';

interface LblProps {
  icon: string;
  text: string;
  color?: string;
}

export default function Lbl({ icon, text, color }: LblProps) {
  return (
    <div className="flex items-center gap-2 mb-0.5">
      <span className="text-sm">{icon}</span>
      <span
        className="text-[11px] font-extrabold tracking-[2px] uppercase"
        style={{ color: color || '#8b8fa3' }}
      >
        {text}
      </span>
    </div>
  );
}
