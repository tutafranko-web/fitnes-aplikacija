'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useLocaleStore } from './useLocale';

export function useVoice() {
  const [listening, setListening] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(false);
  const [wave, setWave] = useState<number[]>(Array(24).fill(3));
  const recRef = useRef<any>(null);
  const locale = useLocaleStore((s) => s.locale);

  useEffect(() => {
    const w = window as any;
    const SR = typeof window !== 'undefined'
      ? (w.SpeechRecognition || w.webkitSpeechRecognition)
      : null;
    setSupported(!!SR);
  }, []);

  useEffect(() => {
    if (listening) {
      const iv = setInterval(
        () => setWave(Array(24).fill(0).map(() => 3 + Math.random() * 22)),
        80
      );
      return () => clearInterval(iv);
    }
    setWave(Array(24).fill(3));
  }, [listening]);

  const startListening = useCallback(() => {
    const w = window as any;
    const SR = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!SR) return null;
    const rec = new SR();
    rec.lang = locale === 'hr' ? 'hr-HR' : 'en-US';
    rec.continuous = false;
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    let finalT = '';
    rec.onresult = (e: any) => {
      let interim = '';
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) finalT += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      setTranscript(finalT || interim);
    };
    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    recRef.current = rec;
    rec.start();
    setListening(true);
    setTranscript('');
    return () => rec.stop();
  }, [locale]);

  const stopListening = useCallback(() => {
    if (recRef.current) recRef.current.stop();
    setListening(false);
  }, []);

  const speak = useCallback((text: string) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();
    const clean = text.replace(/[🏋️🔥📹🌅🫐🍗🍌🐟🧘💚💪✅⚠️🔸📊•\n]/g, ' ').substring(0, 300);
    const u = new SpeechSynthesisUtterance(clean);
    u.lang = locale === 'hr' ? 'hr-HR' : 'en-US';
    u.rate = 1;
    u.pitch = 1;
    const voices = window.speechSynthesis.getVoices();
    const langPrefix = locale === 'hr' ? 'hr' : 'en';
    const voice = voices.find((v) => v.lang.startsWith(langPrefix)) || voices[0];
    if (voice) u.voice = voice;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }, [locale]);

  const stopSpeaking = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  return { listening, speaking, transcript, supported, wave, startListening, stopListening, speak, stopSpeaking };
}
