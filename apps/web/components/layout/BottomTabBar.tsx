'use client';

import { useT } from '@/hooks/useLocale';

const tabs = [
  { id: 'home', icon: '⚡' },
  { id: 'trainer', icon: '🤖' },
  { id: 'nutrition', icon: '🍽️' },
  { id: 'training', icon: '🏋️' },
  { id: 'body', icon: '🫀' },
  { id: 'social', icon: '👥' },
] as const;

const tabColorMap: Record<string, string> = {
  home: '#00f0b5',
  trainer: '#3ea8ff',
  nutrition: '#ffc233',
  training: '#ff6b4a',
  body: '#7c5cfc',
  social: '#ff4d8d',
};

interface Props {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export default function BottomTabBar({ activeTab, onTabChange }: Props) {
  const t = useT();
  const tabLabels: Record<string, string> = {
    home: t.tabs.home,
    trainer: t.tabs.trainer,
    nutrition: t.tabs.nutrition,
    training: t.tabs.training,
    body: t.tabs.body,
    social: t.tabs.social,
  };

  return (
    <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[430px] bg-[rgba(6,8,16,0.94)] backdrop-blur-[30px] border-t border-fit-border flex justify-around py-1.5 pb-[18px] z-10">
      {tabs.map((tab) => {
        const active = activeTab === tab.id;
        const color = tabColorMap[tab.id];
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="bg-transparent border-none cursor-pointer flex flex-col items-center gap-0 transition-all duration-300 min-w-0 px-0.5"
            style={{
              opacity: active ? 1 : 0.4,
              transform: active ? 'scale(1.08) translateY(-2px)' : 'scale(1)',
            }}
          >
            <span className="text-[18px]">{tab.icon}</span>
            <span
              className="text-[8px] font-extrabold font-outfit truncate max-w-[50px]"
              style={{ color: active ? color : '#8b8fa3' }}
            >
              {tabLabels[tab.id]}
            </span>
            {active && (
              <div
                className="w-1 h-1 rounded-full mt-0.5"
                style={{ background: color, boxShadow: `0 0 6px ${color}` }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
