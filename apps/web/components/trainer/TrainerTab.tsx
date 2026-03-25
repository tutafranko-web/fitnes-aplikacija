'use client';

import { useState, useEffect, useRef } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { useVoice } from '@/hooks/useVoice';
import Box from '@/components/ui/Box';
import { trainers, type Trainer } from '@/lib/constants/trainers';

export default function TrainerTab() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Load trainer
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fit-profile') || '{}');
      setProfile(p);
      if (p.trainerId) {
        const tr = trainers.find((t) => t.id === p.trainerId);
        setTrainer(tr || null);
      }
    } catch {}
  }, []);

  const trainerGreeting = trainer
    ? (locale === 'hr' ? trainer.greeting.hr : trainer.greeting.en)
    : t.trainer.greeting;

  const [msgs, setMsgs] = useState<{ role: string; text: string }[]>([]);

  useEffect(() => {
    if (trainerGreeting) setMsgs([{ role: 'ai', text: trainerGreeting }]);
  }, [trainerGreeting]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const chatRef = useRef<HTMLDivElement>(null);
  const voice = useVoice();

  const handleSend = async (text: string) => {
    if (!text?.trim()) return;
    const userMsg = { role: 'user', text };
    setMsgs((p) => [...p, userMsg]);
    setInput('');
    setTyping(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: text,
          history: [...msgs, userMsg],
          locale,
          userContext: profile,
          trainerPrompt: trainer ? (locale === 'hr' ? trainer.systemPrompt.hr : trainer.systemPrompt.en) : null,
        }),
      });
      const data = await res.json();
      setTyping(false);
      setMsgs((p) => [...p, { role: 'ai', text: data.text }]);
      if (mode === 'voice') voice.speak(data.text);
    } catch {
      setTyping(false);
      setMsgs((p) => [...p, {
        role: 'ai',
        text: locale === 'hr' ? 'Ups, greška. Pokušaj ponovno.' : 'Oops, error. Try again.',
      }]);
    }
  };

  // Auto-send when voice recognition ends
  useEffect(() => {
    if (!voice.listening && voice.transcript && mode === 'voice') {
      handleSend(voice.transcript);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.listening]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  return (
    <div className="flex flex-col gap-3">
      {/* Trainer Header */}
      {trainer && (
        <Box glow={trainer.color} className="flex items-center gap-3 !py-3">
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
            style={{ background: `${trainer.color}15`, border: `2px solid ${trainer.color}44` }}>
            {trainer.emoji}
          </div>
          <div className="flex-1">
            <div className="text-sm font-bold" style={{ color: trainer.color }}>{trainer.name}</div>
            <div className="text-[10px] text-fit-muted">{locale === 'hr' ? trainer.specialty.hr : trainer.specialty.en}</div>
          </div>
        </Box>
      )}

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        {(['chat', 'voice'] as const).map((m) => {
          const active = mode === m;
          const color = m === 'chat' ? '#00f0b5' : '#7c5cfc';
          return (
            <button
              key={m}
              onClick={() => { setMode(m); if (m === 'chat') voice.stopSpeaking(); }}
              className="rounded-[14px] py-2 px-5 text-xs font-extrabold cursor-pointer font-outfit border transition-colors"
              style={{
                background: active ? `${color}20` : 'rgba(255,255,255,0.04)',
                borderColor: active ? `${color}55` : 'rgba(255,255,255,0.06)',
                color: active ? color : '#8b8fa3',
              }}
            >
              {m === 'chat' ? `💬 ${t.trainer.chat}` : `🎤 ${t.trainer.voice}`}
            </button>
          );
        })}
      </div>

      {/* Voice Interface */}
      {mode === 'voice' && (
        <Box glow={voice.listening ? '#7c5cfc' : voice.speaking ? '#00f0b5' : undefined} className="text-center">
          {!voice.supported ? (
            <div className="p-5">
              <div className="text-sm text-fit-warn font-bold mb-2">⚠️ {t.trainer.title}</div>
              <div className="text-xs text-fit-muted leading-relaxed">
                {t.trainer.voiceUnsupported} <b className="text-fit-accent">{t.trainer.useChromeOrEdge}</b>
              </div>
            </div>
          ) : (
            <>
              <div
                onClick={voice.listening ? voice.stopListening : voice.startListening}
                className="w-[90px] h-[90px] rounded-full mx-auto my-2.5 flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  background: voice.listening ? 'linear-gradient(135deg,#7c5cfc,#ff4d8d)' : voice.speaking ? 'linear-gradient(135deg,#00f0b5,#3ea8ff)' : '#7c5cfc20',
                  border: `3px solid ${voice.listening ? '#7c5cfc' : voice.speaking ? '#00f0b5' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: voice.listening ? '0 0 40px #7c5cfc44' : voice.speaking ? '0 0 40px #00f0b544' : 'none',
                }}
              >
                <span className="text-4xl">{voice.listening ? '🎙️' : voice.speaking ? '🔊' : '🎤'}</span>
              </div>
              <div className="flex justify-center gap-0.5 h-[30px] items-center my-2.5">
                {voice.wave.map((h, i) => (
                  <div key={i} className="w-[3px] rounded-sm transition-[height] duration-[80ms]"
                    style={{ height: voice.listening || voice.speaking ? h : 3, background: voice.listening ? '#7c5cfc' : voice.speaking ? '#00f0b5' : '#4a4e62' }} />
                ))}
              </div>
              <div className="text-sm font-bold" style={{ color: voice.listening ? '#7c5cfc' : voice.speaking ? '#00f0b5' : '#8b8fa3' }}>
                {voice.listening ? `🎙️ ${t.trainer.listening}` : voice.speaking ? `🔊 ${t.trainer.speaking}` : t.trainer.tapToTalk}
              </div>
              {voice.transcript && (
                <div className="mt-2.5 py-2.5 px-4 rounded-[14px] bg-white/[0.04] border border-fit-border">
                  <div className="text-[10px] text-fit-dim mb-1">{t.trainer.recognized}</div>
                  <div className="text-[13px] text-fit-text font-semibold">&ldquo;{voice.transcript}&rdquo;</div>
                </div>
              )}
              {voice.speaking && (
                <button onClick={voice.stopSpeaking} className="mt-2.5 rounded-[10px] py-1.5 px-4 text-[11px] font-bold cursor-pointer font-outfit border" style={{ background: '#ff6b4a20', borderColor: '#ff6b4a44', color: '#ff6b4a' }}>
                  ⏹ {t.trainer.stop}
                </button>
              )}
            </>
          )}
        </Box>
      )}

      {/* Chat Messages */}
      <Box ref={chatRef} className="flex flex-col gap-2 overflow-auto" style={{ maxHeight: mode === 'voice' ? 180 : 340 }}>
        {msgs.map((m, i) => (
          <div key={i} className="flex gap-2" style={{ alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '88%', flexDirection: m.role === 'user' ? 'row-reverse' : 'row' }}>
            {/* Avatar */}
            {m.role === 'ai' && trainer && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0 mt-1"
                style={{ background: `${trainer.color}20`, border: `1.5px solid ${trainer.color}44` }}>
                {trainer.emoji}
              </div>
            )}
            {m.role === 'user' && (
              <div className="w-7 h-7 rounded-full bg-fit-accent/20 flex items-center justify-center text-sm shrink-0 mt-1">👤</div>
            )}
            <div className="py-2.5 px-3.5 rounded-[18px] text-xs leading-relaxed whitespace-pre-wrap"
              style={{
                background: m.role === 'user' ? 'linear-gradient(135deg,#00f0b5,#3ea8ff)' : 'rgba(255,255,255,0.05)',
                color: m.role === 'user' ? '#000' : '#e8eaf0',
                fontWeight: m.role === 'user' ? 700 : 400,
                borderBottomRightRadius: m.role === 'user' ? 4 : 18,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 18,
              }}
            >{m.text}</div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 self-start">
            {trainer && (
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-sm shrink-0"
                style={{ background: `${trainer.color}20`, border: `1.5px solid ${trainer.color}44` }}>
                {trainer.emoji}
              </div>
            )}
            <div className="py-2.5 px-[18px] rounded-[18px] bg-white/[0.05] flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full bg-fit-accent" style={{ animation: `pulse3 1s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </Box>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-[5px]">
        {t.trainer.suggestions.map((s) => (
          <button key={s} onClick={() => handleSend(s)}
            className="bg-white/[0.04] border border-fit-border rounded-2xl py-[5px] px-3 text-fit-muted text-[10px] font-bold cursor-pointer font-outfit hover:text-fit-accent transition-colors">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={t.trainer.placeholder}
          className="flex-1 bg-white/[0.04] border border-fit-border rounded-2xl py-3 px-4 text-fit-text text-[13px] outline-none font-outfit focus:border-fit-accent/30 transition-colors" />
        <button onClick={() => handleSend(input)}
          className="rounded-2xl px-5 cursor-pointer font-black text-lg text-black border-none"
          style={{ background: 'linear-gradient(135deg,#00f0b5,#3ea8ff)' }}>→</button>
      </div>
    </div>
  );
}
