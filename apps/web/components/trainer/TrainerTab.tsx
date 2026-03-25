'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useT } from '@/hooks/useLocale';
import { useLocaleStore } from '@/hooks/useLocale';
import { useVoice } from '@/hooks/useVoice';
import Box from '@/components/ui/Box';
import { trainers, type Trainer } from '@/lib/constants/trainers';
import TrainerAvatar from './TrainerAvatar';

export default function TrainerTab() {
  const t = useT();
  const locale = useLocaleStore((s) => s.locale);
  const hr = locale === 'hr';
  const [trainer, setTrainer] = useState<Trainer | null>(null);
  const [profile, setProfile] = useState<any>(null);
  const [msgs, setMsgs] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const [mode, setMode] = useState<'chat' | 'voice'>('chat');
  const [avatarMood, setAvatarMood] = useState<'idle' | 'talking' | 'thinking' | 'excited' | 'listening'>('idle');
  const chatRef = useRef<HTMLDivElement>(null);
  const voice = useVoice();

  // Load trainer and profile
  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('fit-profile') || '{}');
      setProfile(p);
      if (p.trainerId) {
        const tr = trainers.find((t) => t.id === p.trainerId);
        if (tr) {
          setTrainer(tr);
          setMsgs([{ role: 'ai', text: hr ? tr.greeting.hr : tr.greeting.en }]);
        }
      }
    } catch {}
    if (msgs.length === 0) {
      setMsgs([{ role: 'ai', text: t.trainer.greeting }]);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update avatar mood
  useEffect(() => {
    if (typing) setAvatarMood('thinking');
    else if (voice.speaking) setAvatarMood('talking');
    else if (voice.listening) setAvatarMood('listening');
    else setAvatarMood('idle');
  }, [typing, voice.speaking, voice.listening]);

  const handleSend = useCallback(async (text: string) => {
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
          history: msgs.slice(-15),
          locale,
          userContext: profile,
          trainerPrompt: trainer ? (hr ? trainer.systemPrompt.hr : trainer.systemPrompt.en) : null,
        }),
      });

      if (!res.ok) throw new Error('API error');
      const data = await res.json();
      setTyping(false);
      setAvatarMood('excited');
      setMsgs((p) => [...p, { role: 'ai', text: data.text }]);
      if (mode === 'voice') voice.speak(data.text);
      setTimeout(() => setAvatarMood('idle'), 3000);
    } catch (err) {
      setTyping(false);
      setAvatarMood('idle');
      // Fallback local response
      const fallback = hr
        ? 'Tu sam za tebe! 💪 Pitaj me za trening, prehranu ili oporavak.'
        : "I'm here for you! 💪 Ask me about training, nutrition or recovery.";
      setMsgs((p) => [...p, { role: 'ai', text: fallback }]);
    }
  }, [msgs, locale, profile, trainer, hr, mode, voice]);

  // Auto-send on voice end
  useEffect(() => {
    if (!voice.listening && voice.transcript && mode === 'voice') {
      handleSend(voice.transcript);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [voice.listening]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [msgs, typing]);

  const trainerColor = trainer?.color || '#00f0b5';

  return (
    <div className="flex flex-col gap-3">
      {/* Trainer Avatar — Full Body */}
      {trainer && (
        <Box glow={trainerColor} className="!py-2">
          <div className="flex items-center gap-3">
            <div className="w-28 shrink-0">
              <TrainerAvatar trainerId={trainer.id} mood={avatarMood} size={112} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold" style={{ color: trainerColor }}>{trainer.name}</div>
              <div className="text-[10px] text-fit-dim">{trainer.city}</div>
              <div className="text-[10px] text-fit-muted mt-0.5">{trainer.specialty.slice(0, 3).join(' · ')}</div>
              <div className="text-[9px] text-fit-dim italic mt-1.5 border-l-2 pl-2 leading-relaxed" style={{ borderColor: `${trainerColor}44` }}>
                &ldquo;{(hr ? trainer.quote.hr : trainer.quote.en).substring(0, 80)}&rdquo;
              </div>
              <div className="text-[8px] mt-1" style={{ color: trainerColor }}>
                {avatarMood === 'thinking' ? (hr ? '🤔 Razmišlja...' : '🤔 Thinking...') :
                 avatarMood === 'talking' ? (hr ? '🗣️ Govori...' : '🗣️ Speaking...') :
                 avatarMood === 'listening' ? (hr ? '👂 Sluša...' : '👂 Listening...') :
                 avatarMood === 'excited' ? (hr ? '💪 Spreman!' : '💪 Ready!') : ''}
              </div>
            </div>
          </div>
        </Box>
      )}

      {/* Mode Toggle */}
      <div className="flex justify-center gap-2">
        {(['chat', 'voice'] as const).map((m) => {
          const active = mode === m;
          const color = m === 'chat' ? '#00f0b5' : '#7c5cfc';
          return (
            <button key={m} onClick={() => { setMode(m); if (m === 'chat') voice.stopSpeaking(); }}
              className="rounded-[14px] py-2 px-5 text-xs font-extrabold cursor-pointer font-outfit border transition-colors"
              style={{ background: active ? `${color}20` : 'rgba(255,255,255,0.04)', borderColor: active ? `${color}55` : 'rgba(255,255,255,0.06)', color: active ? color : '#8b8fa3' }}>
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
              <div className="text-sm text-fit-warn font-bold mb-2">⚠️ {t.trainer.voice}</div>
              <div className="text-xs text-fit-muted leading-relaxed">
                {t.trainer.voiceUnsupported} <b className="text-fit-accent">{t.trainer.useChromeOrEdge}</b>
              </div>
            </div>
          ) : (
            <>
              <div onClick={voice.listening ? voice.stopListening : voice.startListening}
                className="w-[90px] h-[90px] rounded-full mx-auto my-2.5 flex items-center justify-center cursor-pointer transition-all duration-300"
                style={{
                  background: voice.listening ? 'linear-gradient(135deg,#7c5cfc,#ff4d8d)' : voice.speaking ? 'linear-gradient(135deg,#00f0b5,#3ea8ff)' : '#7c5cfc20',
                  border: `3px solid ${voice.listening ? '#7c5cfc' : voice.speaking ? '#00f0b5' : 'rgba(255,255,255,0.06)'}`,
                  boxShadow: voice.listening ? '0 0 40px #7c5cfc44' : voice.speaking ? '0 0 40px #00f0b544' : 'none',
                }}>
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
                <button onClick={voice.stopSpeaking} className="mt-2.5 rounded-[10px] py-1.5 px-4 text-[11px] font-bold cursor-pointer font-outfit border"
                  style={{ background: '#ff6b4a20', borderColor: '#ff6b4a44', color: '#ff6b4a' }}>
                  ⏹ {t.trainer.stop}
                </button>
              )}
            </>
          )}
        </Box>
      )}

      {/* Chat Messages */}
      <div ref={chatRef} className="flex flex-col gap-2 bg-fit-card rounded-[22px] p-3 border border-fit-border overflow-auto" style={{ maxHeight: mode === 'voice' ? 180 : 360, minHeight: 120 }}>
        {msgs.map((m, i) => (
          <div key={i} className="flex gap-1.5" style={{ flexDirection: m.role === 'user' ? 'row-reverse' : 'row', alignSelf: m.role === 'user' ? 'flex-end' : 'flex-start', maxWidth: '90%' }}>
            {m.role === 'ai' && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-1"
                style={{ background: `${trainerColor}20`, border: `1px solid ${trainerColor}33` }}>
                {trainer?.emoji || '🤖'}
              </div>
            )}
            {m.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-fit-accent/20 flex items-center justify-center text-xs shrink-0 mt-1">👤</div>
            )}
            <div className="py-2.5 px-3 rounded-[16px] text-xs leading-relaxed whitespace-pre-wrap"
              style={{
                background: m.role === 'user' ? `linear-gradient(135deg, ${trainerColor}, ${trainerColor}aa)` : 'rgba(255,255,255,0.05)',
                color: m.role === 'user' ? '#000' : '#e8eaf0',
                fontWeight: m.role === 'user' ? 700 : 400,
                borderBottomRightRadius: m.role === 'user' ? 4 : 16,
                borderBottomLeftRadius: m.role === 'ai' ? 4 : 16,
              }}>
              {m.text}
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-1.5 self-start">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs"
              style={{ background: `${trainerColor}20` }}>
              {trainer?.emoji || '🤖'}
            </div>
            <div className="py-2.5 px-4 rounded-[16px] bg-white/[0.05] flex gap-1">
              {[0, 1, 2].map((i) => (
                <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ background: trainerColor, animation: `pulse3 1s ${i * 0.2}s infinite` }} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Quick Suggestions */}
      <div className="flex flex-wrap gap-[5px]">
        {(t.trainer.suggestions as string[]).map((s) => (
          <button key={s} onClick={() => handleSend(s)}
            className="bg-white/[0.04] border border-fit-border rounded-2xl py-[5px] px-3 text-fit-muted text-[10px] font-bold cursor-pointer font-outfit hover:text-fit-accent transition-colors">
            {s}
          </button>
        ))}
      </div>

      {/* Input */}
      <div className="flex gap-2">
        <input value={input} onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend(input)}
          placeholder={t.trainer.placeholder}
          className="flex-1 bg-white/[0.04] border border-fit-border rounded-2xl py-3 px-4 text-fit-text text-[13px] outline-none font-outfit focus:border-fit-accent/30 transition-colors" />
        <button onClick={() => handleSend(input)}
          className="rounded-2xl px-5 cursor-pointer font-black text-lg text-black border-none"
          style={{ background: `linear-gradient(135deg, ${trainerColor}, ${trainerColor}aa)` }}>→</button>
      </div>
    </div>
  );
}
