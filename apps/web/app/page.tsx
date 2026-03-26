'use client';

import { useState, useEffect } from 'react';
import { useLocaleStore } from '@/hooks/useLocale';
import BottomTabBar from '@/components/layout/BottomTabBar';
import HomeTab from '@/components/home/HomeTab';
import TrainerTab from '@/components/trainer/TrainerTab';
import BodyTab from '@/components/body/BodyTab';
import NutritionTab from '@/components/nutrition/NutritionTab';
import TrainingTab from '@/components/training/TrainingTab';
import SocialTab from '@/components/social/SocialTab';
import SettingsTab from '@/components/settings/SettingsTab';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { requestPermission, registerServiceWorker, startReminders } from '@/lib/notifications';

const tabColors: Record<string, string> = {
  home: '#00f0b5',
  trainer: '#3ea8ff',
  body: '#7c5cfc',
  nutrition: '#ffc233',
  training: '#ff6b4a',
  social: '#ff4d8d',
  settings: '#8b8fa3',
};

export default function App() {
  const [tab, setTab] = useState('home');
  const [onboarded, setOnboarded] = useState<boolean | null>(null);
  const { locale, setLocale } = useLocaleStore();

  useEffect(() => {
    // Version check — force re-onboarding when app updates significantly
    const APP_VERSION = 'v3';
    const storedVersion = localStorage.getItem('fit-version');
    if (storedVersion !== APP_VERSION) {
      localStorage.removeItem('fit-onboarded');
      localStorage.removeItem('fit-profile');
      localStorage.setItem('fit-version', APP_VERSION);
      setOnboarded(false);
      return;
    }
    setOnboarded(localStorage.getItem('fit-onboarded') === 'true');
  }, []);

  // Init notifications
  useEffect(() => {
    if (onboarded) {
      registerServiceWorker();
      requestPermission().then((granted) => {
        if (granted) startReminders(locale as 'hr' | 'en');
      });
    }
  }, [onboarded, locale]);

  const handleOnboardingComplete = (profile: any) => {
    localStorage.setItem('fit-onboarded', 'true');
    localStorage.setItem('fit-profile', JSON.stringify(profile));
    setOnboarded(true);
  };

  const resetOnboarding = () => {
    localStorage.removeItem('fit-onboarded');
    localStorage.removeItem('fit-profile');
    setOnboarded(false);
  };

  if (onboarded === null) {
    return (
      <div className="min-h-screen bg-fit-bg flex items-center justify-center">
        <div className="text-center animate-[fadeIn_0.5s_ease]">
          <div className="text-5xl mb-4">💪</div>
          <div className="text-xl font-black text-fit-accent">FIT</div>
        </div>
      </div>
    );
  }

  if (!onboarded) {
    return (
      <div className="font-outfit">
        <div className="fixed top-4 right-4 z-50">
          <button onClick={() => setLocale(locale === 'hr' ? 'en' : 'hr')}
            className="text-[10px] font-bold px-3 py-1 rounded-full border border-fit-border text-fit-muted hover:text-fit-accent transition-colors bg-fit-bg/80 backdrop-blur-sm">
            {locale === 'hr' ? '🇬🇧 EN' : '🇭🇷 HR'}
          </button>
        </div>
        <OnboardingFlow onComplete={handleOnboardingComplete} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-fit-bg max-w-[430px] mx-auto relative pb-20">
      <div className="fixed top-[-120px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] rounded-full pointer-events-none z-0 transition-all duration-1000"
        style={{ background: `radial-gradient(circle, ${tabColors[tab]}08, transparent 70%)` }} />

      <div className="relative z-10 flex justify-between items-center px-4 pt-3">
        <div className="text-lg font-black text-fit-accent">FIT</div>
        <button onClick={() => setLocale(locale === 'hr' ? 'en' : 'hr')}
          className="text-[10px] font-bold px-3 py-1 rounded-full border border-fit-border text-fit-muted hover:text-fit-accent transition-colors">
          {locale === 'hr' ? '🇬🇧 EN' : '🇭🇷 HR'}
        </button>
      </div>

      {/* Keep ALL tabs mounted so state persists across switches */}
      <div className="relative z-[1] px-3.5 pb-4">
        <div style={{ display: tab === 'home' ? 'block' : 'none' }}><HomeTab /></div>
        <div style={{ display: tab === 'trainer' ? 'block' : 'none' }}><TrainerTab /></div>
        <div style={{ display: tab === 'body' ? 'block' : 'none' }}><BodyTab /></div>
        <div style={{ display: tab === 'nutrition' ? 'block' : 'none' }}><NutritionTab /></div>
        <div style={{ display: tab === 'training' ? 'block' : 'none' }}><TrainingTab /></div>
        <div style={{ display: tab === 'social' ? 'block' : 'none' }}><SocialTab /></div>
        <div style={{ display: tab === 'settings' ? 'block' : 'none' }}><SettingsTab onResetOnboarding={resetOnboarding} /></div>
      </div>

      <BottomTabBar activeTab={tab} onTabChange={setTab} />
    </div>
  );
}
