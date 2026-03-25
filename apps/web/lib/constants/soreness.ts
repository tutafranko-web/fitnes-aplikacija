export const sorenessLevels = [
  { level: 0, color: '#00f0b5', label: { hr: 'Odmoren ✅', en: 'Rested ✅' } },
  { level: 1, color: '#3ea8ff', label: { hr: 'Blago', en: 'Mild' } },
  { level: 2, color: '#ffc233', label: { hr: 'Umjereno ⚠️', en: 'Moderate ⚠️' } },
  { level: 3, color: '#ff6b4a', label: { hr: 'Bolno 🔴', en: 'Painful 🔴' } },
  { level: 4, color: '#ff4d8d', label: { hr: 'Jako bolno 🆘', en: 'Very painful 🆘' } },
] as const;

export function getInflammationStyle(level: number) {
  switch (level) {
    case 0: return { fill: 'rgba(0,240,181,.06)', stroke: '#00f0b5', glow: 'none' };
    case 1: return { fill: 'rgba(62,168,255,.12)', stroke: '#3ea8ff', glow: 'none' };
    case 2: return { fill: 'rgba(255,194,51,.2)', stroke: '#ffc233', glow: '0 0 12px rgba(255,194,51,.3)' };
    case 3: return { fill: 'rgba(255,107,74,.3)', stroke: '#ff6b4a', glow: '0 0 18px rgba(255,107,74,.4)' };
    default: return { fill: 'rgba(255,77,141,.4)', stroke: '#ff4d8d', glow: '0 0 25px rgba(255,77,141,.5)' };
  }
}

export const defaultSoreness: Record<string, number> = {
  neck: 0, shoulders: 0, chest: 0, biceps: 0, forearms: 0,
  triceps: 0, core: 0, quads: 0, hamstrings: 0, glutes: 0,
  calves: 0, back: 0, traps: 0,
};
