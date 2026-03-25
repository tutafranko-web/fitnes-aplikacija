'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore, useT } from '@/hooks/useLocale';
import BottomTabBar from '@/components/layout/BottomTabBar';
import HomeTab from '@/components/home/HomeTab';
import TrainerTab from '@/components/trainer/TrainerTab';
import BodyTab from '@/components/body/BodyTab';
import NutritionTab from '@/components/nutrition/NutritionTab';
import TrainingTab from '@/components/training/TrainingTab';
import SocialTab from '@/components/social/SocialTab';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const tabColors: Record<string, string> = {
  home: '#00f0b5',
  trainer: '#3ea8ff',
  body: '#7c5cfc',
  nutrition: '#ffc233',
  training: '#ff6b4a',
  social: '#ff4d8d',
};

export default function App() {
  const [tab, setTab] = useState('home');
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const { locale, setLocale } = useLocaleStore();

  // Check if user completed onboarding
  useEffect(() => {
    const done = localStorage.getItem('fit-onboarded');
    setOnboarded(done === 'true');
  }, []);

  const handleOnboardingComplete = (profile: any) => {
    localStorage.setItem('fit-onboarded', 'true');
    localStorage.setItem('fit-profile', JSON.stringify(profile));
    setOnboarded(true);
  };

  // Loading state
  if (onboarded === null) {
    return (
      <div className="min-h-screen bg-fit-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">💪</div>
          <div className="text-xl font-black text-fit-accent">FIT</div>
        </div>
      </div>
    );
  }

  // Onboarding
  if (!onboarded) {
    return (
      <div className="font-outfit">
        {/* Language toggle during onboarding */}
        <div className="fixed top-4 right-4 z-50">
          <button
            onClick={() => setLocale(locale === 'hr' ? 'en' : 'hr')}
            className="text-[10px] font-bold px-3 py-1 rounded-full border border-fit-border text-fit-muted hover:text-fit-accent transition-colors bg-fit-bg/80 backdrop-blur-sm"
          >
            {locale === 'hr' ? '🇬🇧 EN' : '🇭🇷 HR'}
          </button>
        </div>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fit-bg max-w-[430px] mx-auto relative pb-20">
      {/* Ambient glow */}
      <div
        className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${tabColors[tab]}08, transparent 70%)` }}
      />

      {/* Top bar */}
      <div className="relative z-10 flex justify-between items-center px-4 pt-3">
        <div className="text-lg font-black text-fit-accent">FIT</div>
        <div className="flex gap-2 items-center">
          <button
            onClick={() => setLocale(locale === 'hr' ? 'en' : 'hr')}
            className="text-[10px] font-bold px-3 py-1 rounded-full border border-fit-border text-fit-muted hover:text-fit-accent transition-colors"
          >
            {locale === 'hr' ? '🇬🇧 EN' : '🇭🇷 HR'}
          </button>
          <button
            onClick={() => { localStorage.removeItem('fit-onboarded'); setOnboarded(false); }}
            className="text-[10px] font-bold px-3 py-1 rounded-full border border-fit-border text-fit-muted hover:text-fit-warn transition-colors"
            title="Reset onboarding"
          >
            ⚙️
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-[1] px-3.5 pb-4">
        {tab === 'home' && <HomeTab />}
        {tab === 'trainer' && <TrainerTab />}
        {tab === 'body' && <BodyTab />}
        {tab === 'nutrition' && <NutritionTab />}
        {tab === 'training' && <TrainingTab />}
        {tab === 'social' && <SocialTab />}
      </div>

      <BottomTabBar activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
