'use client';

/**
 * Push notification system using Notification API + Service Worker
 */

export async function requestPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export async function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    try {
      await navigator.serviceWorker.register('/sw.js');
    } catch (err) {
      console.error('SW registration failed:', err);
    }
  }
}

export function sendLocalNotification(title: string, body: string, tag?: string) {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;
  new Notification(title, {
    body,
    icon: '/icons/icon-192.png',
    tag: tag || 'fit-' + Date.now(),
    silent: false,
  });
}

// Schedule recurring reminders
let waterInterval: NodeJS.Timeout | null = null;
let stretchInterval: NodeJS.Timeout | null = null;
let eyeInterval: NodeJS.Timeout | null = null;

export function startReminders(locale: 'hr' | 'en') {
  const hr = locale === 'hr';
  stopReminders();

  // Water every 2 hours
  waterInterval = setInterval(() => {
    sendLocalNotification(
      'FIT 💧',
      hr ? 'Popij čašu vode! Hidratacija je ključ uspjeha.' : 'Drink a glass of water! Hydration is key.',
      'water-reminder'
    );
  }, 2 * 60 * 60 * 1000);

  // Stretch every 45 min
  stretchInterval = setInterval(() => {
    sendLocalNotification(
      'FIT 🧘',
      hr ? 'Ustani i rastegni se! Tvoje tijelo ti je zahvalno.' : 'Stand up and stretch! Your body thanks you.',
      'stretch-reminder'
    );
  }, 45 * 60 * 1000);

  // Eye rest every 60 min
  eyeInterval = setInterval(() => {
    sendLocalNotification(
      'FIT 👀',
      hr ? 'Odmori oči 20 sekundi — pogledaj u daljinu.' : 'Rest your eyes 20 seconds — look into the distance.',
      'eye-reminder'
    );
  }, 60 * 60 * 1000);
}

export function stopReminders() {
  if (waterInterval) clearInterval(waterInterval);
  if (stretchInterval) clearInterval(stretchInterval);
  if (eyeInterval) clearInterval(eyeInterval);
}
